/**
 * NIGRUM STARE — LUXURY STREETWEAR
 * 83-Frame Reconstructed Canvas Animation Engine
 * Quiet. Dark. Clean. Expensive. Minimal.
 */

(function () {
  'use strict';

  // --- CONFIGURATION ---
  const TOTAL_FRAMES = 83;
  const FRAME_PREFIX = 'frames/ezgif-frame-';
  const FRAME_EXT = '.jpg';

  // Stages Mapping (83 frames divided across 7 stages)
  const STAGES = [
    { name: '01 / THREAD', range: [0, 13] },   // Frames 1-14: Macro cotton fibers into tension guides
    { name: '02 / FABRIC', range: [14, 29] },  // Frames 15-30: Circular knitting into heavy jersey
    { name: '03 / CUT',    range: [30, 41] },  // Frames 31-42: Slicing panels and drop shoulders
    { name: '04 / SEW',    range: [42, 55] },  // Frames 43-56: Industrial lockstitch joining neckline and seams
    { name: '05 / FINISH', range: [56, 65] },  // Frames 57-66: Steam press and hem detailing
    { name: '06 / FORM',   range: [66, 74] },  // Frames 67-75: Draped silhouette on architectural hanger
    { name: '07 / NIGRUM STARE', range: [75, 82] } // Frames 76-83: Completed garment on model
  ];

  // --- AUTHENTIC USER PRODUCT MEDIA ---
  const PRODUCTS = [
    {
      id: 'ns-01',
      name: 'Signature T-Shirt',
      price: '$140',
      priceNum: 140,
      image: 'assets/products/t 2.jpg',
      desc: 'Heavyweight combed jersey with tonal screen-printed archival lettering and vintage oil-wash aging.',
      sizes: ['S', 'M', 'L', 'XL', 'OVERSIZED']
    },
    {
      id: 'ns-02',
      name: 'Classic Hoodie',
      price: '$220',
      priceNum: 220,
      image: 'assets/products/hoodie.jpg',
      desc: '480 GSM loopback French terry. Seamless double-thick structured hood with raw cuff and waist detailing.',
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 'ns-03',
      name: 'Sweat Shirt & Shorts Set',
      price: '$195',
      priceNum: 195,
      image: 'assets/products/t3.jpg',
      desc: '360 GSM unbrushed loopback cotton. Includes drop-shoulder crewneck and matching relaxed wide shorts.',
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 'ns-04',
      name: 'Pro Heavyweight Hoodie',
      price: '$235',
      priceNum: 235,
      image: 'assets/products/HOODIE3.jpg',
      desc: 'Constructed for brutalist thermal protection with dense double-faced brushed cotton fleece.',
      sizes: ['M', 'L', 'XL', 'OVERSIZED']
    },
    {
      id: 'ns-05',
      name: 'Structured Tactical Cap',
      price: '$75',
      priceNum: 75,
      image: 'assets/products/cap.jpg',
      desc: 'Rigid heavyweight cotton twill 6-panel cap with matte black steel hardware and tonal branding.',
      sizes: ['ONE SIZE']
    },
    {
      id: 'ns-06',
      name: 'Wool Fisherman Beanie',
      price: '$65',
      priceNum: 65,
      image: 'assets/products/ROYBENS 2 Pack Wool Fisherman Beanies for Men, Knit Short Watch Cap Winter Warm Hats.jpg',
      desc: '100% extra-fine merino wool in a dense 7-gauge double rib knit for enduring structural shape.',
      sizes: ['ONE SIZE']
    },
    {
      id: 'ns-07',
      name: 'Solid Trucker Hat',
      price: '$70',
      priceNum: 70,
      image: 'assets/products/Men Solid Trucker Hat.jpg',
      desc: 'Structured crown with breathable tactical mesh backing and tonal embroidered emblem.',
      sizes: ['ONE SIZE']
    },
    {
      id: 'ns-08',
      name: 'Tactical Bandana',
      price: '$45',
      priceNum: 45,
      image: 'assets/products/1pc Quick Dry Sports Bandana.jpg',
      desc: 'Technical moisture-wicking headpiece designed to be worn under hoods or as an individual statement.',
      sizes: ['ONE SIZE']
    },
    {
      id: 'ns-09',
      name: 'Turban Headwrap',
      price: '$50',
      priceNum: 50,
      image: 'assets/products/Turban.jpg',
      desc: 'Breathable textured fabric with structured draping and seamless edge finish.',
      sizes: ['ONE SIZE']
    }
  ];

  // --- STATE ---
  const frameImages = new Array(TOTAL_FRAMES);
  let framesLoaded = 0;
  let canvas, ctx;
  let targetFrame = 0;
  let currentFrame = 0;
  let cart = [];

  // DOM Elements
  const heroCanvas = document.getElementById('heroCanvas');
  const heroContainer = document.getElementById('hero');
  const heroTitleBlock = document.getElementById('heroTitleBlock');
  const heroScrollHint = document.getElementById('heroScrollHint');
  const stageIndicator = document.getElementById('stageIndicator');
  const productGrid = document.getElementById('productGrid');
  const productModal = document.getElementById('productModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalPrice = document.getElementById('modalPrice');
  const modalSizes = document.getElementById('modalSizes');
  const modalAddBtn = document.getElementById('modalAddBtn');
  const cartBtn = document.getElementById('cartBtn');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartSubtotal = document.getElementById('cartSubtotal');
  const cartCheckoutBtn = document.getElementById('cartCheckoutBtn');
  const statementSection = document.getElementById('statementSection');
  const minimalToast = document.getElementById('minimalToast');

  let activeProduct = null;
  let selectedSize = null;

  // --- INITIALIZATION ---
  function init() {
    canvas = heroCanvas;
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    loadCart();
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    preloadFrames();
    setupScrollListener();
    renderProducts();
    setupProductModal();
    setupCartDrawer();
    setupIntersectionObservers();
    setupSmoothScrollLinks();

    requestAnimationFrame(renderLoop);
  }

  // --- CANVAS RESIZE ---
  function resizeCanvas() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = (rect.width || window.innerWidth) * dpr;
    canvas.height = (rect.height || window.innerHeight) * dpr;
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }
  }

  // --- PRELOAD 83 AUTHENTIC ANIMATION FRAMES ---
  function preloadFrames() {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const padded = String(i).padStart(3, '0');
      img.src = `${FRAME_PREFIX}${padded}${FRAME_EXT}`;
      
      img.onload = () => {
        frameImages[i - 1] = img;
        framesLoaded++;
        // If first frame loaded, draw immediately
        if (i === 1 && currentFrame === 0) {
          drawFrame(img);
        }
      };
    }
  }

  // --- SCROLL ENGINE ---
  function setupScrollListener() {
    window.addEventListener('scroll', () => {
      if (!heroContainer) return;
      const rect = heroContainer.getBoundingClientRect();
      const totalScroll = heroContainer.offsetHeight - window.innerHeight;
      const currentScroll = -rect.top;

      if (totalScroll <= 0) return;

      const progress = Math.max(0, Math.min(1, currentScroll / totalScroll));
      targetFrame = progress * (TOTAL_FRAMES - 1);

      // Title & Scroll Hint Fadeout
      if (heroTitleBlock) {
        const titleOpacity = Math.max(0, 1 - (progress / 0.06));
        heroTitleBlock.style.opacity = titleOpacity;
        heroTitleBlock.style.transform = `translate(-50%, calc(-50% - ${progress * 50}px))`;
      }

      if (heroScrollHint) {
        const hintOpacity = Math.max(0, 1 - (progress / 0.04));
        heroScrollHint.style.opacity = hintOpacity;
      }

      // Stage Indicator Update
      if (stageIndicator) {
        if (progress > 0.02 && progress < 0.99) {
          stageIndicator.classList.add('visible');

          const frameIdx = Math.round(targetFrame);
          let matchedStage = STAGES[0].name;

          for (let s = 0; s < STAGES.length; s++) {
            if (frameIdx >= STAGES[s].range[0] && frameIdx <= STAGES[s].range[1]) {
              matchedStage = STAGES[s].name;
              break;
            }
          }

          if (stageIndicator.textContent !== matchedStage) {
            stageIndicator.textContent = matchedStage;
          }
        } else {
          stageIndicator.classList.remove('visible');
        }
      }
    }, { passive: true });
  }

  // --- RENDER LOOP WITH LERP SMOOTHING ---
  function renderLoop() {
    const diff = targetFrame - currentFrame;
    if (Math.abs(diff) > 0.001) {
      currentFrame += diff * 0.2;
    } else {
      currentFrame = targetFrame;
    }

    const frameIdx = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(currentFrame)));
    let img = frameImages[frameIdx];

    // Fallback to nearest loaded frame if current not ready yet
    if (!img || !img.complete) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        if (frameImages[frameIdx - offset] && frameImages[frameIdx - offset].complete) {
          img = frameImages[frameIdx - offset];
          break;
        }
        if (frameImages[frameIdx + offset] && frameImages[frameIdx + offset].complete) {
          img = frameImages[frameIdx + offset];
          break;
        }
      }
    }

    if (img && img.complete) {
      drawFrame(img);
    }

    requestAnimationFrame(renderLoop);
  }

  // --- DRAW FRAME CENTERED WITHOUT DISTORTION ---
  function drawFrame(img) {
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const srcW = img.naturalWidth || img.width || 1280;
    const srcH = img.naturalHeight || img.height || 720;
    const canvasW = canvas.width;
    const canvasH = canvas.height;

    // Cover scale to fill canvas while preserving aspect ratio
    const scale = Math.max(canvasW / srcW, canvasH / srcH);
    const drawW = srcW * scale;
    const drawH = srcH * scale;
    const drawX = (canvasW - drawW) / 2;
    const drawY = (canvasH - drawH) / 2;

    ctx.drawImage(img, 0, 0, srcW, srcH, drawX, drawY, drawW, drawH);
  }

  // --- 3-COLUMN PRODUCT GRID ---
  function renderProducts() {
    if (!productGrid) return;
    productGrid.innerHTML = '';

    PRODUCTS.forEach((product) => {
      const item = document.createElement('div');
      item.className = 'product-item';
      item.dataset.id = product.id;

      item.innerHTML = `
        <div class="product-image-wrap">
          <img src="${product.image}" alt="${product.name}" loading="lazy"/>
          <div class="product-hover-view">
            <span class="view-label">VIEW</span>
          </div>
        </div>
        <div class="product-meta">
          <span class="product-name">${product.name}</span>
          <span class="product-price">${product.price}</span>
        </div>
      `;

      item.addEventListener('click', () => {
        openProductModal(product);
      });

      productGrid.appendChild(item);
    });
  }

  // --- MINIMAL PRODUCT PRESENTATION MODAL ---
  function setupProductModal() {
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeProductModal);
    }
    if (productModal) {
      productModal.addEventListener('click', (e) => {
        if (e.target === productModal) closeProductModal();
      });
    }

    if (modalAddBtn) {
      modalAddBtn.addEventListener('click', () => {
        if (activeProduct && selectedSize) {
          addToCart(activeProduct, selectedSize);
          closeProductModal();
        } else if (activeProduct) {
          showToast('SELECT SIZE');
        }
      });
    }
  }

  function openProductModal(product) {
    activeProduct = product;
    selectedSize = product.sizes[0];

    modalImage.src = product.image;
    modalImage.alt = product.name;
    modalTitle.textContent = product.name;
    modalDesc.textContent = product.desc;
    modalPrice.textContent = product.price;

    modalSizes.innerHTML = '';
    product.sizes.forEach((size, idx) => {
      const btn = document.createElement('button');
      btn.className = `size-btn ${idx === 0 ? 'active' : ''}`;
      btn.textContent = size;
      btn.addEventListener('click', () => {
        modalSizes.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedSize = size;
      });
      modalSizes.appendChild(btn);
    });

    productModal.classList.add('open');
  }

  function closeProductModal() {
    if (productModal) productModal.classList.remove('open');
  }

  // --- CART SYSTEM ---
  function setupCartDrawer() {
    if (cartBtn) {
      cartBtn.addEventListener('click', openCart);
    }
    if (cartCloseBtn) {
      cartCloseBtn.addEventListener('click', closeCart);
    }
    if (cartBackdrop) {
      cartBackdrop.addEventListener('click', (e) => {
        if (e.target === cartBackdrop) closeCart();
      });
    }

    if (cartCheckoutBtn) {
      cartCheckoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
          showToast('BAG EMPTY');
          return;
        }
        window.open('https://paystack.shop/pay/yw9q-sw7y7', '_blank');
      });
    }
  }

  function openCart() {
    renderCart();
    if (cartBackdrop) cartBackdrop.classList.add('open');
  }

  function closeCart() {
    if (cartBackdrop) cartBackdrop.classList.remove('open');
  }

  function addToCart(product, size) {
    const existing = cart.find(item => item.id === product.id && item.size === size);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        priceNum: product.priceNum,
        image: product.image,
        size: size,
        qty: 1
      });
    }
    saveCart();
    updateCartButton();
    renderCart();
    openCart();
    showToast(`ADDED ${product.name}`);
  }

  function updateCartButton() {
    const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
    if (cartBtn) {
      cartBtn.textContent = `CART (${totalCount})`;
    }
  }

  function renderCart() {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<p class="cart-empty-text">BAG IS EMPTY</p>`;
      if (cartSubtotal) cartSubtotal.textContent = '$0';
      return;
    }

    let total = 0;
    cart.forEach((item, index) => {
      total += item.priceNum * item.qty;

      const row = document.createElement('div');
      row.className = 'cart-item-row';
      row.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-img"/>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-size">SIZE: ${item.size} × ${item.qty}</div>
          <div class="cart-item-price">$${item.priceNum * item.qty}</div>
        </div>
        <button class="cart-item-remove" data-index="${index}">REMOVE</button>
      `;

      row.querySelector('.cart-item-remove').addEventListener('click', () => {
        cart.splice(index, 1);
        saveCart();
        updateCartButton();
        renderCart();
      });

      cartItemsContainer.appendChild(row);
    });

    if (cartSubtotal) {
      cartSubtotal.textContent = `$${total}`;
    }
  }

  function loadCart() {
    try {
      const saved = localStorage.getItem('nigrum_minimal_cart');
      if (saved) cart = JSON.parse(saved);
    } catch (e) {
      cart = [];
    }
    updateCartButton();
  }

  function saveCart() {
    try {
      localStorage.setItem('nigrum_minimal_cart', JSON.stringify(cart));
    } catch (e) {
      // Ignore
    }
  }

  // --- BRAND STATEMENT INTERSECTION OBSERVER ---
  function setupIntersectionObservers() {
    if (!statementSection) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statementSection.classList.add('in-view');
        }
      });
    }, { threshold: 0.35 });

    observer.observe(statementSection);
  }

  // --- SMOOTH SCROLL NAV LINKS ---
  function setupSmoothScrollLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId === '#' || !targetId) return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // --- MINIMAL TOAST ---
  let toastTimer = null;
  function showToast(msg) {
    if (!minimalToast) return;
    minimalToast.textContent = msg;
    minimalToast.classList.add('visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      minimalToast.classList.remove('visible');
    }, 2500);
  }

  // Run on ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
