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
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    if (countBadge) countBadge.textContent = totalCount;
    if (itemsCountText) itemsCountText.textContent = `${totalCount} item${totalCount === 1 ? '' : 's'}`;

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

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
      price.textContent = `$${(item.price * item.quantity).toFixed(2)}`;

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
    price.textContent = `$${item.price.toFixed(2)}`;

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

  // 4. Wire Cart Drawer
  document.getElementById('cart-trigger-btn')?.addEventListener('click', openCartDrawer);
  document.getElementById('cart-close-btn')?.addEventListener('click', closeCartDrawer);
  document.getElementById('cart-backdrop')?.addEventListener('click', closeCartDrawer);

  document.getElementById('cart-checkout-btn')?.addEventListener('click', () => {
    if (cart.items.length === 0) {
      showToast('Please add items to your order first.', 'ℹ️');
      return;
    }
    const total = (cart.getSubtotal() * 1.08).toFixed(2);
    showToast(`Order Confirmed for Takeaway! Total: $${total}. Ready in 15 mins.`, '🎉');
    cart.clear();
    closeCartDrawer();
  });

  // 5. Wire Reservation Modal
  document.getElementById('nav-reserve-btn')?.addEventListener('click', openReservationDialog);
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

    showToast(`Table booked for ${name}! Party of ${guests} on ${date} at ${time} (${area}).`, '🥂');
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
});
