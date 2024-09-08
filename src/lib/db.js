import { openDB } from 'idb';

const DB_NAME = 'echoes-db';
const DB_VERSION = 7;

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db, oldVersion, newVersion, transaction) {
    const stores = ['echoes', 'topics', 'comments', 'tags', 'bookmarks', 'reports', 'notifications', 'badges', 'categories'];
    stores.forEach(store => {
      if (!db.objectStoreNames.contains(store)) {
        db.createObjectStore(store, { keyPath: 'id', autoIncrement: true });
      }
    });
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

export const getEchoes = () => getAll('echoes');
export const addEcho = async (echo) => {
  const db = await dbPromise;
  const tx = db.transaction(['echoes', 'topics'], 'readwrite');
  const echoStore = tx.objectStore('echoes');
  const topicStore = tx.objectStore('topics');

  // Add the echo
  const echoId = await echoStore.add({ ...echo, createdAt: new Date().toISOString() });

  // Update or add the topic
  const existingTopic = await topicStore.get(echo.trend);
  if (existingTopic) {
    existingTopic.echoCount += 1;
    await topicStore.put(existingTopic);
  } else {
    await topicStore.add({ name: echo.trend, echoCount: 1 });
  }

  await tx.done;
  return echoId;
};
export const getEchoById = (id) => get('echoes', id);
export const updateEcho = (echo) => put('echoes', echo);

export const getTrendingTopics = () => getAll('topics');
export const addTopic = (topic) => add('topics', topic);

export const getComments = async (echoId) => {
  const db = await dbPromise;
  const tx = db.transaction('comments', 'readonly');
  const store = tx.objectStore('comments');
  return store.getAll(IDBKeyRange.only(echoId));
};
export const addComment = (comment) => add('comments', comment);

export const getTags = () => getAll('tags');
export const addTag = (tag) => add('tags', tag);

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

export const getCategories = () => getAll('categories');
export const addCategory = (category) => add('categories', category);

// Initialize with sample data
(async () => {
  const db = await dbPromise;
  const stores = ['echoes', 'topics', 'badges', 'categories'];
  const sampleData = {
    echoes: [
      { 
        title: 'Welcome to Echoes', 
        content: 'This is your first echo!', 
        trend: 'General', 
        likes: 0, 
        shares: 0,
        replies: 0
      }
    ],
    topics: ['General', 'Music', 'News', 'Technology', 'Sports'].map(name => ({ name, echoCount: 0 })),
    badges: [
      { name: 'Newcomer', description: 'Welcome to Echoes!', icon: '🎉' },
      { name: 'Frequent Poster', description: 'Posted 10 echoes', icon: '🏆' },
      { name: 'Popular Voice', description: 'Received 100 likes', icon: '🌟' },
    ],
    categories: ['General', 'Music', 'News', 'Technology', 'Sports'].map(name => ({ name })),
  };

  for (const storeName of stores) {
    const count = await db.count(storeName);
    if (count === 0) {
      const tx = db.transaction(storeName, 'readwrite');
      await Promise.all(sampleData[storeName].map(item => tx.store.add(item)));
    }
  }
})();