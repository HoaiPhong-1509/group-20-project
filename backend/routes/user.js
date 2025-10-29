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

// POST /users
router.post('/', userController.createUser);

module.exports = router;