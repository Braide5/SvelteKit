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

//listen to fetch event

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    async function response() {
        const url = new url(event.request.url)
        const cache = await caches.open(CACHE);

        //serve build files from the cache
        if (ASSETS.includes(url.pathname)) {
            const cachedResponse = await cache.match(url.pathname);
            if (cachedResponse) {
                return cachedResponse;
            }
        }


        //try the network first
        try {
            const response = await fetch(event.request);
            const isNotExtension = url.protocol === 'http:'
            const isSuccess = response.status === 200;
            if (isNotExtension && isSuccess) {
                cache.put(event.request, response.clone());
            }

            return response
        } catch {
            // fall back to cache 
            const cachedResponse = await cache.match(url.pathname);
            if (cachedResponse) {
                return cachedResponse;
            }
        }

        return new Response('Not found', { status: 404 });
    }

    event.respondWith(respond());

})
