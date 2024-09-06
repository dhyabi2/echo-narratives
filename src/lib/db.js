import { openDB } from 'idb';

const dbPromise = openDB('echoes-db', 1, {
  upgrade(db) {
    db.createObjectStore('echoes', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('categories', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('notifications', { keyPath: 'id', autoIncrement: true });
    db.createObjectStore('badges', { keyPath: 'id', autoIncrement: true });
  },
});

export async function getEchoes() {
  return (await dbPromise).getAll('echoes');
}

export async function addEcho(echo) {
  return (await dbPromise).add('echoes', echo);
}

export async function updateEcho(echo) {
  return (await dbPromise).put('echoes', echo);
}

export async function deleteEcho(id) {
  return (await dbPromise).delete('echoes', id);
}

export async function getCategories() {
  return (await dbPromise).getAll('categories');
}

export async function addCategory(category) {
  return (await dbPromise).add('categories', category);
}

export async function getNotifications() {
  return (await dbPromise).getAll('notifications');
}

export async function addNotification(notification) {
  return (await dbPromise).add('notifications', notification);
}

export async function clearNotifications() {
  return (await dbPromise).clear('notifications');
}

export async function getBadges() {
  return (await dbPromise).getAll('badges');
}

export async function addBadge(badge) {
  return (await dbPromise).add('badges', badge);
}