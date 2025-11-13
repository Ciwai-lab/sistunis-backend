// controllers/postsController.js
const Joi = require('joi');
const postsService = require('../services/postsService');

exports.createPost = async (req, res) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(255).required(),
        content: Joi.string().min(1).required()
    });
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ status: 'fail', message: error.details.map(d => d.message).join(', ') });

    const user_id = req.user.id;
    const post = await postsService.createPost({ user_id, title: value.title, content: value.content });
    res.status(201).json({ status: 'success', data: post });
};

exports.getMyPosts = async (req, res) => {
    const user_id = req.user.id;
    const posts = await postsService.getPostsByUser(user_id);
    res.json({ status: 'success', data: posts });
};
