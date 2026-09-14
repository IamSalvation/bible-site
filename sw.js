// sw.js — Service Worker for offline Bible reading
const CACHE = 'bible-kjv-v1';

// On install, cache the app shell (NOT the data — too many files to precache)
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE).then(cache =>
            cache.addAll([
                './',
                './index.html',
                './style.css',
                './app.js'
            ])
        )
    );
    self.skipWaiting();
});

// Clean old caches on activate
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Fetch strategy:
//   /data/*.json  → cache-first (Bible data is immutable, cache forever)
//   everything else → network-first with cache fallback
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Only handle same-origin requests (skip API calls etc.)
    if (url.origin !== self.location.origin) return;

    if (url.pathname.includes('/data/')) {
        // Cache-first for Bible data
        event.respondWith(
            caches.match(event.request).then(cached => {
                if (cached) return cached;
                return fetch(event.request).then(res => {
                    if (res.ok) {
                        const copy = res.clone();
                        caches.open(CACHE).then(cache => cache.put(event.request, copy));
                    }
                    return res;
                });
            })
        );
        return;
    }

    // Network-first for the app shell
    event.respondWith(
        fetch(event.request)
            .then(res => {
                if (res.ok) {
                    const copy = res.clone();
                    caches.open(CACHE).then(cache => cache.put(event.request, copy));
                }
                return res;
            })
            .catch(() => caches.match(event.request))
    );
});