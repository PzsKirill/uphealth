---
name: shopify-integration
description: >-
  Actionable runbook for migrating the finished UpHealth prototype (8 themed
  product pages + outcome-pill catalogue) onto Shopify. Contains the exact
  metafield & metaobject definitions to create in admin, the per-product
  colour/price quick-reference (so the to-be-deleted theme-<slug> CSS blocks
  aren't lost), the section-by-section HTML→Liquid conversion map, the commerce
  model (pack variants + selling-plan subscriptions), catalogue→collections,
  required apps, performance rules and the go-live order. Use during the
  Shopify build, when creating custom-data definitions, wiring sections, or
  planning the migration. Pairs with the shopify-product-page skill (architecture
  + per-product colour system) and new-product-page (prototype generator).
---

# UpHealth → Shopify integration runbook

Goal: turn the prototype into **one** Shopify product template where each
product's content + colour comes from metafields, so a new product is "fill the
fields in admin", not code. Read alongside `shopify-product-page` (the colour
system + architecture). Single source of truth stays the prototype until the
template is live; then the `theme-<slug>` CSS blocks are deleted (their values
are preserved in §3 below).

---

## 1. Prerequisites — apps & access
- **Shopify access**: a dev/Partner store or staff invite; theme code access.
- **Subscriptions** → *Shopify Subscriptions* (free, first-party) for the
  "Subscribe & save 10%" selling plans. Alt: Recharge.
- **Reviews** → *Judge.me* or *Loox* — provides `rating_value` / `rating_count`
  metafields + review widget (replaces the 3 hardcoded reviews per page).
- **Bulk metafields** (optional) → *Matrixify* or CSV import — to bulk-create
  definitions/values instead of clicking each.
- **Bundles** (optional) → *Shopify Bundles* only if a SKU mixes different
  products (our 1/3-packs are plain variants, not bundles).

---

## 2. Colour & price quick-reference (the 8 built products)

Paste these into the `custom.accent` / `custom.bg` / `custom.ink` Color
metafields. `chart A/B` → the two chart line colours. These come from the
`body.theme-<slug>` blocks in `css/style.css` (delete those after migration).

| product | slug | accent | bg | ink | chart A / B | price (1) | format | outcome |
|---|---|---|---|---|---|---|---|---|
| Sea Moss | seamoss | `#2d585d` | `#d7eaed` | `#1f4347` | `#1f4347` / `#4f9d8e` | $28 | capsules | immune |
| High Energy | highenergy | `#e2691c` | `#fbe9d6` | `#3a2413` | `#b5500f` / `#e7a35a` | $30 | capsules | energy |
| Nitric Oxide | nitricoxide | `#b04e69` | `#fbe7eb` | `#3d2029` | `#b04e69` / `#4f8fcb` | $26 | capsules | strength |
| Whey Protein Isolate | wheyprotein | `#714525` | `#f5ead2` | `#3b2417` | `#714525` / `#c79a5a` | $44 | protein | strength |
| Plant Protein | plantprotein | `#6f9c3a` | `#eaf2d6` | `#2f3b1c` | `#527527` / `#a9764a` | $44.90 | protein | strength |
| L-Glutamine | lglutamine | `#7e5cab` | `#ece3f6` | `#3d2563` | `#5f4485` / `#e89274` | $29.90 | protein | strength |
| Creatine Hydration | creatine | `#3f72ab` | `#e4eff7` | `#2c4a6e` | `#2c5482` / `#ef8a7c` | $42 | drinks | strength |
| Hydration Powder | hydration | `#a9842a` | `#f7efc8` | `#3a3a16` | `#a9842a` / `#e0855f` | $24 | drinks | energy |

Brand fallback (no metafield): `--color-purple #74548e`, bg `#fefcf9`.

---

## 3. Metafield definitions (product) — namespace `custom`

Create once in *Settings → Custom data → Products*. Native fields stay native
(`title`, `description`, media, **variants**, tags). Content/long text below is
mostly already written in the `product-<slug>.html` files — extract at build time.

| key | type | feeds |
|---|---|---|
| `accent`, `bg` | Color | page palette (see shopify-product-page §4) |
| `ink`, `chart_b` | Color (opt) | text ink / 2nd chart line |
| `eyebrow` | single_line_text | "Capsules · Immune Support" |
| `lead` | multi_line_text | showcase intro paragraph |
| `benefits` | list.single_line_text | the 3 check-bullets |
| `note` | single_line_text | "60 capsules · ships 1–2 days · free shipping over $80" |
| `marquee_1`, `marquee_2` | list.single_line_text | the two running strips |
| `lab_eyebrow`, `lab_title` | single_line_text | science split #1 |
| `lab_text` | multi_line_text | science split #1 body |
| `lab_image` | file_reference | (or reuse a shared theme image) |
| `format_title` | single_line_text | "Sea moss in a new format" |
| `format_text` | multi_line_text | new-format body |
| `format_list` | list.single_line_text | the 2 "— …" lines |
| `format_image` | file_reference | new-format photo |
| `ingredients_title`, `ingredients_lead` | text | "What's inside?" heading |
| `ingredients` | list.metaobject → `ingredient_card` | 3 cards |
| `serving_size` | single_line_text | "2 Capsules (34 g)" |
| `servings` | number_integer | per container |
| `nutrition` | list.metaobject → `nutrition_row` | supplement-facts rows |
| `supp_note` | single_line_text | "** Daily Value not established." |
| `other_ingredients` | multi_line_text | the "Other Ingredients:" line |
| `warning` | rich_text (opt) | e.g. iron-overdose warning |
| `facts_side_title`, `facts_side_text` | text / multi_line | facts right column |
| `usage_title` | single_line_text | "When to take?" |
| `dose_num`, `dose_label` | single_line_text | "2" · "capsules · daily" |
| `usage_steps` | list.metaobject → `usage_step` | 3 steps |
| `chart_title` | single_line_text | chart heading |
| `chart_data` | json | 3 tabs × `{a[],b[],la,lb,title,text}` (simpler than metaobjects for arrays) |
| `faq` | list.metaobject → `faq_item` | accordion |
| `popup_title`, `popup_lead` | text | absorb popup head |
| `popup_core`, `popup_shell_tag`, `popup_core_tag` | single_line_text | diagram labels |
| `popup_points` | list.metaobject → `popup_point` | 3 points |
| `related` | list.product_reference (opt) | else use Shopify recommendations |
| `rating_value`, `rating_count` | (reviews app) | read-only |

Global (theme settings, not per-product): the FDA/DSHEA disclaimer, footer
compliance badges (already schema-driven in `footer.liquid`), brand fallback
colours.

---

## 4. Metaobject definitions

| metaobject | fields |
|---|---|
| `ingredient_card` | `icon` (single_line_text enum → theme maps to SVG), `name` (text), `subtitle` (text), `amount` (text), `text` (multi_line) |
| `nutrition_row` | `label` (text), `amount` (text), `dv` (text) |
| `usage_step` | `icon` (enum), `title` (text), `text` (multi_line) |
| `faq_item` | `question` (text), `answer` (rich_text) |
| `popup_point` | `title` (text), `text` (multi_line) |
| `palette` | `accent` (color), `bg` (color) — only for per-variant colour products |

**Icons**: ours are inline SVGs chosen per card. On Shopify use an **icon-key
enum** (e.g. `waves|leaf|root|spark|shield|drop|atom|pulse|clock|flame`) and map
key→SVG in the section snippet — avoids file uploads and keeps the SVG set in
the theme.

---

## 5. Section conversion map (HTML → Liquid)

Split `product-<slug>.html` into sections under `theme/sections/`, composed by
`templates/product.json`. Each reads `product.metafields.custom.*` and
`product.selected_or_first_available_variant`; repeatable blocks loop metaobjects.

| prototype block | → Liquid section | reads |
|---|---|---|
| colour inject snippet | `snippets/product-theme.liquid` | accent/bg/ink/chart_b |
| `.product-page` showcase | `product-showcase` | eyebrow, title, rating(app), lead, benefits, **variants** (packs/flavour), **selling plan** (subscribe), media gallery, note |
| `.marquee` ×2 | blocks in showcase or own section | marquee_1/2 |
| `.feature` (2 splits) | `product-science` | lab_* , format_* , popup trigger |
| `.ingredients` + `.supp-facts` | `product-ingredients` | ingredients[], serving_size, servings, nutrition[], supp_note, other_ingredients, warning |
| `.usage` | `product-usage` | usage_title, dose_*, usage_steps[] |
| `.chart-block` | `product-chart` | chart_title, chart_data(json), accent/chart_b |
| `.reviews` | reviews app embed | app |
| `.product-details` (FAQ) | `product-faq` | faq[] |
| `.product-line` (related) | `product-related` | recommendations or related[] |
| `#absorb-modal` | `snippets/product-popup.liquid` | popup_* |

Keep the bottom inline JS (gallery, popup, chart, add-proxy) as a theme asset.
The chart reads its datasets from `chart_data` JSON instead of an inline object.

---

## 6. Commerce — variants + selling plans (replaces JS pricing)
- **Packs (1 / 3)** → variant option `Pack` with real `price` + `compare_at_price`.
  The showcase reads the selected variant's price (`money` filter). The prototype's
  `data-pack-each` JS math is dropped.
- **Flavour** (where present) → a second variant option; combined `Pack × Flavour`.
- **Subscribe & save 10%** → a **selling plan group** (Shopify Subscriptions):
  10% off, deliver every 30 days. The toggle = selecting the plan; Shopify applies
  the discount and renders `−$X / delivery`.
- **Per-variant colour** (colour-coded flavours) → §4 of shopify-product-page.

---

## 7. Catalogue → collections + outcome filter
- `shop.html` outcome pills (`?state=energy…`) → **collections** (`state-energy`,
  …) or a `custom.outcome` product metafield + Shopify's filtering. The pill bar
  becomes links to the collections; cards render from products.
- The 6 outcomes already mirror `footer.liquid` links and the `data-state` taxonomy:
  `energy · immune · strength · focus · mood · sleep`.
- Product cards = standard collection grid; `data-format/state/tags/price` map to
  tags/metafields used by Shopify's native filters.

---

## 8. Performance / no-overload rules
- **One** product template; **zero** per-product code. Colour = ~14-line inline
  `<style>`, server-rendered → no extra request, no FOUC.
- `color-mix()` derives the palette → no preprocessor, no JS for the base colour.
- Reference metafields directly (`product.metafields.custom.*`) → no N+1; keep
  metaobject lists short (3 cards, 5 FAQ).
- Images → Shopify CDN, `image_url: width: 800` + native `loading="lazy"`.
  Consider replacing **slick** with a CSS scroll-snap gallery to drop jQuery+slick
  (~40 KB JS/page).
- Delete the 8 `theme-<slug>` CSS blocks once the metafield colour system is live.

---

## 9. Go-live order (pilot first, then fill-in)
1. Create all metafield + metaobject **definitions** (§3–4) and the selling-plan
   group + reviews app.
2. Build `snippets/product-theme.liquid` + the sections (§5) + `product.json`;
   remove `theme-<slug>` classes, keep `--color-*` fallbacks.
3. **Pilot one product** end-to-end (Sea Moss): fill metafields (colours from §2 +
   content from the HTML), set Pack variants + subscription, verify colour,
   content, price, gallery, chart, popup.
4. Once the pilot is right, the rest = **fill fields in admin** per product
   (colours from §2, content from each `product-<slug>.html`). No code.
5. Catalogue collections + filters; footer/header already themed.

After the pilot, adding any new product/colour is a few minutes in admin — that's
the whole point of the metafield-driven design.
