/* Hijra Bank home: mounts the chosen hero and drives the sections below it. */
(function () {
  'use strict';
  var R = HB.REDUCED;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var query = new URLSearchParams(location.search);

  /* Run `fn` every frame only while `el` is on screen and the tab is visible. */
  function whileVisible(el, fn, margin) {
    var on = false, raf = 0;
    function tick(t) { raf = 0; if (!on || document.hidden) return; fn(t); raf = requestAnimationFrame(tick); }
    function kick() { if (on && !raf && !document.hidden) raf = requestAnimationFrame(tick); }
    new IntersectionObserver(function (e) { on = e[0].isIntersecting; kick(); }, { rootMargin: margin || '0px' }).observe(el);
    document.addEventListener('visibilitychange', kick);
  }

  /* ---------- hero: one template per option, chosen with ?hero=1..4 ---------- */
  var heroNo = /^[1-4]$/.test(query.get('hero')) ? query.get('hero') : '1';
  (function mountHero() {
    var link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = 'heroes/hero-' + heroNo + '.css';
    link.onload = function () {
      $('[data-hero-slot]').appendChild($('#hero-' + heroNo).content.cloneNode(true));
      var s = document.createElement('script');
      s.src = 'heroes/hero-' + heroNo + '.js';
      document.body.appendChild(s);
    };
    document.head.appendChild(link);
  })();

  (function switcher() {
    if (query.has('clean')) return;
    var names = ['Genggam', 'Senyum', 'Dinding Box', 'Panggung'];
    var bar = document.createElement('nav');
    bar.className = 'xp'; bar.setAttribute('aria-label', 'Pilih hero');
    bar.innerHTML = names.map(function (n, i) {
      var no = i + 1;
      return '<a href="?hero=' + no + '"' + (String(no) === heroNo ? ' aria-current="page"' : '') + ' aria-label="Hero ' + no + ': ' + n + '">' + no + '<span> ' + n + '</span></a>';
    }).join('');
    document.body.appendChild(bar);
    function vis() { bar.classList.toggle('xp--off', window.scrollY > window.innerHeight * .55); }
    window.addEventListener('scroll', vis, { passive: true }); vis();
  })();

  /* ---------- reveal ---------- */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  $$('.rv').forEach(function (el) { io.observe(el); });

  /* ---------- live app screens ---------- */
  function livePhone(host, ids) {
    var wrap = document.createElement('div'); wrap.className = 'ph__live';
    host.appendChild(wrap);
    var app = HB.phone(wrap, ids);
    function fit() {
      var w = host.clientWidth; if (!w) return;
      var s = w / 390;
      wrap.style.transform = 'scale(' + s + ')';
      wrap.style.height = (host.clientHeight / s) + 'px';
    }
    fit();
    new ResizeObserver(fit).observe(host);
    return app;
  }

  /* ---------- produk tabs ---------- */
  (function tabs() {
    var list = $('[data-tabs]'), tabs = $$('[role="tab"]', list), section = $('#produk');
    var cur = 0, soundTimer = 0, liveDone = false, DUR = 7000, elapsed = 0, last = 0, hovering = false;

    function startLive() {
      if (liveDone) return; liveDone = true;
      var app = livePhone($('[data-live-phone]'), ['haji', 'qurban', 'darurat', 'rumah', 'didik', 'sedekah']);
      if (R) return;
      (async function loop() {
        var i = 0;
        for (;;) {
          await HB.wait(2600);
          if (document.hidden || $('#p-tabungan').hidden) continue;
          var c = app.cards[i++ % app.cards.length], b = c._b;
          b.amount = b.target * .1; HB.paint(c);
          await HB.fillTo(c, b.target, 1700);
          await HB.wait(1100);
          HB.fillCard(c, HB.clone(HB.byId(b.id)));
        }
      })();
    }

    var AMTS = ['Rp25.000', 'Rp48.500', 'Rp12.000', 'Rp150.000', 'Rp33.000'];
    function soundbox(on) {
      clearInterval(soundTimer);
      if (!on || R) return;
      var i = 0, b = $('.sb__bubble'), amt = $('[data-sb-amt]');
      soundTimer = setInterval(function () {
        amt.textContent = AMTS[++i % AMTS.length];
        b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
      }, 2400);
    }

    function show(i, fromUser) {
      tabs.forEach(function (t, n) {
        var on = n === i;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        t.style.removeProperty('--p');
        $('#' + t.getAttribute('aria-controls')).hidden = !on;
      });
      cur = i; elapsed = 0;
      var t = tabs[i], max = list.scrollWidth - list.clientWidth;
      if (max > 0) list.scrollTo({ left: HB.clamp(t.offsetLeft - list.offsetLeft - 24, 0, max), behavior: R ? 'auto' : 'smooth' });
      soundbox(t.id === 't-soundbox');
      if (t.id === 't-tabungan') startLive();
      if (fromUser) list.classList.add('manual');
    }

    list.addEventListener('click', function (e) {
      var t = e.target.closest('[role="tab"]');
      if (t) show(tabs.indexOf(t), true);
    });
    list.addEventListener('keydown', function (e) {
      var k = { ArrowRight: 1, ArrowLeft: -1 }[e.key], n = cur;
      if (k) n = (cur + k + tabs.length) % tabs.length;
      else if (e.key === 'Home') n = 0;
      else if (e.key === 'End') n = tabs.length - 1;
      else return;
      e.preventDefault(); show(n, true); tabs[n].focus();
    });
    $$('[data-open-tab]').forEach(function (a) {
      a.addEventListener('click', function () { show(tabs.indexOf($('#t-' + a.dataset.openTab)), true); });
    });

    // Auto-advance while the section is in view; any tab choice by the visitor ends it.
    section.addEventListener('pointerenter', function () { hovering = true; });
    section.addEventListener('pointerleave', function () { hovering = false; last = 0; });
    if (!R) whileVisible(list, function (now) {
      if (list.classList.contains('manual')) return;
      var dt = last ? Math.min(now - last, 100) : 0; last = now;
      if (hovering) return;
      elapsed += dt;
      tabs[cur].style.setProperty('--p', Math.min(1, elapsed / DUR).toFixed(4));
      if (elapsed >= DUR) show((cur + 1) % tabs.length, false);
    });

    startLive();
    if (R) list.classList.add('manual');
  })();

  /* ---------- media rail: click-and-drag, inertia, slow drift, seamless loop ---------- */
  (function rail() {
    var root = $('[data-rail]'), track = $('[data-rail-track]'), first = $$('.mc', track);
    first.forEach(function (c) {
      var d = c.cloneNode(true); d.tabIndex = -1; d.setAttribute('aria-hidden', 'true'); track.appendChild(d);
    });
    var x = 0, v = 0, size = 0, drag = false, startX = 0, startPos = 0, moved = 0, lastX = 0, lastT = 0, hover = false, id = null, nudge = 0;
    var DRIFT = R ? 0 : -.45;

    function measure() { size = first[1].offsetLeft - first[0].offsetLeft; size *= first.length; }
    function wrap() { if (!size) return; while (x <= -size) x += size; while (x > 0) x -= size; }
    function paint() { wrap(); track.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)'; }
    measure(); window.addEventListener('resize', measure); window.addEventListener('load', measure);

    root.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.rail__btn') || e.button) return;
      drag = true; moved = 0; startX = lastX = e.clientX; startPos = x; v = 0; nudge = 0; lastT = performance.now(); id = e.pointerId;
    });
    window.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== id) return;
      var dx = e.clientX - startX, now = performance.now();
      if (Math.abs(dx) > 5 && !moved) { moved = 1; root.classList.add('drag'); }
      if (!moved) return;
      x = startPos + dx;
      v = (e.clientX - lastX) / Math.max(1, now - lastT) * 16;
      lastX = e.clientX; lastT = now; paint();
    });
    function end(e) {
      if (!drag || e.pointerId !== id) return;
      drag = false;
      setTimeout(function () { root.classList.remove('drag'); }, 0);
    }
    window.addEventListener('pointerup', end); window.addEventListener('pointercancel', end);
    // A drag must not open the article underneath it.
    root.addEventListener('click', function (e) { if (moved) { e.preventDefault(); moved = 0; } }, true);

    root.addEventListener('pointerenter', function () { hover = true; });
    root.addEventListener('pointerleave', function () { hover = false; });
    function jump(dir) { nudge = dir * (first[0].offsetWidth + 24); v = 0; if (R) { x += nudge; nudge = 0; paint(); } }
    $('[data-rail-prev]').addEventListener('click', function () { jump(1); });
    $('[data-rail-next]').addEventListener('click', function () { jump(-1); });
    root.addEventListener('focusin', function (e) {
      var c = e.target.closest('.mc'); if (!c) return;
      root.scrollLeft = 0;
      var r = c.getBoundingClientRect();
      if (r.left < 0 || r.right > window.innerWidth) { x -= r.left - 40; paint(); }
    });

    paint();
    whileVisible(root, function () {
      if (drag) return;
      if (Math.abs(nudge) > .5) { var s = nudge * .16; x += s; nudge -= s; }
      else if (Math.abs(v) > .05) { x += v; v *= .94; }
      else if (!hover) x += DRIFT;
      paint();
    }, '100px');
  })();

  /* ---------- manifesto film ---------- */
  (function film() {
    var fig = $('[data-film]'), v = $('video', fig), snd = $('[data-film-sound]', fig), btn = $('[data-film-play]', fig), loaded = false, paused = R;
    var heardFromStart = false;
    function load() { if (loaded) return; loaded = true; v.src = window.innerWidth < 900 ? v.dataset.sm : v.dataset.lg; }
    function label() { btn.textContent = v.paused ? 'Putar' : 'Jeda'; }
    v.addEventListener('play', label); v.addEventListener('pause', label); label();
    new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) { load(); if (!paused) v.play().catch(function () {}); }
      else v.pause();
    }, { threshold: .35 }).observe(fig);
    btn.addEventListener('click', function () {
      load();
      if (v.paused) { paused = false; v.play().catch(function () {}); } else { paused = true; v.pause(); }
    });
    snd.addEventListener('click', function () {
      load();
      v.muted = !v.muted;
      if (!v.muted) {
        if (!heardFromStart) { heardFromStart = true; v.currentTime = 0; }
        paused = false; v.play().catch(function () {});
      }
      snd.setAttribute('aria-pressed', v.muted ? 'false' : 'true');
      snd.textContent = v.muted ? 'Nyalakan suara' : 'Matikan suara';
    });
    // The card widens to the screen edges as it arrives.
    if (R) return;
    var section = $('.mf');
    whileVisible(section, function () {
      if (window.innerWidth < 960) { fig.style.width = fig.style.maxWidth = fig.style.borderRadius = ''; return; }
      var r = fig.parentNode.getBoundingClientRect(), vh = window.innerHeight;
      var p = HB.clamp((vh - r.top - r.height * .35) / (vh * .75), 0, 1);
      var w = document.documentElement.clientWidth, base = Math.min(w * .92, 1280);
      fig.style.maxWidth = 'none';
      fig.style.width = (base + (w - base) * p).toFixed(1) + 'px';
      fig.style.borderRadius = ((1 - p) * 32).toFixed(1) + 'px';
    }, '120px');
  })();

  /* ---------- unduh: every goal icon flies home to the phone ---------- */
  (function go() {
    var ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/.test(ua)) document.body.dataset.os = 'ios';
    else if (/Android/.test(ua)) document.body.dataset.os = 'android';

    var sec = $('[data-go]'), field = $('[data-go-field]'), phoneEl = $('[data-go-phone]'), screen = $('[data-go-screen]'), splash = $('[data-splash]');
    // ex/ey: resting place around the phone, as fractions of the phone's width; sx/sy: where it starts.
    var ICONS = [
      { n: 'pilgrimage', s: 116, ex: -.84, ey: -.32, sx: -2.2, sy: -1.7, r: -14 },
      { n: 'qurban',     s: 112, ex: .86,  ey: -.40, sx: 2.0,  sy: -1.8, r: 16 },
      { n: 'house',      s: 124, ex: -1.02, ey: .32, sx: -2.5, sy: .1,  r: 12 },
      { n: 'donation',   s: 96,  ex: 1.0,  ey: .16,  sx: 1.9,  sy: .3,  r: -16 },
      { n: 'education',  s: 100, ex: -.62, ey: -.86, sx: -1.5, sy: -2.3, r: 18 },
      { n: 'married',    s: 88,  ex: .50,  ey: -.86, sx: 1.2,  sy: -2.4, r: -20 },
      { n: 'gift',       s: 86,  ex: .88,  ey: .78,  sx: 2.2,  sy: 1.2, r: 14 },
      { n: 'travel',     s: 92,  ex: -.90, ey: .96,  sx: -2.3, sy: 1.1, r: -10 }
    ].map(function (o) {
      var img = new Image(); img.src = HB.iconSrc(o.n); img.alt = ''; img.className = 'go__ic'; img.draggable = false;
      img.style.width = o.s + 'px'; img.style.marginLeft = -o.s / 2 + 'px'; img.style.marginTop = -o.s / 2 + 'px';
      field.appendChild(img);
      o.el = img; o.phase = Math.random() * 6.28; o.px = 0; o.py = 0;
      return o;
    });

    var mx = -1e4, my = -1e4, opened = false;
    field.addEventListener('pointermove', function (e) { var r = field.getBoundingClientRect(); mx = e.clientX - r.left - r.width / 2; my = e.clientY - r.top - r.height / 2; });
    field.addEventListener('pointerleave', function () { mx = my = -1e4; });

    function open() {
      if (opened) return; opened = true;
      livePhone(screen, ['haji', 'qurban', 'rumah', 'didik', 'nikah', 'sedekah']);
      HB.wait(250).then(function () { splash.classList.add('off'); });
    }

    function frame(t) {
      var r = sec.getBoundingClientRect(), vh = window.innerHeight;
      var p = R ? 1 : HB.clamp((vh - r.top) / (vh * .92), 0, 1);
      var e = 1 - Math.pow(1 - p, 3);
      var mobile = window.innerWidth < 960, unit = mobile ? 150 : 250;
      var cy = mobile ? -50 : -30;
      phoneEl.style.transform = 'translateY(' + ((1 - e) * 190).toFixed(1) + 'px) rotate(' + ((1 - e) * 9).toFixed(2) + 'deg)';
      ICONS.forEach(function (o) {
        var X = (o.sx + (o.ex - o.sx) * e) * unit, Y = cy + (o.sy + (o.ey - o.sy) * e) * unit;
        var bob = R ? 0 : Math.sin(t * .0011 + o.phase) * 9;
        var dx = X - mx, dy = Y - my, d = Math.hypot(dx, dy), push = d < 190 ? (190 - d) / 190 * 70 : 0;
        o.px += ((d ? dx / d * push : 0) - o.px) * .14; o.py += ((d ? dy / d * push : 0) - o.py) * .14;
        var scale = (mobile ? .66 : 1) * (.72 + .28 * e);
        o.el.style.transform = 'translate3d(' + (X + o.px).toFixed(1) + 'px,' + (Y + o.py + bob).toFixed(1) + 'px,0) rotate(' + (o.r * (1 - e) + Math.sin(t * .0007 + o.phase) * 3).toFixed(2) + 'deg) scale(' + scale.toFixed(3) + ')';
      });
      if (p > .97) open();
    }
    frame(0);
    if (R) return;
    whileVisible(sec, frame, '200px');
  })();
})();
