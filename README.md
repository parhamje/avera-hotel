# AVÉRA · Luxury Boutique Resort

> A bespoke, cinematic luxury resort website with scroll-scrubbed video sequences, minimal editorial typography, and interactive reservation systems.

![AVÉRA Cover](assets/images/gallery-01.jpg)

---

## ✦ Overview

**AVÉRA** is an editorial-grade luxury hotel web experience designed to feel like a cinematic interactive publication. Rather than generic looping background videos or standard hotel carousels, scrolling directly controls the playback of high-definition cinematic video sequences (`video.currentTime = progress * video.duration`).

The visual direction follows warm, tactile luxury minimalism:
- **Palette**: Deep Charcoal (`#12110F`, `#1C1A17`), Warm Ivory (`#F4F1EA`, `#FAF8F5`), and Muted Champagne Gold (`#C8A97E`).
- **Typography**: Cormorant Garamond (Editorial serif headlines) and Manrope (Geometric sans-serif body & metadata).
- **Architecture**: Hairline borders, generous whitespace, asymmetric masonry gallery, and spring-physics custom cursor.

---

## ✦ Tech Stack

This project was built adhering strictly to the required constraint: **zero external JS frameworks or heavy 3D engines**.

- **HTML5**: Semantic sections, high-priority preloading, accessible ARIA attributes.
- **CSS3 / Tailwind CSS**: Fine-tuned design tokens, backdrop filters, responsive grid and sticky layout positioning.
- **Vanilla JavaScript (ES6+)**:
  - `video-scroll.js`: Hardware-accelerated rAF LERP loop with non-blocking seek queuing.
  - `animations.js`: Asymmetric parallax speeds, scroll reveal observer, dynamic light/dark navbar theme detector.
  - `cursor.js`: Custom spring follower with context labels (`VIEW`, `EXPLORE`, `BOOK`).
  - `main.js`: Luxury loading counter, full-screen mobile menu drawer, keyboard-navigable Lightbox, and WhatsApp booking integration.
- **Node.js (`server.js`)**: Lightweight HTTP server supporting RFC 7233 Range requests (`206 Partial Content`) for frame-accurate video seeking.

---

## ✦ Cinematic Video Mapping

All 6 videos are located in `assets/videos/`:

| File | Section | Cinematic Narrative |
| :--- | :--- | :--- |
| `1.mp4` | **01 — Hero** | Bedroom &rarr; Window &rarr; Terrace &rarr; Sanctuary Reveal |
| `2.mp4` | **02 — Deluxe King Room** | Luxury Bedroom &rarr; Bed &rarr; Terrace &rarr; Mountain View |
| `3.mp4` | **03 — Garden Suite** | Bedroom &rarr; Private Plunge Pool &rarr; Tropical Foliage |
| `4.mp4` | **04 — Signature Suite** | Luxury Suite &rarr; Infinity Edge Pool &rarr; Sunset Horizon |
| `5.mp4` | **05 — Resort Grounds** | Aerial Cinematic Sweep over pools, pavilions, and ocean |
| `6.mp4` | **06 — Evening / Night** | Dusk glow &rarr; Warmly lit water &rarr; Twilight atmosphere |

---

## ✦ 60 FPS Scroll-Scrub Video Engine Architecture

To achieve true, zero-lag 60 FPS scrubbing in browser hardware decoders, two critical engineering challenges were solved:

1. **60 FPS All-Intra Encoding (`-g 1`)**:
   Standard MP4 streaming files place an I-frame (keyframe) only once every few seconds. When a browser seeks to frame 150, the decoder must re-decode 150 preceding frames from frame 0 sequentially, causing 100ms–200ms seek latency (choppy ~8 FPS).
   All 6 AVÉRA videos were converted to genuine **60 FPS All-Intra** (`480 frames / 8.0s`), where **every single frame is an I-frame**.
   Seek latency dropped from **109ms down to 4ms**, unlocking instant 60 FPS response.

2. **1/60s Frame-Quantized Synchronization**:
   Instead of seeking to arbitrary micro-floats (which forces the decoder to recalculate identical frames), the engine quantizes scroll position into exact frame indices:
   `frameIndex = Math.round(progress * (totalFrames - 1))`
   `targetTime = frameIndex * (1 / 60)`
   Seeks only trigger when the frame index actually increments or decrements.

```
[User Scrolls Section]
         │
         ▼
[Measure Normalized Progress: 0.000 to 1.000]
         │
         ▼
[LERP Liquid Interpolator: currentProgress += (target - current) * 0.18]
         │
         ▼
[Calculate 60 FPS Frame Index: round(p * 479)]
         │
         ├─► If frameIndex == lastFrameIndex ──► [Skip redundant seek]
         │
         ▼
[video.currentTime = frameIndex * (1/60)] (4ms hardware seek)
         │
         ▼
[Update Phase Typography Opacity & TranslateY]
[Update HUD Bottom Progress Bar & Percentage]
```

### Key Technical Implementations:
1. **Sticky Viewport Pinning**: Each video section is styled with `height: 280vh` containing a `position: sticky; top: 0; height: 100vh;` container. The video stays locked in view while the user scrubs forward or backward through the timeline.
2. **High-Frequency Non-Blocking Queue**: Detects browser `seeking` state and drains queued targets within a 25ms safety window.
3. **Viewport Memory Priming**: Videos are set to `preload="auto"` so that all 480 frames reside in GPU/RAM cache for instantaneous random access.
4. **RFC 7233 HTTP 206 Partial Content**: The local server streams byte ranges with `Accept-Ranges: bytes` headers.

---

## ✦ Website Sections

1. **Luxury Loader**: Minimal countdown counter (`AVÉRA — A PLACE TO REMEMBER`), fading cleanly when the hero video is primed.
2. **Fixed Adaptive Navbar**: Transparent over dark video sequences; dynamically shifts to frosted warm ivory over light editorial sections.
3. **Hero Sequence (`1.mp4`)**: Editorial headline fading into terrace reveal as scroll progresses.
4. **Editorial Intro**: Warm ivory background with statistics: 24 Rooms, 08 Suites, 12 Private Villas.
5. **Accommodation Experiences (`2.mp4`, `3.mp4`, `4.mp4`)**:
   - Deluxe King Room ($480 / night, 48 M²)
   - Garden Suite ($720 / night, 64 M²)
   - Signature Suite ($1,150 / night, 82 M²)
6. **Resort Amenities**: Architectural 4x2 hairline grid with 8 fine-line SVG icons.
7. **Resort Panorama (`5.mp4`)**: Aerial drone sweep with monumental headline *"More than a room"*.
8. **Experience Columns**: Three editorial time-stamped columns (Slow Mornings, Local Flavours, Quiet Escapes).
9. **Asymmetric Gallery**: Multi-column masonry grid with varying parallax scroll speeds and interactive Lightbox modal.
10. **Evening / Dusk (`6.mp4`)**: Twilight illumination sequence leading directly into reservations.
11. **Booking System**: Deep charcoal form with date pickers, guests, room preselection, and one-click WhatsApp dispatch.
12. **Location & Arrival**: Coordinates (`8° 22' 14" S · 115° 18' 36" E`), architectural SVG vector map, and arrival logistics.
13. **Monumental Footer**: Oversized brand wordmark, concierge email, social links, and smooth back-to-top anchor.

---

## ✦ Live Production Deployments

The AVÉRA Luxury Resort digital experience is deployed and accessible at:

* **Official Live Site (GitHub Pages)**: **[https://parhamje.github.io/avera-hotel/](https://parhamje.github.io/avera-hotel/)**
* **Source Repository**: **[https://github.com/parhamje/avera-hotel](https://github.com/parhamje/avera-hotel)**

---

## ✦ 100% Local Architecture & Netlify Drop Ready

This project is **100% self-contained and offline-ready**. It makes **zero external CDN or font requests**:
- **Fonts**: Self-hosted WOFF2 fonts for Cormorant Garamond & Manrope located in `/fonts/`.
- **CSS**: Pre-compiled standalone Tailwind CSS in `/css/tailwind.css` (no CDN runtime).
- **Netlify Configuration**: Includes `_headers`, `_redirects`, and `netlify.toml` configured for RFC 7233 byte-range video streaming and immutable CDN edge caching.

### Deploying via Netlify Drop (Zero Build Steps)

1. Navigate to **[app.netlify.com/drop](https://app.netlify.com/drop)** in your web browser.
2. Drag and drop either the `avera-hotel` folder or the packaged **`avera-hotel.zip`** file directly into the upload area.
3. Your luxury resort experience will deploy instantly to a live worldwide CDN URL.

---

## ✦ Getting Started Locally

### 1. Requirements
- Modern web browser (Chrome, Safari, Edge, Firefox)
- Node.js (for the local range-request development server)

### 2. Running Locally
Run the built-in HTTP Range development server:

```bash
node server.js
```

Then open your browser and navigate to:
```
http://localhost:3000
```

### 3. File Structure
```
avera-hotel/
├── assets/
│   ├── images/              # Editorial photography (intro + gallery 01-08)
│   └── videos/              # 6 cinematic 60 FPS All-Intra videos (1.mp4 - 6.mp4)
├── css/
│   ├── fonts.css            # Local @font-face declarations
│   ├── style.css            # Custom typography, cursor, vignette, transitions
│   └── tailwind.css         # Compiled standalone Tailwind utility stylesheet
├── fonts/                   # Self-hosted WOFF2 fonts (Cormorant Garamond & Manrope)
├── js/
│   ├── animations.js        # Scroll reveals, gallery parallax, navbar theme
│   ├── cursor.js            # Custom luxury magnetic follower
│   ├── main.js              # Loader, mobile menu, lightbox, booking form
│   └── video-scroll.js      # Frame-accurate 60 FPS scroll video scrubbing engine
├── index.html               # Main semantic HTML document
├── netlify.toml             # Netlify build and cache headers configuration
├── _headers                 # Netlify Drop HTTP range and security headers
├── _redirects               # Netlify Drop clean URL routing
├── server.js                # Local development HTTP server with Range support
└── README.md                # Documentation & Architecture
```

---

## ✦ License
Private luxury resort digital showcase. All rights reserved.
