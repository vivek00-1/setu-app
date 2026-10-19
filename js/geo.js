/**
 * SETU — Geolocation + distance utilities.
 * All pure functions, no network calls, works fully offline.
 */

const Geo = (() => {
  let currentPosition = null; // { lat, lng, accuracy }
  let watchId = null;
  const listeners = [];

  function onUpdate(cb) {
    listeners.push(cb);
  }

  function notify() {
    listeners.forEach((cb) => cb(currentPosition));
  }

  function start() {
    if (!("geolocation" in navigator)) {
      console.warn("Geolocation not supported on this device.");
      return;
    }
    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        currentPosition = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        };
        notify();
      },
      (err) => {
        console.warn("GPS error:", err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      }
    );
  }

  function stop() {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
  }

  function getPosition() {
    return currentPosition;
  }

  /**
   * Haversine distance between two lat/lng points, in kilometers.
   */
  function distanceKm(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function toRad(deg) {
    return (deg * Math.PI) / 180;
  }

  /**
   * Returns POIs of a given category sorted by distance from the current
   * (or given) position, nearest first. Each result gets a `.distanceKm` field.
   */
  function nearest(pois, category, fromLat, fromLng, limit = 5) {
    const origin = fromLat != null ? { lat: fromLat, lng: fromLng } : currentPosition;
    if (!origin) return [];
    return pois
      .filter((p) => !category || p.category === category)
      .map((p) => ({
        ...p,
        distanceKm: distanceKm(origin.lat, origin.lng, p.lat, p.lng),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, limit);
  }

  return { start, stop, getPosition, onUpdate, distanceKm, nearest };
})();
