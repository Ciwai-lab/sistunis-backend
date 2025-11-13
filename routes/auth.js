// routes/auth.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const authController = require('../controllers/authController');

router.post('/register', asyncHandler(authController.register));
router.post('/login', asyncHandler(authController.login));

module.exports = router;
