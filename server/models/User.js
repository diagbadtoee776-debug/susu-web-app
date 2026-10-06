const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    static async create(fullName, email, password, role = 'Member') {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Added CURDATE() for JoinDate and NULL for Phone (since it's optional)
        const [result] = await db.execute(
            'INSERT INTO users (FullName, Email, PasswordHash, Role, JoinDate, Phone) VALUES (?, ?, ?, ?, CURDATE(), NULL)',
            [fullName, email, hashedPassword, role]
        );
        
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE Email = ?', 
            [email]
        );
        return rows[0] || null;
    }
}

module.exports = User;