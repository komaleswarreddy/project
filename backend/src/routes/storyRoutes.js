const express = require('express');
const storyController = require('../controllers/storyController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.post('/', storyController.uploadStory);
router.get('/', storyController.getStories);
router.patch('/:id/view', storyController.viewStory);

module.exports = router;
