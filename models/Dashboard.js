const pool = require('../DB/db');

class Dashboard {
  static async getStats() {
    const [usersCount, productsCount, ordersCount] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM users WHERE role = "customer"'),
      pool.query('SELECT COUNT(*) as count FROM products'),
      pool.query('SELECT COUNT(*) as count FROM orders')
    ]);
    
    return {
      users: usersCount[0][0].count,
      products: productsCount[0][0].count,
      orders: ordersCount[0][0].count
    };
  }

  static async getRecentOrders(limit = 5) {
    const [orders] = await pool.query(`
      SELECT o.id, o.total_amount, o.status, u.name as user_name 
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT ?
    `, [limit]);
    
    return orders;
  }

  static async getSalesData(days = 30) {
    const [sales] = await pool.query(`
      SELECT 
        DATE(created_at) as date, 
        COUNT(*) as order_count,
        SUM(total_amount) as total_sales
      FROM orders
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY DATE(created_at)
      ORDER BY date
    `, [days]);
    
    return sales;
  }
}

module.exports = Dashboard;