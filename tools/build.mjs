#!/usr/bin/env node
// Prerenders the language versions of the home page.
//   index.html (Dutch) is the hand-edited source.
//   tools/i18n-pages.json holds the English and Turkish strings, keyed by data-i18n / data-i18n-attr.
// Output: en/index.html, tr/index.html, plus the JSON-LD block inside all three pages.
// It also builds the trilingual document pages (privacy, cookies, terms, support) from
// tools/content/<page>.<lang>.html fragments, so they all share one template.
// Usage: node tools/build.mjs          write files
//        node tools/build.mjs --check  exit 1 when a generated file is out of date
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "https://loclume.com";
const LANGS = ["nl", "en", "tr"];
const PATH = { nl: "/", en: "/en/", tr: "/tr/" };
const LOCALE = { nl: "nl_NL", en: "en_GB", tr: "tr_TR" };
const MARKUP_KEYS = new Set(["ck.text", "ct.note"]);

const DICT = JSON.parse(readFileSync(join(ROOT, "tools/i18n-pages.json"), "utf8"));

const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = s => esc(s).replace(/"/g, "&quot;");
const decode = s => s.replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

function str(lang, key) {
  const v = DICT[lang] && DICT[lang][key];
  if (v == null) throw new Error(`missing ${lang} string: ${key}`);
  return v;
}

// Replace the inner HTML of every element carrying data-i18n (depth-aware, no nested-tag surprises).
function replaceKeyed(html, value) {
  const open = /<([a-z][a-z0-9]*)\b[^>]*\sdata-i18n="([^"]+)"[^>]*>/gi;
  let out = "", pos = 0, m;
  while ((m = open.exec(html))) {
    const [tagOpen, tag, key] = m;
    const innerStart = m.index + tagOpen.length;
    const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, "gi");
    re.lastIndex = innerStart;
    let depth = 1, t, innerEnd = -1;
    while ((t = re.exec(html))) {
      if (t[1]) { if (--depth === 0) { innerEnd = t.index; break; } } else if (!t[0].endsWith("/>")) depth++;
    }
    if (innerEnd < 0) throw new Error(`unclosed <${tag} data-i18n="${key}">`);
    const v = value(key, html.slice(innerStart, innerEnd));
    out += html.slice(pos, innerStart) + v;
    pos = innerEnd;
    open.lastIndex = innerEnd;
  }
  return out + html.slice(pos);
}

function faqFromHtml(html) {
  const q = {}, a = {};
  for (const m of html.matchAll(/data-i18n="faq\.q(\d+)">([\s\S]*?)<\/span>/g)) q[m[1]] = decode(m[2]);
  for (const m of html.matchAll(/data-i18n="faq\.a(\d+)">([\s\S]*?)<\/div>/g)) a[m[1]] = decode(m[2]);
  return Object.keys(q).sort((x, y) => x - y).map(n => ({
    "@type": "Question", name: q[n], acceptedAnswer: { "@type": "Answer", text: a[n] }
  }));
}

function jsonLd(lang, html) {
  const url = ORIGIN + PATH[lang];
  const graph = [
    {
      "@type": "SoftwareApplication",
      "@id": ORIGIN + "/#app",
      name: "Loclume",
      url,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web, Android, iOS",
      image: ORIGIN + "/assets/img/og-image.jpg",
      inLanguage: lang,
      description: str(lang, "ld.desc"),
      offers: { "@type": "Offer", price: "30.00", priceCurrency: "EUR", description: str(lang, "ld.offer") },
      publisher: { "@id": ORIGIN + "/#org" }
    },
    {
      "@type": "Organization",
      "@id": ORIGIN + "/#org",
      name: "Loclume",
      url: ORIGIN + "/",
      logo: ORIGIN + "/assets/img/loclume-mark.png",
      email: "info@loclume.com",
      parentOrganization: {
        "@type": "Organization",
        name: "WeIntensify B.V.",
        url: "https://weintensify.com/",
        vatID: "NL868691574B01",
        identifier: { "@type": "PropertyValue", propertyID: "KvK", value: "98895982" },
        address: { "@type": "PostalAddress", streetAddress: "Kanaalkade 57", postalCode: "1811 LS", addressLocality: "Alkmaar", addressCountry: "NL" }
      }
    },
    { "@type": "WebSite", "@id": ORIGIN + "/#website", name: "Loclume", url: ORIGIN + "/", inLanguage: LANGS },
    { "@type": "WebPage", "@id": url + "#page", url, name: decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/)[1]), inLanguage: lang, isPartOf: { "@id": ORIGIN + "/#website" }, about: { "@id": ORIGIN + "/#app" } },
    { "@type": "FAQPage", "@id": url + "#faq", inLanguage: lang, mainEntity: faqFromHtml(html) }
  ];
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2).replace(/</g, "\\u003c");
  return `<!-- ld:start -->\n<script type="application/ld+json">\n${json}\n</script>\n<!-- ld:end -->`;
}

function render(src, lang) {
  let html = src;
  if (lang !== "nl") {
    html = html.replace(/<html lang="nl">/, `<html lang="${lang}">`);
    html = replaceKeyed(html, key => (MARKUP_KEYS.has(key) ? str(lang, key) : esc(str(lang, key))));
    html = html.replace(/(<[^>]*\sdata-i18n-attr="([^"]+)"[^>]*>)/g, tag => {
      const spec = tag.match(/data-i18n-attr="([^"]+)"/)[1];
      for (const pair of spec.split(";")) {
        const [attr, key] = pair.split(":");
        const re = new RegExp(`(\\s${attr}=")[^"]*(")`);
        if (!re.test(tag)) throw new Error(`attribute ${attr} missing for ${key}`);
        tag = tag.replace(re, `$1${escAttr(str(lang, key))}$2`);
      }
      return tag;
    });
    // Legal pages open in the visitor's language
    html = html.replace(/href="\/(privacy|cookies|terms)\.html"/g, `href="/$1.html#${lang}"`);
    html = html.replace(/href="\/support\/"/g, `href="/support/#${lang}"`);
  }
  // Self-referencing URLs and Open Graph locales
  html = html.replace(/(<(?:link|meta)\b[^>]*?(?:href|content)=")[^"]*("[^>]*\sdata-self-url>)/g, `$1${ORIGIN}${PATH[lang]}$2`);
  html = html.replace(/(<meta property="og:locale" content=")[^"]*(" data-og-locale>)/, `$1${LOCALE[lang]}$2`);
  const alts = LANGS.filter(l => l !== lang).map(l => LOCALE[l]);
  let ai = 0;
  html = html.replace(/(<meta property="og:locale:alternate" content=")[^"]*(" data-og-locale-alt>)/g, (_, a, b) => a + alts[ai++] + b);
  // Current language in the switcher
  html = html.replace(/(<a [^>]*data-lang-link="(\w+)")( aria-current="true")?/g, (_, a, l) => (l === lang ? `${a} aria-current="true"` : a));
  // Structured data
  html = html.replace(/<!-- ld:start -->[\s\S]*?<!-- ld:end -->/, () => jsonLd(lang, html));
  return html;
}

// ---------- Document pages (legal + support), one URL each with an NL/EN/TR switch ----------
const V = (src => src.match(/style\.css\?v=(\d+)/)[1])(readFileSync(join(ROOT, "index.html"), "utf8"));
const DOCS = [
  { out: "privacy.html", src: "privacy", url: "/privacy.html", robots: "noindex,follow",
    title: { nl: "Privacyverklaring", en: "Privacy Statement", tr: "Gizlilik Bildirimi" },
    desc: { nl: "Privacyverklaring van Loclume (website en app), een merk van WeIntensify B.V.", en: "Privacy statement of Loclume (website and app), a WeIntensify B.V. brand.", tr: "Loclume gizlilik bildirimi (web sitesi ve uygulama), bir WeIntensify B.V. markası." } },
  { out: "cookies.html", src: "cookies", url: "/cookies.html", robots: "noindex,follow",
    title: { nl: "Cookieverklaring", en: "Cookie Statement", tr: "Çerez Bildirimi" },
    desc: { nl: "Cookieverklaring van loclume.com.", en: "Cookie statement of loclume.com.", tr: "loclume.com çerez bildirimi." } },
  { out: "terms.html", src: "terms", url: "/terms.html", robots: "noindex,follow",
    title: { nl: "Algemene voorwaarden", en: "Terms and Conditions", tr: "Kullanım Koşulları" },
    desc: { nl: "Algemene voorwaarden van Loclume, een merk van WeIntensify B.V.", en: "Terms and conditions of Loclume, a WeIntensify B.V. brand.", tr: "Loclume kullanım koşulları, bir WeIntensify B.V. markası." } },
  { out: "support/index.html", src: "support", url: "/support/", robots: "index,follow",
    title: { nl: "Support", en: "Support", tr: "Destek" },
    desc: { nl: "Hulp bij Loclume: tellen, inloggen, scanners en privacy. Mail info@loclume.com, we reageren doorgaans binnen één werkdag.", en: "Help with Loclume: counting, sign-in, scanners and privacy. Email info@loclume.com, we usually reply within one business day.", tr: "Loclume desteği: sayım, giriş, tarayıcılar ve gizlilik. info@loclume.com adresine yaz, genellikle bir iş günü içinde yanıt veririz." } },
  { out: "support/account-deletion/index.html", src: "account-deletion", url: "/support/account-deletion/", robots: "noindex,follow",
    title: { nl: "Account verwijderen", en: "Delete your account", tr: "Hesabı sil" },
    desc: { nl: "Zo vraag je verwijdering van je Loclume-account en gegevens aan.", en: "How to request deletion of your Loclume account and data.", tr: "Loclume hesabının ve verilerinin silinmesini nasıl talep edersin." } }
];
const UI = {
  back: { nl: "Terug naar loclume.com", en: "Back to loclume.com", tr: "loclume.com'a dön" },
  skip: { nl: "Direct naar inhoud", en: "Skip to content", tr: "İçeriğe atla" }
};
const ARROW = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

function docPage(d) {
  const blocks = LANGS.map(l => {
    const body = readFileSync(join(ROOT, `tools/content/${d.src}.${l}.html`), "utf8").trim();
    return `  <div data-legal-lang="${l}" lang="${l}" data-title="${escAttr(d.title[l])} — Loclume"${l === "nl" ? "" : " hidden"}>
${body.replace(/^/gm, "    ")}
    <a class="legal-back" href="${PATH[l]}">${ARROW}${UI.back[l]}</a>
  </div>`;
  }).join("\n\n");
  return `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(d.title.nl)} — Loclume</title>
<meta name="description" content="${escAttr(d.desc.nl)}">
<meta name="robots" content="${d.robots}">
<link rel="canonical" href="${ORIGIN}${d.url}">
<meta property="og:type" content="website">
<meta property="og:title" content="${escAttr(d.title.nl)} — Loclume">
<meta property="og:description" content="${escAttr(d.desc.nl)}">
<meta property="og:url" content="${ORIGIN}${d.url}">
<meta property="og:site_name" content="Loclume">
<meta property="og:image" content="${ORIGIN}/assets/img/og-image.jpg">
<meta name="theme-color" content="#151811">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon-32.png">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/Manrope-Variable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/style.css?v=${V}">
</head>
<body>
<a class="skip-link" href="#content">${UI.skip.nl}</a>
<header class="nav solid">
  <div class="nav-inner">
    <a class="logo" href="/"><img src="/assets/img/loclume-mark-88.png" alt="" width="44" height="44"><span>Loclume</span></a>
  </div>
</header>
<main class="legal-main" id="content">
  <div class="legal-lang-toggle" role="group" aria-label="Taal / Language / Dil">
    <button type="button" data-legal-set="nl" lang="nl" class="active" aria-pressed="true">NL</button>
    <button type="button" data-legal-set="en" lang="en" aria-pressed="false">EN</button>
    <button type="button" data-legal-set="tr" lang="tr" aria-pressed="false">TR</button>
  </div>

${blocks}
</main>
<footer class="legal-footer">
  <div class="container footer-bottom">
    <span>© 2026 Loclume · WeIntensify B.V.</span>
    <nav aria-label="Loclume">
      <a class="link" href="/privacy.html">Privacy</a> · <a class="link" href="/cookies.html">Cookies</a> · <a class="link" href="/terms.html">Terms</a> · <a class="link" href="/support/">Support</a> · <a class="link" href="/#cookies">Cookie preferences</a>
    </nav>
  </div>
</footer>
<script src="/assets/js/legal.js?v=${V}"></script>
</body>
</html>
`;
}

const check = process.argv.includes("--check");
const src = readFileSync(join(ROOT, "index.html"), "utf8");
let stale = 0;
const outputs = [
  ...LANGS.map(lang => [lang === "nl" ? "index.html" : `${lang}/index.html`, () => render(src, lang)]),
  ...DOCS.map(d => [d.out, () => docPage(d)])
];
for (const [rel, make] of outputs) {
  const file = join(ROOT, rel);
  const out = make();
  const cur = existsSync(file) ? readFileSync(file, "utf8") : "";
  if (cur === out) continue;
  if (check) { console.error(`STALE: ${file.slice(ROOT.length + 1)} — run node tools/build.mjs`); stale++; continue; }
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, out);
  console.log(`wrote ${file.slice(ROOT.length + 1)}`);
}
if (stale) process.exit(1);
if (check) console.log("build: generated pages are up to date");
