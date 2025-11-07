const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/rbac');
const userController = require('../controllers/userController');
const upload = require('../middleware/upload');
const { uploadAvatar } = require('../controllers/userController');


router.get('/', auth, requireRole('admin'), userController.getUsers);
router.post('/', auth, requireRole('admin'), userController.createUser);
router.put('/:id', auth, requireRole('admin'), userController.updateUser);
router.delete('/:id', auth, requireRole('admin'), userController.deleteUser);

// POST /users/me/avatar -> user authenticated
router.post('/me/avatar', auth, upload.single('avatar'), uploadAvatar);

module.exports = router;