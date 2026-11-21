/* HARIAKU — metamorphosis hero (used by Option 02 and Option 04).
   One family photo, three arches (the little one, the big sister, then mum & dad) that open in step
   with a caterpillar → chrysalis → butterfly. The real (flying) butterfly is born from the chrysalis:
   it is pinned there while the scene is sticky and released when the hero ends.
   Markup: see option-02/index.html (section[data-room]). Styles: shared/css/meta.css. */
(function () {
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var clamp01 = function (v) { return clamp(v, 0, 1); };
  var smooth = function (t) { t = clamp01(t); return t * t * (3 - 2 * t); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var narrow = function () { return innerWidth < 760; };

  function mount(room) {
    var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var AR = 2000 / 1116;
    var ARCH = { kid: [.628, .782, .38], sis: [.25, .43, .17], fam: [.235, .80, 0] };   // x0, x1, top (share of the photo)
    var arches = {}, tags = {};
    room.querySelectorAll('[data-arch]').forEach(function (f) { arches[f.dataset.arch] = { el: f, img: f.querySelector('img') }; });
    room.querySelectorAll('[data-tag]').forEach(function (t) { tags[t.dataset.tag] = t; });
    var meta = room.querySelector('[data-meta]'), larvaG = meta.querySelector('[data-larva]'), pupa = meta.querySelector('[data-pupa]');
    var halves = [].slice.call(pupa.querySelectorAll('[data-half]'));
    var poem = room.querySelector('.room__poem'), plines = [].slice.call(poem.querySelectorAll('[data-line]'));
    var copy = room.querySelector('.room__copy'), hint = room.querySelector('.room__scroll');
    var NS = 'http://www.w3.org/2000/svg', N = 7, GAP = 11.5;

    // twig height at x (sampled once from the path)
    var twig = meta.querySelector('[data-twig]'), twigPts = [];
    (function () { var L = twig.getTotalLength(); for (var i = 0; i <= 80; i++) { var q = twig.getPointAtLength(L * i / 80); twigPts.push(q); } })();
    function twigY(x) {
      for (var i = 1; i < twigPts.length; i++) if (twigPts[i].x >= x) { var a = twigPts[i - 1], b = twigPts[i]; return a.y + (b.y - a.y) * (x - a.x) / ((b.x - a.x) || 1); }
      return twigPts[twigPts.length - 1].y;
    }
    var AX = 150, AY = twigY(AX);
    pupa.setAttribute('transform', 'translate(0 ' + (AY - 46).toFixed(1) + ')');

    // caterpillar: head (i = 0) to tail, drawn tail first so the head sits on top
    var segs = [];
    for (var i = N - 1; i >= 0; i--) {
      var r = i === 0 ? 10 : 8.6 - Math.max(0, i - 3) * .7;
      var g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'meta__seg' + (i === 0 ? ' meta__seg--head' : ''));
      var inner = '<g class="meta__bob" style="--i:' + i + '">' +
        (i ? '<path class="leg" d="M-3 ' + (r - 1) + ' l-1.6 4.2 M3 ' + (r - 1) + ' l1.6 4.2"/>' : '') +
        '<circle r="' + r + '"/>' +
        (i && i % 2 ? '<circle class="spot" cx="0" cy="-2.5" r="2.1"/>' : '') +
        (i === 0 ? '<circle class="eye" cx="4.2" cy="-2.2" r="1.9"/><path class="ant" d="M-1 -9 q-2 -8 -8 -10 M4 -8.5 q3 -8 9 -9"/><circle class="ant-tip" cx="-9" cy="-19.2" r="1.7"/><circle class="ant-tip" cx="13" cy="-17.6" r="1.7"/>' : '') +
        '</g>';
      g.innerHTML = inner;
      larvaG.appendChild(g);
      segs[i] = { el: g, r: r };
    }

    var G = {}, introStart = performance.now(), introT = reduced ? 1 : 0;

    function layout() {
      var vw = innerWidth, vh = innerHeight, nav = narrow() ? 64 : 76, iw;
      if (narrow()) {
        iw = Math.min(vw * 1.8, (vh * .62 - nav - 4) * AR);
        G.ih = iw / AR; G.iy = Math.max(nav + 4, vh * .62 - G.ih);
        G.il = vw / 2 - .5175 * iw;
      } else {
        iw = Math.min(vw * 1.06, vh * .9 * AR);
        G.ih = iw / AR; G.iy = vh - G.ih;
        G.il = vw * .665 - .5175 * iw;
      }
      G.iw = iw; G.vw = vw; G.vh = vh;
      Object.keys(arches).forEach(function (k) {
        var im = arches[k].img;
        im.style.width = iw + 'px'; im.style.left = G.il + 'px'; im.style.top = G.iy + 'px';
      });
    }

    function archClip(k, e) {
      var a = ARCH[k], x0 = G.il + a[0] * G.iw, x1 = G.il + a[1] * G.iw;
      var yb = G.iy + G.ih, yt = G.iy + a[2] * G.ih, top = yb - (yb - yt) * e;
      var rx = (x1 - x0) / 2, ry = k === 'fam' ? G.ih * .16 : rx;
      arches[k].el.style.clipPath = 'inset(' + top.toFixed(1) + 'px ' + (G.vw - x1).toFixed(1) + 'px ' + (G.vh - yb).toFixed(1) + 'px ' + x0.toFixed(1) + 'px round ' +
        rx.toFixed(1) + 'px ' + rx.toFixed(1) + 'px 0 0 / ' + ry.toFixed(1) + 'px ' + ry.toFixed(1) + 'px 0 0)';
      return { x: (x0 + x1) / 2, y: top };
    }

    // svg point → viewport
    var mrect;
    function toScreen(x, y) { return { x: mrect.left + x * mrect.width / 240, y: mrect.top + y * mrect.height / 300 }; }

    var bfPoint = { x: 0, y: 0, size: 40 }, bfVisible = false;
    function paintRoom() {
      var p = reduced ? 1 : HK.progress(room);
      var it = smooth(introT);

      // arches
      var kid = archClip('kid', it);
      var sis = archClip('sis', smooth((p - .12) / .2));
      archClip('fam', smooth((p - .56) / .18));
      var older = 1 - smooth((p - .74) / .06);
      arches.kid.el.style.opacity = arches.sis.el.style.opacity = older;
      var tagOut = 1 - smooth((p - .62) / .08);
      tags.kid.style.left = kid.x + 'px'; tags.kid.style.top = kid.y + 'px'; tags.kid.style.opacity = it * tagOut;
      tags.sis.style.left = sis.x + 'px'; tags.sis.style.top = sis.y + 'px'; tags.sis.style.opacity = smooth((p - .2) / .1) * tagOut;

      // caterpillar: crawl along the twig, swing down into a J, then turn into the chrysalis
      var crawl = smooth((p - .03) / .27), hang = smooth((p - .31) / .12), form = smooth((p - .42) / .12);
      var hx = lerp(68, AX + (N - 1) * GAP, crawl);
      meta.classList.toggle('is-still', hang > .5);
      for (var i = 0; i < N; i++) {
        var s = segs[i], k = N - 1 - i;                     // k: steps from the tail
        var cx = hx - i * GAP, cy = twigY(cx) - s.r - 1;     // crawling, on top of the twig
        var vx0 = cx - AX, vy0 = cy - AY;
        var vx1 = k < 5 ? 0 : (k === 5 ? 9 : 13), vy1 = k < 5 ? 10 + k * GAP : (k === 5 ? 10 + 4 * GAP + 9 : 10 + 4 * GAP + 1);
        var r0 = Math.hypot(vx0, vy0), r1 = Math.hypot(vx1, vy1);
        var a0 = Math.atan2(vy0, vx0), a1 = Math.atan2(vy1, vx1);
        var rr = lerp(r0, r1, hang), aa = lerp(a0, a1, hang);
        var x = AX + Math.cos(aa) * rr, y = AY + Math.sin(aa) * rr;
        x = lerp(x, AX, form * .6); y = lerp(y, AY + 60, form * .35);
        var sc = 1 - form;
        var rot = i === 0 ? hang * 200 : 0;                 // the head curls up at the bottom of the J
        s.el.setAttribute('transform', 'translate(' + x.toFixed(2) + ' ' + y.toFixed(2) + ') rotate(' + rot.toFixed(1) + ') scale(' + sc.toFixed(3) + ')');
      }
      larvaG.style.opacity = 1 - smooth((p - .48) / .06);

      // chrysalis, then it splits along its stitched seam
      var open = smooth((p - .56) / .1);
      pupa.style.opacity = form * (1 - smooth((p - .63) / .08));
      pupa.style.transform = 'scale(' + (.7 + .3 * form).toFixed(3) + ',' + (.25 + .75 * form).toFixed(3) + ')';
      pupa.classList.toggle('is-swaying', form > .95 && open < .05);
      halves[0].style.transform = 'rotate(' + (open * 26).toFixed(2) + 'deg)';
      halves[1].style.transform = 'rotate(' + (-open * 26).toFixed(2) + 'deg)';

      // the butterfly: born in the chrysalis, climbs onto the twig
      mrect = meta.getBoundingClientRect();
      var born = smooth((p - .56) / .08), climb = smooth((p - .6) / .12);
      var unit = mrect.width / 240;
      var size = Math.max(narrow() ? 52 : 0, lerp(.1, .34, born) * mrect.width);
      var sp = toScreen(lerp(AX, AX - 18, climb), lerp(AY + 62, AY - size * .3 / unit - 4, climb));
      // at the end of the hero it lifts off the twig and glides to the centre of the screen, where the
      // next flight (down to the following section) picks it up without a jump
      var glide = smooth((p - .8) / .2), cp = centrePose();
      sp.x = lerp(sp.x, cp.x, glide);
      sp.y = lerp(sp.y, cp.y, glide) - Math.sin(glide * Math.PI) * 46;
      bfPoint.x = sp.x; bfPoint.y = sp.y; bfPoint.size = lerp(size, cp.size, glide);
      bfVisible = p >= .56;

      // words
      plines.forEach(function (l, i) {
        var st = [-1, .3, .56][i], nx = [.3, .56, 9][i];
        var lit = smooth((p - st) / .05), next = smooth((p - nx) / .05);
        l.style.opacity = (.16 + .84 * lit - .44 * next).toFixed(3);
      });
      var po = smooth((p - .74) / .06);
      poem.style.opacity = 1 - po;
      poem.style.transform = 'translateY(' + (-24 * po).toFixed(1) + 'px)';
      hint.style.opacity = 1 - smooth(p / .04);
      var c = smooth((p - .79) / .1);
      copy.style.opacity = c;
      copy.style.transform = 'translateY(' + (30 * (1 - c)).toFixed(1) + 'px)';
      copy.style.pointerEvents = c > .5 ? 'auto' : 'none';

      syncButterfly(p);
    }

    function syncButterfly(p) {
      var bf = window.HKButterfly && HKButterfly.instance;
      if (!bf || reduced) return;
      if (p >= 1) { bf.unpin(); bf.hide(false); return; }
      if (!bf.pinned) bf.pin(function (sy) { return { x: bfPoint.x, y: bfPoint.y + sy, size: bfPoint.size }; });
      bf.hide(!bfVisible);
    }

    function centrePose() { return { x: innerWidth * .5, y: innerHeight * .44, size: narrow() ? 58 : 72 }; }

    // after the hero, the butterfly's first perch is exactly where the hero left it (screen centre).
    // It is a "glide" perch: the next flight is drawn in screen space, so it drifts down smoothly
    // instead of first scrolling away with the page.
    function placeHeroPerch() {
      var span = reduced ? 0 : room.offsetHeight - innerHeight, sp, size;
      if (reduced) {
        mrect = meta.getBoundingClientRect();
        var unit = mrect.width / 240;
        size = Math.max(narrow() ? 52 : 0, .34 * mrect.width);
        sp = toScreen(AX - 18, AY - size * .3 / unit - 4);
      } else {
        sp = centrePose(); size = sp.size;
      }
      room.dataset.perchX = (sp.x / innerWidth).toFixed(4);
      room.dataset.perchDvh = ((span + sp.y) / innerHeight * 100).toFixed(2);
      room.dataset.perchFocus = (sp.y / innerHeight).toFixed(4);
      room.dataset.perchGlide = '1';
      room.dataset.perchSize = (narrow() ? size / .78 : size).toFixed(1);
      var bf = window.HKButterfly && HKButterfly.instance;
      if (bf) bf.refresh();
    }

    if (reduced) room.classList.add('is-static');
    layout();
    if (!reduced) {
      (function introLoop(now) {
        introT = clamp01((now - introStart - 250) / 1300);
        paintRoom();
        if (introT < 1) requestAnimationFrame(introLoop);
      })(performance.now());
    }

    addEventListener('resize', function () { layout(); paintRoom(); placeHeroPerch(); });
    HK.onScroll(paintRoom);
    return {
      paint: paintRoom,
      // call after HKButterfly.init()
      ready: function () { placeHeroPerch(); addEventListener('load', placeHeroPerch); paintRoom(); }
    };
  }

  window.HKMeta = { mount: mount };
})();
