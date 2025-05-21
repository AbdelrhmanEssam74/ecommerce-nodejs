const jwt = require('jsonwebtoken');
const pool = require('../DB/db');

// Middleware للتحقق من صحة التوكن
exports.requireAuth = async (req, res, next) => {
  try {
    // 1. نجيب التوكن من الهيدر
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // 2. نتأكد من وجود التوكن
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'مطلوب تسجيل الدخول للوصول لهذه الصفحة' 
      });
    }
    
    // 3. نفحص التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. نبحث عن المستخدم في الداتابيز (اختياري لكن أحسن للأمان)
    const [user] = await pool.query(
      'SELECT id, role FROM users WHERE id = ?', 
      [decoded.userId]
    );
    
    if (!user[0]) {
      return res.status(401).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    
    // 5. نخزن بيانات المستخدم في الـ request عشان نستخدمها في الـ endpoints
    req.user = {
      id: user[0].id,
      role: user[0].role
    };
    
    next(); // نكمل للخطوة التالية
    
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Session has expired, please log in again' 
      });
    }
    
    res.status(401).json({ 
      success: false,
      error: 'Invalid authentication'
    });
  }
};

// Middleware للتحقق من الصلاحيات (أدمن/مانجر)
exports.requireRole = (roles) => {
  return (req, res, next) => {
    // 1. نتأكد إن middleware المصادقة اشتغلت قبل كده
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'You must log in first'
      });
    }
    
    // 2. نتحقق من الصلاحيات
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        error: 'You do not have access'
      });
    }
    
    next(); // نكمل للخطوة التالية
  };
};