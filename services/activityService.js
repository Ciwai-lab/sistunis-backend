// services/activityService.js
const pool = require('../db');

/**
 * Membuat aktivitas baru di DB.
 * @param {string} activityId
 * @param {string} activityName 
 * @param {string} activityCode 
 * @param {boolean} isDaily 
 */
exports.createActivity = async (activityName, activityCode, isDaily = false) => {
    // Pastikan kode diubah menjadi UPPERCASE sebelum disimpan ke DB
    const finalActivityCode = activityCode.toUpperCase();

    const insertQuery = `
        INSERT INTO activities (activity_name, activity_code, is_daily) 
        VALUES ($1, $2, $3) 
        RETURNING id, activity_name, activity_code, is_daily
    `;

    // Langsung panggil query dari pool (tanpa client transaction karena hanya 1 query)
    const result = await pool.query(insertQuery, [activityName, finalActivityCode, isDaily]);

    return result.rows[0];
};

exports.getOneActivity = async (activityId) => {
    const query = `
        SELECT id, activity_name, activity_code, is_daily, created_at
        FROM activities
        WHERE id = $1
    `;
    const { rows } = await pool.query(query, [activityId]);
    return rows[0] || null;
};

/**
 * Mencari semua aktivitas yang tersedia.
 */
exports.getAllActivities = async () => {
    const query = `
        SELECT id, activity_name, activity_code, is_daily, created_at
        FROM activities
        ORDER BY activity_name ASC
    `;
    const { rows } = await pool.query(query);
    return rows;
};

exports.updateActivity = async (activityId, activityName, activityCode, isDaily) => {
    const finalActivityCode = activityCode.toUpperCase();

    const updateQuery = `
        UPDATE activities 
        SET activity_name = $1, activity_code = $2, is_daily = $3, updated_at = NOW()
        WHERE id = $4
        RETURNING id, activity_name, activity_code, is_daily
    `;

    const result = await pool.query(updateQuery, [activityName, finalActivityCode, isDaily, activityId]);

    return result.rows[0];
};

/**
 * Menghapus aktivitas berdasarkan ID.
 * @param {string} activityId
 */
exports.deleteActivity = async (activityId) => {
    const deleteQuery = `
        DELETE FROM activities 
        WHERE id = $1
        RETURNING id
    `;
    const result = await pool.query(deleteQuery, [activityId]);
    // Mengembalikan ID aktivitas yang dihapus
    return result.rows[0];
};