(function () {
  document.documentElement.classList.remove("no-js");

  // Where form requests are sent. Replace with your real inbox.
  var CONTACT_EMAIL = "hello@wiztan.com";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Nav: background on scroll + mobile toggle
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    links.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  toggle.addEventListener("click", function () {
    setMenu(!links.classList.contains("open"));
  });
  links.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });

  // Reveal on scroll
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // Hero dashboard: grow bars, then cycle the ad preview through the three hooks
  var dash = document.querySelector(".dash");
  var rows = Array.prototype.slice.call(document.querySelectorAll(".bar-row"));
  var preview = document.getElementById("adPreview");
  var hookEl = document.getElementById("adHook");
  var brandEl = document.getElementById("adBrand");
  var ctaEl = document.getElementById("adCta");
  var variants = [
    { brand: "glowlab", hook: "Your skincare routine has 9 steps. Ours has 2.", cta: "Shop now" },
    { brand: "glowlab", hook: "Dermatologists keep recommending this. Here's why.", cta: "Learn more" },
    { brand: "glowlab", hook: "Oily skin? Try this for 7 days.", cta: "Get yours" }
  ];
  setTimeout(function () { dash.classList.add("go"); }, reduceMotion ? 0 : 600);

  var v = 0;
  function showVariant(i) {
    rows.forEach(function (r, j) { r.style.opacity = j === i ? "1" : ".55"; });
    hookEl.classList.add("out");
    setTimeout(function () {
      hookEl.textContent = variants[i].hook;
      brandEl.textContent = variants[i].brand;
      ctaEl.textContent = variants[i].cta;
      preview.setAttribute("data-v", String(i));
      hookEl.classList.remove("out");
    }, reduceMotion ? 0 : 300);
  }
  if (!reduceMotion) {
    showVariant(0);
    setInterval(function () {
      v = (v + 1) % variants.length;
      showVariant(v);
    }, 3200);
  }

  // Lead form: build a pre-filled email
  var form = document.getElementById("leadForm");
  var note = document.getElementById("formNote");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = new FormData(form);
    var missing = false;
    ["name", "email", "business"].forEach(function (key) {
      var input = form.elements[key];
      var val = String(data.get(key) || "").trim();
      var bad = !val || (key === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
      input.closest(".field").classList.toggle("invalid", bad);
      if (bad) missing = true;
    });
    if (missing) {
      note.textContent = "Please add your name, a valid email and your business name.";
      note.classList.add("err");
      return;
    }
    note.classList.remove("err");

    var subject = "Strategy call request: " + data.get("business");
    var body = [
      "Name: " + data.get("name"),
      "Email: " + data.get("email"),
      "Business: " + data.get("business"),
      "Website / Instagram: " + (data.get("link") || "-"),
      "Industry: " + data.get("industry"),
      "Monthly ad budget: " + data.get("budget"),
      "",
      "What we're looking for:",
      data.get("message") || "-"
    ].join("\n");

    window.location.href = "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
    note.textContent = "Opening your email app. If nothing happens, write to " + CONTACT_EMAIL + ".";
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
