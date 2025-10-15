// ✅ Service Worker corregido para PWA

const CACHE_NAME = "mi-pwa-cache-v1";
const BASE_PATH = "Mi-PWA/";

const urlsToCache = [
  `${BASE_PATH}index.html`,
  `${BASE_PATH}offline.html`,
  `${BASE_PATH}styles.css`,
  `${BASE_PATH}icons/icon-192x192.png`,
  `${BASE_PATH}icons/icon-512x512.png`
];

// 1. INSTALL
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // fuerza la activación inmediata
});

// 2. ACTIVATE
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // toma control de las páginas abiertas
});

// 3. FETCH
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).catch(() => caches.match(`${BASE_PATH}offline.html`))
      );
    })
  );
});

// 4. PUSH (opcional)
self.addEventListener("push", event => {
  const data = event.data ? event.data.text() : "Notificación sin datos";
  event.waitUntil(
    self.registration.showNotification("Mi PWA", {
      body: data,
      icon: `${BASE_PATH}icons/icon-192x192.png`
    })
  );
});
