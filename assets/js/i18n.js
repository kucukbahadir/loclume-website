/* Loclume i18n — NL lives in the HTML, EN in this dictionary.
   Fallback chain: lang -> nl (original HTML text). */
(function () {
  const DICTS = {
    en: {
      "skip": "Skip to content",
      "nav.how": "How it works",
      "nav.stockitup": "Stockitup",
      "nav.features": "Features",
      "nav.pricing": "Pricing",
      "nav.contact": "Contact",
      "nav.open": "Open the app",
      "nav.demo": "Request a demo",
      "ft.appsoon": "App — coming soon",
      "ct.appsoon": "App coming soon on web, Android and iOS",

      "hero.badge": "Works alongside Stockitup — does not replace it",
      "hero.t1": "Scan the shelf.",
      "hero.t2": "Scan the products.",
      "hero.t3": "Loclume does the rest.",
      "hero.sub": "Fast stock counts and shelf moves for any product with a barcode, using a scanner terminal or your phone. Compared with Stockitup in real time. No laptop to carry, no desk to go back to.",
      "hero.cta1": "Request a demo",
      "hero.cta2": "See how it works",
      "hero.p1b": "Up to 10× faster",
      "hero.p1s": "than counting behind a computer",
      "hero.p2b": "1 scan",
      "hero.p2s": "per product, quantities grouped automatically",
      "hero.p3b": "100% audit trail",
      "hero.p3s": "every change traceable",

      "scene.title": "Shelf count",
      "scene.live": "live",
      "scene.compare": "Comparing with Stockitup…",
      "scene.done": "Everything in its place",
      "scene.diff": "0 differences",

      "how.kicker": "How it works",
      "how.title": "From shelf to certainty in five steps",
      "how.sub": "No forms, no typing quantities. Scanning is counting, and Loclume puts the system comparison right next to reality.",
      "how.s1t": "Scan the shelf",
      "how.s1p": "Scan the shelf barcode, for example B-04-12. That shelf becomes your active location.",
      "how.s2t": "Scan the products",
      "how.s2p": "Scan everything on the shelf in one go. The same EAN three times? Loclume automatically counts 3 units.",
      "how.s3t": "Automatic comparison",
      "how.s3p": "The physical count is placed next to the Stockitup stock instantly: correct, missing or unexpected.",
      "how.s4t": "Differences explained",
      "how.s4p": "Loclume investigates the cause: is the third copy registered on shelf C-22? Then you will see that.",
      "how.s5t": "You decide, Loclume executes",
      "how.s5p": "Corrections are only applied after your approval and neatly recorded in the audit trail.",

      "siu.kicker": "For Stockitup users",
      "siu.title": "Stockitup stays in charge. Loclume does the floor work.",
      "siu.sub": "Loclume is not a new ERP and not a replacement. It is the missing operational layer on the floor: it makes counting, checking and correcting so fast that your stock in Stockitup finally always matches.",
      "siu.c1b": "Secure connection in minutes",
      "siu.c1s": "Enter your own API credentials, verify, done. Secrets stay server-side and unreadable from the app.",
      "siu.c2b": "Real-time comparison per shelf",
      "siu.c2s": "System says 3, you count 2? Loclume first checks whether that third copy is registered somewhere else.",
      "siu.c3b": "Corrections with one approval",
      "siu.c3s": "Update stock, correct a location or move the SKU along, according to the rules you configure.",
      "siu.f1": "Scan",
      "siu.f2": "Compare",
      "siu.f3": "Approve",

      "feat.kicker": "Features",
      "feat.title": "Everything for a count that adds up",
      "feat.sub": "Built for the floor: big touch targets, one primary action per screen and a clear next step.",
      "feat.f1t": "Serial scanning",
      "feat.f1p": "Scan products back to back; quantities are grouped automatically. Wrong scan? One tap on \"undo last scan\".",
      "feat.f2t": "Bulk shelf moves",
      "feat.f2p": "Scan the target shelf, scan 12 products, one approval: all locations are updated. Optionally the SKU moves along automatically.",
      "feat.f3t": "Product lookup",
      "feat.f3p": "Scan an EAN and instantly see on which locations and in which quantities the product is registered in Stockitup.",
      "feat.f4t": "Keep working offline",
      "feat.f4p": "Wi-Fi gap in the warehouse? Scans are stored locally and synced as soon as the connection returns.",
      "feat.f5t": "Roles and permissions",
      "feat.f5p": "Operators count, managers review differences, admins manage the connection. Everyone sees exactly what they need.",
      "feat.f6t": "Full audit trail",
      "feat.f6p": "Every change is recorded with old value, new value, user, date and the related count session.",

      "sc.kicker": "Resolving differences",
      "sc.title": "Not just the difference — the cause too",
      "sc.sub": "Loclume does not simply show \"1 missing\". It first investigates other locations and only then proposes a safe correction.",
      "sc.sys": "system",
      "sc.cnt": "counted",
      "sc.1h": "Missing on the shelf",
      "sc.1p": "Loclume finds the third copy registered on shelf B-03 and suggests: check B-03 before writing off stock.",
      "sc.1f": "Suggestion: check B-03 · nothing is changed silently",
      "sc.2h": "Unexpected product",
      "sc.2p": "Two copies found that do not belong here. Loclume checks where they are registered and offers a choice.",
      "sc.2f": "Choice: move here or bring back to C-22",
      "sc.3h": "Stock really is wrong",
      "sc.3p": "Not found anywhere else? Only then does Loclume propose correcting stock from 3 to 2, with your approval.",
      "sc.3f": "Correction 3 → 2 · recorded in the audit trail",

      "hw.kicker": "No computer, no laptop",
      "hw.title": "Count where the stock is — not where the computer is",
      "hw.sub": "One Loclume app for Android and iOS: install it on your phone or on an Android scanner terminal with a built-in reader. Walk, scan, done. Comparison and corrections happen on the move, not afterwards at a desk.",
      "hw.1t": "Loclume Android app on a scanner terminal",
      "hw.1p": "The Loclume Android app (coming soon to the Play Store), installed on an Android scanner terminal with a built-in reader (like a Zebra TC22): the fastest option for big counts and daily shelf moves.",
      "hw.2t": "Phone camera",
      "hw.2p": "No extra hardware needed: the iPhone or Android camera reads EAN and shelf barcodes directly.",
      "hw.3t": "Existing HID / Bluetooth / USB scanner",
      "hw.3p": "Your current scanner sends barcodes as keyboard input. Pair and serial-scan, without new investment.",

      "pr.kicker": "Pricing",
      "pr.title": "One clear price",
      "pr.sub": "No modules, no surprises. Cancel monthly.",
      "pr.plan": "Loclume Complete",
      "pr.per": "per month, per company",
      "pr.trial": "7-day free trial",
      "pr.note": "after your trial · excl. VAT · cancel monthly",
      "pr.appsoon": "App coming soon — request a demo and get notified at launch",
      "pr.i1": "Unlimited counts and shelf moves",
      "pr.i2": "Stockitup connection and health check",
      "pr.i3": "Web, Android and iOS — also offline",
      "pr.i4": "Roles, permissions and full audit trail",
      "pr.i5": "Support in Dutch and English",
      "pr.cta": "Start your free trial",

      "faq.title": "Frequently asked questions",
      "faq.q1": "Does Loclume replace Stockitup?",
      "faq.a1": "No. Stockitup remains your main system for stock and e-commerce. Loclume is the operational layer on the floor: counting, scanning, comparing and resolving differences safely. Approved corrections are written back to Stockitup.",
      "faq.q2": "Which scanners can I use?",
      "faq.a2": "Three options: your phone camera, the same Loclume Android app on a scanner terminal with a built-in reader (like a Zebra TC22), or an existing HID/Bluetooth/USB scanner that sends barcodes as keyboard input. Serial scanning works with all three.",
      "faq.q3": "Does Loclume work without internet?",
      "faq.a3": "Yes. If the connection drops, scans are stored locally on the device and your employee simply keeps counting. As soon as the connection returns, the Stockitup comparison and synchronisation follow.",
      "faq.q4": "What does Loclume cost?",
      "faq.a4": "You first try Loclume free for 7 days. After that €30 per month per company, cancel monthly. Includes unlimited counts, shelf moves, Stockitup connection and audit trail.",
      "faq.q5": "How safe is my Stockitup connection?",
      "faq.a5": "Your API credentials are stored encrypted server-side after verification and can no longer be read from the app. Only an admin can renew the connection. Every change to Stockitup is recorded with old value, new value, user and date.",
      "faq.q6": "Who is Loclume for?",
      "faq.a6": "For shops, warehouses and operations teams that work with Stockitup and want to count, move and reconcile physical stock quickly: from bookshops to webshop warehouses.",

      "ct.kicker": "Contact",
      "ct.title": "Want to see how fast your count can be?",
      "ct.sub": "Request a demo or ask your question. We usually respond within one business day.",
      "ct.name": "Name",
      "ct.email": "Email address",
      "ct.company": "Company",
      "ct.msg": "Message",
      "ct.send": "Send message",

      "cta.title": "Everything in its place. From the first scan.",
      "cta.sub": "Connect Stockitup, grab a scanner and see within an hour where your stock really is.",
      "cta.b1": "Request a demo",
      "cta.b2": "App coming soon",

      "ft.about": "Modern inventory verification for teams working with Stockitup. Scan, compare and resolve differences safely.",
      "ft.product": "Product",
      "ft.legal": "Legal",
      "ft.privacy": "Privacy statement",
      "ft.cookies": "Cookie statement",
      "ft.terms": "Terms and conditions",
      "ft.copy": "© 2026 Loclume. All rights reserved. A WeIntensify B.V. brand.",
      "ft.cookieprefs": "Cookie preferences",

      "ck.title": "Cookies",
      "ck.text": "We use necessary cookies to make the site work. Statistics cookies are only loaded with your consent. Read more in our <a href=\"cookies.html\">cookie statement</a>.",
      "ck.nec": "Necessary",
      "ck.necd": "Always active — language choice and cookie preference.",
      "ck.stats": "Statistics",
      "ck.statsd": "Anonymous visitor statistics (Google Analytics).",
      "ck.accept": "Accept all",
      "ck.reject": "Necessary only",
      "ck.custom": "Customise",
      "ck.save": "Save",

      // runtime-only strings (no DOM element in HTML)
      "rt.sending": "Sending…",
      "rt.sent": "Thank you! Your message has been sent. We will get back to you soon.",
      "rt.error": "Something went wrong while sending. Please email us at info@loclume.com.",
      "rt.required": "Please fill in all required fields."
    },
    tr: {
      "skip": "İçeriğe atla",
      "nav.how": "Nasıl çalışır",
      "nav.stockitup": "Stockitup",
      "nav.features": "Özellikler",
      "nav.pricing": "Fiyat",
      "nav.contact": "İletişim",
      "nav.open": "Uygulamayı aç",
      "nav.demo": "Demo talep et",
      "ft.appsoon": "Uygulama — çok yakında",
      "ct.appsoon": "Uygulama çok yakında web, Android ve iOS'ta",

      "hero.badge": "Stockitup'ın yanında çalışır — onun yerine geçmez",
      "hero.t1": "Rafı okut.",
      "hero.t2": "Ürünleri okut.",
      "hero.t3": "Gerisini Loclume halleder.",
      "hero.sub": "Barkodu olan her ürün için hızlı stok sayımı ve raf değişimi; el terminali veya telefonunla. Sonuç anında Stockitup ile karşılaştırılır. Laptop taşımadan, bilgisayar başına geçmeden.",
      "hero.cta1": "Demo talep et",
      "hero.cta2": "Nasıl çalıştığını gör",
      "hero.p1b": "10 kata kadar hızlı",
      "hero.p1s": "bilgisayar başında saymaya göre",
      "hero.p2b": "1 okutma",
      "hero.p2s": "ürün başına, adetler otomatik gruplanır",
      "hero.p3b": "%100 denetim izi",
      "hero.p3s": "her değişiklik izlenebilir",

      "scene.title": "Raf sayımı",
      "scene.live": "canlı",
      "scene.compare": "Stockitup ile karşılaştırılıyor…",
      "scene.done": "Her şey yerli yerinde",
      "scene.diff": "0 fark",

      "how.kicker": "Nasıl çalışır",
      "how.title": "Raftan kesinliğe beş adımda",
      "how.sub": "Form yok, adet girmek yok. Okutmak saymaktır; Loclume sistem karşılaştırmasını anında gerçeğin yanına koyar.",
      "how.s1t": "Rafı okut",
      "how.s1p": "Raf barkodunu okut, örneğin B-04-12. O raf aktif lokasyonun olur.",
      "how.s2t": "Ürünleri okut",
      "how.s2p": "Raftaki her şeyi arka arkaya okut. Aynı EAN üç kez mi? Loclume otomatik 3 adet sayar.",
      "how.s3t": "Otomatik karşılaştırma",
      "how.s3p": "Fiziksel sayım anında Stockitup stoğunun yanına konur: doğru, eksik veya beklenmedik.",
      "how.s4t": "Farklar açıklanır",
      "how.s4p": "Loclume nedeni araştırır: üçüncü kopya C-22 rafında mı kayıtlı? Bunu görürsün.",
      "how.s5t": "Sen karar verirsin, Loclume uygular",
      "how.s5p": "Düzeltmeler yalnızca senin onayınla uygulanır ve denetim izine düzgünce kaydedilir.",

      "siu.kicker": "Stockitup kullanıcıları için",
      "siu.title": "Patron Stockitup kalır. Saha işini Loclume yapar.",
      "siu.sub": "Loclume yeni bir ERP değil, bir ikame de değil. Sahadaki eksik operasyon katmanıdır: sayma, kontrol ve düzeltmeyi o kadar hızlandırır ki Stockitup'taki stoğun nihayet hep doğru olur.",
      "siu.c1b": "Dakikalar içinde güvenli bağlantı",
      "siu.c1s": "Kendi API bilgilerini gir, doğrula, bitti. Gizli anahtarlar sunucu tarafında kalır, uygulamadan okunamaz.",
      "siu.c2b": "Raf başına gerçek zamanlı karşılaştırma",
      "siu.c2s": "Sistem 3 diyor, sen 2 mi saydın? Loclume önce üçüncü kopyanın başka yerde kayıtlı olup olmadığına bakar.",
      "siu.c3b": "Tek onayla düzeltme",
      "siu.c3s": "Stoğu güncelle, lokasyonu düzelt veya SKU'yu birlikte taşı; senin belirlediğin kurallara göre.",
      "siu.f1": "Okut",
      "siu.f2": "Karşılaştır",
      "siu.f3": "Onayla",

      "feat.kicker": "Özellikler",
      "feat.title": "Tutan bir sayım için her şey",
      "feat.sub": "Saha için tasarlandı: büyük dokunma alanları, ekran başına tek birincil aksiyon ve net bir sonraki adım.",
      "feat.f1t": "Seri okutma",
      "feat.f1p": "Ürünleri peş peşe okut; adetler otomatik gruplanır. Yanlış okutma mı? \"Son okutmayı geri al\"a tek dokunuş.",
      "feat.f2t": "Toplu raf değişimi",
      "feat.f2p": "Hedef rafı okut, 12 ürünü okut, tek onay: tüm lokasyonlar güncellenir. İstersen SKU da otomatik taşınır.",
      "feat.f3t": "Ürün arama",
      "feat.f3p": "Bir EAN okut; ürünün Stockitup'ta hangi lokasyonlarda ve kaç adet kayıtlı olduğunu anında gör.",
      "feat.f4t": "Çevrimdışı çalışmaya devam",
      "feat.f4p": "Depoda Wi-Fi boşluğu mu? Okutmalar cihazda saklanır ve bağlantı gelince senkronize edilir.",
      "feat.f5t": "Roller ve yetkiler",
      "feat.f5p": "Operatörler sayar, yöneticiler farkları değerlendirir, adminler bağlantıyı yönetir. Herkes tam ihtiyacını görür.",
      "feat.f6t": "Eksiksiz denetim izi",
      "feat.f6p": "Her değişiklik eski değer, yeni değer, kullanıcı, tarih ve ilgili sayım oturumuyla kaydedilir.",

      "sc.kicker": "Farkları çözme",
      "sc.title": "Sadece fark değil — nedeni de",
      "sc.sub": "Loclume basitçe \"1 eksik\" göstermez. Önce diğer lokasyonları araştırır, ancak ondan sonra güvenli bir düzeltme önerir.",
      "sc.sys": "sistem",
      "sc.cnt": "sayılan",
      "sc.1h": "Rafta eksik",
      "sc.1p": "Loclume üçüncü kopyanın B-03 rafında kayıtlı olduğunu bulur ve önerir: stoğu düşmeden önce B-03'ü kontrol et.",
      "sc.1f": "Öneri: B-03'ü kontrol et · hiçbir şey sessizce değiştirilmez",
      "sc.2h": "Beklenmedik ürün",
      "sc.2p": "Buraya ait olmayan iki kopya bulundu. Loclume nerede kayıtlı olduklarını kontrol eder ve seçenek sunar.",
      "sc.2f": "Seçim: buraya taşı veya C-22'ye geri götür",
      "sc.3h": "Stok gerçekten yanlış",
      "sc.3p": "Başka hiçbir yerde yok mu? Loclume ancak o zaman stoğu 3'ten 2'ye düzeltmeyi önerir; senin onayınla.",
      "sc.3f": "Düzeltme 3 → 2 · denetim izine kaydedildi",

      "hw.kicker": "Bilgisayarsız, laptopsuz",
      "hw.title": "Stok neredeyse orada say — bilgisayar neredeyse orada değil",
      "hw.sub": "Android ve iOS için tek Loclume uygulaması: telefonuna veya dahili okuyuculu bir Android el terminaline kur. Yürü, okut, bitti. Karşılaştırma ve düzeltmeler yolda olur, sonradan masa başında değil.",
      "hw.1t": "El terminalinde Loclume Android uygulaması",
      "hw.1p": "Loclume Android uygulaması (çok yakında Play Store'da), Zebra TC22 gibi dahili okuyuculu bir Android el terminaline kurulur: büyük sayımlar ve günlük raf değişimleri için en hızlı seçenek.",
      "hw.2t": "Telefon kamerası",
      "hw.2p": "Ekstra donanım gerekmez: iPhone veya Android kamerası EAN ve raf barkodlarını doğrudan okur.",
      "hw.3t": "Mevcut HID / Bluetooth / USB tarayıcı",
      "hw.3p": "Mevcut tarayıcın barkodları klavye girdisi olarak gönderir. Eşleştir ve seri okut; yeni yatırım gerekmez.",

      "pr.kicker": "Fiyat",
      "pr.title": "Tek ve net fiyat",
      "pr.sub": "Modül yok, sürpriz yok. Aylık iptal edilebilir.",
      "pr.plan": "Loclume Komple",
      "pr.trial": "7 gün ücretsiz deneme",
      "pr.per": "aylık, şirket başına",
      "pr.note": "deneme süresinden sonra · KDV hariç · aylık iptal",
      "pr.appsoon": "Uygulama çok yakında — demo talep et, lansmanda haber verelim",
      "pr.i1": "Sınırsız sayım ve raf değişimi",
      "pr.i2": "Stockitup bağlantısı ve sağlık kontrolü",
      "pr.i3": "Web, Android ve iOS — çevrimdışı dahil",
      "pr.i4": "Roller, yetkiler ve eksiksiz denetim izi",
      "pr.i5": "Hollandaca ve İngilizce destek",
      "pr.cta": "Ücretsiz denemeni başlat",

      "faq.title": "Sık sorulan sorular",
      "faq.q1": "Loclume, Stockitup'ın yerine mi geçiyor?",
      "faq.a1": "Hayır. Stockitup stok ve e-ticaret için ana sisteminiz olarak kalır. Loclume sahadaki operasyon katmanıdır: sayma, okutma, karşılaştırma ve farkları güvenle çözme. Onaylanan düzeltmeler Stockitup'a geri yazılır.",
      "faq.q2": "Hangi tarayıcıları kullanabilirim?",
      "faq.a2": "Üç seçenek: telefonunun kamerası, dahili okuyuculu bir el terminalinde aynı Loclume Android uygulaması (Zebra TC22 gibi) veya barkodları klavye girdisi olarak gönderen mevcut bir HID/Bluetooth/USB tarayıcı. Seri okutma üçüyle de çalışır.",
      "faq.q3": "Loclume internetsiz çalışır mı?",
      "faq.a3": "Evet. Bağlantı koparsa okutmalar cihazda saklanır ve çalışanın saymaya devam eder. Bağlantı gelir gelmez Stockitup karşılaştırması ve senkronizasyon yapılır.",
      "faq.q4": "Loclume ne kadar?",
      "faq.a4": "Önce Loclume'u 7 gün ücretsiz denersin. Sonrasında şirket başına ayda 30 €, aylık iptal edilebilir. Sınırsız sayım, raf değişimi, Stockitup bağlantısı ve denetim izi dahildir.",
      "faq.q5": "Stockitup bağlantım ne kadar güvenli?",
      "faq.a5": "API bilgilerin doğrulamadan sonra sunucu tarafında şifreli saklanır ve uygulamadan artık okunamaz. Bağlantıyı yalnızca bir admin yenileyebilir. Stockitup'taki her değişiklik eski değer, yeni değer, kullanıcı ve tarihle kaydedilir.",
      "faq.q6": "Loclume kimin için?",
      "faq.a6": "Stockitup ile çalışan ve fiziksel stoğu hızla saymak, taşımak ve tutarlı tutmak isteyen mağazalar, depolar ve operasyon ekipleri için: kitapçılardan e-ticaret depolarına.",

      "ct.kicker": "İletişim",
      "ct.title": "Sayımın ne kadar hızlı olabileceğini görmek ister misin?",
      "ct.sub": "Demo talep et veya sorunu sor. Genellikle bir iş günü içinde yanıt veririz.",
      "ct.name": "İsim",
      "ct.email": "E-posta adresi",
      "ct.company": "Şirket",
      "ct.msg": "Mesaj",
      "ct.send": "Mesajı gönder",

      "cta.title": "Her şey yerli yerinde. İlk okutmadan itibaren.",
      "cta.sub": "Stockitup'ı bağla, bir tarayıcı al ve stoğunun gerçekte nerede olduğunu bir saat içinde gör.",
      "cta.b1": "Demo talep et",
      "cta.b2": "Uygulama çok yakında",

      "ft.about": "Stockitup ile çalışan ekipler için modern envanter doğrulama. Okut, karşılaştır ve farkları güvenle çöz.",
      "ft.product": "Ürün",
      "ft.legal": "Yasal",
      "ft.privacy": "Gizlilik bildirimi",
      "ft.cookies": "Çerez bildirimi",
      "ft.terms": "Genel koşullar",
      "ft.copy": "© 2026 Loclume. Tüm hakları saklıdır. Bir WeIntensify B.V. markasıdır.",
      "ft.cookieprefs": "Çerez tercihleri",

      "ck.title": "Çerezler",
      "ck.text": "Sitenin çalışması için zorunlu çerezler kullanıyoruz. İstatistik çerezleri yalnızca onayınla yüklenir. Ayrıntılar <a href=\"cookies.html\">çerez bildirimimizde</a>.",
      "ck.nec": "Zorunlu",
      "ck.necd": "Her zaman etkin — dil seçimi ve çerez tercihi.",
      "ck.stats": "İstatistik",
      "ck.statsd": "Anonim ziyaretçi istatistikleri (Google Analytics).",
      "ck.accept": "Tümünü kabul et",
      "ck.reject": "Yalnızca zorunlu",
      "ck.custom": "Özelleştir",
      "ck.save": "Kaydet",

      "rt.sending": "Gönderiliyor…",
      "rt.sent": "Teşekkürler! Mesajın gönderildi. En kısa sürede dönüş yapacağız.",
      "rt.error": "Gönderim sırasında bir sorun oluştu. Bize info@loclume.com adresinden yazabilirsin.",
      "rt.required": "Lütfen tüm zorunlu alanları doldur."
    },
    // NL runtime-only strings (NL body text lives in the HTML)
    nl: {
      "rt.sending": "Versturen…",
      "rt.sent": "Bedankt! Je bericht is verstuurd. We nemen snel contact met je op.",
      "rt.error": "Er ging iets mis bij het versturen. Mail ons op info@loclume.com.",
      "rt.required": "Vul alle verplichte velden in."
    }
  };

  const HTML_KEYS_WITH_MARKUP = ["ck.text"];
  const ORIG = {}; // original NL text captured from HTML

  function detectLang() {
    const stored = localStorage.getItem("loclume_lang");
    if (stored && (stored === "nl" || stored === "en" || stored === "tr")) return stored;
    const langs = navigator.languages || [navigator.language || "nl"];
    for (const l of langs) {
      const c = (l || "").slice(0, 2).toLowerCase();
      if (c === "nl") return "nl";
      if (c === "en") return "en";
      if (c === "tr") return "tr";
    }
    return "nl";
  }

  function captureOriginals() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const k = el.getAttribute("data-i18n");
      if (!(k in ORIG)) {
        ORIG[k] = HTML_KEYS_WITH_MARKUP.includes(k) ? el.innerHTML : el.textContent;
      }
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(el => {
      el.getAttribute("data-i18n-attr").split(";").forEach(pair => {
        const [attr, k] = pair.split(":");
        const key = "attr::" + k;
        if (!(key in ORIG)) ORIG[key] = el.getAttribute(attr) || "";
      });
    });
  }

  function t(key, fallback) {
    const lang = window.LOCLUME_I18N.lang;
    if (DICTS[lang] && DICTS[lang][key] != null) return DICTS[lang][key];
    if (DICTS.en[key] != null && lang !== "nl") return DICTS.en[key];
    if (ORIG[key] != null) return ORIG[key];
    return fallback != null ? fallback : key;
  }

  function apply(lang) {
    window.LOCLUME_I18N.lang = lang;
    localStorage.setItem("loclume_lang", lang);
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const k = el.getAttribute("data-i18n");
      let val;
      if (lang === "nl") val = ORIG[k];
      else val = (DICTS[lang] && DICTS[lang][k] != null) ? DICTS[lang][k]
        : (DICTS.en[k] != null ? DICTS.en[k] : ORIG[k]);
      if (val == null) return;
      if (HTML_KEYS_WITH_MARKUP.includes(k)) el.innerHTML = val;
      else el.textContent = val;
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(el => {
      el.getAttribute("data-i18n-attr").split(";").forEach(pair => {
        const [attr, k] = pair.split(":");
        let val;
        if (lang === "nl") val = ORIG["attr::" + k];
        else val = (DICTS[lang] && DICTS[lang][k] != null) ? DICTS[lang][k]
          : (DICTS.en[k] != null ? DICTS.en[k] : ORIG["attr::" + k]);
        if (val != null) el.setAttribute(attr, val);
      });
    });
    document.querySelectorAll("[data-set-lang]").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-set-lang") === lang);
    });
  }

  window.LOCLUME_I18N = { lang: "nl", t, apply, DICTS };

  document.addEventListener("DOMContentLoaded", () => {
    captureOriginals();
    apply(detectLang());
    // Event delegation: works for injected buttons too
    document.addEventListener("click", e => {
      const btn = e.target.closest("[data-set-lang]");
      if (btn) apply(btn.getAttribute("data-set-lang"));
    });
  });
})();
