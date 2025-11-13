// services/presenceService.js
const pool = require('../db');

/**
 * Mencatat absensi Santri untuk sebuah aktivitas.
 * @param {string} studentId - ID Santri
 * @param {string} activityId - ID Aktivitas (misalnya: Sholat Dhuha, Kelas)
 * @param {number} recordedBy - ID Admin/User yang mencatat
 */
exports.recordPresence = async (studentId, activityId, recordedBy) => {
    const insertQuery = `
        INSERT INTO presence_log (student_id, activity_id, recorded_by) 
        VALUES ($1, $2, $3) 
        RETURNING *
    `;

    // Asumsi tabel student dan activity sudah dicek di controller
    const result = await pool.query(insertQuery, [studentId, activityId, recordedBy]);

    return result.rows[0];
};

/**
 * Cek apakah santri sudah absen di aktivitas yang sama hari ini
 * @param {string} studentId
 * @param {string} activityId
 */
exports.checkDuplicatePresence = async (studentId, activityId) => {
    // Dapatkan tanggal hari ini di zona waktu Jakarta/Asia
    const today = new Date().toISOString().split('T')[0];

    const checkQuery = `
        SELECT id FROM presence_log 
        WHERE student_id = $1 
        AND activity_id = $2 
        AND DATE(created_at) = $3
    `;
    const { rows } = await pool.query(checkQuery, [studentId, activityId, today]);

    return rows.length > 0;
};