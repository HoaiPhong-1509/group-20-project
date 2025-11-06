const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { forgotPassword, resetPassword } = require('../controllers/authController');

const router = express.Router();

// KHÔNG đặt '/auth/signup' ở đây, chỉ '/signup'
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// test nhanh router có được mount chưa
router.get('/me', auth, (req, res) => {
  const { _id, name, email, role } = req.user;
  res.json({ _id, name, email, role });
});

module.exports = router;