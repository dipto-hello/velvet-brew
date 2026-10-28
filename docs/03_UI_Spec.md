# 03_UI_Spec.md: Design System & Anti-Slop Specification
**Project Name:** L'Aroma Artisanal Cafe & Bistro  
**Art Direction Mode:** Taste-Skill v2 Hospitality Standard (Warm Editorial & Organic Artisanal)  

---

## 1. Anti-Slop Guarantees
- ❌ **No AI Slop Tells:** No harsh neon gradients, no cold sterile corporate grey boxes, no generic AI-generated floating badges.
- ✅ **Rich Tactile Warmth:** Deep espresso roast backgrounds paired with velvety warm cream surface cards and warm terracotta accents.
- ✅ **Editorial Typography:** Classic serif headings (Playfair / Cormorant / Georgia) paired with clean humanist body text and monospaced price figures.
- ✅ **Mouth-Watering Realism:** Curated photography showing real latte art, golden flaky croissants, and freshly sliced sourdough.

---

## 2. Design Tokens (CSS Custom Properties)

```css
:root {
  /* Warm Artisanal Palette */
  --bg-primary: #FAF6F0;          /* Warm oat milk base */
  --bg-surface: #FFFFFF;          /* Pure white card container */
  --bg-surface-warm: #F4ECE1;     /* Toasted cream accent */
  --bg-dark-espresso: #18110D;    /* Deep roasted coffee bean */
  --bg-dark-surface: #221914;     /* Elevated espresso container */

  --border-warm: #EADDCF;
  --border-subtle: #F0E6DA;

  --text-primary: #1C1510;        /* Deep roast black-brown */
  --text-secondary: #6B5B52;      /* Warm mocha subtext */
  --text-muted: #9E8C82;          /* Light roast accent */
  --text-inverse: #FAF6F0;

  /* Accent Colors */
  --accent-caramel: #C8833A;      /* Rich golden honey/caramel */
  --accent-caramel-hover: #B0702D;
  --accent-terracotta: #B94A32;   /* Rustic oven terracotta */
  --accent-sage: #506D56;         /* Organic fresh herb green */
  --accent-sage-subtle: rgba(80, 109, 86, 0.12);

  /* Typography */
  --font-serif: "Playfair Display", "Cormorant Garamond", Georgia, serif;
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: "JetBrains Mono", "SF Mono", monospace;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;
  
  --shadow-subtle: 0 4px 20px rgba(28, 21, 16, 0.06);
  --shadow-elevated: 0 12px 36px rgba(28, 21, 16, 0.12);
}
```

---

## 3. Typography Scale & Hierarchy
- **Hero Title:** `clamp(2.5rem, 6vw, 4.25rem)`, Serif, line-height 1.1, Letter spacing -0.02em.
- **Section Heading:** `2rem / 32px`, Serif, font-weight 600, color `--text-primary`.
- **Card Title:** `1.15rem / 18px`, Serif, font-weight 600.
- **Price Tag:** `1.1rem / 17px`, Monospace, font-weight 700, color `--accent-caramel`.
- **Body & Descriptions:** `0.925rem / 15px`, Sans-serif, line-height 1.6, color `--text-secondary`.
