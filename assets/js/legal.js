/* Legal pages: NL/EN toggle, follows the site language (external file: CSP allows no inline scripts). */
(function () {
  var stored = null;
  try { stored = localStorage.getItem("loclume_lang"); } catch (e) { /* storage blocked */ }
  function set(l) {
    document.querySelectorAll("[data-legal-lang]").forEach(function (b) { b.hidden = b.getAttribute("data-legal-lang") !== l; });
    document.querySelectorAll("[data-legal-set]").forEach(function (b) {
      var on = b.getAttribute("data-legal-set") === l;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    document.documentElement.lang = l;
  }
  document.querySelectorAll("[data-legal-set]").forEach(function (b) {
    b.addEventListener("click", function () { set(b.getAttribute("data-legal-set")); });
  });
  var langs = navigator.languages || [navigator.language || "nl"];
  var detected = "nl";
  for (var i = 0; i < langs.length; i++) { var c = (langs[i] || "").slice(0, 2).toLowerCase(); if (c === "nl" || c === "en" || c === "tr") { detected = c; break; } }
  var l = stored || detected;
  set(l === "nl" ? "nl" : "en");
})();
