import { openDB } from 'idb';

const DB_NAME = 'echoes-db';
const DB_VERSION = 4;

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db, oldVersion, newVersion, transaction) {
    if (!db.objectStoreNames.contains('echoes')) {
      db.createObjectStore('echoes', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('categories')) {
      db.createObjectStore('categories', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('comments')) {
      db.createObjectStore('comments', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('tags')) {
      db.createObjectStore('tags', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('bookmarks')) {
      db.createObjectStore('bookmarks', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('reports')) {
      db.createObjectStore('reports', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('notifications')) {
      db.createObjectStore('notifications', { keyPath: 'id', autoIncrement: true });
    }
  },
});

export async function getEchoes() {
  return (await dbPromise).getAll('echoes');
}

export async function addEcho(echo) {
  return (await dbPromise).add('echoes', { ...echo, createdAt: new Date().toISOString() });
}

export async function getEchoById(id) {
  return (await dbPromise).get('echoes', id);
}

export async function updateEchoLikes(id, likes) {
  const db = await dbPromise;
  const tx = db.transaction('echoes', 'readwrite');
  const store = tx.objectStore('echoes');
  const echo = await store.get(id);
  echo.likes = likes;
  await store.put(echo);
  return echo;
}

export async function getCategories() {
  return (await dbPromise).getAll('categories');
}

export async function addCategory(category) {
  return (await dbPromise).add('categories', category);
}

export async function getComments(echoId) {
  const db = await dbPromise;
  const tx = db.transaction('comments', 'readonly');
  const store = tx.objectStore('comments');
  return store.getAll(IDBKeyRange.only(echoId));
}

export async function addComment(echoId, content) {
  return (await dbPromise).add('comments', {
    echoId,
    content,
    createdAt: new Date().toISOString(),
  });
}

export async function getTags() {
  return (await dbPromise).getAll('tags');
}

export async function addTag(tag) {
  return (await dbPromise).add('tags', tag);
}

export async function reportEcho(echoId, reason) {
  return (await dbPromise).add('reports', {
    echoId,
    reason,
    createdAt: new Date().toISOString(),
  });
}

export async function getEchoTranscript(echoId) {
  const echo = await getEchoById(echoId);
  return echo.transcript || 'Transcript not available';
}

export async function getRelatedEchoes(echoId) {
  const echo = await getEchoById(echoId);
  const allEchoes = await getEchoes();
  return allEchoes
    .filter(e => e.id !== echoId && e.category === echo.category)
    .slice(0, 5);
}

export async function isEchoBookmarked(echoId) {
  const db = await dbPromise;
  const bookmark = await db.get('bookmarks', echoId);
  return !!bookmark;
}

export async function toggleEchoBookmark(echoId) {
  const db = await dbPromise;
  const tx = db.transaction('bookmarks', 'readwrite');
  const store = tx.objectStore('bookmarks');
  
  const existingBookmark = await store.get(echoId);
  if (existingBookmark) {
    await store.delete(echoId);
    return false;
  } else {
    await store.add({ id: echoId, createdAt: new Date().toISOString() });
    return true;
  }
}

export async function addEchoReply(echoId, content) {
  const reply = {
    echoId,
    content,
    createdAt: new Date().toISOString(),
  };
  const id = await (await dbPromise).add('comments', reply);
  return { ...reply, id };
}

export async function getNotifications() {
  return (await dbPromise).getAll('notifications');
}

export async function addNotification(notification) {
  return (await dbPromise).add('notifications', {
    ...notification,
    createdAt: new Date().toISOString(),
  });
}

export async function clearNotifications() {
  const db = await dbPromise;
  const tx = db.transaction('notifications', 'readwrite');
  const store = tx.objectStore('notifications');
  await store.clear();
}

// Initialize with some sample data
(async () => {
  const db = await dbPromise;
  const echoes = await db.getAll('echoes');
  const categories = await db.getAll('categories');

  if (echoes.length === 0) {
    await addEcho({
      title: 'Welcome to Echoes',
      content: 'This is your first echo!',
      category: 'General',
      likes: 0,
      shares: 0,
    });
  }

  if (categories.length === 0) {
    const sampleCategories = ['General', 'Music', 'News', 'Technology', 'Sports'];
    for (const category of sampleCategories) {
      await addCategory({ name: category });
    }
  }
})();