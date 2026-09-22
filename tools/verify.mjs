#!/usr/bin/env node
// Static release gate for loclume.com. Run: node tools/verify.mjs
// Every failure is named; the exit code is 1 when anything fails.
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import vm from "node:vm";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = f => readFileSync(join(ROOT, f), "utf8");
const fails = [];
let checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) fails.push(msg); };

// 1. Generated pages are current
try { execFileSync(process.execPath, [join(ROOT, "tools/build.mjs"), "--check"], { stdio: "pipe" }); ok(true); }
catch (e) { ok(false, `build: generated pages are stale — run node tools/build.mjs\n${e.stderr}`); }

// Public HTML pages
const PAGES = ["index.html", "en/index.html", "tr/index.html", "privacy.html", "cookies.html", "terms.html",
  "support/index.html", "support/account-deletion/index.html", "404.html"];
const HOME = { "index.html": "nl", "en/index.html": "en", "tr/index.html": "tr" };
const html = Object.fromEntries(PAGES.map(p => [p, read(p)]));

// 2. Cache-bust versions in lockstep
const versions = new Set();
for (const [p, h] of Object.entries(html)) for (const m of h.matchAll(/\.(?:css|js)\?v=(\d+)/g)) versions.add(m[1]);
ok(versions.size === 1, `cache-bust: pages use different ?v= values: ${[...versions].join(", ")}`);

// 3. Local links and assets resolve (after the .htaccess clean-URL rewrites)
const REWRITES = [...read(".htaccess").matchAll(/^RewriteRule \^([^$\s]+)\$ (\/\S+) \[L\]$/gm)].map(m => [new RegExp(`^${m[1]}$`), m[2]]);
function resolves(url) {
  let path = url.split("#")[0].split("?")[0];
  if (!path) return true;
  for (const [re, target] of REWRITES) if (re.test(path.slice(1))) path = target;
  const f = join(ROOT, path);
  if (!existsSync(f)) return false;
  return statSync(f).isDirectory() ? existsSync(join(f, "index.html")) : true;
}
for (const [p, h] of Object.entries(html)) {
  const refs = [...h.matchAll(/\s(?:href|src)="([^"]+)"/g)].map(m => m[1]);
  for (const m of h.matchAll(/srcset="([^"]+)"/g)) m[1].split(",").forEach(c => refs.push(c.trim().split(/\s+/)[0]));
  for (const r of refs) {
    if (/^(https?:|mailto:|tel:|#|data:)/.test(r)) continue;
    ok(r.startsWith("/"), `${p}: relative URL "${r}" (use root-absolute paths, pages live in subfolders)`);
    ok(resolves(r), `${p}: broken local reference ${r}`);
  }
  // 4. No inline executable script (CSP script-src has no 'unsafe-inline')
  for (const m of h.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/type="application\/ld\+json"/.test(m[1])) { try { JSON.parse(m[2]); ok(true); } catch (e) { ok(false, `${p}: JSON-LD does not parse: ${e.message}`); } continue; }
    ok(/\ssrc="/.test(m[1]) && !m[2].trim(), `${p}: inline <script> would be blocked by the CSP`);
  }
  ok(!/\sstyle="[^"]*url\(/.test(h), `${p}: inline style with url()`);
  for (const m of h.matchAll(/<img\b[^>]*>/g)) ok(/\salt="/.test(m[0]), `${p}: <img> without alt: ${m[0].slice(0, 80)}`);
  ok((h.match(/<h1\b/g) || []).length === (p.startsWith("support") || ["privacy.html", "cookies.html", "terms.html"].includes(p) ? 3 : 1), `${p}: unexpected number of <h1>`);
  ok(/<meta name="viewport"/.test(h) && /<html lang="(nl|en|tr)">/.test(h), `${p}: missing viewport or lang`);
}

// 5. Home pages: SEO contract
const HREFLANG = { nl: "https://loclume.com/", en: "https://loclume.com/en/", tr: "https://loclume.com/tr/", "x-default": "https://loclume.com/" };
for (const [p, lang] of Object.entries(HOME)) {
  const h = html[p];
  const title = h.match(/<title[^>]*>([^<]*)<\/title>/)[1];
  const desc = h.match(/<meta name="description"[^>]*content="([^"]*)"/)[1];
  ok(title.length <= 60, `${p}: title is ${title.length} chars (max 60): ${title}`);
  ok(desc.length >= 70 && desc.length <= 160, `${p}: meta description is ${desc.length} chars (70-160)`);
  ok(h.includes(`<link rel="canonical" href="${HREFLANG[lang]}"`), `${p}: canonical is not ${HREFLANG[lang]}`);
  for (const [hl, url] of Object.entries(HREFLANG)) ok(h.includes(`hreflang="${hl}" href="${url}"`), `${p}: hreflang ${hl} missing`);
  ok(h.includes(`<html lang="${lang}">`), `${p}: html lang is not ${lang}`);
  ok(new RegExp(`data-lang-link="${lang}" aria-current="true"`).test(h), `${p}: language switcher does not mark ${lang} as current`);
  const ld = JSON.parse(h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const faq = ld["@graph"].find(n => n["@type"] === "FAQPage");
  const details = (h.match(/<details\b/g) || []).length;
  ok(faq && faq.mainEntity.length === details, `${p}: FAQPage has ${faq && faq.mainEntity.length} questions, page shows ${details}`);
  ok(!/Tot 10×|10× faster|10 kat/i.test(h), `${p}: unverified "10x" benchmark claim (PRODUCT.md forbids invented benchmarks)`);
}

// 6. i18n coverage
const dict = JSON.parse(read("tools/i18n-pages.json"));
const keys = new Set();
for (const m of html["index.html"].matchAll(/data-i18n="([^"]+)"/g)) keys.add(m[1]);
for (const m of html["index.html"].matchAll(/data-i18n-attr="([^"]+)"/g)) m[1].split(";").forEach(pair => keys.add(pair.split(":")[1]));
const LD_KEYS = ["ld.desc", "ld.offer"];
for (const lang of ["en", "tr"]) {
  for (const k of keys) ok(dict[lang][k] != null, `i18n: ${lang} is missing "${k}"`);
  for (const k of Object.keys(dict[lang])) ok(keys.has(k) || LD_KEYS.includes(k), `i18n: ${lang} has unused key "${k}"`);
}
for (const k of LD_KEYS) ok(dict.nl && dict.nl[k], `i18n: nl is missing "${k}"`);
const sandbox = { window: { addEventListener() {} }, document: { documentElement: { classList: { add() {} }, lang: "en" }, addEventListener() {} }, location: { pathname: "/en/" }, navigator: { userAgent: "" }, localStorage: { getItem() {} } };
vm.runInNewContext(read("assets/js/i18n.js"), sandbox);
const t = sandbox.window.LOCLUME_I18N;
ok(t && t.t("rt.sent") !== "rt.sent", "i18n.js: runtime strings not available");
const rt = read("assets/js/i18n.js").match(/"[a-z]+\.[a-z0-9]+":/g).map(s => s.slice(1, -2));
const perLang = rt.length / 3;
ok(Number.isInteger(perLang), "i18n.js: runtime dictionaries do not have the same number of keys");
for (const m of read("assets/js/app.js").matchAll(/\bt\("([^"]+)"/g)) ok(rt.includes(m[1]), `app.js uses runtime key "${m[1]}" that i18n.js lacks`);

// 7. Sitemap matches indexable pages
const sitemap = read("sitemap.xml");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
for (const [p, h] of Object.entries(html)) {
  if (p === "404.html") continue;
  const url = "https://loclume.com/" + p.replace(/index\.html$/, "");
  const noindex = /<meta name="robots" content="noindex/.test(h);
  ok(noindex !== locs.includes(url), `sitemap: ${url} ${noindex ? "is noindex but listed" : "is indexable but missing"}`);
}
for (const l of locs) ok(resolves(l.replace("https://loclume.com", "")), `sitemap: ${l} does not exist`);
ok(/Sitemap: https:\/\/loclume\.com\/sitemap\.xml/.test(read("robots.txt")), "robots.txt: sitemap line missing");

// 8. Headers
const csp = read(".htaccess").match(/Content-Security-Policy "([^"]+)"/)[1];
const scriptSrc = csp.split(";").find(d => d.trim().startsWith("script-src"));
ok(!/unsafe-inline|unsafe-eval/.test(scriptSrc), "csp: script-src allows unsafe-inline/eval");
ok(/Options -Indexes/.test(read(".htaccess")), ".htaccess: directory listing not disabled");
for (const h of ["Strict-Transport-Security", "X-Content-Type-Options", "Referrer-Policy", "Permissions-Policy", "X-Frame-Options"])
  ok(read(".htaccess").includes(`Header always set ${h}`), `.htaccess: ${h} missing`);

// 9. No developer-machine paths in public files
function walk(d) { return readdirSync(join(ROOT, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]); }
const PUBLIC_TEXT = [...PAGES, "llms.txt", "robots.txt", "sitemap.xml", "site.webmanifest", ".htaccess", ...walk("assets/js"), ...walk("assets/css")];
for (const f of PUBLIC_TEXT) ok(!/\/Users\/|\/home\/[a-z]/.test(read(f)), `${f}: contains a local machine path`);
ok(!/appUrl/.test(read("assets/js/config.js")), "config.js: unused appUrl is back");

console.log(`verify: ${checks - fails.length}/${checks} checks passed`);
if (fails.length) { console.error("FAILED:\n  " + fails.join("\n  ")); process.exit(1); }
