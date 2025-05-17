
const CACHE_NAME = 'sudoku-king-cache-v1.2'; // Increment version if you change assets
const urlsToCache = [
  '/',
  '/manifest.json',
  // Add paths to your core JS bundles, CSS, fonts, and key images
  // For Next.js, these paths can be dynamic. A more robust strategy often involves
  // caching on demand or using tools like Workbox. This is a basic example.
  // Placeholder for main page and essential assets:
  // '/_next/static/css/...',
  // '/_next/static/chunks/main-...js',
  // '/_next/static/chunks/webpack-...js',
  // '/_next/static/chunks/pages/_app-...js',
  // '/_next/static/chunks/pages/index-...js',
  // '/fonts/inter-var-latin.woff2', // Example font
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        // Add core assets that are always needed.
        // Be careful with what you add here to avoid caching too much initially or failing install.
        return cache.addAll(urlsToCache.filter(url => !url.startsWith('/_next/static/'))); // Filter out dynamic Next.js chunks for now
      })
      .catch(error => {
        console.error('[Service Worker] Failed to cache app shell:', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // For navigation requests (HTML pages), try network first, then cache.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If successful, cache the new response for future offline use (optional)
          // if (response.ok) {
          //   const responseToCache = response.clone();
          //   caches.open(CACHE_NAME).then(cache => {
          //     cache.put(event.request, responseToCache);
          //   });
          // }
          return response;
        })
        .catch(() => {
          // Network failed, try to serve from cache
          return caches.match(event.request)
            .then(response => response || caches.match('/') ); // Fallback to root or a generic offline page
        })
    );
    return;
  }

  // For other requests (JS, CSS, images), try cache first, then network.
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          // console.log('[Service Worker] Found in cache:', event.request.url);
          return response;
        }
        // console.log('[Service Worker] Network request for:', event.request.url);
        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            if(event.request.url.includes('_next/static/')) { // Don't cache non-basic responses for _next/static
                 return networkResponse;
            }
          }
          // If request is for Next.js static assets, cache them if fetched successfully.
          // Be careful with dynamic chunks, this is a simplified approach.
          if (event.request.url.includes('_next/static/') || urlsToCache.includes(new URL(event.request.url).pathname)) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
          }
          return networkResponse;
        }).catch(error => {
          console.warn('[Service Worker] Fetch failed, and not in cache:', event.request.url, error);
          // Optionally, return a fallback image/resource here
          // if (event.request.destination === 'image') {
          //   return caches.match('/placeholder-image.png');
          // }
        });
      })
  );
});
