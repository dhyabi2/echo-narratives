import { openDB } from 'idb';

const dbPromise = openDB('echoes-db', 1, {
  upgrade(db) {
    db.createObjectStore('echoes', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('categories', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('notifications', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('badges', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('follows', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('reactions', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('playlists', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('achievements', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('reports', { keyPath: 'id', autoIncrement: true });
  },
});

// Existing functions...

export async function getUser(id) {
  return (await dbPromise).get('users', id);
}

export async function addUser(user) {
  return (await dbPromise).add('users', user);
}

export async function updateUser(user) {
  return (await dbPromise).put('users', user);
}

export async function followUser(followerId, followedId) {
  return (await dbPromise).add('follows', { followerId, followedId });
}

export async function unfollowUser(followerId, followedId) {
  const db = await dbPromise;
  const follow = await db.getAll('follows', IDBKeyRange.only([followerId, followedId]));
  if (follow.length > 0) {
    return db.delete('follows', follow[0].id);
  }
}

export async function addReaction(echoId, userId, reactionType) {
  return (await dbPromise).add('reactions', { echoId, userId, reactionType });
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

export async function addAchievement(userId, achievementType) {
  return (await dbPromise).add('achievements', { userId, achievementType, date: new Date() });
}

export async function reportEcho(echoId, userId, reason) {
  return (await dbPromise).add('reports', { echoId, userId, reason, date: new Date() });
}

export async function getRecommendedEchoes(userId) {
  // This is a simple recommendation system. In a real app, you'd use more sophisticated algorithms.
  const db = await dbPromise;
  const user = await db.get('users', userId);
  const allEchoes = await db.getAll('echoes');
  return allEchoes.filter(echo => echo.category === user.preferredCategory).slice(0, 10);
}