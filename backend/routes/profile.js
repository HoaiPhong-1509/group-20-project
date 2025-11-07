const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const userController = require('../controllers/userController');

router.get('/', auth, userController.getProfile);
router.put('/', auth, userController.updateProfile);
router.post('/avatar', auth, upload.single('avatar'), userController.updateAvatar);

module.exports = router;
