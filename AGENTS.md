# AGENTS.md — Loclume website (Codex + Claude ortak kuralları)

WeIntensify **weintensify-website-builder** playbook'unun bu repoya sabitlenmiş
kopyası. Codex ve Claude Code bu dosyayı okur. Tek doğruluk kaynağı:
`~/.claude/skills/weintensify-website-builder/SKILL.md` (Notion aynası:
"WeIntensify Website Builder Skills"). Bir kural değişince üçünü de senkron tut.

Stack: zero-build statik site (HTML + CSS + vanilla JS). Build adımı yok.
NL ana dil HTML'de, EN/TR `assets/js/i18n.js` sözlüğünde. Hosting: Hostinger,
`main` → `public_html` Git auto-deploy.

---

## Altın kurallar (bu sitede pahalıya patlayanlardan çıktı — 2026-09 Loclume turu)

### 1. CSP inline script'e izin vermez — kanıtla, varsayma
`.htaccess` içindeki `script-src` yalnızca `'self'`, GA host'u ve **tek bir
sha256 hash** içerir; `'unsafe-inline'` YOKTUR.
- Legal sayfalardaki dil değiştirici bir zamanlar inline `<script>` idi →
  canlıda CSP tarafından bloklandı, NL/EN toggle sessizce çalışmadı. Tüm JS
  `assets/js/`'te yaşar (`legal.js` dahil).
- Tek istisna `index.html`'deki `document.documentElement.classList.add("js")`
  tek satırı; hash'iyle whitelist'li. **Bu satırı değiştirirsen** yeni hash'i
  hesapla ve `.htaccess`'i güncelle:
  ```
  printf %s '<script gövdesi>' | openssl dgst -sha256 -binary | base64
  ```
- Her deploy sonrası: `curl -sI https://loclume.com/privacy.html` ile CSP
  başlığını gör + legal toggle'ın gerçekten çalıştığını doğrula.

### 2. `localStorage` erişimini asla çıplak çağırma
Gizli mod / engellenmiş depolama `getItem`/`setItem`'de exception fırlatır.
Her erişim try/catch içinde; depolama hatası i18n veya çerez onayını
KIRMAMALI (site dili yine de o ziyaret için uygulanır).

### 3. Cache versiyonlarını hep birlikte bump et
Bir asset değişince `?v=N` **tüm sayfalarda** artar: `index.html`,
`privacy.html`, `cookies.html`, `terms.html`, `404.html`. Legal + 404 bir kez
`?v=1`'de unutulup index v5'teyken kırık stil verdi. Yayın sonrası
`curl -s https://loclume.com | grep '?v='` ile doğrula.

### 4. Çerez bandı yalnızca izlenecek bir şey varken çıkar
`config.js`'te `gaId` boşsa site hiç izleme çerezi kurmaz → banner GÖSTERİLMEZ.
Ama footer'daki "Cookievoorkeuren" ve legal sayfalardan `index.html#cookies`
derin linki her zaman tercihleri açmalı. GA yalnızca istatistik onayından
sonra yüklenir (`anonymize_ip`).

### 5. JS olmadan içerik görünmez kalmasın
Scroll-reveal animasyonu `opacity:0`'ı `html.js` sınıfına bağlar; sınıfı
whitelist'li inline snippet ekler. JS kapalıysa/başarısızsa tüm `.reveal`
içerik görünür. `prefers-reduced-motion`'da da görünür + animasyonsuz.

### 6. Font: subset + metrik-eşleşen fallback (CLS 0)
`Inter-Variable.woff2` Latin + Latin-Ext subset'idir, opsz 14'e sabitli
(342 KB → 70 KB). Subset sonrası TR glyph'lerini doğrula
(`şğİıçöüŞĞÇÖÜ€×→—…`). Her webfont için `size-adjust`/`ascent-override`/
`descent-override` ile metrik-eşleşen bir fallback `@font-face` (Arial/
Liberation Sans) → font yüklenirken layout kaymaz.

### 7. Görseller: gerçek boyut + responsive + OG
İkon/logo gerçek boyutta servis edilir (235 KB favicon YOK: `favicon-32`,
`apple-touch-icon`, `icon-192`, `loclume-mark-88`, `loclume-icon-104.webp`).
İçerik fotoğrafları `-600w` srcset varyantı taşır. Sosyal kart gerçek
1200×630 `og-image.jpg` (webp değil — bazı kazıyıcılar webp OG okumaz).

### 8. i18n kapsamı gövdeyle sınırlı değil
`<title>`, meta description, `alt`, `aria-label` dil değişimiyle ÇEVRİLİR
(`data-i18n` / `data-i18n-attr`). Dil butonları `aria-pressed` taşır.
Bitirmeden: HTML anahtarları × her sözlük diff = 0 eksik.

### 9. Animasyon performansı: yalnız transform/opacity
Layout tetikleyen özellik (`left`, `top`, `width`) her karede animate edilmez;
kompozitör-dostu `transform`/`opacity` kullan (lazer taraması `left` yerine
`translateX`). Döngüsel hero sahnesi ekran dışında veya sekme gizliyken durur
(`IntersectionObserver` + `visibilitychange`). Scroll handler `rAF`-throttle.

### 10. Üretim CSP'si altında yerel doğrula
Düz statik sunucu CSP uygulamaz → legal inline-script kırılması gibi hatalar
görünmez. Yerel test sunucusu `.htaccess`'teki CSP başlığını replay etmeli.
Lighthouse: node API + Playwright Chrome'una `--remote-debugging-port` ile
bağlan (CLI headless `NO_FCP` verir). axe-core'u Playwright'a enjekte et.

### 11. Model kimliği / attribution sızdırma
Model ID veya "Generated with" satırı commit mesajına, PR'a, kod yorumuna veya
repoya giden hiçbir artefakta girmez — yalnız sohbet cevabında.

---

## Deploy dört bağımsız durumdur
1. Kaynak doğrulandı (lint/format/typecheck + değişen testler).
2. Temiz çıktı doğrulandı (`archive/`, `scripts/` sızmaz).
3. Upload gerçekten tamamlandı.
4. Canlı kabul sözleşmeleri geçti (`?v=N`, yol/başlık/işaret kontrolleri).

Push ≠ canlı; yeni fingerprint upload'ın bittiğini veya kabulün geçtiğini
KANITLAMAZ. CI/upload yeşil ama canlı kabul kırmızıysa "tamamlandı" denmez,
"yüklenmiş ama kabul edilmemiş" denir.

## Form teslimatı (Web3Forms tuzağı)
Hedef e-posta Web3Forms'ta doğrulanmamışsa API "success" döner ama mail
teslim edilmez. Form işi ancak canlı gönderim yapılıp Gmail kutusunda teslimat
maili bizzat görülünce kapanır.

## Paralel ajan hijyeni
Aynı repoda başka oturum/Codex PR'ı çalışabilir. Yalnız kendi pathspec'ini
commit'le; push'tan önce `git fetch` + `git rev-list --left-right --count`.
Her git zincirinden sonra `git rev-parse --abbrev-ref HEAD` ile branch doğrula.

## Kullanıcı çalışma stili
Türkçe kısa iteratif talepler. Her tur: değiştir → LOKAL doğrula → commit →
develop→main → CANLI doğrula → tek paragraf özet. UI'da emoji yok (SVG ikon).
Eksik bilgiyi sormadan bekletme: placeholder + GitHub Issue ile geç.
