const CACHE_NAME = 'berita-portal-v1'
const STATIC_CACHE = 'static-v1'
const DYNAMIC_CACHE = 'dynamic-v1'

const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
]

const CACHE_STRATEGIES = {
  // Cache first for static assets
  CACHE_FIRST: 'cache-first',
  // Network first for dynamic content
  NETWORK_FIRST: 'network-first',
  // Stale while revalidate for images
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
}

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Install event')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        return self.clients.claim()
      })
  )
})

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return
  }

  event.respondWith(
    handleRequest(request)
  )
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  try {
    // Static assets - Cache First
    if (isStaticAsset(request)) {
      return await cacheFirst(request, STATIC_CACHE)
    }
    
    // Images - Stale While Revalidate
    if (isImage(request)) {
      return await staleWhileRevalidate(request, DYNAMIC_CACHE)
    }
    
    // API calls - Network First
    if (isApiRequest(request)) {
      return await networkFirst(request, DYNAMIC_CACHE)
    }
    
    // Pages - Network First with offline fallback
    if (isPageRequest(request)) {
      return await networkFirstWithOffline(request, DYNAMIC_CACHE)
    }
    
    // Default - Network First
    return await networkFirst(request, DYNAMIC_CACHE)
    
  } catch (error) {
    console.error('[SW] Request failed:', error)
    return getOfflineFallback(request)
  }
}

// Cache First Strategy
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  const networkResponse = await fetch(request)
  if (networkResponse.status === 200) {
    cache.put(request, networkResponse.clone())
  }
  
  return networkResponse
}

// Network First Strategy
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    const cachedResponse = await cache.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    throw error
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)
  
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.status === 200) {
        cache.put(request, networkResponse.clone())
      }
      return networkResponse
    })
    .catch(() => {
      // Network failed, but we might have cache
      return cachedResponse
    })
  
  return cachedResponse || await fetchPromise
}

// Network First with Offline Fallback
async function networkFirstWithOffline(request, cacheName) {
  try {
    return await networkFirst(request, cacheName)
  } catch (error) {
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      const cache = await caches.open(STATIC_CACHE)
      return await cache.match('/offline') || new Response('Offline', { status: 200 })
    }
    throw error
  }
}

// Helper functions
function isStaticAsset(request) {
  const url = new URL(request.url)
  return url.pathname.match(/\.(js|css|woff|woff2|ttf|eot|ico|png|jpg|jpeg|gif|svg|webp)$/)
}

function isImage(request) {
  return request.destination === 'image' || 
         request.url.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)$/)
}

function isApiRequest(request) {
  const url = new URL(request.url)
  return url.pathname.startsWith('/api/') || url.pathname.startsWith('/news-api/')
}

function isPageRequest(request) {
  return request.destination === 'document'
}

function getOfflineFallback(request) {
  if (request.destination === 'document') {
    return caches.match('/offline')
  }
  
  if (isImage(request)) {
    return new Response(
      '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Image not available offline</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    )
  }
  
  return new Response('Content not available offline', { 
    status: 503,
    statusText: 'Service Unavailable'
  })
}

// Background sync for analytics
self.addEventListener('sync', (event) => {
  if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics())
  }
  
  if (event.tag === 'news-sync') {
    event.waitUntil(syncNews())
  }
})

async function syncAnalytics() {
  console.log('[SW] Syncing analytics data')
  // Implementation for syncing analytics when online
}

async function syncNews() {
  console.log('[SW] Syncing news data')
  // Implementation for syncing news when online
}

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return
  
  const data = event.data.json()
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: data.tag || 'news-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'Baca Berita'
      },
      {
        action: 'dismiss',
        title: 'Tutup'
      }
    ],
    data: {
      url: data.url
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  if (event.action === 'view') {
    const url = event.notification.data.url || '/'
    event.waitUntil(
      clients.openWindow(url)
    )
  }
})

// Update notification
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
