#!/usr/bin/env node
// Local preview server that behaves like production (Hostinger/Apache + .htaccess):
// replays the security headers (incl. CSP) from .htaccess, the clean-URL rewrites,
// directory slashes and the custom 404. Usage: node tools/serve.mjs [port]
import { createServer } from "node:http";
import { readFileSync, statSync, existsSync } from "node:fs";
import { join, extname, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.argv[2] || process.env.PORT || 8641);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "application/javascript",
  ".json": "application/json", ".webmanifest": "application/manifest+json", ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp",
  ".svg": "image/svg+xml", ".ico": "image/x-icon", ".woff2": "font/woff2"
};

// Headers and rewrites are read from .htaccess so the two never drift apart.
const htaccess = readFileSync(join(ROOT, ".htaccess"), "utf8");
// (upgrade-insecure-requests is dropped: it would turn http://localhost into https:// in WebKit)
const HEADERS = [...htaccess.matchAll(/Header always set ([\w-]+) "([^"]+)"/g)]
  .filter(m => m[1] !== "Strict-Transport-Security")
  .map(m => [m[1], m[2].replace(/;\s*upgrade-insecure-requests/, "")]);
const REWRITES = [...htaccess.matchAll(/^RewriteRule \^([^$\s]+)\$ (\/\S+) \[L\]$/gm)].map(m => [new RegExp(`^${m[1]}$`), m[2]]);
const BLOCKED = /^\/(tools|\.git|\.github|\.claude|node_modules|dist)(\/|$)|^\/(AGENTS|CLAUDE|README|SITE-LAUNCH-CHECKLIST)\.md$|^\/\.(skills\.yaml|gitignore)$/;

createServer((req, res) => {
  HEADERS.forEach(([k, v]) => res.setHeader(k, v));
  let path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const send = (code, file) => {
    res.writeHead(code, { "Content-Type": TYPES[extname(file)] || "application/octet-stream" });
    res.end(readFileSync(file));
  };
  const notFound = () => send(404, join(ROOT, "404.html"));
  if (BLOCKED.test(path)) return notFound();
  for (const [re, target] of REWRITES) if (re.test(path.slice(1))) { path = target; break; }
  const file = normalize(join(ROOT, path));
  if (!file.startsWith(ROOT) || !existsSync(file)) return notFound();
  if (statSync(file).isDirectory()) {
    if (!path.endsWith("/")) { res.writeHead(301, { Location: path + "/" }); return res.end(); }
    return existsSync(join(file, "index.html")) ? send(200, join(file, "index.html")) : notFound();
  }
  send(200, file);
}).listen(PORT, () => console.log(`Loclume preview on http://localhost:${PORT}`));
