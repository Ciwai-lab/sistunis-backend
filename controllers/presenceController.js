// controllers/presenceController.js
const Joi = require('joi');
const presenceService = require('../services/presenceService');

// Fungsi untuk mencatat absensi Santri
exports.recordPresence = async (req, res) => {
    // 1. Validasi Input
    const schema = Joi.object({
        student_id: Joi.string().guid().required(),
        activity_id: Joi.string().guid().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ status: 'fail', message: 'Input Absensi tidak valid.' });
    }

    const { student_id, activity_id } = value;

    // Asumsi User ID pencatat sudah tersedia dari JWT/req.user
    const recordedBy = req.user.id;

    try {
        // 2. CEK DUPLIKAT ABSENSI Harian
        const isDuplicate = await presenceService.checkDuplicatePresence(student_id, activity_id);

        if (isDuplicate) {
            return res.status(409).json({
                status: 'fail',
                message: 'Santri ini sudah tercatat absensi di aktivitas yang sama hari ini.'
            });
        }

        // 3. Panggil Business Logic (Catat Absensi)
        const result = await presenceService.recordPresence(student_id, activity_id, recordedBy);

        // 4. Kirim Response Sukses
        return res.status(201).json({
            status: 'success',
            message: `Absensi Santri ID ${student_id} untuk Aktivitas ID ${activity_id} berhasil dicatat.`,
            data: result
        });

    } catch (e) {
        // Handle Error (misalnya Santri/Aktivitas tidak ditemukan - perlu pengecekan tambahan jika tabel tidak terelasi)
        console.error('Presence Error:', e.stack);
        return res.status(500).json({ status: 'error', message: 'Gagal mencatat absensi.' });
    }
};