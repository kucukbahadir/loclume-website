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
- [ ] 🤖 Hostinger Git deploy koppelen (main → public_html) + auto-deployment aan

## Na livegang
- [ ] 🤖 Live verificatie: ?v=N, 301's, sitemap/robots/llms 200, security headers, 404
- [ ] 🤖 .htaccess bewijs-test: rewrite (403-test), ErrorDocument, mod_expires (2 typen)
- [ ] 🤖 Formulier live testen → mail in inbox bevestigen (niet alleen API success!)
- [ ] 👤 Google Search Console (Domain property, DNS TXT) + sitemap indienen
- [ ] 👤 Bing Webmaster: Import from GSC
- [ ] 👤 GA4 property aanmaken → id in config.js (🤖 daarna deploy)
- [ ] 🤖 DNS check: SPF/DKIM/DMARC voor loclume.com
- [ ] 🤖 ops/uptime-check.sh: loclume.com|Loclume regel toevoegen (VPS cron, Telegram MonitorWeIntensify)
- [ ] 🤖 securityheaders.com → doel A/A+
- [ ] 👤 PageSpeed test in eigen Chrome (doel: mobiel 95+, desktop 100)
