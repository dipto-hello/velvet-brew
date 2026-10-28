# 06_Plan.md: Implementation & Verification Plan
**Project Name:** L'Aroma Artisanal Cafe & Bistro  
**Version:** 1.0.0-MVP  

---

## Phase Breakdown

### Phase 1: Semantic Scaffold & Navigation
- [ ] Create `index.html` with clean semantic sections (`#hero`, `#menu`, `#story`, `#visit`).
- [ ] Build Top Navigation with logo, links, "Reserve a Table" button, and Cart icon badge.

### Phase 2: Design Tokens & Hero Experience
- [ ] Create `styles/main.css` implementing warm oat & espresso palette.
- [ ] Build Hero section with tagline, live opening status, and high-impact culinary visual.

### Phase 3: Interactive Menu & Filtering Engine
- [ ] Create `src/menu-data.js` with 12 signature artisan items across Coffee, Bakery, Bistro, and Desserts.
- [ ] Implement category tab filtering with smooth fade-in transitions.
- [ ] Add dietary badge filters (`Vegan`, `Gluten-Free`, `Chef's Pick`).

### Phase 4: Order Cart Drawer & Reservation System
- [ ] Implement slide-out cart drawer with quantity counters, subtotal calculation, and instant checkout toast.
- [ ] Implement accessible table reservation modal with date/time pickers and confirmation dialog.

### Phase 5: Playwright MCP Verification & Screenshots
- [ ] Start local server and navigate with `playwright` MCP.
- [ ] Perform click tests on menu filters, cart addition, and reservation booking.
- [ ] Capture high-resolution full-page screenshots for visual review.
- [ ] Verify 0 console errors and 0 warnings.
