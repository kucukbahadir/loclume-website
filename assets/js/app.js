/* Loclume site behaviour: nav, scroll-spy, reveal, cookie consent, contact form, hero scan scene. */
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const t = (k, f) => (window.LOCLUME_I18N ? window.LOCLUME_I18N.t(k, f) : f);

  /* Safe storage: private mode / blocked storage must never break the page */
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };

  /* ---------- Nav ---------- */
  const nav = $("#nav");
  const burger = $("#burger");
  let scrollTicking = false;
  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(() => {
      nav.classList.toggle("scrolled", window.scrollY > 24);
      scrollTicking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  nav.classList.toggle("scrolled", window.scrollY > 24);

  function setMenu(open) {
    nav.classList.toggle("open", open);
    if (burger) {
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? t("nav.close", "Menu sluiten") : t("nav.menu", "Menu openen"));
    }
  }
  if (burger) {
    burger.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
    // Mobile header is logo + burger only: the language switcher moves into the menu
    const mm = $("#mobileMenu .mm-actions");
    const langSwitch = $(".nav-cta .lang-switch");
    if (mm && langSwitch) mm.appendChild(langSwitch.cloneNode(true));
    $$("#mobileMenu > a").forEach((a, i) => {
      a.style.setProperty("--i", i);
      a.addEventListener("click", () => setMenu(false));
    });
    const mmActions = $("#mobileMenu .mm-actions");
    if (mmActions) mmActions.style.setProperty("--i", $$("#mobileMenu > a").length);
    document.addEventListener("keydown", e => { if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); burger.focus(); } });
    document.addEventListener("click", e => {
      if (nav.classList.contains("open") && !nav.contains(e.target)) setMenu(false);
    });
    window.matchMedia("(min-width: 821px)").addEventListener("change", e => { if (e.matches) setMenu(false); });
  }

  /* ---------- Scroll-spy: highlight the section in view ---------- */
  const spyLinks = $$(".nav-links a[href^='#']");
  if (spyLinks.length && "IntersectionObserver" in window) {
    const byId = {};
    spyLinks.forEach(a => { byId[a.getAttribute("href").slice(1)] = a; });
    const sections = Object.keys(byId).map(id => document.getElementById(id)).filter(Boolean);
    let current = null;
    const spy = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          if (current) current.classList.remove("active");
          current = byId[en.target.id];
          current.classList.add("active");
        } else if (byId[en.target.id] === current && window.scrollY < 200) {
          current.classList.remove("active"); current = null;
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
    sections.forEach(s => spy.observe(s));
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("vis"); io.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("vis"));
  }

  /* ---------- Cookie consent (opt-in) ---------- */
  const CK_KEY = "loclume_consent_v1";
  const banner = $("#cookieBanner");
  const cfg = window.LOCLUME_CONFIG || {};
  let gaLoaded = false;
  function loadGA() {
    if (!cfg.gaId || gaLoaded) return;
    gaLoaded = true;
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
      const raw = store.get(CK_KEY);
      if (!raw) return null;
      const c = JSON.parse(raw);
      if (!c.ts || Date.now() - c.ts > 365 * 24 * 3600 * 1000) return null;
      return c;
    } catch (e) { return null; }
  }
  function saveConsent(stats) {
    store.set(CK_KEY, JSON.stringify({ ts: Date.now(), stats: !!stats }));
    banner.classList.remove("show");
    if (stats) loadGA();
  }
  function openPrefs() {
    $("#cookiePrefs").classList.add("show");
    $("#ckCustomize").hidden = true;
    $("#ckSave").hidden = false;
    const c = readConsent();
    $("#ckStats").checked = c ? !!c.stats : false;
    banner.classList.add("show");
  }
  if (banner) {
    const existing = readConsent();
    if (existing) {
      if (existing.stats) loadGA();
    } else if (cfg.gaId) {
      // Only ask when there is actually something to consent to (GA configured).
      // Without GA the site sets no tracking cookies, so no banner is needed.
      setTimeout(() => banner.classList.add("show"), 900);
    }
    $("#ckAcceptAll").addEventListener("click", () => saveConsent(true));
    $("#ckRejectAll").addEventListener("click", () => saveConsent(false));
    $("#ckCustomize").addEventListener("click", openPrefs);
    $("#ckSave").addEventListener("click", () => saveConsent($("#ckStats").checked));
    const reopen = $("#cookiePrefsOpen");
    if (reopen) reopen.addEventListener("click", openPrefs);
    // Legal pages link here with #cookies to reopen the preferences
    if (location.hash === "#cookies") { openPrefs(); history.replaceState(null, "", location.pathname); }
  }

  /* ---------- Contact form (Web3Forms) ---------- */
  const form = $("#contactForm");
  if (form) {
    const status = $("#formStatus");
    const okIcon = '<svg aria-hidden="true"><use href="#i-check"/></svg>';
    const fields = $$("input[required], textarea[required]", form);
    function showStatus(kind, msg) {
      // Errors interrupt (alert), success is announced politely (status)
      status.setAttribute("role", kind === "err" ? "alert" : "status");
      status.setAttribute("aria-live", kind === "err" ? "assertive" : "polite");
      status.className = "form-status " + kind;
      status.innerHTML = (kind === "ok" ? okIcon : "") + "<span></span>";
      status.lastChild.textContent = msg;
    }
    fields.forEach(f => f.addEventListener("input", () => {
      if (f.checkValidity()) f.removeAttribute("aria-invalid");
    }));
    form.addEventListener("submit", async e => {
      e.preventDefault();
      status.className = "form-status";
      let firstBad = null;
      fields.forEach(f => {
        const bad = !f.checkValidity();
        if (bad) f.setAttribute("aria-invalid", "true"); else f.removeAttribute("aria-invalid");
        if (bad && !firstBad) firstBad = f;
      });
      if (firstBad) {
        showStatus("err", t("rt.required", "Vul alle verplichte velden in."));
        firstBad.focus();
        return;
      }
      const btn = form.querySelector("button[type=submit]");
      const btnHTML = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<span class="btn-spin" aria-hidden="true"></span><span></span>';
      btn.lastChild.textContent = t("rt.sending", "Versturen…");
      try {
        const data = new FormData(form);
        data.append("access_key", cfg.web3formsKey || "");
        data.append("subject", "Loclume website — nieuw bericht");
        data.append("form_type", "contact");
        data.append("from_name", "Loclume Website");
        data.append("site_language", (window.LOCLUME_I18N || {}).lang || "nl");
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" }
        });
        const json = await res.json();
        if (json.success) {
          showStatus("ok", t("rt.sent", "Bedankt! Je bericht is verstuurd."));
          form.reset();
        } else {
          throw new Error(json.message || "send failed");
        }
      } catch (err) {
        showStatus("err", t("rt.error", "Er ging iets mis bij het versturen. Mail ons op info@loclume.com."));
      } finally {
        btn.disabled = false;
        btn.innerHTML = btnHTML;
      }
    });
  }

  /* ---------- Hero scan scene ---------- */
  const device = $("#scanDevice");
  if (device) {
    const scene = device.closest(".scene");
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
      { ean: "8712345678906", key: "scene.p1", name: "Sneaker Runner — maat 42", icon: boxIcon },
      { ean: "9781111111111", key: "scene.p2", name: "De Noordzee — hardcover", icon: bookIcon },
      { ean: "8719218374652", key: "scene.p3", name: "Thermosfles 750 ml", icon: boxIcon },
      { ean: "8710987654321", key: "scene.p4", name: "Weekendtas — olijfgroen", icon: boxIcon }
    ];
    // scan order: EANs, with repeats to show auto-grouping
    const SCANS = [0, 1, 0, 2, 3, 0, 1];

    const list = $("#countList");
    const flash = $("#scanFlash");
    const eanEl = $("#scanEan");
    const dfCompare = $("#dfCompare");
    const dfDone = $("#dfDone");
    const rows = {}; // productIndex -> {el, qtyEl, n}
    const timers = [];
    let running = false, visible = false;

    const later = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); return id; };
    const clearTimers = () => { while (timers.length) clearTimeout(timers.pop()); };

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
          '<span class="cr-body"><span class="cr-name"></span><span class="cr-ean">' + p.ean + "</span></span>" +
          '<span class="count-qty">×1</span>';
        row.querySelector(".cr-name").textContent = t(p.key, p.name);
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

    // The scan loop also runs with reduced motion: CSS then swaps every movement for a
    // plain fade (no sweeping laser, no sliding rows), so the demo still tells its story.
    function runScene() {
      clearTimers();
      resetScene();
      running = true;
      let i = 0;
      const step = () => {
        scanOne(SCANS[i]);
        i++;
        if (i < SCANS.length) { later(step, 1300); return; }
        later(() => {
          dfCompare.classList.add("show");
          later(() => {
            dfCompare.classList.remove("show");
            dfDone.classList.add("show");
            later(runScene, 6000); // loop
          }, 2200);
        }, 700);
      };
      // First frame: the shelf is already scanned, so the device never looks empty
      step();
    }
    function pause() { clearTimers(); running = false; scene.classList.add("paused"); }
    function resume() { scene.classList.remove("paused"); if (!running) runScene(); }
    function sync() { if (visible && !document.hidden) resume(); else pause(); }

    // Run while the device is on (or about to scroll onto) the screen and the tab is visible.
    // On phones the device sits below the headline, so start a little before it appears.
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, { rootMargin: "25% 0px 25% 0px", threshold: 0 });
      io.observe(device);
    } else { visible = true; sync(); }
    document.addEventListener("visibilitychange", sync);

    // Gentle 3D tilt following the pointer (desktop, fine pointer, motion allowed)
    const canTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion;
    if (canTilt && scene) {
      let raf = 0, px = 0, py = 0;
      const apply = () => {
        raf = 0;
        device.style.setProperty("--ry", (px * 6).toFixed(2) + "deg");
        device.style.setProperty("--rx", (-py * 5).toFixed(2) + "deg");
      };
      scene.addEventListener("pointermove", e => {
        const r = device.getBoundingClientRect();
        px = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
        py = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
        if (!raf) raf = requestAnimationFrame(apply);
      });
      scene.addEventListener("pointerleave", () => {
        if (raf) cancelAnimationFrame(raf); raf = 0;
        device.style.setProperty("--rx", "0deg");
        device.style.setProperty("--ry", "0deg");
      });
    }
  }
})();
