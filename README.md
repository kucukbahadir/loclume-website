# Loclume Website

Marketing site for [Loclume](https://loclume.com) — inventory verification that works alongside Stockitup. A WeIntensify B.V. brand.

## Stack

Zero-build static site: HTML + CSS + vanilla JS. No framework, no build step.

- `index.html` — main page (Dutch in HTML, English via `assets/js/i18n.js`)
- `privacy.html`, `cookies.html`, `terms.html` — bilingual legal pages (`data-legal-lang` blocks)
- `assets/js/config.js` — Web3Forms key, GA id, endpoints (single source)
- Fonts self-hosted (Manrope + Inter variable woff2), GDPR-clean
- Cookie consent is opt-in; GA loads only after statistics consent

## Workflow

- `develop` — integration branch
- `main` — production, auto-deployed to Hostinger (`public_html`) via Git deploy
- Cache busting: all CSS/JS references use `?v=N`; bump N on every asset change (index, privacy, cookies, terms, 404)
- CSP (`.htaccess`) allows **no inline scripts** except the one-liner `document.documentElement.classList.add("js")` in `index.html`, whitelisted by its sha256 hash. Change that script → recompute the hash (`echo -n '<script body>' | openssl dgst -sha256 -binary | base64`) and update `.htaccess`. All other JS lives in `assets/js/`.
- Fonts: `Inter-Variable.woff2` is a Latin + Latin-Extended subset (NL/EN/TR), optical-size axis pinned at 14 (342 KB → 70 KB). Regenerate from the upstream Inter variable font with `pyftsubset` if more glyphs are ever needed.
- Images: icons/logos are pre-sized (`favicon-32`, `apple-touch-icon`, `icon-192`, `loclume-mark-88`, `loclume-icon-104.webp`); content photos ship a `-600` variant for mobile via `srcset`; `og-image.jpg` is the 1200×630 social card.
- Cookie banner only appears when `gaId` in `config.js` is set (no tracking → nothing to consent to). Footer "Cookievoorkeuren" always works; legal pages link to `index.html#cookies`.

## Release

```bash
git checkout main && git merge develop && git push && git checkout develop
```

Then verify live: `curl -s https://loclume.com | grep '?v='`.
