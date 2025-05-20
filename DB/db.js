const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'sql8.freesqldatabase.com',
  user: 'sql8778978',
  password: 'adeVXEaYDe',
  database: 'sql8778978',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;