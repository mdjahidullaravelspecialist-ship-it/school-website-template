/* Site behaviour: mobile menu, dropdown disclosure, header shadow, back-to-top.
   Vanilla JS, no dependencies. */
(function () {
  "use strict";
  var header = document.querySelector("[data-site-header]");
  var panel = document.querySelector("[data-nav-panel]");
  var toggle = document.querySelector("[data-menu-toggle]");
  var label = document.querySelector("[data-menu-label]");
  var desktop = window.matchMedia("(min-width: 1024px)");

  function closeSubmenus(except) {
    document.querySelectorAll(".nav__toggle[aria-expanded='true']").forEach(function (b) {
      if (b !== except) b.setAttribute("aria-expanded", "false");
    });
  }

  function setMenu(open) {
    if (!panel || !toggle) return;
    if (open) panel.style.setProperty("--panel-top", Math.max(0, header.getBoundingClientRect().bottom) + "px");
    panel.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    if (label) label.textContent = open ? "Close" : "Menu";
    document.body.classList.toggle("nav-locked", open && !desktop.matches);
  }

  if (toggle) toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Dropdowns (disclosure pattern: buttons toggle aria-expanded)
  document.querySelectorAll(".nav__toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      closeSubmenus(btn);
      btn.setAttribute("aria-expanded", String(!expanded));
    });
  });

  document.addEventListener("click", function (e) {
    if (desktop.matches && !e.target.closest(".nav")) closeSubmenus();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var openBtn = document.querySelector(".nav__toggle[aria-expanded='true']");
    closeSubmenus();
    if (openBtn && desktop.matches) openBtn.focus();
    if (toggle && toggle.getAttribute("aria-expanded") === "true" && !desktop.matches) { setMenu(false); toggle.focus(); }
  });

  desktop.addEventListener("change", function () { setMenu(false); closeSubmenus(); });

  // Header shadow + back-to-top
  var top = document.querySelector("[data-scroll-top]");
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
      if (top) top.classList.toggle("is-visible", window.scrollY > 600);
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (top) top.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    var m = document.getElementById("main"); if (m) m.focus({ preventScroll: true });
  });
})();
