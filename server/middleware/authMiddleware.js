const jwt = require('jsonwebtoken');

// Verify JWT token from request header
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>
    
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attach user data (id, role) to request
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid or expired token.' });
    }
};

// Restrict route to Admins only (PRD §3 Scope: Admin dashboard)
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ error: 'Admin access required.' });
    }
    next();
};

module.exports = { verifyToken, requireAdmin };