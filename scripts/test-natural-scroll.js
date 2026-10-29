const { createRequire } = require('module');
const requireDynamic = createRequire(process.cwd() + '/package.json');
const { chromium } = requireDynamic('C:/nvm4w/nodejs/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const targetUrl = process.env.TARGET_URL || 'http://localhost:3000';
  await page.goto(targetUrl + (targetUrl.includes('?') ? '&' : '?') + 'run=' + Date.now());
  await page.waitForTimeout(1000);

  console.log('--- Starting Continuous Smooth Scroll from 0 to 3500px ---');
  const slowSections = [];
  let y = 0;
  
  while (y < 3500) {
    const t0 = performance.now();
    await page.evaluate((targetY) => window.scrollTo(0, targetY), y);
    await page.evaluate(() => new Promise(requestAnimationFrame));
    const dt = performance.now() - t0;
    
    if (dt > 25) {
      slowSections.push({ y, dt: Math.round(dt) });
    }
    y += 25; // 25px per frame = smooth normal scroll wheel speed
  }

  console.log('Total slow frames (>25ms):', slowSections.length);
  slowSections.forEach(s => {
    console.log(`Slow at y=${s.y}: ${s.dt}ms`);
  });

  await browser.close();
})();
