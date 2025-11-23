// Minimal service worker - helps PWA install and caching (basic)
self.addEventListener('install', event => {
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  clients.claim();
});
self.addEventListener('fetch', event => {
  // Simple network-first (no heavy caching to avoid stale tools)
  event.respondWith(fetch(event.request).catch(()=> caches.match(event.request)));
});