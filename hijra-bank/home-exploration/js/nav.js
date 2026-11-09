/* Hijra Bank navbar. One markup serves both layouts: floating dropdowns and a two-pane
   "Layanan" panel on desktop, a full-screen accordion at 900px and below. */
(function () {
  'use strict';
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var nav = document.querySelector('[data-nav]'), burger = nav.querySelector('[data-burger]'), home = nav.querySelector('[data-nav-home]');
  var items = $$('[data-dd]', nav);
  var compact = window.matchMedia('(max-width: 900px)');
  var mouse = window.matchMedia('(hover: hover) and (pointer: fine)');
  var current = null, openTimer = 0, closeTimer = 0, catTimer = 0;
  var OPEN_DELAY = 70, CLOSE_DELAY = 240, CAT_DELAY = 130;

  home.search = location.search; // keep the hero being reviewed

  function trigger(item) { return item.querySelector('.nav__top'); }
  function isMega(item) { return !!item.querySelector('.dd--mega'); }
  function focusables(root) {
    return $$('a[href], button', root).filter(function (el) { return getComputedStyle(el).visibility === 'visible' && el.offsetParent !== null; });
  }

  /* ---------- nested groups ---------- */
  function setSub(group, on) {
    group.classList.toggle('is-on', on);
    group.querySelector('button').setAttribute('aria-expanded', on ? 'true' : 'false');
  }
  function selectSub(group) {
    $$('[data-sub]', group.parentNode).forEach(function (g) { setSub(g, g === group); });
  }
  function resetSubs(item) { $$('[data-sub]', item).forEach(function (g) { setSub(g, false); }); }

  /* ---------- open / close ---------- */
  function open(item, pinned) {
    clearTimeout(closeTimer);
    if (current && current !== item) close(current);
    if (current !== item) {
      item.classList.add('is-open');
      trigger(item).setAttribute('aria-expanded', 'true');
      current = item;
      // The desktop panel should never open with an empty right-hand pane.
      if (isMega(item) && !compact.matches) selectSub(item.querySelector('[data-sub]'));
    }
    item.dataset.pinned = pinned ? '1' : '';
  }
  function close(item) {
    item.classList.remove('is-open');
    item.dataset.pinned = '';
    trigger(item).setAttribute('aria-expanded', 'false');
    resetSubs(item);
    if (current === item) current = null;
  }
  function closeAll() { clearTimeout(openTimer); clearTimeout(closeTimer); clearTimeout(catTimer); if (current) close(current); }

  function setMenu(on) {
    nav.classList.toggle('open', on);
    burger.setAttribute('aria-expanded', on ? 'true' : 'false');
    burger.querySelector('.sr-only').textContent = on ? 'Tutup menu' : 'Menu';
    document.body.style.overflow = on ? 'hidden' : '';
    if (!on) closeAll();
  }
  burger.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });

  items.forEach(function (item) {
    var btn = trigger(item), panel = item.querySelector('.dd');

    btn.addEventListener('click', function () {
      if (current !== item) { open(item, true); return; }
      if (compact.matches || item.dataset.pinned) { close(item); return; }
      item.dataset.pinned = '1'; // hover opened it, so the first click keeps it open
    });

    // Hover intent: mouse only, so touch and keyboard never fight with it.
    item.addEventListener('pointerenter', function (e) {
      if (e.pointerType !== 'mouse' || compact.matches || !mouse.matches) return;
      clearTimeout(closeTimer); clearTimeout(openTimer);
      openTimer = setTimeout(function () { if (current !== item) open(item, false); }, current ? 0 : OPEN_DELAY);
    });
    item.addEventListener('pointerleave', function (e) {
      if (e.pointerType !== 'mouse' || compact.matches) return;
      clearTimeout(openTimer);
      if (item.dataset.pinned) return;
      closeTimer = setTimeout(function () { if (current === item && !item.dataset.pinned) close(item); }, CLOSE_DELAY);
    });

    $$('[data-sub]', item).forEach(function (group) {
      var head = group.querySelector('button'), mega = isMega(item);
      head.addEventListener('click', function () {
        if (mega && !compact.matches) { selectSub(group); return; }
        var on = group.classList.contains('is-on');
        selectSub(group);
        if (on) setSub(group, false);
      });
      if (!mega) return;
      head.addEventListener('focus', function () { if (!compact.matches) selectSub(group); });
      // The short delay lets the mouse cross other rows on its way into the right pane.
      head.addEventListener('pointerenter', function (e) {
        if (e.pointerType !== 'mouse' || compact.matches) return;
        clearTimeout(catTimer);
        catTimer = setTimeout(function () { selectSub(group); }, group.parentNode.querySelector('.is-on') ? CAT_DELAY : 0);
      });
      group.querySelector('.dd__sub').addEventListener('pointerenter', function () { clearTimeout(catTimer); });
    });

    /* ---------- keyboard ---------- */
    btn.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowDown') return;
      e.preventDefault();
      open(item, true);
      var first = focusables(panel)[0];
      if (first) setTimeout(function () { first.focus(); }, 30);
    });
    panel.addEventListener('keydown', function (e) {
      var el = document.activeElement, list, i;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        var scope = el.closest('.dd__sub') && !compact.matches && isMega(item) ? el.closest('.dd__sub') : panel;
        list = focusables(scope).filter(function (x) { return scope !== panel || !isMega(item) || compact.matches || !x.closest('.dd__sub'); });
        i = list.indexOf(el);
        if (i < 0) return;
        e.preventDefault();
        list[(i + (e.key === 'ArrowDown' ? 1 : -1) + list.length) % list.length].focus();
      } else if (e.key === 'ArrowRight' && isMega(item) && !compact.matches && el.matches('[data-sub] > .dd__cat')) {
        e.preventDefault();
        var g = el.parentNode; selectSub(g);
        var a = g.querySelector('.dd__sub a');
        setTimeout(function () { a.focus(); }, 30);
      } else if (e.key === 'ArrowLeft' && el.closest('.dd__sub') && isMega(item) && !compact.matches) {
        e.preventDefault();
        el.closest('[data-sub]').querySelector('.dd__cat').focus();
      }
    });
  });

  // Left and right walk the top-level items, including the plain links.
  var tops = $$('a.nav__top, button.nav__top', nav);
  tops.forEach(function (t, i) {
    t.addEventListener('keydown', function (e) {
      if (compact.matches || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
      e.preventDefault();
      closeAll();
      tops[(i + (e.key === 'ArrowRight' ? 1 : -1) + tops.length) % tops.length].focus();
    });
  });

  /* ---------- dismissal ---------- */
  document.addEventListener('pointerdown', function (e) {
    if (current && !e.target.closest('[data-dd]')) closeAll();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (current) { var t = trigger(current); closeAll(); t.focus(); }
    else if (nav.classList.contains('open')) { setMenu(false); burger.focus(); }
  });
  nav.addEventListener('focusout', function (e) {
    if (!current || compact.matches || !e.relatedTarget) return;
    if (!current.contains(e.relatedTarget)) closeAll();
  });
  nav.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (a && nav.classList.contains('open')) setMenu(false);
    else if (a && current) closeAll();
  });
  compact.addEventListener('change', function () { setMenu(false); });

  /* ---------- scroll state: solid bar + the item for the section in view ---------- */
  var spies = items.filter(function (i) { return i.dataset.spy; }).map(function (i) {
    return { btn: trigger(i), el: document.getElementById(i.dataset.spy) };
  });
  var ticking = false;
  function onScroll() {
    ticking = false;
    nav.classList.toggle('solid', window.scrollY > window.innerHeight - 90);
    var line = 120, bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4, on = null;
    spies.forEach(function (s) {
      var r = s.el.getBoundingClientRect();
      if (r.top <= line && r.bottom > line) on = s;
    });
    if (bottom) on = spies[spies.length - 1];
    spies.forEach(function (s) {
      s.btn.classList.toggle('is-active', s === on);
      if (s === on) s.btn.setAttribute('aria-current', 'location'); else s.btn.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();
