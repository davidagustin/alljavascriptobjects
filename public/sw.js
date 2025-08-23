const CACHE_NAME = 'js-objects-v1';
const STATIC_CACHE = 'js-objects-static-v1';
const DYNAMIC_CACHE = 'js-objects-dynamic-v1';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/offline.html',
  // Core JavaScript object pages
  '/array',
  '/string', 
  '/object',
  '/number',
  '/date',
  '/promise',
  '/map',
  '/set',
  '/regexp',
  '/error',
  '/symbol',
  '/function',
  '/boolean',
  '/math'
];

// Runtime caching strategies
const CACHE_STRATEGIES = {
  // Cache first for static assets
  CACHE_FIRST: 'cache-first',
  // Network first for dynamic content
  NETWORK_FIRST: 'network-first', 
  // Stale while revalidate for frequently updated content
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Cache app shell assets
      caches.open(CACHE_NAME).then((cache) => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll([
          '/_next/static/css/',
          '/_next/static/js/',
          '/_next/static/chunks/'
        ].map(path => `${path}*`)); // Wildcard caching for versioned assets
      })
    ])
    .then(() => {
      console.log('Service Worker: Installation complete');
      // Force activation of new service worker
      return self.skipWaiting();
    })
    .catch((error) => {
      console.error('Service Worker: Installation failed', error);
    })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (cacheName !== CACHE_NAME && 
              cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('Service Worker: Activation complete');
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - handle requests with different strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests
  if (!url.origin.includes(self.location.origin)) {
    return;
  }

  event.respondWith(
    handleFetchWithStrategy(request)
  );
});

// Main fetch handling with different caching strategies
async function handleFetchWithStrategy(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  try {
    // Static assets - cache first
    if (isStaticAsset(pathname)) {
      return await cacheFirst(request, STATIC_CACHE);
    }
    
    // API routes or dynamic content - network first
    if (pathname.startsWith('/_next/') || pathname.startsWith('/api/')) {
      return await networkFirst(request, DYNAMIC_CACHE);
    }
    
    // JavaScript object pages - stale while revalidate
    if (isObjectPage(pathname)) {
      return await staleWhileRevalidate(request, CACHE_NAME);
    }
    
    // Default strategy - network first with fallback
    return await networkFirstWithFallback(request);
    
  } catch (error) {
    console.error('Service Worker: Fetch error', error);
    return await getOfflineFallback(request);
  }
}

// Cache-first strategy
async function cacheFirst(request, cacheName) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  if (networkResponse.ok) {
    const cache = await caches.open(cacheName);
    await cache.put(request, networkResponse.clone());
  }
  return networkResponse;
}

// Network-first strategy
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await caches.match(request);
  
  // Background fetch to update cache
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  });
  
  // Return cached version immediately, or wait for network
  return cachedResponse || await fetchPromise;
}

// Network-first with offline fallback
async function networkFirstWithFallback(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return await caches.match('/offline.html');
    }
    
    throw error;
  }
}

// Get offline fallback response
async function getOfflineFallback(request) {
  if (request.mode === 'navigate') {
    const offlinePage = await caches.match('/offline.html');
    if (offlinePage) {
      return offlinePage;
    }
  }
  
  // Return a basic offline response
  return new Response(
    JSON.stringify({ 
      error: 'Offline', 
      message: 'Content not available offline' 
    }), {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// Helper functions
function isStaticAsset(pathname) {
  return pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/);
}

function isObjectPage(pathname) {
  const objectPages = [
    '/array', '/string', '/object', '/number', '/date', '/promise', 
    '/map', '/set', '/regexp', '/error', '/symbol', '/function', 
    '/boolean', '/math', '/json', '/proxy', '/reflect', '/weakmap',
    '/weakset', '/arraybuffer', '/dataview', '/int8array', '/uint8array',
    '/uint8clampedarray', '/int16array', '/uint16array', '/int32array',
    '/uint32array', '/float32array', '/float64array', '/bigint64array',
    '/biguint64array', '/atomics', '/sharedarraybuffer', '/generator',
    '/generatorfunction', '/asyncfunction', '/asyncgenerator',
    '/asyncgeneratorfunction', '/iterator', '/asynciterator'
  ];
  return objectPages.includes(pathname) || pathname.startsWith('/');
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  // Handle any offline actions when back online
  console.log('Service Worker: Handling background sync');
  
  try {
    // Example: Sync offline favorites or progress
    const offlineData = await getOfflineData();
    if (offlineData.length > 0) {
      await syncOfflineData(offlineData);
    }
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}

// Push notifications support
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New JavaScript object documentation available!',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 'js-objects-notification'
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192x192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('JavaScript Objects', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification click', event);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      self.clients.openWindow('/')
    );
  }
});

// Message handling for client communication
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting();
        break;
        
      case 'CACHE_OBJECT_PAGE':
        event.waitUntil(cacheObjectPage(event.data.url));
        break;
        
      case 'GET_CACHE_STATUS':
        event.waitUntil(getCacheStatus().then((status) => {
          event.ports[0].postMessage({ cacheStatus: status });
        }));
        break;
        
      case 'CLEAR_CACHE':
        event.waitUntil(clearAllCaches());
        break;
    }
  }
});

// Cache a specific object page
async function cacheObjectPage(url) {
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.add(url);
    console.log('Service Worker: Cached object page', url);
  } catch (error) {
    console.error('Service Worker: Failed to cache page', url, error);
  }
}

// Get cache status information
async function getCacheStatus() {
  const cacheNames = await caches.keys();
  const status = {};
  
  for (const name of cacheNames) {
    const cache = await caches.open(name);
    const keys = await cache.keys();
    status[name] = keys.length;
  }
  
  return status;
}

// Clear all caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map((name) => caches.delete(name))
  );
  console.log('Service Worker: All caches cleared');
}

// Utility functions for offline data management
async function getOfflineData() {
  // This would integrate with IndexedDB for offline data storage
  return [];
}

async function syncOfflineData(data) {
  // This would sync offline data when back online
  console.log('Service Worker: Syncing offline data', data);
}