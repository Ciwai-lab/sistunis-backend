// routes/posts.js
const express = require('express');
const router = express.Router();
const asyncHandler = require('../middleware/asyncHandler');
const postsController = require('../controllers/postsController');
const auth = require('../middleware/auth');

router.post('/', auth, asyncHandler(postsController.createPost));
router.get('/me', auth, asyncHandler(postsController.getMyPosts));

module.exports = router;
