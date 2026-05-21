// ============================================
// 8. SERVICE WORKER PARA PWA (INSTALAR NO CELULAR)
// ============================================

// Define o nome do cache para a aplicação, que será utilizado para armazenar os arquivos essenciais e permitir o funcionamento offline da aplicação
const CACHE_NAME = "hortsoy-app-v2";

// Define os URLs dos arquivos que serão armazenados no cache, incluindo a página inicial, o arquivo HTML, o CSS e o JavaScript necessários para o funcionamento da aplicação
const urlsToCache = ["/", "/index.html", "/styles.css", "/script.js"];

// Evento de instalação do Service Worker, onde o cache é criado e os arquivos essenciais são armazenados para permitir o funcionamento offline da aplicação
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

// Evento de ativação do Service Worker, onde os caches antigos são limpos para garantir que a aplicação utilize a versão mais recente dos arquivos em cache
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

// Evento de fetch, onde as requisições são interceptadas e, em caso de falha na obtenção dos recursos da rede (como quando o usuário está offline), os arquivos em cache são retornados para garantir a continuidade do funcionamento da aplicação
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    }),
  );
});
