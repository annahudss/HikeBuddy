
const CACHE_NAME = "hikebuddy-v10";

const FILES_TO_CACHE = [
    "./",
    "index.html",
    "explore.html",
    "favourites.html",
    "hike-details.html",
    "style.css",
    "app.js",
    "manifest.json",
    "images/arthurs-seat.jpg",
    "images/ben-lomond.jpg",
    "images/the-hermitage.jpg",
    "images/loch-an-eilein.jpg",
    "images/cairn-gorm.jpg",
    "images/icon-192.png",
    "images/icon-512.png"
];

self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async function(cache) {
            for (const file of FILES_TO_CACHE) {
                try {
                    await cache.add(file);
                } catch (error) {
                    console.log("Could not cache:", file, error);
                }
            }
        }).then(function() {
            return self.skipWaiting();
        })
    );
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames
                    .filter(function(name) {
                        return name.startsWith("hikebuddy-") &&
                               name !== CACHE_NAME;
                    })
                    .map(function(name) {
                        return caches.delete(name);
                    })
            );
        }).then(function() {
            return self.clients.claim();
        })
    );
});

self.addEventListener("fetch", function(event) {
    const request = event.request;
    const url = new URL(request.url);

    if (request.method !== "GET") return;

    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then(function(response) {
                    if (response.ok) {
                        const copy = response.clone();
                        caches.open(CACHE_NAME).then(function(cache) {
                            cache.put(request, copy);
                        });
                    }
                    return response;
                })
               .catch(function() {
    const offlineUrl = new URL(request.url);
    offlineUrl.search = "";

    return caches.match(offlineUrl.href);
})
        );
        return;
    }

    if (url.origin === self.location.origin) {
        event.respondWith(
            caches.match(request).then(function(cached) {
                if (cached) return cached;

                return fetch(request).then(function(response) {
                    if (response.ok) {
                        const copy = response.clone();
                        caches.open(CACHE_NAME).then(function(cache) {
                            cache.put(request, copy);
                        });
                    }
                    return response;
                });
            })
        );
    }
});

