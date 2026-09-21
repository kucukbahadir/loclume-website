# Loclume Website

Marketing site for [Loclume](https://loclume.com) — inventory verification that works alongside Stockitup. A WeIntensify B.V. brand.

## Stack

Static site: HTML + CSS + vanilla JS, no framework and no runtime dependencies. A small Node script
prerenders the language versions, so every language has its own indexable URL.

| URL | Source |
| --- | --- |
| `/` (Dutch) | `index.html` — hand-edited source of the home page |
| `/en/`, `/tr/` | generated from `index.html` + `tools/i18n-pages.json` |
| `/privacy.html`, `/cookies.html`, `/terms.html` | generated from `tools/content/<page>.<lang>.html` (NL/EN/TR switch on one URL) |
| `/support/`, `/support/account-deletion/` | same, from `tools/content/support.*` and `account-deletion.*` (required by the Play Store / App Store listing) |
| `/privacy`, `/cookies`, `/terms` | clean-URL rewrites in `.htaccess` |

Other files:

- `assets/js/i18n.js` — runtime strings (menu labels, form messages, hero demo) + language preference and first-visit browser-language redirect (never for crawlers)
- `assets/js/app.js` — nav, scroll-spy, reveal, cookie consent, contact form (Web3Forms), hero scan demo
- `assets/js/legal.js` — language switch on the document pages
- `assets/js/config.js` — Web3Forms key, GA id (single source)
- Fonts are self-hosted (Manrope + Inter variable woff2). Cookie consent is opt-in; GA loads only after statistics consent, and the banner only appears once a GA id is configured.

## Commands

```bash
node tools/build.mjs          # regenerate /en/, /tr/, JSON-LD and the document pages
node tools/verify.mjs         # release gate: links, SEO, hreflang, i18n coverage, CSP, sitemap
node tools/serve.mjs          # local preview on :8641 with the production headers (CSP) and rewrites
bash tools/stage.sh           # clean dist/ + dist.zip with public files only
```

CI (`.github/workflows/verify.yml`) runs the build check, the release gate and the staging step on every push and PR.

## Editing content

1. Dutch copy: edit `index.html`. Every translatable element carries `data-i18n="key"` (or `data-i18n-attr="attr:key"`).
2. English/Turkish: edit the same key in `tools/i18n-pages.json`.
3. Legal/support text: edit `tools/content/*.html`.
4. Run `node tools/build.mjs && node tools/verify.mjs`.
5. When CSS/JS changes, bump `?v=N` in `index.html` (the build copies it to every page).

Product claims must match the app repository (`kucukbahadir/Loclume`, `PRODUCT.md`): no invented benchmarks, testimonials or customer logos.

## Workflow

- `develop` — integration branch; `main` — production
- Deploy: `bash tools/stage.sh`, then upload `dist.zip` to Hostinger (static deploy of `public_html`). Once the Hostinger Git auto-deploy is connected, `.htaccess` also blocks repository-only paths as a safety net.
- Verify live: `curl -s https://loclume.com | grep -o '?v=[0-9]*' | sort -u`
