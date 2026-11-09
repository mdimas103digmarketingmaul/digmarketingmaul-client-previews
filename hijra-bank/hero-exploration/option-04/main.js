/* Option 04: one goal fills up, then the page washes into the next goal's colour. */
(function () {
  var GOALS = [
    { word: 'Haji.',       name: 'Haji & Umrah',  icon: 'pilgrimage', bg: '#4f8a2c', pill: '#9ed36a', target: 42000000 },
    { word: 'Qurban.',     name: 'Qurban',        icon: 'qurban',     bg: '#067d9e', pill: '#0a9fc9', target: 3500000 },
    { word: 'Rumah.',      name: 'Rumah Impian',  icon: 'house',      bg: '#24457f', pill: '#4a6fb5', target: 120000000 },
    { word: 'Anak.',       name: 'Pendidikan',    icon: 'education',  bg: '#4b1368', pill: '#7b2a9c', target: 18000000 },
    { word: 'Nikah.',      name: 'Nikah',         icon: 'married',    bg: '#8a2460', pill: '#b14184', target: 40000000 },
    { word: 'Sedekah.',    name: 'Sedekah',       icon: 'donation',   bg: '#bd5a26', pill: '#fb9d6c', target: 1000000 }
  ];

  var $ = function (s) { return document.querySelector(s); };
  var hero = $('[data-hero]'), wash = $('[data-wash]'), goalEl = $('[data-goal]'), vault = $('[data-vault]'), tilt = $('[data-tilt]');
  var liquid = $('[data-liquid]'), nameEl = $('[data-name]'), chip = $('[data-chip]'), ic = $('[data-ic]'), amtEl = $('[data-amt]'), pctEl = $('[data-pct]');
  var picker = $('[data-picker]'), drop = $('[data-drop]');
  var theme = document.querySelector('meta[name="theme-color"]');

  var cur = 0, level = 12, token = 0, pills = [];

  GOALS.forEach(function (g) { var i = new Image(); i.src = HB.iconSrc(g.icon); });
  GOALS.forEach(function (g, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'pill'; b.style.setProperty('--pc', g.pill);
    b.setAttribute('aria-label', 'Tujuan: ' + g.name); b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    b.innerHTML = '<span aria-hidden="true">' + g.name + '</span>';
    b.addEventListener('click', function () { go(i); });
    picker.appendChild(b); pills.push(b);
  });

  function placeDrop() {
    var p = pills[cur];
    drop.style.transform = 'translateX(' + (p.offsetLeft + p.offsetWidth / 2 - 11) + 'px)';
  }

  function paint() {
    var g = GOALS[cur], amount = g.target * level / 100;
    liquid.style.setProperty('--lv', level.toFixed(2));
    amtEl.textContent = HB.fmt(amount);
    pctEl.textContent = Math.floor(level) + '%';
    var done = level >= 100;
    chip.classList.toggle('done', done);
    chip.textContent = done ? 'Tercapai!' : 'Nabung terus!';
  }

  function setWord(word) {
    goalEl.textContent = '';
    word.split('').forEach(function (ch, i) {
      var c = document.createElement('i'); c.textContent = ch; goalEl.appendChild(c);
      if (!HB.REDUCED) c.animate([{ transform: 'translateY(.55em) rotate(6deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 520, delay: i * 26, easing: 'cubic-bezier(.2,.9,.25,1.2)', fill: 'backwards' });
    });
  }

  function dress(i) {
    var g = GOALS[i];
    hero.style.setProperty('--bg', g.bg); hero.style.setProperty('--pill', g.pill);
    theme.content = g.bg;
    nameEl.textContent = g.name; ic.src = HB.iconSrc(g.icon);
    setWord(g.word);
  }

  function go(i, keepLevel) {
    if (i === cur && !keepLevel) { level = 10; paint(); run(); return; }
    var g = GOALS[i], pr = pills[i].getBoundingClientRect(), hr = hero.getBoundingClientRect();
    var x = pr.left + pr.width / 2 - hr.left, y = pr.top + pr.height / 2 - hr.top;
    var R = Math.hypot(Math.max(x, hr.width - x), Math.max(y, hr.height - y));
    pills[cur].setAttribute('aria-pressed', 'false'); pills[i].setAttribute('aria-pressed', 'true');
    cur = i; placeDrop(); token++;

    if (HB.REDUCED) { dress(i); level = 62; paint(); return; }
    wash.style.background = g.bg;
    var a = wash.animate([{ clipPath: 'circle(0px at ' + x + 'px ' + y + 'px)' }, { clipPath: 'circle(' + R + 'px at ' + x + 'px ' + y + 'px)' }], { duration: 820, easing: 'cubic-bezier(.65,0,.2,1)', fill: 'forwards' });

    var t = token;
    vault.animate([{ scale: 1 }, { scale: .9, offset: .4 }, { scale: 1 }], { duration: 760, easing: 'cubic-bezier(.34,1.56,.64,1)' });
    HB.wait(300).then(function () {
      if (t !== token) return;
      dress(i); level = 10; paint();
    });
    a.finished.then(function () {
      if (t !== token) return;
      hero.style.background = g.bg;
      a.cancel();
      run();
    });
  }

  async function run() {
    var t = ++token;
    hero.style.background = '';
    if (HB.REDUCED) { level = 62; paint(); return; }
    await HB.wait(350);
    if (t !== token) return;
    var from = level;
    await new Promise(function (done) {
      var dur = 3600 * (100 - from) / 90, t0 = performance.now();
      (function step(now) {
        if (t !== token) return done();
        if (!hold) {
          var k = HB.clamp((now - t0) / dur, 0, 1);
          level = Math.max(level, from + (100 - from) * HB.ease.inOut(k));
          paint();
          if (k >= 1 || level >= 100) return done();
        } else { t0 += 16; }
        requestAnimationFrame(step);
      })(t0);
    });
    if (t !== token) return;
    level = 100; paint();
    var r = vault.getBoundingClientRect();
    HB.burst(r.left + r.width / 2, r.top + r.height * .4, 40);
    await HB.wait(1500);
    if (t !== token || document.hidden) { if (t === token) setTimeout(run, 600); return; }
    go((cur + 1) % GOALS.length, true);
  }

  // Hover pauses the fill so the visitor can top it up by hand.
  var hold = false;
  vault.addEventListener('pointerenter', function () { hold = true; });
  vault.addEventListener('pointerleave', function () { hold = false; tilt.style.transform = ''; });
  vault.addEventListener('pointermove', function (e) {
    if (HB.REDUCED) return;
    var r = vault.getBoundingClientRect();
    var rx = ((e.clientY - r.top) / r.height - .5) * -12, ry = ((e.clientX - r.left) / r.width - .5) * 12;
    tilt.style.transform = 'perspective(900px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
  });
  vault.addEventListener('click', function () {
    var r = vault.getBoundingClientRect(), g = GOALS[cur], step = 14, was = level;
    if (level >= 100) return;
    HB.toast(r.left + r.width / 2, r.top + 40, '+' + HB.fmt(g.target * step / 100));
    HB.tween(420, function (t) { level = Math.min(100, Math.max(level, was + step * t)); paint(); });
  });

  window.addEventListener('resize', placeDrop);
  dress(0); paint(); placeDrop();
  run();
})();
