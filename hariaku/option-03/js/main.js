/* Option 03 — Lemari Hariaku */
HK.ready(function () {
  var A = HK.asset;
  var reduced = HK.reduced;

  // ——— try me (driven by the rack) ———
  var tryEl = document.querySelector('[data-tryon]');
  var tryon = HKTryOn.mount(tryEl, { picker: false, reveal: 'arch' });

  // ——— rack ———
  var rack = document.querySelector('[data-rack]');
  var items = HK.products.filter(function (p) { return p.tryOn; });
  var hangerSvg = '<svg class="hanger__hook" viewBox="0 0 64 34" aria-hidden="true"><path d="M32 14V10.5a4.5 4.5 0 1 0-4.5-4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M32 14 5 30.5h54L32 14Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  rack.innerHTML = items.map(function (p, i) {
    var c = HK.color(p, p.tryOn);
    return '<li class="hanger" data-slug="' + p.slug + '" style="--i:' + i + '">' +
      '<button type="button" class="hanger__btn" aria-pressed="false" aria-label="Pakaikan ' + p.name + '">' +
        hangerSvg +
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

  // swing physics: each hanger is a damped pendulum, nudged by the pointer and by clicks
  var swing = hangers.map(function () { return { a: 0, v: 0 }; });
  var running = false;
  function kick(i, impulse) {
    if (reduced) return;
    swing[i].v += impulse;
    if (!running) { running = true; requestAnimationFrame(step); }
  }
  var last = performance.now();
  function step(now) {
    var dt = Math.min(.033, (now - last) / 1000); last = now;
    var moving = false;
    swing.forEach(function (s, i) {
      s.v += (-38 * s.a - 3.2 * s.v) * dt;
      s.a += s.v * dt;
      if (Math.abs(s.a) > .02 || Math.abs(s.v) > .02) moving = true;
      hangers[i].style.setProperty('--sw', s.a.toFixed(3) + 'deg');
    });
    if (moving) requestAnimationFrame(step); else running = false;
  }
  var lastX = null;
  rack.addEventListener('pointermove', function (e) {
    var h = e.target.closest('.hanger');
    var vx = lastX == null ? 0 : e.clientX - lastX;
    lastX = e.clientX;
    if (h && Math.abs(vx) > 1) kick(hangers.indexOf(h), Math.max(-40, Math.min(40, vx * 2.4)));
  });
  rack.addEventListener('pointerleave', function () { lastX = null; });
  // a gentle wave across the rack when it scrolls into view
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { hangers.forEach(function (h, i) { setTimeout(function () { kick(i, 26); }, i * 90); }); io.disconnect(); }
    }, { threshold: .5 });
    io.observe(rack);
  }

  rack.addEventListener('click', function (e) {
    var h = e.target.closest('.hanger');
    if (!h) return;
    var i = hangers.indexOf(h);
    kick(i, 60);
    markActive(h.dataset.slug);
    tryon.setProduct(h.dataset.slug);
    var frame = tryEl.querySelector('.to__frame');
    var r = frame.getBoundingClientRect();
    if (r.top < 0 || r.bottom > innerHeight) {
      var y = r.top + scrollY - 90;
      if (HK.lenis) HK.lenis.scrollTo(y, { duration: 1.2 }); else scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
    }
  });

  // the butterfly guides: after a match it visits the result, then the Shopee button
  tryEl.addEventListener('hk:tryon:match', function () {
    var bf = window.HKButterfly && HKButterfly.instance;
    if (!bf) return;
    var buy = tryEl.querySelector('.to__buy');
    setTimeout(function () { bf.flyTo(buy, 1300, { hold: 2400, lift: 18, x: .85 }); }, 900);
  });

  // ——— impact hangtag flip ———
  var flip = document.querySelector('[data-flip]');
  flip.addEventListener('click', function () { flip.classList.toggle('is-flipped'); });

  // ——— shop ———
  document.querySelector('[data-shop]').innerHTML = HK.products.map(function (p, i) {
    var c = p.colors[0];
    return '<li data-reveal style="--d:' + (i % 3) * .07 + 's"><a class="sp" href="' + p.shopee + '" target="_blank" rel="noopener">' +
      '<span class="sp__img"><img src="' + A(c.img) + '" alt="' + p.name + '" loading="lazy"></span>' +
      '<span class="sp__name">' + (p.short || p.name) + '</span><span class="sp__cat">' + p.category + ' · ' + p.colors.length + ' warna</span>' +
      '<span class="sp__go" aria-hidden="true">↗</span></a></li>';
  }).join('');

  HK.socialGrid(document.querySelector('[data-social]'), 4);

  HKButterfly.init({ size: 44, ink: '#9A4826', inkDark: '#F5E8CE', threadColor: '#B8935A', wander: .3, focus: .42 });
});
