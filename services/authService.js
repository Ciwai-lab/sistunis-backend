// services/authService.js
const pool = require('../db');

exports.createUser = async ({ name, email, password_hash, role_id }) => {
    const client = await pool.connect();
    try {
        const q = `INSERT INTO users (name, email, password_hash, role_id) 
               VALUES ($1, $2, $3, $4) RETURNING id, name, email, created_at`;
        const { rows } = await client.query(q, [name, email, password_hash, role_id]);
        return rows[0];
    } finally {
        client.release();
    }
};

exports.findUserByEmail = async (email) => {
    const client = await pool.connect();
    try {
        const { rows } = await client.query('SELECT id, name, email, password_hash, role_id FROM users WHERE email=$1', [email]);
        return rows[0] || null;
    } finally {
        client.release();
    }
};
