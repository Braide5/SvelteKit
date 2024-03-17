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

//listen to fetch event