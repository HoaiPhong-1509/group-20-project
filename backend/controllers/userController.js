// controllers/userController.js
const User = require('../models/User');

exports.getUsers = async (_req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// PUT: sửa user 
exports.updateUser = (req, res) => { 
const { id } = req.params; 
const index = users.findIndex(u => u.id == id); 
if (index !== -1) { 
users[index] = { ...users[index], ...req.body }; 
res.json(users[index]); 
} else { 
res.status(404).json({ message: "User not found" }); 
} 
}; 
// DELETE: xóa user 
exports.deleteUser = (req, res) => { 
const { id } = req.params; 
users = users.filter(u => u.id != id); 
res.json({ message: "User deleted" }); 
};

exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Name is required' });
    const user = await User.create({
      name: name.trim(),
      ...(email ? { email: email.trim() } : {})
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const userId =
      req.user?.id ||
      req.user?._id ||
      req.userId ||
      (typeof req.user === 'string' ? req.user : undefined);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await require('../models/User')
      .findById(userId)
      .select('-password -__v');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateMyProfile = async (req, res) => {
  try {
    const userId =
      req.user?.id ||
      req.user?._id ||
      req.userId ||
      (typeof req.user === 'string' ? req.user : undefined);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const allowedFields = ['name', 'email']; // tùy schema của bạn
    const updates = {};
    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        updates[key] = req.body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    // Nếu cập nhật email, kiểm tra trùng
    if (updates.email) {
      const exists = await require('../models/User').findOne({
        email: updates.email,
        _id: { $ne: userId },
      });
      if (exists) {
        return res.status(409).json({ message: 'Email already in use' });
      }
    }

    const User = require('../models/User');
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
    // ví dụ lỗi Mongo duplicate key
    if (err?.code === 11000) {
      return res.status(409).json({ message: 'Duplicate value', error: err.keyValue });
    }
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};