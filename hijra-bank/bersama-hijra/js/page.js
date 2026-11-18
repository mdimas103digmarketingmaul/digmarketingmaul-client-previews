/* Bersama Hijra: renders the partner wall, category filter, sections and detail dialog from js/data.js.
   URL keeps the view: ?kategori=kebaikan&mitra=dompet-dhuafa&detail=qurban-kitabisa */
(function () {
  'use strict';
  var P = window.BH_PARTNERS, CATS = window.BH_CATEGORIES, ITEMS = window.BH_ITEMS;
  var HIJRA = '../home-exploration/shared/assets/brand/hijra-logo.png';
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var byId = {}; ITEMS.forEach(function (it) { byId[it.id] = it; });
  var today = new Date().toISOString().slice(0, 10);

  var params = new URLSearchParams(location.search);
  var state = {
    cat: CATS.some(function (c) { return c.id === params.get('kategori'); }) ? params.get('kategori') : 'semua',
    partner: P[params.get('mitra')] ? params.get('mitra') : null,
    momen: null
  };
  var visible = []; // items in on-screen order, for the dialog's prev/next

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function fmtDate(iso) { if (!iso) return null; var d = iso.split('-'); return +d[2] + ' ' + MONTHS[+d[1] - 1] + ' ' + d[0]; }
  function initials(name) { return name.replace(/[^A-Za-z ]/g, ' ').trim().split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase(); }
  function isLive(it) { return it.ends && today <= it.ends; }
  function count(list, fn) { return list.filter(fn).length; }

  function mark(slug, cls) {
    var p = P[slug];
    if (p.logo) return '<img src="' + esc(p.logo) + '" alt="' + esc(p.name) + '" loading="lazy">';
    return '<span class="wm ' + (cls || '') + '" style="--hue:' + p.hue + '"><i aria-hidden="true">' + initials(p.name) + '</i>' + esc(p.name) + '</span>';
  }
  function withRow(it, cls) {
    var h = '<img class="with__h" src="' + HIJRA + '" alt="Hijra Bank" width="128" height="60">';
    if (!it.partners.length) return '<div class="' + cls + '">' + h + '<span>Produk Hijra Bank</span></div>';
    return '<div class="' + cls + '">' + h + '<span aria-hidden="true">×</span>' + it.partners.map(function (s) { return mark(s, 'wm--sm'); }).join('<span aria-hidden="true">·</span>') + '</div>';
  }
  function groupOf(it) {
    var c = CATS.filter(function (x) { return x.id === it.cat; })[0];
    return it.group && c.groups ? c.groups.filter(function (g) { return g.id === it.group; })[0] : null;
  }
  function badges(it) {
    var b = [], g = groupOf(it);
    if (g) b.push('<span class="bdg">' + esc(g.short) + '</span>');
    if (it.first) b.push('<span class="bdg bdg--first">' + esc(it.first) + '</span>');
    if (isLive(it)) b.push('<span class="bdg bdg--live">Berjalan</span>');
    if (it.badge) b.push('<span class="bdg">' + esc(it.badge) + '</span>');
    return b.length ? '<div class="cd__badges">' + b.join('') + '</div>' : '';
  }
  var STORE_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9l1.5-5h15L21 9"/><path d="M3 9h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z"/><path d="M5 13v7h14v-7M10 20v-4h4v4"/></svg>';
  function emptyMedia(it) { return '<div class="cd__empty">' + STORE_SVG + '<span>' + esc(it.pending || 'Foto menyusul') + '</span></div>'; }

  /* ---------- intro ---------- */
  $('[data-n-partners]').textContent = Object.keys(P).length + ' mitra';

  /* ---------- partner wall ---------- */
  var wall = $('[data-partners]');
  wall.innerHTML = Object.keys(P).map(function (slug) {
    var p = P[slug], n = count(ITEMS, function (i) { return i.partners.indexOf(slug) > -1; });
    return '<li><button class="pt" type="button" data-partner="' + slug + '" aria-pressed="false" aria-label="' + esc(p.full) + ', ' + n + ' kolaborasi. Tampilkan kolaborasinya">' +
      '<span class="pt__logo">' + mark(slug) + '</span>' +
      '<span class="pt__foot"><span class="pt__type">' + esc(p.type) + '</span><span class="pt__n" aria-hidden="true">' + n + '</span></span></button></li>';
  }).join('');
  if (Object.keys(P).some(function (k) { return !P[k].logo; })) $('[data-logo-note]').hidden = false;
  wall.addEventListener('click', function (e) {
    var b = e.target.closest('[data-partner]'); if (!b) return;
    var slug = b.dataset.partner;
    state.partner = state.partner === slug ? null : slug;
    if (state.partner) state.cat = 'semua';
    update(true);
  });

  /* ---------- filter bar ---------- */
  var seg = $('[data-cats]'), activeEl = $('[data-active-partner]');
  function drawSeg() {
    var pool = ITEMS.filter(function (i) { return !state.partner || i.partners.indexOf(state.partner) > -1; });
    var opts = [{ id: 'semua', name: 'Semua', n: pool.length }].concat(CATS.map(function (c) {
      return { id: c.id, name: c.name, n: count(pool, function (i) { return i.cat === c.id; }) };
    }));
    seg.innerHTML = opts.map(function (o) {
      return '<button type="button" data-cat="' + o.id + '" aria-pressed="' + (state.cat === o.id) + '"' + (o.n ? '' : ' disabled') + '>' + esc(o.name) + '<span>' + o.n + '</span></button>';
    }).join('');
    activeEl.hidden = !state.partner;
    if (state.partner) activeEl.innerHTML = 'Mitra: <strong>' + esc(P[state.partner].name) + '</strong><button type="button" data-clear aria-label="Hapus filter mitra"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';
  }
  seg.addEventListener('click', function (e) {
    var b = e.target.closest('[data-cat]'); if (!b) return;
    state.cat = b.dataset.cat; update(true);
  });
  activeEl.addEventListener('click', function (e) { if (e.target.closest('[data-clear]')) { state.partner = null; update(false); } });
  $('[data-reset]').addEventListener('click', function () { state.cat = 'semua'; state.partner = null; update(true); });

  var fb = $('[data-filterbar]');
  function stuck() { fb.classList.toggle('is-stuck', fb.getBoundingClientRect().top <= parseFloat(getComputedStyle(fb).top) + 1); }
  window.addEventListener('scroll', stuck, { passive: true });

  /* ---------- sections ---------- */
  function card(it, portrait) {
    var img = it.images[0], media;
    if (!img) media = emptyMedia(it);
    else if (img.fit === 'contain' && !portrait) media = '<img class="cd__bg" src="' + img.src + '" alt="" aria-hidden="true" loading="lazy"><img src="' + img.src + '" alt="' + esc(img.alt) + '" width="' + img.w + '" height="' + img.h + '" loading="lazy">';
    else media = '<img src="' + img.src + '" alt="' + esc(img.alt) + '" width="' + img.w + '" height="' + img.h + '" loading="lazy">';
    var more = it.images.length > 1 ? '<span class="bdg bdg--n">' + it.images.length + ' foto</span>' : '';
    var meta = [fmtDate(it.date) || 'Tanggal menyusul', it.place].filter(Boolean).join(' · ');
    return '<article class="cd rv' + (portrait ? ' cd--p' : '') + '">' +
      '<div class="cd__media' + (img && img.fit === 'contain' && !portrait ? ' cd__media--fit' : '') + '">' + media + badges(it) + more + '</div>' +
      '<div class="cd__body">' + withRow(it, 'with') +
        '<h3 class="cd__t">' + esc(it.title) + '</h3>' +
        '<p class="cd__meta">' + esc(portrait ? fmtDate(it.date) : meta) + '</p>' +
        (portrait ? '' : '<p class="cd__sum">' + esc(it.summary) + '</p>') +
        '<span class="cd__more" aria-hidden="true">Lihat detail <span>→</span></span>' +
      '</div>' +
      '<a class="cd__hit" href="?detail=' + it.id + '" data-open="' + it.id + '"><span class="sr-only">Lihat detail: ' + esc(it.title) + '</span></a>' +
    '</article>';
  }
  function product(it) {
    var img = it.images[0];
    return '<article class="pd rv">' +
      '<a class="pd__media" href="?detail=' + it.id + '" data-open="' + it.id + '"><img src="' + img.src + '" alt="' + esc(img.alt) + '" width="' + img.w + '" height="' + img.h + '" loading="lazy">' + badges(it) + (it.images.length > 1 ? '<span class="bdg bdg--n">' + it.images.length + ' foto</span>' : '') + '</a>' +
      '<div>' + withRow(it, 'with') +
        '<span class="pd__kind">' + esc(it.kind) + '</span>' +
        '<h3 class="pd__t">' + esc(it.title) + '</h3>' +
        '<p class="pd__sum">' + esc(it.summary) + '</p>' +
        '<ul class="ticks">' + it.points.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul>' +
        '<div class="pd__foot">' +
          (it.period ? '<div class="pd__period"><small>Periode program</small><strong>' + esc(it.period) + '</strong></div>' : '<div class="pd__period"><small>Diluncurkan</small><strong>' + fmtDate(it.date) + '</strong></div>') +
          '<a class="lnk" href="?detail=' + it.id + '" data-open="' + it.id + '">Lihat detail <span aria-hidden="true">→</span></a>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  var host = $('[data-sections]');
  host.addEventListener('click', function (e) {
    var b = e.target.closest('[data-momen]'); if (!b) return;
    state.momen = b.dataset.momen || null;
    drawSections();
    var sec = $('#kebaikan'); if (sec) $$('.cd', sec).forEach(function (el) { el.classList.add('in'); });
    var chip = $('[data-momen="' + (state.momen || '') + '"]'); if (chip) chip.focus();
  });
  function drawSections() {
    visible = [];
    var html = '';
    CATS.forEach(function (c, ci) {
      if (state.cat !== 'semua' && state.cat !== c.id) return;
      var list = ITEMS.filter(function (i) { return i.cat === c.id && (!state.partner || i.partners.indexOf(state.partner) > -1); });
      if (!list.length) return;
      var body;
      if (c.id === 'filantropi') {
        body = '<div class="pd-list">' + list.map(product).join('') + '</div>';
        visible = visible.concat(list);
      } else if (c.groups) {
        // One grid in date order, with momen chips to narrow it; keeps rows full.
        var gs = c.groups.filter(function (g) { return list.some(function (i) { return i.group === g.id; }); });
        if (!gs.some(function (g) { return g.id === state.momen; })) state.momen = null;
        var shown = state.momen ? list.filter(function (i) { return i.group === state.momen; }) : list;
        var note = state.momen ? gs.filter(function (g) { return g.id === state.momen; })[0] : null;
        visible = visible.concat(shown);
        body = (gs.length > 1 ? '<div class="momen" role="group" aria-label="Momen">' +
            '<button type="button" data-momen="" aria-pressed="' + !state.momen + '">Semua momen <span>' + list.length + '</span></button>' +
            gs.map(function (g) { return '<button type="button" data-momen="' + g.id + '" aria-pressed="' + (state.momen === g.id) + '">' + esc(g.name) + ' <span>' + count(list, function (i) { return i.group === g.id; }) + '</span></button>'; }).join('') +
          '</div>' : '') +
          (note ? '<p class="momen__note">' + esc(note.note) + '</p>' : '') +
          '<div class="grid grid--4">' + shown.map(function (i) { return card(i, true); }).join('') + '</div>';
      } else {
        body = '<div class="grid grid--3">' + list.map(function (i) { return card(i, false); }).join('') + '</div>';
        visible = visible.concat(list);
      }
      html += '<section class="cs" id="' + c.id + '" aria-labelledby="cs-' + c.id + '"><div class="w">' +
        '<header class="cs__head"><div><p class="cs__no rv"><b>0' + (ci + 1) + '</b>' + esc(c.name) + '</p><h2 class="cs__t rv" id="cs-' + c.id + '">' + esc(c.title) + '</h2></div><p class="cs__lead rv">' + esc(c.lead) + '</p></header>' +
        '<div class="cs__body">' + body + '</div></div></section>';
    });
    host.innerHTML = html;
    $('[data-empty]').hidden = !!html;
    observe(host);
  }

  function syncUrl(detail) {
    var q = new URLSearchParams();
    if (state.cat !== 'semua') q.set('kategori', state.cat);
    if (state.partner) q.set('mitra', state.partner);
    if (detail) q.set('detail', detail);
    var s = q.toString();
    history.replaceState(null, '', location.pathname + (s ? '?' + s : '') + location.hash.replace(/^#$/, ''));
  }

  function update(scroll) {
    $$('.pt', wall).forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.partner === state.partner ? 'true' : 'false'); });
    drawSeg(); drawSections(); syncUrl();
    if (scroll) {
      var top = $('#kolaborasi').getBoundingClientRect().top + window.scrollY - parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav')) + 1;
      if (Math.abs(window.scrollY - top) > 4) window.scrollTo({ top: top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  }

  /* ---------- reveal ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target, sibs = el.parentNode ? $$(':scope > .rv:not(.in)', el.parentNode) : [];
      el.style.transitionDelay = Math.min(Math.max(sibs.indexOf(el), 0), 5) * 70 + 'ms';
      el.classList.add('in'); io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -8% 0px' }) : null;
  function observe(root) { $$('.rv:not(.in)', root).forEach(function (el) { if (io) io.observe(el); else el.classList.add('in'); }); }

  /* ---------- detail dialog ---------- */
  var dlg = $('[data-modal]'), mMedia = $('[data-md-media]'), mBody = $('[data-md-body]'), mCrumb = $('[data-md-crumb]'), mPos = $('[data-md-pos]');
  var cur = null, imgIx = 0, opener = null;
  var ARROW = function (d) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + (d < 0 ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7') + '"/></svg>'; };

  function drawMedia() {
    var it = cur, imgs = it.images;
    if (!imgs.length) { mMedia.innerHTML = emptyMedia(it); return; }
    var im = imgs[imgIx];
    var h = '<div class="md__stage"><img class="md__bg" src="' + im.src + '" alt="" aria-hidden="true"><img src="' + im.src + '" alt="' + esc(im.alt) + '" width="' + im.w + '" height="' + im.h + '">';
    if (imgs.length > 1) h += '<button class="md__arrow md__arrow--l" type="button" data-img="-1" aria-label="Foto sebelumnya">' + ARROW(-1) + '</button><button class="md__arrow md__arrow--r" type="button" data-img="1" aria-label="Foto berikutnya">' + ARROW(1) + '</button>';
    h += '</div>';
    if (imgs.length > 1) h += '<div class="md__thumbs">' + imgs.map(function (x, i) { return '<button type="button" data-thumb="' + i + '" aria-current="' + (i === imgIx) + '" aria-label="Foto ' + (i + 1) + ' dari ' + imgs.length + '"><img src="' + x.src + '" alt=""></button>'; }).join('') + '</div>';
    mMedia.innerHTML = h;
  }
  function drawInfo() {
    var it = cur, cat = CATS.filter(function (c) { return c.id === it.cat; })[0];
    mCrumb.textContent = cat.name + ' · ' + it.kind;
    var facts = [['Tanggal', fmtDate(it.date) || 'Menyusul']];
    if (it.period) facts = [['Periode', it.period + (it.periodNote ? ' (' + it.periodNote + ')' : '')]];
    if (it.place) facts.push(['Lokasi', it.place]);
    if (groupOf(it)) facts.push(['Momen', groupOf(it).name]);
    facts.push(['Mitra', it.partners.length ? it.partners.map(function (s) { return P[s].full; }).join(', ') : 'Produk Hijra Bank']);
    if (isLive(it)) facts.push(['Status', 'Masih berjalan']);
    var links = '';
    if (it.cta) links += '<a class="btn" href="' + esc(it.cta.url) + '" target="_blank" rel="noopener">' + esc(it.cta.label) + ' <span class="btn__arr" aria-hidden="true">↗</span></a>';
    if (it.source) links += '<a class="lnk" href="' + esc(it.source.url) + '" target="_blank" rel="noopener">Sumber: ' + esc(it.source.label) + ' <span aria-hidden="true">↗</span></a>';
    mBody.innerHTML = withRow(it, 'md__with') +
      '<h2 class="md__t" id="md-t">' + esc(it.title) + '</h2>' +
      '<dl class="md__facts">' + facts.map(function (f) { return '<div><dt>' + f[0] + '</dt><dd>' + esc(f[1]) + '</dd></div>'; }).join('') + '</dl>' +
      '<p class="md__body">' + esc(it.body) + '</p>' +
      (it.points.length ? '<ul class="ticks">' + it.points.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul>' : '') +
      (it.pending ? '<p class="md__pending">' + esc(it.pending) + '.</p>' : '') +
      '<div class="md__links">' + links + '</div>';
    mBody.scrollTop = 0;
    var i = visible.indexOf(it);
    mPos.textContent = (i + 1) + ' / ' + visible.length;
    $('[data-md-step="-1"]').disabled = i <= 0;
    $('[data-md-step="1"]').disabled = i >= visible.length - 1;
  }
  function openItem(id) {
    var it = byId[id]; if (!it) return;
    if (visible.indexOf(it) < 0) visible = [it];
    cur = it; imgIx = 0;
    drawMedia(); drawInfo();
    if (!dlg.open) { opener = document.activeElement; dlg.showModal(); document.body.classList.add('md-open'); }
    syncUrl(id);
  }
  function step(d) { var i = visible.indexOf(cur) + d; if (visible[i]) openItem(visible[i].id); }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-open]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault(); openItem(a.dataset.open);
  });
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg) { dlg.close(); return; }
    var b;
    if ((b = e.target.closest('[data-md-close]'))) dlg.close();
    else if ((b = e.target.closest('[data-md-step]'))) step(+b.dataset.mdStep);
    else if ((b = e.target.closest('[data-img]'))) { imgIx = (imgIx + +b.dataset.img + cur.images.length) % cur.images.length; drawMedia(); }
    else if ((b = e.target.closest('[data-thumb]'))) { imgIx = +b.dataset.thumb; drawMedia(); }
  });
  dlg.addEventListener('keydown', function (e) {
    if (e.target.closest('a, input')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
  });
  dlg.addEventListener('close', function () {
    document.body.classList.remove('md-open'); syncUrl();
    if (opener && document.contains(opener)) opener.focus();
  });

  /* ---------- go ---------- */
  update(false);
  observe(document);
  stuck();
  if (params.get('detail') && byId[params.get('detail')]) openItem(params.get('detail'));
})();
