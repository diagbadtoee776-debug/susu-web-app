const express = require('express');
const db = require('../config/db');
const router = express.Router();

// POST /api/payments - Record a payment
router.post('/', async (req, res) => {
    try {
        const { memberId, amount, cycleWeek } = req.body;
        await db.execute(
            'INSERT INTO payments (MemberID, Amount, CycleWeek) VALUES (?, ?, ?)',
            [memberId, amount, cycleWeek]
        );
        res.json({ message: 'Payment recorded successfully' });
    } catch (err) {
        console.error('Payment Error:', err);
        res.status(500).json({ error: 'Failed to record payment' });
    }
});

// GET /api/payments/history/:memberId
router.get('/history/:memberId', async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM payments WHERE MemberID = ? ORDER BY PaymentDate DESC',
            [req.params.memberId]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

module.exports = router;