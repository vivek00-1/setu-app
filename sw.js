/**
 * SETU — Service Worker
 *
 * Caches the app shell (HTML/CSS/JS/icons) on install so the app opens
 * with zero network connection after the first successful load.
 *
 * Map tiles: the tile requests to the OSM server are cached opportunistically
 * (cache-first with network fallback) as the user pans/zooms while online.
 * For a reliable offline demo, either:
 *   (a) open the app once while online and pan/zoom around your demo area
 *       so tiles get cached here, or
 *   (b) replace map.js's tileUrlTemplate with locally hosted tiles bundled
 *       into APP_SHELL below.
 */

const CACHE_NAME = "setu-cache-v1";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./js/data.js",
  "./js/geo.js",
  "./js/map.js",
  "./js/info.js",
  "./js/contacts.js",
  "./js/sos.js",
  "./js/nav.js",
  "./js/app.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./assets/alarm.wav",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL).catch((err) => {
        console.warn("Some app shell assets failed to cache:", err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Cache-first for map tiles (OSM) so previously viewed tiles work offline.
  if (req.url.includes("tile.openstreetmap.org")) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(req).then((cached) => {
          const fetchPromise = fetch(req)
            .then((networkRes) => {
              cache.put(req, networkRes.clone());
              return networkRes;
            })
            .catch(() => cached);
          return cached || fetchPromise;
        })
      )
    );
    return;
  }

  // Cache-first for everything else in the app shell.
  event.respondWith(
    caches.match(req).then((cached) => {
      return (
        cached ||
        fetch(req)
          .then((networkRes) => {
            // Opportunistically cache new same-origin GETs
            if (req.method === "GET") {
              const resClone = networkRes.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
            }
            return networkRes;
          })
          .catch(() => cached)
      );
    })
  );
});
