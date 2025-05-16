const db = require('../DB/db');
const bcrypt = require('bcryptjs');

class User {
  // Find a user by email
  static async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  // Find a user by ID
  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  // Get all users (with pagination)
  static async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const [rows] = await db.query(
      'SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    
    // Get total count for pagination
    const [countResult] = await db.query('SELECT COUNT(*) as total FROM users');
    const total = countResult[0].total;
    
    return {
      users: rows,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Create a new user
  static async create(userData) {
    const { name, email, password, phone, role = 'customer' } = userData;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, phone, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [name, email, hashedPassword, phone, role]
    );
    
    return result.insertId;
  }

  // Update user
  static async update(id, userData) {
    const { name, email, phone, role } = userData;
    
    const [result] = await db.query(
      'UPDATE users SET name = ?, email = ?, phone = ?, role = ?, updated_at = NOW() WHERE id = ?',
      [name, email, phone, role, id]
    );
    
    return result.affectedRows > 0;
  }

  // Update password
  static async updatePassword(id, newPassword) {
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    const [result] = await db.query(
      'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
      [hashedPassword, id]
    );
    
    return result.affectedRows > 0;
  }

  // Delete user
  static async delete(id) {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // Search users
  static async search(term, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const searchTerm = `%${term}%`;
    
    const [rows] = await db.query(
      'SELECT id, name, email, phone, role, created_at FROM users WHERE name LIKE ? OR email LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [searchTerm, searchTerm, limit, offset]
    );
    
    // Get total count for pagination
    const [countResult] = await db.query(
      'SELECT COUNT(*) as total FROM users WHERE name LIKE ? OR email LIKE ?',
      [searchTerm, searchTerm]
    );
    
    const total = countResult[0].total;
    
    return {
      users: rows,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }
  
  // Count users by role
  static async countByRole(role) {
    const [result] = await db.query(
      'SELECT COUNT(*) as count FROM users WHERE role = ?',
      [role]
    );
    
    return result[0].count;
  }
}

module.exports = User;