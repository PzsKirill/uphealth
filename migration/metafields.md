# Product metafields — definitions + values

Content that doesn't fit Shopify's standard product fields lives in **metafields**.
Define these once under **Settings → Custom data → Products**, then fill per product.
The PDP (`product.json` template) and `product-card` snippet read them via Liquid
(`product.metafields.custom.<key>`).

## Definitions (namespace `custom`)

| Key | Type | Used by | Notes |
|-----|------|---------|-------|
| `benefits` | List of single-line text | PDP quick-benefits, card | 3 short benefit lines |
| `whats_inside` | List of single-line text | PDP accordion "What's inside" | bullet list |
| `how_to_take` | Rich text | PDP accordion "How to take" | |
| `composition` | Multi-line text | PDP accordion "Composition" | ingredient string |
| `nutrition` | JSON | PDP accordion "Nutrition" | `{calories,protein,carbs,fat,vitamin_c}` |
| `contraindications` | Multi-line text | PDP accordion + callout | |
| `servings` | Single-line text | PDP, card | e.g. "30 servings" |
| `state` | List of single-line text | filtering/labels | mirror of `state:*` tag (optional) |

> **Filtering** (Format / State / Price / diet tags) is driven by **tags**
> (`format:*`, `state:*`, `vegan`, `sugar-free`, `gluten-free`, `sale`) via the
> **Search & Discovery** app — no metafield needed for filters.
> **Rating** comes from the reviews app (Judge.me / Shopify Product Reviews), not a metafield.

## Values

### marine-collagen-gummies  (fully specified — template for the rest)
- **benefits**: `Firm, hydrated skin` · `Joints & bone support` · `Clean, sugar-free formula`
- **whats_inside**:
  - `5 g type I marine collagen peptides`
  - `Vitamin C for collagen synthesis`
  - `Hyaluronic acid for hydration`
  - `Silicon from bamboo extract`
  - `Inulin shell for absorption · natural cherry flavour`
- **how_to_take**: `Three gummies a day, any time — before or after food. Take daily for at least one month for a steady, cumulative result.`
- **composition**: `Cherry juice, water, marine collagen peptides, agar-agar, vitamin C, hyaluronic acid, bamboo extract (silicon), UpHealth peptide encapsulate (collagen peptides, inulin, gum arabic).`
- **nutrition**: `{ "calories": "36 kcal", "protein": "5 g", "carbs": "6.2 g", "fat": "0.04 g", "vitamin_c": "60 mg" }`
- **contraindications**: `Not recommended in case of allergy to fish or shellfish. Consult a professional if pregnant or nursing.`
- **servings**: `30 servings`
- **state**: `beauty`

### All other products
Same 8 keys, same shapes. Minimum to fill per SKU: `benefits` (3 lines),
`how_to_take`, `servings`, `state`. `whats_inside` / `composition` / `nutrition`
where known; leave empty otherwise (the section hides empty metafields).
