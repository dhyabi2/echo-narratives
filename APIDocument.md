# Echoes API Implementation

This document contains the full Node.js script that replaces all functionalities currently implemented using local storage and IndexedDB. This script serves as the backend for the Echoes application.

```javascript
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Models
const User = mongoose.model('User', {
  username: String,
  email: String,
  password: String,
  country: String,
  bio: String,
  avatar: String,
  createdAt: { type: Date, default: Date.now }
});

const Echo = mongoose.model('Echo', {
  title: String,
  audioData: String,
  country: String,
  tags: [String],
  likes: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  replies: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

const Comment = mongoose.model('Comment', {
  audioData: String,
  echo: { type: mongoose.Schema.Types.ObjectId, ref: 'Echo' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Reply = mongoose.model('Reply', {
  audioData: String,
  comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Tag = mongoose.model('Tag', {
  name: String
});

const Bookmark = mongoose.model('Bookmark', {
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  echo: { type: mongoose.Schema.Types.ObjectId, ref: 'Echo' },
  createdAt: { type: Date, default: Date.now }
});

const Report = mongoose.model('Report', {
  echo: { type: mongoose.Schema.Types.ObjectId, ref: 'Echo' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reason: String,
  createdAt: { type: Date, default: Date.now }
});

// Middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

// Routes

// User Management
app.post('/users/register', async (req, res) => {
  try {
    const { username, email, password, country } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    const user = new User({ username, email, password: hashedPassword, country });
    await user.save();
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid login credentials');
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/users/profile', auth, async (req, res) => {
  res.send(req.user);
});

app.put('/users/profile', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['username', 'email', 'bio', 'avatar'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }
  try {
    updates.forEach((update) => req.user[update] = req.body[update]);
    await req.user.save();
    res.send(req.user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Echoes
app.get('/echoes', auth, async (req, res) => {
  try {
    const { country, page = 1, limit = 10 } = req.query;
    const query = country ? { country } : {};
    const echoes = await Echo.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Echo.countDocuments(query);
    res.send({
      echoes,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/echoes', auth, async (req, res) => {
  try {
    const echo = new Echo({
      ...req.body,
      user: req.user._id
    });
    await echo.save();
    res.status(201).send(echo);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/echoes/:id', auth, async (req, res) => {
  try {
    const echo = await Echo.findById(req.params.id);
    if (!echo) {
      return res.status(404).send();
    }
    res.send(echo);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/echoes/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'audioData', 'tags'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }
  try {
    const echo = await Echo.findOne({ _id: req.params.id, user: req.user._id });
    if (!echo) {
      return res.status(404).send();
    }
    updates.forEach((update) => echo[update] = req.body[update]);
    await echo.save();
    res.send(echo);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete('/echoes/:id', auth, async (req, res) => {
  try {
    const echo = await Echo.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!echo) {
      return res.status(404).send();
    }
    res.send(echo);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/echoes/:id/like', auth, async (req, res) => {
  try {
    const echo = await Echo.findById(req.params.id);
    if (!echo) {
      return res.status(404).send();
    }
    echo.likes += 1;
    await echo.save();
    res.send({ likes: echo.likes });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post('/echoes/:id/unlike', auth, async (req, res) => {
  try {
    const echo = await Echo.findById(req.params.id);
    if (!echo) {
      return res.status(404).send();
    }
    echo.likes = Math.max(0, echo.likes - 1);
    await echo.save();
    res.send({ likes: echo.likes });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Comments
app.get('/echoes/:echoId/comments', auth, async (req, res) => {
  try {
    const comments = await Comment.find({ echo: req.params.echoId }).sort({ createdAt: -1 });
    res.send(comments);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/echoes/:echoId/comments', auth, async (req, res) => {
  try {
    const comment = new Comment({
      ...req.body,
      echo: req.params.echoId,
      user: req.user._id
    });
    await comment.save();
    res.status(201).send(comment);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.put('/comments/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id, user: req.user._id });
    if (!comment) {
      return res.status(404).send();
    }
    comment.audioData = req.body.audioData;
    await comment.save();
    res.send(comment);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete('/comments/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!comment) {
      return res.status(404).send();
    }
    res.send(comment);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/comments/:id/like', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).send();
    }
    comment.likes += 1;
    await comment.save();
    res.send({ likes: comment.likes });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post('/comments/:id/unlike', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).send();
    }
    comment.likes = Math.max(0, comment.likes - 1);
    await comment.save();
    res.send({ likes: comment.likes });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Replies
app.get('/comments/:commentId/replies', auth, async (req, res) => {
  try {
    const replies = await Reply.find({ comment: req.params.commentId }).sort({ createdAt: -1 });
    res.send(replies);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/comments/:commentId/replies', auth, async (req, res) => {
  try {
    const reply = new Reply({
      ...req.body,
      comment: req.params.commentId,
      user: req.user._id
    });
    await reply.save();
    res.status(201).send(reply);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.put('/replies/:id', auth, async (req, res) => {
  try {
    const reply = await Reply.findOne({ _id: req.params.id, user: req.user._id });
    if (!reply) {
      return res.status(404).send();
    }
    reply.audioData = req.body.audioData;
    await reply.save();
    res.send(reply);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete('/replies/:id', auth, async (req, res) => {
  try {
    const reply = await Reply.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!reply) {
      return res.status(404).send();
    }
    res.send(reply);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/replies/:id/like', auth, async (req, res) => {
  try {
    const reply = await Reply.findById(req.params.id);
    if (!reply) {
      return res.status(404).send();
    }
    reply.likes += 1;
    await reply.save();
    res.send({ likes: reply.likes });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post('/replies/:id/unlike', auth, async (req, res) => {
  try {
    const reply = await Reply.findById(req.params.id);
    if (!reply) {
      return res.status(404).send();
    }
    reply.likes = Math.max(0, reply.likes - 1);
    await reply.save();
    res.send({ likes: reply.likes });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Tags
app.get('/tags', auth, async (req, res) => {
  try {
    const tags = await Tag.find();
    res.send(tags);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/tags', auth, async (req, res) => {
  try {
    const tag = new Tag(req.body);
    await tag.save();
    res.status(201).send(tag);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Bookmarks
app.get('/bookmarks', auth, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id }).populate('echo');
    res.send(bookmarks);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/bookmarks', auth, async (req, res) => {
  try {
    const bookmark = new Bookmark({
      user: req.user._id,
      echo: req.body.echoId
    });
    await bookmark.save();
    res.status(201).send(bookmark);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete('/bookmarks/:echoId', auth, async (req, res) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({ user: req.user._id, echo: req.params.echoId });
    if (!bookmark) {
      return res.status(404).send();
    }
    res.send(bookmark);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Reports
app.post('/reports', auth, async (req, res) => {
  try {
    const report = new Report({
      ...req.body,
      user: req.user._id
    });
    await report.save();
    res.status(201).send(report);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

This Node.js script provides a complete backend implementation for the Echoes application, replacing all functionalities previously handled by local storage and IndexedDB. It includes user authentication, CRUD operations for echoes, comments, replies, tags, bookmarks, and reports.

To use this script:

1. Install the required dependencies:
   ```
   npm install express mongoose bcryptjs jsonwebtoken multer cors dotenv
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```

3. Run the script using Node.js:
   ```
   node app.js
   ```

Make sure to update your frontend application to use these API endpoints instead of local storage and IndexedDB operations.