/* ============================================================
   catalog.js — shop page: filter (apply button) + sort + pagination
   Pure client-side prototype; maps cleanly onto Shopify collection
   filtering/sorting/pagination later. Guarded — only runs on /shop.
   ============================================================ */

(function () {
  'use strict';

  const grid = document.getElementById('catalog-grid');
  if (!grid) return;

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  const cards      = $$('.product-card', grid);
  const countEl    = document.getElementById('catalog-count');
  const emptyEl    = document.getElementById('catalog-empty');
  const pagerEl    = document.getElementById('pagination');
  const sortSel    = document.getElementById('catalog-sort');
  const priceInput = document.getElementById('filter-price');
  const rangeValue = $('[data-range-value]');
  const filtersEl  = document.getElementById('filters');
  const overlay    = document.getElementById('overlay');

  const PER_PAGE = 9;
  let page = 1;
  let sort = sortSel ? sortSel.value : 'popular';
  let applied = { format: new Set(), state: new Set(), tag: new Set(), maxPrice: Infinity };

  const num = (card, key) => parseFloat(card.dataset[key]) || 0;

  /* ---------- Read the (staged) filter controls ---------- */
  function readControls() {
    const groups = { format: new Set(), state: new Set(), tag: new Set() };
    $$('.filters__checkbox:checked').forEach((cb) => {
      const g = cb.dataset.filterGroup;
      if (groups[g]) groups[g].add(cb.dataset.filterValue);
    });
    const maxPrice = priceInput ? parseInt(priceInput.value, 10) : Infinity;
    return { ...groups, maxPrice };
  }

  /* ---------- Does a card pass the applied filters? ---------- */
  function matches(card) {
    if (applied.format.size && !applied.format.has(card.dataset.format)) return false;
    if (applied.state.size && !applied.state.has(card.dataset.state)) return false;
    if (applied.tag.size) {
      const tags = (card.dataset.tags || '').split(/\s+/);
      if (!tags.some((t) => applied.tag.has(t))) return false;
    }
    if (num(card, 'price') > applied.maxPrice) return false;
    return true;
  }

  /* ---------- Sort comparators ---------- */
  function sortList(list) {
    const cmp = {
      'popular':    (a, b) => num(a, 'popular') - num(b, 'popular'),
      'new':        (a, b) => num(b, 'date') - num(a, 'date'),
      'price-asc':  (a, b) => num(a, 'price') - num(b, 'price'),
      'price-desc': (a, b) => num(b, 'price') - num(a, 'price'),
      'rating':     (a, b) => num(b, 'rating') - num(a, 'rating')
    }[sort] || (() => 0);
    return list.slice().sort(cmp);
  }

  /* ---------- Build the pagination control ---------- */
  function buildPager(pages) {
    if (!pagerEl) return;
    if (pages <= 1) { pagerEl.innerHTML = ''; return; }

    const arrow = (d) => d === 'prev'
      ? '<path d="m15 6-6 6 6 6"/>'
      : '<path d="m9 6 6 6-6 6"/>';
    let html = `<button class="pagination__btn" data-page="prev" ${page === 1 ? 'disabled' : ''} aria-label="Previous page"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8">${arrow('prev')}</svg></button>`;
    for (let i = 1; i <= pages; i++) {
      html += `<button class="pagination__btn ${i === page ? 'is-active' : ''}" data-page="${i}" ${i === page ? 'aria-current="page"' : ''}>${i}</button>`;
    }
    html += `<button class="pagination__btn" data-page="next" ${page === pages ? 'disabled' : ''} aria-label="Next page"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8">${arrow('next')}</svg></button>`;
    pagerEl.innerHTML = html;
  }

  /* ---------- Render: filter → sort → reorder → paginate ---------- */
  function render() {
    const matched = sortList(cards.filter(matches));
    const others  = cards.filter((c) => !matched.includes(c));

    // Reflect sort order in the DOM (grid renders in source order)
    matched.forEach((c) => grid.appendChild(c));
    others.forEach((c) => grid.appendChild(c));

    const pages = Math.max(1, Math.ceil(matched.length / PER_PAGE));
    if (page > pages) page = pages;
    const start = (page - 1) * PER_PAGE;

    cards.forEach((c) => { c.style.display = 'none'; });
    matched.slice(start, start + PER_PAGE).forEach((c) => {
      c.style.display = '';
      c.classList.add('is-visible'); // skip the reveal fade for paged-in cards
    });

    if (countEl) countEl.textContent = matched.length;
    if (emptyEl) emptyEl.hidden = matched.length > 0;
    buildPager(pages);
  }

  function scrollToTop() {
    const top = grid.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  /* ---------- Apply / reset ---------- */
  function applyFilters() {
    applied = readControls();
    page = 1;
    render();
    // close the mobile filter drawer if open
    if (filtersEl && filtersEl.classList.contains('is-open')) {
      filtersEl.classList.remove('is-open');
      overlay && overlay.classList.remove('is-visible');
      document.body.classList.remove('is-nav-open');
    }
  }

  function resetFilters() {
    $$('.filters__checkbox').forEach((cb) => { cb.checked = false; });
    if (priceInput) {
      priceInput.value = priceInput.max;
      if (rangeValue) rangeValue.textContent = '$' + priceInput.max;
    }
    applied = { format: new Set(), state: new Set(), tag: new Set(), maxPrice: Infinity };
    page = 1;
    render();
  }

  /* ---------- Wire up ---------- */
  $('#filters-apply')?.addEventListener('click', applyFilters);
  $('#filters-reset')?.addEventListener('click', resetFilters);
  $('#catalog-empty-reset')?.addEventListener('click', resetFilters);

  if (sortSel) {
    sortSel.addEventListener('change', () => { sort = sortSel.value; page = 1; render(); });
  }

  if (pagerEl) {
    pagerEl.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-page]');
      if (!btn || btn.disabled) return;
      const val = btn.dataset.page;
      const pages = Math.max(1, Math.ceil(cards.filter(matches).length / PER_PAGE));
      if (val === 'prev') page = Math.max(1, page - 1);
      else if (val === 'next') page = Math.min(pages, page + 1);
      else page = parseInt(val, 10) || 1;
      render();
      scrollToTop();
    });
  }

  /* ---------- Pre-apply a filter from the URL ----------
     Lets links land on the catalog with a filter already selected:
       ?cat=gift   (mega-menu Gift cards, format/tag links)
       ?state=energy (mega-menu outcome pills, footer, hero CTAs) */
  const params  = new URLSearchParams(location.search);
  const preVal  = params.get('state') || params.get('cat');
  const preCb   = preVal && $(`.filters__checkbox[data-filter-value="${preVal}"]`);
  if (preCb) {
    preCb.checked = true;
    applyFilters();          // reads the now-checked control + renders
  } else {
    render();
  }
})();
