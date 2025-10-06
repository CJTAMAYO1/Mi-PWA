// Plantilla de service worker

//1. nombre del cache y archivos a cachear

const CACHE_NAME = "mi-pwa-cache-v1";
const BASE_PATH = "Mi-PWA/"; 
const urlsToCache = [ 

    `${BASE_PATH}index.html`,
    `${BASE_PATH}offline.html`,
    `${BASE_PATH}styles.css`,
    `${BASE_PATH}icons/192x192.png`,
    `${BASE_PATH}icons/512x512.png`,

]

/*  2.IINSTALL => evento que se ejecuta al installa el service worker
    Se dispara la primera vez que se registra el service worker
*/

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache.addAll(urlsToCache))
    ); 
});

// 3. ACTIVATE -> este evento se ecjecuta al activarse (debe limpiar cahes viejas)

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then( keys =>
            Promise.all(
                keys.filter( key => key !== CACHE_NAME )
                .map( key => caches.delete(key)
            )
        )
    )
    );
});

 // 4. FETCH -> intercepta las peticiones de la PWA 
 // Intercepta cada peticion de cada pagina de la PWA
// Busca Primero en cache y si no lo encuentra va a la red
// si falla todo, muestra una pagina offline.html
 self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then( response => {
            return response || fetch(event.request).catch(
                () => caches.match("offline.html"))
        })
    );
 });


 // 5. Push -> Notificaciones en segundo plano (Opcional)
 
 self.addEventListener("push", event => {
    const data = event.data ? event.data.text() : "Notificación sin datos";
    event.waitUntil(
        self.registration.showNotification("Mi PWA", { body : data })
    );
 });

 // Opcional:
//          Sync -> Sincronización en segundo plano (Opcional)
//          Maneja eventos de API's que el navegador soporte


