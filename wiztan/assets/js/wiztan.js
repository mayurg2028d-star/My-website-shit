(function () {
  document.documentElement.classList.remove("no-js");

  // Where form requests are sent. Replace with your real inbox.
  var CONTACT_EMAIL = "hello@wiztan.com";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Nav: background on scroll + mobile toggle
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

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

  // Scroll = a 30-second spot: playhead bar + REC timecode (25 fps)
  var playhead = document.getElementById("playhead");
  var timecode = document.getElementById("timecode");
  var SPOT_SECONDS = 30, FPS = 25;
  function pad(n) { return n < 10 ? "0" + n : String(n); }
  function onScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    nav.classList.toggle("scrolled", window.scrollY > 20);
    playhead.style.width = (p * 100) + "%";
    var frames = Math.round(p * SPOT_SECONDS * FPS);
    var s = Math.floor(frames / FPS);
    timecode.textContent = "00:00:" + pad(s) + ":" + pad(frames % FPS);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

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
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 80 + "ms";
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // Contact sheet: playhead plays each angle, then stamps a winner
  var sheet = document.getElementById("sheet");
  var clips = Array.prototype.slice.call(sheet.querySelectorAll(".clip"));
  var sheetPlayhead = document.getElementById("sheetPlayhead");
  var sheetHead = document.getElementById("sheetHead");

  for (var t = 0; t <= 5; t++) {
    var mark = document.createElement("span");
    mark.style.left = (t * 20) + "%";
    mark.textContent = "00:" + pad(t * 6);
    sheetHead.appendChild(mark);
  }

  function moveHead(i) {
    var clip = clips[i];
    sheetPlayhead.style.left = (clip.offsetLeft + clip.offsetWidth / 2) + "px";
  }
  function clearClips() {
    clips.forEach(function (c) { c.classList.remove("playing", "won"); });
  }

  var lastWinner = -1;
  if (reduceMotion) {
    clips[2].classList.add("won");
    moveHead(2);
  } else {
    var step = 0, winner = 0;
    var tick = function () {
      if (step < clips.length) {
        clearClips();
        clips[step].classList.add("playing");
        moveHead(step);
        step++;
        setTimeout(tick, 900);
      } else {
        do { winner = Math.floor(Math.random() * clips.length); } while (winner === lastWinner);
        lastWinner = winner;
        clearClips();
        moveHead(winner);
        clips[winner].classList.add("won");
        step = 0;
        setTimeout(tick, 3200);
      }
    };
    moveHead(0);
    setTimeout(tick, 800);
    window.addEventListener("resize", function () {
      var active = sheet.querySelector(".clip.playing, .clip.won");
      if (active) moveHead(clips.indexOf(active));
    });
  }

  // Channels: niche tabs
  var channels = [
    {
      title: "D2C & e-commerce",
      desc: "You run Meta and Instagram ads and burn through creatives. We keep a steady flow of fresh angles coming, so ad fatigue never catches up.",
      hooks: ["Your skincare routine has 9 steps. Ours has 2.", "I tried every serum for oily skin. One stayed.", "Stop buying serums that do nothing."]
    },
    {
      title: "Real estate",
      desc: "Listing walkthroughs, project launches and agent intros, made without waiting on a videographer for every property.",
      hooks: ["3BHK, park-facing, 8 minutes from the metro. Take the 20-second tour.", "This is what your EMI gets you in this neighbourhood.", "Three things the brochure won't tell you about this flat."]
    },
    {
      title: "Pet brands & trainers",
      desc: "Problem-and-fix ads that pet parents stop for, whether you sell products, food or training programmes.",
      hooks: ["Your dog pulls on every walk. Here's the 10-second fix.", "Vets keep saying this about dry food. Here's why.", "POV: your dog finally comes back when called."]
    },
    {
      title: "Local business",
      desc: "Clinics, coaches, studios and restaurants that rarely have video. Get ads that bring people through the door.",
      hooks: ["New in Koramangala: first consultation free this week.", "The brunch your Saturday has been missing.", "Your back pain isn't 'just age'. Let's talk."]
    }
  ];
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tv-tabs [role=tab]"));
  var panel = document.getElementById("tvPanel");
  var tvCh = document.getElementById("tvCh");
  var tvTitle = document.getElementById("tvTitle");
  var tvDesc = document.getElementById("tvDesc");
  var tvHooks = document.getElementById("tvHooks");

  function selectChannel(i, focus) {
    tabs.forEach(function (tab, j) {
      var on = i === j;
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;
    });
    if (focus) tabs[i].focus();
    panel.setAttribute("aria-labelledby", tabs[i].id);
    panel.classList.add("switching");
    setTimeout(function () {
      var ch = channels[i];
      tvCh.textContent = "CH 0" + (i + 1) + " · Now showing";
      tvTitle.textContent = ch.title;
      tvDesc.textContent = ch.desc;
      tvHooks.innerHTML = "";
      ch.hooks.forEach(function (h, k) {
        var p = document.createElement("p");
        p.className = "hook";
        var tag = document.createElement("span");
        tag.className = "mono";
        tag.textContent = "Hook " + "ABC"[k];
        p.appendChild(tag);
        p.appendChild(document.createTextNode("“" + h + "”"));
        tvHooks.appendChild(p);
      });
      panel.classList.remove("switching");
    }, reduceMotion ? 0 : 200);
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { selectChannel(i, false); });
    tab.addEventListener("keydown", function (e) {
      var dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!dir) return;
      e.preventDefault();
      selectChannel((i + dir + tabs.length) % tabs.length, true);
    });
  });

  // Slate form: clap, then open a pre-filled email
  var form = document.getElementById("leadForm");
  var note = document.getElementById("formNote");
  var dateEl = document.getElementById("slateDate");
  var now = new Date();
  dateEl.textContent = "Date · " + now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = new FormData(form);
    var missing = false;
    ["business", "name"].forEach(function (key) {
      var empty = !String(data.get(key) || "").trim();
      form.elements[key].closest(".field").classList.toggle("invalid", empty);
      if (empty) missing = true;
    });
    if (missing) {
      note.textContent = "Add your business name and your name.";
      note.classList.add("err");
      return;
    }
    note.classList.remove("err");

    var subject = "Pilot request: " + data.get("business");
    var body = [
      "Production (business): " + data.get("business"),
      "Director (name): " + data.get("name"),
      "Scene (what we sell): " + data.get("niche"),
      "Location (website / Instagram): " + (data.get("link") || "-"),
      "",
      "Take (goal for the ads):",
      data.get("message") || "-"
    ].join("\n");

    form.classList.add("clap");
    setTimeout(function () {
      form.classList.remove("clap");
      window.location.href = "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      note.textContent = "Opening your email app. If nothing happens, write to " + CONTACT_EMAIL + ".";
    }, reduceMotion ? 0 : 420);
  });

  document.getElementById("year").textContent = now.getFullYear();
})();
