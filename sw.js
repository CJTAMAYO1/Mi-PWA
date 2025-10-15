// Service Worker Corregido

const CACHE_NAME = "mi-pwa-cache-v1";
// Asegúrate de que esta ruta sea la correcta para tu proyecto.
// Si tu PWA está en la raíz del dominio, usa solo "/".
const BASE_PATH = "/Mi-PWA/"; 
const urlsToCache = [
  `${BASE_PATH}`, // Agregamos la ruta base para que cachee el index.html en la raíz del directorio
  `${BASE_PATH}index.html`,
  `${BASE_PATH}offline.html`,
  `${BASE_PATH}styles.css`,
  `${BASE_PATH}icons/icon-192x192.png`,
  `${BASE_PATH}icons/icon-512x512.png`
];

// 1. INSTALL: Se instala el Service Worker y se guardan los archivos en caché.
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log("Cache abierto");
        // El error estaba aquí. Se debe llamar a cache.addAll() directamente.
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. ACTIVATE: Se activa el Service Worker y elimina cachés antiguas.
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          // Elimina los cachés que no coincidan con el nombre del caché actual.
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// 3. FETCH: Intercepta las peticiones de red.
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si la respuesta está en caché, la devuelve.
        // Si no, intenta buscarla en la red.
        return response || fetch(event.request)
          .catch(() => {
            // Si la petición de red falla (sin conexión),
            // devuelve la página offline desde el caché.
            return caches.match(`${BASE_PATH}offline.html`);
          });
      })
  );
});

// 4. PUSH (opcional): Maneja las notificaciones push.
self.addEventListener("push", event => {
  const data = event.data ? event.data.text() : "Notificación sin datos";
  const options = {
    body: data,
    icon: `${BASE_PATH}icons/icon-192x192.png`, // Opcional: agrega un ícono
    badge: `${BASE_PATH}icons/icon-192x192.png` // Opcional: para Android
  };
  event.waitUntil(
    self.registration.showNotification("Mi PWA", options)
  );
});