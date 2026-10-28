# 05_Schema.md: Data Models & Specifications
**Project Name:** L'Aroma Artisanal Cafe & Bistro  
**Version:** 1.0.0-MVP  

---

## 1. MenuItem Model
```typescript
interface MenuItem {
  id: string;               // e.g. "coffee-cortado-01"
  name: string;             // "Spanish Cortado & Raw Sugar"
  category: 'coffee' | 'bakery' | 'bistro' | 'dessert';
  price: number;            // 4.75
  description: string;      // "Double ristretto cut with equal parts steamed whole milk..."
  badge?: 'Vegan' | 'Chef Choice' | 'Gluten-Free' | 'Signature';
  image: string;            // URL or curated high-res asset
  calories?: number;
}
```

## 2. CartItem Model
```typescript
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
```

## 3. Reservation Model
```typescript
interface Reservation {
  id: string;
  guestName: string;
  guestPhone: string;
  date: string;
  timeSlot: string;
  partySize: number;
  seatingArea: 'Indoor Dining' | 'Garden Patio' | 'Barista Counter';
  timestamp: string;
}
```
