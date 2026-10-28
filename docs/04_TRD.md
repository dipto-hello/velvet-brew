# 04_TRD.md: Technical Requirements Document
**Project Name:** L'Aroma Artisanal Cafe & Bistro  
**Version:** 1.0.0-MVP  

---

## 1. Tech Stack & Standards
- **Markup:** Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<dialog>`, `<footer>`).
- **Styles:** Modern CSS3 using CSS Grid, Flexbox, custom properties, smooth scroll, and accessible contrast.
- **Client Logic:** Pure Vanilla ES Modules (ESM) with zero runtime dependencies.
- **Persistence:** LocalStorage for cart contents and booking status.

---

## 2. 20/20 Security & Performance Shield
- **XSS Prevention:** All user inputs in the reservation form and cart are strictly sanitized via `textContent` binding.
- **Zero Heavy Bundles:** Page size < 150KB (excluding optimized images), enabling sub-50ms paint times.
- **ARIA & Keyboard Accessibility:** Accessible `<dialog>` elements for reservation modals, proper `aria-expanded` and `aria-label` tags on cart buttons.
