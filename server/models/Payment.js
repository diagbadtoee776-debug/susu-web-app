const db = require('../config/db');

class Payment {
    // Record payment (self or proxy) (SRS §3 Functional Req #2)
    static async record(userId, amount, paymentDate, proxyPayerId = null) {
        // Validate required fields (PRD §4)
        if (!amount || !paymentDate) {
            throw new Error('Amount and PaymentDate are required.');
        }

        const [result] = await db.execute(
            'INSERT INTO Payments (UserID, Amount, PaymentDate, ProxyPayerID) VALUES (?, ?, ?, ?)',
            [userId, amount, paymentDate, proxyPayerId]
        );
        
        return result.insertId;
    }

    // Get payments for a user (for receipts/reports)
    static async getByUserId(userId) {
        const [rows] = await db.execute(
            `SELECT p.*, u.Username AS PayerName 
             FROM Payments p 
             LEFT JOIN Users u ON p.ProxyPayerID = u.UserID 
             WHERE p.UserID = ? 
             ORDER BY p.PaymentDate DESC`,
            [userId]
        );
        return rows;
    }
}

module.exports = Payment;