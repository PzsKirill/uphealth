# Section → Shopify schema map

Each current `<!-- SECTION: … -->` block becomes one `sections/<name>.liquid` with a
`{% schema %}`. Repeatable items become **blocks** (add / remove / reorder in the theme
editor). Below: what becomes a **setting**, a **block**, or stays **static** (markup-only).

## Home  (`templates/index.json` lists these in this order)

| # | Section file | Settings | Blocks (type → fields) |
|---|--------------|----------|------------------------|
| 1 | `hero-slider.liquid` | autoplay, speed, autoplay_speed | `slide` → eyebrow, heading, lead, cta1_text, cta1_url, cta2_text, cta2_url, image, colour_theme (range/pink/orange/blue/mint) |
| 2 | `marquee.liquid` | speed, background | `item` → text |
| 3 | `featured-products.liquid` ("Loved by our community") | heading, collection, products_to_show, show_load_more, load_more_url | — (renders `product-card` from collection) |
| 4 | `marquee.liquid` (reuse) | — | `item` → text |
| 5 | `bonus-banner.liquid` | heading, text, button_text, button_url, media (video/image), badge_text | — |
| 6 | `benefits.liquid` ("Why UpHealth?") | heading, lead | `card` → image, chip_label, number, description |
| 7 | `perfect-day.liquid` | eyebrow, heading, more_text, more_url | `day` → time_label, product **or** title+price+url, image/colour |
| 8 | `scrolling-statement.liquid` (bigtext) | speed | `phrase` → text (with `<em>` highlight) |
| 9 | `video.liquid` ("Science…") | eyebrow, heading, text, video_url, poster | — |
| 10 | `marquee.liquid` (reuse) | — | `item` → text |
| 11 | `loyalty-perks.liquid` ("Wellness gang") | eyebrow, heading, lead, perks_title, button_text, button_url, image | `perk` → label, text |
| 12 | `video-reviews.liquid` ("People are talking") | heading | `reel` → video_url, poster, author, label, duration |
| 13 | `logo-list.liquid` ("In the press") | heading | `logo` → text, url |

## Product  (`templates/product.json`)
- `main-product.liquid` — gallery (product.images), title, price (`price` snippet), rating (reviews app block), `benefits` (metafield), variant picker (product.options), qty + Ajax add-to-cart, `showcase__note` (setting).
- `product-details.liquid` (collapsible) — blocks: `What's inside` / `How to take` / `Composition & nutrition` / `Contraindications`, each reading its metafield (hide if empty).
- `product-reviews.liquid` — reviews app section.
- `featured-products.liquid` (reuse) — "Related" via collection/recommendations.

## Collection  (`templates/collection.json`) — catalog
- `main-collection.liquid` — toolbar (count, `collection.sort_options`), **native facets** (`collection.filters`) sidebar with Apply, grid of `product-card`, native `{% paginate by 9 %}`.
- → replaces `catalog.js` (filter/sort/pagination move server-side).

## Pages (about / faq / delivery / bonuses)
- `templates/page.about.json`, `page.faq.json`, etc. — compose from sections:
  reuse `benefits`, `scrolling-statement`, `video`, `loyalty-perks`, `marquee`,
  `logo-list`, plus `rich-text` / `collapsible-content` (FAQ) sections.

## Header / footer  (section groups)
- `sections/header-group.json` → `announcement-bar` (promo text setting), `header`
  (logo, **linklist** nav + mega-menu blocks, search, wishlist, cart).
- `sections/footer-group.json` → `footer` (linklist columns, social link settings,
  big marquee text, legal). **No "Careers" link** (removed).
