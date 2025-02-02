const Post = require('../models/Post');
const multer = require('multer');
const path = require('path');

// Configure multer for post uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/posts/');
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
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
}).single('media');

exports.createPost = async (req, res) => {
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
          message: 'Please upload an image'
        });
      }

      const post = await Post.create({
        user: req.user.id,
        caption: req.body.caption,
        location: req.body.location,
        media: `/uploads/posts/${req.file.filename}`
      });

      res.status(201).json({
        status: 'success',
        data: {
          post
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

exports.getFeed = async (req, res) => {
  try {
    const posts = await Post.find({
      user: { $in: [...req.user.following, req.user.id] }
    })
    .populate('user', 'username profilePicture')
    .populate('comments.user', 'username profilePicture')
    .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      data: {
        posts
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    const likeIndex = post.likes.indexOf(req.user.id);
    
    if (likeIndex === -1) {
      post.likes.push(req.user.id);
    } else {
      post.likes.splice(likeIndex, 1);
    }

    await post.save();

    res.status(200).json({
      status: 'success',
      data: {
        post
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: 'Post not found'
      });
    }

    post.comments.push({
      user: req.user.id,
      text: req.body.text
    });

    await post.save();

    const populatedPost = await Post.findById(post._id)
      .populate('comments.user', 'username profilePicture');

    res.status(200).json({
      status: 'success',
      data: {
        post: populatedPost
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};
