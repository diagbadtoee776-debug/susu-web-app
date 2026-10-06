const mysql = require('mysql2');

// TEMPORARY: Hardcoded credentials to test connection
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'MYSQLDATABASE', // Your actual password
    database: 'susu',          // Your actual database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = db.promise();