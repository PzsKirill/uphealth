---
name: new-product-page
description: >-
  Scaffold a new UpHealth product landing page in the static prototype by
  cloning the structure of product-seamoss.html / product-highenergy.html —
  identical section layout, but product-specific copy, per-product colour
  theme, images, prices and chart data. ALWAYS also adds a matching product
  card to the shop.html catalogue that links to the new page. Use whenever the
  user asks to create / add a new product page (e.g. "create a page for <X>
  bottle", "add product <X>"), or to keep a product page consistent with the
  template.
---

# New UpHealth product page (prototype)

Goal: from a single bottle/product, produce a new `product-<slug>.html` whose
**structure is identical** to the existing template, with **all text rewritten**
for that product, a **per-product colour theme** taken from the bottle, and a
matching **catalogue card** in `shop.html` that links to the page.

Two reference pages already exist — clone whichever is closest, then rewrite:

- `product-seamoss.html` — teal theme, Sea Moss (capsules, immune).
- `product-highenergy.html` — orange theme, High Energy / Berberine (metabolic).

Pages live at the repo root and load the shared `css/style.css`, `js/main.js`
(`initProductBuy`), `js/partials.js` (header/footer), `js/animations.js`, plus
jQuery + slick from CDN. The components are already in `css/style.css`; a new
page only needs its own **theme block** added there.

---

## Section order (must match exactly)

1. Breadcrumbs (`Home / Shop / <Category> / <Product>`).
2. `.product-page` showcase — **slick gallery** (`.gallery` + `.gallery-nav`) on
   the left; right column: eyebrow, `h1` title, rating, lead, `.showcase__benefits`,
   **`.packs` (1 bottle / 3 bottles)**, `.subscribe`, `.showcase__buy`, note.
   ⚠️ There is **no Format/variant block** any more — do not add one.
3. `.marquee` (#1).
4. `.feature` — two `.feature-split` rows: lab story (`newavatar.png`) with a
   **`[data-absorb-open]`** button, and a "new format" row with a
   **`[data-add-proxy]`** Add-to-cart.
5. `.ingredients` — 3 `.ingredient-card`s + `.supp-facts` panel + FDA fine-print.
6. `.usage` — "When to take?" dose + 3 steps.
7. `.marquee` (#2).
8. `.chart-block` — 3 `.chart-tab`s + SVG line chart.
9. `.reviews` (3 cards).
10. `.product-details` — FAQ accordion.
11. `.product-line` — related products.
12. `#absorb-modal` — the popup opened from step 4.
13. Scripts: partials → main → animations → jQuery → slick → inline block
    (gallery slick, absorb modal, add-proxy, chart). **Copy this block verbatim**;
    only the chart `data{}` and the two line colours change.

---

## Recipe

1. **Clone** `product-seamoss.html` → `product-<slug>.html`.
2. Set `<body data-page="product" class="theme-<slug>">` and `<title>`.
3. **Add a theme block** to `css/style.css` (see template below), recoloured from
   the bottle: a soft, matte background + a bright accent. Mirror it to
   `theme/assets/style.css` for parity (the theme has no product page, so it's
   inert there, but keep the stylesheets in sync).
4. **Rewrite every text** (see checklist) — structure stays, words change.
5. **Recolour the chart** in 3 places (HTML polyline `stroke`, the two
   `.chart-legend__sw` inline `background`, and the JS `drawDots(..., '<hex>')`).
6. **Images**: main + gallery from `assets/image/realproduct/<slug>N.png`
   (or `assets/image/png/…`). Keep `id="gallery-main"` on the first slide.
7. **Add the catalogue card** to `shop.html` (template below) as the first child
   of `#catalog-grid`, linking to `product-<slug>.html`. Bump the count in two
   places: the toolbar `#catalog-count` and the hero "<N> products in stock".
8. **Verify** with a headless screenshot: body bg = the theme colour, gallery
   has 2 arrows + slides, chart renders, modal opens, and the catalogue card
   appears + links correctly.

---

## Theme block template (recolour, then paste into css/style.css)

Scope every override to `main` so the shared header/footer keep brand colours.
Pick `--color-bg` = soft matte tint of the bottle; `--color-purple` /
`--color-accent` = the bottle's bright accent; keep text dark & readable.

```css
/* <Product> product page — <colour-name> scheme */
body.theme-<slug>,
body.theme-<slug>[data-page="product"] { background: <BG>; }   /* soft matte */
.theme-<slug> main {
  --color-bg: <BG>;
  --color-bg-alt: <BG-deeper>;
  --color-bg-card: <near-white tint>;
  --color-text: <dark warm/cool ink>;
  --color-text-muted: <muted ink>;
  --color-accent: <ACCENT>;
  --color-accent-soft: <ACCENT-soft>;
  --color-accent-deep: <ACCENT-deep>;
  --color-purple: <ACCENT>;          /* primary/CTA + marquee bg */
  --color-purple-deep: <ACCENT-deep>;
  --color-purple-soft: <ACCENT-soft>;
  --color-border: <hairline>;
}
.theme-<slug> .showcase__grid { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
.theme-<slug> .showcase__gallery { min-width: 0; }
```

`body.theme-<slug>[data-page="product"]` is required — it out-specifies the
existing `body[data-page="product"]{ background:#fbf1f6 }` rule.

Worked palettes:
- **Sea Moss (teal):** bg `#d7eaed`, accent `#2d585d` / deep `#1d3b3f` / soft `#bcd7d9`, ink `#1f4347`, chart `#1f4347` + `#4f9d8e`.
- **High Energy (orange):** bg `#fbe9d6`, accent `#e2691c` / deep `#b5500f` / soft `#f6d2b2`, ink `#3a2413`, chart `#b5500f` + `#e7a35a`.

---

## Catalogue card template (insert first inside #catalog-grid in shop.html)

```html
              <article class="product-card product-card--compact reveal" data-format="<format>" data-state="<outcome>" data-tags="<tags>" data-price="<N>" data-rating="<R>" data-date="<D>" data-popular="0">
                <a href="product-<slug>.html" class="product-card__media" style="background: var(--grad-<outcome>);" aria-hidden="true"><img src="assets/image/realproduct/<slug>1.png" alt="" loading="lazy" />
              <img class="product-card__img--hover" src="assets/image/realproduct/<slug>2.png" alt="" loading="lazy" /></a>
                <button class="product-card__fav" aria-label="Add to favorites"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7-4.5-9.5-9C1 8.5 3.5 5 7 5c2 0 3.5 1 5 3 1.5-2 3-3 5-3 3.5 0 6 3.5 4.5 7-2.5 4.5-9.5 9-9.5 9z"/></svg></button>
                <div class="product-card__body">
                  <span class="product-card__badge product-card__badge--new">New</span>
                  <span class="product-card__rating"><span class="product-card__stars">★★★★★</span> <R></span>
                  <h3 class="product-card__title"><Product></h3>
                  <p class="product-card__desc"><short desc></p>
                  <div class="product-card__footer">
                    <div class="product-card__price"><span class="product-card__price-now">$<N></span><span class="product-card__price-old">$<old></span></div>
                    <a href="product-<slug>.html" class="btn btn--primary btn--sm">Order</a>
                  </div>
                </div>
              </article>
```

Card data attributes (drive the catalogue's outcome-pill filter + sort):
- `data-state` — outcome: `energy|immune|strength|focus|mood|sleep`. Makes the
  card show under that pill (`shop.html?state=…`). Match `--grad-<outcome>`.
- `data-format` — `sticks|gummies|drinks|protein|bundles|gift|capsules`.
- `data-tags` — space-separated: `vegan sugar-free gluten-free sale`.
- `data-price` / `data-rating` / `data-date` (newness) / `data-popular`
  (`0` = sorts first under "Popular").

After inserting, bump both counters in shop.html: `<strong id="catalog-count">`
and the hero `<strong>…</strong> products in stock`.

---

## Per-product content checklist (rewrite all of these)

- `<title>`, meta description, breadcrumb category + name.
- Eyebrow (`<Category> · <Outcome>`), `h1` title, rating count, lead paragraph.
- 3 `.showcase__benefits` lines.
- `.packs`: per-bottle `data-pack-each` for 1- and 3-bottle, the `.pack__now` /
  `.pack__old` prices, and the subscribe saving (`data-subscribe-price`, JS
  recomputes on load) + `.showcase__note` (count · shipping).
- `.feature` copy: lab-story eyebrow/title/text; new-format title + the two
  `.feature-split__list` lines; new-format image.
- 3 `.ingredient-card`s (name, latin, mg amount, blurb) + a fitting icon each.
- `.supp-facts` rows (serving size, each ingredient + amount + %DV, other
  ingredients) — mirror the real label.
- `.usage` dose number + label + 3 steps.
- Two `.marquee` track item sets (duplicated for the seamless loop).
- `.chart-block` title + 3 tab labels + the JS `data{}` (3 datasets, each with
  `a`,`b` arrays, `la`,`lb` legend labels, `title`, `text`) + line colours.
- 3 reviews, score + count; FAQ Q&A (include the safety/caution items);
  related-product cards; absorb-popup title/lead/diagram labels + 3 points.

---

## Gotchas

- Body class **must** equal the theme slug, and the theme block must use
  `body.theme-<slug>[data-page="product"]` for the background.
- Chart colours live in **3 spots** — keep them in sync.
- Keep `id="gallery-main"` on the first gallery slide (cart thumbnail) and
  `infinite:false` on the slick gallery (avoids duplicate-id clones).
- Do **not** re-add a Format/variant block (it was removed from all product pages).
- The bottom inline `<script>` is shared boilerplate — only chart data/colours
  change; everything else (slick, modal, add-proxy) stays identical.
- For the real Shopify build, prices/packs/subscription must come from variants +
  selling plans, not this JS — see the `shopify-product-page` skill.
