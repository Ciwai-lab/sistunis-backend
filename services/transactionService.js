// services/transactionService.js
const pool = require('../db'); // Menggunakan pool yang sudah dimodifikasi di db/index.js
const moment = require('moment-timezone');
const { v4: uuidv4 } = require('uuid');

/**
 * Memproses penarikan uang saku harian dengan transaksi yang aman.
 * @param {string} studentId - ID Santri
 * @param {number} amount - Jumlah yang ditarik (harus > 0)
 * @param {number} adminId - ID Admin TU/Finance yang melakukan penarikan
 */
exports.withdrawDailyAllowance = async (studentId, amount, adminId) => {
    const client = await pool.connect();

    // Dapatkan tanggal hari ini di zona waktu Jakarta/Asia (penting untuk log harian)
    const today = moment().tz('Asia/Jakarta').format('YYYY-MM-DD');
    const transactionCode = `TRX-${uuidv4().substring(0, 8).toUpperCase()}`;

    try {
        // 1. START TRANSACTION
        await client.query('BEGIN');

        // 2. CEK BATASAN HARIAN
        const checkDuplicateQuery = `
            SELECT * FROM daily_allowance_log 
            WHERE student_id = $1 
            AND DATE(created_at) = $2
        `;
        const checkDuplicate = await client.query(checkDuplicateQuery, [studentId, today]);

        if (checkDuplicate.rows.length > 0) {
            // Jika sudah ada log hari ini, batalkan
            await client.query('ROLLBACK');
            throw new Error('DAILY_LIMIT_EXCEEDED');
        }

        // 3. AMBIL SALDO SAAT INI (Dengan FOR UPDATE!)
        // FOR UPDATE mengunci baris ini, mencegah race condition
        const getStudentQuery = `
            SELECT id, name, current_balance 
            FROM students 
            WHERE id = $1 
            FOR UPDATE
        `;
        const studentResult = await client.query(getStudentQuery, [studentId]);

        if (studentResult.rows.length === 0) {
            await client.query('ROLLBACK');
            throw new Error('STUDENT_NOT_FOUND');
        }

        const student = studentResult.rows[0];
        const newBalance = student.current_balance - amount;

        // 4. CEK SALDO CUKUP
        if (newBalance < 0) {
            await client.query('ROLLBACK');
            throw new Error('INSUFFICIENT_FUNDS');
        }

        // 5. UPDATE SALDO SANTRI
        const updateStudentQuery = `
            UPDATE students SET current_balance = $1 WHERE id = $2
        `;
        await client.query(updateStudentQuery, [newBalance, studentId]);

        // 6. CATAT TRANSAKSI (Debit/Pengeluaran)
        const recordTransactionQuery = `
            INSERT INTO transactions (student_id, amount, type, description, current_balance_after, transaction_code, created_by) 
            VALUES ($1, $2, 'DEBIT', 'Penarikan Uang Saku Harian', $3, $4, $5)
        `;
        await client.query(recordTransactionQuery, [studentId, amount, newBalance, transactionCode, adminId]);

        // 7. CATAT LOG PENARIKAN HARIAN
        const recordLogQuery = `
            INSERT INTO daily_allowance_log (student_id, created_by) 
            VALUES ($1, $2)
        `;
        await client.query(recordLogQuery, [studentId, adminId]);

        // 8. COMMIT (Jika semua di atas sukses)
        await client.query('COMMIT');

        return {
            transactionCode,
            studentName: student.name,
            newBalance
        };

    } catch (e) {
        // Jika ada error, ROLLBACK transaksi untuk mengembalikan DB ke kondisi awal
        await client.query('ROLLBACK');
        throw e; // Lemparkan error ke Controller
    } finally {
        // Lepaskan koneksi ke pool
        client.release();
    }
};