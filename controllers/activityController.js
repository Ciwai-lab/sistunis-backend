// controllers/activityController.js
const Joi = require('joi');
const activityService = require('../services/activityService');

// B. CREATE New Activity (POST)
exports.createActivity = async (req, res) => {
    // 1. Validasi Input (Joi)
    const schema = Joi.object({
        activity_name: Joi.string().min(3).max(100).required(),
        activity_code: Joi.string().min(3).max(10).uppercase().required(), // Wajib uppercase di Joi
        is_daily: Joi.boolean().default(false),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 'fail',
            message: `Validasi gagal: ${error.details.map(d => d.message).join(', ')}`
        });
    }

    const { activity_name, activity_code, is_daily } = value;

    try {
        // 2. Panggil Business Logic dari Service Layer
        const newActivity = await activityService.createActivity(activity_name, activity_code, is_daily);

        // 3. Kirim Response Sukses
        return res.status(201).json({
            status: 'success',
            message: 'Aktivitas baru berhasil ditambahkan!',
            data: newActivity
        });
    } catch (err) {
        // 4. Handle Error (Cek Postgres Unique Violation)
        if (err.code === '23505') {
            return res.status(409).json({
                status: 'error',
                message: 'Nama atau Kode Aktivitas sudah ada, bro! Kode harus unik.'
            });
        }

        console.error('Error CREATE ACTIVITY:', err.stack);
        return res.status(500).json({
            status: 'error',
            message: 'Gagal saat menambahkan aktivitas.',
            error: err.message
        });
    }
};

// C. GET All Activities (GET)
exports.getAllActivities = async (req, res) => {
    try {
        const activities = await activityService.getAllActivities();
        return res.status(200).json({
            status: 'success',
            data: activities,
        });
    } catch (err) {
        console.error('Error GET ACTIVITIES:', err.stack);
        return res.status(500).json({
            status: 'error',
            message: 'Gagal mengambil data aktivitas.',
            error: err.message
        });
    }
};

// D. GET One Activity (GET /:id)
exports.getOneActivity = async (req, res) => {
    const { id } = req.params;

    try {
        const activity = await activityService.getOneActivity(id);

        if (!activity) {
            return res.status(404).json({ status: 'fail', message: 'Aktivitas tidak ditemukan.' });
        }

        return res.status(200).json({ status: 'success', data: activity });
    } catch (err) {
        console.error('Error GET ONE ACTIVITY:', err.stack);
        return res.status(500).json({ status: 'error', message: 'Gagal mengambil data aktivitas.' });
    }
};

// E. UPDATE Activity (PATCH /:id)
exports.updateActivity = async (req, res) => {
    const { id } = req.params;

    // 1. Validasi Input (Joi)
    const schema = Joi.object({
        activity_name: Joi.string().min(3).max(100).required(),
        activity_code: Joi.string().min(3).max(10).uppercase().required(),
        is_daily: Joi.boolean().default(false),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ status: 'fail', message: `Validasi gagal: ${error.details.map(d => d.message).join(', ')}` });
    }

    const { activity_name, activity_code, is_daily } = value;

    try {
        // Cek apakah ID ada
        const existing = await activityService.getOneActivity(id);
        if (!existing) {
            return res.status(404).json({ status: 'fail', message: 'Aktivitas yang ingin diubah tidak ditemukan.' });
        }

        // 2. Panggil Service Layer
        const updatedActivity = await activityService.updateActivity(id, activity_name, activity_code, is_daily);

        return res.status(200).json({
            status: 'success',
            message: 'Aktivitas berhasil diperbarui!',
            data: updatedActivity
        });

    } catch (err) {
        // Handle Error Duplikat (23505)
        if (err.code === '23505') {
            return res.status(409).json({
                status: 'error',
                message: 'Kode Aktivitas yang baru sudah digunakan oleh aktivitas lain, bro!'
            });
        }

        console.error('Error UPDATE ACTIVITY:', err.stack);
        return res.status(500).json({ status: 'error', message: 'Gagal saat memperbarui aktivitas.' });
    }
};

// F. DELETE Activity (DELETE /:id)
exports.deleteActivity = async (req, res) => {
    const { id } = req.params;

    try {
        // Cek apakah ID ada
        const deleted = await activityService.deleteActivity(id);

        if (!deleted) {
            return res.status(404).json({ status: 'fail', message: 'Aktivitas yang ingin dihapus tidak ditemukan.' });
        }

        return res.status(200).json({
            status: 'success',
            message: `Aktivitas ID ${deleted.id} berhasil dihapus!`
        });
    } catch (err) {
        console.error('Error DELETE ACTIVITY:', err.stack);
        return res.status(500).json({ status: 'error', message: 'Gagal saat menghapus aktivitas.' });
    }
};