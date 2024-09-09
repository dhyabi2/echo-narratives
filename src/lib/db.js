import { openDB } from 'idb';

const DB_NAME = 'echoes-db';
const DB_VERSION = 20;

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db, oldVersion, newVersion, transaction) {
    const stores = ['echoes', 'comments', 'tags', 'bookmarks', 'reports', 'notifications', 'badges', 'users', 'replies', 'userSettings'];
    stores.forEach(store => {
      if (!db.objectStoreNames.contains(store)) {
        db.createObjectStore(store, { keyPath: 'id', autoIncrement: true });
      }
    });
    
    const echoesStore = transaction.objectStore('echoes');
    if (!echoesStore.indexNames.contains('country')) {
      echoesStore.createIndex('country', 'country', { unique: false });
    }
    if (!echoesStore.indexNames.contains('syncStatus')) {
      echoesStore.createIndex('syncStatus', 'syncStatus', { unique: false });
    }
    if (!echoesStore.indexNames.contains('recorderName')) {
      echoesStore.createIndex('recorderName', 'recorderName', { unique: false });
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

export const getUserSettings = async () => {
  const settings = await getAll('userSettings');
  return settings[0] || null;
};

export const updateUserSettings = async (settings) => {
  const existingSettings = await getUserSettings();
  if (existingSettings) {
    return put('userSettings', { ...existingSettings, ...settings });
  } else {
    return add('userSettings', settings);
  }
};

export const triggerBackgroundSync = () => {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then(registration => {
      registration.sync.register('sync-echoes');
    });
  }
};

export const handleOfflineAction = async (action, data) => {
  await add('offlineActions', { action, data, timestamp: Date.now() });
  triggerBackgroundSync();
};

export const processOfflineActions = async () => {
  const actions = await getAll('offlineActions');
  for (const action of actions) {
    try {
      switch (action.action) {
        case 'addEcho':
          await addEcho(action.data);
          break;
        case 'updateEcho':
          await updateEcho(action.data);
          break;
      }
      await remove('offlineActions', action.id);
    } catch (error) {
      console.error('Error processing offline action:', error);
    }
  }
};

// Initialize sample data
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
        syncStatus: 'synced',
        recorderName: null
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