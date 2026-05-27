// ============================================
// 8. SERVICE WORKER PARA PWA (INSTALA NO CELULAR)
// ============================================

// Define o nome do cache para a aplicação, que será utilizado para armazenar os arquivos essenciais e permitir o funcionamento offline da aplicação
const CACHE_NAME = "hortsoy-app-v2";

// Define os URLs dos arquivos que serão armazenados no cache
const urlsToCache = ["/", "/index.html", "/styles.css", "/script.js"];

// Evento de instalação do Service Worker, onde o cache é criado e os arquivos são armazenados
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

// Evento de ativação do Service Worker, onde os caches antigos são limpos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Limpando cache antigo:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

// Evento de fetch, onde as requisições são interceptadas
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    }),
  );
});
