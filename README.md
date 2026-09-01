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
- Cache busting: all CSS/JS references use `?v=N`; bump N on every asset change

## Release

```bash
git checkout main && git merge develop && git push && git checkout develop
```

Then verify live: `curl -s https://loclume.com | grep '?v='`.
