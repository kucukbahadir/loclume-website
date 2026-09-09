# Loclume.com — Launch Checklist

🤖 = Claude, 👤 = Bahadır

## Vóór livegang
- [x] 🤖 Zero-build site: index + legal + 404
- [x] 🤖 NL hoofdtaal + EN woordenboek, taalkeuze in nav
- [x] 🤖 Self-hosted fonts (Manrope + Inter woff2)
- [x] 🤖 Cookie consent opt-in + GA gated
- [x] 🤖 JSON-LD (SoftwareApplication, Organization, WebSite, FAQPage)
- [x] 🤖 sitemap.xml, robots.txt (incl. AI crawlers), llms.txt
- [x] 🤖 .htaccess: 301 www→apex, security headers, cache, 404
- [x] 👤 Web3Forms access key aangemaakt → in `assets/js/config.js` (1 sep 2026)
- [x] 👤 Web3Forms e-mail geverifieerd (1 sep 2026)
- [x] 👤 info@loclume.com mailbox + Gmail-forwarder actief (MX/SPF live, 1 sep 2026)
- [x] 🤖 Deploy naar Hostinger (MCP static deploy, 1 sep 2026) — Git auto-deploy webhook nog te koppelen voor volgende releases

## Na livegang
- [x] 🤖 Live verificatie: ?v=1 ✓, www→apex 301 ✓, sitemap/robots/llms 200 ✓, CSP/HSTS/XCTO/XFO ✓, 404 ✓
- [x] 🤖 .htaccess bewijs-test: rewrite ✓ (www 301), ErrorDocument ✓ (eigen 404-pagina), mod_expires ✓ (img 6mnd / css 1wk / woff2 1jr)
- [x] 🤖 Formulier live getest → TEST-mail in inbox bevestigd (Gmail-forward 09:10, 1 sep 2026)
- [ ] 👤 Google Search Console (Domain property, DNS TXT) + sitemap indienen
- [ ] 👤 Bing Webmaster: Import from GSC
- [ ] 👤 GA4 property aanmaken → id in config.js (🤖 daarna deploy)
- [ ] 🤖 DNS check: SPF/DKIM/DMARC voor loclume.com
- [ ] 🤖 ops/uptime-check.sh: loclume.com|Loclume regel toevoegen (VPS cron, Telegram MonitorWeIntensify)
- [ ] 🤖 securityheaders.com → doel A/A+
- [x] 🤖 Site-review 9 sep 2026: Inter-subset (342→70 KB), icons/OG geoptimaliseerd, CSP-fix legal pages, cookie-banner alleen bij GA, animaties + scroll-spy, a11y. Lighthouse lokaal: mobiel 97/100/100/100, desktop 100/100/100/100 (bump v6)
- [ ] 👤 PageSpeed test in eigen Chrome na deploy (doel: mobiel 95+, desktop 100)
- [ ] 👤 Social preview checken (LinkedIn Post Inspector / opengraph.xyz) → `og-image.jpg` 1200×630
