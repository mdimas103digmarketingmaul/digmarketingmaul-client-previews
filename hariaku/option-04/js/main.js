/* Option 04 — Final */
HK.ready(function () {
  var A = HK.asset;
  var reduced = HK.reduced;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var smooth = function (t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  var narrow = function () { return innerWidth < 760; };
  var bf = function () { return window.HKButterfly && HKButterfly.instance; };

  // a row of damped pendulums (hangers, hangtags), nudged by the pointer
  function pendulums(els, k, damp) {
    var s = els.map(function () { return { a: 0, v: 0 }; }), running = false, last = 0;
    function step(now) {
      var dt = Math.min(.033, (now - last) / 1000); last = now;
      var moving = false;
      s.forEach(function (p, i) {
        p.v += (-k * p.a - damp * p.v) * dt;
        p.a += p.v * dt;
        if (Math.abs(p.a) > .02 || Math.abs(p.v) > .02) moving = true;
        els[i].style.setProperty('--sw', p.a.toFixed(3) + 'deg');
      });
      if (moving) requestAnimationFrame(step); else running = false;
    }
    function kick(i, imp) {
      if (reduced || !s[i]) return;
      s[i].v += imp;
      if (!running) { running = true; last = performance.now(); requestAnimationFrame(step); }
    }
    function follow(container, sel, gain) {
      var lastX = null;
      container.addEventListener('pointermove', function (e) {
        var el = e.target.closest(sel), vx = lastX == null ? 0 : e.clientX - lastX;
        lastX = e.clientX;
        if (el && Math.abs(vx) > 1) kick(els.indexOf(el), clamp(vx * gain, -40, 40));
      });
      container.addEventListener('pointerleave', function () { lastX = null; });
    }
    function wave(imp, gap) { els.forEach(function (el, i) { setTimeout(function () { kick(i, imp); }, i * gap); }); }
    function onView(el, fn, th) {
      if (!('IntersectionObserver' in window)) return;
      var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { fn(); io.disconnect(); } }, { threshold: th || .5 });
      io.observe(el);
    }
    return { kick: kick, follow: follow, wave: wave, onView: onView };
  }

  // ——— 1 · hero: metamorphosis ———
  var meta = HKMeta.mount(document.querySelector('[data-room]'));

  // ——— 2 · closet + Try Me ———
  var tryEl = document.querySelector('[data-tryon]');
  var tryon = HKTryOn.mount(tryEl, { picker: false, reveal: 'arch' });
  var rack = document.querySelector('[data-rack]');
  var items = HK.products.filter(function (p) { return p.tryOn; });
  var hangerSvg = '<svg class="hanger__hook" viewBox="0 0 64 34" aria-hidden="true"><path d="M32 14V10.5a4.5 4.5 0 1 0-4.5-4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M32 14 5 30.5h54L32 14Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  rack.innerHTML = items.map(function (p) {
    var c = HK.color(p, p.tryOn);
    return '<li class="hanger" data-slug="' + p.slug + '">' +
      '<button type="button" class="hanger__btn" aria-pressed="false" aria-label="Pakaikan ' + p.name + '">' + hangerSvg +
        '<span class="hanger__cloth"><img src="' + A(c.img) + '" alt="" loading="lazy" draggable="false"></span>' +
        '<span class="hanger__tag"><b>' + (p.short || p.name) + '</b><span>' + c.label + '</span></span>' +
      '</button></li>';
  }).join('');
  var hangers = [].slice.call(rack.querySelectorAll('.hanger'));
  function markActive(slug) {
    hangers.forEach(function (h) {
      var on = h.dataset.slug === slug;
      h.classList.toggle('is-on', on);
      h.querySelector('button').setAttribute('aria-pressed', on);
    });
  }
  markActive(tryon.state.product);
  var swing = pendulums(hangers, 38, 3.2);
  swing.follow(rack, '.hanger', 2.4);
  swing.onView(rack, function () { swing.wave(26, 90); });
  rack.addEventListener('click', function (e) {
    var h = e.target.closest('.hanger');
    if (!h) return;
    swing.kick(hangers.indexOf(h), 60);
    markActive(h.dataset.slug);
    tryon.setProduct(h.dataset.slug);
    var r = tryEl.querySelector('.to__frame').getBoundingClientRect();
    if (r.top < 0 || r.bottom > innerHeight) {
      var y = r.top + scrollY - 100;
      if (HK.lenis) HK.lenis.scrollTo(y, { duration: 1.2 }); else scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
    }
  });

  // the butterfly's first stop after the hero is the compare handle: it lands there as soon as the
  // frame peeks into view (focus .9) and stays while the frame is on screen (hold)
  var knob = tryEl.querySelector('.to__knob-dot');
  knob.dataset.perch = 'knob';
  knob.dataset.perchX = '.5';
  knob.dataset.perchY = '0';
  knob.dataset.perchDy = '2';
  knob.dataset.perchSize = '48';
  knob.dataset.perchFocus = '.9';
  knob.dataset.perchHold = '.75';
  tryEl.addEventListener('hk:tryon:compare', function () { var b = bf(); if (b) b.refresh(); });
  tryEl.addEventListener('hk:tryon:match', function () {
    var b = bf();
    if (!b) return;
    var buy = tryEl.querySelector('.to__buy');
    setTimeout(function () { b.flyTo(buy, 1300, { hold: 2400, lift: 18, x: .85 }); }, 900);
  });

  // ——— 3 · the Edit (pinned horizontal lookbook); a photo opens a preview, the link goes to Shopee ———
  var LOOKS = [
    { img: 'img/lifestyle/cardigan-rattan.jpg', pos: '80% 50%', slug: 'love-button-cardigan', line: 'Teh sore di teras', alt: 'Perempuan berhijab memakai Love Button Cardigan duduk di kursi rotan' },
    { img: 'img/products/velvet-bludru/09.webp', slug: 'velvet-bludru', line: 'Rapat pagi, tetap hangat', alt: 'Model berhijab memakai kemeja Velvet Bludru warna teal' },
    { img: 'img/lifestyle/eyelet-window.jpg', pos: '52% 50%', slug: 'eyelet-cotton-shirt', line: 'Bordir yang bercerita', alt: 'Perempuan berhijab terakota memakai Eyelet Cotton Shirt dusty pink' },
    { img: 'img/products/babydoll-evening/02.webp', slug: 'babydoll-evening', line: 'Makan malam keluarga', alt: 'Model berhijab memakai Babydoll Evening hitam bermotif' },
    { img: 'img/lifestyle/velvet-navy-veranda.jpg', pos: '30% 50%', slug: 'velvet-bludru', line: 'Akhir pekan di rumah', alt: 'Perempuan berhijab memakai setelan velvet navy berjalan di teras' },
    { img: 'img/products/denim-soft-jeans-bordir/03.webp', slug: 'denim-soft-jeans-bordir', line: 'Denim yang lembut', alt: 'Model berhijab memakai kemeja Denim Soft Jeans Bordir' }
  ];
  var track = document.querySelector('[data-look-track]');
  track.insertAdjacentHTML('beforeend', LOOKS.map(function (l, i) {
    var p = HK.product(l.slug), c = p.colors[0];
    return '<article class="look__card' + (i % 2 ? ' is-low' : '') + '">' +
      '<button type="button" class="look__media" data-preview="' + i + '" aria-label="Lihat foto ' + p.name + '">' +
        '<img src="' + A(l.img) + '" alt="' + l.alt + '" loading="lazy" style="object-position:' + (l.pos || '50% 50%') + '">' +
        '<span class="look__swatch"><img src="' + A(c.img) + '" alt="" loading="lazy"></span>' +
        '<span class="look__zoom" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span>' +
      '</button>' +
      '<div class="look__cap"><span class="look__no">' + String(i + 1).padStart(2, '0') + '</span><div><p class="look__line">' + l.line + '</p><h3>' + p.name + '</h3><a class="link" href="' + p.shopee + '" target="_blank" rel="noopener">Lihat di Shopee ↗</a></div></div>' +
    '</article>';
  }).join('') +
  '<div class="look__end"><p class="display">Katalog lengkap<br><em>di Shopee</em></p>' +
  '<a class="btn btn--shop" href="' + HK.links.shopee + '" target="_blank" rel="noopener">Selengkapnya <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></a></div>');

  var look = document.querySelector('[data-look]'), bar = document.querySelector('[data-look-bar]'), lookSpan = 0;
  function sizeLook() {
    if (narrow()) { look.style.height = ''; track.style.transform = ''; lookSpan = 0; return; }
    lookSpan = Math.max(0, track.scrollWidth - innerWidth);
    look.style.height = (lookSpan + innerHeight) + 'px';
  }
  function paintLook() {
    if (!lookSpan) return;
    var p = HK.progress(look);
    track.style.transform = 'translate3d(' + (-p * lookSpan).toFixed(1) + 'px,0,0)';
    bar.style.transform = 'scaleX(' + p.toFixed(3) + ')';
  }

  // preview (lightbox): arrows / keys / swipe to move between looks
  var lb = document.createElement('div');
  lb.className = 'lb';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.setAttribute('aria-label', 'Pratinjau foto');
  lb.hidden = true;
  lb.innerHTML = '<div class="lb__scrim" data-close></div>' +
    '<figure class="lb__fig"><img class="lb__img" alt=""><figcaption class="lb__cap"><span class="lb__line"></span><b class="lb__name"></b><a class="btn btn--shop lb__buy" target="_blank" rel="noopener">Lihat di Shopee <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="1.5"/></svg></a></figcaption></figure>' +
    '<button type="button" class="lb__btn lb__close" data-close aria-label="Tutup">✕</button>' +
    '<button type="button" class="lb__btn lb__prev" aria-label="Sebelumnya">←</button>' +
    '<button type="button" class="lb__btn lb__next" aria-label="Berikutnya">→</button>' +
    '<p class="lb__count"></p>';
  document.body.appendChild(lb);
  var lbIdx = 0, lbFrom = null;
  function lbShow(i) {
    lbIdx = (i + LOOKS.length) % LOOKS.length;
    var l = LOOKS[lbIdx], p = HK.product(l.slug);
    var img = lb.querySelector('.lb__img');
    img.classList.remove('is-in'); void img.offsetWidth;
    img.src = A(l.img); img.alt = l.alt; img.classList.add('is-in');
    lb.querySelector('.lb__line').textContent = l.line;
    lb.querySelector('.lb__name').textContent = p.name;
    lb.querySelector('.lb__buy').href = p.shopee;
    lb.querySelector('.lb__count').textContent = String(lbIdx + 1).padStart(2, '0') + ' / ' + String(LOOKS.length).padStart(2, '0');
  }
  function lbOpen(i, from) {
    lbFrom = from; lb.hidden = false; lbShow(i);
    requestAnimationFrame(function () { lb.classList.add('is-open'); });
    document.documentElement.classList.add('lb-open');
    if (HK.lenis) HK.lenis.stop();
    lb.querySelector('.lb__close').focus();
  }
  function lbClose() {
    lb.classList.remove('is-open');
    document.documentElement.classList.remove('lb-open');
    if (HK.lenis) HK.lenis.start();
    setTimeout(function () { lb.hidden = true; }, 350);
    if (lbFrom) lbFrom.focus({ preventScroll: true });
  }
  track.addEventListener('click', function (e) {
    var m = e.target.closest('[data-preview]');
    if (m) lbOpen(+m.dataset.preview, m);
  });
  lb.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) lbClose(); });
  lb.querySelector('.lb__prev').addEventListener('click', function () { lbShow(lbIdx - 1); });
  lb.querySelector('.lb__next').addEventListener('click', function () { lbShow(lbIdx + 1); });
  addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') lbClose();
    if (e.key === 'ArrowLeft') lbShow(lbIdx - 1);
    if (e.key === 'ArrowRight') lbShow(lbIdx + 1);
  });
  var lbX = null;
  lb.addEventListener('pointerdown', function (e) { lbX = e.clientX; });
  lb.addEventListener('pointerup', function (e) {
    if (lbX == null) return;
    var d = e.clientX - lbX; lbX = null;
    if (Math.abs(d) > 50) lbShow(lbIdx + (d < 0 ? 1 : -1));
  });

  // ——— 4 · story: lines light up as you read, photos build up, pillars arrive last ———
  var story = document.querySelector('[data-story]');
  var lines = [].slice.call(story.querySelectorAll('[data-story-lines] > span'));
  var photos = [].slice.call(story.querySelectorAll('[data-story-photos] figure'));
  var pillars = [].slice.call(story.querySelectorAll('[data-story-pillars] li'));
  var collage = story.querySelector('[data-story-photos]');
  function paintStory() {
    var p = reduced ? 1 : HK.progress(story);
    lines.forEach(function (l, i) {
      var k = smooth((p * (lines.length + 1.6) - i) / 1);
      l.style.opacity = (.16 + .84 * k).toFixed(3);
    });
    var idx = Math.min(photos.length - 1, Math.floor(p * photos.length * 1.15));
    photos.forEach(function (f, i) { f.classList.toggle('is-on', i <= idx); });
    pillars.forEach(function (li, i) { li.classList.toggle('is-on', p > .72 + i * .05); });
  }
  // the collage leans gently toward the cursor (desktop)
  if (!reduced) {
    story.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      collage.style.setProperty('--px', (x * 14).toFixed(1) + 'px');
      collage.style.setProperty('--py', (y * 10).toFixed(1) + 'px');
    });
    story.addEventListener('pointerleave', function () { collage.style.setProperty('--px', '0px'); collage.style.setProperty('--py', '0px'); });
  }

  // ——— social: the semicircles rise and open as the section scrolls in ———
  var social = document.querySelector('[data-social-sec]');
  function paintSocial() {
    var r = social.getBoundingClientRect(), p = clamp((innerHeight - r.top) / (innerHeight * .9), 0, 1);
    social.style.setProperty('--rise', smooth(p).toFixed(3));
  }

  // ——— 5 · wakaf hangtag ———
  var flip = document.querySelector('[data-flip]');
  flip.addEventListener('click', function () { flip.classList.toggle('is-flipped'); });

  // ——— 6 · moving shelf: drifts right → left, pauses under the cursor, drag to browse ———
  var shelf = document.querySelector('[data-shelf]');
  var cards = HK.products.map(function (p) {
    var c = p.colors[0];
    return '<li><a class="shelf__item" href="' + p.shopee + '" target="_blank" rel="noopener" draggable="false">' +
      '<span class="shelf__img"><img src="' + A(c.img) + '" alt="' + p.name + '" loading="lazy" draggable="false"></span>' +
      '<span class="shelf__meta"><b>' + (p.short || p.name) + '</b><span>' + p.category + ' · ' + p.colors.length + ' warna</span><i>Lihat di Shopee ↗</i></span>' +
    '</a></li>';
  }).join('');
  shelf.innerHTML = '<span class="shelf__state" aria-hidden="true">Geser untuk melihat</span><ul class="shelf__track">' + cards + cards + '</ul>';
  var strip = shelf.querySelector('.shelf__track');
  [].slice.call(strip.children).slice(HK.products.length).forEach(function (li) { li.setAttribute('aria-hidden', 'true'); li.querySelector('a').tabIndex = -1; });
  var sx = 0, speed = 0, SPEED = -38, hover = false, drag = null, visible = false, lastT = 0, half = 1;
  function measure() { half = strip.scrollWidth / 2 || 1; }
  function wrap() { while (sx <= -half) sx += half; while (sx > 0) sx -= half; }
  function run(now) {
    var dt = Math.min(.05, (now - lastT) / 1000); lastT = now;
    var target = (hover || drag || reduced) ? 0 : SPEED;
    speed += (target - speed) * Math.min(1, dt * 3.5);
    if (!target && Math.abs(speed) < .8) speed = 0;
    if (!drag) sx += speed * dt;
    wrap();
    strip.style.transform = 'translate3d(' + sx.toFixed(2) + 'px,0,0)';
    if (visible) requestAnimationFrame(run);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      var was = visible; visible = en[0].isIntersecting;
      if (visible && !was) { measure(); lastT = performance.now(); requestAnimationFrame(run); }
    }).observe(shelf);
  }
  shelf.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { hover = true; shelf.classList.add('is-paused'); } });
  shelf.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { hover = false; shelf.classList.remove('is-paused'); } });
  shelf.addEventListener('pointerdown', function (e) {
    drag = { x: e.clientX, y: e.clientY, s: sx, moved: false, id: e.pointerId };
  });
  addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(e.clientY - drag.y)) { drag.moved = true; shelf.classList.add('is-grabbing'); }
    if (drag.moved) { sx = drag.s + dx; wrap(); strip.style.transform = 'translate3d(' + sx.toFixed(2) + 'px,0,0)'; }
  });
  var justDragged = false;
  function endDrag() {
    if (!drag) return;
    justDragged = drag.moved; drag = null;
    shelf.classList.remove('is-grabbing');
    setTimeout(function () { justDragged = false; }, 0);
  }
  addEventListener('pointerup', endDrag);
  addEventListener('pointercancel', endDrag);
  shelf.addEventListener('click', function (e) { if (justDragged) { e.preventDefault(); e.stopPropagation(); } }, true);
  addEventListener('resize', measure);
  addEventListener('load', measure);

  // ——— scroll + resize ———
  sizeLook();
  addEventListener('resize', function () { sizeLook(); paintLook(); });
  addEventListener('load', sizeLook);
  HK.onScroll(function () { paintLook(); paintStory(); paintSocial(); });

  HKButterfly.init({ size: 46, ink: '#9A4826', inkDark: '#F5E8CE', thread: false, wander: .3, focus: .42, intro: false });
  meta.ready();
});
