# UpHealth — frontend layout

Static HTML / CSS / Vanilla JS implementation of a wellness storefront, built
to the structure of refeel.ru. Single-page (`index.html`) — multi-page split
can be lifted from [`sitemap.md`](sitemap.md) when needed.

## Stack

- HTML5, semantic
- CSS3 — variables, `clamp()`, grid, flexbox, `backdrop-filter`, keyframes
- Vanilla JS, no dependencies
- BEM naming, mobile-first base + desktop-first responsive overrides

## Structure

```
/
├── index.html
├── sitemap.md
├── css/
│   ├── reset.css
│   ├── style.css
│   └── responsive.css
├── js/
│   ├── main.js          # menu, tabs, accordion, sticky, cart
│   └── animations.js    # IntersectionObserver reveals, parallax
└── assets/
    ├── placeholders/    # README on how to swap gradients for real media
    └── icons/
```

## Sections on the homepage

Block order mirrors the live refeel.ru homepage, adapted to UpHealth. Each block
is a self-contained, commented section (`<!-- SECTION: … -->`) that maps 1:1 to a
Shopify theme section — edit, reorder or delete a section without touching the rest.

| # | Section (CSS root) | Shopify section equivalent | Edit by |
|---|--------------------|----------------------------|---------|
| 1 | Promo bar + Header (`partials.js`) | header group | `js/partials.js` |
| 2 | Hero slider (`.hero`) | `hero-slider` | one `.hero__slide` per block; palette via `--slide-*` |
| 3 | Marquee (`.marquee`) | `marquee` | change the repeated phrase |
| 4 | Community products (`.product-line`) | `featured-collection` | add/remove a `.product-card` |
| 5 | Marquee | `marquee` | — |
| 6 | Bonus banner (`.bonus`) | `image-with-text` | heading / text / button |
| 7 | Why UpHealth (`.why`) | `benefits-3up` | 3 `.why-card` (hover reveal) |
| 8 | Formula for the perfect day (`.perfect-day`) | `perfect-day` | 3 `.day-card` (Morning/Day/Evening) |
| 9 | Big statement (`.bigtext`) | `scrolling-statement` | the repeated line |
| 10 | Science video (`.science`) | `video` | swap `<source>`/`poster` |
| 11 | Marquee | `marquee` | — |
| 12 | Wellness gang (`.gang`) | `loyalty-perks` | checklist `.perks__item`s |
| 13 | Video reviews (`.reels`) | `video-reviews` | one `.reel` per carousel slide |
| 14 | Press (`.press-strip`) | `logo-list` | wordmark text per `<li>` |
| 15 | Footer (`partials.js`) | footer group | `js/partials.js` |

### Colour scheme

Palette lives entirely in `:root` (`css/style.css`). Change it there and the whole
site re-skins:

- `--color-bg` `#fefcf9` warm white · `--color-bg-card` `#ffffff`
- `--color-accent` `#005eeb` primary blue (all primary buttons / links)
- `--color-purple` `#74548e` brand purple (marquees + footer bands)
- `--color-text` `#1e2248` deep-indigo ink · `--color-text-muted` `#636f7f`

### Video sources

The two video blocks (science band + review reels) pull free-licence stock clips
from the Mixkit CDN (`https://assets.mixkit.co/videos/<id>/<id>-720.mp4`), each with
a matching `poster` thumbnail so the layout stays intact if a clip is slow or
blocked. Swap the `<source>`/`poster` URLs to use your own footage.

## Run

Open `index.html` directly in a browser, or serve the folder:

```powershell
python -m http.server 8080
# then visit http://localhost:8080
```

## Notes

- All media is placeholder gradients (`--grad-*` in `style.css`). Swap them
  out per [`assets/placeholders/README.md`](assets/placeholders/README.md).
- No backend, no forms submit, no real cart logic — it's a UI shell.
- Breakpoints: 1200 / 1024 / 900 / 640 / 380 px.
- Reduced motion is respected — reveals and parallax disable on
  `prefers-reduced-motion: reduce`.
