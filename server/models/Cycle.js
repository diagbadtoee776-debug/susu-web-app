const db = require('../config/db');

class Cycle {
    // Get current active cycle
    static async getActive() {
        const [rows] = await db.execute(
            'SELECT * FROM Cycles WHERE Status = "Active" LIMIT 1'
        );
        return rows[0] || null;
    }

    // Record who "ate" the pot (SRS §3 Functional Req #3)
    static async recordEat(cycleId, userId, eatDate) {
        // Enforce "eat once per cycle" rule (PRD §4)
        const [existing] = await db.execute(
            'SELECT RecordID FROM Records WHERE CycleID = ? AND UserID = ?',
            [cycleId, userId]
        );
        
        if (existing.length > 0) {
            throw new Error('This member has already eaten in this cycle.');
        }

        const [result] = await db.execute(
            'INSERT INTO Records (CycleID, UserID, EatDate) VALUES (?, ?, ?)',
            [cycleId, userId, eatDate]
        );
        
        return result.insertId;
    }

    // Reset cycle after eating (SRS §3 Functional Req #4)
    static async reset(currentCycleId) {
        // Mark current cycle as completed
        await db.execute(
            'UPDATE Cycles SET Status = "Completed" WHERE CycleID = ?',
            [currentCycleId]
        );

        // Create new active cycle starting today
        const today = new Date().toISOString().split('T')[0];
        const [newCycle] = await db.execute(
            'INSERT INTO Cycles (StartDate, EndDate, Status) VALUES (?, DATE_ADD(?, INTERVAL 7 DAY), "Active")',
            [today, today]
        );

        return newCycle.insertId;
    }

    // Get next eligible eater (unique feature: prevents arguments)
    static async getNextToEat(cycleId) {
        const [rows] = await db.execute(
            `SELECT u.* FROM Users u 
             WHERE u.Role = 'Member' 
             AND u.UserID NOT IN (
                 SELECT UserID FROM Records WHERE CycleID = ?
             )`,
            [cycleId]
        );
        return rows;
    }
}

module.exports = Cycle;