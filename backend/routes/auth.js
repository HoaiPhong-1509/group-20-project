const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// KHÔNG đặt '/auth/signup' ở đây, chỉ '/signup'
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// test nhanh router có được mount chưa
router.get('/me', auth, (req, res) => {
  const { _id, name, email } = req.user;
  res.json({ _id, name, email });
});

module.exports = router;