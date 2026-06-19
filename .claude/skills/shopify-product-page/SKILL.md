---
name: shopify-product-page
description: >-
  Architecture and field spec for turning the UpHealth product prototype
  (product.html) into a reusable Shopify product template. Covers the
  metafield/metaobject data model, the per-product accent-color system
  (Color metafield -> CSS variables), the commerce model (flavour + pack
  variants and selling-plan subscriptions), and the product.html -> Liquid
  conversion plan. Use whenever building or editing the Shopify product page,
  defining custom data, wiring per-product theming, or syncing the prototype
  with the theme/ folder.
---

# UpHealth — Shopify product page architecture

Goal: replicate the rich, refeel-style product page (built in the prototype
`product.html`) as **one reusable Shopify product template** where every
product's content **and its accent colour** are filled in the admin via
metafields/metaobjects. No per-product code — the merchant only fills fields.

The prototype (`*.html` at repo root) and the theme (`theme/`) are kept in
sync by hand: change the prototype, mirror into `theme/assets/main.js`,
`theme/assets/style.css`, and the matching `theme/sections/*.liquid`.

---

## 1. Native vs custom data

Native product fields: `title`, `description`, media, price, **variants**,
tags. Everything else on the page is custom data via **metafields** (single
typed field per product) and **metaobjects** (reusable repeatable records),
surfaced in the theme either by reading `product.metafields.*` in Liquid or by
binding a section setting to a metafield ("connect dynamic source").

This is the WordPress ACF analogue: metafield ≈ ACF field, metaobject ≈ ACF
repeater/relationship, dynamic source ≈ field binding in the template.

---

## 2. Metafield spec (product) — namespace `custom`

| key | type | feeds block | notes |
|---|---|---|---|
| `accent_color` | Color | page accent | drives the whole palette via CSS vars (see §4) |
| `tagline` | single line text | under title | short marketing line |
| `benefits` | list · metaobject `benefit` | the 3 check-bullets | or list.single_line_text if no icons |
| `servings` | number_integer | "30 servings" | |
| `ships_note` | single line text | "ships in 1–2 days …" | |
| `whats_inside` | rich_text | accordion | |
| `how_to_take` | rich_text | accordion | |
| `composition` | rich_text **or** list · metaobject `nutrition_row` | accordion / nutrition table | |
| `contraindications` | rich_text | accordion | |
| `faq` | list · metaobject `faq` | FAQ accordion | |
| `outcome` | list · single_line_text (or metaobject ref) | Energy/Sleep/… filters | mirror of catalog taxonomy |
| `rating_value`, `rating_count` | provided by reviews app | "4.9 · 1240 reviews" | read-only, set by Judge.me/Loox |

Keep the namespace consistent (`custom`). Define once in
**Settings → Custom data → Products**; the fields then appear on every product.

---

## 3. Metaobjects

- `benefit` — `{ icon: file, text: single_line }`
- `faq` — `{ question: single_line, answer: rich_text }`
- `nutrition_row` — `{ label: single_line, amount: single_line, daily_value: single_line }` (optional)
- `palette` — `{ accent: color, accent_deep: color, accent_soft: color }` (optional, for sharing one palette across products, e.g. per outcome)

Reference them from the product via a `list.metaobject_reference` metafield and
loop in Liquid.

---

## 4. Per-product colour — metafields → CSS variables (optimised)

This **replaces** the prototype's hardcoded `body.theme-<slug>` blocks — one
~25-line CSS block per product in `css/style.css` (`theme-seamoss`,
`theme-highenergy`, … eight so far). Those do NOT scale on Shopify: every new
product/colour would mean editing + redeploying theme code and growing the
global stylesheet (the "overload" risk). On Shopify the colour comes from
**product metafields**, injected as CSS variables, **server-rendered** (no
flash/FOUC), with **zero theme code per product**.

### Inputs — 2–3 Color metafields, not 12 hand-typed values
The merchant picks a couple of colours; CSS derives the rest with `color-mix()`.

| metafield | type | role |
|---|---|---|
| `custom.accent` | Color | brand colour — buttons, marquee, active states, chart line A |
| `custom.bg` | Color | soft matte page background |
| `custom.ink` | Color (opt) | dark text; if empty, derived from accent |
| `custom.chart_b` | Color (opt) | second chart line (e.g. coral) |

### Inject (product template / snippet) — derives the full `--color-*` palette
Scope vars to the product wrapper so the shared header/footer keep brand
colours; put the page background on `body.template-product`.

```liquid
{%- liquid
  assign accent = product.metafields.custom.accent | default: settings.brand_accent
  assign bg     = product.metafields.custom.bg     | default: settings.brand_bg
-%}
<style>
  body.template-product { background: {{ bg }}; }
  #product-{{ product.id }} {
    --color-accent: {{ accent }}; --color-purple: {{ accent }};
    --color-accent-soft: color-mix(in srgb, {{ accent }} 22%, white);
    --color-purple-soft: color-mix(in srgb, {{ accent }} 22%, white);
    --color-accent-deep: color-mix(in srgb, {{ accent }} 70%, black);
    --color-purple-deep: color-mix(in srgb, {{ accent }} 70%, black);
    --color-border:      color-mix(in srgb, {{ accent }} 20%, white);
    --color-bg: {{ bg }};
    --color-bg-alt:  color-mix(in srgb, {{ bg }}, black 7%);
    --color-bg-card: color-mix(in srgb, {{ bg }} 35%, white);
    {%- if product.metafields.custom.ink != blank %}
    --color-text: {{ product.metafields.custom.ink }};
    {%- else %}
    --color-text: color-mix(in srgb, {{ accent }} 72%, black);
    {%- endif %}
    --color-text-muted: color-mix(in srgb, var(--color-text) 55%, {{ bg }});
  }
</style>
```

Components already read `var(--color-purple, …)` etc., so an empty metafield
degrades to the brand defaults in `css/style.css`. Chart strokes come from the
metafields too: `stroke="{{ accent }}"` and
`stroke="{{ chart_b | default: '#e89274' }}"` (also pass `chart_b` to the chart
JS via a `data-` attribute).

### Several colours on one product (per-variant)
For a product whose variants are colour-coded (e.g. the teal/pink/blue/orange
Berberine lineup), store a palette per variant and swap on selection — the
server renders the first variant's colour (no flash); JS only switches live:

- `palette` metaobject `{ accent: color, bg: color }`, referenced per variant
  (variant metafield) or as an ordered `list.metaobject` on the product.
- emit them as one JSON blob and update the vars on variant `change`:

```js
const palettes = {{ variant_palettes_json }};   // { "<variantId>": {accent,bg} }
form.addEventListener('change', (e) => {
  const p = palettes[e.target.value]; if (!p) return;
  const root = document.getElementById('product-{{ product.id }}');
  root.style.setProperty('--color-accent', p.accent);
  root.style.setProperty('--color-purple', p.accent);
  root.style.setProperty('--color-bg', p.bg);
  document.body.style.background = p.bg;
});
```

The eight built products' exact accent/bg/ink/chart hexes are catalogued in the
**`shopify-integration`** skill — extract them there before deleting the
`theme-<slug>` blocks.

---

## 5. Commerce model — variants & selling plans (NOT JS pricing)

The prototype computes pack/subscription prices in JS (`SUB_RATE`, pack
`data-pack-each`). That is **prototype-only**. On the real store the price must
come from Shopify or the cart total won't match checkout.

- **Flavour** (Cherry/Mango/Berry) → product **variant option**.
- **Packs** (1 bottle / 3 bottles) → variant option `Pack` with its own
  `price` + `compare_at_price` (or Shopify Bundles). Theme shows the selected
  variant's price; never recompute in JS.
- **"Subscribe & save 10%"** → **Selling Plan** via **Shopify Subscriptions**
  (free, first-party) or **Recharge**. The toggle = choosing the selling plan;
  the discount is applied by Shopify. Theme renders the selling-plan group.
- **Reviews / rating** → Judge.me or Loox; they expose the rating metafields
  read in §2.

---

## 6. Conversion plan — product.html → Liquid

Currently `theme/sections/` has only announcement-bar, hero-slider, header,
footer. The product page exists only as the static `product.html`. To make it
a real Shopify template:

1. Split `product.html` into sections under `theme/sections/`:
   `product-showcase` (gallery + title + rating + benefits + variants + packs +
   subscribe + buy), `product-details` (accordion), `product-reviews`,
   `product-related`.
2. Each section reads `product.metafields.*` and
   `product.selected_or_first_available_variant`; repeatable blocks loop over
   metaobjects.
3. Add a `templates/product.json` that composes those sections.
4. Bind plain text settings to metafields via dynamic sources where natural;
   read metaobjects directly in Liquid loops.
5. Keep `theme/assets/main.js` / `style.css` mirrored with the prototype.

---

## 7. Conventions

- CSS vars: page palette `--product-accent` / `-soft` / `-deep`,
  `--product-bg-tint`; always with a brand fallback `var(--…, var(--color-purple…))`.
- Metafield namespace: `custom` everywhere.
- Prices via Shopify, formatted with the `money` filter — not hand-rolled.
- Prototype ↔ theme stay in sync on every change.

---

## 8. Open roadmap

1. ✅ Baseline field spec (this doc).
2. Map the three refeel pages block-by-block to confirm the section list before
   freezing the schema:
   - https://refeel.ru/d3k2gummies_lemon
   - https://refeel.ru/protein_sachet
   - https://refeel.ru/collagen_gummies
3. Convert `product.html` → Liquid sections reading the metafields above.
4. Create the metafield/metaobject **definitions** in Shopify admin.
5. Wire variants (flavour × pack) + Selling Plans + Judge.me.
