const CACHE_NAME = 'wilstaxtion-v1';
const ASSETS = [
  './',
  './index.html',
  'https://unpkg.com/leaflet/dist/leaflet.css',
  'https://unpkg.com/leaflet/dist/leaflet.js',
  'https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.css',
  'https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.js'
];

// Instalación y guardado de archivos críticos
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Estrategia: Buscar en internet, si falla usar el caché
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
