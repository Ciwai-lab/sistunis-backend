// routes/scanner.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Middleware JWT Auth
const asyncHandler = require('../middleware/asyncHandler');
// Import Role Check (perlu dibuat di middleware/roleChecks.js)
const { isAdminTu } = require('../middleware/roleChecks'); // Middleware Role Check
// Import Controller
const scannerController = require('../controllers/scannerController');
const transactionController = require('../controllers/transactionController');

// Endpoint Scan (Cek Santri dan Saldo)
// Role: Hanya Admin TU yang bisa melakukan scan untuk cek saldo.
router.post('/scan', auth, isAdminTu, asyncHandler(scannerController.scanStudent));

// Endpoint Withdraw (Penarikan Uang Saku)
// Role: Hanya Admin TU yang bisa melakukan penarikan.
router.post('/withdraw', auth, isAdminTu, asyncHandler(transactionController.withdraw));

// Note: Withdraw menggunakan controller terpisah agar lebih rapi.

module.exports = router;