const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');
const userController = require('../Controllers/userController');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');


// تسجيل الدخول
router.post('/auth/login', adminController.login);

// تسجيل الخروج
router.post('/auth/logout', requireAuth, adminController.logout);

// مثال لراوت محمي بصلاحية أدمن
router.get('/dashboard', requireAuth, requireRole('admin'), (req, res) => {
  res.json({ message: 'Hello admin' });
});


router.get('/dashboard/stats', 
  requireAuth, 
  requireRole('admin'), 
  adminController.getDashboardStats
);

// endpoint محتاج تسجيل دخول فقط
// router.get('/profile', requireAuth, userController.getProfile);

// endpoint محتاج صلاحية أدمن
// router.get('/admin/stats', 
//   requireAuth, 
//   requireRole(['admin']), 
//   adminController.getStats
// );

// endpoint محتاج صلاحية أدمن أو مانجر
// router.get('/reports', 
//   requireAuth, 
//   requireRole(['admin', 'manager']), 
//   reportController.getReports
// );

// إدارة المستخدمين
router.get('/users', requireAuth, requireRole(['admin']), adminController.getAllUsers);
router.get('/users/:id', requireAuth, requireRole(['admin']), adminController.getUserById);
router.put('/users/:id', requireAuth, requireRole(['admin']), adminController.updateUser);
router.delete('/users/:id', requireAuth, requireRole(['admin']), adminController.deleteUser);

module.exports = router;