# Setu — Offline City Safety Map + SOS (Starter Code)

A working starter build of the Setu PWA: offline map with live GPS, a
curated safety-location database, nearest-point lookup, static offline info
panels, and a full SOS system (flashlight strobe + alarm + SMS alert).

No build tools required — plain HTML/CSS/JS. Runs in any modern mobile
browser and installs as a PWA.

## Run it locally

Browsers block Geolocation, Camera (torch), and Service Workers on
plain `file://` pages — you need to serve it over `http://localhost` or
HTTPS. Easiest option:

```bash
cd setu-app
python3 -m http.server 8000
```

Then open `http://localhost:8000` on your laptop, or `http://<your-laptop-ip>:8000`
on your phone (same Wi-Fi network) to test GPS/torch/SOS on a real device.

For a real demo, deploy to any static host with HTTPS (required for Torch
and Geolocation APIs on mobile): GitHub Pages, Netlify, or Vercel all work
free and take minutes.

## What's implemented

| Feature | File | Status |
|---|---|---|
| Offline map + live GPS marker | `js/map.js`, `js/geo.js` | Working — map tiles load from OSM online, cached for offline reuse. See note below. |
| Curated safety database | `js/data.js` | Working — **sample data only**, replace before the hackathon |
| Nearest-location lookup | `js/geo.js` (`Geo.nearest`) | Working — Haversine distance |
| Static info panels | `js/info.js`, `js/data.js` | Working — first aid, rights, crowd-control survival, emergency numbers |
| Basic UI / navigation | `js/nav.js`, `index.html`, `css/style.css` | Working — bottom nav across 4 screens |
| SOS: flashlight strobe | `js/sos.js` | Working on Android Chrome. **Not supported on iOS Safari/PWA** — no browser Torch API there. |
| SOS: loud alarm | `js/sos.js` | Working — placeholder tone in `assets/alarm.wav`, swap for a louder/better siren file |
| SOS: SMS to contacts + nearest services | `js/sos.js`, `js/contacts.js` | Working — opens native SMS app pre-filled per recipient; user still taps Send (browsers can't auto-send SMS) |
| Offline caching (PWA) | `sw.js`, `manifest.json` | Working — caches app shell on first load |

## Before the hackathon — do this prep, not during the 30 hours

1. **Replace sample data in `js/data.js`** with real, verified hospitals,
   police stations, legal aid contacts, and embassies/consulates for your
   actual demo city. This is the single biggest time sink — do it in advance.
2. **Map tiles for true offline use.** Right now tiles load from the public
   OSM server and get cached by the service worker as you browse. For a
   guaranteed offline demo:
   - Simplest: open the app once while online, pan/zoom around your exact
     demo route so those tiles get cached, then you can go offline for the
     real demo.
   - Better: pre-download tiles for your city (e.g. via MapTiler or a QGIS
     export) and point `tileUrlTemplate` in `js/map.js` at your local tile
     files instead of the OSM URL.
3. **Test SOS on your actual phone**, not just the laptop browser:
   - Torch/strobe: Android Chrome only. Confirm it actually toggles your
     specific phone's flashlight.
   - SMS: confirm the `sms:` URI behavior on your device/OS version — some
     Android versions handle multiple pre-filled SMS windows differently.
   - iOS: strobe won't work; alarm sound and SMS should still work.
4. **Swap the alarm sound** in `assets/alarm.wav` for something louder /
   more attention-grabbing — the current file is a simple placeholder tone
   generated for this starter, not a real siren.
5. **Fill in your 5 contacts** via the Contacts tab before demoing — SOS
   pulls from what's saved in `localStorage` on the device.

## Known limitations (mention these honestly in your pitch, don't hide them)

- SMS cannot be sent silently — browsers require the user to tap Send in
  their native SMS app for privacy/security reasons. This is a one-tap
  step, not fully automatic.
- iOS Safari does not expose a Torch API, so flashlight strobe is
  Android-only for now.
- If cellular service itself is down (not just mobile data), SMS won't
  work either — this scenario needs the Phase 2 mesh-network roadmap item.
- The multi-recipient SMS behavior varies by Android OEM/version — test on
  your actual demo device.

## Roadmap (not built, mention in pitch)

- Bluetooth / Wi-Fi Direct mesh messaging for when cellular is also down.
- On-device small LLM (e.g. Phi-3-mini, Gemma 2B) for offline Q&A.
