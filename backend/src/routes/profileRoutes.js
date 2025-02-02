const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const { protect } = require('../controllers/authController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads/profiles');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files (jpeg, jpg, png, gif) are allowed!'));
  }
}).single('profilePicture');

// Get user profile
router.get('/:username', protect, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password')
      .populate('followers following');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Get user's posts count
    const postsCount = await Post.countDocuments({ user: user._id });

    const userResponse = {
      ...user.toObject(),
      stats: {
        postsCount,
        followersCount: user.followers.length,
        followingCount: user.following.length
      }
    };

    res.status(200).json({
      status: 'success',
      data: userResponse
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Update profile
router.put('/update', protect, async (req, res) => {
  try {
    const { name, bio, location, website } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, location, website },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

// Update profile picture
router.put('/update-profile-picture', protect, (req, res) => {
  upload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        status: 'error',
        message: err.message
      });
    } else if (err) {
      return res.status(400).json({
        status: 'error',
        message: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Please upload an image'
      });
    }

    try {
      // Delete old profile picture if it exists and is not the default
      const currentUser = await User.findById(req.user._id);
      if (currentUser.profilePicture && 
          currentUser.profilePicture !== '/uploads/profiles/default-avatar.png') {
        const oldPicturePath = path.join(__dirname, '../..', currentUser.profilePicture);
        if (fs.existsSync(oldPicturePath)) {
          fs.unlinkSync(oldPicturePath);
        }
      }

      const profilePicture = '/uploads/profiles/' + req.file.filename;
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { profilePicture },
        { new: true }
      ).select('-password');

      res.status(200).json({
        status: 'success',
        data: user
      });
    } catch (error) {
      // Delete uploaded file if user update fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  });
});

module.exports = router;
