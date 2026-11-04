const CACHE_NAME = "hikebuddy-v5";

const FILES_TO_CACHE = [
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
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(FILES_TO_CACHE);
            })
    );
});

self.addEventListener("fetch", function(event) {
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true })
            .then(function(response) {
                return response || fetch(event.request);
            })
    );
});