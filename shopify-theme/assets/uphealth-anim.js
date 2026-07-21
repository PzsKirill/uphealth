/* UpHealth — global scroll reveal (ported from prototype animations.js).
   Auto-targets brand components so sections don't need .reveal markup.
   No-flash: <html class="reveal-on"> is set inline before paint; this script
   reveals on scroll. Failsafe in the header reveals everything if this never runs. */
(function () {
  'use strict';
  window.__upAnim = true;

  var SEL = '.section-head, .up-card, .why-card, .day-card, .benefit, .tier, .stat, .ing-card, .ing-highlight, .reel, .srate__item, .story__visual, .story__body, .loyalty__card, .bonus__card, .gang__visual, .faq__item, [data-reveal]';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function run() {
    var els = document.querySelectorAll(SEL);
    if (!els.length) { document.documentElement.classList.add('reveal-done'); return; }

    // stagger items that sit in the same row/grid
    Array.prototype.forEach.call(els, function (el) {
      var p = el.parentNode;
      if (p && p.children && p.children.length > 1) {
        var i = Array.prototype.indexOf.call(p.children, el);
        if (i > 0) el.style.transitionDelay = (Math.min(i, 6) * 70) + 'ms';
      }
    });

    if (reduce || !('IntersectionObserver' in window)) {
      document.documentElement.classList.add('reveal-done');
      return;
    }

    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    Array.prototype.forEach.call(els, function (el) { io.observe(el); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
