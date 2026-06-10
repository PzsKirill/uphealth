# Shopify migration — content package

This folder is the **source of truth** for moving the local UpHealth site onto
Shopify. It is platform-agnostic prep: usable regardless of which theme build we pick.
Approach decided: **hybrid** — an Online Store 2.0 skeleton of our own, borrowing
Dawn's proven commerce snippets (cart drawer, predictive search, facets).

## Files
| File | Purpose |
|------|---------|
| `products.csv` | Importable product catalog (Admin → Products → Import). 12 products; Marine Collagen Gummies has 3 flavour variants. |
| `metafields.md` | Product metafield definitions + values (content beyond standard fields). |
| `section-settings.md` | Every site block → Shopify section/blocks/settings mapping. |
| `color-tokens.md` | `:root` palette → `settings_schema` color settings. |

## Tag taxonomy (drives collections + filters)
- **Format**: `format:sticks` · `format:gummies` · `format:drinks` · `format:protein` · `format:bundles`
- **State**: `state:energy` · `state:sleep` · `state:relax` · `state:beauty` · `state:strength`
- **Diet / flags**: `vegan` · `sugar-free` · `gluten-free` · `sale` · `new` · `hit` · `bundle`

## Collections to create
- `all` (default)
- Format smart collections: `sticks`, `gummies`, `drinks`, `protein`, `bundles` (rule: tag = `format:<x>`)
- State smart collections: `state-energy`, `state-sleep`, `state-relax`, `state-beauty`, `state-strength` (rule: tag = `state:<x>`)
- `sale` (tag `sale`), `new` (tag `new`)

## Filters (Search & Discovery app)
Format (tag) · State (tag) · Price (range) · Diet (tags vegan / sugar-free / gluten-free).
→ replaces our `catalog.js`; sorting via `?sort_by=`, pagination via `{% paginate by 9 %}`.

## Apps needed (non-native)
- Reviews/rating → Judge.me or Shopify Product Reviews
- Loyalty / 500 points → Smile.io (or similar)
- Wishlist → app, or port our localStorage version as a stopgap

## Caveats
- `products.csv` `Image Src` currently points at local `assets/…` paths. Shopify import
  needs **public URLs**, or attach images to products after import. We have 5 shared
  bottle photos — real per-SKU images recommended before launch.
- Content names differ between pages (home/about cards vs catalog). Catalog (these 12)
  is canonical; home/about "featured" rows should pull from **collections**, not
  bespoke names — normalize during theme build.

## Phased plan
0. **Content package** (this folder) — done first. ✅
1. Theme skeleton: `layout/theme.liquid`, `config/{settings_schema,settings_data}.json`,
   `assets/` (our css/js), header/footer section groups, `templates/index.json`.
2. Convert sections → `.liquid` + `{% schema %}` (home first), `snippets/product-card`,
   `snippets/price`. Reuse CSS/JS as assets.
3. Collection (native facets/sort/paginate), product (metafields), cart (Ajax API).
4. Apps (reviews, loyalty, wishlist), navigation/linklists, `settings_data.json`.

## Preview later
No dev store yet. When ready: create a Shopify Partner account → development store →
install **Shopify CLI** → `shopify theme dev` to preview this theme against the store.
