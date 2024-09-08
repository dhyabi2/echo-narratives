import { openDB } from 'idb';

const DB_NAME = 'echoes-db';
const DB_VERSION = 9;

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db, oldVersion, newVersion, transaction) {
    const stores = ['echoes', 'topics', 'comments', 'tags', 'bookmarks', 'reports', 'notifications', 'badges', 'categories', 'latestTrends', 'users'];
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

async function remove(storeName, id) {
  return (await dbPromise).delete(storeName, id);
}

export const getEchoes = () => getAll('echoes');
export const addEcho = async (echo) => {
  const db = await dbPromise;
  const tx = db.transaction(['echoes', 'topics', 'latestTrends'], 'readwrite');
  const echoStore = tx.objectStore('echoes');
  const topicStore = tx.objectStore('topics');
  const latestTrendsStore = tx.objectStore('latestTrends');

  const echoId = await echoStore.add({ ...echo, createdAt: new Date().toISOString() });

  const existingTopic = await topicStore.get(echo.trend);
  if (existingTopic) {
    existingTopic.echoCount += 1;
    await topicStore.put(existingTopic);
  } else {
    await topicStore.add({ name: echo.trend, echoCount: 1 });
  }

  const latestTrends = await latestTrendsStore.getAll();
  const trendIndex = latestTrends.findIndex(trend => trend.name === echo.trend);
  if (trendIndex !== -1) {
    latestTrends[trendIndex].echoCount += 1;
    latestTrends[trendIndex].lastUpdated = new Date().toISOString();
  } else {
    latestTrends.push({ name: echo.trend, echoCount: 1, lastUpdated: new Date().toISOString() });
  }
  latestTrends.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
  await latestTrendsStore.clear();
  await Promise.all(latestTrends.slice(0, 5).map(trend => latestTrendsStore.add(trend)));

  await tx.done;
  return echoId;
};
export const getEchoById = (id) => get('echoes', id);
export const updateEcho = (echo) => put('echoes', echo);
export const deleteEcho = (id) => remove('echoes', id);

export const getTrendingTopics = () => getAll('topics');
export const addTopic = (topic) => add('topics', topic);

export const getComments = (echoId) => getAll('comments').then(comments => comments.filter(comment => comment.echoId === echoId));
export const addComment = (comment) => add('comments', comment);
export const updateComment = (comment) => put('comments', comment);

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

export const getCategories = () => getAll('categories');
export const addCategory = (category) => add('categories', category);

export const getLatestTrends = () => getAll('latestTrends');

export const getUsers = () => getAll('users');
export const addUser = (user) => add('users', user);
export const updateUser = (user) => put('users', user);

// Initialize with sample data
(async () => {
  const db = await dbPromise;
  const stores = ['echoes', 'topics', 'badges', 'categories', 'latestTrends', 'users'];
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
    topics: ['General', 'Music', 'News', 'Technology', 'Sports'].map(name => ({ name, echoCount: name === 'General' ? 1 : 0 })),
    badges: [
      { name: 'Newcomer', description: 'Welcome to Echoes!', icon: '🎉' },
      { name: 'Frequent Poster', description: 'Posted 10 echoes', icon: '🏆' },
      { name: 'Popular Voice', description: 'Received 100 likes', icon: '🌟' },
    ],
    categories: ['General', 'Music', 'News', 'Technology', 'Sports'].map(name => ({ name })),
    latestTrends: ['General', 'Music', 'News', 'Technology', 'Sports'].map((name, index) => ({ 
      name, 
      echoCount: name === 'General' ? 1 : 5 - index, 
      lastUpdated: new Date(Date.now() - index * 86400000).toISOString() 
    })),
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