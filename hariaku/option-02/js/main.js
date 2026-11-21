/* Option 02 — Metamorfosis */
HK.ready(function () {
  var A = HK.asset;
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var smooth = function (t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  var narrow = function () { return innerWidth < 760; };

  // ——— lookbook cards ———
  var LOOKS = [
    { img: 'img/lifestyle/cardigan-rattan.jpg', pos: '42% 50%', slug: 'love-button-cardigan', line: 'Teh sore di teras', alt: 'Perempuan berhijab memakai Love Button Cardigan duduk di kursi rotan' },
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
      '<a class="look__media" href="' + p.shopee + '" target="_blank" rel="noopener">' +
        '<img src="' + A(l.img) + '" alt="' + l.alt + '" loading="lazy" style="object-position:' + (l.pos || '50% 50%') + '">' +
        '<span class="look__swatch"><img src="' + A(c.img) + '" alt="" loading="lazy"></span>' +
      '</a>' +
      '<div class="look__cap"><span class="look__no">' + String(i + 1).padStart(2, '0') + '</span><div><p class="look__line">' + l.line + '</p><h3>' + p.name + '</h3><a class="link" href="' + p.shopee + '" target="_blank" rel="noopener">Lihat di Shopee ↗</a></div></div>' +
    '</article>';
  }).join('') + '<div class="look__end"><p class="display">Masih ada <em>' + (HK.products.length) + ' potong</em> lainnya.</p><a class="btn" href="#toko">Lihat semua</a></div>');

  // ——— shop grid ———
  document.querySelector('[data-shop]').innerHTML = HK.products.map(function (p, i) {
    var c = p.colors[0];
    return '<li data-reveal style="--d:' + (i % 3) * .08 + 's"><a class="sp" href="' + p.shopee + '" target="_blank" rel="noopener">' +
      '<span class="sp__img"><img src="' + A(c.img) + '" alt="' + p.name + '" loading="lazy">' + (c.model ? '<img class="sp__alt" src="' + A(c.model) + '" alt="" loading="lazy">' : '') + '</span>' +
      '<span class="sp__row"><b>' + (p.short || p.name) + '</b><span>' + p.colors.length + ' warna</span></span>' +
      '<span class="sp__cat">' + p.category + ' · ' + p.material + '</span></a></li>';
  }).join('');

  // ——— marquee ———
  var mq = document.querySelector('[data-marquee]');
  var items = HK.social.map(function (s) {
    return '<a href="' + HK.links.igPost(s.code) + '" target="_blank" rel="noopener" class="marquee__item"><img src="' + A(s.img) + '" alt="' + s.alt + '" loading="lazy"></a>';
  }).join('');
  mq.innerHTML = '<div class="marquee__track">' + items + items + '</div>';

  HKTryOn.mount(document.querySelector('[data-tryon]'), { reveal: 'sweep' });

  // ——— hero: metamorphosis (shared/js/meta.js) ———
  var meta = HKMeta.mount(document.querySelector('[data-room]'));

  // ——— lookbook pin ———
  var look = document.querySelector('[data-look]'), bar = document.querySelector('[data-look-bar]');
  var lookSpan = 0;
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

  // ——— story ———
  var story = document.querySelector('[data-story]');
  var lines = [].slice.call(story.querySelectorAll('[data-story-lines] > span'));
  var photos = [].slice.call(story.querySelectorAll('[data-story-photos] figure'));
  function paintStory() {
    var p = HK.progress(story);
    lines.forEach(function (l, i) {
      var k = smooth((p * (lines.length + 1.2) - i) / 1);
      l.style.opacity = (.16 + .84 * k).toFixed(3);
    });
    var idx = Math.min(photos.length - 1, Math.floor(p * photos.length * 1.05));
    photos.forEach(function (f, i) { f.classList.toggle('is-on', i <= idx); });
  }

  // ——— room colour follows the section at the centre of the screen ———
  var rooms = [].slice.call(document.querySelectorAll('[data-bg]'));
  var root = document.documentElement, current;
  function paintColour() {
    var mid = innerHeight * .5, pick = rooms[0];
    rooms.forEach(function (s) { var r = s.getBoundingClientRect(); if (r.top <= mid && r.bottom > mid) pick = s; });
    if (pick !== current) {
      current = pick;
      root.style.setProperty('--bg', pick.dataset.bg);
      root.style.setProperty('--ink', pick.dataset.ink);
      document.body.dataset.room = pick.id || pick.className.split(' ')[0];
    }
  }

  sizeLook();
  addEventListener('resize', function () { sizeLook(); paintLook(); });
  addEventListener('load', sizeLook);
  HK.onScroll(function () { paintLook(); paintStory(); paintColour(); });

  HKButterfly.init({ size: 46, ink: '#9A4826', inkDark: '#F5E8CE', threadColor: '#C9A46A', wander: .38, focus: .42, intro: false });
  meta.ready();
});
