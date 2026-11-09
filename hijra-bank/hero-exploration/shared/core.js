/* Hijra Bank hero exploration: box data, card + phone rendering and the motion helpers
   shared by all options. No dependencies. */
(function () {
  'use strict';

  var ICONS = '../shared/assets/icons/';
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Nominal is illustrative. Icon set comes from the app's "Choose icons" sheet.
  var BOXES = [
    { id: 'haji',     name: 'Haji & Umrah',    icon: 'pilgrimage', c: 'var(--c-green)',   hex: '#6f9f45', chip: 'save', amount: 14250000, target: 42000000 },
    { id: 'qurban',   name: 'Qurban',          icon: 'qurban',     c: 'var(--c-blue)',    hex: '#0a8fb5', chip: 'save', amount: 2100000,  target: 3500000 },
    { id: 'darurat',  name: 'Dana Darurat',    icon: 'emergency',  c: 'var(--c-purple)',  hex: '#4a1566', chip: 'save', amount: 8400000,  target: 15000000 },
    { id: 'rumah',    name: 'Rumah',           icon: 'house',      c: 'var(--c-navy)',    hex: '#2f4f8f', chip: 'save', amount: 36500000, target: 120000000 },
    { id: 'didik',    name: 'Pendidikan',      icon: 'education',  c: 'var(--c-purple)',  hex: '#5c1b78', chip: 'save', amount: 6750000,  target: 18000000 },
    { id: 'sedekah',  name: 'Sedekah',         icon: 'donation',   c: 'var(--c-orange)',  hex: '#c9713d', chip: 'save', amount: 450000,   target: 1000000 },
    { id: 'belanja',  name: 'Belanja Bulanan', icon: 'grocery',    c: 'var(--c-orange)',  hex: '#c9713d', chip: 'wise', amount: 1850000 },
    { id: 'nikah',    name: 'Nikah',           icon: 'married',    c: 'var(--c-magenta)', hex: '#7c2356', chip: 'save', amount: 11200000, target: 40000000 },
    { id: 'sehat',    name: 'Kesehatan',       icon: 'health',     c: 'var(--c-magenta)', hex: '#7c2356', chip: 'save', amount: 3200000,  target: 10000000 },
    { id: 'liburan',  name: 'Liburan Keluarga',icon: 'travel',     c: 'var(--c-blue)',    hex: '#0a8fb5', chip: 'save', amount: 4300000,  target: 12000000 },
    { id: 'mobil',    name: 'Kendaraan',       icon: 'car',        c: 'var(--c-navy)',    hex: '#2f4f8f', chip: 'save', amount: 21000000, target: 90000000 },
    { id: 'tagihan',  name: 'Tagihan',         icon: 'bills',      c: 'var(--c-purple)',  hex: '#4a1566', chip: 'top',  amount: 950000 },
    { id: 'gadget',   name: 'Gawai Baru',      icon: 'electronic', c: 'var(--c-blue)',    hex: '#0a8fb5', chip: 'save', amount: 5100000,  target: 14000000 },
    { id: 'hadiah',   name: 'Hadiah',          icon: 'gift',       c: 'var(--c-green)',   hex: '#6f9f45', chip: 'save', amount: 300000,   target: 1500000 },
    { id: 'lahiran',  name: 'Persalinan',      icon: 'maternity',  c: 'var(--c-magenta)', hex: '#7c2356', chip: 'save', amount: 7500000,  target: 20000000 },
    { id: 'target',   name: 'Target Tahun Ini',icon: 'target',     c: 'var(--c-blue)',    hex: '#0a8fb5', chip: 'save', amount: 2600000,  target: 8000000 }
  ];
  var CHIPS = { save: 'Nabung terus!', wise: 'Belanja bijak', top: 'Top-up yuk', done: 'Tercapai!' };

  function byId(id) { return BOXES.filter(function (b) { return b.id === id; })[0]; }
  function fmt(n) { return 'Rp' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function clone(b) { var o = {}; for (var k in b) o[k] = b[k]; return o; }
  function pctOf(b) { return b.target ? Math.min(100, b.amount / b.target * 100) : null; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ---------- tween ---------- */
  var ease = {
    out: function (t) { return 1 - Math.pow(1 - t, 3); },
    inOut: function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
    back: function (t) { var c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }
  };
  function tween(ms, fn, e) {
    e = e || ease.out;
    return new Promise(function (done) {
      if (REDUCED || ms <= 0) { fn(1); done(); return; }
      var t0 = performance.now();
      (function step(now) {
        var t = clamp((now - t0) / ms, 0, 1);
        fn(e(t));
        if (t < 1) requestAnimationFrame(step); else done();
      })(t0);
    });
  }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, REDUCED ? 0 : ms); }); }

  /* ---------- card ---------- */
  function iconSrc(name) { return ICONS + name + '.webp'; }

  function fillCard(el, b) {
    var pct = pctOf(b), meter = pct === null ? '' :
      '<div class="box__meter"><div class="box__bar"><i></i></div><span class="box__pct"></span></div>';
    el.style.setProperty('--c', b.c);
    el.innerHTML =
      '<div class="box__top"><img class="box__ic" src="' + iconSrc(b.icon) + '" alt="" draggable="false">' +
      '<span class="box__chip" data-k="' + b.chip + '">' + CHIPS[b.chip] + '</span></div>' +
      '<div class="box__name">' + b.name + '</div>' +
      '<div class="box__foot"><strong class="box__amt"></strong>' + meter + '</div>';
    el._b = b;
    el.classList.remove('is-done');
    paint(el);
  }
  function paint(el) {
    var b = el._b, pct = pctOf(b);
    el.querySelector('.box__amt').textContent = fmt(b.amount);
    if (pct !== null) {
      el.style.setProperty('--p', pct.toFixed(2));
      el.querySelector('.box__pct').textContent = Math.floor(pct) + '%';
    }
  }
  function card(b) { var el = document.createElement('div'); el.className = 'box'; fillCard(el, clone(b)); return el; }

  function special(kind) {
    var el = document.createElement('div');
    if (kind === 'main') {
      el.className = 'box box--main';
      el.innerHTML = '<div class="box__top"><img class="box__ic" src="' + iconSrc('h-mark') + '" alt="" style="width:2.6em"></div><div class="box__name">Box Utama</div><div class="box__foot"><strong class="box__amt">' + fmt(2750000) + '</strong></div>';
    } else {
      el.className = 'box box--depo';
      el.innerHTML = '<div class="box__top"><img class="box__ic" src="' + iconSrc('lock') + '" alt=""></div><div class="box__name">Deposito</div><div class="box__foot"><strong class="box__amt">' + fmt(7400000) + '</strong></div>';
    }
    return el;
  }

  /* Animate a card's amount to `to`; resolves true when the target was reached. */
  function fillTo(el, to, ms) {
    var b = el._b, from = b.amount;
    if (b.target) to = Math.min(to, b.target);
    return tween(ms, function (t) { b.amount = from + (to - from) * t; paint(el); }, ease.inOut).then(function () {
      var hit = !!b.target && b.amount >= b.target;
      if (hit) {
        el.classList.add('is-done');
        var chip = el.querySelector('.box__chip');
        chip.dataset.k = 'done'; chip.textContent = CHIPS.done;
      }
      return hit;
    });
  }

  /* ---------- celebration ---------- */
  var SPARK = ['#ffd23f', '#11b8e4', '#87c054', '#f89f3a', '#ffffff'];
  function burst(x, y, n) {
    if (REDUCED) return;
    for (var i = 0; i < (n || 22); i++) (function () {
      var s = document.createElement('i'), r = 5 + Math.random() * 7, a = Math.random() * Math.PI * 2, d = 50 + Math.random() * 130;
      s.className = 'spark';
      s.style.cssText = 'width:' + r + 'px;height:' + r + 'px;background:' + SPARK[i % SPARK.length];
      document.body.appendChild(s);
      s.animate([
        { transform: 'translate(' + x + 'px,' + y + 'px) scale(1)', opacity: 1 },
        { transform: 'translate(' + (x + Math.cos(a) * d) + 'px,' + (y + Math.sin(a) * d + 40) + 'px) scale(.2)', opacity: 0 }
      ], { duration: 700 + Math.random() * 500, easing: 'cubic-bezier(.15,.7,.3,1)' }).onfinish = function () { s.remove(); };
    })();
  }
  function toast(x, y, text) {
    if (REDUCED) return;
    var t = document.createElement('div');
    t.className = 'toast'; t.textContent = text;
    document.body.appendChild(t);
    var w = t.offsetWidth;
    t.animate([
      { transform: 'translate(' + (x - w / 2) + 'px,' + y + 'px) scale(.7)', opacity: 0 },
      { transform: 'translate(' + (x - w / 2) + 'px,' + (y - 30) + 'px) scale(1)', opacity: 1, offset: .25 },
      { transform: 'translate(' + (x - w / 2) + 'px,' + (y - 56) + 'px) scale(1)', opacity: 0 }
    ], { duration: 1100, easing: 'ease-out' }).onfinish = function () { t.remove(); };
  }

  /* ---------- phone UI ---------- */
  function phone(host, ids) {
    host.innerHTML =
      '<div class="app"><div class="app__status"><span>09.41</span><span class="app__sig">' +
      '<svg width="46" height="13" viewBox="0 0 46 13" fill="#011419" aria-hidden="true"><rect x="0" y="8" width="3" height="5" rx="1"/><rect x="5" y="5" width="3" height="8" rx="1"/><rect x="10" y="2" width="3" height="11" rx="1"/><rect x="24" y="1.5" width="19" height="10" rx="3" fill="none" stroke="#011419" stroke-width="1.2"/><rect x="26" y="3.5" width="13" height="6" rx="1.4"/></svg>' +
      '</span></div><div class="app__head"><div class="app__title">Bank</div><div class="app__bal"><small>Total Saldo</small><b data-total></b></div></div>' +
      '<div class="app__list"><div class="app__scroll"><div class="app__row"><h4>Daftar Box</h4><span class="app__add">+ Tambah Box</span></div><div class="app__grid"></div></div></div>' +
      '<img class="app__tab" src="../shared/assets/brand/tabbar.webp" alt=""></div>';

    var grid = host.querySelector('.app__grid'), scroll = host.querySelector('.app__scroll');
    var totalEl = host.querySelector('[data-total]'), cards = [], total = 2750000 + 7400000;
    grid.appendChild(special('main')); grid.appendChild(special('depo'));
    ids.forEach(function (id) { var el = card(byId(id)); grid.appendChild(el); cards.push(el); total += el._b.amount; });

    function show(v) { var s = fmt(v); totalEl.innerHTML = '<span>Rp</span>' + s.slice(2); }
    show(total);
    return {
      cards: cards, scroll: scroll,
      add: function (d) { var a = total; total += d; tween(500, function (t) { show(a + d * t); }); },
      find: function (id) { return cards.filter(function (c) { return c._b.id === id; })[0]; }
    };
  }

  /* ---------- homography: map a W×H box onto four image-space points ---------- */
  function solve(A, b) {
    var n = b.length, i, j, k;
    for (i = 0; i < n; i++) {
      var m = i;
      for (j = i + 1; j < n; j++) if (Math.abs(A[j][i]) > Math.abs(A[m][i])) m = j;
      var t = A[i]; A[i] = A[m]; A[m] = t; t = b[i]; b[i] = b[m]; b[m] = t;
      for (j = i + 1; j < n; j++) {
        var f = A[j][i] / A[i][i];
        for (k = i; k < n; k++) A[j][k] -= f * A[i][k];
        b[j] -= f * b[i];
      }
    }
    var x = new Array(n);
    for (i = n - 1; i >= 0; i--) {
      var s = b[i];
      for (j = i + 1; j < n; j++) s -= A[i][j] * x[j];
      x[i] = s / A[i][i];
    }
    return x;
  }
  function matrix3d(W, H, q) {
    var src = [[0, 0], [W, 0], [W, H], [0, H]], A = [], b = [];
    for (var i = 0; i < 4; i++) {
      var x = src[i][0], y = src[i][1], u = q[i][0], v = q[i][1];
      A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
      A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
    }
    var h = solve(A, b);
    return 'matrix3d(' + [h[0], h[3], 0, h[6], h[1], h[4], 0, h[7], 0, 0, 1, 0, h[2], h[5], 0, 1].join(',') + ')';
  }

  /* Pin `screen` to the quad (fractions of the image) and keep it pinned on resize. */
  function pin(shot, screen, quad, radius) {
    var W = 390;
    screen.style.borderRadius = (radius || 40) + 'px';
    function apply() {
      var sw = shot.clientWidth, sh = shot.clientHeight, q = quad();
      var pts = q.map(function (p) { return [p[0] * sw, p[1] * sh]; });
      var cx = (pts[0][0] + pts[2][0]) / 2, cy = (pts[0][1] + pts[2][1]) / 2;
      var out = pts.map(function (p) { return [cx + (p[0] - cx) * 1.012, cy + (p[1] - cy) * 1.008]; });
      var wpx = Math.hypot(out[1][0] - out[0][0], out[1][1] - out[0][1]);
      var hpx = Math.hypot(out[3][0] - out[0][0], out[3][1] - out[0][1]);
      var H = Math.round(W * hpx / wpx);
      screen.style.width = W + 'px'; screen.style.height = H + 'px';
      screen.style.transform = matrix3d(W, H, out);
    }
    apply();
    if (window.ResizeObserver) new ResizeObserver(apply).observe(shot);
    return apply;
  }

  /* ---------- floating cards: spring + drag + tilt + pointer parallax ---------- */
  function Floaters(stage, opts) {
    opts = opts || {};
    var list = [], px = 0, py = 0, active = true, raf = 0;

    function add(cfg) {
      var btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'fl' + (cfg.cls ? ' ' + cfg.cls : '');
      var tilt = document.createElement('span'); tilt.className = 'fl__tilt';
      var face = document.createElement('span'); face.className = 'fl__face';
      var el = card(cfg.box);
      face.appendChild(el); tilt.appendChild(face); btn.appendChild(tilt); stage.appendChild(btn);

      var f = {
        btn: btn, tilt: tilt, face: face, card: el, cfg: cfg,
        x: 0, y: 0, vx: 0, vy: 0, s: 1, vs: 0, targetS: 1, rx: 0, ry: 0, tx: 0, ty: 0,
        phase: Math.random() * 6.28, drag: false, hx: 0, hy: 0, w: 0, h: 0
      };
      label(f);
      wire(f);
      list.push(f);
      measure(f);
      return f;
    }
    function label(f) {
      var b = f.card._b;
      f.btn.setAttribute('aria-label', 'Top-up box ' + b.name + ', saat ini ' + fmt(b.amount));
    }
    function measure(f) {
      var r = stage.getBoundingClientRect();
      f.w = f.btn.offsetWidth; f.h = f.btn.offsetHeight;
      var p = f.cfg.pos(r.width, r.height);
      f.hx = p[0] - f.w / 2; f.hy = p[1] - f.h / 2;
    }
    function wire(f) {
      var sx, sy, ox, oy, moved, id;
      f.btn.addEventListener('pointerdown', function (e) {
        f.btn.setPointerCapture(id = e.pointerId);
        sx = e.clientX; sy = e.clientY; ox = f.x; oy = f.y; moved = false; f.drag = true; f.targetS = 1.06;
        f.btn.style.zIndex = 40;
      });
      f.btn.addEventListener('pointermove', function (e) {
        var r = f.btn.getBoundingClientRect();
        if (!f.drag) {
          f.tx = ((e.clientY - r.top) / r.height - .5) * -16;
          f.ty = ((e.clientX - r.left) / r.width - .5) * 16;
          return;
        }
        var dx = e.clientX - sx, dy = e.clientY - sy;
        if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
        f.x = ox + dx; f.y = oy + dy; f.vx = f.vy = 0;
        f.tx = clamp(-dy * .06, -16, 16); f.ty = clamp(dx * .06, -16, 16);
      });
      function up(e) {
        if (!f.drag) return;
        f.drag = false; f.targetS = 1; f.tx = f.ty = 0; f.btn.style.zIndex = '';
        if (id !== undefined && f.btn.hasPointerCapture(id)) f.btn.releasePointerCapture(id);
        if (!moved && e.type === 'pointerup' && opts.onTap) opts.onTap(f);
      }
      f.btn.addEventListener('pointerup', up);
      f.btn.addEventListener('pointercancel', up);
      f.btn.addEventListener('pointerleave', function () { if (!f.drag) f.tx = f.ty = 0; });
      f.btn.addEventListener('keydown', function (e) {
        if ((e.key === 'Enter' || e.key === ' ') && opts.onTap) { e.preventDefault(); opts.onTap(f); }
      });
    }

    /* Launch from a rect (usually a card inside the phone) to the card's home slot. */
    function launchFrom(f, rect) {
      var r = stage.getBoundingClientRect();
      measure(f);
      f.x = rect.left + rect.width / 2 - r.left - f.w / 2 - f.hx;
      f.y = rect.top + rect.height / 2 - r.top - f.h / 2 - f.hy;
      f.s = rect.width / f.w; f.vx = f.vy = 0;
      if (REDUCED) { f.x = f.y = 0; f.s = 1; }
      write(f, 0);
      f.btn.style.visibility = 'visible';
    }

    function swap(f, next) {
      if (REDUCED) { fillCard(f.card, clone(next)); label(f); return Promise.resolve(); }
      var face = f.face;
      return face.animate([{ transform: 'rotateY(0deg) scale(1)' }, { transform: 'rotateY(90deg) scale(.92)' }], { duration: 240, easing: 'ease-in' }).finished.then(function () {
        fillCard(f.card, clone(next)); label(f);
        return face.animate([{ transform: 'rotateY(-90deg) scale(.92)' }, { transform: 'rotateY(0deg) scale(1)' }], { duration: 420, easing: 'cubic-bezier(.34,1.56,.64,1)' }).finished;
      });
    }

    function write(f, t) {
      var amp = f.cfg.amp === undefined ? 7 : f.cfg.amp, d = f.cfg.depth === undefined ? 14 : f.cfg.depth;
      var bobX = Math.sin(t * .0006 + f.phase) * amp * .55, bobY = Math.cos(t * .0008 + f.phase) * amp;
      var X = f.hx + f.x + bobX + px * d, Y = f.hy + f.y + bobY + py * d;
      var rot = (f.cfg.rot || 0) + Math.sin(t * .0005 + f.phase) * 1.1;
      f.btn.style.transform = 'translate3d(' + X.toFixed(2) + 'px,' + Y.toFixed(2) + 'px,0) rotate(' + rot.toFixed(2) + 'deg) scale(' + f.s.toFixed(3) + ')';
      f.tilt.style.transform = 'perspective(800px) rotateX(' + f.rx.toFixed(2) + 'deg) rotateY(' + f.ry.toFixed(2) + 'deg)';
    }
    function frame(t) {
      raf = 0;
      if (!active) return;
      list.forEach(function (f) {
        if (!f.drag) {
          f.vx = (f.vx + (-f.x) * .05) * .8; f.vy = (f.vy + (-f.y) * .05) * .8;
          f.x += f.vx; f.y += f.vy;
        }
        f.vs = (f.vs + (f.targetS - f.s) * .1) * .75; f.s += f.vs;
        f.rx += (f.tx - f.rx) * .14; f.ry += (f.ty - f.ry) * .14;
        write(f, t);
      });
      raf = requestAnimationFrame(frame);
    }
    function start() { if (!raf && active) raf = requestAnimationFrame(frame); }

    if (!REDUCED) {
      window.addEventListener('pointermove', function (e) {
        px = (e.clientX / window.innerWidth - .5) * -1;
        py = (e.clientY / window.innerHeight - .5) * -1;
      }, { passive: true });
    }
    window.addEventListener('resize', function () { list.forEach(measure); if (REDUCED) list.forEach(function (f) { write(f, 0); }); });
    document.addEventListener('visibilitychange', function () { active = !document.hidden; start(); });
    if (window.IntersectionObserver) new IntersectionObserver(function (es) { active = es[0].isIntersecting; start(); }).observe(stage);

    return {
      list: list, add: add, launchFrom: launchFrom, swap: swap,
      start: function () {
        if (REDUCED) { list.forEach(function (f) { measure(f); f.x = f.y = 0; f.s = 1; write(f, 0); }); return; }
        start();
      }
    };
  }

  /* ---------- page chrome ---------- */
  function chrome() {
    var nav = document.querySelector('[data-nav]'), burger = document.querySelector('[data-burger]');
    if (burger) burger.addEventListener('click', function () {
      var o = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', o ? 'true' : 'false');
      document.body.style.overflow = o ? 'hidden' : '';
    });
    document.querySelectorAll('a[href="#"]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); }); });

    // Small bar to hop between options while reviewing. Add ?clean to the URL to hide it.
    var page = document.body.dataset.xp;
    if (page && !/[?&]clean\b/.test(location.search)) {
      var bar = document.createElement('nav');
      bar.className = 'xp'; bar.setAttribute('aria-label', 'Pindah opsi eksplorasi');
      var names = ['Genggam', 'Senyum', 'Dinding Box', 'Panggung'], html = '<a href="../">Semua</a><i></i>';
      names.forEach(function (n, i) {
        var no = i + 1;
        html += '<a href="../option-0' + no + '/"' + (String(no) === page ? ' aria-current="page"' : '') + ' aria-label="Opsi ' + no + ': ' + n + '">' + no + '<span> ' + n + '</span></a>';
      });
      bar.innerHTML = html;
      document.body.appendChild(bar);
    }
  }
  document.addEventListener('DOMContentLoaded', chrome);

  /* The option pages share one driver: lift cards out of a phone, keep them moving. */
  function runPhoneHero(cfg) {
    var shot = document.querySelector('[data-shot]'), screen = shot.querySelector('.shot__screen'), stage = document.querySelector('[data-stage]');
    var ids = BOXES.map(function (b) { return b.id; });
    var app = phone(screen, ids.slice(0, 10));
    var repin = pin(shot, screen, cfg.quad, cfg.radius);

    var queue = ids.slice(), qi = 5;
    function nextBox(exclude) {
      for (var n = 0; n < queue.length; n++) {
        var b = byId(queue[qi++ % queue.length]);
        if (exclude.indexOf(b.id) < 0 && b.target) return b;
      }
      return BOXES[0];
    }
    function onScreenIds() { return fl.list.map(function (f) { return f.card._b.id; }); }

    var fl = Floaters(stage, {
      onTap: function (f) {
        var b = f.card._b, r = f.btn.getBoundingClientRect(), step = (b.target || b.amount * 4) * .18;
        toast(r.left + r.width / 2, r.top, '+' + fmt(step));
        app.add(step);
        fillTo(f.card, b.amount + step, 520).then(function (hit) {
          if (hit) { burst(r.left + r.width / 2, r.top + r.height / 2, 34); tint(b); }
        });
        tint(b);
      }
    });
    function tint(b) { if (cfg.onTint) cfg.onTint(b); }

    cfg.slots.forEach(function (s, i) {
      var f = fl.add({ box: byId(s.id), pos: s.pos, rot: s.rot, depth: s.depth, cls: s.cls });
      f.btn.style.visibility = 'hidden';
      f.index = i;
    });

    var visible = function () {
      return fl.list.filter(function (f) { return f.btn.offsetParent !== null || getComputedStyle(f.btn).display !== 'none'; });
    };

    function launch() {
      var rect = screen.getBoundingClientRect();
      return Promise.all(fl.list.map(function (f, i) {
        return wait(i * 150).then(function () {
          if (getComputedStyle(f.btn).display === 'none') return;
          var src = app.find(f.card._b.id), rc = src ? src.getBoundingClientRect() : rect;
          if (src) src.classList.add('is-lifted');
          fl.launchFrom(f, rc);
        });
      }));
    }

    // Slow auto-scroll inside the phone so the list reads as "many boxes".
    function autoScroll() {
      if (REDUCED) return;
      var max = app.scroll.offsetHeight - app.scroll.parentNode.offsetHeight;
      if (max <= 0) return;
      app.scroll.animate([
        { transform: 'translateY(0)' }, { transform: 'translateY(0)', offset: .08 },
        { transform: 'translateY(' + -max + 'px)', offset: .5 }, { transform: 'translateY(' + -max + 'px)', offset: .58 },
        { transform: 'translateY(0)' }
      ], { duration: 22000, iterations: Infinity, easing: 'ease-in-out' });
    }

    // Loop: one card swaps goal, the next one fills to 100%.
    var hovering = false;
    stage.addEventListener('pointerover', function (e) { if (e.target.closest('.fl')) hovering = true; });
    stage.addEventListener('pointerout', function (e) { if (e.target.closest('.fl')) hovering = false; });

    async function loop() {
      var i = 0;
      while (!REDUCED) {
        await wait(cfg.beat || 2400);
        if (document.hidden || hovering) continue;
        var live = visible().filter(function (f) { return !f.drag; });
        if (!live.length) continue;

        var f = live[i++ % live.length];
        var b = nextBox(onScreenIds());
        await fl.swap(f, b);
        tint(f.card._b);
        await wait(700);

        var g = live[i++ % live.length], box = g.card._b;
        if (!box.target || g.drag) continue;
        var r = function () { return g.btn.getBoundingClientRect(); };
        var from = box.target * .08;
        box.amount = from; paint(g.card);
        tint(box);
        var hit = await fillTo(g.card, box.target, 1900);
        if (hit) {
          var q = r();
          burst(q.left + q.width / 2, q.top + q.height / 2, 30);
          g.targetS = 1.08; await wait(240); g.targetS = 1;
          await wait(900);
        }
      }
    }

    fl.start();
    return wait(cfg.delay === undefined ? 600 : cfg.delay).then(launch).then(function () {
      autoScroll();
      loop();
      if (cfg.onReady) cfg.onReady({ fl: fl, app: app, repin: repin });
      return { fl: fl, app: app, repin: repin };
    });
  }

  window.HB = {
    BOXES: BOXES, byId: byId, fmt: fmt, card: card, clone: clone, fillCard: fillCard, fillTo: fillTo, paint: paint, pctOf: pctOf,
    tween: tween, wait: wait, ease: ease, burst: burst, toast: toast, iconSrc: iconSrc,
    phone: phone, pin: pin, Floaters: Floaters, runPhoneHero: runPhoneHero, REDUCED: REDUCED, clamp: clamp
  };
})();
