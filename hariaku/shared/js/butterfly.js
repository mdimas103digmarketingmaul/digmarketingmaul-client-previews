/* HARIAKU — Kupu-kupu
   The master butterfly path is rendered twice; each copy is clipped to one half of the
   symmetry axis and rotated in 3D (rotateY) around that axis. At 0deg the two halves
   reassemble into the exact logo.

   Flight: perches are elements marked [data-perch]. Each perch owns a scroll "anchor"
   (the scroll position where the perch sits at `focus` of the viewport). Between two
   anchors the butterfly flies along a cubic curve from one perch to the next; at each
   anchor it rests for a while (dwell), sitting on the element and scrolling with it.

   Perch attributes
     data-perch               marks a perch (value = optional id)
     data-perch-x / -y        0..1 inside the element's box (default .5/.5)
     data-perch-dx / -dy      extra px offset
     data-perch-dvh           extra offset in vh (for perches on tall pinned sections)
     data-perch-size          butterfly width in px at this perch, or "fit" (= element width)
     data-perch-mx            x override on narrow screens (0..1)
   Sections may carry data-bf-tone="dark" so the butterfly switches to its light ink.

   API: HKButterfly.init(opts) → instance with flyTo(el, ms), sweep(el, ms), flutter(), refresh()
*/
(function () {
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var easeInOut = function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  var smooth = function (t) { return t * t * (3 - 2 * t); };

  function bez(p0, c1, c2, p1, t) {
    var u = 1 - t;
    return {
      x: u * u * u * p0.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p1.x,
      y: u * u * u * p0.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p1.y
    };
  }

  function Butterfly(opts) {
    this.o = Object.assign({
      size: 46,            // width (px) while flying
      focus: .44,          // where a perch sits in the viewport when the butterfly lands on it
      dwell: .2,           // share of a segment spent resting on the perch
      wander: .32,         // sideways swing of the flight path (share of viewport width)
      thread: true,        // draw the stitched trail
      threadColor: 'currentColor',
      lag: 5.5,            // follow stiffness (higher = tighter)
      ink: '#B55B32',
      inkDark: '#F5E8CE',
      z: 60,
      intro: true
    }, opts || {});
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.state = { x: 0, y: 0, vx: 0, vy: 0, size: this.o.size, phase: 0, rest: 0, boost: 0, tilt: 0, flee: { x: 0, y: 0 } };
    this.override = null;
    this.build();
    this.refresh();
    var self = this;
    var t;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(function () { self.refresh(); }, 120); });
    if ('ResizeObserver' in window) new ResizeObserver(function () { clearTimeout(t); t = setTimeout(function () { self.refresh(); }, 160); }).observe(document.body);
    window.addEventListener('load', function () { self.refresh(); });
    if (!this.reduced) {
      window.addEventListener('pointermove', function (e) { self.pointer = { x: e.clientX, y: e.clientY, t: performance.now() }; }, { passive: true });
      this.el.addEventListener('click', function () { self.flutter(); });
      this.last = performance.now();
      this.snapToTarget();
      if (this.o.intro) { this.state.boost = 1.4; this.introAt = performance.now(); }
      requestAnimationFrame(function loop(now) { self.tick(now); requestAnimationFrame(loop); });
    } else {
      this.placeStatic();
    }
  }

  Butterfly.prototype.build = function () {
    var svg = window.HK.svg('butterfly');
    var el = document.createElement('div');
    el.className = 'hk-fly' + (this.reduced ? ' hk-fly--static' : '');
    el.setAttribute('aria-hidden', 'true');
    el.style.zIndex = this.o.z;
    el.innerHTML = '<div class="hk-fly__body"><div class="hk-fly__wing hk-fly__wing--l">' + svg + '</div><div class="hk-fly__wing hk-fly__wing--r">' + svg + '</div></div>';
    document.body.appendChild(el);
    this.el = el;
    this.body = el.firstChild;
    this.wl = this.body.children[0];
    this.wr = this.body.children[1];
    el.style.color = this.o.ink;

    if (this.o.thread && !this.reduced) {
      var ns = 'http://www.w3.org/2000/svg';
      var s = document.createElementNS(ns, 'svg');
      s.setAttribute('class', 'hk-thread');
      s.setAttribute('aria-hidden', 'true');
      s.style.color = this.o.threadColor === 'currentColor' ? this.o.ink : this.o.threadColor;
      document.body.appendChild(s);
      this.thread = s;
    }
  };

  Butterfly.prototype.refresh = function () {
    var vw = window.innerWidth, vh = window.innerHeight;
    var narrow = vw < 760;
    var sy = window.scrollY;
    var maxScroll = Math.max(0, document.documentElement.scrollHeight - vh);
    var o = this.o;
    var perches = [];
    document.querySelectorAll('[data-perch]').forEach(function (el) {
      if (!el.offsetParent && el.getClientRects().length === 0) return;
      var r = el.getBoundingClientRect();
      var px = parseFloat((narrow && el.dataset.perchMx) || el.dataset.perchX || .5);
      var py = parseFloat(el.dataset.perchY || .5);
      var size = el.dataset.perchSize === 'fit' ? r.width : parseFloat(el.dataset.perchSize || o.size);
      if (narrow) size = Math.min(size * .78, vw * .5);
      perches.push({
        el: el,
        x: r.left + r.width * px + parseFloat(el.dataset.perchDx || 0),
        y: r.top + sy + r.height * py + parseFloat(el.dataset.perchDy || 0) + vh * parseFloat(el.dataset.perchDvh || 0) / 100,
        size: size,
        focus: el.dataset.perchFocus ? parseFloat(el.dataset.perchFocus) : o.focus,          // where it sits on screen when it lands
        hold: el.dataset.perchHold ? parseFloat(el.dataset.perchHold) * vh : null,           // stay this long (px of scroll)
        glide: !!el.dataset.perchGlide                                                        // next flight is drawn in screen space
      });
    });
    perches.sort(function (a, b) { return a.y - b.y; });
    var prev = -Infinity;
    perches.forEach(function (p, i) {
      var a = clamp(p.y - vh * p.focus, 0, maxScroll);
      if (a <= prev) a = prev + 1;
      p.anchor = a; prev = a;
      // control points: alternate sides, swing scales with distance
      if (i > 0) {
        var q = perches[i - 1];
        var dy = p.y - q.y;
        var side = (i % 2 ? 1 : -1) * (q.x > vw / 2 ? -1 : 1);
        var amp = Math.min(vw * o.wander, Math.abs(dy) * .45 + 60) * side;
        if (narrow) amp *= .5;
        q.c1 = { x: q.x + amp, y: q.y + dy * .3 };
        q.c2 = { x: p.x + amp * .55, y: p.y - dy * .32 };
      }
    });
    this.perches = perches;
    this.vw = vw; this.vh = vh; this.narrow = narrow;
    this.sections = [].slice.call(document.querySelectorAll('[data-bf-tone]')).map(function (s) {
      var r = s.getBoundingClientRect();
      return { top: r.top + sy, bottom: r.bottom + sy, tone: s.dataset.bfTone };
    });
    if (this.thread) this.drawThread();
    if (this.reduced) this.placeStatic();
  };

  Butterfly.prototype.drawThread = function () {
    var s = this.thread, p = this.perches, ns = 'http://www.w3.org/2000/svg';
    var h = document.documentElement.scrollHeight;
    s.setAttribute('width', this.vw);
    s.setAttribute('height', h);
    s.setAttribute('viewBox', '0 0 ' + this.vw + ' ' + h);
    s.style.height = h + 'px';
    s.innerHTML = '';
    var defs = document.createElementNS(ns, 'defs');
    s.appendChild(defs);
    this.segs = [];
    for (var i = 0; i < p.length - 1; i++) {
      var a = p[i], b = p[i + 1];
      if (a.glide) { this.segs.push(null); continue; }
      var d = 'M' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) + ' C' + a.c1.x.toFixed(1) + ' ' + a.c1.y.toFixed(1) + ' ' + a.c2.x.toFixed(1) + ' ' + a.c2.y.toFixed(1) + ' ' + b.x.toFixed(1) + ' ' + b.y.toFixed(1);
      var mask = document.createElementNS(ns, 'mask');
      mask.setAttribute('id', 'hk-thread-m' + i);
      mask.setAttribute('maskUnits', 'userSpaceOnUse');
      var rev = document.createElementNS(ns, 'path');
      rev.setAttribute('d', d);
      rev.setAttribute('class', 'hk-thread__reveal');
      mask.appendChild(rev);
      defs.appendChild(mask);
      var st = document.createElementNS(ns, 'path');
      st.setAttribute('d', d);
      st.setAttribute('class', 'hk-thread__stitch');
      st.setAttribute('mask', 'url(#hk-thread-m' + i + ')');
      s.appendChild(st);
      var len = rev.getTotalLength();
      rev.style.strokeDasharray = len + ' ' + len;
      rev.style.strokeDashoffset = len;
      this.segs.push({ rev: rev, len: len, shown: -1 });
    }
  };

  // where the butterfly should be (document coords) for a scroll position
  Butterfly.prototype.target = function (sy) {
    var p = this.perches, o = this.o;
    if (!p.length) return { x: this.vw - 60, y: sy + this.vh * .3, size: o.size, perched: false, seg: -1, e: 0 };
    if (sy <= p[0].anchor) return { x: p[0].x, y: p[0].y, size: p[0].size, perched: true, seg: -1, e: 0 };
    for (var i = 0; i < p.length - 1; i++) {
      var a = p[i], b = p[i + 1];
      if (sy < b.anchor) {
        var span = b.anchor - a.anchor;
        if (a.glide) {
          // screen-space glide: from where `a` sat on screen to where `b` will sit when it lands,
          // with a soft sideways sway, so the butterfly stays in view and drifts instead of jumping
          var ug = clamp((sy - a.anchor) / Math.max(1, span), 0, 1), eg = easeInOut(ug);
          var ay = a.y - a.anchor, by = b.y - b.anchor;
          var sway = Math.sin(eg * Math.PI) * Math.min(this.vw * .07, 80) * (b.x > a.x ? -1 : 1);
          return { x: lerp(a.x, b.x, eg) + sway, y: sy + lerp(ay, by, eg), size: lerp(a.size, b.size, smooth(eg)), perched: ug === 0 || ug === 1, seg: i, e: eg };
        }
        var dw0 = Math.min(o.dwell * span, this.vh * .28);
        var dw = a.hold != null ? Math.min(a.hold, span * .8) : dw0;
        var u = clamp((sy - a.anchor - dw) / Math.max(span * .15, span - dw - dw0 * .6), 0, 1);
        var e = easeInOut(u);
        var pt = bez(a, a.c1, a.c2, b, e);
        // size: shrink to flight size, then grow into the next perch
        var fly = o.size * (this.narrow ? .8 : 1);
        var size = e < .5 ? lerp(a.size, fly, smooth(clamp(e * 3, 0, 1))) : lerp(fly, b.size, smooth(clamp((e - .66) * 3, 0, 1)));
        return { x: pt.x, y: pt.y, size: size, perched: u === 0 || u === 1, seg: i, e: e };
      }
    }
    var last = p[p.length - 1];
    return { x: last.x, y: last.y, size: last.size, perched: true, seg: p.length - 2, e: 1 };
  };

  Butterfly.prototype.snapToTarget = function () {
    var t = this.target(window.scrollY);
    this.state.x = t.x; this.state.y = t.y; this.state.size = t.size;
  };

  Butterfly.prototype.placeStatic = function () {
    var p = this.perches && this.perches[0];
    if (!p) return;
    this.el.style.position = 'absolute';
    this.body.style.width = p.size + 'px';
    this.body.style.height = p.size * .7464 + 'px';
    this.body.style.transform = 'translate3d(' + (p.x - p.size / 2) + 'px,' + (p.y - p.size * .3732) + 'px,0)';
  };

  Butterfly.prototype.tick = function (now) {
    var dt = Math.min(.05, (now - this.last) / 1000);
    this.last = now;
    if (!dt) return;
    var S = this.state, sy = window.scrollY, vh = this.vh, vw = this.vw;
    var T = this.target(sy);

    // temporary flight to an element (Try Me, CTAs)
    if (this.pinned) {
      var pt = this.pinned(sy);
      T = { x: pt.x, y: pt.y, size: pt.size || T.size, perched: true, seg: T.seg, e: T.e };
    } else if (this.override) {
      var ov = this.override, k = clamp((now - ov.start) / ov.ms, 0, 1);
      var r = ov.el.getBoundingClientRect();
      var dest = { x: r.left + r.width * (ov.x == null ? .5 : ov.x), y: r.top + sy + r.height * (ov.y == null ? 0 : ov.y) - (ov.lift || 0) };
      if (ov.path) { dest = ov.path(k, r, sy); }
      var hold = ov.hold && k >= 1;
      T = { x: dest.x, y: dest.y, size: ov.size || T.size, perched: hold, seg: T.seg, e: T.e };
      if (k >= 1 && now - ov.start > ov.ms + (ov.hold || 0)) { this.override = null; }
    }

    // keep the butterfly inside the viewport while it travels
    var margin = S.size * .7 + 10;
    var ty = clamp(T.y, sy + vh * .1, sy + vh - margin);
    var tx = clamp(T.x, margin, vw - margin);
    if (T.perched) { ty = T.y; tx = T.x; }

    // pointer: shy away when the cursor comes close (desktop only)
    if (this.pointer && !this.narrow && !this.pinned && now - this.pointer.t < 1500) {
      var dx = S.x - this.pointer.x, dyp = (S.y - sy) - this.pointer.y, dist = Math.hypot(dx, dyp);
      if (dist < 90) {
        var f = (90 - dist) / 90;
        S.flee.x += (dx / (dist || 1)) * f * 22;
        S.flee.y += (dyp / (dist || 1)) * f * 22;
        S.boost = Math.max(S.boost, .7);
      }
    }
    S.flee.x *= Math.exp(-dt * 3.2); S.flee.y *= Math.exp(-dt * 3.2);

    var k2 = this.pinned ? (this.hidden ? 1 : 1 - Math.exp(-dt * 16)) : 1 - Math.exp(-dt * (this.override ? 4.2 : this.o.lag));
    var nx = lerp(S.x, tx + S.flee.x, k2), ny = lerp(S.y, ty + S.flee.y, k2);
    S.vx = lerp(S.vx, (nx - S.x) / dt, .2);
    S.vy = lerp(S.vy, (ny - S.y) / dt, .2);
    S.x = nx; S.y = ny;
    S.size = this.hidden ? T.size : lerp(S.size, T.size, 1 - Math.exp(-dt * (this.pinned ? 10 : 4)));

    var speed = Math.hypot(S.vx, S.vy);
    var moving = clamp(speed / 520, 0, 1);
    S.rest = (speed < 14 && !S.boost) ? S.rest + dt : 0;
    S.boost = Math.max(0, S.boost - dt * .9);

    // wing beat
    // at rest it never freezes: a slow, breathing beat that swells now and then
    var resting = S.rest > .5;
    var swell = .5 + .5 * Math.sin(now / 2300);
    var freq = resting ? .62 + swell * .38 : 2.1 + moving * 3.4 + S.boost * 3;
    var amp = resting ? 34 + swell * 30 : 52 + moving * 22 + S.boost * 10;
    S.phase += dt * Math.PI * 2 * freq;
    var w = .5 - .5 * Math.cos(S.phase);
    var ang = amp * w;
    if (this.introAt && now - this.introAt < 900) ang = lerp(84, ang, smooth((now - this.introAt) / 900));

    // drift & tilt
    var bob = Math.sin(now / 520) * (resting ? 1.5 : 4);
    S.tilt = lerp(S.tilt, clamp(S.vx * .028, -22, 22), .12);
    var pitch = clamp(-S.vy * .02, -18, 18);

    var h = S.size * .7464; // butterfly box ratio (418 / 560)
    var x = S.x - S.size / 2, y = S.y - sy - h / 2 + bob;
    this.body.style.width = S.size.toFixed(1) + 'px';
    this.body.style.height = h.toFixed(1) + 'px';
    this.body.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) rotate(' + S.tilt.toFixed(2) + 'deg) rotateX(' + pitch.toFixed(2) + 'deg)';
    this.wl.style.transform = 'rotateY(' + ang.toFixed(2) + 'deg)';
    this.wr.style.transform = 'rotateY(' + (-ang).toFixed(2) + 'deg)';

    // ink follows the section underneath
    var tone = 'light';
    for (var i = 0; i < this.sections.length; i++) {
      var sct = this.sections[i];
      if (S.y >= sct.top && S.y < sct.bottom) tone = sct.tone;
    }
    if (tone !== this.tone) {
      this.tone = tone;
      this.el.style.color = tone === 'dark' ? this.o.inkDark : this.o.ink;
      this.el.classList.toggle('is-dark', tone === 'dark');
    }

    // stitched trail
    if (this.segs) {
      for (var j = 0; j < this.segs.length; j++) {
        var sg = this.segs[j];
        if (!sg) continue;
        var prog = j < T.seg ? 1 : j > T.seg ? 0 : T.e;
        if (Math.abs(prog - sg.shown) > .002) {
          sg.shown = prog;
          sg.rev.style.strokeDashoffset = (sg.len * (1 - prog)).toFixed(1);
        }
      }
    }
  };

  Butterfly.prototype.flutter = function () { this.state.boost = 1.6; };

  // follow fn(scrollY) -> {x, y, size} in document coords (e.g. something inside a sticky scene)
  Butterfly.prototype.pin = function (fn) { this.pinned = fn; };
  Butterfly.prototype.unpin = function () { if (this.pinned) { this.pinned = null; this.state.boost = 1.2; } };
  Butterfly.prototype.hide = function (on) {
    on = !!on;
    if (on === !!this.hidden) return;
    this.hidden = on;
    this.el.classList.toggle('is-hidden', on);
    if (!on) this.state.boost = 1.6;
  };

  // fly to an element and hover over it for `hold` ms
  Butterfly.prototype.flyTo = function (el, ms, extra) {
    if (this.reduced || !el) return Promise.resolve();
    var self = this;
    this.override = Object.assign({ el: el, ms: ms || 1200, start: performance.now(), hold: 1600, lift: 8 }, extra || {});
    this.state.boost = 1;
    return new Promise(function (res) { setTimeout(res, (ms || 1200)); });
  };

  // sweep across an element from left to right along a soft arc (used as a reveal)
  Butterfly.prototype.sweep = function (el, ms) {
    if (this.reduced || !el) return Promise.resolve();
    ms = ms || 1400;
    var self = this;
    this.override = {
      el: el, ms: ms, start: performance.now(), hold: 300, size: Math.max(this.o.size, 64),
      path: function (k, r, sy) {
        var e = easeInOut(k);
        return { x: r.left - 40 + (r.width + 80) * e, y: r.top + sy + r.height * (.55 - Math.sin(e * Math.PI) * .25) };
      }
    };
    this.state.boost = 1.6;
    return new Promise(function (res) { setTimeout(res, ms); });
  };

  window.HKButterfly = {
    init: function (opts) {
      var make = function () { window.HKButterfly.instance = new Butterfly(opts); };
      if (document.readyState !== 'loading') make();
      else document.addEventListener('DOMContentLoaded', make);
    }
  };
})();
