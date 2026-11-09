/* Option 03: looping columns of boxes pour out from behind the giant Main Box. */
(function () {
  var wall = document.querySelector('[data-wall]'), sumEl = document.querySelector('[data-sum]');
  var hero = document.querySelector('.hero');
  var sum = 0, cells = [];
  var CARD = parseFloat(getComputedStyle(hero).getPropertyValue('--bs')) * 16.5 + 14;
  // sized for the largest this window can get, so resizing never exposes a gap
  var COUNT = Math.ceil(Math.max(window.screen.width, window.innerWidth) / CARD) | 1;

  function shuffled(seed) {
    var a = HB.BOXES.slice(), s = seed;
    for (var i = a.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; var j = Math.floor(s / 233280 * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function showSum(v) { sumEl.textContent = HB.fmt(v); }
  function addSum(d, ms) { var from = sum; sum += d; HB.tween(ms || 500, function (t) { showSum(from + d * t); }); }

  function makeCell(b, isCopy) {
    var btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'cell';
    var el = HB.card(b);
    btn.appendChild(el);
    if (isCopy) { btn.tabIndex = -1; btn.setAttribute('aria-hidden', 'true'); }
    else btn.setAttribute('aria-label', 'Top-up box ' + b.name);
    btn.addEventListener('click', function (e) {
      var data = el._b, step = (data.target || data.amount * 4) * .22, r = btn.getBoundingClientRect();
      HB.toast(r.left + r.width / 2, r.top + 10, '+' + HB.fmt(step));
      addSum(step);
      HB.fillTo(el, data.amount + step, 480).then(function (hit) {
        if (hit) HB.burst(r.left + r.width / 2, r.top + r.height / 2, 30);
      });
      e.currentTarget.blur();
    });
    return { btn: btn, el: el };
  }

  function build() {
    var perCol = Math.ceil(Math.max(window.screen.height, window.innerHeight) / 190) + 1;
    for (var c = 0; c < COUNT; c++) {
      var col = document.createElement('div'); col.className = 'col';
      var boxes = shuffled(c * 37 + 11).slice(0, perCol);
      [false, true].forEach(function (copy) {
        boxes.forEach(function (b) {
          var cell = makeCell(b, copy);
          col.appendChild(cell.btn);
          cells.push({ btn: cell.btn, el: cell.el, col: c });
          if (!copy) sum += b.amount;
        });
      });
      wall.appendChild(col);
    }
    showSum(0);

    Array.prototype.forEach.call(wall.children, function (col, c) {
      if (HB.REDUCED) return;
      var up = c % 2 === 0, dur = 62000 + c * 5200;
      // translate by exactly one set (half the column, including its trailing gap)
      var a = col.animate(
        up ? [{ transform: 'translateY(0)' }, { transform: 'translateY(calc(-50% - 7px))' }]
           : [{ transform: 'translateY(calc(-50% - 7px))' }, { transform: 'translateY(0)' }],
        { duration: dur, iterations: Infinity });
      col.addEventListener('pointerenter', function () { a.playbackRate = .08; });
      col.addEventListener('pointerleave', function () { a.playbackRate = 1; });
    });
  }

  // Cards leave the giant box outward, nearest first.
  function intro() {
    var hr = hero.getBoundingClientRect(), cx = hr.width / 2, cy = hr.height / 2;
    cells.forEach(function (c) {
      if (HB.REDUCED) return;
      var r = c.btn.getBoundingClientRect();
      if (r.right < 0 || r.left > hr.width || r.top > hr.height) return;
      var dx = r.left + r.width / 2 - cx, dy = r.top + r.height / 2 - cy, d = Math.hypot(dx, dy);
      c.btn.animate([
        { transform: 'translate(' + (-dx * .88) + 'px,' + (-dy * .88) + 'px) scale(.3)', opacity: 0 },
        { opacity: 1, offset: .35 },
        { transform: 'none', opacity: 1 }
      ], { duration: 950, delay: 220 + d * .55, easing: 'cubic-bezier(.2,.9,.25,1.08)', fill: 'backwards' });
    });
    HB.wait(500).then(function () { var v = sum; sum = 0; addSum(v, 2100); });
  }

  // A few on-screen cards keep filling to 100%.
  function onScreen() {
    var w = window.innerWidth, h = window.innerHeight, g = document.querySelector('[data-giga]').getBoundingClientRect();
    return cells.filter(function (c) {
      if (!c.el._b.target || c.busy) return false;
      var r = c.btn.getBoundingClientRect();
      if (r.top < 90 || r.bottom > h - 30 || r.left < 0 || r.right > w) return false;
      return r.right < g.left || r.left > g.right || r.bottom < g.top || r.top > g.bottom;
    });
  }
  async function loop() {
    await HB.wait(2400);
    while (!HB.REDUCED) {
      await HB.wait(1500);
      if (document.hidden) continue;
      var pool = onScreen();
      if (!pool.length) continue;
      var c = pool[Math.floor(Math.random() * pool.length)];
      c.busy = true;
      (function (c) {
        var b = c.el._b;
        b.amount = b.target * .06; HB.paint(c.el);
        HB.fillTo(c.el, b.target, 2200).then(function (hit) {
          if (hit) { var r = c.btn.getBoundingClientRect(); HB.burst(r.left + r.width / 2, r.top + r.height / 2, 22); }
          return HB.wait(3200);
        }).then(function () {
          var orig = HB.byId(b.id); HB.fillCard(c.el, HB.clone(orig)); c.busy = false;
        });
      })(c);
    }
  }

  build();
  intro();
  loop();
})();
