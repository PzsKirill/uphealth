# Placeholders

This folder is reserved for replacement media (images, video, 3D) when they're
ready. While in placeholder mode, all media is rendered via CSS gradients —
see the `--grad-*` tokens in [`/css/style.css`](../../css/style.css).

## Where placeholders are used

| Element                         | Token / class                                 |
|---------------------------------|-----------------------------------------------|
| Hero visual                     | `--grad-hero` / `.hero__media`                |
| Featured product — gummies      | `--grad-gummies` / `.product-card__media--gummies` |
| Featured product — protein     | `--grad-protein` / `.product-card__media--protein` |
| State cards (icons + bullets)  | `--grad-energy` / `--grad-sleep` / `--grad-relax` / `--grad-beauty` / `--grad-strength` |
| Loyalty coin                    | `--grad-energy`                               |
| Showcase main + thumbs          | `--grad-gummies`                              |
| Wellness test visual            | `--grad-wellness`                             |
| Mega-menu featured image        | `--grad-protein`                              |

## Replacing a placeholder with a real asset

1. Drop the file into this folder (e.g. `hero-bottle.jpg`).
2. In `style.css`, swap the gradient on the target class for a `background-image`:
   ```css
   .hero__media {
     background: url('../assets/placeholders/hero-bottle.jpg') center / cover no-repeat;
   }
   ```
3. Keep the existing `aspect-ratio` and `border-radius` on the element so the
   layout doesn't shift.
