// Plantilla de Service Worker

import { cache } from "react";

//1. Nombre del cache y archivos a cachear

const CACHE_NAME = "mi-pwa-cache-v1"
const BASE_PATH = "/MI-PWA/"
const urlsToCache = [
    `${BASE_PATH}index.html`,
    `${BASE_PATH}manifest.json`,
    `${BASE_PATH}offline.html`,
    `${BASE_PATH}icons/icon-192x192.png`,
    `${BASE_PATH}icons/icon-512x512.png`
];

// 2. INSTALL -> el evento que se ejecuta al instalar el sw
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache.addAll(urlsToCache))
    );
});

//3. ACTIVATE -> este evento se ejecuta al activarse
// debe limpiar caches viejas
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
            )
        )
    );
}
)

//fetch -> intercepta las petciones de la pwa,
//Interceptar cada petición de cada página de la PWA
//Busca primera en cache
//Si el recurso no esta, se va la red
//Si falla todo, muestra la ventana OfflineAudioCompletionEvent.html

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(
                () => caches.match(`^${BASE_PATH}offline.html`));
        })
    );
});

self.addEventListener("push", event => {
    const data = event.data ? event.data.text() : "Notificación sin datos";
    event.waitUntil(
        self.ServiceWorkerRegistration.showNotification("Mi PWA", {body: data})
    );
});

//opcional :
// SINC => Sincronizando en sedundo plano
// Manejo de eventos de APIS que el navegador soporta