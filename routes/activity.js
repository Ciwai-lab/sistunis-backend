// routes/activity.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Middleware JWT Auth
const asyncHandler = require('../middleware/asyncHandler');
// Import Role Check (Asumsi ID 9 = Finance Auditor)
const { isFinanceAuditor } = require('../middleware/roleChecks');
const activityController = require('../controllers/activityController');

// 🟢 CREATE Activity (POST)
// Role: Hanya Auditor Keuangan yang boleh membuat aktivitas baru
router.post('/', auth, isFinanceAuditor, asyncHandler(activityController.createActivity));

// 🟢 READ All Activities (GET)
// Role: Siapa pun yang login (Admin/Auditor) boleh melihat daftar aktivitas
router.get('/', auth, asyncHandler(activityController.getAllActivities));

// 🟢 READ One Activity (GET /:id)
router.get('/:id', auth, asyncHandler(activityController.getOneActivity));

// 🟢 UPDATE Activity (PATCH /:id)
router.patch('/:id', auth, isFinanceAuditor, asyncHandler(activityController.updateActivity));

// 🟢 DELETE Activity (DELETE /:id)
router.delete('/:id', auth, isFinanceAuditor, asyncHandler(activityController.deleteActivity));

module.exports = router;