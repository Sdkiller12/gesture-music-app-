// Service Worker pour Gesture Music App
const CACHE_NAME = 'gesture-music-app-v1.0.0';
const STATIC_CACHE_NAME = 'gesture-music-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'gesture-music-dynamic-v1.0.0';

// Ressources à mettre en cache
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png'
];

// Ressources externes à mettre en cache
const EXTERNAL_ASSETS = [
    'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
    'https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js',
    'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js',
    'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js',
    'https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installation en cours...');

    event.waitUntil(
        Promise.all([
            // Cache des ressources statiques
            caches.open(STATIC_CACHE_NAME).then((cache) => {
                console.log('Service Worker: Mise en cache des ressources statiques');
                return cache.addAll(STATIC_ASSETS);
            }),
            // Cache des ressources externes
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                console.log('Service Worker: Mise en cache des ressources externes');
                return cache.addAll(EXTERNAL_ASSETS);
            })
        ]).then(() => {
            console.log('Service Worker: Installation terminée');
            return self.skipWaiting();
        })
    );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activation en cours...');

    event.waitUntil(
        (async () => {
            // Activer la navigation preload si disponible
            if ('navigationPreload' in self.registration) {
                try {
                    await self.registration.navigationPreload.enable();
                    console.log('Service Worker: Navigation preload activée');
                } catch (e) {
                    console.warn('Service Worker: Échec activation navigation preload', e);
                }
            }

            const cacheNames = await caches.keys();
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Supprimer les anciens caches
                    if (cacheName !== CACHE_NAME &&
                        cacheName !== STATIC_CACHE_NAME &&
                        cacheName !== DYNAMIC_CACHE_NAME) {
                        console.log('Service Worker: Suppression de l\'ancien cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })().then(() => {
            console.log('Service Worker: Activation terminée');
            return self.clients.claim();
        })
    );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Stratégie de cache pour différentes types de ressources
    if (request.method === 'GET') {
        // Ressources statiques (HTML, CSS, JS, images)
        if (url.origin === location.origin) {
            event.respondWith(
                caches.match(request).then((cachedResponse) => {
                    if (cachedResponse) {
                        console.log('Service Worker: Ressource statique servie depuis le cache:', request.url);
                        return cachedResponse;
                    }

                    // Essayer de récupérer la réponse préchargée par navigationPreload
                    const preloadPromise = event.preloadResponse ? event.preloadResponse : Promise.resolve(undefined);
                    return preloadPromise.then((preloaded) => preloaded || fetch(request)).then((response) => {
                        // Mettre en cache la réponse si elle est valide
                        if (response.status === 200) {
                            const responseClone = response.clone();
                            caches.open(STATIC_CACHE_NAME).then((cache) => {
                                cache.put(request, responseClone);
                            });
                        }
                        return response;
                    }).catch(() => {
                        // Fallback pour les pages HTML
                        if (request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                    });
                })
            );
        }
        // Ressources externes (CDN)
        else if (url.hostname.includes('cdn.jsdelivr.net') ||
            url.hostname.includes('cdnjs.cloudflare.com')) {
            event.respondWith(
                caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                    return cache.match(request).then((cached) => {
                        const networkFetch = fetch(request)
                            .then((response) => {
                                if (response && response.status === 200) {
                                    cache.put(request, response.clone());
                                }
                                return response;
                            })
                            .catch(() => undefined);

                        // SWR: renvoyer le cache rapidement, puis mettre à jour en arrière-plan
                        return cached || networkFetch || new Response('Ressource non disponible hors ligne', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({ 'Content-Type': 'text/plain' })
                        });
                    });
                })
            );
        }
        // Autres requêtes (API, etc.)
        else {
            event.respondWith(
                fetch(request).catch(() => {
                    return new Response('Ressource non disponible hors ligne', {
                        status: 503,
                        statusText: 'Service Unavailable',
                        headers: new Headers({
                            'Content-Type': 'text/plain'
                        })
                    });
                })
            );
        }
    }
});

// Gestion des messages du client
self.addEventListener('message', (event) => {
    const { action, data } = event.data;

    switch (action) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            // Informer les clients de l'update pour recharger
            self.clients.matchAll({ type: 'window' }).then((clients) => {
                clients.forEach((client) => client.postMessage({ action: 'RELOAD_REQUIRED' }));
            });
            break;

        case 'CACHE_URLS':
            if (data && data.urls) {
                event.waitUntil(
                    caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                        return cache.addAll(data.urls);
                    })
                );
            }
            break;

        case 'CLEAR_CACHE':
            event.waitUntil(
                caches.keys().then((cacheNames) => {
                    return Promise.all(
                        cacheNames.map((cacheName) => {
                            return caches.delete(cacheName);
                        })
                    );
                })
            );
            break;

        case 'GET_CACHE_SIZE':
            event.waitUntil(
                caches.keys().then((cacheNames) => {
                    return Promise.all(
                        cacheNames.map((cacheName) => {
                            return caches.open(cacheName).then((cache) => {
                                return cache.keys().then((keys) => {
                                    return { name: cacheName, size: keys.length };
                                });
                            });
                        })
                    );
                }).then((results) => {
                    event.ports[0].postMessage({ action: 'CACHE_SIZE', data: results });
                })
            );
            break;
    }
});

// Gestion des notifications push (pour futures fonctionnalités)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body || 'Nouvelle notification de Gesture Music App',
            icon: '/icons/icon-192.png',
            badge: '/icons/icon-192.png',
            vibrate: [200, 100, 200],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: data.primaryKey || 1
            },
            actions: [
                {
                    action: 'explore',
                    title: 'Ouvrir l\'app',
                    icon: '/icons/icon-192.png'
                },
                {
                    action: 'close',
                    title: 'Fermer',
                    icon: '/icons/icon-192.png'
                }
            ]
        };

        event.waitUntil(
            self.registration.showNotification(data.title || 'Gesture Music App', options)
        );
    }
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Gestion des erreurs
self.addEventListener('error', (event) => {
    console.error('Service Worker: Erreur:', event.error);
});

// Gestion des promesses rejetées
self.addEventListener('unhandledrejection', (event) => {
    console.error('Service Worker: Promesse rejetée:', event.reason);
});

// Fonction utilitaire pour nettoyer les caches
function cleanupCaches() {
    return caches.keys().then((cacheNames) => {
        const validCaches = [CACHE_NAME, STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME];
        return Promise.all(
            cacheNames.map((cacheName) => {
                if (!validCaches.includes(cacheName)) {
                    console.log('Service Worker: Nettoyage du cache:', cacheName);
                    return caches.delete(cacheName);
                }
            })
        );
    });
}

// Nettoyage périodique (toutes les 24h)
setInterval(cleanupCaches, 24 * 60 * 60 * 1000);

console.log('Service Worker: Chargé et prêt');
