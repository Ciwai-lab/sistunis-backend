// services/scannerService.js
const pool = require('../db');

/**
 * Mencari detail Santri berdasarkan ID (dari QR Code)
 * @param {string} studentId - ID Santri (GUID)
 */
exports.findStudentDetails = async (studentId) => {
    const query = `
        SELECT 
            id, 
            name, 
            current_balance, 
            class_id,
            parent_id 
        FROM students 
        WHERE id = $1`;

    const { rows } = await pool.query(query, [studentId]);

    // Mengembalikan data santri atau null jika tidak ditemukan
    return rows[0] || null;
};