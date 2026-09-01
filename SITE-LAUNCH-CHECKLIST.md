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
- [ ] 👤 Web3Forms access key aanmaken met info@loclume.com → in `assets/js/config.js`
- [ ] 👤 Web3Forms verificatiemail bevestigen (24u geldig!)
- [ ] 👤 info@loclume.com mailbox aanmaken (Hostinger) + forwarder naar Gmail
- [x] 🤖 Deploy naar Hostinger (MCP static deploy, 1 sep 2026) — Git auto-deploy webhook nog te koppelen voor volgende releases

## Na livegang
- [x] 🤖 Live verificatie: ?v=1 ✓, www→apex 301 ✓, sitemap/robots/llms 200 ✓, CSP/HSTS/XCTO/XFO ✓, 404 ✓
- [x] 🤖 .htaccess bewijs-test: rewrite ✓ (www 301), ErrorDocument ✓ (eigen 404-pagina), mod_expires ✓ (img 6mnd / css 1wk / woff2 1jr)
- [ ] 🤖 Formulier live testen → mail in inbox bevestigen (niet alleen API success!)
- [ ] 👤 Google Search Console (Domain property, DNS TXT) + sitemap indienen
- [ ] 👤 Bing Webmaster: Import from GSC
- [ ] 👤 GA4 property aanmaken → id in config.js (🤖 daarna deploy)
- [ ] 🤖 DNS check: SPF/DKIM/DMARC voor loclume.com
- [ ] 🤖 ops/uptime-check.sh: loclume.com|Loclume regel toevoegen (VPS cron, Telegram MonitorWeIntensify)
- [ ] 🤖 securityheaders.com → doel A/A+
- [ ] 👤 PageSpeed test in eigen Chrome (doel: mobiel 95+, desktop 100)
