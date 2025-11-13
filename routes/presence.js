// routes/presence.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
// Import Role Check (Asumsi Admin TU yang mencatat)
const { isAdminTu } = require('../middleware/roleChecks');
const presenceController = require('../controllers/presenceController');

// 🟢 RECORD PRESENCE (POST /api/presence)
// Role: Hanya Admin TU yang boleh mencatat absensi santri.
router.post('/', auth, isAdminTu, asyncHandler(presenceController.recordPresence));

// Jika ada endpoint untuk melihat histori absensi per santri, bisa ditambahkan di sini:
// router.get('/:student_id', auth, isWaliSantri, asyncHandler(presenceController.getPresenceHistory));

module.exports = router;