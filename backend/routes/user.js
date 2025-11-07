const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/rbac');
const userController = require('../controllers/userController');

// Debug bindings (xem log nếu còn lỗi)
console.log('users route bindings:', {
  getUsers: typeof userController.getUsers,
  createUser: typeof userController.createUser,
  updateUser: typeof userController.updateUser,
  deleteUser: typeof userController.deleteUser,
});

router.get('/', auth, requireRole('admin'), userController.getUsers);
router.post('/', auth, requireRole('admin'), userController.createUser);
router.put('/:id', auth, requireRole('admin'), userController.updateUser);
router.delete('/:id', auth, requireRole('admin'), userController.deleteUser);

module.exports = router;