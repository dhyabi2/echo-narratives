import { openDB } from 'idb';

const DB_NAME = 'echoes-db';
const DB_VERSION = 17;

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

    const echoesStore = transaction.objectStore('echoes');
    if (!echoesStore.indexNames.contains('country')) {
      echoesStore.createIndex('country', 'country', { unique: false });
    }
    if (!echoesStore.indexNames.contains('syncStatus')) {
      echoesStore.createIndex('syncStatus', 'syncStatus', { unique: false });
    }

    const usersStore = transaction.objectStore('users');
    if (!usersStore.indexNames.contains('country')) {
      usersStore.createIndex('country', 'country', { unique: false });
    }
  },
});

async function getAll(storeName) {
  return (await dbPromise).getAll(storeName);
}

async function add(storeName, item) {
  return (await dbPromise).add(storeName, { ...item, createdAt: new Date().toISOString(), syncStatus: 'unsynced' });
}

async function get(storeName, id) {
  return (await dbPromise).get(storeName, id);
}

async function put(storeName, item) {
  return (await dbPromise).put(storeName, { ...item, syncStatus: 'unsynced' });
}

async function remove(storeName, id) {
  return (await dbPromise).delete(storeName, id);
}

export const getEchoes = () => getAll('echoes');
export const addEcho = (echo) => add('echoes', echo);
export const getEchoById = (id) => get('echoes', id);
export const updateEcho = (echo) => put('echoes', echo);
export const deleteEcho = (id) => remove('echoes', id);

export const getEchoesByCountry = async (country) => {
  const db = await dbPromise;
  const tx = db.transaction('echoes', 'readonly');
  const store = tx.objectStore('echoes');
  const index = store.index('country');
  return index.getAll(country);
};

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
  const newComment = { ...comment, echoId, createdAt: new Date().toISOString(), syncStatus: 'unsynced' };
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
        syncStatus: 'unsynced'
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

// Function to trigger background sync
export const triggerBackgroundSync = () => {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then(registration => {
      registration.sync.register('sync-echoes');
    });
  }
};

// Function to handle offline actions
export const handleOfflineAction = async (action, data) => {
  await add('offlineActions', { action, data, timestamp: Date.now() });
  triggerBackgroundSync();
};

// Function to process offline actions when online
export const processOfflineActions = async () => {
  const actions = await getAll('offlineActions');
  for (const action of actions) {
    try {
      // Process the action based on its type
      switch (action.action) {
        case 'addEcho':
          await addEcho(action.data);
          break;
        case 'updateEcho':
          await updateEcho(action.data);
          break;
        case 'addComment':
          await addComment(action.data.echoId, action.data.comment);
          break;
        // Add more cases as needed
      }
      // Remove the processed action
      await remove('offlineActions', action.id);
    } catch (error) {
      console.error('Error processing offline action:', error);
    }
  }
};

// Initialize with sample data for each country
(async () => {
  const db = await dbPromise;
  const stores = ['echoes', 'badges', 'users'];
  const countries = ['SA', 'AE', 'OM', 'KW', 'QA', 'BH', 'IQ', 'YE'];
  
  const sampleData = {
    echoes: countries.flatMap(country => [
      { 
        title: `مرحبًا بك في اعترافات ${country}`, 
        content: `هذا هو أول اعتراف في ${country}!`, 
        likes: 0, 
        shares: 0,
        replies: 0,
        country: country,
        syncStatus: 'synced'
      }
    ]),
    badges: [
      { name: 'قادم جديد', description: 'مرحبًا بك في اعترافات!', icon: '🎉' },
      { name: 'كاتب نشط', description: 'نشر 10 اعترافات', icon: '🏆' },
      { name: 'صوت شعبي', description: 'حصل على 100 إعجاب', icon: '🌟' },
    ],
    users: countries.map(country => (
      { username: `مستخدم_تجريبي_${country}`, password: 'كلمة_مرور_مشفرة', email: `تجريبي_${country}@مثال.com`, country: country }
    )),
  };

  for (const storeName of stores) {
    const count = await db.count(storeName);
    if (count === 0) {
      const tx = db.transaction(storeName, 'readwrite');
      await Promise.all(sampleData[storeName].map(item => tx.store.add(item)));
    }
  }
})();