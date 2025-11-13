// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) return res.status(401).json({ status: 'fail', message: 'Unauthorized' });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // attach minimal user info
        req.user = { id: payload.id, email: payload.email, role_id: payload.role_id };
        next();
    } catch (e) {
        return res.status(401).json({ status: 'fail', message: 'Invalid or expired token' });
    }
};
