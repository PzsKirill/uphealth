---
name: shopify-store-ops
description: >-
  Connect to the live UpHealth Shopify store from any computer and operate it
  the way this project has been run: Shopify CLI theme auth, Admin API tokens
  via client-credentials grant, theme pull/push, the hero slider (art-directed
  cover/split slides), rich product pages (custom.content JSON metafield +
  universal template), outcome collections, info pages, image prep, and the
  verification "backtests" to confirm each change. Use whenever someone needs to
  link up to the store, deploy a theme change, roll out product content, or hand
  the project to a new operator. Contains ready-to-run scripts in ./scripts and
  points to PROJECT-GUIDE.md / MIGRATION.md for deeper detail.
---

# UpHealth Shopify — store operations & connection

Operational runbook for working on the **live UpHealth store** from a fresh
machine. Everything here has been used on this project. Read `PROJECT-GUIDE.md`
(architecture) and `MIGRATION.md` (how the store was built) for background.

> **Golden rules**
> 1. **Never commit secrets.** Tokens and client secrets go in
>    `.shopify-secrets/` (gitignored) — never in the repo or chat.
> 2. **On Windows, `curl` works but Python's `urllib`/`requests` fail TLS**
>    (NordVPN Threat Protection MITM). Do API calls with `curl`, image work with
>    Pillow. `convert` on Windows is the disk tool, NOT ImageMagick.
> 3. **Pull before you push, push only what you changed** (`--only <file>`), so
>    theme-editor changes made by others aren't clobbered.

## The stores

| | Value |
|---|---|
| Live store (commercial) | `dtgmp1-n7.myshopify.com` |
| Custom domain | `uphealth.life` |
| Live theme | **UpHealth `#138480713934`** (Shopify Horizon base + `uphealth-*` sections) |
| Old dev store (reference, retiring) | `uphealth-nqs6iukl.myshopify.com`, theme `#199451771221` |
| Admin API app | `uphealth-migration` (Dev Dashboard, legacy install flow, client-credentials grant) |

The dev store is a **development store** and can NOT be converted to a paid plan
— that's why the commercial store `dtgmp1-n7` exists. Do product/commerce work
on `dtgmp1-n7`.

## 0 · One-time setup on a new computer

1. **Git Bash + Shopify CLI.** CLI ≥ 4.5 (`shopify version`). Install:
   `npm install -g @shopify/cli` (needs Node 18+).
2. **Clone the repo** — you get this skill, `PROJECT-GUIDE.md`, `MIGRATION.md`,
   `product-content/` (product JSON) and the theme backup under `shopify-theme/`.
3. **Staff access to the store.** The store owner must invite you: Shopify admin
   → Settings → Users and permissions → Add staff (permissions: **Themes**,
   **Products**; add **Apps** if you'll manage the API app). Accept the email
   invite. Without this, CLI theme auth won't see the store.
4. **Python + Pillow** for image prep: `python -m pip install pillow`.
5. **Admin API credentials** — see §1b. Put them in `.shopify-secrets/`
   (create the folder; it must be gitignored — see the bottom of this file).

## 1 · Connect

### a) Shopify CLI (themes) — browser auth, no token

```bash
shopify theme list --store dtgmp1-n7.myshopify.com
```

First run opens a browser to log in (use your staff account). Lists themes;
confirm `UpHealth #138480713934` is there.

### b) Admin API token (products, metafields, collections, pages, files)

Shopify moved custom apps into the **Dev Dashboard**. The app
`uphealth-migration` already exists. To get a token you use the
**client-credentials grant** (the install redirect goes to a placeholder URL and
is NOT how you get the token).

Prereqs (one-time, done by whoever owns the app):
- App has **"Use legacy install flow"** enabled and is **installed** on
  `dtgmp1-n7` (Redirect URL `https://example.com` whitelisted).
- API scopes: `read_products, write_products, read_content, write_content,
  read_files, write_files, read_publications, write_publications`.

Get the app's **Client ID** and **Client secret** (Dev Dashboard → app →
Overview) and save them locally (NEVER commit):

```
.shopify-secrets/credentials.txt
  line 1: dtgmp1-n7.myshopify.com
  line 2: <client_id>        (32-hex)
  line 3: <client_secret>    (shpss_…)
```

Then mint a token (valid **24h** — re-run when it expires):

```bash
bash .claude/skills/shopify-store-ops/scripts/mint-token.sh \
  .shopify-secrets/credentials.txt > .shopify-secrets/token.txt
```

`400 app_not_installed` → the app isn't installed on the store yet (do the
install step). Same-org only: the app and store must be in the same Shopify org.

## 2 · Theme workflow

The live theme content (section settings, page templates) lives ON Shopify.
**Pull first**, edit, push only changed files.

```bash
# pull the files you'll touch into a working dir
shopify theme pull --store dtgmp1-n7.myshopify.com --theme 138480713934 \
  --path work --only sections/uphealth-hero.liquid --only templates/index.json

# ...edit them...

# push back ONLY what you changed
shopify theme push --store dtgmp1-n7.myshopify.com --theme 138480713934 \
  --path work --allow-live --nodelete \
  --only sections/uphealth-hero.liquid --only templates/index.json
```

- `--allow-live` is required (the theme is published).
- `--nodelete` + `--only` prevents wiping anything you didn't intend.
- For a full safety copy: `shopify theme pull … --path shopify-theme` (whole theme).
- Templates like `templates/index.json` are JSON with a leading `/* */` comment —
  strip it before `json.loads`, keep it when writing back.

## 3 · Hero slider (`sections/uphealth-hero.liquid`)

Self-contained Slick slider, block type `slide`. Two layouts per slide:
- **split** — text left, product cutout right (used for the brand/intro slide).
- **cover** — designer banner full-bleed, copy overlaid left (product slides).

Art direction by width (breakpoint **900px**), via `<picture>`:
- `asset` = narrow image (1.75:1, shown **<900px**), height **730px**.
- `asset_wide` = wide image (2.4:1, shown **≥900px**), height **600px**.
- `object-position: right bottom` keeps the jar in the bottom-right corner.
- Per-slide colours match the jar: `text_color` = label text hue, `accent_color`
  = brand-tag hue (drives badge, title `<em>`, and CTA).

Images go in `assets/` (theme files), referenced by filename. Prep them with
`scripts/resize-hero.py` (Pillow, ~2400–2800px wide, JPG). Slide config lives in
`templates/index.json` under section `hero`.

## 4 · Rich product pages

Each product's whole page comes from **one JSON metafield `custom.content`**
(type `json`) rendered by section `uphealth-product-universal`, with the product
assigned the **`universal`** template. Payloads live in `product-content/`
(one file per product handle). Per-product accent colours come from
`content.colors` in that JSON.

Roll out with:

```bash
python .claude/skills/shopify-store-ops/scripts/apply-content.py
```

It fetches products, matches `product-content/<handle>.json` to store products
(exact handle first, then the alias map inside the script for Supliful's
renamed handles), sets `custom.content`, and switches the template to
`universal`. Edit the `ALIAS` map in the script when handles differ.

Schema of the JSON, icon vocabulary, and the label-accuracy checklist are in
`PROJECT-GUIDE.md §5`. **Numbers (Supplement Facts, doses, warnings) must be
verified against the real label — never invented.**

## 5 · Outcome collections

10 **smart** collections, membership by product tag `goal:*`
(`energy, immune, strength, focus, mood, sleep, metabolic, liver, joint,
beauty`). The catalogue "PICK AN OUTCOME" pills and the quiz link to them.
Handles + rules are created by `scripts/` during migration; to add a product to
an outcome just add its `goal:<x>` tag. See `MIGRATION.md` Phase 4 and memory.

## 6 · Info pages

7 pages (`about, contact, ingredients, delivery, bonuses, faq, wellness-test`).
Their content lives in the theme templates `templates/page.*.json`; the page
**objects** just need to exist with the matching `template_suffix`. Create via
Admin API `POST /pages.json` (see `scripts/` history) or in admin
(Content → Pages → set Theme template).

## 7 · Images

Resize/compress with **Pillow**, never Windows `convert`:

```bash
python .claude/skills/shopify-store-ops/scripts/resize-hero.py \
  "in.png" assets/out.jpg 2600
```

Upload as theme assets by pushing them (`--only assets/out.jpg`). For store media
(Content → Files) use the admin or the Files API (`write_files`).

## 8 · Verification ("backtests")

After every change, confirm it landed. `scripts/verify.py` runs the standard
checks: product count, how many are on the `universal` template, a
`custom.content` spot-check, and collection product counts. Manual web checks:

```bash
# domain points to the store + serves our theme (theme;desc=138480713934)
curl -sI https://uphealth.life/ | grep -iE "powered-by|location|theme"
# a product page renders (needs admin login / store password if gated)
# https://dtgmp1-n7.myshopify.com/products/<handle>?preview_theme_id=138480713934
```

Preview a theme without publishing: append `?preview_theme_id=138480713934`
(be logged into admin; turn OFF NordVPN or Cloudflare may 403 the VPN IP).

## Gotchas (all hit on this project)

- **NordVPN breaks Python TLS** → `SSL: CERTIFICATE_VERIFY_FAILED`. Use `curl`
  for API calls. Chrome cert errors on new domains are also NordVPN — disable
  Threat Protection before diagnosing.
- **Windows `convert` ≠ ImageMagick** (it's the disk-format tool). Use Pillow.
- **Pack variant titles must start with a number** (`3 bottles · …`) — price/unit
  math splits on the leading number.
- **Lock store currency (USD) before the first sale** — Supliful fulfils from the US.
- **Enable auto-fulfillment** (Settings → Checkout → Order processing) or orders
  never reach Supliful.
- **Admin API token expires in 24h** — re-mint from the client credentials.
- **Dev store can't go paid** — commerce happens on `dtgmp1-n7`, not the dev store.
- **Two heights / two images** in the hero swap at 900px; don't "fix" one without
  the other.

## Reference pointers

- `PROJECT-GUIDE.md` — architecture, product templates, JSON schema, icon list,
  label checklist, responsibilities split.
- `MIGRATION.md` — how `dtgmp1-n7` was built phase by phase (theme → products →
  metafields → collections → pages → commerce → domain).
- `product-content/` — the 55 product JSON payloads.
- `shopify-theme/` — full theme backup (git-versioned).

## Secrets hygiene

Ensure `.gitignore` contains:

```
.shopify-secrets/
.shopify/
```

`.shopify-secrets/` holds `credentials.txt` and `token.txt`. If a secret is ever
committed or pasted anywhere shared, **rotate it** (Dev Dashboard → app →
regenerate client secret) immediately.
