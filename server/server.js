const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection - TEMPORARY HARDCODED FOR TONIGHT
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD || '',
  database: 'susu',
  port: 3306
});

const JWT_SECRET = process.env.JWT_SECRET || 'susu-secret-key-2026';

// REGISTER ENDPOINT - FIXED: Added JoinDate
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const [existingUser] = await db.query('SELECT * FROM Users WHERE Email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already registered.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO Users (FullName, Email, Password, Role, JoinDate) VALUES (?, ?, ?, ?, NOW())',
      [fullName, email, hashedPassword, 'User']
    );
    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// LOGIN ENDPOINT - FIXED: MemberID column
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const [users] = await db.query('SELECT * FROM Users WHERE Email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const token = jwt.sign(
      { id: user.MemberID, email: user.Email, role: user.Role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, role: user.Role, fullName: user.FullName });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// GET ALL MEMBERS (ADMIN ONLY) - NEW ENDPOINT
app.get('/api/admin/members', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided.' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'Admin') {
      return res.status(403).json({ error: 'Admin access required.' });
    }
    
    const [rows] = await db.query('SELECT MemberID, FullName, Email, Role, JoinDate FROM Users ORDER BY JoinDate DESC');
    res.json(rows);
  } catch (err) {
    console.error('Fetch members error:', err);
    res.status(500).json({ error: 'Server error fetching members.' });
  }
});

// ADMIN CREATE USER - FIXED: Added JoinDate
app.post('/api/admin/create-user', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided.' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'Admin') {
      return res.status(403).json({ error: 'Admin access required.' });
    }
    const { fullName, email, password, role } = req.body;
    if (!fullName || !password) {
      return res.status(400).json({ error: 'Name and password are required.' });
    }
    const userEmail = email || `${fullName.replace(/\s+/g, '').toLowerCase()}@susu.local`;
    const [existingUser] = await db.query('SELECT * FROM Users WHERE Email = ?', [userEmail]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || 'User';
    const [result] = await db.query(
      'INSERT INTO Users (FullName, Email, Password, Role, JoinDate) VALUES (?, ?, ?, ?, NOW())',
      [fullName, userEmail, hashedPassword, userRole]
    );
    res.status(201).json({ 
      message: 'Member added successfully',
      userId: result.insertId,
      loginCredentials: { email: userEmail, password: password }
    });
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ error: 'Server error adding member.' });
  }
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});