const mysql = require('mysql2')
console.time('db-connect');
const connection = mysql.createConnection({
    host: '193.203.168.147',
    user: 'u679933726_ITIPHP',
    password: 'Zi6o0V@3>5F!',
    database: 'u679933726_ecommerce',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

connection.connect((err) => {
    console.timeEnd('db-connect');
    if (err) {
        console.log('Error connecting to the database:', err)
        return
    }
    console.log('Connected to the database')
})

module.exports = connection.promise();