const mysql = require('mysql2')
console.time('db-connect');
const connection = mysql.createConnection({
    host: 'sql8.freesqldatabase.com',
    user: 'sql8778978',
    password: 'adeVXEaYDe',
    database: 'sql8778978',
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