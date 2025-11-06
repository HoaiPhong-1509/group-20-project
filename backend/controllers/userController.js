const User = require('../models/User');
const cloudinary = require('../services/cloudinary');
const multer = require('multer');

// ⚙️ Cấu hình multer để lưu file trong RAM
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * Lấy danh sách tất cả user (admin only)
 */
const getUsers = async (_req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Xóa user (admin only)
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: 'User id is required' });

    // tránh tự xóa chính mình
    if (req.user && String(req.user._id) === String(id)) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    return res.json({ message: 'User deleted' });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/**
 * Tạo user mới
 */
const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Name is required' });
    const user = await User.create({
      name: name.trim(),
      ...(email ? { email: email.trim() } : {}),
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Lấy thông tin profile cá nhân
 */
const getMyProfile = async (req, res) => {
  try {
    const userId =
      req.user?.id ||
      req.user?._id ||
      req.userId ||
      (typeof req.user === 'string' ? req.user : undefined);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId).select('-password -__v');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * Cập nhật profile người dùng
 */
const updateMyProfile = async (req, res) => {
  try {
    const userId =
      req.user?.id ||
      req.user?._id ||
      req.userId ||
      (typeof req.user === 'string' ? req.user : undefined);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const allowedFields = ['name', 'email'];
    const updates = {};
    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        updates[key] = req.body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    if (updates.email) {
      const exists = await User.findOne({
        email: updates.email,
        _id: { $ne: userId },
      });
      if (exists) {
        return res.status(409).json({ message: 'Email already in use' });
      }
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    Object.assign(user, updates);
    await user.save();

    const sanitized = user.toObject();
    delete sanitized.password;
    delete sanitized.__v;

    return res.json(sanitized);
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: 'Duplicate value', error: err.keyValue });
    }
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * Upload avatar lên Cloudinary
 */
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Avatar file is required.' });
    }

    const userId = req.user?.id || req.user?._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // 🟦 Upload ảnh bằng stream (do multer.memoryStorage)
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: process.env.CLOUDINARY_AVATAR_FOLDER || 'avatars',
          resource_type: 'image',
          overwrite: true,
        },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(req.file.buffer);
    });

    // 🗑 Xóa ảnh cũ trên Cloudinary (nếu có)
    if (user.avatarPublicId && user.avatarPublicId !== uploadResult.public_id) {
      cloudinary.uploader.destroy(user.avatarPublicId).catch((err) => {
        console.warn('⚠️ Failed to delete previous avatar:', err.message);
      });
    }

    // 🔄 Lưu link mới
    user.avatarUrl = uploadResult.secure_url;
    user.avatarPublicId = uploadResult.public_id;
    await user.save();

    return res.status(200).json({ avatarUrl: user.avatarUrl });
  } catch (error) {
    console.error('❌ Upload avatar error:', error);
    return next(error);
  }
};

module.exports = {
  upload,
  getUsers,
  deleteUser,
  createUser,
  getMyProfile,
  updateMyProfile,
  uploadAvatar,
};
