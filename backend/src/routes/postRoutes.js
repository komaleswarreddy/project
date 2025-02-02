const express = require('express');
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.post('/', postController.createPost);
router.get('/feed', postController.getFeed);
router.patch('/:id/like', postController.likePost);
router.post('/:id/comments', postController.addComment);

module.exports = router;
