const { createRequire } = require('module');
const requireDynamic = createRequire(process.cwd() + '/package.json');
const { chromium } = requireDynamic('C:/nvm4w/nodejs/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });

  async function benchmarkFresh(setupFn, label) {
    const page = await browser.newPage();
    await page.goto('http://localhost:3458/?t=' + Date.now());
    await page.waitForTimeout(400);

    if (setupFn) {
      await page.evaluate(setupFn);
      await page.waitForTimeout(200);
    }

    let slow = 0, max = 0;
    for (let y = 1900; y < 2200; y += 10) {
      const t0 = performance.now();
      await page.evaluate((targetY) => window.scrollTo(0, targetY), y);
      await page.evaluate(() => new Promise(requestAnimationFrame));
      const dt = performance.now() - t0;
      if (dt > 20) slow++;
      if (dt > max) max = dt;
    }
    console.log(label + ' => Slow: ' + slow + ', Max: ' + max.toFixed(1) + 'ms');
    await page.close();
  }

  // 1. Current Live State
  await benchmarkFresh(null, '1. Current Live State');

  // 2. Remove backdrop-filter on .hero-status-pill
  await benchmarkFresh(() => {
    const pill = document.querySelector('.hero-status-pill');
    if (pill) pill.style.backdropFilter = 'none';
  }, '2. Pill backdropFilter = none');

  // 3. Remove CSS slide animations + remove pill backdropFilter
  await benchmarkFresh(() => {
    document.querySelectorAll('.ambient-slide').forEach(s => s.style.animation = 'none');
    const pill = document.querySelector('.hero-status-pill');
    if (pill) pill.style.backdropFilter = 'none';
  }, '3. No slide animations + no pill blur');

  // 4. Preload and decode hero images upfront
  await benchmarkFresh(() => {
    document.querySelectorAll('.ambient-slide').forEach((s, i) => {
      s.style.animation = 'none';
      if (i > 0) s.style.display = 'none';
      else s.style.opacity = '0.9';
    });
    const pill = document.querySelector('.hero-status-pill');
    if (pill) pill.style.backdropFilter = 'none';
  }, '4. Single static slide + no blur');

  await browser.close();
})();
