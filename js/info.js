/**
 * SETU — Static info panel module.
 * Renders the grid of info categories and the detail view for each,
 * entirely from local data (INFO_PANELS in data.js). No network calls.
 */

const InfoModule = (() => {
  function init() {
    const grid = document.getElementById("info-grid");
    grid.innerHTML = "";

    Object.entries(INFO_PANELS).forEach(([key, panel]) => {
      const card = document.createElement("button");
      card.className = "info-card";
      card.innerHTML = `
        <span class="icon">${panel.icon}</span>
        <span class="label">${panel.label}</span>
      `;
      card.addEventListener("click", () => openDetail(key));
      grid.appendChild(card);
    });

    document.getElementById("info-back").addEventListener("click", closeDetail);
  }

  function openDetail(key) {
    const panel = INFO_PANELS[key];
    if (!panel) return;

    document.getElementById("info-detail-title").textContent = panel.title;
    const body = document.getElementById("info-detail-body");
    body.innerHTML = "";

    if (panel.sections) {
      panel.sections.forEach((sec) => {
        const h3 = document.createElement("h3");
        h3.textContent = sec.heading;
        const p = document.createElement("p");
        p.textContent = sec.body;
        body.appendChild(h3);
        body.appendChild(p);
      });
    }

    if (panel.numbers) {
      panel.numbers.forEach((n) => {
        const row = document.createElement("div");
        row.className = "emergency-number";
        row.innerHTML = `<span>${n.label}</span><a href="tel:${n.number}">${n.number}</a>`;
        body.appendChild(row);
      });
    }

    document.getElementById("info-detail").classList.remove("hidden");
  }

  function closeDetail() {
    document.getElementById("info-detail").classList.add("hidden");
  }

  return { init };
})();
