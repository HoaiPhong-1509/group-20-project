const User = require('../models/User');
const cloudinary = require('../services/cloudinary');
const multer = require('multer');

<<<<<<< HEAD
// ⚙️ Cấu hình multer để lưu file trong RAM
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * Lấy danh sách tất cả user (admin only)
 */
const getUsers = async (_req, res) => {
=======
// Danh sách người dùng (admin)
async function getUsers(_req, res) {
>>>>>>> 9459f33e (finish hd 4)
  try {
    const users = await User.find().select('-password -resetPasswordToken -resetPasswordExpires');
    res.json(users);
  } catch (e) { console.error(e); res.status(500).json({ message: 'Server error' }); }
}

<<<<<<< HEAD
/**
 * Xóa user (admin only)
 */
const deleteUser = async (req, res) => {
=======
// Tạo user (admin)
async function createUser(req, res) {
  try {
    const { name, email, password, role } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email exists' });
    const user = await User.create({ name, email, password, role: role || 'user' });
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Server error' }); }
}

// Cập nhật user theo id (admin)
async function updateUser(req, res) {
>>>>>>> 9459f33e (finish hd 4)
  try {
    const { id } = req.params;
    const { name, email, role } = req.body || {};
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (name) user.name = name;
    if (email && email !== user.email) {
      const exists = await User.findOne({ email, _id: { $ne: user._id } });
      if (exists) return res.status(409).json({ message: 'Email exists' });
      user.email = email;
    }
<<<<<<< HEAD

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
=======
    if (role) user.role = role;
>>>>>>> 9459f33e (finish hd 4)
    await user.save();
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Server error' }); }
}

// Xóa user (admin)
async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Server error' }); }
}

// Cập nhật avatar
async function updateAvatar(req, res) {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.avatarUrl = `/uploads/${req.file.filename}`;
    await user.save();
    res.json({ avatarUrl: user.avatarUrl });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Server error' }); }
}

// Lấy hồ sơ hiện tại
async function getProfile(req, res) {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
    const u = await User.findById(req.user.id).select('-password -resetPasswordToken -resetPasswordExpires');
    if (!u) return res.status(404).json({ message: 'User not found' });
    res.json({ id: u._id, name: u.name, email: u.email, role: u.role, avatarUrl: u.avatarUrl || '' });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Server error' }); }
}

// Cập nhật hồ sơ hiện tại
async function updateProfile(req, res) {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });
    const { name, email } = req.body || {};
    const u = await User.findById(req.user.id);
    if (!u) return res.status(404).json({ message: 'User not found' });
    if (name) u.name = name;
    if (email && email !== u.email) {
      const exists = await User.findOne({ email, _id: { $ne: u._id } });
      if (exists) return res.status(409).json({ message: 'Email already in use' });
      u.email = email;
    }
<<<<<<< HEAD
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
=======
    await u.save();
    res.json({ id: u._id, name: u.name, email: u.email, role: u.role, avatarUrl: u.avatarUrl || '' });
  } catch (e) { console.error(e); res.status(500).json({ message: 'Server error' }); }
}

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  updateAvatar,
  getProfile,
  updateProfile,
};
>>>>>>> 9459f33e (finish hd 4)
