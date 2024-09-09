const CACHE_NAME = 'echoes-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/static/js/main.js',
  '/static/css/main.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-echoes') {
    event.waitUntil(syncEchoes());
  }
});

self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/badge-icon.png'
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

async function syncEchoes() {
  const db = await openDB('echoes-db', 1);
  const unsyncedEchoes = await db.getAll('echoes', 'unsynced');
  
  for (const echo of unsyncedEchoes) {
    try {
      const response = await fetch('/api/echoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(echo)
      });
      
      if (response.ok) {
        await db.delete('echoes', echo.id);
      }
    } catch (error) {
      console.error('Failed to sync echo:', error);
    }
  }
}