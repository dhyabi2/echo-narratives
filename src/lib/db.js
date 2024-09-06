import { openDB } from 'idb';

const DB_NAME = 'echoes-db';
const DB_VERSION = 3; // Increment the version to trigger an upgrade

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db, oldVersion, newVersion, transaction) {
    if (!db.objectStoreNames.contains('echoes')) {
      db.createObjectStore('echoes', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('categories')) {
      db.createObjectStore('categories', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('reactions')) {
      db.createObjectStore('reactions', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('playlists')) {
      db.createObjectStore('playlists', { keyPath: 'id', autoIncrement: true });
    }
    if (!db.objectStoreNames.contains('reports')) {
      db.createObjectStore('reports', { keyPath: 'id', autoIncrement: true });
    }
  },
});

export async function getEchoes() {
  return (await dbPromise).getAll('echoes');
}

export async function addEcho(echo) {
  return (await dbPromise).add('echoes', echo);
}

export async function getCategories() {
  return (await dbPromise).getAll('categories');
}

export async function addCategory(category) {
  return (await dbPromise).add('categories', category);
}

export async function addReaction(echoId, reactionType) {
  return (await dbPromise).add('reactions', { echoId, reactionType });
}

export async function removeReaction(reactionId) {
  return (await dbPromise).delete('reactions', reactionId);
}

export async function createPlaylist(playlist) {
  return (await dbPromise).add('playlists', playlist);
}

export async function getPlaylist(id) {
  return (await dbPromise).get('playlists', id);
}

export async function addEchoToPlaylist(playlistId, echoId) {
  const playlist = await getPlaylist(playlistId);
  playlist.echoes.push(echoId);
  return (await dbPromise).put('playlists', playlist);
}

export async function searchEchoes(query, filters) {
  const db = await dbPromise;
  const allEchoes = await db.getAll('echoes');
  return allEchoes.filter(echo => {
    const matchesQuery = echo.title.toLowerCase().includes(query.toLowerCase()) ||
                         echo.transcription.toLowerCase().includes(query.toLowerCase());
    const matchesFilters = Object.entries(filters).every(([key, value]) => echo[key] === value);
    return matchesQuery && matchesFilters;
  });
}

export async function reportEcho(echoId, reason) {
  return (await dbPromise).add('reports', { echoId, reason, date: new Date() });
}