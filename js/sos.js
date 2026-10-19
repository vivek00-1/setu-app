/**
 * SETU — SOS module.
 *
 * Three things happen when SOS is triggered:
 *  1. Flashlight strobe   (Torch API — Android Chrome only; not supported
 *                           on iOS Safari/PWA as of this writing)
 *  2. Loud looping alarm  (Web Audio / <audio> element)
 *  3. SMS to contacts     (sms: URI — opens native SMS app pre-filled;
 *                           user still has to tap Send, since browsers
 *                           cannot silently send SMS for privacy reasons)
 *
 * TEST ALL THREE ON YOUR ACTUAL PHONE BEFORE THE DEMO. Behavior varies a lot
 * across Android versions/OEMs and is limited on iOS — see comments below.
 */

const SosModule = (() => {
  let active = false;
  let torchTrack = null;
  let strobeInterval = null;
  let strobeOn = false;
  const alarmEl = () => document.getElementById("alarm-audio");

  async function trigger() {
    if (active) return;
    active = true;
    updateStatus("Activating SOS…");

    startAlarm();
    await startStrobe();
    sendSms();

    updateStatus("SOS ACTIVE — strobe, alarm, and SMS sent.");
    document.getElementById("sos-button").classList.add("armed");
    document.getElementById("sos-cancel").classList.remove("hidden");
  }

  function cancel() {
    active = false;
    stopAlarm();
    stopStrobe();
    updateStatus("");
    document.getElementById("sos-button").classList.remove("armed");
    document.getElementById("sos-cancel").classList.add("hidden");
  }

  function updateStatus(text) {
    document.getElementById("sos-status").textContent = text;
  }

  // ---------- Alarm sound ----------
  function startAlarm() {
    const el = alarmEl();
    el.currentTime = 0;
    el.volume = 1.0;
    el.play().catch((err) => {
      console.warn("Alarm audio blocked until user interaction:", err);
    });
  }

  function stopAlarm() {
    const el = alarmEl();
    el.pause();
    el.currentTime = 0;
  }

  // ---------- Flashlight strobe ----------
  async function startStrobe() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities ? track.getCapabilities() : {};

      if (!capabilities.torch) {
        console.warn("Torch not supported on this device/browser.");
        track.stop();
        return;
      }

      torchTrack = track;
      strobeInterval = setInterval(async () => {
        strobeOn = !strobeOn;
        try {
          await torchTrack.applyConstraints({ advanced: [{ torch: strobeOn }] });
        } catch (e) {
          console.warn("Torch toggle failed:", e);
        }
      }, 300);
    } catch (err) {
      console.warn("Camera/torch access denied or unsupported:", err);
    }
  }

  function stopStrobe() {
    if (strobeInterval) {
      clearInterval(strobeInterval);
      strobeInterval = null;
    }
    if (torchTrack) {
      try {
        torchTrack.applyConstraints({ advanced: [{ torch: false }] });
      } catch (e) {}
      torchTrack.stop();
      torchTrack = null;
    }
  }

  // ---------- SMS ----------
  function sendSms() {
    const pos = Geo.getPosition();
    const locationText = pos
      ? `My location: https://maps.google.com/?q=${pos.lat},${pos.lng} (lat:${pos.lat.toFixed(5)}, lng:${pos.lng.toFixed(5)})`
      : "Location unavailable (no GPS fix yet).";

    const message = `SOS — I need help. ${locationText} — sent via Setu app.`;

    const numbers = collectRecipients(pos);

    if (!numbers.length) {
      updateStatus("SOS armed, but no contacts/services found nearby to message.");
      return;
    }

    // NOTE ON MULTI-RECIPIENT SMS URIs:
    // Support for multiple recipients in an `sms:` URI is inconsistent.
    // Most Android devices accept comma-separated numbers. iOS Safari
    // generally only reliably opens a single-recipient thread.
    // For the hackathon demo, the safest approach is to open one
    // pre-filled SMS intent per recipient, a short delay apart, so the
    // user can review + send each one. Adjust this to a single
    // comma-joined URI if you confirm it works fine on your demo device.
    numbers.forEach((num, i) => {
      setTimeout(() => {
        const uri = `sms:${num}${isIOS() ? "&" : "?"}body=${encodeURIComponent(message)}`;
        window.open(uri, "_blank");
      }, i * 400);
    });
  }

  function collectRecipients(pos) {
    const contacts = ContactsModule.getValidContacts().map((c) => c.phone);

    const nearestOf = (category) => {
      if (!pos) return [];
      const results = Geo.nearest(POI_DATA, category, pos.lat, pos.lng, 1);
      return results.map((r) => r.phone);
    };

    return [
      ...contacts,
      ...nearestOf("police"),
      ...nearestOf("hospital"),
      ...nearestOf("legal"),
    ].filter(Boolean);
  }

  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  function init() {
    const btn = document.getElementById("sos-button");
    const cancelBtn = document.getElementById("sos-cancel");
    btn.addEventListener("click", trigger);
    cancelBtn.addEventListener("click", cancel);
  }

  return { init, trigger, cancel };
})();
