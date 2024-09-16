# Echoes API Implementation (Filesystem-based)

This document contains the full Node.js script that replaces all functionalities currently implemented using local storage and IndexedDB. This implementation uses the filesystem to store data in JSON files.

```javascript
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ECHOES_FILE = path.join(DATA_DIR, 'echoes.json');
const COMMENTS_FILE = path.join(DATA_DIR, 'comments.json');
const REPLIES_FILE = path.join(DATA_DIR, 'replies.json');
const TAGS_FILE = path.join(DATA_DIR, 'tags.json');
const BOOKMARKS_FILE = path.join(DATA_DIR, 'bookmarks.json');
const REPORTS_FILE = path.join(DATA_DIR, 'reports.json');

// Ensure data directory exists
fs.mkdir(DATA_DIR, { recursive: true }).catch(console.error);

// Helper function to read JSON file
async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

// Helper function to write JSON file
async function writeJsonFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Middleware for authentication
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const users = await readJsonFile(USERS_FILE);
    const user = users.find(u => u.id === decoded.id);
    if (!user) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

// User routes
app.post('/users/register', async (req, res) => {
  try {
    const { username, email, password, country } = req.body;
    const users = await readJsonFile(USERS_FILE);
    if (users.find(u => u.email === email)) {
      return res.status(400).send({ error: 'Email already in use.' });
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password: hashedPassword,
      country,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    await writeJsonFile(USERS_FILE, users);
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET);
    res.status(201).send({ user: newUser, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await readJsonFile(USERS_FILE);
    const user = users.find(u => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid login credentials');
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/users/profile', auth, (req, res) => {
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
    const users = await readJsonFile(USERS_FILE);
    const userIndex = users.findIndex(u => u.id === req.user.id);
    if (userIndex === -1) {
      return res.status(404).send();
    }
    updates.forEach((update) => users[userIndex][update] = req.body[update]);
    await writeJsonFile(USERS_FILE, users);
    res.send(users[userIndex]);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Echo routes
app.get('/echoes', auth, async (req, res) => {
  try {
    const { country, page = 1, limit = 10 } = req.query;
    let echoes = await readJsonFile(ECHOES_FILE);
    if (country) {
      echoes = echoes.filter(e => e.country === country);
    }
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = echoes.slice(startIndex, endIndex);
    res.send({
      echoes: results,
      totalPages: Math.ceil(echoes.length / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/echoes', auth, async (req, res) => {
  try {
    const echoes = await readJsonFile(ECHOES_FILE);
    const newEcho = {
      id: Date.now().toString(),
      ...req.body,
      userId: req.user.id,
      createdAt: new Date().toISOString(),
      likes: 0,
      shares: 0,
      replies: 0
    };
    echoes.push(newEcho);
    await writeJsonFile(ECHOES_FILE, echoes);
    res.status(201).send(newEcho);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/echoes/:id', auth, async (req, res) => {
  try {
    const echoes = await readJsonFile(ECHOES_FILE);
    const echo = echoes.find(e => e.id === req.params.id);
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
    const echoes = await readJsonFile(ECHOES_FILE);
    const echoIndex = echoes.findIndex(e => e.id === req.params.id && e.userId === req.user.id);
    if (echoIndex === -1) {
      return res.status(404).send();
    }
    updates.forEach((update) => echoes[echoIndex][update] = req.body[update]);
    await writeJsonFile(ECHOES_FILE, echoes);
    res.send(echoes[echoIndex]);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete('/echoes/:id', auth, async (req, res) => {
  try {
    const echoes = await readJsonFile(ECHOES_FILE);
    const echoIndex = echoes.findIndex(e => e.id === req.params.id && e.userId === req.user.id);
    if (echoIndex === -1) {
      return res.status(404).send();
    }
    const [deletedEcho] = echoes.splice(echoIndex, 1);
    await writeJsonFile(ECHOES_FILE, echoes);
    res.send(deletedEcho);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/echoes/:id/like', auth, async (req, res) => {
  try {
    const echoes = await readJsonFile(ECHOES_FILE);
    const echoIndex = echoes.findIndex(e => e.id === req.params.id);
    if (echoIndex === -1) {
      return res.status(404).send();
    }
    echoes[echoIndex].likes += 1;
    await writeJsonFile(ECHOES_FILE, echoes);
    res.send({ likes: echoes[echoIndex].likes });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post('/echoes/:id/unlike', auth, async (req, res) => {
  try {
    const echoes = await readJsonFile(ECHOES_FILE);
    const echoIndex = echoes.findIndex(e => e.id === req.params.id);
    if (echoIndex === -1) {
      return res.status(404).send();
    }
    echoes[echoIndex].likes = Math.max(0, echoes[echoIndex].likes - 1);
    await writeJsonFile(ECHOES_FILE, echoes);
    res.send({ likes: echoes[echoIndex].likes });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Comment routes
app.get('/echoes/:echoId/comments', auth, async (req, res) => {
  try {
    const comments = await readJsonFile(COMMENTS_FILE);
    const echoComments = comments.filter(c => c.echoId === req.params.echoId);
    res.send(echoComments);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/echoes/:echoId/comments', auth, async (req, res) => {
  try {
    const comments = await readJsonFile(COMMENTS_FILE);
    const newComment = {
      id: Date.now().toString(),
      echoId: req.params.echoId,
      userId: req.user.id,
      audioData: req.body.audioData,
      createdAt: new Date().toISOString(),
      likes: 0
    };
    comments.push(newComment);
    await writeJsonFile(COMMENTS_FILE, comments);
    res.status(201).send(newComment);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Reply routes
app.get('/comments/:commentId/replies', auth, async (req, res) => {
  try {
    const replies = await readJsonFile(REPLIES_FILE);
    const commentReplies = replies.filter(r => r.commentId === req.params.commentId);
    res.send(commentReplies);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/comments/:commentId/replies', auth, async (req, res) => {
  try {
    const replies = await readJsonFile(REPLIES_FILE);
    const newReply = {
      id: Date.now().toString(),
      commentId: req.params.commentId,
      userId: req.user.id,
      audioData: req.body.audioData,
      createdAt: new Date().toISOString(),
      likes: 0
    };
    replies.push(newReply);
    await writeJsonFile(REPLIES_FILE, replies);
    res.status(201).send(newReply);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Tag routes
app.get('/tags', auth, async (req, res) => {
  try {
    const tags = await readJsonFile(TAGS_FILE);
    res.send(tags);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/tags', auth, async (req, res) => {
  try {
    const tags = await readJsonFile(TAGS_FILE);
    const newTag = {
      id: Date.now().toString(),
      name: req.body.name,
      createdAt: new Date().toISOString()
    };
    tags.push(newTag);
    await writeJsonFile(TAGS_FILE, tags);
    res.status(201).send(newTag);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Bookmark routes
app.get('/bookmarks', auth, async (req, res) => {
  try {
    const bookmarks = await readJsonFile(BOOKMARKS_FILE);
    const userBookmarks = bookmarks.filter(b => b.userId === req.user.id);
    const echoes = await readJsonFile(ECHOES_FILE);
    const bookmarkedEchoes = userBookmarks.map(bookmark => 
      echoes.find(echo => echo.id === bookmark.echoId)
    ).filter(Boolean);
    res.send(bookmarkedEchoes);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/bookmarks', auth, async (req, res) => {
  try {
    const bookmarks = await readJsonFile(BOOKMARKS_FILE);
    const newBookmark = {
      id: Date.now().toString(),
      userId: req.user.id,
      echoId: req.body.echoId,
      createdAt: new Date().toISOString()
    };
    bookmarks.push(newBookmark);
    await writeJsonFile(BOOKMARKS_FILE, bookmarks);
    res.status(201).send(newBookmark);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete('/bookmarks/:echoId', auth, async (req, res) => {
  try {
    let bookmarks = await readJsonFile(BOOKMARKS_FILE);
    const bookmarkIndex = bookmarks.findIndex(b => b.echoId === req.params.echoId && b.userId === req.user.id);
    if (bookmarkIndex === -1) {
      return res.status(404).send();
    }
    const [deletedBookmark] = bookmarks.splice(bookmarkIndex, 1);
    await writeJsonFile(BOOKMARKS_FILE, bookmarks);
    res.send(deletedBookmark);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Report route
app.post('/reports', auth, async (req, res) => {
  try {
    const reports = await readJsonFile(REPORTS_FILE);
    const newReport = {
      id: Date.now().toString(),
      userId: req.user.id,
      echoId: req.body.echoId,
      reason: req.body.reason,
      createdAt: new Date().toISOString()
    };
    reports.push(newReport);
    await writeJsonFile(REPORTS_FILE, reports);
    res.status(201).send(newReport);
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

To use this script:

1. Install the required dependencies:
   ```
   npm install express bcryptjs jsonwebtoken multer cors dotenv
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```

3. Run the script using Node.js:
   ```
   node app.js
   ```

This implementation uses JSON files to store data instead of a database. Each entity (users, echoes, comments, etc.) is stored in its own JSON file in a `data` directory. The script includes basic CRUD operations and authentication using JWT.

Note that this filesystem-based approach is suitable for small to medium-sized applications but may not be ideal for large-scale production use due to potential performance and concurrency issues. For production environments, consider using a proper database system.