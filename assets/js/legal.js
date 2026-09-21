/* Legal + support pages: NL/EN/TR switch (external file: the CSP allows no inline scripts).
   Language order: #nl/#en/#tr in the URL (links from /en/ and /tr/), then the stored site
   language, then the browser language, then Dutch. */
(function () {
  var LANGS = ["nl", "en", "tr"];
  document.documentElement.classList.add("js");
  function set(l) {
    document.querySelectorAll("[data-legal-lang]").forEach(function (b) {
      var on = b.getAttribute("data-legal-lang") === l;
      b.hidden = !on;
      if (on && b.getAttribute("data-title")) document.title = b.getAttribute("data-title");
    });
    document.querySelectorAll("[data-legal-set]").forEach(function (b) {
      var on = b.getAttribute("data-legal-set") === l;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    document.documentElement.lang = l;
  }
  document.querySelectorAll("[data-legal-set]").forEach(function (b) {
    b.addEventListener("click", function () {
      var l = b.getAttribute("data-legal-set");
      set(l);
      history.replaceState(null, "", location.pathname + location.search + "#" + l);
    });
  });

  var hash = location.hash.slice(1);
  var stored = null;
  try { stored = localStorage.getItem("loclume_lang"); } catch (e) { /* storage blocked */ }
  var l = LANGS.indexOf(hash) >= 0 ? hash : LANGS.indexOf(stored) >= 0 ? stored : null;
  if (!l) {
    l = "nl";
    var list = navigator.languages || [navigator.language || "nl"];
    for (var i = 0; i < list.length; i++) {
      var c = (list[i] || "").slice(0, 2).toLowerCase();
      if (LANGS.indexOf(c) >= 0) { l = c; break; }
    }
  }
  set(l);
})();
