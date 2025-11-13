// controllers/scannerController.js
const Joi = require('joi');
const scannerService = require('../services/scannerService');

// Fungsi untuk Scan Santri (mengambil data & saldo)
exports.scanStudent = async (req, res) => {
    // 1. Validasi Input QR Code (Asumsi QR berisi student_id dalam bentuk GUID)
    const schema = Joi.object({
        student_id: Joi.string().guid().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ status: 'fail', message: 'Format ID Santri tidak valid.' });
    }

    const { student_id } = value;

    try {
        // 2. Panggil Business Logic dari Service Layer
        const studentData = await scannerService.findStudentDetails(student_id);

        // Jika Santri tidak ditemukan, Service akan melempar error
        if (!studentData) {
            return res.status(404).json({ status: 'fail', message: 'Data Santri tidak ditemukan. QR Code salah?' });
        }

        // 3. Kirim Response Sukses
        return res.status(200).json({
            status: 'success',
            message: `Data Santri ${studentData.name} berhasil dimuat.`,
            data: studentData
            // studentData akan berisi id, name, current_balance, dll.
        });

    } catch (e) {
        // Handle Error (misalnya error koneksi DB)
        console.error('Scan Error:', e.message);
        return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan sistem saat memproses scan.' });
    }
};

// ... (Controller lain jika ada)