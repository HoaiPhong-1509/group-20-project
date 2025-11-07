const express = require('express');
<<<<<<< HEAD
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { forgotPassword, resetPassword } = require('../controllers/authController');

=======
>>>>>>> 9459f33e (finish hd 4)
const router = express.Router();
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', auth, authController.me);
router.post('/logout', authController.logout);
<<<<<<< HEAD
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// test nhanh router có được mount chưa
router.get('/me', auth, (req, res) => {
  const { _id, name, email, role } = req.user;
  res.json({ _id, name, email, role });
});
=======
router.post('/forgot', authController.forgotPassword);
router.post('/reset', authController.resetPassword);
>>>>>>> 9459f33e (finish hd 4)

module.exports = router;