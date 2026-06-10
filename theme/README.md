# UpHealth — Shopify theme (skeleton)

Online Store 2.0 theme skeleton (hybrid approach). Built locally; preview later with
Shopify CLI once a dev store exists. The static site in the repo root is untouched.

## Structure
```
theme/
├── layout/theme.liquid          # shell: head, CSS-var injection from settings, section groups, scripts
├── config/
│   ├── settings_schema.json     # theme settings — Colours (pink/purple tokens), product bg
│   └── settings_data.json       # saved values + "UpHealth" preset
├── sections/
│   ├── header-group.json        # group → announcement-bar + header
│   ├── footer-group.json        # group → footer
│   ├── announcement-bar.liquid  # promo bar (.promo-bar)
│   ├── header.liquid            # logo, mega-menus, search (/search), wishlist, cart ({{ cart.item_count }})
│   ├── footer.liquid            # footer + cart-drawer + fav-drawer + overlay
│   └── hero-slider.liquid       # ★ POC section: schema + slide blocks (colour theme, image, ctas, stats)
├── templates/index.json         # home → hero-slider with the 5 colour slides
├── locales/en.default.json
└── assets/                      # reset.css, style.css, responsive.css, main.js, animations.js, bottle photos
```

## What's wired
- **Palette** comes from theme settings → emitted as `:root` CSS variables in `theme.liquid`, so the existing CSS works unchanged and colours are editable in the theme editor.
- **Header/footer** keep the exact classes/IDs, so `main.js` (sticky header, mega-menu hover, mobile drawer, **wishlist localStorage**, cart drawer, promo-bar dock) runs as-is.
- **Cart** count is live (`{{ cart.item_count }}`); search posts to `{{ routes.search_url }}`.
- **Hero** is a real editable section: add/remove/reorder slides, each with a colour theme (range = full-bleed image; pink/orange/blue/mint = gradient + product photo), eyebrow, heading, lead, two CTAs, chips and 3 stats. Falls back to the bundled bottle photos when no image is set.

## Preview (when ready)
1. Shopify Partner account → create a **development store**.
2. Install **Shopify CLI**: `npm i -g @shopify/cli @shopify/theme`.
3. From this folder: `shopify theme dev --store your-store.myshopify.com`.
4. Import `../migration/products.csv`, create the collections + metafields from `../migration/`.

> The hero loads Slick (jQuery) from CDN inside the section — fine for the skeleton;
> swap for a dependency-free slider in the full build.

## Next sections to convert (order from `migration/section-settings.md`)
marquee → featured-products → bonus-banner → benefits → perfect-day → scrolling-statement
→ video → loyalty-perks → video-reviews → logo-list, then `snippets/product-card`,
collection (native facets/sort/paginate) and product (metafields + Ajax cart).
