/* Loclume i18n runtime.
   Every language has its own prerendered URL: / (nl), /en/, /tr/ (built by tools/build.mjs).
   This file only holds strings that have no element in the HTML (menu labels, form
   messages, hero scene products) and the language-preference logic.
   Loaded synchronously in <head>: it also sets the `js` class used by the reveal CSS. */
(function () {
  var root = document.documentElement;
  root.classList.add("js");

  var RT = {
    nl: {
      "nav.menu": "Menu openen",
      "nav.close": "Menu sluiten",
      "nav.lang": "Taal",
      "scene.p1": "Sneaker Runner — maat 42",
      "scene.p2": "De Noordzee — hardcover",
      "scene.p3": "Thermosfles 750 ml",
      "scene.p4": "Weekendtas — olijfgroen",
      "rt.sending": "Versturen…",
      "rt.sent": "Bedankt! Je bericht is verstuurd. We nemen snel contact met je op.",
      "rt.error": "Er ging iets mis bij het versturen. Mail ons op info@loclume.com.",
      "rt.required": "Vul alle verplichte velden in."
    },
    en: {
      "nav.menu": "Open menu",
      "nav.close": "Close menu",
      "nav.lang": "Language",
      "scene.p1": "Sneaker Runner — size 42",
      "scene.p2": "The North Sea — hardcover",
      "scene.p3": "Thermos flask 750 ml",
      "scene.p4": "Weekend bag — olive green",
      "rt.sending": "Sending…",
      "rt.sent": "Thank you! Your message has been sent. We will get back to you soon.",
      "rt.error": "Something went wrong while sending. Please email us at info@loclume.com.",
      "rt.required": "Please fill in all required fields."
    },
    tr: {
      "nav.menu": "Menüyü aç",
      "nav.close": "Menüyü kapat",
      "nav.lang": "Dil",
      "scene.p1": "Sneaker Runner — 42 numara",
      "scene.p2": "Kuzey Denizi — ciltli",
      "scene.p3": "Termos 750 ml",
      "scene.p4": "Hafta sonu çantası — zeytin yeşili",
      "rt.sending": "Gönderiliyor…",
      "rt.sent": "Teşekkürler! Mesajın gönderildi. En kısa sürede dönüş yapacağız.",
      "rt.error": "Gönderim sırasında bir sorun oluştu. Bize info@loclume.com adresinden yazabilirsin.",
      "rt.required": "Lütfen tüm zorunlu alanları doldur."
    }
  };
  var LANGS = ["nl", "en", "tr"];
  var PATHS = { nl: "/", en: "/en/", tr: "/tr/" };
  var KEY = "loclume_lang";

  var lang = (root.lang || "nl").slice(0, 2);
  if (!RT[lang]) lang = "nl";

  function t(key, fallback) {
    if (RT[lang][key] != null) return RT[lang][key];
    return fallback != null ? fallback : key;
  }
  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function remember(l) { try { localStorage.setItem(KEY, l); } catch (e) { /* storage blocked */ } }

  window.LOCLUME_I18N = { lang: lang, t: t };

  // An explicit choice in the language switcher is remembered.
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-lang-link]");
    if (a) remember(a.getAttribute("data-lang-link"));
  });

  // First visit on the Dutch home page: follow the stored choice or the browser language.
  // Crawlers are never redirected, so every language URL stays indexable on its own.
  if (lang === "nl" && location.pathname === "/" && !/bot|crawl|spider|slurp|lighthouse|headless|preview/i.test(navigator.userAgent)) {
    var want = stored();
    if (LANGS.indexOf(want) < 0) {
      want = "nl";
      var list = navigator.languages || [navigator.language || "nl"];
      for (var i = 0; i < list.length; i++) {
        var c = (list[i] || "").slice(0, 2).toLowerCase();
        if (LANGS.indexOf(c) >= 0) { want = c; break; }
      }
    }
    if (want !== "nl") location.replace(PATHS[want] + location.search + location.hash);
  }
})();
