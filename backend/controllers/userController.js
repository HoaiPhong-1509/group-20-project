// controllers/userController.js
const User = require('../models/User');

// ✅ GET /users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find(); // lấy tất cả user từ MongoDB
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ POST /users
exports.createUser = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  try {
    // tạo user mới và lưu vào MongoDB
    const newUser = new User({ name, email });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    // lỗi khi email trùng hoặc không hợp lệ
    res.status(400).json({ message: error.message });
  }
};
