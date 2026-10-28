# 02_AppFlow.md: Application Flow & User Journey
**Project Name:** L'Aroma Artisanal Cafe & Bistro  
**Version:** 1.0.0-MVP  

---

## 1. User Journey Map

```
[Customer Lands on Page]
   │
   ├──► [Hero Interaction] ──────────► Clicks "Reserve a Table" ──► Reservation Modal Opens
   │                                                                       │
   │                                                                       ▼
   │                                                          [Inputs Party & Time] ──► Instant Booking Toast
   │
   ├──► [Menu Browsing] ─────────────► Clicks Category Filter (Coffee, Bakery, Bistro)
   │                                           │
   │                                           ▼
   │                                    [Clicks "Add to Order"]
   │                                           │
   │                                           ▼
   │                                    [Cart Badge Increments + Slide-over Drawer opens]
   │                                           │
   │                                           ▼
   │                                    [Review Order & Subtotal] ──► Simulated Instant Checkout
   │
   └──► [Visit & Hours] ─────────────► Views Live Status (Open Now / Closed) & Google Maps Link
```

---

## 2. Screen State Machine

```
              ┌────────────────────────┐
              │    INITIAL PAGE LOAD   │
              └───────────┬────────────┘
                          │ (Hydrate Cart from LocalStorage)
                          ▼
              ┌────────────────────────┐
              │      BROWSE_VIEW       │◄────────────────┐
              └───────────┬────────────┘                 │
                          │                              │
           ┌──────────────┼──────────────┐               │ (Close / Dismiss)
           ▼              ▼              ▼               │
     ┌───────────┐  ┌───────────┐  ┌───────────┐         │
     │ CART_OPEN │  │ MODAL_    │  │ CHECKOUT_ │─────────┘
     │ (DRAWER)  │  │ RESERVE   │  │ SUCCESS   │
     └───────────┘  └───────────┘  └───────────┘
```

---

## 3. Responsive Touch & Desktop Transitions
- **Mobile (< 768px):** Bottom sticky order floating bar with cart count and quick reservation button.
- **Desktop (>= 768px):** Sticky elegant navigation bar with smooth scroll anchors to `#menu`, `#story`, and `#visit`.
- **Keyboard Navigation:** Full `ESC` key handling to dismiss cart drawer and reservation dialog.
