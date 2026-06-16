/* ============================================================
   main.js — UI behavior
   - sticky header shrink on scroll
   - desktop dropdown menus
   - mobile burger + drawer + nested toggles
   - product showcase tabs
   - FAQ accordion
   - showcase gallery thumbnails
   - quantity stepper
   - cart drawer open/close
   - year stamp
   ============================================================ */

(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Year stamp ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header shrink + promo-bar dock ---------- */
  const header = $('#site-header');
  const promoBar = $('.promo-bar');
  let footerEl = null;
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-stuck', y > 8);
    // Once the user starts scrolling, slide the promo line to the bottom
    // of the viewport so it stays readable; restore it at the very top.
    // Release it once the footer comes into view so it never blocks it.
    if (promoBar) {
      footerEl = footerEl || $('.footer');
      const footerVisible = footerEl
        ? footerEl.getBoundingClientRect().top < window.innerHeight
        : false;
      promoBar.classList.toggle('is-docked', y > 80 && !footerVisible);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Desktop dropdown menus ---------- */
  const dropdownItems = $$('.header__nav-item--has-menu');

  const closeAllDropdowns = (except = null) => {
    dropdownItems.forEach((item) => {
      if (item === except) return;
      item.classList.remove('is-open');
      const btn = $('.header__nav-link--button', item);
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  };

  // Close after a short delay so the cursor can travel the gap between the
  // nav button and the full-width mega-menu without it snapping shut.
  let closeTimer = null;

  const openItem = (item) => {
    closeAllDropdowns(item);
    item.classList.add('is-open');
    const btn = $('.header__nav-link--button', item);
    if (btn) btn.setAttribute('aria-expanded', 'true');
  };

  dropdownItems.forEach((item) => {
    const btn = $('.header__nav-link--button', item);
    if (!btn) return;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      clearTimeout(closeTimer);
      const isOpen = item.classList.contains('is-open');
      closeAllDropdowns();
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    // mouseenter on the item fires again when the cursor enters the
    // mega-menu (it's a descendant), which cancels the pending close.
    item.addEventListener('mouseenter', () => {
      if (window.matchMedia('(hover: hover)').matches) {
        clearTimeout(closeTimer);
        openItem(item);
      }
    });

    item.addEventListener('mouseleave', () => {
      if (window.matchMedia('(hover: hover)').matches) {
        clearTimeout(closeTimer);
        closeTimer = setTimeout(closeAllDropdowns, 220);
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header__nav-item--has-menu')) {
      closeAllDropdowns();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns();
      closeMobileNav();
      closeCart();
    }
  });

  /* ---------- Mobile burger + drawer ---------- */
  const burger     = $('#burger');
  const mobileNav  = $('#mobile-nav');

  const openMobileNav = () => {
    if (!mobileNav || !burger) return;
    mobileNav.classList.add('is-open');
    burger.classList.add('is-active');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-nav-open');
  };

  const closeMobileNav = () => {
    if (!mobileNav || !burger) return;
    mobileNav.classList.remove('is-open');
    burger.classList.remove('is-active');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('is-nav-open');
  };

  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      mobileNav.classList.contains('is-open') ? closeMobileNav() : openMobileNav();
    });

    // Close on internal link click
    $$('.mobile-nav__link, .mobile-nav__sub a', mobileNav).forEach((link) => {
      link.addEventListener('click', closeMobileNav);
    });
  }

  /* ---------- Mobile nested group toggles ---------- */
  $$('.mobile-nav__group').forEach((group) => {
    const toggle = $('.mobile-nav__group-toggle', group);
    if (!toggle) return;
    toggle.addEventListener('click', () => {
      const isOpen = group.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  });

  /* ---------- Showcase tabs ---------- */
  const tabs   = $$('.showcase__tab');
  const panels = $$('.showcase__panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      panels.forEach((p) => {
        p.classList.toggle('is-active', p.dataset.panel === target);
      });
    });
  });

  /* ---------- Showcase gallery thumbs (swap main image) ---------- */
  const galleryMain = $('#gallery-main');
  $$('.showcase__thumb').forEach((thumb, idx, arr) => {
    thumb.addEventListener('click', () => {
      arr.forEach((t) => t.classList.remove('is-active'));
      thumb.classList.add('is-active');
      const src = thumb.dataset.img;
      if (galleryMain && src) galleryMain.src = src;
    });
  });

  /* ---------- Quantity stepper ---------- */
  const qtyVal = $('#qty-val');
  if (qtyVal) {
    $$('.showcase__qty-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const step = parseInt(btn.dataset.qty, 10) || 0;
        const next = Math.max(1, (parseInt(qtyVal.textContent, 10) || 1) + step);
        qtyVal.textContent = next;
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  const faqItems = $$('.faq__item');

  faqItems.forEach((item) => {
    const q = $('.faq__q', item);
    const a = $('.faq__a', item);
    if (!q || !a) return;

    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // close all
      faqItems.forEach((other) => {
        other.classList.remove('is-open');
        const otherQ = $('.faq__q', other);
        const otherA = $('.faq__a', other);
        if (otherQ) otherQ.setAttribute('aria-expanded', 'false');
        if (otherA) otherA.style.maxHeight = '';
      });

      if (!isOpen) {
        item.classList.add('is-open');
        q.setAttribute('aria-expanded', 'true');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  // Expand any accordion item pre-marked as open (e.g. product "What's inside")
  faqItems.forEach((item) => {
    if (!item.classList.contains('is-open')) return;
    const a = $('.faq__a', item);
    const q = $('.faq__q', item);
    if (a) a.style.maxHeight = a.scrollHeight + 'px';
    if (q) q.setAttribute('aria-expanded', 'true');
  });

  /* ---------- Cart drawer ---------- */
  const cartBtn    = $('#cart-btn');
  const cartDrawer = $('#cart-drawer');
  const cartClose  = $('#cart-close');
  const overlay    = $('#overlay');

  const openCart = () => {
    if (!cartDrawer || !overlay) return;
    cartDrawer.classList.add('is-open');
    cartDrawer.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-visible');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-cart-open');
  };

  const closeCart = () => {
    if (!cartDrawer || !overlay) return;
    cartDrawer.classList.remove('is-open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('is-visible');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-cart-open');
  };

  if (cartBtn)    cartBtn.addEventListener('click', openCart);
  if (cartClose)  cartClose.addEventListener('click', closeCart);
  if (overlay)    overlay.addEventListener('click', closeCart);

  /* ---------- Cart state, line items, gift-card / promo codes ---------- */
  (function initCart() {
    const CART_KEY = 'uphealth_cart';
    const CODE_KEY = 'uphealth_cart_code';
    const body      = $('#cart-body');
    const foot      = $('#cart-foot');
    const drawerCnt = $('#cart-drawer-count');
    const headerCnt = $('#cart-btn .header__count');
    const subtotalEl= $('#cart-subtotal');
    const discRow   = $('#cart-discount-row');
    const discLabel = $('#cart-discount-label');
    const discEl    = $('#cart-discount');
    const totalEl   = $('#cart-total');
    const promoForm = $('#cart-promo');
    const codeInput = $('#cart-code');
    const promoMsg  = $('#cart-promo-msg');
    const checkout  = $('#cart-checkout');
    if (!body || !cartDrawer) return;

    // Demo redeem codes — gift cards take money off, WELCOME10 is a % promo.
    const CODES = {
      GIFT25:    { type: 'amount',  value: 25,  label: 'Gift card · GIFT25' },
      GIFT50:    { type: 'amount',  value: 50,  label: 'Gift card · GIFT50' },
      GIFT100:   { type: 'amount',  value: 100, label: 'Gift card · GIFT100' },
      GIFT150:   { type: 'amount',  value: 150, label: 'Gift card · GIFT150' },
      WELCOME10: { type: 'percent', value: 10,  label: 'Promo · WELCOME10' },
    };

    let cart = [];
    let code = '';
    try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { cart = []; }
    try { code = localStorage.getItem(CODE_KEY) || ''; } catch (e) { code = ''; }

    const save = () => {
      try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
      try { localStorage.setItem(CODE_KEY, code); } catch (e) {}
    };

    const money = (n) => '$' + (Math.round(n * 100) / 100).toLocaleString('en-US');
    const count = () => cart.reduce((n, i) => n + i.qty, 0);
    const subtotal = () => cart.reduce((s, i) => s + i.price * i.qty, 0);

    const discountAmount = () => {
      const c = CODES[code];
      if (!c) return 0;
      const sub = subtotal();
      const raw = c.type === 'percent' ? sub * (c.value / 100) : c.value;
      return Math.min(raw, sub); // never below zero
    };

    const SUB_RATE = 0.10;                 // monthly subscription discount on products
    const titleOf = (card) => ($('.product-card__title', card)?.textContent || 'Product').trim();
    const itemInfo = (card, opts = {}) => {
      const media = $('.product-card__media', card);
      const img = media && media.querySelector('img');
      let price = parseFloat((($('.product-card__price-now', card)?.textContent) || '').replace(/[^0-9.]/g, '')) || 0;
      const title = titleOf(card);
      const sub = !!opts.sub;
      const isGift = card.classList.contains('product-card--gift');
      // products get 10% off on subscription; gift cards stay at face value (just recurring)
      if (sub && !isGift) price = Math.round(price * (1 - SUB_RATE));
      return {
        id: title + '|' + price + (sub ? '|sub' : ''),   // sub & one-time are separate lines
        title, price, sub,
        thumb: img ? img.getAttribute('src') : '',
        bg: (!img && media) ? (media.getAttribute('style') || '') : '',
      };
    };

    const updateCount = () => {
      const n = count();
      if (headerCnt) { headerCnt.textContent = n; headerCnt.style.display = n ? '' : 'none'; }
      if (drawerCnt) drawerCnt.textContent = n ? '(' + n + ')' : '';
    };

    const render = () => {
      cartDrawer.classList.toggle('has-items', cart.length > 0);
      if (foot) foot.hidden = cart.length === 0;

      if (!cart.length) {
        body.innerHTML = '<p class="cart-drawer__empty">Your cart is empty.</p>';
        updateCount();
        return;
      }

      body.innerHTML = cart.map((i) => `
        <div class="cart-item${i.sub ? ' cart-item--sub' : ''}">
          <span class="cart-item__thumb" style="${i.thumb ? "background-image:url('" + i.thumb + "')" : i.bg}"></span>
          <span class="cart-item__info">
            <span class="cart-item__name">${i.title}${i.variant ? ' · ' + i.variant : ''}</span>
            ${i.sub ? '<span class="cart-item__sub">Monthly subscription</span>' : ''}
            <span class="cart-item__price">${money(i.price)}${i.sub ? '<span class="cart-item__per"> / mo</span>' : ''}</span>
            <span class="cart-item__qty">
              <button class="cart-item__step" data-cart-dec="${i.id}" aria-label="Decrease quantity">−</button>
              <span class="cart-item__count">${i.qty}</span>
              <button class="cart-item__step" data-cart-inc="${i.id}" aria-label="Increase quantity">+</button>
            </span>
          </span>
          <button class="cart-item__remove" data-cart-remove="${i.id}" aria-label="Remove">×</button>
        </div>`).join('');

      const sub = subtotal();
      const disc = discountAmount();
      if (subtotalEl) subtotalEl.textContent = money(sub);
      if (discRow) discRow.hidden = disc <= 0;
      if (disc > 0) {
        if (discLabel) discLabel.textContent = (CODES[code] && CODES[code].label) || 'Discount';
        if (discEl) discEl.textContent = '−' + money(disc);
      }
      if (totalEl) totalEl.textContent = money(Math.max(0, sub - disc));
      updateCount();
    };

    // Generic add — used by product cards AND the product page (via window.UpCart)
    const addItem = (info, qty = 1) => {
      const existing = cart.find((i) => i.id === info.id);
      if (existing) existing.qty += qty;
      else cart.push({ ...info, qty });
      save();
      render();
      openCart();
    };
    const addToCart = (card, opts = {}) => addItem(itemInfo(card, opts), opts.qty || 1);

    // Expose a tiny API so the product page can add fully-built items (with variant/sub)
    window.UpCart = { add: addItem };

    const setQty = (id, delta) => {
      const i = cart.find((it) => it.id === id);
      if (!i) return;
      i.qty += delta;
      if (i.qty <= 0) cart = cart.filter((it) => it.id !== id);
      save();
      render();
    };

    // Delegated clicks: add-to-cart, qty steppers, remove
    document.addEventListener('click', (e) => {
      const add = e.target.closest('[data-add-to-cart]');
      if (add) {
        e.preventDefault();
        const card = add.closest('.product-card');
        if (card) {
          const subToggle = card.querySelector('[data-card-sub]');
          addToCart(card, { sub: !!(subToggle && subToggle.checked) });
        }
        return;
      }
      const inc = e.target.closest('[data-cart-inc]');
      if (inc) { setQty(inc.getAttribute('data-cart-inc'), +1); return; }
      const dec = e.target.closest('[data-cart-dec]');
      if (dec) { setQty(dec.getAttribute('data-cart-dec'), -1); return; }
      const rm = e.target.closest('[data-cart-remove]');
      if (rm) {
        cart = cart.filter((it) => it.id !== rm.getAttribute('data-cart-remove'));
        save();
        render();
      }
    });

    // Apply / clear a gift-card or promo code
    const showMsg = (text, ok) => {
      if (!promoMsg) return;
      promoMsg.textContent = text;
      promoMsg.classList.toggle('is-ok', !!ok);
      promoMsg.classList.toggle('is-err', !ok);
    };
    if (promoForm) {
      promoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const entered = (codeInput?.value || '').trim().toUpperCase();
        if (!entered) return;
        if (code === entered) { code = ''; save(); render(); showMsg('Code removed.', true); if (codeInput) codeInput.value = ''; return; }
        if (CODES[entered]) {
          code = entered;
          save();
          render();
          showMsg('Applied — ' + CODES[entered].label + '. Enter again to remove.', true);
        } else {
          showMsg("That code isn't valid. Try GIFT25, GIFT50, GIFT100, GIFT150 or WELCOME10.", false);
        }
      });
    }

    if (checkout) checkout.addEventListener('click', () => {
      showMsg('Demo checkout — wire to Shopify checkout in production.', true);
    });

    render();
  })();

  /* ---------- Product page: variant + qty + subscribe + add to cart ---------- */
  (function initProductBuy() {
    const buy = $('.showcase__buy');
    if (!buy) return;                       // product page only

    const SUB_RATE  = 0.10;
    const title     = ($('.showcase__title')?.textContent || 'Product').trim();
    const priceNow  = $('.showcase__price-now');
    const basePrice = parseFloat((priceNow?.textContent || '').replace(/[^0-9.]/g, '')) || 0;
    const subPrice  = Math.round(basePrice * (1 - SUB_RATE));
    const mainImg   = $('#gallery-main');

    let qty = 1;
    let sub = false;
    let variant = ($('.variant.is-active')?.textContent || '').trim();

    // Flavour / variant
    $$('.variant').forEach((v) => v.addEventListener('click', () => {
      $$('.variant').forEach((x) => x.classList.remove('is-active'));
      v.classList.add('is-active');
      variant = v.textContent.trim();
    }));

    // Quantity stepper
    const qtyVal = $('#qty-val');
    $$('[data-qty]').forEach((b) => b.addEventListener('click', () => {
      qty = Math.max(1, qty + (parseInt(b.dataset.qty, 10) || 0));
      if (qtyVal) qtyVal.textContent = qty;
    }));

    // Subscribe & save toggle
    const subEl     = $('[data-subscribe]');
    const subToggle = $('[data-subscribe-toggle]');
    const subSave   = $('[data-subscribe-price]');
    if (subSave) subSave.textContent = '−$' + (basePrice - subPrice);
    const syncSub = () => {
      sub = !!(subToggle && subToggle.checked);
      subEl && subEl.classList.toggle('is-active', sub);
      if (priceNow) priceNow.textContent = '$' + (sub ? subPrice : basePrice);
    };
    subToggle && subToggle.addEventListener('change', syncSub);

    // Add to cart
    const addBtn = $('[data-product-add]');
    addBtn && addBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const price = sub ? subPrice : basePrice;
      window.UpCart && window.UpCart.add({
        id: title + '|' + variant + '|' + price + (sub ? '|sub' : ''),
        title, variant, price, sub,
        thumb: mainImg ? mainImg.getAttribute('src') : '',
        bg: '',
      }, qty);
    });
  })();

  /* ---------- Wishlist / favorites ---------- */
  (function initWishlist() {
    const FAV_KEY  = 'uphealth_favs';
    const favBtn   = $('#wishlist-btn');
    const favDrawer = $('#fav-drawer');
    const favClose = $('#fav-close');
    const favBody  = $('#fav-body');
    const favCount = $('#wishlist-count');
    const favDrawerCount = $('#fav-drawer-count');

    let favs = [];
    try { favs = JSON.parse(localStorage.getItem(FAV_KEY)) || []; } catch (e) { favs = []; }
    const save = () => { try { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); } catch (e) {} };

    const titleOf = (card) => ($('.product-card__title', card)?.textContent || '').trim();

    const cardInfo = (card) => {
      const media = $('.product-card__media', card);
      const img = media && media.querySelector('img');
      return {
        id: titleOf(card) || 'Product',
        title: titleOf(card) || 'Product',
        price: ($('.product-card__price-now', card)?.textContent || '').trim(),
        thumb: img ? img.getAttribute('src') : '',
        bg: (!img && media) ? (media.getAttribute('style') || '') : ''
      };
    };

    const isFav = (id) => favs.some((f) => f.id === id);

    const syncHearts = () => {
      $$('.product-card__fav').forEach((btn) => {
        const card = btn.closest('.product-card');
        if (!card) return;
        const active = isFav(titleOf(card));
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    };

    const updateCount = () => {
      const n = favs.length;
      if (favCount) { favCount.textContent = n; favCount.style.display = n ? '' : 'none'; }
      if (favDrawerCount) favDrawerCount.textContent = n ? `(${n})` : '';
    };

    const renderDrawer = () => {
      if (!favBody) return;
      if (!favs.length) {
        favBody.innerHTML = '<p class="cart-drawer__empty">No favorites yet — tap the ♥ on any product.</p>';
        return;
      }
      favBody.innerHTML = favs.map((f) => `
        <div class="fav-item">
          <span class="fav-item__thumb" style="${f.thumb ? "background-image:url('" + f.thumb + "')" : f.bg}"></span>
          <span class="fav-item__info">
            <span class="fav-item__name">${f.title}</span>
            <span class="fav-item__price">${f.price}</span>
          </span>
          <button class="fav-item__remove" data-fav-remove="${f.id}" aria-label="Remove">×</button>
        </div>`).join('');
    };

    const refresh = () => { syncHearts(); updateCount(); renderDrawer(); };

    const toggle = (card) => {
      const info = cardInfo(card);
      const i = favs.findIndex((f) => f.id === info.id);
      if (i >= 0) favs.splice(i, 1); else favs.push(info);
      save();
      refresh();
    };

    // Heart + remove clicks (delegated, so dynamically shown cards work too)
    document.addEventListener('click', (e) => {
      const heart = e.target.closest('.product-card__fav');
      if (heart) {
        e.preventDefault();
        const card = heart.closest('.product-card');
        if (card) toggle(card);
        return;
      }
      const rm = e.target.closest('[data-fav-remove]');
      if (rm) {
        const id = rm.getAttribute('data-fav-remove');
        favs = favs.filter((f) => f.id !== id);
        save();
        refresh();
      }
    });

    // Drawer (shares the overlay with the cart; opening one closes the other)
    const openFav = () => {
      if (!favDrawer) return;
      $('#cart-drawer')?.classList.remove('is-open');
      favDrawer.classList.add('is-open');
      favDrawer.setAttribute('aria-hidden', 'false');
      if (overlay) { overlay.classList.add('is-visible'); overlay.setAttribute('aria-hidden', 'false'); }
      document.body.classList.add('is-cart-open');
    };
    const closeFav = () => {
      if (!favDrawer) return;
      favDrawer.classList.remove('is-open');
      favDrawer.setAttribute('aria-hidden', 'true');
      if (overlay) { overlay.classList.remove('is-visible'); overlay.setAttribute('aria-hidden', 'true'); }
      document.body.classList.remove('is-cart-open');
    };
    if (favBtn)   favBtn.addEventListener('click', openFav);
    if (favClose) favClose.addEventListener('click', closeFav);
    if (overlay)  overlay.addEventListener('click', closeFav);
    if (cartBtn)  cartBtn.addEventListener('click', closeFav);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeFav(); });

    refresh();
  })();

  /* ---------- Smooth in-page anchors (skip empty hashes) ---------- */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href === '#' || href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = (header?.offsetHeight || 0) + 8;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });

  /* ---------- Resize: close mobile nav above breakpoint ---------- */
  let resizeRaf;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      if (window.innerWidth > 900 && mobileNav?.classList.contains('is-open')) {
        closeMobileNav();
      }
    });
  });

  /* ---------- Ripple on .btn click ---------- */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    if (btn.dataset.noRipple === 'true') return;

    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    // Make sure parent can host an absolute child
    const prevPosition = getComputedStyle(btn).position;
    if (prevPosition === 'static') btn.style.position = 'relative';
    btn.style.overflow = 'hidden';

    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  });

  /* ---------- Carousel (.carousel) ---------- */
  $$('.carousel').forEach((root) => {
    const track = $('.carousel__track', root);
    const slides = $$('.carousel__slide', root);
    const prevBtn = $('.carousel__btn--prev', root);
    const nextBtn = $('.carousel__btn--next', root);
    const dotsHost = $('.carousel__dots', root);
    if (!track || !slides.length) return;

    let index = 0;
    let perView = 3;

    const getPerView = () => {
      const w = window.innerWidth;
      if (w <= 640) return 1;
      if (w <= 1024) return 2;
      return 3;
    };

    const buildDots = () => {
      if (!dotsHost) return;
      dotsHost.innerHTML = '';
      const pages = Math.max(1, slides.length - perView + 1);
      for (let i = 0; i < pages; i++) {
        const d = document.createElement('button');
        d.className = 'carousel__dot';
        d.setAttribute('aria-label', `Go to slide ${i + 1}`);
        if (i === index) d.classList.add('is-active');
        d.addEventListener('click', () => go(i));
        dotsHost.appendChild(d);
      }
    };

    const update = () => {
      const slideWidth = slides[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(track).gap) || 16;
      const offset = (slideWidth + gap) * index;
      track.style.transform = `translateX(-${offset}px)`;

      const maxIndex = Math.max(0, slides.length - perView);
      if (prevBtn) prevBtn.toggleAttribute('disabled', index <= 0);
      if (nextBtn) nextBtn.toggleAttribute('disabled', index >= maxIndex);

      if (dotsHost) {
        $$('.carousel__dot', dotsHost).forEach((d, i) => {
          d.classList.toggle('is-active', i === index);
        });
      }
    };

    const go = (i) => {
      const maxIndex = Math.max(0, slides.length - perView);
      index = Math.min(Math.max(0, i), maxIndex);
      update();
    };

    if (prevBtn) prevBtn.addEventListener('click', () => go(index - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => go(index + 1));

    // touch drag
    let startX = 0, currentX = 0, dragging = false;
    track.addEventListener('pointerdown', (e) => {
      dragging = true;
      startX = e.clientX;
      track.style.transition = 'none';
      track.setPointerCapture?.(e.pointerId);
    });
    track.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      currentX = e.clientX - startX;
    });
    track.addEventListener('pointerup', () => {
      if (!dragging) return;
      dragging = false;
      track.style.transition = '';
      if (Math.abs(currentX) > 50) {
        go(index + (currentX < 0 ? 1 : -1));
      } else {
        update();
      }
      currentX = 0;
    });
    track.addEventListener('pointercancel', () => {
      dragging = false;
      track.style.transition = '';
      currentX = 0;
      update();
    });

    // recalc on resize
    let crsResize;
    window.addEventListener('resize', () => {
      clearTimeout(crsResize);
      crsResize = setTimeout(() => {
        const newPerView = getPerView();
        if (newPerView !== perView) {
          perView = newPerView;
          buildDots();
        }
        const maxIndex = Math.max(0, slides.length - perView);
        if (index > maxIndex) index = maxIndex;
        update();
      }, 100);
    });

    perView = getPerView();
    buildDots();
    update();
  });

  /* ---------- Catalog filter drawer (mobile) ---------- */
  const filterToggle = $('.catalog__filters-toggle');
  const filterPanel  = $('.filters');
  const filterClose  = $('.filters__close');

  if (filterToggle && filterPanel) {
    const openFilters = () => {
      filterPanel.classList.add('is-open');
      overlay?.classList.add('is-visible');
      document.body.classList.add('is-nav-open');
    };
    const closeFilters = () => {
      filterPanel.classList.remove('is-open');
      overlay?.classList.remove('is-visible');
      document.body.classList.remove('is-nav-open');
    };
    filterToggle.addEventListener('click', openFilters);
    if (filterClose) filterClose.addEventListener('click', closeFilters);
    overlay?.addEventListener('click', closeFilters);
  }

  /* ---------- Range slider value display ---------- */
  $$('.filters__range-input').forEach((input) => {
    const valueEl = input.parentElement?.querySelector('[data-range-value]');
    const sync = () => {
      if (valueEl) valueEl.textContent = `$${input.value}`;
    };
    input.addEventListener('input', sync);
    sync();
  });

  /* ---------- Variant selector ---------- */
  $$('.variants').forEach((group) => {
    const items = $$('.variant', group);
    items.forEach((v) => {
      v.addEventListener('click', () => {
        items.forEach((i) => i.classList.remove('is-active'));
        v.classList.add('is-active');
      });
    });
  });

  /* ---------- State tabs filter (about page grid) ---------- */
  const stateTabs = $$('.state-tab');
  const stateCards = $$('[data-state-card]');
  if (stateTabs.length && stateCards.length) {
    stateTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const filter = tab.dataset.filter;
        stateTabs.forEach((t) => {
          const active = t === tab;
          t.classList.toggle('is-active', active);
          t.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        stateCards.forEach((card) => {
          const show = filter === 'all' || card.dataset.state === filter;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }
})();
