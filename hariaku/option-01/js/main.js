/* Option 01 — Jurnal Hari */
HK.ready(function () {
  var A = HK.asset;

  // The Edit: three products as magazine entries, with a hangtag on hover and colour swatches
  var list = document.querySelector('[data-edit]');
  list.innerHTML = list.dataset.edit.split(',').map(function (slug, i) {
    var p = HK.product(slug), c = p.colors[0];
    return '<li class="pc" data-reveal style="--d:' + (i * .1) + 's" data-slug="' + slug + '">' +
      '<a class="pc__media" href="' + p.shopee + '" target="_blank" rel="noopener" aria-label="' + p.name + ' di Shopee">' +
        '<img class="pc__img" src="' + A(c.model || c.img) + '" alt="' + p.name + ' warna ' + c.label + '" loading="lazy">' +
        '<img class="pc__img pc__img--alt" src="' + A(c.img) + '" alt="" loading="lazy">' +
        '<span class="pc__tag" aria-hidden="true"><b>' + (p.short || p.name) + '</b><span>' + p.material + '</span><span>' + p.fit + '</span></span>' +
      '</a>' +
      '<div class="pc__info">' +
        '<span class="pc__no">No. 0' + (i + 1) + ' · ' + p.category + '</span>' +
        '<h3 class="pc__name">' + p.name + '</h3>' +
        '<p class="pc__desc">' + p.material + ', ' + p.note.toLowerCase() + '.</p>' +
        (p.colors.length > 1 ? '<div class="pc__sw" role="radiogroup" aria-label="Warna">' + p.colors.map(function (cc, j) {
          return '<button type="button" role="radio" aria-checked="' + (j === 0) + '" data-c="' + cc.id + '" style="--c:' + cc.hex + '" title="' + cc.label + '"><span class="sr">' + cc.label + '</span></button>';
        }).join('') + '</div>' : '') +
        '<a class="link pc__buy" href="' + p.shopee + '" target="_blank" rel="noopener">Lihat di Shopee ↗</a>' +
      '</div></li>';
  }).join('');
  list.addEventListener('click', function (e) {
    var b = e.target.closest('[data-c]');
    if (!b) return;
    var li = b.closest('.pc'), p = HK.product(li.dataset.slug), c = HK.color(p, b.dataset.c);
    li.querySelectorAll('[data-c]').forEach(function (x) { x.setAttribute('aria-checked', x === b); });
    var imgs = li.querySelectorAll('.pc__img');
    li.classList.add('is-swap');
    setTimeout(function () {
      imgs[0].src = A(c.model || c.img); imgs[1].src = A(c.img);
      imgs[0].alt = p.name + ' warna ' + c.label;
      li.classList.remove('is-swap');
    }, 260);
  });

  // Shelf: every product, packshot first
  var shelf = document.querySelector('[data-shelf]');
  shelf.innerHTML = '<ul class="shelf__track">' + HK.products.map(function (p, i) {
    var c = p.colors[0];
    return '<li><a class="shelf__item" href="' + p.shopee + '" target="_blank" rel="noopener">' +
      '<span class="shelf__img"><img src="' + A(c.img) + '" alt="' + p.name + '" loading="lazy"></span>' +
      '<span class="shelf__meta"><span>' + String(i + 1).padStart(2, '0') + '</span><b>' + (p.short || p.name) + '</b><span>' + p.category + ' · ' + p.colors.length + ' warna</span></span>' +
    '</a></li>';
  }).join('') + '</ul>';
  // drag to scroll (desktop)
  var track = shelf.querySelector('.shelf__track'), down = null;
  track.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = { x: e.clientX, s: track.scrollLeft, moved: false }; });
  window.addEventListener('pointermove', function (e) { if (!down) return; var d = e.clientX - down.x; if (Math.abs(d) > 4) down.moved = true; track.scrollLeft = down.s - d; });
  window.addEventListener('pointerup', function () { setTimeout(function () { down = null; }, 0); });
  track.addEventListener('click', function (e) { if (down && down.moved) e.preventDefault(); }, true);

  HK.socialGrid(document.querySelector('[data-social]'), 6);

  HKTryOn.mount(document.querySelector('[data-tryon]'), { reveal: 'wipe' });

  HKButterfly.init({ size: 44, ink: '#9A4826', inkDark: '#F5E8CE', wander: .26, focus: .4 });

  // folio page numbers follow the chapter in view
  var folio = document.querySelector('.folio span:last-child');
  var chapters = [].slice.call(document.querySelectorAll('.chapter'));
  HK.onScroll(function () {
    var n = 1;
    chapters.forEach(function (c, i) { if (c.getBoundingClientRect().top < innerHeight * .5) n = i + 2; });
    folio.textContent = 'hlm. ' + String(n).padStart(2, '0');
  });
});
