# Colour tokens → theme settings

Our palette already lives in `:root` (`css/style.css`). On Shopify, expose these as
**`config/settings_schema.json`** color settings, then emit them as CSS variables in
`layout/theme.liquid` so the existing CSS keeps working unchanged:

```liquid
{%- comment -%} in theme.liquid <head> {%- endcomment -%}
<style>
  :root{
    --color-bg:{{ settings.color_bg }};
    --color-bg-alt:{{ settings.color_bg_alt }};
    --color-bg-card:{{ settings.color_bg_card }};
    --color-text:{{ settings.color_text }};
    --color-text-muted:{{ settings.color_text_muted }};
    --color-accent:{{ settings.color_accent }};
    --color-accent-soft:{{ settings.color_accent_soft }};
    --color-accent-deep:{{ settings.color_accent_deep }};
    --color-purple:{{ settings.color_purple }};
    --color-purple-deep:{{ settings.color_purple_deep }};
    --color-purple-soft:{{ settings.color_purple_soft }};
    --color-border:{{ settings.color_border }};
  }
</style>
```

| Token (`:root`) | settings_schema id | Type | Default | Role |
|-----------------|--------------------|------|---------|------|
| `--color-bg` | `color_bg` | color | `#fefcf9` | page background |
| `--color-bg-alt` | `color_bg_alt` | color | `#f3f0e9` | section bands |
| `--color-bg-card` | `color_bg_card` | color | `#ffffff` | cards |
| `--color-text` | `color_text` | color | `#1e2248` | ink / dark panels |
| `--color-text-muted` | `color_text_muted` | color | `#636f7f` | secondary text |
| `--color-accent` | `color_accent` | color | `#d65a92` | **pink** accent (links, eyebrows, marks) |
| `--color-accent-soft` | `color_accent_soft` | color | `#f6cfe0` | soft pink |
| `--color-accent-deep` | `color_accent_deep` | color | `#b23e72` | deep rose (overlays) |
| `--color-purple` | `color_purple` | color | `#74548e` | **buttons / promo / marquee / footer** |
| `--color-purple-deep` | `color_purple_deep` | color | `#5e4275` | button hover |
| `--color-purple-soft` | `color_purple_soft` | color | `#d9cee4` | soft purple |
| `--color-border` | `color_border` | color | `#e7e2d8` | hairlines |

Page-specific: product page background `#fbf1f6` → a section/template setting
(`product_bg`) rather than a global token.

> Gradients (`--grad-*`) stay in CSS (not worth exposing as settings). Group the
> color settings under a `"Colours"` header in `settings_schema.json`.
