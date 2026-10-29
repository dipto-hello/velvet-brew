/**
 * Velvet Brew Coffee Roasters & Cafe // Optimized 60 FPS Scrollytelling Cinema Engine
 * Architecture: Native Hardware-Accelerated Compositor Scrolling + Passive Scroll Sync + GPU Canvas Transforms
 * Performance Bar: 0 Lag, 0 Wheel Hijacking, 0 Layout Thrashing, Instant Response
 */

(function () {
  'use strict';

  // 1. Asset Configuration (High-Efficiency Next-Gen WebP with Instant JPG Fallback)
  const SCENE_ASSETS = [
    { id: 1, title: 'Roast', src: 'assets/images/cinema-01-beans.webp?v=32', fallback: 'assets/images/cinema-01-beans.jpg?v=32' },
    { id: 2, title: 'Bloom', src: 'assets/images/cinema-02-bloom.webp?v=32', fallback: 'assets/images/cinema-02-bloom.jpg?v=32' },
    { id: 3, title: 'Hearth', src: 'assets/images/cinema-03-hearth.webp?v=32', fallback: 'assets/images/cinema-03-hearth.jpg?v=32' },
    { id: 4, title: 'Sanctuary', src: 'assets/images/cinema-04-sanctuary.webp?v=32', fallback: 'assets/images/cinema-04-sanctuary.jpg?v=32' }
  ];

  // 2. Engine State
  const state = {
    images: [],
    imagesLoaded: false,
    targetProgress: 0,
    currentProgress: 0,
    targetTiltX: 0,
    targetTiltY: 0,
    tiltX: 0,
    tiltY: 0,
    activeChapter: 1,
    headerIsDark: true,
    cueIsFaded: false
  };

  // DOM Elements Cache (Cached once, zero DOM queries inside render loop)
  let container, stage, canvas, ctx;
  let chapterEls = [];
  let telemetryNodes = [];
  let telemetryFill = null;
  let siteHeader = null;

  // Optimized Particle Field (Zero shadowBlur overhead)
  const particles = Array.from({ length: 32 }, () => ({
    x: Math.random(),
    y: Math.random(),
    size: Math.random() * 2.0 + 0.8,
    speedY: (Math.random() * 0.35 + 0.1) * -1,
    speedX: (Math.random() - 0.5) * 0.15,
    alpha: Math.random() * 0.45 + 0.2
  }));

  // Master 60 FPS Visibility & Execution State
  let isIntersecting = true;
  let isLoopRunning = false;
  let cachedContainerTop = 0;
  let cachedTotalDistance = 1;

  function measureContainer() {
    if (!container) return;
    cachedContainerTop = container.offsetTop;
    cachedTotalDistance = Math.max(1, container.offsetHeight - window.innerHeight);
  }

  function startRenderLoop() {
    if (!isLoopRunning && state.imagesLoaded) {
      isLoopRunning = true;
      requestAnimationFrame(renderLoop);
    }
  }

  /**
   * Preload all cinematic assets into memory before drawing (WebP with JPG fallback)
   */
  function preloadAssets() {
    return Promise.all(
      SCENE_ASSETS.map((asset) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => {
            console.warn(`WebP fallback triggered for ${asset.src}, switching to ${asset.fallback}`);
            const fallbackImg = new Image();
            fallbackImg.onload = () => resolve(fallbackImg);
            fallbackImg.onerror = () => resolve(img);
            fallbackImg.src = asset.fallback;
          };
          img.src = asset.src;
        });
      })
    ).then((loadedImgs) => {
      state.images = loadedImgs;
      state.imagesLoaded = true;
      startRenderLoop();
    });
  }

  /**
   * Resize Canvas with devicePixelRatio Capped at 2 for Maximum GPU Efficiency
   */
  function resizeCanvas() {
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    ctx.scale(dpr, dpr);
  }

  function onResize() {
    measureContainer();
    resizeCanvas();
    updateScrollProgress();
  }

  /**
   * Passive Native Scroll Tracking (Zero Layout Thrashing, Cached Bounds)
   */
  function updateScrollProgress() {
    if (!container) return;
    const scrollY = window.scrollY;
    const scrollRel = Math.max(0, scrollY - cachedContainerTop);
    state.targetProgress = Math.min(1, Math.max(0, scrollRel / cachedTotalDistance));
  }

  /**
   * Helper: GPU-Optimized Image Drawing with Object-Fit Cover Math
   */
  function drawCoverImage(img, alpha, scale, focalX, focalY, tiltX, tiltY) {
    if (!img || alpha <= 0.002) return;

    ctx.save();
    ctx.globalAlpha = Math.min(1, Math.max(0, alpha));

    const viewW = window.innerWidth;
    const viewH = window.innerHeight;

    // Fast aspect ratio calculation
    const imgRatio = img.width / img.height;
    const viewRatio = viewW / viewH;

    let baseW, baseH;
    if (viewRatio > imgRatio) {
      baseW = viewW;
      baseH = viewW / imgRatio;
    } else {
      baseH = viewH;
      baseW = viewH * imgRatio;
    }

    const scaledW = baseW * scale;
    const scaledH = baseH * scale;

    const centerX = viewW * 0.5;
    const centerY = viewH * 0.5;

    // Shift based on focal point & subtle mouse tilt (parallax)
    const shiftX = (centerX - scaledW * focalX) + (tiltX * 14);
    const shiftY = (centerY - scaledH * focalY) + (tiltY * 14);

    ctx.drawImage(img, shiftX, shiftY, scaledW, scaledH);
    ctx.restore();
  }

  /**
   * Synchronize DOM Chapters & Telemetry ONLY When Values Actually Change
   */
  function syncDOMState(p) {
    // 1. Determine active chapter
    let chapter = 1;
    if (p < 0.26) {
      chapter = 1;
    } else if (p < 0.52) {
      chapter = 2;
    } else if (p < 0.78) {
      chapter = 3;
    } else {
      chapter = 4;
    }

    if (state.activeChapter !== chapter) {
      state.activeChapter = chapter;

      // Update caption visibility
      for (let i = 0; i < chapterEls.length; i++) {
        const el = chapterEls[i];
        const num = parseInt(el.getAttribute('data-chapter'), 10);
        if (num === chapter) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      }

      // Update telemetry buttons
      for (let i = 0; i < telemetryNodes.length; i++) {
        const node = telemetryNodes[i];
        const num = parseInt(node.getAttribute('data-chapter'), 10);
        if (num === chapter) {
          node.classList.add('active');
        } else {
          node.classList.remove('active');
        }
      }
    }

    // 2. Telemetry Progress Fill
    if (telemetryFill) {
      telemetryFill.style.height = `${(p * 100).toFixed(1)}%`;
    }
  }

  /**
   * Master 60 FPS Render Loop (Zero Overhead When Offscreen)
   */
  function renderLoop() {
    if (!isIntersecting) {
      isLoopRunning = false;
      return; // Pause RAF immediately when scrolled out of view!
    }
    // Responsive Kinetic Lerp (0.16 gives instant pickup without lag)
    const diff = state.targetProgress - state.currentProgress;
    if (Math.abs(diff) < 0.0004) {
      state.currentProgress = state.targetProgress;
    } else {
      state.currentProgress += diff * 0.16;
    }

    // Mouse tilt lerp
    state.tiltX += (state.targetTiltX - state.tiltX) * 0.08;
    state.tiltY += (state.targetTiltY - state.tiltY) * 0.08;

    const p = state.currentProgress;
    const w = window.innerWidth;
    const h = window.innerHeight;

    ctx.clearRect(0, 0, w, h);

    if (state.imagesLoaded && state.images.length === 4) {
      const [img1, img2, img3, img4] = state.images;

      // Chapter 1: The Hearth Roast (p: 0.00 -> 0.32)
      if (p <= 0.32) {
        const u1 = Math.min(1, p / 0.28);
        const scale1 = 1.0 + u1 * 1.45;
        const focalX1 = 0.50 + u1 * 0.05;
        const focalY1 = 0.50 - u1 * 0.04;

        let alpha1 = 1.0;
        if (p > 0.24) {
          alpha1 = 1.0 - (p - 0.24) / 0.08;
        }

        drawCoverImage(img1, alpha1, scale1, focalX1, focalY1, state.tiltX, state.tiltY);
      }

      // Chapter 2: The Extraction Bloom (p: 0.24 -> 0.58)
      if (p >= 0.24 && p <= 0.58) {
        const u2 = Math.min(1, Math.max(0, (p - 0.28) / 0.27));
        const scale2 = 1.35 - u2 * 0.22;
        const focalX2 = 0.50;
        const focalY2 = 0.35 + u2 * 0.30;

        let alpha2 = 0;
        if (p >= 0.24 && p < 0.32) {
          alpha2 = (p - 0.24) / 0.08;
        } else if (p >= 0.32 && p <= 0.50) {
          alpha2 = 1.0;
        } else if (p > 0.50) {
          alpha2 = 1.0 - (p - 0.50) / 0.08;
        }

        drawCoverImage(img2, alpha2, scale2, focalX2, focalY2, state.tiltX, state.tiltY);
      }

      // Chapter 3: Living Hearth Bakery (p: 0.50 -> 0.82)
      if (p >= 0.50 && p <= 0.82) {
        const u3 = Math.min(1, Math.max(0, (p - 0.54) / 0.26));
        const scale3 = 1.08 + u3 * 0.72;
        const focalX3 = 0.44 + u3 * 0.12;
        const focalY3 = 0.52;

        let alpha3 = 0;
        if (p >= 0.50 && p < 0.58) {
          alpha3 = (p - 0.50) / 0.08;
        } else if (p >= 0.58 && p <= 0.74) {
          alpha3 = 1.0;
        } else if (p > 0.74) {
          alpha3 = 1.0 - (p - 0.74) / 0.08;
        }

        drawCoverImage(img3, alpha3, scale3, focalX3, focalY3, state.tiltX, state.tiltY);
      }

      // Chapter 4: The Sanctuary (Grand Zoom-Out) (p: 0.74 -> 1.00)
      if (p >= 0.74) {
        const u4 = Math.min(1, Math.max(0, (p - 0.78) / 0.22));
        const scale4 = 1.85 - u4 * 0.85;
        const focalX4 = 0.50;
        const focalY4 = 0.50;

        let alpha4 = 0;
        if (p >= 0.74 && p < 0.82) {
          alpha4 = (p - 0.74) / 0.08;
        } else {
          alpha4 = 1.0;
        }

        drawCoverImage(img4, alpha4, scale4, focalX4, focalY4, state.tiltX, state.tiltY);
      }

      // High-Performance Ambient Embers (Clean GPU path, zero shadowBlur)
      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];
        pt.y += pt.speedY * 0.002;
        pt.x += pt.speedX * 0.001;
        if (pt.y < 0) pt.y = 1;
        if (pt.x < 0) pt.x = 1;
        if (pt.x > 1) pt.x = 0;

        const px = pt.x * w;
        const py = pt.y * h;

        ctx.fillStyle = `rgba(212, 141, 59, ${pt.alpha})`;
        ctx.beginPath();
        ctx.arc(px, py, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Update DOM indicators efficiently
    syncDOMState(p);

    requestAnimationFrame(renderLoop);
  }

  /**
   * DOM Initializer
   */
  function init() {
    container = document.querySelector('.cinema-scrolly-container');
    if (!container) return;

    stage = document.querySelector('.cinema-stage-sticky');
    canvas = document.getElementById('cinema-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    // Cache elements once
    chapterEls = Array.from(document.querySelectorAll('.cinema-chapter'));
    telemetryNodes = Array.from(document.querySelectorAll('.telemetry-node'));
    telemetryFill = document.querySelector('.telemetry-progress-fill');
    siteHeader = document.querySelector('.site-header');

    // Guarantee permanently dark header on startup
    if (siteHeader) {
      siteHeader.classList.add('theme-dark');
      state.headerIsDark = true;
    }

    // Measure container bounds once
    measureContainer();

    // Initial canvas setup
    resizeCanvas();
    window.addEventListener('resize', onResize, { passive: true });

    // IntersectionObserver: automatically sleep render loop when scrolled offscreen
    if ('IntersectionObserver' in window) {
      const cinemaObserver = new IntersectionObserver((entries) => {
        for (let i = 0; i < entries.length; i++) {
          isIntersecting = entries[i].isIntersecting;
          if (isIntersecting) {
            startRenderLoop();
          }
        }
      }, { rootMargin: '100px 0px 100px 0px' });
      cinemaObserver.observe(container);
    }

    // Passive scroll listener (Hardware-accelerated)
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    // Mouse Parallax Tracker
    window.addEventListener('mousemove', (e) => {
      const halfW = window.innerWidth * 0.5;
      const halfH = window.innerHeight * 0.5;
      state.targetTiltX = (e.clientX - halfW) / halfW;
      state.targetTiltY = (e.clientY - halfH) / halfH;
    }, { passive: true });

    // Telemetry Node Click Navigation
    telemetryNodes.forEach((node) => {
      node.addEventListener('click', () => {
        const targetPct = parseFloat(node.getAttribute('data-pct') || '0');
        const containerTop = container.offsetTop;
        const totalHeight = container.offsetHeight - window.innerHeight;
        const targetScroll = containerTop + targetPct * totalHeight;
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      });
    });

    // Start preloading and render loop
    preloadAssets();

    // Initial state sync
    syncDOMState(0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
