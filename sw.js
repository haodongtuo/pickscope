// PickScope Service Worker v1
const CACHE = 'pickscope-v3';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(['/']))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first: always try network, fall back to cache
self.addEventListener('fetch', e => {
  // Only cache GET requests for same-origin pages
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  // Never cache API calls
  if (e.request.url.includes('/.netlify/functions/')) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
