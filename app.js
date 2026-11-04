function openHike(hike) {
    const currentPage = window.location.pathname;

    let from = "home";

    if (currentPage.includes("explore.html")) {
        from = "explore";
    } else if (currentPage.includes("favourites.html")) {
        from = "favourites";
    }

    window.location.href =
        "hike-details.html?hike=" + hike + "&from=" + from;
}
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker.register("service-worker.js")
            .then(function() {
                console.log("HikeBuddy service worker registered.");
            })
            .catch(function(error) {
                console.log("Service worker registration failed:", error);
            });
    });
}