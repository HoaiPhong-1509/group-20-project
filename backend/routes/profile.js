const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
// 🔴 Sửa: Dùng memoryStorage để upload file vào RAM (khớp với userController)
const upload = multer({ storage: multer.memoryStorage() });
const { getMyProfile, updateMyProfile, uploadAvatar } = require('../controllers/userController');

router.get('/', auth, getMyProfile);
router.put('/', auth, updateMyProfile);
router.post('/upload-avatar', auth, upload.single('avatar'), uploadAvatar);

module.exports = router;
