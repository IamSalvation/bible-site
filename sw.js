// sw.js — Service Worker for offline Bible reading
const CACHE = 'bible-kjv-v21';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE).then(cache =>
            cache.addAll([
                './',
                './index.html',
                './style.css',
                './app.js',
                './manifest.json',
                './votd.json',
                './icons/logo.png',
                './icons/icon-192.png',
                './icons/icon-512.png',
                './icons/icon-192-maskable.png',
                './icons/icon-512-maskable.png',
                './icons/favicon-32x32.png',
                './icons/favicon-16x16.png',
                './icons/apple-touch-icon.png',
                './screenshots/home.png',
                './screenshots/reader.png'
            ])
        )
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Bible data - cache first
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

    // Only handle same-origin for everything else
    if (url.origin !== self.location.origin) return;

    // Network-first with cache fallback
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

self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});