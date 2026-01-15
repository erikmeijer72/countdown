
const CACHE_NAME = 'lumina-countdown-v11';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch((error) => console.error('Failed to cache core resources:', error))
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Navigation Requests (HTML): Network First -> Cache Fallback
  // This ensures the user gets the latest version when online, but can still open the app offline.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Check for valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
            // Also update /index.html cache for resilience
            cache.put('/index.html', responseToCache.clone());
          });
          return response;
        })
        .catch(() => {
          // If network fails, return cached index.html
          return caches.match('/index.html');
        })
    );
    return;
  }

  // 2. Asset Requests (JS, CSS, Images, Fonts): Cache First -> Network
  // Includes critical CDNs used in this project (esm.sh, tailwind, fonts)
  const isCachable = 
    url.origin === self.location.origin ||
    url.hostname === 'esm.sh' ||
    url.hostname === 'cdn.tailwindcss.com' ||
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com';

  if (isCachable) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then((response) => {
          // Cache valid responses (including opaque ones for fonts/images if applicable)
          if (!response || (response.status !== 200 && response.type !== 'opaque' && response.type !== 'basic')) {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      })
    );
    return;
  }
});