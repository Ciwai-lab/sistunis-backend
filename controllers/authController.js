// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const authService = require('../services/authService');

const signJWT = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '4h' });
};

exports.register = async (req, res) => {
    // validate
    const schema = Joi.object({
        name: Joi.string().min(2).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 'fail', message: error.details.map(d => d.message).join(', ') });

    const { name, email, password } = value;

    // Prevent duplicate email (simple check)
    const existing = await authService.findUserByEmail(email);
    if (existing) return res.status(409).json({ status: 'fail', message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const user = await authService.createUser({ name, email, password_hash });
    const token = signJWT({ id: user.id, email: user.email, role_id: user.role_id });

    res.status(201).json({ status: 'success', data: { user, token } });
};

exports.login = async (req, res) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    });
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 'fail', message: error.details.map(d => d.message).join(', ') });

    const { email, password } = value;
    const user = await authService.findUserByEmail(email);
    if (!user) return res.status(401).json({ status: 'fail', message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ status: 'fail', message: 'Invalid credentials' });

    const token = signJWT({ id: user.id, email: user.email, role_id: user.role_id });
    res.json({ status: 'success', data: { user: { id: user.id, name: user.name, email: user.email, role_id: user.role_id }, token } });
};
