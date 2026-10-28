import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/nvm4w/nodejs/node_modules/playwright');
import assert from 'node:assert';

async function runAudit() {
  console.log('--- Starting Deep Playwright Automated Audit ---');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  // 1. Navigate to local server
  await page.goto('http://localhost:3458/?audit=' + Date.now());
  console.log('✓ Successfully loaded http://localhost:3458');

  // 2. Verify Title and Header
  const title = await page.title();
  assert(title.includes("L'Aroma"), "Title must contain L'Aroma");
  console.log('✓ Title verified:', title);

  // 3. Category Filter Audit
  const categories = [
    { name: 'all', count: 12 },
    { name: 'coffee', count: 3 },
    { name: 'bakery', count: 3 },
    { name: 'bistro', count: 3 },
    { name: 'dessert', count: 3 }
  ];

  for (const cat of categories) {
    await page.click(`.menu-tab[data-category="${cat.name}"]`);
    await page.waitForTimeout(100);
    const count = await page.locator('.menu-card').count();
    assert.strictEqual(count, cat.count, `Category ${cat.name} should display ${cat.count} cards, got ${count}`);
  }
  console.log('✓ All 5 category filters verified with exact card counts.');

  // Reset to all
  await page.click('.menu-tab[data-category="all"]');

  // 4. Dietary Filter Audit
  const diets = [
    { name: 'all', count: 12 },
    { name: 'Vegan', count: 4 },
    { name: 'Gluten-Free', count: 2 },
    { name: 'Chef Pick', count: 4 }
  ];

  for (const diet of diets) {
    await page.click(`.diet-chip[data-diet="${diet.name}"]`);
    await page.waitForTimeout(100);
    const count = await page.locator('.menu-card').count();
    assert.strictEqual(count, diet.count, `Diet ${diet.name} should display ${diet.count} cards, got ${count}`);
  }
  console.log('✓ All 4 dietary chips verified with exact card counts.');

  // 5. Empty Filter Combination Check
  await page.click('.menu-tab[data-category="coffee"]');
  await page.click('.diet-chip[data-diet="Gluten-Free"]');
  await page.waitForTimeout(100);
  const emptyCount = await page.locator('.menu-card').count();
  assert.strictEqual(emptyCount, 0, 'No coffee item is gluten-free');
  const emptyMsg = await page.locator('#menu-grid-container').innerText();
  assert(emptyMsg.includes('No dishes match'), 'Empty state message should be displayed');
  console.log('✓ Empty state filter handling verified gracefully.');

  // Reset filters
  await page.click('.menu-tab[data-category="all"]');
  await page.click('.diet-chip[data-diet="all"]');
  await page.waitForTimeout(100);

  // 6. Cart Addition, Calculation & Quantity Tests
  // Add Cortado ($5.25)
  await page.locator('[data-item-id="coffee-01"] .add-cart-btn').click();
  await page.waitForTimeout(150);
  let badgeText = await page.locator('#cart-count-badge').innerText();
  assert.strictEqual(badgeText, '1');

  // Close drawer so we can click another card
  await page.click('#cart-close-btn');
  await page.waitForTimeout(150);

  // Add Sourdough Boule ($8.50)
  await page.locator('[data-item-id="bakery-01"] .add-cart-btn').click();
  await page.waitForTimeout(150);
  badgeText = await page.locator('#cart-count-badge').innerText();
  assert.strictEqual(badgeText, '2');

  // Subtotal = 5.25 + 8.50 = 13.75
  // Tax (8%) = 13.75 * 0.08 = 1.10
  // Total = 14.85
  let subtotal = await page.locator('#cart-subtotal-val').innerText();
  let tax = await page.locator('#cart-tax-val').innerText();
  let total = await page.locator('#cart-total-val').innerText();
  assert.strictEqual(subtotal, '$13.75');
  assert.strictEqual(tax, '$1.10');
  assert.strictEqual(total, '$14.85');
  console.log('✓ Cart arithmetic (subtotal $13.75, tax $1.10, total $14.85) verified.');

  // Increment Cortado to 2
  await page.locator('.cart-item:has-text("Spanish Cortado") button:has-text("+")').click();
  await page.waitForTimeout(100);
  // Subtotal = 10.50 + 8.50 = 19.00
  // Tax = 19.00 * 0.08 = 1.52
  // Total = 20.52
  subtotal = await page.locator('#cart-subtotal-val').innerText();
  tax = await page.locator('#cart-tax-val').innerText();
  total = await page.locator('#cart-total-val').innerText();
  assert.strictEqual(subtotal, '$19.00');
  assert.strictEqual(tax, '$1.52');
  assert.strictEqual(total, '$20.52');
  console.log('✓ Quantity increment arithmetic (subtotal $19.00, total $20.52) verified.');

  // Checkout Takeaway
  await page.click('#cart-checkout-btn');
  await page.waitForTimeout(200);
  badgeText = await page.locator('#cart-count-badge').innerText();
  assert.strictEqual(badgeText, '0');
  console.log('✓ Takeaway order checkout verified.');

  // 7. Table Reservation Modal Flow & ESC Dismissal
  await page.click('#nav-reserve-btn');
  await page.waitForTimeout(150);
  let isDialogOpen = await page.evaluate(() => document.getElementById('reserve-dialog').open);
  assert(isDialogOpen, 'Reservation dialog should be open');

  // Test ESC dismissal
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  isDialogOpen = await page.evaluate(() => document.getElementById('reserve-dialog').open);
  assert(!isDialogOpen, 'Reservation dialog should close on Escape');
  console.log('✓ Reservation modal Escape dismissal verified.');

  // Re-open and submit form
  await page.click('#hero-reserve-btn');
  await page.waitForTimeout(150);
  await page.fill('#res-name', 'Elena Vance');
  await page.fill('#res-phone', '+1 (555) 987-6543');
  await page.fill('#res-date', '2026-11-12');
  await page.selectOption('#res-time', '07:30 PM');
  await page.selectOption('#res-guests', '4');
  await page.selectOption('#res-area', 'Garden Patio');
  await page.click('#submit-booking-btn');
  await page.waitForTimeout(200);
  isDialogOpen = await page.evaluate(() => document.getElementById('reserve-dialog').open);
  assert(!isDialogOpen, 'Dialog closes after submission');
  const toastText = await page.locator('.toast').last().innerText();
  assert(toastText.includes('Elena Vance'), 'Toast should confirm booking');
  console.log('✓ Reservation form submission and toast confirmed.');

  // 8. Responsive Viewport Audits (320px, 375px, 768px, 1280px, 3440px)
  const viewports = [
    { width: 320, height: 600, label: 'Ultra-Narrow Mobile (320px)' },
    { width: 375, height: 812, label: 'Standard Mobile (375px)' },
    { width: 768, height: 1024, label: 'Tablet (768px)' },
    { width: 1280, height: 800, label: 'Desktop (1280px)' },
    { width: 3440, height: 1440, label: 'Ultra-Wide (3440px)' }
  ];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.waitForTimeout(150);
    const hasHorizontalScroll = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    assert(!hasHorizontalScroll, `Viewport ${vp.label} has unwanted horizontal scroll!`);
    console.log(`✓ ${vp.label} layout intact (zero horizontal scroll overflow).`);
  }

  // 9. Console Errors Audit
  assert.strictEqual(consoleErrors.length, 0, 'Console errors encountered: ' + consoleErrors.join(', '));
  console.log('✓ Zero console errors across the entire execution.');

  await browser.close();
  console.log('=== ALL AUTOMATED AUDIT TESTS PASSED SUCCESSFULLY! ===');
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
