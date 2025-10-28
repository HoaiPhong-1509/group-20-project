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
