const express = require('express');
const User = require('../models/User');

const router = express.Router();

// GET /users -> lấy tất cả user từ Mongo
router.get('/', async (_req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /users -> thêm user mới
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.create({ name, email });
    res.status(201).json(user);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;