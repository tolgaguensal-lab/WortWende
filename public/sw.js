const CACHE_NAME = "deutschquest-v3";
const STATIC_ASSETS = ["/", "/manifest.json"];
const API_CACHE = "deutschquest-api-v1";
const VERSION_CACHE = "deutschquest-version";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== API_CACHE && key !== VERSION_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.pathname === "/version.json") {
    event.respondWith(
      fetch(request).then((response) => {
        const clone = response.clone();
        caches.open(VERSION_CACHE).then((cache) => cache.put(request, clone));
        return response;
      })
    );
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      caches.open(API_CACHE).then((cache) =>
        fetch(request)
          .then((response) => {
            if (request.method === "GET" && response.ok) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => cache.match(request))
      )
    );
  } else {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetched = fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
        return cached || fetched;
      })
    );
  }
});
