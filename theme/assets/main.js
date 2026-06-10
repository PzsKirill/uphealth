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
