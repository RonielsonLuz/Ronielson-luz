const CACHE_NAME = 'vehicle-checklist-cache-v1';
// Add all essential files for the app shell
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx', // The module loader will fetch this
  'https://cdn.tailwindcss.com',
];

// Install event: open cache and add app shell files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Use 'reload' to bypass HTTP cache and ensure we get the latest files from the network
        return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })));
      })
      .catch(error => {
          console.error('Failed to cache during install', error);
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: serve from cache, fall back to network, and update cache (stale-while-revalidate)
self.addEventListener('fetch', (event) => {
    // We only want to cache GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    // For cross-origin requests (like CDNs), use a cache-first strategy as we can't always validate the response.
    if (!event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
        return;
    }

    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then((response) => {
                const fetchPromise = fetch(event.request).then((networkResponse) => {
                    // Don't cache failed requests or chrome-extension URLs
                    if (networkResponse.status === 200) {
                        cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                }).catch(err => {
                    console.warn(`Fetch failed for ${event.request.url}. Serving from cache if available.`, err);
                    // If fetch fails (e.g., offline) and we had a cached response, it would have been returned already.
                    // If not, this catch block ensures the promise doesn't reject, preventing a browser error.
                });
                
                // Return response from cache if found, otherwise wait for the network response.
                return response || fetchPromise;
            });
        })
    );
});