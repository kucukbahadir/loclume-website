/* Loclume site behaviour: nav, reveal, cookie consent, contact form, hero scan scene. */
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Nav ---------- */
  const nav = $("#nav");
  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 24); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const burger = $("#burger");
  if (burger) {
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // inject language buttons into mobile menu
    const mm = $("#mobileMenu .mm-actions");
    if (mm) {
      const wrap = document.createElement("div");
      wrap.className = "lang-switch";
      wrap.innerHTML = '<button type="button" data-set-lang="nl">NL</button><button type="button" data-set-lang="en">EN</button>';
      mm.appendChild(wrap);
    }
    $$("#mobileMenu a").forEach(a => a.addEventListener("click", () => {
      nav.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    }));
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("vis"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("vis"));
  }

  /* ---------- Cookie consent (opt-in) ---------- */
  const CK_KEY = "loclume_consent_v1";
  const banner = $("#cookieBanner");
  function loadGA() {
    const cfg = window.LOCLUME_CONFIG || {};
    if (!cfg.gaId) return;
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + cfg.gaId;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", cfg.gaId, { anonymize_ip: true });
  }
  function readConsent() {
    try {
      const raw = localStorage.getItem(CK_KEY);
      if (!raw) return null;
      const c = JSON.parse(raw);
      if (!c.ts || Date.now() - c.ts > 365 * 24 * 3600 * 1000) return null;
      return c;
    } catch (e) { return null; }
  }
  function saveConsent(stats) {
    localStorage.setItem(CK_KEY, JSON.stringify({ ts: Date.now(), stats: !!stats }));
    banner.classList.remove("show");
    if (stats) loadGA();
  }
  if (banner) {
    const existing = readConsent();
    if (existing) {
      if (existing.stats) loadGA();
    } else {
      // setTimeout, not rAF (rAF never fires in some webviews)
      setTimeout(() => banner.classList.add("show"), 60);
    }
    $("#ckAcceptAll").addEventListener("click", () => saveConsent(true));
    $("#ckRejectAll").addEventListener("click", () => saveConsent(false));
    $("#ckCustomize").addEventListener("click", () => {
      $("#cookiePrefs").classList.add("show");
      $("#ckCustomize").style.display = "none";
      $("#ckSave").style.display = "inline-flex";
    });
    $("#ckSave").addEventListener("click", () => saveConsent($("#ckStats").checked));
    const reopen = $("#cookiePrefsOpen");
    if (reopen) reopen.addEventListener("click", () => {
      $("#cookiePrefs").classList.add("show");
      $("#ckCustomize").style.display = "none";
      $("#ckSave").style.display = "inline-flex";
      const c = readConsent();
      if (c) $("#ckStats").checked = !!c.stats;
      banner.classList.add("show");
    });
  }

  /* ---------- Contact form (Web3Forms) ---------- */
  const form = $("#contactForm");
  if (form) {
    const status = $("#formStatus");
    const t = (k, f) => (window.LOCLUME_I18N ? window.LOCLUME_I18N.t(k, f) : f);
    form.addEventListener("submit", async e => {
      e.preventDefault();
      status.className = "form-status";
      if (!form.reportValidity()) {
        status.textContent = t("rt.required", "Vul alle verplichte velden in.");
        status.classList.add("err");
        return;
      }
      const btn = form.querySelector("button[type=submit]");
      const btnText = btn.textContent;
      btn.disabled = true;
      btn.textContent = t("rt.sending", "Versturen…");
      try {
        const data = new FormData(form);
        data.append("access_key", (window.LOCLUME_CONFIG || {}).web3formsKey || "");
        data.append("subject", "Loclume website — nieuw bericht");
        data.append("form_type", "contact");
        data.append("from_name", "Loclume Website");
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" }
        });
        const json = await res.json();
        if (json.success) {
          status.textContent = t("rt.sent", "Bedankt! Je bericht is verstuurd.");
          status.classList.add("ok");
          form.reset();
        } else {
          throw new Error(json.message || "send failed");
        }
      } catch (err) {
        status.textContent = t("rt.error", "Er ging iets mis bij het versturen. Mail ons op info@loclume.com.");
        status.classList.add("err");
      } finally {
        btn.disabled = false;
        btn.textContent = btnText;
      }
    });
  }

  /* ---------- Hero scan scene ---------- */
  const device = $("#scanDevice");
  if (device) {
    // build barcode bars
    const bars = $("#barcodeBars");
    const widths = [2, 4, 2, 6, 3, 2, 5, 2, 3, 7, 2, 4, 2, 2, 6, 3, 2, 4, 8, 2, 3, 5, 2, 4, 2, 6, 2, 3, 4, 2, 5, 2, 7, 3, 2, 4];
    widths.forEach(w => {
      const i = document.createElement("i");
      i.style.width = w + "px";
      bars.appendChild(i);
    });

    const bookIcon = '<svg fill="none" stroke="#ADB5A4" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><use href="#i-book"/></svg>';
    const boxIcon = '<svg fill="none" stroke="#ADB5A4" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><use href="#i-box"/></svg>';
    const PRODUCTS = [
      { ean: "8712345678906", name: "Sneaker Runner — maat 42", icon: boxIcon },
      { ean: "9781111111111", name: "De Noordzee — hardcover", icon: bookIcon },
      { ean: "8719218374652", name: "Thermosfles 750 ml", icon: boxIcon },
      { ean: "8710987654321", name: "Weekendtas — olijfgroen", icon: boxIcon }
    ];
    // scan order: EANs, with repeats to show auto-grouping
    const SCANS = [0, 1, 0, 2, 3, 0, 1];

    const list = $("#countList");
    const flash = $("#scanFlash");
    const eanEl = $("#scanEan");
    const dfCompare = $("#dfCompare");
    const dfDone = $("#dfDone");
    const rows = {}; // productIndex -> {el, qtyEl, n}

    function scanOne(idx) {
      const p = PRODUCTS[idx];
      eanEl.textContent = p.ean;
      flash.classList.remove("on");
      void flash.offsetWidth; // restart animation
      flash.classList.add("on");
      if (rows[idx]) {
        rows[idx].n += 1;
        const q = rows[idx].qtyEl;
        q.textContent = "×" + rows[idx].n;
        q.classList.remove("bump");
        void q.offsetWidth;
        q.classList.add("bump");
      } else {
        const row = document.createElement("div");
        row.className = "count-row in";
        row.innerHTML =
          '<span class="cr-icon">' + p.icon + "</span>" +
          '<span class="cr-body"><span class="cr-name">' + p.name + '</span><span class="cr-ean">' + p.ean + "</span></span>" +
          '<span class="count-qty">×1</span>';
        list.appendChild(row);
        rows[idx] = { el: row, qtyEl: row.querySelector(".count-qty"), n: 1 };
      }
    }

    function resetScene() {
      list.textContent = "";
      Object.keys(rows).forEach(k => delete rows[k]);
      dfCompare.classList.remove("show");
      dfDone.classList.remove("show");
    }

    function runScene() {
      resetScene();
      let i = 0;
      const stepMs = reduceMotion ? 0 : 1300;
      if (reduceMotion) {
        SCANS.forEach(scanOne);
        dfDone.classList.add("show");
        return;
      }
      const timer = setInterval(() => {
        scanOne(SCANS[i]);
        i++;
        if (i >= SCANS.length) {
          clearInterval(timer);
          setTimeout(() => {
            dfCompare.classList.add("show");
            setTimeout(() => {
              dfCompare.classList.remove("show");
              dfDone.classList.add("show");
              setTimeout(runScene, 6000); // loop
            }, 2200);
          }, 700);
        }
      }, stepMs);
    }

    // start when hero is visible
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { runScene(); io.disconnect(); }
      }, { threshold: 0.3 });
      io.observe(device);
    } else {
      runScene();
    }
  }
})();
