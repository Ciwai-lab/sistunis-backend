// middleware/roleChecks.js

// Definisi Role ID (Asumsi berdasarkan struktur user pada umumnya)
// Sebaiknya Role ID ini disimpan di file constants.js atau dibaca dari DB,
// tapi untuk sementara kita hardcode dulu:
const ROLE_ID = {
    SUPER_ADMIN: 1,
    ADMIN_TU: 3,         // Misalnya, ID 3 untuk Admin Tata Usaha (yang pegang scanner/withdraw)
    WALI_SANTRI: 5,      // Misalnya, ID 5 untuk Wali Santri (bisa lihat data santri sendiri)
    FINANCE_AUDITOR: 9,  // Misalnya, ID 9 untuk Auditor Keuangan (bisa buat/hapus aktivitas)
};


exports.isAdminTu = (req, res, next) => {
    // Memeriksa apakah user sudah login (auth middleware sudah lewat)
    if (!req.user) {
        return res.status(401).json({ status: 'fail', message: 'Unauthorized. Token required.' });
    }

    // Memeriksa apakah role_id user sesuai
    if (req.user.role_id === ROLE_ID.ADMIN_TU) {
        next(); // Lanjutkan jika role_id cocok
    } else {
        res.status(403).json({ status: 'fail', message: 'Akses ditolak. Hanya Admin TU yang diizinkan.' });
    }
};


exports.isWaliSantri = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ status: 'fail', message: 'Unauthorized. Token required.' });
    }

    if (req.user.role_id === ROLE_ID.WALI_SANTRI) {
        next();
    } else {
        res.status(403).json({ status: 'fail', message: 'Akses ditolak. Hanya Wali Santri yang diizinkan.' });
    }
};


exports.isFinanceAuditor = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ status: 'fail', message: 'Unauthorized. Token required.' });
    }

    // Note: Contoh endpoint di server.js yang lama menggunakan ini.
    if (req.user.role_id === ROLE_ID.FINANCE_AUDITOR) {
        next();
    } else {
        res.status(403).json({ status: 'fail', message: 'Akses ditolak. Hanya Auditor Keuangan yang diizinkan.' });
    }
};

exports.isSuperAdmin = (req, res, next) => {
    // Memeriksa apakah user sudah login (auth middleware sudah lewat)
    if (!req.user) {
        return res.status(401).json({ status: 'fail', message: 'Unauthorized. Token required.' });
    }

    // Memeriksa apakah role_id user sesuai (ID 1)
    if (req.user.role_id === ROLE_ID.SUPER_ADMIN) {
        next(); // Lanjutkan jika role_id cocok
    } else {
        res.status(403).json({ status: 'fail', message: 'Akses ditolak. Hanya Super Admin yang diizinkan.' });
    }
};