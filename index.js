const port = 5000;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Express app is running");
});

mongoose.connect('mongodb://localhost:27017/project', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// Define Schemas

const postSchema = new mongoose.Schema({
  caption: String,
  fileUrl: String,
  isStory: Boolean,
  username:String,
  profile:String,
  createdAt: { type: Date, default: Date.now },
});
const Post = mongoose.model("Post", postSchema);

const userProfileSchema = new mongoose.Schema({
  username: String,
  fullName: String,
  avatar: String,
  bio: String,
  location: String,
  stats: {
    posts: Number,
    followers: Number,
    following: Number,
  },
});
const UserProfile = mongoose.model("userprofile", userProfileSchema);

const commentSchema = new mongoose.Schema({
  reelId: Number, // The reel the comment belongs to
  username: String,
  text: String,
  createdAt: { type: Date, default: Date.now },
});
const Comment = mongoose.model("Comment", commentSchema);

// New: Like Schema
const likeSchema = new mongoose.Schema({
  reelId: Number,
  username: String,
  action: String, // "like" or "unlike"
  createdAt: { type: Date, default: Date.now },
});
const Like = mongoose.model("Like", likeSchema);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: path.resolve(__dirname,'uploads'),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage:storage });
app.use('/images',express.static(path.join(__dirname,'uploads')))
// API to create a post
app.post("/posts", upload.single("file"), async (req, res) => {
  try {
    const { caption, isStory,username,profile } = req.body;
    const fileUrl =`http://localhost:${port}/images/${req.file.filename}`

    const newPost = new Post({ caption, fileUrl, isStory,username,profile });
    await newPost.save();

    res.status(201).json({ message: "Post created", post: newPost });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.use('/images',express.static(path.join(__dirname,'uploads')))

// API to fetch all posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find({})
    console.log(posts)
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  
});
app.get('/story', async (req, res) => {
  try {
    const posts = await Post.find({ isStory: true }) // Sort by creation time, descending
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/userProfile", async (req, res) => {
  try {
    console.log("Fetching user profile");
    const profile = await UserProfile.findOne();
    if (!profile) {
      return res.status(404).json({ message: "User profile not found" });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

app.post("/userProfile", async (req, res) => {
  try {
    console.log("Creating user profile");
    const newProfile = new UserProfile(req.body);
    await newProfile.save();
    res.status(201).json({ message: "Profile created", profile: newProfile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// app.put("/userProfile", async (req, res) => {
//   try {
//     const updatedProfile = await UserProfile.findOneAndUpdate({}, req.body, { new: true });
//     res.json(updatedProfile);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// API to save comments for reels
app.post("/comments", async (req, res) => {
  try {
    // Expecting reelId, username, and text in the request body.
    const { reelId, username, text } = req.body;
    if (!reelId || !username || !text) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const newComment = new Comment({ reelId, username, text });
    await newComment.save();
    res.status(201).json({ message: "Comment saved", comment: newComment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API to fetch comments for a specific reel
app.get("/comments/:reelId", async (req, res) => {
  try {
    const { reelId } = req.params;
    const comments = await Comment.find({ reelId: Number(reelId) }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// NEW: API endpoint to handle likes
app.post("/likes", async (req, res) => {
  try {
    // Expecting reelId, username, and action ("like" or "unlike") in the request body.
    const { reelId, username, action } = req.body;
    if (!reelId || !username || !action) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    const newLike = new Like({ reelId, username, action });
    await newLike.save();
    res.status(201).json({ message: "Like recorded", like: newLike });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/userProfile', upload.single('avatar'), async (req, res) => {
  const { fullName, bio, location } = req.body;
  let avatarUrl = req.body.avatar;  // Default if no new image is uploaded

  // If a new avatar file is uploaded, update the avatar URL
  if (req.file) {
    avatarUrl = `http://localhost:${port}/images/${req.file.filename}`;  // URL to the uploaded image
  }

  // Create the updated profile object
  const updatedProfile = {
    fullName,
    bio,
    location,
    avatar: avatarUrl,  // Set the avatar to the uploaded image URL
  };

  try {
    // Update the profile in the database. We're assuming there's only one profile, 
    // so we use `findOneAndUpdate` to update it.
    const profile = await UserProfile.findOneAndUpdate({}, updatedProfile, { new: true });

    if (!profile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // Respond with the updated profile
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server started and running on port ${port}...`);
});
