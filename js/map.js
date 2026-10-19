/**
 * SETU — Map module.
 *
 * IMPORTANT (read before the hackathon):
 * This uses the public OpenStreetMap tile server as a placeholder so the app
 * works out of the box while you have internet. For the actual offline demo,
 * replace the `tileUrlTemplate` below with locally hosted / pre-cached tiles
 * (e.g. exported via MapTiler, TileMill, or a self-hosted tile server), OR
 * rely on the Service Worker cache (sw.js) which will cache whichever tiles
 * were viewed during your last online session — good enough for a fixed demo
 * area if you pan/zoom around your demo location once while online first.
 */

const MapModule = (() => {
  let map = null;
  let gpsMarker = null;
  let accuracyCircle = null;
  const poiMarkers = [];

  const DEFAULT_CENTER = [22.5793, 88.4790]; // New Town, Kolkata — change to your city
  const DEFAULT_ZOOM = 14;

  // Swap this for your offline/self-hosted tile path before the demo, e.g.
  // "/tiles/{z}/{x}/{y}.png"
  const tileUrlTemplate = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  function init() {
    map = L.map("map", {
      zoomControl: false,
      attributionControl: false,
    }).setView(DEFAULT_CENTER, DEFAULT_ZOOM);

    L.tileLayer(tileUrlTemplate, {
      maxZoom: 19,
    }).addTo(map);

    renderAllPois();

    Geo.onUpdate((pos) => {
      if (!pos) return;
      updateGpsMarker(pos);
    });

    document.getElementById("btn-locate").addEventListener("click", centerOnMe);
  }

  function updateGpsMarker(pos) {
    const latlng = [pos.lat, pos.lng];
    if (!gpsMarker) {
      gpsMarker = L.circleMarker(latlng, {
        radius: 8,
        color: "#065A82",
        fillColor: "#1C7293",
        fillOpacity: 1,
        weight: 3,
      }).addTo(map);
    } else {
      gpsMarker.setLatLng(latlng);
    }

    if (!accuracyCircle) {
      accuracyCircle = L.circle(latlng, {
        radius: pos.accuracy || 20,
        color: "#1C7293",
        fillColor: "#1C7293",
        fillOpacity: 0.12,
        weight: 1,
      }).addTo(map);
    } else {
      accuracyCircle.setLatLng(latlng);
      accuracyCircle.setRadius(pos.accuracy || 20);
    }
  }

  function centerOnMe() {
    const pos = Geo.getPosition();
    if (pos) {
      map.setView([pos.lat, pos.lng], 16);
    }
  }

  function renderAllPois() {
    poiMarkers.forEach((m) => map.removeLayer(m));
    poiMarkers.length = 0;

    POI_DATA.forEach((poi) => {
      const meta = CATEGORY_LABELS[poi.category] || { icon: "📍", label: poi.category };
      const marker = L.marker([poi.lat, poi.lng], {
        icon: L.divIcon({
          className: "poi-div-icon",
          html: `<div style="font-size:22px;">${meta.icon}</div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        }),
      }).addTo(map);

      marker.bindPopup(popupHtml(poi, meta));
      poiMarkers.push(marker);
    });
  }

  function popupHtml(poi, meta) {
    const pos = Geo.getPosition();
    const distText = pos
      ? `${Geo.distanceKm(pos.lat, pos.lng, poi.lat, poi.lng).toFixed(2)} km away`
      : "Distance unknown (no GPS fix yet)";
    return `
      <div class="poi-popup-title">${meta.icon} ${poi.name}</div>
      <div class="poi-popup-dist">${meta.label} · ${distText}</div>
      <div>${poi.address || ""}</div>
      <div class="poi-popup-actions">
        <a href="tel:${poi.phone}">📞 Call</a>
        <a href="sms:${poi.phone}">✉️ SMS</a>
      </div>
    `;
  }

  /**
   * Called from the "Nearest X" chips. Flies to and opens the popup of the
   * single nearest POI in that category.
   */
  function showNearest(category) {
    const pos = Geo.getPosition();
    if (!pos) {
      alert("Waiting for GPS fix — move to an open area and try again.");
      return;
    }
    const results = Geo.nearest(POI_DATA, category, pos.lat, pos.lng, 1);
    if (!results.length) {
      alert("No data available for this category.");
      return;
    }
    const nearestPoi = results[0];
    map.setView([nearestPoi.lat, nearestPoi.lng], 16);
    const marker = poiMarkers.find(
      (m) => m.getLatLng().lat === nearestPoi.lat && m.getLatLng().lng === nearestPoi.lng
    );
    if (marker) marker.openPopup();
  }

  return { init, showNearest, centerOnMe };
})();
