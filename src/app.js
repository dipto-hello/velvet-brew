/**
 * Velvet Brew Coffee Roasters & Cafe // Client Application
 * Handles reactive menu filtering, live takeaway cart, and table reservations.
 */

import { MENU_ITEMS } from './menu-data.js';

// ==========================================================================
// 1. Reactive Cart State
// ==========================================================================
class CartState {
  constructor() {
    this.items = this._loadCart();
  }

  _loadCart() {
    try {
      const saved = localStorage.getItem('velvetbrew_cart') || localStorage.getItem('laroma_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  _saveCart() {
    try {
      localStorage.setItem('velvetbrew_cart', JSON.stringify(this.items));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  addItem(menuItem) {
    const existing = this.items.find(i => i.id === menuItem.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1
      });
    }
    this._saveCart();
    this.updateUI();
  }

  updateQuantity(id, delta) {
    const item = this.items.find(i => i.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.items = this.items.filter(i => i.id !== id);
    }
    this._saveCart();
    this.updateUI();
  }

  clear() {
    this.items = [];
    this._saveCart();
    this.updateUI();
  }

  getCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getSubtotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  updateUI() {
    const countBadge = document.getElementById('cart-count-badge');
    const itemsCountText = document.getElementById('cart-items-count-text');
    const container = document.getElementById('cart-items-container');
    const subtotalEl = document.getElementById('cart-subtotal-val');
    const taxEl = document.getElementById('cart-tax-val');
    const totalEl = document.getElementById('cart-total-val');

    const totalCount = this.getCount();
    const subtotal = this.getSubtotal();
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

    if (countBadge) countBadge.textContent = totalCount;
    if (itemsCountText) itemsCountText.textContent = `${totalCount} item${totalCount === 1 ? '' : 's'}`;

    if (subtotalEl) subtotalEl.textContent = `৳ ${subtotal}`;
    if (taxEl) taxEl.textContent = `৳ ${tax}`;
    if (totalEl) totalEl.textContent = `৳ ${total}`;

    if (!container) return;

    if (this.items.length === 0) {
      container.innerHTML = `
        <div class="cart-empty-message">
          <p>Your order bag is currently empty.</p>
          <p style="font-size: 0.85rem; margin-top: 6px;">Add freshly roasted coffee or bakery items to order for takeaway.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = '';
    this.items.forEach(item => {
      const row = document.createElement('div');
      row.className = 'cart-item';

      const left = document.createElement('div');
      const title = document.createElement('div');
      title.className = 'cart-item-title';
      title.textContent = item.name;

      const price = document.createElement('div');
      price.className = 'cart-item-price';
      price.textContent = `৳ ${item.price * item.quantity}`;

      left.appendChild(title);
      left.appendChild(price);

      const ctrls = document.createElement('div');
      ctrls.className = 'cart-qty-ctrls';

      const minusBtn = document.createElement('button');
      minusBtn.className = 'qty-btn';
      minusBtn.textContent = '−';
      minusBtn.title = 'Decrease quantity';
      minusBtn.addEventListener('click', () => this.updateQuantity(item.id, -1));

      const num = document.createElement('span');
      num.className = 'cart-qty-num';
      num.textContent = item.quantity;

      const plusBtn = document.createElement('button');
      plusBtn.className = 'qty-btn';
      plusBtn.textContent = '+';
      plusBtn.title = 'Increase quantity';
      plusBtn.addEventListener('click', () => this.updateQuantity(item.id, 1));

      ctrls.appendChild(minusBtn);
      ctrls.appendChild(num);
      ctrls.appendChild(plusBtn);

      row.appendChild(left);
      row.appendChild(ctrls);
      container.appendChild(row);
    });
  }
}

export const cart = new CartState();

// ==========================================================================
// 2. Toast Notification Engine
// ==========================================================================
export function showToast(message, icon = '✨') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  const iconSpan = document.createElement('span');
  iconSpan.textContent = icon;
  const msgSpan = document.createElement('span');
  msgSpan.textContent = message;
  toast.appendChild(iconSpan);
  toast.appendChild(msgSpan);
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-fadeout');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// ==========================================================================
// 3. Menu Rendering & Filtering
// ==========================================================================
let currentCategory = 'all';
let currentDiet = 'all';

function renderMenuGrid() {
  const container = document.getElementById('menu-grid-container');
  if (!container) return;

  const filtered = MENU_ITEMS.filter(item => {
    const matchCategory = currentCategory === 'all' || item.category === currentCategory;
    const matchDiet = currentDiet === 'all' || item.badge === currentDiet;
    return matchCategory && matchDiet;
  });

  container.innerHTML = '';

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px; color: var(--text-muted);">
        <p>No dishes match the selected dietary filter in this category.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('article');
    card.className = 'menu-card';
    card.dataset.itemId = item.id;

    // Image wrap with modern WebP picture element and lazy loading
    const imgWrap = document.createElement('div');
    imgWrap.className = 'menu-card-img-wrap';

    const picture = document.createElement('picture');
    const webpSource = document.createElement('source');
    webpSource.type = 'image/webp';
    webpSource.srcset = item.image.replace('.jpg', '.webp');
    picture.appendChild(webpSource);

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;
    img.className = 'menu-card-img';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.width = 400;
    img.height = 300;
    picture.appendChild(img);
    imgWrap.appendChild(picture);

    if (item.badge) {
      const badge = document.createElement('span');
      badge.className = `menu-badge ${item.badge.replace(/\s+/g, '-')}`;
      badge.textContent = item.badge;
      imgWrap.appendChild(badge);
    }

    // Card Body
    const body = document.createElement('div');
    body.className = 'menu-card-body';

    const header = document.createElement('div');
    header.className = 'menu-card-header';

    const title = document.createElement('h3');
    title.className = 'menu-card-title';
    title.textContent = item.name;

    const price = document.createElement('span');
    price.className = 'menu-card-price';
    price.textContent = `৳ ${item.price}`;

    header.appendChild(title);
    header.appendChild(price);

    const desc = document.createElement('p');
    desc.className = 'menu-card-desc';
    desc.textContent = item.description;

    const footer = document.createElement('div');
    footer.className = 'menu-card-footer';

    const addBtn = document.createElement('button');
    addBtn.className = 'add-cart-btn';
    addBtn.innerHTML = `<span>+</span> <span>Add to Order</span>`;
    addBtn.addEventListener('click', () => {
      cart.addItem(item);
      openCartDrawer();
      showToast(`Added "${item.name}" to your order!`, '☕');
    });

    footer.appendChild(addBtn);

    body.appendChild(header);
    body.appendChild(desc);
    body.appendChild(footer);

    card.appendChild(imgWrap);
    card.appendChild(body);
    container.appendChild(card);
  });
}

// ==========================================================================
// 4. Cart Drawer Controls
// ==========================================================================
export function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (drawer && backdrop) {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
  }
}

export function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  if (drawer && backdrop) {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
  }
}

// ==========================================================================
// 5. Reservation Dialog Controls
// ==========================================================================
export function openReservationDialog() {
  const dialog = document.getElementById('reserve-dialog');
  if (dialog) {
    // Set default date to today
    const dateInput = document.getElementById('res-date');
    if (dateInput && !dateInput.value) {
      dateInput.value = new Date().toISOString().split('T')[0];
    }
    dialog.showModal();
  }
}

export function closeReservationDialog() {
  const dialog = document.getElementById('reserve-dialog');
  if (dialog && dialog.open) {
    dialog.close();
  }
}

// ==========================================================================
// 6. Bootstrap & Event Listeners
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial Menu & Cart Render
  renderMenuGrid();
  cart.updateUI();

  // 2. Wire Category Tabs
  const categoryTabs = document.querySelectorAll('.menu-tab');
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      currentCategory = tab.dataset.category;
      renderMenuGrid();
    });
  });

  // 3. Wire Dietary Chips
  const dietChips = document.querySelectorAll('.diet-chip');
  dietChips.forEach(chip => {
    chip.addEventListener('click', () => {
      dietChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentDiet = chip.dataset.diet;
      renderMenuGrid();
    });
  });

  // 3b. Wire Spotlight Barista Roast CTA
  document.getElementById('spotlight-cortado-btn')?.addEventListener('click', () => {
    const cortado = MENU_ITEMS.find(item => item.id === 'coffee-01');
    if (cortado) {
      cart.addItem(cortado);
      openCartDrawer();
      showToast('Added Classic Spanish Cortado to your order!', '☕');
    }
  });

  // 4. Wire Cart Drawer
  document.getElementById('cart-trigger-btn')?.addEventListener('click', openCartDrawer);
  document.getElementById('cart-close-btn')?.addEventListener('click', closeCartDrawer);
  document.getElementById('cart-backdrop')?.addEventListener('click', closeCartDrawer);

  document.getElementById('cart-checkout-btn')?.addEventListener('click', () => {
    if (cart.items.length === 0) {
      showToast('Please add items to your order first.', '☕');
      return;
    }
    const total = Math.round(cart.getSubtotal() * 1.05);
    showToast(`Order Confirmed for Takeaway! Total: ৳ ${total}. Ready in 15 mins.`, '☕');
    cart.clear();
    closeCartDrawer();
  });

  // 5. Wire Reservation Modal
  document.getElementById('nav-reserve-btn')?.addEventListener('click', openReservationDialog);
  document.getElementById('ch1-reserve-btn')?.addEventListener('click', openReservationDialog);
  document.getElementById('hero-reserve-btn')?.addEventListener('click', openReservationDialog);
  document.getElementById('cinema-reserve-btn')?.addEventListener('click', openReservationDialog);
  document.getElementById('visit-reserve-btn')?.addEventListener('click', openReservationDialog);
  document.getElementById('reserve-close-btn')?.addEventListener('click', closeReservationDialog);

  // Smooth Native Scroll on Anchor clicks with header offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const headerOffset = 72;
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  document.getElementById('reserve-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('res-name').value;
    const date = document.getElementById('res-date').value;
    const time = document.getElementById('res-time').value;
    const guests = document.getElementById('res-guests').value;
    const area = document.getElementById('res-area').value;

    showToast(`Reservation noted: Table for ${name} (${guests} guests) on ${date} at ${time}. Demo setup — to confirm at Road 11, call +880 1711-835838.`, '🥂');
    closeReservationDialog();
    e.target.reset();
  });

  // 6. Global Keyboard ESC Listener
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCartDrawer();
      closeReservationDialog();
    }
  });

  // 7. Initialize Brew Companion & Roast Ticker
  initBrewCompanion();
  initRoastTicker();
});

// ==========================================================================
// 8. Live Roast Countdown Ticker Engine
// ==========================================================================
function initRoastTicker() {
  const countdownEl = document.getElementById('roast-countdown-val');
  if (!countdownEl) return;

  function updateRoastCountdown() {
    const now = new Date();
    // Next Wednesday 9:00 AM
    const nextWed = new Date(now);
    const day = now.getDay();
    const diffDays = (3 - day + 7) % 7 || (now.getHours() >= 9 ? 7 : 0);
    nextWed.setDate(now.getDate() + diffDays);
    nextWed.setHours(9, 0, 0, 0);

    const diffMs = nextWed - now;
    if (diffMs <= 0) {
      countdownEl.textContent = 'Roasting Now in Banani!';
      return;
    }

    const d = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const h = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diffMs / (1000 * 60)) % 60);

    countdownEl.textContent = `${String(d).padStart(2, '0')}d : ${String(h).padStart(2, '0')}h : ${String(m).padStart(2, '0')}m`;
  }

  updateRoastCountdown();
  setInterval(updateRoastCountdown, 30000);
}

// ==========================================================================
// 9. Interactive Specialty Brew Companion & Ratio Calculator
// ==========================================================================
const BREW_PROFILES = {
  v60: {
    name: 'Hario V60',
    ratio: 16,
    grind: 'Medium-Fine',
    grindSub: 'Table salt texture',
    temp: '94°C (Off boil)',
    totalSecs: 165,
    targetDisplay: '2:45 min',
    steps: [
      {
        name: 'Bloom Phase',
        desc: (d, w) => `Pour ${Math.round(d * 3)}g water in gentle spirals. Let the fresh coffee bloom and release aroma.`,
        endSec: 45
      },
      {
        name: 'First Steady Pour',
        desc: (d, w) => `Pour continuous spiral up to ${Math.round(w * 0.6)}g. Keep flow gentle, avoiding paper walls.`,
        endSec: 90
      },
      {
        name: 'Final Drawdown',
        desc: (d, w) => `Pour remainder to ${w}g. Give a gentle swirl and let gravity draw down clear coffee.`,
        endSec: 165
      }
    ]
  },
  aeropress: {
    name: 'AeroPress',
    ratio: 12,
    grind: 'Fine-Medium',
    grindSub: 'Fine sand texture',
    temp: '88°C (Sweet extraction)',
    totalSecs: 120,
    targetDisplay: '2:00 min',
    steps: [
      {
        name: 'Saturate & Stir',
        desc: (d, w) => `Pour all ${w}g water. Stir paddle gently 5 times to thoroughly saturate grounds.`,
        endSec: 30
      },
      {
        name: 'Gentle Steeping',
        desc: () => `Insert plunger slightly to create a vacuum seal. Let coffee steep undisturbed.`,
        endSec: 90
      },
      {
        name: 'Steady Plunge',
        desc: () => `Press plunger downward smoothly over 30 seconds until you hear a soft hiss.`,
        endSec: 120
      }
    ]
  },
  frenchpress: {
    name: 'French Press',
    ratio: 15,
    grind: 'Coarse',
    grindSub: 'Sea salt texture',
    temp: '95°C (Bold infusion)',
    totalSecs: 240,
    targetDisplay: '4:00 min',
    steps: [
      {
        name: 'Saturation & Crust',
        desc: (d, w) => `Pour all ${w}g water vigorously. Allow a rich coffee crust to form on the surface.`,
        endSec: 60
      },
      {
        name: 'Break Crust & Steep',
        desc: () => `Gently stir crust 3 times with spoon. Scoop away top foam for an ultra-clean body.`,
        endSec: 210
      },
      {
        name: 'Slow Plunge & Pour',
        desc: () => `Insert filter screen and press down slowly. Pour immediately to stop extraction.`,
        endSec: 240
      }
    ]
  }
};

function initBrewCompanion() {
  const methodBtns = document.querySelectorAll('.brew-method-btn');
  const doseSlider = document.getElementById('coffee-dose-slider');
  const doseDisplay = document.getElementById('dose-val-display');
  const waterDisplay = document.getElementById('water-amount-display');
  const grindDisplay = document.getElementById('grind-size-display');
  const targetTimeDisplay = document.getElementById('target-time-display');

  const timerClock = document.getElementById('brew-timer-clock');
  const stageName = document.getElementById('brew-stage-name');
  const stageInst = document.getElementById('brew-stage-instruction');
  const progressBar = document.getElementById('brew-progress-bar');
  const startBtn = document.getElementById('brew-start-btn');
  const resetBtn = document.getElementById('brew-reset-btn');
  const stepChips = document.querySelectorAll('.step-chip');

  if (!doseSlider || !startBtn) return;

  let activeMethodKey = 'v60';
  let activeDose = 18;
  let elapsedSecs = 0;
  let timerInterval = null;
  let isRunning = false;

  function updateRecipeMetrics() {
    const profile = BREW_PROFILES[activeMethodKey];
    const waterAmount = Math.round(activeDose * profile.ratio);

    doseDisplay.textContent = `${activeDose} g`;
    waterDisplay.textContent = `${waterAmount} ml`;
    grindDisplay.textContent = profile.grind;
    targetTimeDisplay.textContent = profile.targetDisplay;

    // Update step chip labels dynamically with dose/water
    profile.steps.forEach((step, idx) => {
      const chip = stepChips[idx];
      if (chip) {
        const strong = chip.querySelector('.step-details strong');
        const span = chip.querySelector('.step-details span');
        if (strong) strong.textContent = step.name;
        if (span) {
          const prevSec = idx === 0 ? 0 : profile.steps[idx - 1].endSec;
          const prevMin = `${Math.floor(prevSec / 60)}:${String(prevSec % 60).padStart(2, '0')}`;
          const endMin = `${Math.floor(step.endSec / 60)}:${String(step.endSec % 60).padStart(2, '0')}`;
          span.textContent = `${prevMin} - ${endMin}`;
        }
      }
    });

    if (!isRunning && elapsedSecs === 0) {
      stageName.textContent = 'Ready to Bloom';
      stageInst.textContent = `Rinse filter with hot water, add ${activeDose}g coffee into your dripper, zero your scale, and press Start Brew.`;
    }
  }

  // Method Button Switching
  methodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      methodBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      activeMethodKey = btn.dataset.method;
      resetTimer();
      updateRecipeMetrics();
    });
  });

  // Dose Slider
  doseSlider.addEventListener('input', (e) => {
    activeDose = parseInt(e.target.value, 10);
    updateRecipeMetrics();
  });

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }

  function tick() {
    elapsedSecs++;
    timerClock.textContent = formatTime(elapsedSecs);

    const profile = BREW_PROFILES[activeMethodKey];
    const waterAmount = Math.round(activeDose * profile.ratio);
    const pct = Math.min(100, Math.round((elapsedSecs / profile.totalSecs) * 100));
    progressBar.style.width = `${pct}%`;

    // Find current active step
    let currentStepIdx = profile.steps.findIndex(step => elapsedSecs <= step.endSec);
    if (currentStepIdx === -1) currentStepIdx = profile.steps.length - 1;

    stepChips.forEach((chip, idx) => {
      chip.classList.toggle('active', idx === currentStepIdx);
      chip.classList.toggle('completed', idx < currentStepIdx);
    });

    const currentStep = profile.steps[currentStepIdx];
    stageName.textContent = currentStep.name;
    stageInst.textContent = currentStep.desc(activeDose, waterAmount);

    if (elapsedSecs >= profile.totalSecs) {
      clearInterval(timerInterval);
      timerInterval = null;
      isRunning = false;
      startBtn.innerHTML = '<span>Brew Complete</span> <span>☕</span>';
      startBtn.disabled = true;
      stageName.textContent = 'Extraction Complete!';
      stageInst.textContent = 'Remove dripper, give your cup a swirl to blend, and enjoy your artisanal brew!';
      showToast('Your artisanal brew is complete! Enjoy the rich aromas.', '☕');
    }
  }

  function startTimer() {
    if (isRunning) {
      // Pause
      clearInterval(timerInterval);
      timerInterval = null;
      isRunning = false;
      startBtn.innerHTML = '<span>Resume Brew</span> <span>▶</span>';
    } else {
      // Start/Resume
      isRunning = true;
      resetBtn.disabled = false;
      startBtn.innerHTML = '<span>Pause Brew</span> <span>⏸</span>';
      timerInterval = setInterval(tick, 1000);
    }
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    isRunning = false;
    elapsedSecs = 0;
    timerClock.textContent = '00:00';
    progressBar.style.width = '0%';
    startBtn.innerHTML = '<span>Start Brew</span> <span>▶</span>';
    startBtn.disabled = false;
    resetBtn.disabled = true;

    stepChips.forEach((chip, idx) => {
      chip.classList.toggle('active', idx === 0);
      chip.classList.remove('completed');
    });

    updateRecipeMetrics();
  }

  startBtn.addEventListener('click', startTimer);
  resetBtn.addEventListener('click', resetTimer);

  updateRecipeMetrics();
}
