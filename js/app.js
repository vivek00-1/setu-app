/**
 * SETU — App entry point.
 */

(function () {
  function updateNetStatus() {
    const el = document.getElementById("net-status");
    if (navigator.onLine) {
      el.textContent = "● Online";
      el.className = "net-status online";
    } else {
      el.textContent = "● Offline mode";
      el.className = "net-status offline";
    }
  }

  window.addEventListener("online", updateNetStatus);
  window.addEventListener("offline", updateNetStatus);

  document.addEventListener("DOMContentLoaded", () => {
    updateNetStatus();

    Geo.start();
    MapModule.init();
    InfoModule.init();
    ContactsModule.init();
    SosModule.init();
    NavModule.init();

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("sw.js")
        .then(() => console.log("Service worker registered — app can now work offline."))
        .catch((err) => console.warn("Service worker registration failed:", err));
    }
  });
})();
