/// <reference types="@rollup/plugin-commonjs" />
/// <reference types="@rollup/plugin-node-resolve" />
/// <reference lib="webworker" />

let self;
self = self;

import { build, files, version } from "$service-worker";

console.log({ build, files, version });
// install service worker

//activate service worker

//listen to fetch event