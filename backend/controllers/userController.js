const User = require('../models/User');

// Danh sách người dùng (admin)
async function getUsers(_req, res) {
  try {
    const users = await User.find().select('-password -resetPasswordToken -resetPasswordExpires');
    res.json(users);
  } catch (e) { console.error(e); res.status(500).json({ message: 'Server error' }); }
}

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
    if (role) user.role = role;
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

// Cập nhật avatar (dùng middleware/upload để lưu file)
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
