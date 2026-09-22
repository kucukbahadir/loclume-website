# Loclume.com — Launch Checklist

🤖 = Claude, 👤 = Bahadır. Open items are tracked as GitHub issues.

## Before launch
- [x] 🤖 Static site: home + legal + 404
- [x] 🤖 Dutch main language, English and Turkish on their own URLs (`/en/`, `/tr/`) with hreflang (22 Sep 2026)
- [x] 🤖 Self-hosted fonts (Manrope + Inter woff2)
- [x] 🤖 Cookie consent opt-in + GA gated
- [x] 🤖 JSON-LD (SoftwareApplication, Organization, WebSite, WebPage, FAQPage) per language
- [x] 🤖 sitemap.xml with hreflang, robots.txt (incl. AI crawlers), llms.txt
- [x] 🤖 .htaccess: 301 www→apex, security headers, cache, 404, clean URLs, no directory listing
- [x] 👤 Web3Forms access key in `assets/js/config.js` (1 Sep 2026)
- [x] 👤 Web3Forms email verified (1 Sep 2026)
- [x] 👤 info@loclume.com mailbox + Gmail forwarder active (MX/SPF live, 1 Sep 2026)
- [x] 🤖 Deploy to Hostinger (MCP static deploy, 1 Sep 2026)
- [x] 🤖 App-store pages: `/support/`, `/support/account-deletion/`, `/privacy` (22 Sep 2026)
- [x] 🤖 Copy checked against the app repository (PRODUCT.md): removed unverified claims (22 Sep 2026)
- [x] 🤖 CI: build check + release gate + staging (22 Sep 2026)

## After launch
- [x] 🤖 Live verification: ?v ✓, www→apex 301 ✓, sitemap/robots/llms 200 ✓, CSP/HSTS/XCTO/XFO ✓, 404 ✓
- [x] 🤖 .htaccess proof test: rewrite ✓, ErrorDocument ✓, mod_expires ✓
- [x] 🤖 Form tested live → TEST mail confirmed in inbox (1 Sep 2026)
- [ ] 👤 Google Search Console (Domain property, DNS TXT) + submit sitemap
- [ ] 👤 Bing Webmaster Tools: import from GSC
- [ ] 👤 GA4 property → id in config.js (🤖 then deploy)
- [x] 🤖 KvK 98895982 + VAT NL868691574B01 in imprint, privacy, terms, JSON-LD (22 Sep 2026)
- [x] 🤖 DNS: SPF, DKIM (Hostinger a/b/c + Brevo brevo1/brevo2), DMARC p=quarantine (22 Sep 2026)
- [ ] 👤 Brevo: click Authenticate for loclume.com (#25)
- [ ] 👤 Connect Hostinger Git auto-deploy (or keep the staged zip deploy)
- [ ] 🤖 ops/uptime-check.sh: add `loclume.com|Loclume` (VPS cron, Telegram MonitorWeIntensify)
- [ ] 👤 securityheaders.com + PageSpeed in your own Chrome (Hostinger CDN blocks headless)
