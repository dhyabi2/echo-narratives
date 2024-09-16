const CACHE_NAME = 'echoes-cache-v1';
const TIMEOUT = 10000; // 10 seconds timeout

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
    fetchWithTimeout(event.request)
      .catch(() => caches.match(event.request))
  );
});

async function fetchWithTimeout(request) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(id);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());

    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

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
      const response = await fetchWithTimeout(new Request('/api/echoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(echo)
      }));
      
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
  try {
    const cache = await caches.open(CACHE_NAME);
    await fetchWithTimeout(new Request('/api/latest-content'))
      .then(response => cache.put('/api/latest-content', response));
  } catch (error) {
    console.error('Failed to update content:', error);
  }
}

self.addEventListener('fetch', (event) => {
  if (event.request.method === 'POST' && event.request.url.endsWith('/share-target')) {
    event.respondWith(handleShareTarget(event));
  }
});

async function handleShareTarget(event) {
  try {
    const formData = await event.request.formData();
    const audio = formData.get('audio');
    const title = formData.get('title') || 'Shared Echo';

    const db = await openDB('echoes-db', 1);
    await db.add('echoes', {
      title: title,
      audioData: await audio.arrayBuffer(),
      createdAt: new Date().toISOString(),
      syncStatus: 'unsynced'
    });

    return Response.redirect('/share-success', 303);
  } catch (error) {
    console.error('Error handling share target:', error);
    return Response.redirect('/share-error', 303);
  }
}
