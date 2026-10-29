# ☕ Velvet Brew // Coffee Roasters & Cafe, Banani, Dhaka

[![Live Edge](https://img.shields.io/badge/Live_Deployment-Cloudflare_Workers-orange?style=for-the-badge&logo=cloudflare)](https://velvet-brew.sarkerdipto107.workers.dev/)
[![Performance](https://img.shields.io/badge/60_FPS-Hardware_Accelerated-success?style=for-the-badge)](https://velvet-brew.sarkerdipto107.workers.dev/)
[![Stack](https://img.shields.io/badge/Vanilla_JS-ES_Modules-yellow?style=for-the-badge&logo=javascript)](https://velvet-brew.sarkerdipto107.workers.dev/)
[![Design](https://img.shields.io/badge/Aesthetic-Deep_Espresso_Noir-8B5A2B?style=for-the-badge)](https://velvet-brew.sarkerdipto107.workers.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

An award-class, bespoke scrollytelling web experience crafted for **Velvet Brew Coffee Roasters & Cafe** on Road 11, Banani, Dhaka. Built with a decoupled 60 FPS HTML5 Canvas engine, zero-box optical typography, unified dark luxury aesthetics, next-gen WebP asset pipeline, Google Gemini Pro bespoke photography, and rich real-world interactive capabilities.

🔗 **Production Live Sites:**
* **Primary Cloudflare Worker:** **[https://velvet-brew.sarkerdipto107.workers.dev/](https://velvet-brew.sarkerdipto107.workers.dev/)**
* **GitHub Pages Live Mirror:** **[https://dipto-hello.github.io/velvet-brew/](https://dipto-hello.github.io/velvet-brew/)**

---

## 🎬 Architecture & Key Features

### 1. Decoupled 60 FPS Hardware-Accelerated Canvas Cinema
* **Native Compositor Scrolling:** Zero wheel hijacking, zero virtual-scroller lag. Native sticky viewport (`position: sticky; top: 0; width: 100vw; height: 100vh;`).
* **Decoupled Render Loop:** Scroll listeners calculate normalized progress (`state.targetProgress`) with `{ passive: true }`. Rendering executes on an independent `requestAnimationFrame` loop with kinetic lerping (`current += (target - current) * 0.16`).
* **Responsive Focal Math:** Dynamic aspect ratio preservation with custom focal coordinates (`focalX`, `focalY`) keeping the visual subject in the golden ratio across 4K displays and smartphones alike.

### 2. 100% Transparent Zero-Box Optical Typography
* **No Artificial Blur Boxes:** Eliminates the classic "AI-slop" habit of dropping opaque frosted glass cards over visual art.
* **Multi-Stage Optical Halo:** Crisp, readable typography directly over high-contrast 4K imagery via a tuned 4-tier optical shadow stack:
  ```css
  text-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.95),
    0 6px 18px rgba(0, 0, 0, 0.95),
    0 12px 36px rgba(0, 0, 0, 0.90),
    0 20px 50px rgba(0, 0, 0, 0.85);
  ```

### 3. Unified Deep Espresso Noir & Caramel Brass Aesthetic
* Cohesive dark luxury palette across every section:
  * `--bg-dark-espresso`: `#0E0A08`
  * `--bg-card-dark`: `#17110D`
  * `--accent-caramel`: `#D48D3B`
  * `--text-primary`: `#FAF6F0`
* Crisp golden gradient CTA buttons (`linear-gradient(135deg, #D48D3B 0%, #B67123 100%)`) with high-contrast text (`#16100C`, font-weight: 700).

### 4. Interactive Full Product Suite
* **Filterable Seasonal Menu:** Live category switching (Specialty Coffee, Fresh Bakery, Breakfast & Lunch, Desserts) paired with real-time dietary preference chips (Vegan, Gluten-Free, Chef's Pick).
* **Slide-Over Cart Drawer:** Reactive client-side order manager with subtotal calculation, tax estimation, and animated toast feedback.
* **Accessible Reservation Modal:** Built using the native HTML `<dialog>` element with full keyboard dismissibility (`Escape`), backdrop click dismiss, and input validation.

### 5. Next-Gen WebP Asset Pipeline & Performance
* **22 High-Fidelity Assets Converted to WebP:** Reduces overall visual asset weight by 40%–68% with zero perceptual quality degradation.
* **Critical Asset Preloading:** Key hero and scrollytelling frames preloaded with `<link rel="preload" as="image" fetchpriority="high">` for sub-second LCP.
* **Modern `<picture>` Responsive Elements:** Semantic `<picture><source type="image/webp"><img loading="lazy" decoding="async"></picture>` elements for off-screen cards.

### 6. Social Sharing (OpenGraph) & Local Dhaka SEO
* Rich preview cards configured for WhatsApp, Facebook, LinkedIn, and X (`og:image`, `og:title`, `og:description`).
* Geo coordinates (`23.7937, 90.4066`) for Banani, Dhaka.
* Schema.org `CafeOrCoffeeShop` JSON-LD structured data for Google Search rich snippets.

---

## 🛠️ Project Structure

```text
artisan-cafe/
├── assets/
│   └── images/            # High-res WebP & JPG assets (Cinema, Food, Interior)
├── docs/                  # Engineering specifications (PRD, AppFlow, UI, TRD, Schema, Plan)
├── scripts/
│   └── convert-webp.js    # Batch WebP conversion utility
├── src/
│   ├── app.js             # Core application controller (Cart, Modal, Menu, Toasts)
│   ├── menu-data.js       # Curated seasonal menu catalog
│   └── scrolly-cinema.js  # 60 FPS HTML5 Canvas scrollytelling engine
├── styles/
│   ├── main.css           # Global layout, tokens, typography & component styles
│   └── scrolly-cinema.css # Canvas viewport, HUD telemetry & chapter styling
├── index.html             # Semantic entry point with OpenGraph & JSON-LD
├── server.js              # Lightweight zero-dependency HTTP preview server
└── README.md              # Project documentation
```

---

## 🚀 Local Development Setup

To run this project locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dipto-hello/velvet-brew.git
   cd velvet-brew
   ```

2. **Start the local server:**
   ```bash
   node server.js
   ```

3. **Open in your browser:**
   ```text
   http://localhost:3000
   ```

---

## 🌐 Live Production Deployment

This project is continuously deployed to production edge networks:

* **Production URL (Cloudflare Workers):** [https://velvet-brew.sarkerdipto107.workers.dev/](https://velvet-brew.sarkerdipto107.workers.dev/)
* **Alternative Live Mirror (GitHub Pages):** [https://dipto-hello.github.io/velvet-brew/](https://dipto-hello.github.io/velvet-brew/)
* **Status:** 24/7 Always Active • 0 Console Errors • Global CDN Caching

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

---

*Crafted with precision by [@dipto-hello](https://github.com/dipto-hello).*
