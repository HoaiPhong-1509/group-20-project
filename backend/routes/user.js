const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const userController = require('../controllers/userController');

// GET /users -> admin only
router.get('/', auth, requireRole('admin'), userController.getUsers);

// POST /users -> admin only (khuyến nghị)
router.post('/', auth, requireRole('admin'), userController.createUser);

// DELETE /users/:id -> admin only
router.delete('/:id', auth, requireRole('admin'), userController.deleteUser);

module.exports = router;