/* HARIAKU — Try Me (static mix & match)
   Every image is pre-generated. The manifest lives in /hariaku/try-on/data/looks.js (window.HK_LOOKS).
   Until a combination exists, the stage falls back to the nearest generated combination, then to the
   real product photo, and says so honestly.

   HKTryOn.mount(root, {
     picker: true,            // render the product picker (Option 03 drives products from its rack instead)
     reveal: 'wipe',          // 'wipe' | 'arch' | 'sweep' (sweep = the butterfly crosses the image)
     products: [...slugs]     // default: products with a tryOn colour
   }) → { setProduct(slug, color), state, el }
   Events on root: 'hk:tryon:change', 'hk:tryon:match' (detail = state)
*/
(function () {
  var BODIES = {
    mungil: { label: 'Mungil', h: 150, w: 45 },
    sedang: { label: 'Sedang', h: 158, w: 54 },
    tinggi: { label: 'Tinggi', h: 168, w: 58 },
    berisi: { label: 'Berisi', h: 160, w: 75 }
  };
  var SKINS = [
    { id: 'langsat', label: 'Kuning langsat', hex: '#E8C39E' },
    { id: 'sawo', label: 'Sawo matang', hex: '#B7845C' },
    { id: 'gelap', label: 'Cokelat gelap', hex: '#6B4430' }
  ];
  var HIJABS = [
    { id: 'pashmina', label: 'Pashmina' },
    { id: 'segiempat', label: 'Segi empat', soon: true }
  ];

  function bodyFor(h, w) {
    var bmi = w / Math.pow(h / 100, 2);
    if (bmi >= 25.5) return 'berisi';
    if (h >= 164) return 'tinggi';
    if (h <= 153) return 'mungil';
    return 'sedang';
  }
  function base() { return (window.HK && window.HK.base) || '../'; }
  function shared(p) { return base() + 'shared/' + p; }
  function tryon(p) { return base() + 'try-on/' + p; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function figure(h, w) {
    // a small hijab silhouette that widens/lengthens with the inputs
    var tw = Math.min(1, Math.max(0, (w - 38) / 57)), th = Math.min(1, Math.max(0, (h - 145) / 33));
    var sx = .8 + tw * .38, sy = .8 + th * .22; // stays inside the 60×120 box (head never clipped)
    return '<svg viewBox="0 0 60 120" class="to__fig" aria-hidden="true"><g transform="translate(30 118) scale(' + sx.toFixed(3) + ' ' + sy.toFixed(3) + ') translate(-30 -118)">' +
      '<path d="M30 6c-8 0-13 6-13 13 0 5 2 8 4 10-6 2-12 6-13 14L6 70h8l2 48h11V84h6v34h11l2-48h8l-2-27c-1-8-7-12-13-14 2-2 4-5 4-10 0-7-5-13-13-13z" fill="currentColor"/></g></svg>';
  }

  function mount(root, opts) {
    opts = Object.assign({ picker: true, reveal: 'wipe' }, opts || {});
    var P = window.HK.products.filter(function (p) { return p.tryOn && (!opts.products || opts.products.indexOf(p.slug) > -1); });
    var L = window.HK_LOOKS || { avatars: {}, looks: {} };
    var q = new URLSearchParams(location.search);
    var st = {
      h: clampInt(q.get('tb'), 145, 178, 158),
      w: clampInt(q.get('bb'), 38, 95, 54),
      skin: pick(q.get('kulit'), SKINS.map(function (s) { return s.id; }), 'sawo'),
      hijab: 'pashmina',
      product: pick(q.get('produk'), P.map(function (p) { return p.slug; }), P[0].slug),
      color: null,
      matched: true
    };
    st.body = bodyFor(st.h, st.w);
    var prod0 = window.HK.product(st.product);
    st.color = pick(q.get('warna'), prod0.colors.map(function (c) { return c.id; }), prod0.tryOn);

    root.classList.add('to');
    root.setAttribute('data-reveal', opts.reveal);
    var uid = 'to' + Math.random().toString(36).slice(2, 7);
    root.innerHTML =
      '<div class="to__controls">' +
        '<fieldset class="to__group to__group--body"><legend class="to__legend"><span class="to__step">1</span>Tubuhmu</legend>' +
          '<div class="to__bodyrow">' + '<div class="to__figwrap"></div>' +
          '<div class="to__sliders">' +
            '<label class="to__range"><span>Tinggi badan</span><output data-o="h"></output><input type="range" min="145" max="178" step="1" data-i="h"></label>' +
            '<label class="to__range"><span>Berat badan</span><output data-o="w"></output><input type="range" min="38" max="95" step="1" data-i="w"></label>' +
          '</div></div>' +
          '<p class="to__preset" aria-live="polite"></p>' +
        '</fieldset>' +
        '<fieldset class="to__group to__group--skin"><legend class="to__legend"><span class="to__step">2</span>Warna kulit</legend><div class="to__chips">' +
          SKINS.map(function (s) {
            return '<label class="to__skin"><input type="radio" name="' + uid + '-skin" value="' + s.id + '"><span class="to__dot" style="--c:' + s.hex + '"></span><span>' + s.label + '</span></label>';
          }).join('') + '</div></fieldset>' +
        '<fieldset class="to__group to__group--hijab"><legend class="to__legend"><span class="to__step">3</span>Gaya hijab</legend><div class="to__chips">' +
          HIJABS.map(function (h) {
            return '<label class="to__pill' + (h.soon ? ' is-soon' : '') + '"><input type="radio" name="' + uid + '-hijab" value="' + h.id + '"' + (h.soon ? ' disabled' : '') + '><span>' + h.label + (h.soon ? ' <em>segera</em>' : '') + '</span></label>';
          }).join('') + '</div></fieldset>' +
        (opts.picker ? '<fieldset class="to__group to__group--products"><legend class="to__legend"><span class="to__step">4</span>Pilih atasan</legend><div class="to__products">' +
          P.map(function (p) {
            var c = p.colors.filter(function (c) { return c.id === p.tryOn; })[0];
            return '<label class="to__prod"><input type="radio" name="' + uid + '-prod" value="' + p.slug + '"><span class="to__thumb"><img src="' + shared(c.img) + '" alt="" loading="lazy"></span><span class="to__pname">' + esc(p.short || p.name) + '</span></label>';
          }).join('') + '</div></fieldset>' : '') +
        '<button type="button" class="to__match"><span>Padukan</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></button>' +
      '</div>' +
      '<figure class="to__stage">' +
        '<div class="to__frame">' +
          '<img class="to__img to__img--base" alt="">' +
          '<img class="to__img to__img--look" alt="">' +
          '<input class="to__compare" type="range" min="0" max="100" value="50" aria-label="Geser untuk membandingkan sebelum dan sesudah" hidden>' +
          '<span class="to__knob" aria-hidden="true"><span class="to__knob-dot"><svg viewBox="0 0 32 32"><path d="M12 10 6 16l6 6M20 10l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="to__knob-label">Geser</span></span>' +
          '<span class="to__badge">Simulasi visual</span>' +
        '</div>' +
        '<figcaption class="to__meta">' +
          '<div class="to__title"><span class="to__pcat"></span><strong class="to__ptitle"></strong></div>' +
          '<p class="to__who"></p>' +
          '<p class="to__note"></p>' +
          '<div class="to__colors" role="radiogroup" aria-label="Warna"></div>' +
          '<div class="to__actions"><a class="to__buy" target="_blank" rel="noopener">Beli di Shopee <span aria-hidden="true">↗</span></a><button type="button" class="to__share">Bagikan look</button></div>' +
          '<p class="to__disclaimer">Hasil Try Me adalah simulasi visual.</p>' +
        '</figcaption>' +
      '</figure>';

    var $ = function (s) { return root.querySelector(s); };
    var $$ = function (s) { return [].slice.call(root.querySelectorAll(s)); };
    var inH = $('[data-i="h"]'), inW = $('[data-i="w"]');
    var frame = $('.to__frame'), imgBase = $('.to__img--base'), imgLook = $('.to__img--look'), compare = $('.to__compare');
    inH.value = st.h; inW.value = st.w;
    $$('input[name="' + uid + '-skin"]').forEach(function (r) { r.checked = r.value === st.skin; });
    $$('input[name="' + uid + '-hijab"]').forEach(function (r) { r.checked = r.value === st.hijab; });
    $$('input[name="' + uid + '-prod"]').forEach(function (r) { r.checked = r.value === st.product; });

    function key() { return st.body + '.' + st.skin + '.' + st.hijab; }
    function avatar() { var a = L.avatars && L.avatars[key()]; return a ? tryon(a) : null; }
    function look() {
      var set = (L.looks || {})[st.product + '.' + st.color];
      if (!set) return null;
      if (set[key()]) return { src: tryon(set[key()]), exact: true };
      var order = [];
      SKINS.forEach(function (s) { order.push(st.body + '.' + s.id + '.' + st.hijab); });
      Object.keys(BODIES).forEach(function (b) { order.push(b + '.' + st.skin + '.' + st.hijab); });
      for (var i = 0; i < order.length; i++) if (set[order[i]]) return { src: tryon(set[order[i]]), exact: false, key: order[i] };
      return null;
    }

    function renderBody() {
      var preset = BODIES[st.body];
      $('[data-o="h"]').textContent = st.h + ' cm';
      $('[data-o="w"]').textContent = st.w + ' kg';
      $('.to__figwrap').innerHTML = figure(st.h, st.w);
      $('.to__preset').innerHTML = 'Model terdekat: <b>' + preset.label + '</b> · ' + preset.h + ' cm · ' + preset.w + ' kg';
      inH.style.setProperty('--p', ((st.h - 145) / 33 * 100) + '%');
      inW.style.setProperty('--p', ((st.w - 38) / 57 * 100) + '%');
    }

    function renderMeta(mode, lk) {
      var p = window.HK.product(st.product);
      var c = p.colors.filter(function (c) { return c.id === st.color; })[0];
      var preset = BODIES[st.body];
      var skin = SKINS.filter(function (s) { return s.id === st.skin; })[0];
      $('.to__pcat').textContent = p.category + ' · ' + p.material;
      $('.to__ptitle').textContent = p.name;
      $('.to__who').textContent = 'Model ' + preset.label.toLowerCase() + ' (' + preset.h + ' cm · ' + preset.w + ' kg), kulit ' + skin.label.toLowerCase() + ', ' + (st.hijab === 'pashmina' ? 'pashmina' : 'segi empat') + '. Produk: ' + p.fit + '.';
      var note = '';
      if (mode === 'demo') note = 'Foto produk asli. Simulasi untuk kombinasi ini sedang kami siapkan.';
      else if (mode === 'near') note = 'Kombinasi persisnya sedang disiapkan. Ini model terdekat yang sudah tersedia.';
      $('.to__note').textContent = note;
      $('.to__note').hidden = !note;
      $('.to__buy').href = p.shopee;
      var tryColors = p.colors.filter(function (cc) { return (L.looks || {})[p.slug + '.' + cc.id] || cc.id === p.tryOn; });
      $('.to__colors').innerHTML = tryColors.length > 1 ? tryColors.map(function (cc) {
        return '<button type="button" role="radio" aria-checked="' + (cc.id === st.color) + '" data-color="' + cc.id + '" style="--c:' + cc.hex + '" title="' + esc(cc.label) + '"><span class="sr">' + esc(cc.label) + '</span></button>';
      }).join('') : '';
      frame.dataset.mode = mode;
      imgLook.alt = p.name + ' warna ' + c.label + ' dipakai model ' + preset.label.toLowerCase();
    }

    function show(animate) {
      var av = avatar(), lk = look();
      var p = window.HK.product(st.product);
      var c = p.colors.filter(function (c) { return c.id === st.color; })[0];
      var mode = lk ? (lk.exact ? 'look' : 'near') : 'demo';
      var demo = (c.id === p.tryOn && p.demo) || null;
      var lookSrc = lk ? lk.src : shared(demo ? demo.img : (c.model || c.img));
      imgLook.style.objectPosition = (!lk && demo && demo.pos) || '';
      var baseSrc = av || shared(c.img);
      if (!st.matched) {
        // previewing the model only
        frame.classList.add('is-preview');
        frame.classList.remove('has-compare');
        setSrc(imgBase, av || lookSrc);
        frame.dataset.mode = av ? 'avatar' : 'demo';
        compare.hidden = true;
        return;
      }
      frame.classList.remove('is-preview');
      setSrc(imgBase, baseSrc);
      setSrc(imgLook, lookSrc);
      compare.hidden = !(av && lk);
      frame.classList.toggle('has-compare', !compare.hidden);
      renderMeta(mode, lk);
      if (animate) {
        frame.classList.remove('is-revealing');
        void frame.offsetWidth;
        frame.classList.add('is-revealing');
        clearTimeout(frame._t);
        frame._t = setTimeout(function () { frame.classList.remove('is-revealing'); }, 1600);
      }
    }
    function setSrc(img, src) { if (img.getAttribute('src') !== src) img.src = src; }

    function emit(name) { root.dispatchEvent(new CustomEvent(name, { detail: Object.assign({}, st), bubbles: true })); }
    function syncUrl() {
      var u = new URL(location.href);
      u.searchParams.set('tb', st.h); u.searchParams.set('bb', st.w); u.searchParams.set('kulit', st.skin);
      u.searchParams.set('produk', st.product); u.searchParams.set('warna', st.color);
      history.replaceState(null, '', u);
    }
    function changed() {
      st.matched = false;
      root.classList.add('is-dirty');
      show(false);
      emit('hk:tryon:change');
    }
    function match() {
      st.matched = true;
      root.classList.remove('is-dirty');
      syncUrl();
      if (opts.reveal === 'sweep' && window.HKButterfly && window.HKButterfly.instance) {
        window.HKButterfly.instance.sweep(frame, 1400);
      }
      show(true);
      emit('hk:tryon:match');
    }

    inH.addEventListener('input', function () { st.h = +inH.value; st.body = bodyFor(st.h, st.w); renderBody(); changed(); });
    inW.addEventListener('input', function () { st.w = +inW.value; st.body = bodyFor(st.h, st.w); renderBody(); changed(); });
    root.addEventListener('change', function (e) {
      var t = e.target;
      if (t.name === uid + '-skin') { st.skin = t.value; changed(); }
      if (t.name === uid + '-hijab') { st.hijab = t.value; changed(); }
      if (t.name === uid + '-prod') { api.setProduct(t.value); }
    });
    // on phones the result sits above the controls: after "Padukan", bring it into view
    function revealFrame() {
      var r = frame.getBoundingClientRect(), nav = document.querySelector('.nav'), top = (nav ? nav.offsetHeight : 64) + 12;
      if (r.top >= top && r.bottom <= innerHeight) return;
      var y = r.top + scrollY - top;
      var reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (window.HK && HK.lenis) HK.lenis.scrollTo(y, { duration: 1.1 });
      else scrollTo({ top: y, behavior: reducedMotion ? 'auto' : 'smooth' });
    }
    $('.to__match').addEventListener('click', function () { match(); if (matchMedia('(max-width: 860px)').matches) revealFrame(); });
    $('.to__colors').addEventListener('click', function (e) {
      var b = e.target.closest('[data-color]');
      if (!b) return;
      st.color = b.dataset.color; st.matched = true; syncUrl(); show(true); emit('hk:tryon:match');
    });
    // the native range covers the whole frame (invisible); its thumb is 56px wide, so the visible
    // divider follows the thumb centre: 28px + (width - 56px) × value
    function setCmp(v) {
      compare.value = v;
      frame.style.setProperty('--cmp', 'calc(28px + (100% - 56px) * ' + (v / 100).toFixed(4) + ')');
    }
    setCmp(50);
    compare.addEventListener('input', function () { setCmp(+compare.value); frame.classList.add('was-dragged'); });
    compare.addEventListener('pointerdown', function () { frame.classList.add('is-dragging'); });
    addEventListener('pointerup', function () { frame.classList.remove('is-dragging'); });
    compare.addEventListener('change', function () { emit('hk:tryon:compare'); });
    // once, when the comparison first comes into view: a small left-right nudge to show it can be dragged
    var nudged = false;
    function nudge() {
      if (nudged || compare.hidden || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      nudged = true;
      var t0 = performance.now(), D = 2200;
      (function f(now) {
        var k = Math.min(1, (now - t0) / D);
        if (frame.classList.contains('was-dragged')) return;
        setCmp(50 + Math.sin(k * Math.PI * 2) * 20 * (1 - k * .35) * (k < 1 ? 1 : 0));
        if (k < 1) requestAnimationFrame(f); else setCmp(50);
      })(t0);
    }
    if ('IntersectionObserver' in window) {
      var nio = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { setTimeout(nudge, 700); } }, { threshold: .6 });
      nio.observe(frame);
    }
    $('.to__share').addEventListener('click', function () {
      syncUrl();
      var btn = this, done = function () { btn.textContent = 'Tautan disalin'; setTimeout(function () { btn.textContent = 'Bagikan look'; }, 1800); };
      if (navigator.share && matchMedia('(pointer: coarse)').matches) navigator.share({ title: 'Look HARIAKU', url: location.href }).catch(function () {});
      else if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done, done);
      else done();
    });

    var api = {
      el: root, state: st,
      setProduct: function (slug, color, auto) {
        var p = window.HK.product(slug);
        if (!p) return;
        st.product = slug;
        st.color = color || p.tryOn || p.colors[0].id;
        $$('input[name="' + uid + '-prod"]').forEach(function (r) { r.checked = r.value === slug; });
        if (auto === false) { changed(); return; }
        match();
      },
      match: match
    };
    renderBody();
    show(false);
    return api;
  }

  function clampInt(v, a, b, d) { v = parseInt(v, 10); return isNaN(v) ? d : Math.min(b, Math.max(a, v)); }
  function pick(v, list, d) { return list.indexOf(v) > -1 ? v : d; }

  window.HKTryOn = { mount: mount, bodyFor: bodyFor, BODIES: BODIES, SKINS: SKINS };
})();
