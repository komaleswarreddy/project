const Story = require('../models/Story');
const multer = require('multer');
const path = require('path');

// Configure multer for story uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/stories/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|mp4/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg, .jpeg and .mp4 format allowed!'));
  }
}).single('media');

exports.uploadStory = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          status: 'error',
          message: err.message
        });
      }

      if (!req.file) {
        return res.status(400).json({
          status: 'error',
          message: 'Please upload a file'
        });
      }

      const story = await Story.create({
        user: req.user.id,
        media: `/uploads/stories/${req.file.filename}`,
        type: req.file.mimetype.startsWith('video') ? 'video' : 'image'
      });

      res.status(201).json({
        status: 'success',
        data: {
          story
        }
      });
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.getStories = async (req, res) => {
  try {
    // Get stories from users that the current user follows
    const stories = await Story.find({
      user: { $in: [...req.user.following, req.user.id] }
    })
    .populate('user', 'username profilePicture')
    .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      data: {
        stories
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.viewStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({
        status: 'error',
        message: 'Story not found'
      });
    }

    if (!story.viewers.includes(req.user.id)) {
      story.viewers.push(req.user.id);
      await story.save();
    }

    res.status(200).json({
      status: 'success',
      data: {
        story
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};
