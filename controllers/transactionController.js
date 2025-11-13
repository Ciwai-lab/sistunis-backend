// controllers/transactionController.js
const Joi = require('joi');
const transactionService = require('../services/transactionService');

exports.withdraw = async (req, res) => {
    // 1. Validasi Input (Joi)
    const schema = Joi.object({
        student_id: Joi.string().guid().required(),
        amount: Joi.number().positive().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ status: 'fail', message: error.details.map(d => d.message).join(', ') });
    }

    const { student_id, amount } = value;

    // Asumsi Admin ID sudah tersedia dari JWT/req.user
    const adminId = req.user.id;

    try {
        // 2. Panggil Business Logic dari Service Layer
        const result = await transactionService.withdrawDailyAllowance(student_id, amount, adminId);

        // 3. Kirim Response Sukses
        return res.status(200).json({
            status: 'success',
            message: `Penarikan uang saku sebesar ${amount} untuk ${result.studentName} berhasil.`,
            data: {
                transactionCode: result.transactionCode,
                newBalance: result.newBalance,
            }
        });

    } catch (e) {
        // 4. Handle Custom Errors dari Service
        let statusCode = 500;
        let message = 'Terjadi kesalahan pada sistem transaksi.';

        if (e.message === 'DAILY_LIMIT_EXCEEDED') {
            statusCode = 409;
            message = 'Santri ini sudah melakukan penarikan uang saku hari ini, bro!';
        } else if (e.message === 'INSUFFICIENT_FUNDS') {
            statusCode = 409;
            message = 'Saldo santri tidak mencukupi untuk penarikan ini.';
        } else if (e.message === 'STUDENT_NOT_FOUND') {
            statusCode = 404;
            message = 'ID Santri tidak ditemukan.';
        }

        return res.status(statusCode).json({ status: 'error', message });
    }
};