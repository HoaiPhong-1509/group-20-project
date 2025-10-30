const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getMyProfile, updateMyProfile } = require('../controllers/userController');

router.get('/', auth, getMyProfile);
router.put('/', auth, updateMyProfile);

module.exports = router;