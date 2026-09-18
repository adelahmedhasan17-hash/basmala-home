const CACHE_NAME = 'basmala-home-v1';
const CACHE_ASSETS = [
  './',
  './index.html',
  './offline.html',
  './manifest.json',
  './css/style.css',
  './css/responsive.css',
  './css/animations.css',
  './css/product.css',
  './css/checkout.css',
  './css/account.css',
  './js/products.js',
  './js/app.js',
  './js/cart.js',
  './js/auth.js',
  './js/product-modal.js',
  './js/checkout.js',
  './js/account.js',
  './js/router.js',
  './js/pwa.js',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap'
];

// تثبيت
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_ASSETS))
      .then(() => self.skipWaiting())
      .catch(err => console.log('Cache error:', err))
  );
});

// تفعيل
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// جلب
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(res => {
        if (e.request.method === 'GET' && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return res;
      }).catch(() => {
        if (e.request.mode === 'navigate') {
          return caches.match('./offline.html');
        }
      });
    })
  );
});

// Push Notifications
self.addEventListener('push', (e) => {
  const data = (e.data && e.data.json()) || { title: 'بسمله هوم', body: 'عرض جديد!' };
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: './icons/icon-192.png',
      badge: './icons/icon-192.png',
      dir: 'rtl',
      lang: 'ar'
    })
  );
});
