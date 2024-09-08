import { openDB } from 'idb';

const DB_NAME = 'echoes-db';
const DB_VERSION = 12;

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db, oldVersion, newVersion, transaction) {
    const stores = ['echoes', 'comments', 'tags', 'bookmarks', 'reports', 'notifications', 'badges', 'users', 'replies'];
    stores.forEach(store => {
      if (!db.objectStoreNames.contains(store)) {
        db.createObjectStore(store, { keyPath: 'id', autoIncrement: true });
      }
    });
    
    const commentsStore = transaction.objectStore('comments');
    if (!commentsStore.indexNames.contains('echoId')) {
      commentsStore.createIndex('echoId', 'echoId', { unique: false });
    }

    const repliesStore = transaction.objectStore('replies');
    if (!repliesStore.indexNames.contains('commentId')) {
      repliesStore.createIndex('commentId', 'commentId', { unique: false });
    }
  },
});

async function getAll(storeName) {
  return (await dbPromise).getAll(storeName);
}

async function add(storeName, item) {
  return (await dbPromise).add(storeName, { ...item, createdAt: new Date().toISOString() });
}

async function get(storeName, id) {
  return (await dbPromise).get(storeName, id);
}

async function put(storeName, item) {
  return (await dbPromise).put(storeName, item);
}

async function remove(storeName, id) {
  return (await dbPromise).delete(storeName, id);
}

export const getEchoes = () => getAll('echoes');
export const addEcho = (echo) => add('echoes', echo);
export const getEchoById = (id) => get('echoes', id);
export const updateEcho = (echo) => put('echoes', echo);
export const deleteEcho = (id) => remove('echoes', id);

export const getComments = async (echoId) => {
  const db = await dbPromise;
  const tx = db.transaction(['comments', 'replies'], 'readonly');
  const commentsStore = tx.objectStore('comments');
  const repliesStore = tx.objectStore('replies');
  const commentsIndex = commentsStore.index('echoId');
  const comments = await commentsIndex.getAll(echoId);

  for (let comment of comments) {
    const repliesIndex = repliesStore.index('commentId');
    comment.replies = await repliesIndex.getAll(comment.id);
  }

  return comments;
};

export const addComment = async (echoId, comment) => {
  const newComment = { ...comment, echoId, createdAt: new Date().toISOString() };
  const id = await add('comments', newComment);
  return { ...newComment, id };
};

export const updateComment = (comment) => put('comments', comment);

export const addReply = async (commentId, audioBlob) => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onloadend = async () => {
      const base64AudioData = reader.result;
      const newReply = {
        commentId,
        audioData: base64AudioData,
        createdAt: new Date().toISOString(),
        likes: 0,
      };
      const id = await add('replies', newReply);
      resolve({ ...newReply, id });
    };
    reader.onerror = reject;
    reader.readAsDataURL(audioBlob);
  });
};

export const getTags = () => getAll('tags');
export const addTag = (tag) => add('tags', tag);

export const getBookmarks = () => getAll('bookmarks');
export const addBookmark = (bookmark) => add('bookmarks', bookmark);
export const removeBookmark = (id) => remove('bookmarks', id);

export const reportEcho = (report) => add('reports', report);

export const getNotifications = () => getAll('notifications');
export const addNotification = (notification) => add('notifications', notification);
export const clearNotifications = async () => {
  const db = await dbPromise;
  const tx = db.transaction('notifications', 'readwrite');
  await tx.objectStore('notifications').clear();
};

export const getBadges = () => getAll('badges');
export const addBadge = (badge) => add('badges', badge);

export const getUsers = () => getAll('users');
export const addUser = (user) => add('users', user);
export const updateUser = (user) => put('users', user);

// Initialize with sample data
(async () => {
  const db = await dbPromise;
  const stores = ['echoes', 'badges', 'users'];
  const sampleData = {
    echoes: [
      { 
        title: 'Welcome to Echoes', 
        content: 'This is your first echo!', 
        likes: 0, 
        shares: 0,
        replies: 0
      }
    ],
    badges: [
      { name: 'Newcomer', description: 'Welcome to Echoes!', icon: '🎉' },
      { name: 'Frequent Poster', description: 'Posted 10 echoes', icon: '🏆' },
      { name: 'Popular Voice', description: 'Received 100 likes', icon: '🌟' },
    ],
    users: [
      { username: 'demo_user', password: 'hashed_password', email: 'demo@example.com' }
    ],
  };

  for (const storeName of stores) {
    const count = await db.count(storeName);
    if (count === 0) {
      const tx = db.transaction(storeName, 'readwrite');
      await Promise.all(sampleData[storeName].map(item => tx.store.add(item)));
    }
  }
})();