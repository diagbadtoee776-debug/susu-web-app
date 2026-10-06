const express = require('express');
const Cycle = require('../models/Cycle');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// GET /api/cycles/next-to-eat - Get eligible members to eat (admin only)
router.get('/next-to-eat', verifyToken, requireAdmin, async (req, res) => {
    try {
        const activeCycle = await Cycle.getActive();
        if (!activeCycle) {
            return res.status(404).json({ error: 'No active cycle found.' });
        }

        const eligibleMembers = await Cycle.getNextToEat(activeCycle.CycleID);
        res.json({ cycleId: activeCycle.CycleID, eligibleMembers });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch next eater.' });
    }
});

// POST /api/cycles/eat - Record eating + auto-reset cycle (admin only)
router.post('/eat', verifyToken, requireAdmin, async (req, res) => {
    try {
        const { userId, eatDate } = req.body;
        const activeCycle = await Cycle.getActive();

        if (!activeCycle) {
            return res.status(404).json({ error: 'No active cycle found.' });
        }

        // Record the eat
        await Cycle.recordEat(activeCycle.CycleID, userId, eatDate);
        
        // Auto-reset cycle for next person
        const newCycleId = await Cycle.reset(activeCycle.CycleID);
        
        res.json({ 
            message: 'Pot collected and cycle reset.', 
            previousCycle: activeCycle.CycleID,
            newCycleId 
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;