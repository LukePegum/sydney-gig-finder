# 🎸 Sydney Gig Finder

An interactive map for finding live-music venues across Sydney that you can apply
to play at — with booking requirements, contacts and indicative pay.

Built with **Vite + React** and **Leaflet** (OpenStreetMap tiles — no API key needed).

## Features

- **Interactive map** of greater Sydney with a synced venue list and detail panel.
- **Curated venues** with the detail that matters to a performing artist:
  - 💰 Potential pay (pay model + indicative range)
  - ✅ Requirements to apply / play
  - 📨 How to apply (+ link to the venue)
- **Open-mic nights** (no pay) — turn-up-and-play spots, flagged separately.
- **Community-mapped venues** pulled live from OpenStreetMap, covering many
  smaller / less-advertised spots (location only — booking details unverified).
- **Filters:** opportunity type (paid gig / open mic / any live-music venue),
  region, genre, originals vs covers, and data source.

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build
npm run preview  # preview the production build
```

## ⚠️ Important: data is indicative

Pay figures and requirements for curated venues are **typical ranges for that
kind of room, not quotes** — always confirm current terms directly with the
venue's booker before applying. Community-mapped (OpenStreetMap) venues are
**location only and unverified**: treat them as leads and research them yourself.
Open-mic nights change regularly — confirm the current night before heading down.

## Tech

- [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- [Leaflet](https://leafletjs.com/) via [react-leaflet](https://react-leaflet.js.org/)
- [OpenStreetMap](https://www.openstreetmap.org/) tiles + the
  [Overpass API](https://overpass-api.de/) for community-mapped venues

Map data © OpenStreetMap contributors.
