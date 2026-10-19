/**
 * SETU — Simple bottom-nav screen switcher.
 */

const NavModule = (() => {
  function init() {
    const buttons = document.querySelectorAll(".navbtn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-screen");
        show(target);
        buttons.forEach((b) => b.classList.toggle("active", b === btn));
      });
    });

    // "Nearest X" chips on the map screen
    document.querySelectorAll(".chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        MapModule.showNearest(chip.getAttribute("data-category"));
      });
    });
  }

  function show(screenId) {
    document.querySelectorAll(".screen").forEach((s) => {
      s.classList.toggle("active", s.id === screenId);
    });
    // Leaflet needs a resize nudge if the map was hidden via display:none
    if (screenId === "screen-map") {
      setTimeout(() => MapModule.centerOnMe && window.dispatchEvent(new Event("resize")), 50);
    }
  }

  return { init, show };
})();
