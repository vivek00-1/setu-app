# Setu (सेतु) — Offline-First Safety Map & SOS

**A safety app that keeps working when the network doesn't.**

Setu is a Progressive Web App that combines an offline map, a pre-loaded directory of emergency services, offline safety guides, and a one-tap SOS that shares your GPS location by SMS. It needs no backend and no live internet connection once it has loaded.

**Live demo:** https://vivek00-1.github.io/setu-app/
*(Open it on a phone, allow location access, and use "Add to Home Screen" to install it.)*

> **Project status: prototype.** The hospital, police, legal-aid and consulate entries in this repo are **placeholder sample data** with fake phone numbers. Do not rely on this app in a real emergency until the dataset is replaced with verified entries (see [Roadmap](#roadmap)).

---

## Why Setu?

The moment you need help most is often the moment connectivity is least reliable:

- **Women's safety:** walking alone at night, one tap should alert people and draw attention without fumbling through menus.
- **Elderly emergencies:** a fall or medical event needs a single, obvious button.
- **Natural disasters:** floods and cyclones can overload or take down data networks.
- **Internet shutdowns and dead zones:** curfews, remote areas, basements, tunnels.
- **Travellers:** navigation and local emergency numbers in an unfamiliar city.

Setu is built on three facts that hold even without mobile data:

1. **GPS is a one-way satellite signal**, so location works without internet.
2. **Maps and safety data can be cached ahead of time.**
3. **SMS travels over the cellular signalling channel**, separate from mobile data, so it often still works when data does not.

## Features

| Feature | Description |
|---|---|
| **Offline map + live GPS** | Leaflet map with a live position marker and accuracy ring. Tiles are cached by a service worker after first view. |
| **Safety directory** | Hospitals, police stations, legal aid and embassies/consulates stored locally as JSON, with tap-to-call and tap-to-SMS. |
| **Nearest lookup** | One tap finds the closest place in a category using the Haversine distance formula, entirely on-device. |
| **Offline info panels** | First aid, know-your-rights basics, crowd-control safety, and emergency numbers (India). |
| **SOS button** | Flashlight strobe, loud looping alarm, and SMS with GPS coordinates to up to 5 personal contacts plus the nearest police station, hospital and legal-aid office. |
| **Emergency contacts** | Up to 5 contacts saved on your device only (`localStorage`). |
| **Installable PWA** | Works from the home screen and opens without a network after the first load. |

## How it works

```
Device GPS ──► Geo module ──► Map + nearest-place lookup (Haversine)
                                   │
Local JSON dataset ────────────────┤
                                   ▼
                              SOS module ──► Torch API (strobe)
                                          ├► Looping alarm (<audio>)
                                          └► sms: links (contacts + nearest services, with GPS link)

Service Worker ──► caches app shell, Leaflet, and viewed map tiles for offline use
```

There is no server, no account, and no analytics. Contacts and settings never leave your device except inside the SMS you choose to send.

## Tech stack

- Plain **HTML, CSS and JavaScript** (no build step)
- **Leaflet 1.9.4** with OpenStreetMap tiles
- **Geolocation API**, **MediaStream Torch constraint**, **`sms:` URI scheme**
- **Service Worker** and **Web App Manifest** (PWA)

## Run it locally

Geolocation, camera (torch) and service workers need `http://localhost` or HTTPS, so opening `index.html` directly will not work.

```bash
git clone https://github.com/vivek00-1/setu-app.git
cd setu-app
python3 -m http.server 8000
```

Then open http://localhost:8000.

To test GPS, flashlight and SOS on a real phone you need HTTPS. The easiest options are GitHub Pages (this repo's demo link) or a tunnel such as `ngrok http 8000`.

## Project structure

```
setu-app/
├── index.html          # App shell and four screens (Map, Info, SOS, Contacts)
├── manifest.json       # PWA manifest
├── sw.js               # Service worker (offline caching)
├── css/style.css       # Styling
├── js/
│   ├── data.js         # Places dataset and info-panel content
│   ├── geo.js          # GPS wrapper and Haversine distance
│   ├── map.js          # Leaflet map, markers, nearest lookup
│   ├── info.js         # Info panels
│   ├── contacts.js     # Emergency contacts (localStorage)
│   ├── sos.js          # Strobe, alarm and SMS logic
│   ├── nav.js          # Bottom navigation
│   └── app.js          # Entry point
├── icons/              # PWA icons
└── assets/alarm.wav    # Alarm sound (placeholder tone)
```

## Customising the data

Edit `js/data.js`. Each place looks like this:

```js
{ id: "h1", category: "hospital", name: "City Hospital", phone: "+91XXXXXXXXXX",
  lat: 22.5793, lng: 88.4790, address: "New Town, Kolkata" }
```

Categories are `hospital`, `police`, `legal` and `embassy`. Change `DEFAULT_CENTER` in `js/map.js` to your city.

## Known limitations

- **SMS is not silent.** Browsers cannot send SMS automatically, so the SMS app opens pre-filled and you tap Send for each message.
- **Flashlight strobe works on Android Chrome only.** iOS has no browser torch API, so on iPhone the alarm and SMS still work but the strobe does not.
- **No signal means no SMS.** If the cellular network itself is down, not just mobile data, SMS fails too.
- **Map tiles are cached only after you view them.** Browse your area once while online. Fully offline map packs are on the roadmap.
- **Multi-recipient SMS behaviour varies** across Android versions and manufacturers.
- **Placeholder data and sound.** The directory entries and alarm tone are samples.

## Disclaimer

The first-aid and rights information is general guidance, not medical or legal advice. In an emergency, call your local emergency number (112 in India).

## Roadmap

- [ ] Replace sample data with verified, sourced entries for a pilot city
- [ ] Pre-packaged offline map tiles (no need to browse first)
- [ ] Louder, realistic siren and a user-selectable alarm
- [ ] Real screenshots and a short demo video in this README
- [ ] Bluetooth / Wi-Fi Direct mesh messaging for total network outages
- [ ] On-device small language model for offline Q&A and translation
- [ ] Hindi and Bengali interface

## Author

**Vivek Kumar** — [@vivek00-1](https://github.com/vivek00-1)

<!--
Add screenshots after testing on your phone:

## Screenshots
| Map | SOS | Safety Info |
|---|---|---|
| ![Map](docs/map.png) | ![SOS](docs/sos.png) | ![Info](docs/info.png) |

Create a `docs/` folder, add the images, and uncomment this block.
-->
