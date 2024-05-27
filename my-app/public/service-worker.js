/// <reference types="@rollup/plugin-commonjs" />
/// <reference types="@rollup/plugin-node-resolve" />
/// <reference lib="webworker" />

let self;
self = self;

import { build, files, version } from "$service-worker";

const CACHE = `cache-${version}`;
const ASSETS = [...build, ...files];
// install service worker
self.addEventListener('install', (event) => {
    async function addFilesToCache() {
        const cache = await caches.open(CACHE);
        await cache.addAll(ASSETS);
    }
    event.waitUntil(addFilesToCache());
})

//activate service worker
self.addEventListener('activate', (event) => {
    async function removeOldCache() {
        const keys = await caches.keys();
        for (const key of keys) {
            if (key !== CACHE) await caches.delete(key);
        }
    }
    event.waitUntil(removeOldCache());
})

// Listen to fetch event
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const url = new URL(event.request.url);

    // Handle API requests separately
    if (url.origin === location.origin && url.pathname.startsWith('/api/')) {
        event.respondWith(cacheApiResponse(event.request));
    } else {
        event.respondWith(cacheAssets(event.request));
    }
});

async function cacheAssets(request) {
    const cache = await caches.open(CACHE);

    // Serve build files from the cache
    if (ASSETS.includes(new URL(request.url).pathname)) {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
    }

    // Try the network first
    try {
        const response = await fetch(request);
        if (response.status === 200) {
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        // Fallback to cache
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        return new Response('Not found', { status: 404 });
    }
}

async function cacheApiResponse(request) {
    const cache = await caches.open(CACHE);

    try {
        const response = await fetch(request);
        if (response.status === 200) {
            cache.put(request, response.clone());
        }
        return response;
    } catch {
        // Fallback to cache
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        return new Response('You are offline and the requested data is not cached.', { status: 503 });
    }
}

//listen to fetch event

// self.addEventListener('fetch', (event) => {
//     if (event.request.method !== 'GET') return;

//     async function response() {
//         const url = new url(event.request.url)
//         const cache = await caches.open(CACHE);

//         //serve build files from the cache
//         if (ASSETS.includes(url.pathname)) {
//             const cachedResponse = await cache.match(url.pathname);
//             if (cachedResponse) {
//                 return cachedResponse;
//             }
//         }


//         //try the network first
//         try {
//             const response = await fetch(event.request);
//             const isNotExtension = url.protocol === 'http:'
//             const isSuccess = response.status === 200;
//             if (isNotExtension && isSuccess) {
//                 cache.put(event.request, response.clone());
//             }

//             return response
//         } catch {
//             // fall back to cache 
//             const cachedResponse = await cache.match(url.pathname);
//             if (cachedResponse) {
//                 return cachedResponse;
//             }
//         }

//         return new Response('Not found', { status: 404 });
//     }

//     event.respondWith(respond());

// })
