// Service Worker for PWA installability — no offline caching (connexion requise)
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
