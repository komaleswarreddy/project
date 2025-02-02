const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const { protect } = require('../controllers/authController');

// Search users and posts
router.get('/', protect, async (req, res) => {
  try {
    const { query, category } = req.query;
    const searchRegex = new RegExp(query, 'i');

    // Search users
    const users = await User.find({
      $or: [
        { username: searchRegex },
        { name: searchRegex },
        { bio: searchRegex }
      ]
    }).select('-password');

    // Search posts
    const postQuery = category 
      ? { 
          $and: [
            { caption: searchRegex },
            { category: category }
          ]
        }
      : { caption: searchRegex };

    const posts = await Post.find(postQuery)
      .populate('user', 'username name profilePicture')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      data: {
        users,
        posts
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Get recent searches
router.get('/recent', protect, async (req, res) => {
  try {
    const recentSearches = await User.find({
      _id: { $in: req.user.recentSearches || [] }
    })
    .select('username name profilePicture followers')
    .limit(5);

    res.status(200).json({
      status: 'success',
      data: {
        recentSearches
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Add to recent searches
router.post('/recent/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Add to recent searches array, keeping only the last 5 searches
    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        recentSearches: {
          $each: [userId],
          $slice: -5
        }
      }
    });

    res.status(200).json({
      status: 'success'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Remove from recent searches
router.delete('/recent/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { recentSearches: userId }
    });

    res.status(200).json({
      status: 'success'
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;
