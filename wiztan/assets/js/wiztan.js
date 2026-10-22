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
    nav.classList.toggle("scrolled", window.scrollY > 20);
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

  // Hero phone: cycle sample ads
  var ads = [
    { brand: "pawsitive.co", hook: "Your dog pulls on every walk. Here's the 10-second fix.", cta: "Shop now" },
    { brand: "glowlab", hook: "Your skincare routine has 9 steps. Ours has 2.", cta: "Get 20% off" },
    { brand: "urbannest.homes", hook: "3BHK, park-facing, 8 min from the metro. Tour it in 20 sec.", cta: "Book a visit" },
    { brand: "brewhouse", hook: "Free cold brew with every brunch, this weekend only.", cta: "Reserve a table" }
  ];
  var adEl = document.getElementById("heroAd");
  var hookEl = document.getElementById("adHook");
  var brandEl = document.getElementById("adBrand");
  var ctaEl = document.getElementById("adCta");
  var numEl = document.getElementById("hookNum");
  var bar = document.getElementById("adProgress");
  var DURATION = 3600;
  var idx = 0;

  function runBar() {
    if (reduceMotion) return;
    bar.style.transition = "none";
    bar.style.width = "0";
    void bar.offsetWidth;
    bar.style.transition = "width " + DURATION + "ms linear";
    bar.style.width = "100%";
  }

  function showAd(i) {
    var ad = ads[i];
    hookEl.classList.add("out");
    setTimeout(function () {
      hookEl.textContent = ad.hook;
      brandEl.textContent = ad.brand;
      ctaEl.textContent = ad.cta;
      numEl.textContent = String(i + 1);
      adEl.setAttribute("data-theme", String(i));
      hookEl.classList.remove("out");
    }, reduceMotion ? 0 : 350);
    runBar();
  }

  if (adEl && !reduceMotion) {
    runBar();
    setInterval(function () {
      idx = (idx + 1) % ads.length;
      showAd(idx);
    }, DURATION);
  }

  // Lead form: build a pre-filled email
  var form = document.getElementById("leadForm");
  var note = document.getElementById("formNote");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = new FormData(form);
    var required = ["name", "business"];
    var missing = false;
    required.forEach(function (key) {
      var input = form.elements[key];
      var empty = !String(data.get(key) || "").trim();
      input.closest(".field").classList.toggle("invalid", empty);
      if (empty) missing = true;
    });
    if (missing) {
      note.textContent = "Please add your name and business name.";
      note.classList.add("err");
      return;
    }
    note.classList.remove("err");

    var subject = "Free sample ads for " + data.get("business");
    var body = [
      "Name: " + data.get("name"),
      "Business: " + data.get("business"),
      "Website / Instagram: " + (data.get("link") || "-"),
      "What we sell: " + data.get("niche"),
      "",
      "Goal for the ads:",
      data.get("message") || "-"
    ].join("\n");

    window.location.href = "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
    note.textContent = "Opening your email app. If nothing happens, write to " + CONTACT_EMAIL + ".";
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
