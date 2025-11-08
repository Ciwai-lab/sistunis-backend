// File: middleware/auth.js

const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. Ganti: Ambil header 'Authorization' (standar industri)
    // Token dikirim sebagai: Authorization: Bearer <token>
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        // Jika header Authorization tidak ada
        return res.status(401).json({ msg: 'Akses ditolak. Token tidak ditemukan.' });
    }

    // 2. Cek format 'Bearer '
    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'Akses ditolak. Format token harus "Bearer <token>".' });
    }

    // Pisahkan 'Bearer ' dari token yang sebenarnya
    const token = authHeader.substring(7); // Ambil string setelah "Bearer " (7 karakter)

    // 3. Verifikasi Token
    try {
        // Memverifikasi token dengan Secret Key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Menambahkan data user dari token ke objek request (req.user)
        req.user = decoded.user;

        // Lanjutkan ke fungsi (endpoint) berikutnya
        next();

    } catch (e) {
        // Jika token tidak valid (expired, diubah, dll.)
        res.status(401).json({ msg: 'Token tidak valid atau kadaluarsa. Silakan login ulang.' });
    }
};