#!/usr/bin/env bash
# Builds a clean dist/ with only the public files (+ dist.zip for the Hostinger static deploy).
# Refuses to finish when anything repository-only would be published.
set -euo pipefail
cd "$(dirname "$0")/.."
node tools/build.mjs --check
node tools/verify.mjs
rm -rf dist dist.zip
mkdir dist
PUBLIC=(index.html en tr support privacy.html cookies.html terms.html 404.html assets
        favicon.ico site.webmanifest robots.txt sitemap.xml llms.txt .htaccess)
for f in "${PUBLIC[@]}"; do cp -R "$f" dist/; done
find dist -name .DS_Store -delete
for bad in tools .github .claude AGENTS.md CLAUDE.md README.md SITE-LAUNCH-CHECKLIST.md .skills.yaml .git; do
  if [ -e "dist/$bad" ]; then echo "STAGE FAILED: dist/$bad must not be published" >&2; exit 1; fi
done
(cd dist && zip -qr ../dist.zip . -x '.DS_Store')
V=$(grep -o 'style.css?v=[0-9]*' dist/index.html | head -1)
echo "staged dist/ ($(find dist -type f | wc -l | tr -d ' ') files, $V) and dist.zip"
