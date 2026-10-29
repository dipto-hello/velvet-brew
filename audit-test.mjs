import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('C:/nvm4w/nodejs/node_modules/playwright');
import assert from 'node:assert';
import http from 'node:http';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

/**
 * Checks if the local server is reachable.
 */
function isServerRunning(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 400);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(800, () => {
      req.destroy();
      resolve(false);
    });
  });
}

/**
 * Polls until the server is ready.
 */
async function waitForServer(url, timeoutMs = 6000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isServerRunning(url)) return true;
    await new Promise((r) => setTimeout(r, 150));
  }
  return false;
}

async function runAudit() {
  console.log('--- Starting Enterprise-Grade Playwright Automated Audit ---');
  let serverProcess = null;
  let browser = null;
  let page = null;

  try {
    // 1. Local Server Lifecycle Management
    const serverAlreadyRunning = await isServerRunning(BASE_URL);
    if (!serverAlreadyRunning) {
      console.log(`Starting local server on port ${PORT}...`);
      serverProcess = spawn('node', ['server.js'], {
        cwd: __dirname,
        stdio: 'pipe'
      });
      const ready = await waitForServer(BASE_URL);
      if (!ready) {
        throw new Error(`Failed to spawn and reach local server at ${BASE_URL} within timeout.`);
      }
      console.log(`✓ Local server successfully spawned and verified at ${BASE_URL}`);
    } else {
      console.log(`✓ Detected existing active server at ${BASE_URL}`);
    }

    // 2. Launch Browser & Context
    browser = await chromium.launch();
    const context = await browser.newContext();
    page = await context.newPage();

    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    // Navigate to local server with cache buster
    await page.goto(`${BASE_URL}/?audit=` + Date.now(), { waitUntil: 'domcontentloaded' });
    console.log(`✓ Successfully navigated to ${BASE_URL}`);

    // 3. Verify Title and Header
    const title = await page.title();
    assert(title.includes('Velvet Brew'), 'Title must contain Velvet Brew');
    console.log('✓ Title verified:', title);

    // 4. Category Filter Audit with State-Based Waiting (Zero arbitrary sleep)
    const categories = [
      { name: 'all', count: 12 },
      { name: 'coffee', count: 3 },
      { name: 'bakery', count: 3 },
      { name: 'bistro', count: 3 },
      { name: 'dessert', count: 3 }
    ];

    for (const cat of categories) {
      await page.click(`.menu-tab[data-category="${cat.name}"]`);
      await page.waitForFunction(
        ({ count }) => document.querySelectorAll('.menu-card').length === count,
        { count: cat.count }
      );
    }
    console.log('✓ All 5 category filters verified with exact card counts.');

    // Reset to all
    await page.click('.menu-tab[data-category="all"]');

    // 5. Dietary Filter Audit with State-Based Waiting
    const diets = [
      { name: 'all', count: 12 },
      { name: 'Vegan', count: 4 },
      { name: 'Gluten-Free', count: 2 },
      { name: 'Chef Pick', count: 4 }
    ];

    for (const diet of diets) {
      await page.click(`.diet-chip[data-diet="${diet.name}"]`);
      await page.waitForFunction(
        ({ count }) => document.querySelectorAll('.menu-card').length === count,
        { count: diet.count }
      );
    }
    console.log('✓ All 4 dietary chips verified with exact card counts.');

    // 6. Empty Filter Combination Check
    await page.click('.menu-tab[data-category="coffee"]');
    await page.click('.diet-chip[data-diet="Gluten-Free"]');
    await page.waitForFunction(() => document.querySelectorAll('.menu-card').length === 0);
    const emptyMsg = await page.locator('#menu-grid-container').innerText();
    assert(emptyMsg.includes('No dishes match'), 'Empty state message should be displayed');
    console.log('✓ Empty state filter handling verified gracefully.');

    // Reset filters
    await page.click('.menu-tab[data-category="all"]');
    await page.click('.diet-chip[data-diet="all"]');
    await page.waitForFunction(() => document.querySelectorAll('.menu-card').length === 12);

    // 7. Cart Addition, Calculation & Quantity Tests (Resilient Data-Action Selectors)
    // Add Cortado (৳ 380)
    await page.locator('[data-item-id="coffee-01"] .add-cart-btn').click();
    await page.waitForFunction(() => document.getElementById('cart-count-badge')?.textContent.trim() === '1');

    // Close drawer
    await page.click('#cart-close-btn');
    await page.waitForFunction(() => !document.getElementById('cart-drawer')?.classList.contains('open'));

    // Add Sourdough Boule (৳ 480)
    await page.locator('[data-item-id="bakery-01"] .add-cart-btn').click();
    await page.waitForFunction(() => document.getElementById('cart-count-badge')?.textContent.trim() === '2');

    // Subtotal = 380 + 480 = 860, Tax = 43, Total = 903
    await page.waitForFunction(() => {
      const sub = document.getElementById('cart-subtotal-val')?.textContent || '';
      return sub.includes('860');
    });
    const subtotal = await page.locator('#cart-subtotal-val').innerText();
    const tax = await page.locator('#cart-tax-val').innerText();
    const total = await page.locator('#cart-total-val').innerText();
    assert(tax.includes('43'), `Tax mismatch: ${tax}`);
    assert(total.includes('903'), `Total mismatch: ${total}`);
    console.log(`✓ Cart arithmetic (${subtotal}, tax ${tax}, total ${total}) verified.`);

    // Increment Cortado to 2 using resilient data-action and data-item-id selector
    await page.locator('.cart-item[data-item-id="coffee-01"] [data-action="increment"]').click();
    await page.waitForFunction(() => {
      const sub = document.getElementById('cart-subtotal-val')?.textContent || '';
      return sub.includes('1,240') || sub.includes('1240');
    });
    const incSubtotal = await page.locator('#cart-subtotal-val').innerText();
    const incTax = await page.locator('#cart-tax-val').innerText();
    const incTotal = await page.locator('#cart-total-val').innerText();
    assert(incTax.includes('62'), `Increment tax mismatch: ${incTax}`);
    assert(incTotal.includes('1,302') || incTotal.includes('1302'), `Increment total mismatch: ${incTotal}`);
    console.log(`✓ Quantity increment arithmetic (${incSubtotal}, total ${incTotal}) verified.`);

    // Checkout Takeaway
    await page.click('#cart-checkout-btn');
    await page.waitForFunction(() => document.getElementById('cart-count-badge')?.textContent.trim() === '0');
    console.log('✓ Takeaway order checkout verified.');

    // 8. Table Reservation Modal Flow & ESC Dismissal
    await page.click('#nav-reserve-btn');
    await page.waitForFunction(() => document.getElementById('reserve-dialog')?.open === true);

    // Test ESC dismissal
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => document.getElementById('reserve-dialog')?.open === false);
    console.log('✓ Reservation modal Escape dismissal verified.');

    // Re-open and submit form via nav reserve CTA
    await page.click('#nav-reserve-btn');
    await page.waitForFunction(() => document.getElementById('reserve-dialog')?.open === true);
    await page.fill('#res-name', 'Elena Vance');
    await page.fill('#res-phone', '+1 (555) 987-6543');
    await page.fill('#res-date', '2026-11-12');
    await page.selectOption('#res-time', '07:30 PM');
    await page.selectOption('#res-guests', '4');
    await page.selectOption('#res-area', 'Garden Patio');
    await page.click('#submit-booking-btn');

    await page.waitForFunction(() => document.getElementById('reserve-dialog')?.open === false);
    await page.waitForFunction(() => {
      const toasts = document.querySelectorAll('.toast');
      const last = toasts[toasts.length - 1];
      return last && last.textContent.includes('Elena Vance');
    });
    console.log('✓ Reservation form submission and toast confirmed.');

    // 9. Brew Companion and Chapter 1 CTA Interaction Check
    const ctaBtn = await page.locator('#ch1-reserve-btn').count();
    assert.strictEqual(ctaBtn, 1, 'Chapter 1 reserve CTA button should exist');

    await page.locator('#brew-guide').scrollIntoViewIfNeeded();
    const doseVal = await page.locator('#dose-val-display').innerText();
    assert(doseVal.includes('18'), `Initial dose should be 18g, got ${doseVal}`);

    // Click Start Brew and wait for timer to count
    await page.click('#brew-start-btn');
    await page.waitForFunction(() => {
      const t = document.getElementById('brew-timer-clock')?.textContent;
      return t && t !== '00:00';
    }, { timeout: 4000 });
    const timerText = await page.locator('#brew-timer-clock').innerText();
    await page.click('#brew-start-btn'); // Pause
    console.log(`✓ Interactive Specialty Brew Companion verified running (timer reached ${timerText}).`);

    // 10. Responsive Viewport Audits (320px, 375px, 768px, 1280px, 3440px)
    const viewports = [
      { width: 320, height: 600, label: 'Ultra-Narrow Mobile (320px)' },
      { width: 375, height: 812, label: 'Standard Mobile (375px)' },
      { width: 768, height: 1024, label: 'Tablet (768px)' },
      { width: 1280, height: 800, label: 'Desktop (1280px)' },
      { width: 3440, height: 1440, label: 'Ultra-Wide (3440px)' }
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForFunction(() => document.documentElement.clientWidth > 0);
      const hasHorizontalScroll = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth
      );
      assert(!hasHorizontalScroll, `Viewport ${vp.label} has unwanted horizontal scroll!`);
      console.log(`✓ ${vp.label} layout intact (zero horizontal scroll overflow).`);
    }

    // 11. Console Errors Audit
    assert.strictEqual(consoleErrors.length, 0, 'Console errors encountered: ' + consoleErrors.join(', '));
    console.log('✓ Zero console errors across the entire execution.');

    console.log('=== ALL AUTOMATED AUDIT TESTS PASSED SUCCESSFULLY! ===');
  } catch (err) {
    console.error('❌ Audit Failure Detected:', err.message);
    if (page) {
      const failureScreenshotPath = path.join(__dirname, 'test-failure.png');
      await page.screenshot({ path: failureScreenshotPath, fullPage: true }).catch(() => {});
      console.error(`📸 Test failure artifact captured at: ${failureScreenshotPath}`);
    }
    throw err;
  } finally {
    if (browser) await browser.close();
    if (serverProcess) {
      serverProcess.kill('SIGTERM');
      console.log('🛑 Local test server process terminated cleanly.');
    }
  }
}

runAudit().catch(() => {
  process.exit(1);
});
