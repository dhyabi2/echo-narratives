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
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          (response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-echoes') {
    event.waitUntil(syncEchoes());
  }
});

self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/icon-192x192.png',
    badge: '/badge-icon.png'
  };

  event.waitUntil(
    self.registration.showNotification('إيكوز', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://echoes.app')
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

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-content') {
    event.waitUntil(updateContent());
  }
});

async function updateContent() {
  const cache = await caches.open(CACHE_NAME);
  await cache.add('/api/latest-content');
}

self.addEventListener('fetch', (event) => {
  if (event.request.method === 'POST' && event.request.url.endsWith('/share-target')) {
    event.respondWith(handleShareTarget(event));
  }
});

async function handleShareTarget(event) {
  const formData = await event.request.formData();
  const audio = formData.get('audio');
  const title = formData.get('title') || 'Shared Echo';

  // Store the shared audio in IndexedDB
  const db = await openDB('echoes-db', 1);
  await db.add('echoes', {
    title: title,
    audioData: await audio.arrayBuffer(),
    createdAt: new Date().toISOString(),
    syncStatus: 'unsynced'
  });

  // Respond with a success page
  return Response.redirect('/share-success', 303);
}