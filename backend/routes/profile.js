const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
<<<<<<< HEAD
const multer = require('multer');
// 🔴 Sửa: Dùng memoryStorage để upload file vào RAM (khớp với userController)
const upload = multer({ storage: multer.memoryStorage() });
const { getMyProfile, updateMyProfile, uploadAvatar } = require('../controllers/userController');

router.get('/', auth, getMyProfile);
router.put('/', auth, updateMyProfile);
router.post('/upload-avatar', auth, upload.single('avatar'), uploadAvatar);
=======
const upload = require('../middleware/upload');
const userController = require('../controllers/userController');

router.get('/', auth, userController.getProfile);
router.put('/', auth, userController.updateProfile);
router.post('/avatar', auth, upload.single('avatar'), userController.updateAvatar);
>>>>>>> 9459f33e (finish hd 4)

module.exports = router;
