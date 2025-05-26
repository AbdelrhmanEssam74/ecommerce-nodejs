const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../DB/db');

// تسجيل الدخول
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];
    
    if (!user || !['admin', 'manager'].includes(user.role)) {
      return res.status(401).json({ error: 'No access' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid login details' });
    
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

// تسجيل الخروج
exports.logout = (req, res) => {
  res.json({ message: 'Logged out' });
};


exports.getDashboardStats = async (req, res) => {
  try {
    // نجيب كل الإحصائيات مرة واحدة
    const [
      {count: usersCount},
      {count: productsCount},
      {count: ordersCount},
      recentOrders,
      salesData
    ] = await Promise.all([
      // عدد الزبائن
      pool.query('SELECT COUNT(*) as count FROM users WHERE role = "customer"')
        .then(([[result]]) => result),
      
      // عدد المنتجات
      pool.query('SELECT COUNT(*) as count FROM products')
        .then(([[result]]) => result),
      
      // عدد الطلبات
      pool.query('SELECT COUNT(*) as count FROM orders')
        .then(([[result]]) => result),
      
      // أحدث 5 طلبات
      pool.query(`
        SELECT o.id, o.total_amount, o.status, u.name as customer_name
        FROM orders o
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
        LIMIT 5
      `).then(([rows]) => rows),
      
      // بيانات المبيعات (آخر 30 يوم)
      pool.query(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as orders_count,
          SUM(total_amount) as total_sales
        FROM orders
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date
      `).then(([rows]) => rows)
    ]);

    // نرجع البيانات للفرونت-اند
    res.json({
      success: true,
      stats: { usersCount, productsCount, ordersCount },
      recentOrders,
      salesData
    });

  } catch (error) {
    console.error('خطأ في الداشبورد:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred while fetching dashboard data'
    });
  }
};

// عرض جميع المستخدمين
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT id, name, email, phone, role, created_at 
      FROM users
      ORDER BY created_at DESC
    `);
    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, error: 'Error fetching user data' });
  }
};

// عرض مستخدم واحد
exports.getUserById = async (req, res) => {
  try {
    const [user] = await pool.query(`
      SELECT id, name, email, phone, role, created_at 
      FROM users 
      WHERE id = ?
    `, [req.params.id]);
    
    if (!user[0]) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.json({ success: true, user: user[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, error: 'Error fetching user data' });
  }
};

// تحديث بيانات المستخدم
exports.updateUser = async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;
    
    // التحقق من وجود المستخدم أولاً
    const [user] = await pool.query('SELECT id FROM users WHERE id = ?', [req.params.id]);
    if (!user[0]) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (req.user.id == req.params.id && role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: `You can't change your own powers`
      });
    }
    
    // التحديث
    await pool.query(`
      UPDATE users 
      SET name = ?, email = ?, phone = ?, role = ?
      WHERE id = ?
    `, [name, email, phone, role, req.params.id]);
    
    res.json({ success: true, message: 'User data updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, error: 'Error updating user data' });
  }
  
};

// حذف المستخدم
exports.deleteUser = async (req, res) => {
  try {
    // التحقق من وجود المستخدم أولاً
    const [user] = await pool.query('SELECT id FROM users WHERE id = ?', [req.params.id]);
    if (!user[0]) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    if (req.user.id == req.params.id) {
      return res.status(403).json({ 
        success: false, 
        error: 'You cannot delete your own account' 
      });
    }

    // الحذف
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, error: 'Error deleting user' });
  }
};


