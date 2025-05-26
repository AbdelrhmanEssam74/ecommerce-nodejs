const mysql = require('mysql2/promise');
console.time('db-connect');

const pool = mysql.createPool({
    host: '193.203.168.147',
    user: 'u679933726_ITIPHP',
    password: 'Zi6o0V@3>5F!',
    database: 'u679933726_ecommerce',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
});

console.timeEnd('db-connect');
console.log('Database pool created');

module.exports = pool;
