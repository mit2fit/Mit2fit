/* The build adds CACHE_NAME and TRACKER_ASSETS before this script. */
const trackerPath = '/tracker';
const trackerAssets = new Set(TRACKER_ASSETS);

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(TRACKER_ASSETS.map(path => new Request(path, { cache: 'reload' })))
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) {
      if (name.startsWith('mit2fit-tracker-') && name !== CACHE_NAME) {
        await caches.delete(name);
      }
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    if (url.pathname === trackerPath || url.pathname === '/tracker/') {
      event.respondWith(readShell(trackerPath, request));
    }
    return;
  }

  if (trackerAssets.has(url.pathname)) {
    event.respondWith(readShell(url.pathname, request));
  }
});

async function readShell(path, request) {
  const cache = await caches.open(CACHE_NAME);
  return (await cache.match(path)) || fetch(request);
}
