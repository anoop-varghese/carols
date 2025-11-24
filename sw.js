/* Basic service worker: precache a small app shell for offline load.
   This is intentionally minimal to avoid interfering with dev HMR.
*/

const CACHE_NAME = 'carols-basic-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
  '/robots.txt'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((key) => {
      if (key !== CACHE_NAME) return caches.delete(key);
      return null;
    }))).then(() => self.clients.claim())
  );
});

// Serve cached resources for same-origin GET requests; for navigations, fallback to index.html
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const reqUrl = new URL(event.request.url);
  if (reqUrl.origin !== self.location.origin) return;

  // For navigation requests, try network then fallback to cache index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then((resp) => {
        // update cache with latest index
        const copy = resp.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', copy));
        return resp;
      }).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // For other requests, respond from cache first then network
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((resp) => {
      // only cache successful same-origin responses
      if (resp && resp.status === 200 && resp.type === 'basic') {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      }
      return resp;
    }).catch(() => {
      // fallback to index.html for navigation or undefined for other assets
      return caches.match('/index.html');
    }))
  );
});

