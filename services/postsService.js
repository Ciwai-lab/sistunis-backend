// services/postsService.js
const pool = require('../db');

exports.createPost = async ({ user_id, title, content }) => {
    const client = await pool.connect();
    try {
        const q = `INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3) RETURNING id, user_id, title, content, created_at`;
        const { rows } = await client.query(q, [user_id, title, content]);
        return rows[0];
    } finally {
        client.release();
    }
};

exports.getPostsByUser = async (user_id) => {
    const client = await pool.connect();
    try {
        const { rows } = await client.query('SELECT id, title, content, created_at FROM posts WHERE user_id=$1 ORDER BY created_at DESC', [user_id]);
        return rows;
    } finally {
        client.release();
    }
};
