// app.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const errorHandler = require('./middleware/errorHandler');
const scannerRoutes = require('./routes/scanner');
const activityRoutes = require('./routes/activity');
const presenceRoutes = require('./routes/presence');

const app = express();

// Basic middlewares
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting (global)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200
});
app.use(limiter);

// CORS — only allow specified origins
const allowed = (process.env.CORS_ALLOWED || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
    origin: (origin, cb) => {
        if (!origin) return cb(null, true); // allow non-browser tools like curl
        if (allowed.length === 0 || allowed.includes(origin)) return cb(null, true);
        return cb(new Error('Not allowed by CORS'));
    }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/scanner', scannerRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/presence', presenceRoutes);

// health
app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// centralized error handler (must be last)
app.use(errorHandler);

module.exports = app;
