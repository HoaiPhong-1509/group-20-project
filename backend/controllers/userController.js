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
