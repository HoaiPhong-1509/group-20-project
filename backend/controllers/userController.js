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

// (Tùy chọn) export để test nội bộ
exports._reset = () => {
  users = [];
  nextId = 1;
};