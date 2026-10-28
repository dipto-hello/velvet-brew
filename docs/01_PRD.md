# 01_PRD.md: Product Requirements Document
**Project Name:** L'Aroma Artisanal Cafe & Bistro  
**Version:** 1.0.0-MVP  
**Category:** Hospitality, Specialty Dining & Artisanal Coffee  
**Status:** Under Review (Phase 1 Blueprint Gate)  

---

## 1. Problem Statement
Coffee lovers and food enthusiasts often encounter restaurant websites that are either static PDF menus, slow-loading templates with broken layouts, or generic AI slop with fake clip-art and low contrast. Customers want a welcoming, mouth-watering digital experience where they can easily browse signature dishes, filter dietary preferences, order takeaway online, and reserve a table in seconds with zero hassle.

## 2. Target Persona
- **Food & Coffee Enthusiasts:** Looking for high-quality specialty coffee, fresh sourdough bakes, and bistro dishes.
- **Diners booking reservations:** Seeking quick confirmation of table availability without phone calls.
- **Takeaway customers:** Wanting a streamlined ordering process with a live cart and subtotal calculator.

## 3. Core MVP Scope
1. **Atmospheric Hero Section:**
   - Brand story ("Artisan Sourdough & Specialty Roasts Crafted Daily since 2018").
   - Quick action pills: "Reserve Table", "Explore Menu", and live "Open Today until 10:00 PM" badge.
2. **Interactive Categorized Menu:**
   - Filter tabs: `Specialty Coffee`, `Artisanal Bakery`, `Bistro Plates`, `Desserts & Elixirs`.
   - Dietary badges (`Vegan`, `Gluten-Free`, `Chef's Pick`).
   - "Add to Order" with price and real-time cart update.
3. **Live Slide-Out Order Cart:**
   - Shows selected items, quantity increments (+/-), subtotal, delivery/pickup toggle, and simulated checkout.
4. **Table Reservation Modal:**
   - Date selector, guest party size (1–8 guests), seating preference (Patio, Dining Room, Coffee Bar), and instant confirmation toast.
5. **Artisanal Story & Origin Showcase:**
   - Single-origin bean sourcing and morning bakery ritual.
6. **Hours, Location & Visit Info:**
   - Address, parking information, opening hours, and phone/directions buttons.

---

## 4. Strict Scope Shield (লক্ষ্মণরেখা / Non-Goals)
- ❌ **Non-Goal 1:** No complex external payment gateways (e.g. Stripe API keys or merchant accounts required). Uses a client-side simulated order confirmation with receipt generation.
- ❌ **Non-Goal 2:** No heavy PDF menu downloads; all items are rendered natively for instant accessibility on mobile and desktop.
- ❌ **Non-Goal 3:** No blurry generic clip-art; uses high-quality curated royalty-free culinary photography and warm CSS design tokens.
