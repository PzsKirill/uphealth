/* ============================================================
   animations.js — scroll-driven reveals
   Uses IntersectionObserver; falls back gracefully if unsupported.
   ============================================================ */

(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('.reveal');

  if (!targets.length) return;

  // Reduced motion: just show everything
  if (reduceMotion || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  targets.forEach((el) => observer.observe(el));

  /* ---------- Parallax-ish for hero media ---------- */
  const heroMedia = document.querySelector('.hero__media');
  if (heroMedia && !reduceMotion) {
    let raf = null;
    const update = () => {
      const rect = heroMedia.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const offset = (window.innerHeight / 2 - center) * 0.05;
      heroMedia.style.transform = `translateY(${offset.toFixed(2)}px)`;
      raf = null;
    };
    window.addEventListener(
      'scroll',
      () => { if (raf === null) raf = requestAnimationFrame(update); },
      { passive: true }
    );
    update();
  }

  /* ---------- Counters (data-counter on scroll into view) ---------- */
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const animate = (el) => {
      const target = parseFloat(el.dataset.counter) || 0;
      const duration = parseInt(el.dataset.counterDuration, 10) || 1400;
      const decimals = parseInt(el.dataset.counterDecimals, 10) || 0;
      const start = performance.now();

      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const value = target * eased;
        el.textContent = decimals > 0
          ? value.toFixed(decimals)
          : Math.round(value).toLocaleString();
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (reduceMotion) {
      counters.forEach((el) => {
        const target = parseFloat(el.dataset.counter) || 0;
        const decimals = parseInt(el.dataset.counterDecimals, 10) || 0;
        el.textContent = decimals > 0 ? target.toFixed(decimals) : Math.round(target).toLocaleString();
      });
    } else {
      const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach((el) => counterObserver.observe(el));
    }
  }

  /* ---------- Active TOC link on scroll ---------- */
  const tocLinks = document.querySelectorAll('.toc__link');
  if (tocLinks.length) {
    const sections = [];
    tocLinks.forEach((link) => {
      const id = link.getAttribute('href')?.replace('#', '');
      const el = id && document.getElementById(id);
      if (el) sections.push({ el, link });
    });

    if (sections.length && 'IntersectionObserver' in window) {
      const tocObs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const item = sections.find((s) => s.el === entry.target);
          if (item && entry.isIntersecting) {
            tocLinks.forEach((l) => l.classList.remove('is-active'));
            item.link.classList.add('is-active');
          }
        });
      }, { rootMargin: '-30% 0px -60% 0px' });
      sections.forEach((s) => tocObs.observe(s.el));
    }
  }
})();
