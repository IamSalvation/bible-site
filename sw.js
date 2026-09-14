// sw.js — Service Worker for offline Bible reading
const CACHE = 'bible-kjv-v5';   // was v4

// On install, cache the app shell + manifest + icons
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE).then(cache =>
            cache.addAll([
                './',
                './index.html',
                './style.css',
                './app.js',
                './manifest.json',
                './icons/icon-192.png',
                './icons/icon-512.png',
                './icons/favicon-32x32.png',
                './icons/favicon-16x16.png',
                './icons/apple-touch-icon.png'
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
//   /data/*.json  → cache-first (Bible data)
//   everything else → network-first with cache fallback
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Only handle same-origin requests
    if (url.origin !== self.location.origin) return;

    if (url.pathname.includes('/data/')) {
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