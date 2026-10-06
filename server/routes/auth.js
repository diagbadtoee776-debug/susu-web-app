const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const memberId = await User.create(username, email, password);
        
        res.status(201).json({ 
            message: 'Registration successful.', 
            memberId 
        });
    } catch (err) {
        console.error('Register Error:', err);
        
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Email already exists.' });
        }
        
        res.status(500).json({ error: 'Registration failed.' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const member = await User.findByEmail(email);

        if (!member || !(await bcrypt.compare(password, member.PasswordHash))) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        // Use hardcoded fallback if .env fails to load
        const secret = process.env.JWT_SECRET || 'susu_secret_key_2026';
        
        const token = jwt.sign(
            { id: member.MemberID, role: member.Role },
            secret,
            { expiresIn: '7d' }
        );

        res.json({ 
            message: 'Login successful.', 
            token, 
            user: { 
                id: member.MemberID, 
                username: member.FullName, 
                role: member.Role 
            } 
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ error: 'Login failed.' });
    }
});

module.exports = router;