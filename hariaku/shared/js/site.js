/* HARIAKU — shared page behaviour: smooth scroll, navbar, reveals, small render helpers. */
(function () {
  var HK = window.HK = window.HK || {};
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  HK.reduced = reduced;
  document.documentElement.classList.toggle('hk-rm', reduced);

  // ——— smooth scroll (Lenis, optional) ———
  if (!reduced && window.Lenis && !matchMedia('(pointer: coarse)').matches) {
    var lenis = new window.Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
    HK.lenis = lenis;
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(performance.now());
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute('href').length < 2) return;
      var t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      lenis.scrollTo(t, { offset: -70 });
    });
  }

  // ——— scroll listeners (one rAF) ———
  var subs = [];
  HK.onScroll = function (fn) { subs.push(fn); fn(window.scrollY); };
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; var y = window.scrollY; subs.forEach(function (f) { f(y); }); });
  }, { passive: true });

  // progress of the viewport through a (tall) element: 0 when its top reaches the top of the viewport,
  // 1 when its bottom reaches the bottom of the viewport.
  HK.progress = function (el) {
    var r = el.getBoundingClientRect();
    var span = r.height - window.innerHeight;
    return span <= 0 ? (r.top <= 0 ? 1 : 0) : Math.min(1, Math.max(0, -r.top / span));
  };
  // 0 → 1 while the element travels from entering the bottom to leaving the top
  HK.pass = function (el) {
    var r = el.getBoundingClientRect(), vh = window.innerHeight;
    return Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
  };

  var domReady = document.readyState === 'complete';
  document.addEventListener('DOMContentLoaded', function () { domReady = true; });
  HK.ready = function (fn) { if (domReady) fn(); else document.addEventListener('DOMContentLoaded', fn); };

  HK.ready(function () {
    // ——— navbar ———
    var nav = document.querySelector('.nav');
    if (nav) {
      HK.onScroll(function (y) { nav.classList.toggle('is-scrolled', y > 24); });
      var tog = nav.querySelector('.nav__toggle');
      if (tog) tog.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        tog.setAttribute('aria-expanded', open);
        document.documentElement.classList.toggle('nav-open', open);
      });
      var close = function () {
        nav.classList.remove('is-open');
        document.documentElement.classList.remove('nav-open');
        if (tog) tog.setAttribute('aria-expanded', 'false');
      };
      nav.querySelectorAll('.nav__menu a').forEach(function (a) { a.addEventListener('click', close); });
      addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) close(); });
      addEventListener('resize', function () { if (innerWidth > 900) close(); });
    }

    // ——— reveal on enter (deferred one tick so content rendered by option scripts is included) ———
    setTimeout(observeReveals, 0);
  });
  HK.observeReveals = observeReveals;
  function observeReveals() {
    var items = document.querySelectorAll('[data-reveal]:not(.is-in):not([data-obs])');
    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
        });
      }, { threshold: .14, rootMargin: '0px 0px -6% 0px' });
      items.forEach(function (el) { el.setAttribute('data-obs', ''); io.observe(el); });
    }
  }

  HK.ready(function () {
    // split [data-lines] text into masked lines (keeps <em>, <br>)
    document.querySelectorAll('[data-lines]').forEach(function (el) {
      var parts = el.innerHTML.split(/<br\s*\/?>/i);
      el.innerHTML = parts.map(function (p, i) { return '<span class="ln"><span style="--i:' + i + '">' + p.trim() + '</span></span>'; }).join('');
    });

    // preview/debug: ?y=1200 scrolls there on load (used for screenshots)
    var qy = new URLSearchParams(location.search).get('y');
    if (qy) window.addEventListener('load', function () { setTimeout(function () { window.scrollTo(0, +qy); }, 50); });

    document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

    // outbound links
    document.querySelectorAll('[data-link]').forEach(function (a) {
      var k = a.getAttribute('data-link');
      if (HK.links[k]) { a.href = HK.links[k]; a.target = '_blank'; a.rel = 'noopener'; }
    });
  });

  // ——— render helpers ———
  HK.color = function (p, id) { return p.colors.filter(function (c) { return c.id === id; })[0] || p.colors[0]; };
  HK.socialGrid = function (el, n) {
    el.innerHTML = HK.social.slice(0, n || 6).map(function (s) {
      return '<a class="ig" href="' + HK.links.igPost(s.code) + '" target="_blank" rel="noopener"><img src="' + HK.asset(s.img) + '" alt="' + s.alt + '" loading="lazy"><span class="ig__hover" aria-hidden="true">Lihat di Instagram ↗</span></a>';
    }).join('');
  };
  HK.icons = {
    ig: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor"/></svg>',
    tt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3v11.2a3.3 3.3 0 1 1-3.3-3.3" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M14 3c.4 2.6 2.1 4.3 4.8 4.6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>'
  };
  HK.ready(function () {
    document.querySelectorAll('[data-icon]').forEach(function (el) { el.innerHTML = HK.icons[el.getAttribute('data-icon')] || ''; });
  });
})();
