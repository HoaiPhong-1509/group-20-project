const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const userController = require('../controllers/userController');
const upload = require('../middleware/upload');
const { uploadAvatar } = require('../controllers/userController');

// GET /users -> admin only
router.get('/', auth, requireRole('admin'), userController.getUsers);

// POST /users -> admin only (khuyến nghị)
router.post('/', auth, requireRole('admin'), userController.createUser);

// DELETE /users/:id -> admin only
router.delete('/:id', auth, requireRole('admin'), userController.deleteUser);

// POST /users/me/avatar -> user authenticated
router.post('/me/avatar', auth, upload.single('avatar'), uploadAvatar);

module.exports = router;