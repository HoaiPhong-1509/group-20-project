// routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /users
router.get('/', userController.getUsers);

// POST /users
router.post('/', userController.createUser);
router.put('/users/:id', userController.updateUser);   
router.delete('/users/:id', userController.deleteUser);
module.exports = router;