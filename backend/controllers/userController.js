// controllers/userController.js
// Mảng tạm lưu users trong bộ nhớ (không bền qua restart)
let users = [];
let nextId = 1;

// GET /users
exports.getUsers = (req, res) => {
  res.json(users);
};

// POST /users
exports.createUser = (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const user = { id: nextId++, name, email };
  users.push(user);
  res.status(201).json(user);
};

// (Tùy chọn) export để test nội bộ
exports._reset = () => {
  users = [];
  nextId = 1;
};