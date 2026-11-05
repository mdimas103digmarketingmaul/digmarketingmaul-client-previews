/* Hijra Bank — Option 02 · interactions (vanilla JS) */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const rupiah = (n) => 'Rp' + Math.round(n).toLocaleString('id-ID');

  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------- nav ---------- */
  const film = $('[data-film]');
  const nav = $('[data-nav]');
  const chip = $('.pchip');
  const burger = $('[data-burger]');
  const menu = $('[data-menu]');
  let lastY = scrollY;
  let ticking = false;
  const onScroll = () => {
    const y = scrollY;
    if (!nav.classList.contains('open')) {
      nav.classList.toggle('solid', y > 20);
      if (y > lastY + 4 && y > 600) { nav.classList.add('hide'); chip && chip.classList.add('hide'); }
      else if (y < lastY - 4 || y < 600) { nav.classList.remove('hide'); chip && chip.classList.remove('hide'); }
    }
    lastY = y;
    fillWords();
    expandFilm();
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });

  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    if (open) nav.classList.remove('solid', 'hide');
    burger.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) onScroll();
  };
  burger.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); burger.focus(); } });

  /* ---------- reveal ---------- */
  const rv = $$('.rv');
  if ('IntersectionObserver' in window && !still) {
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    rv.forEach((el) => io.observe(el));
  } else rv.forEach((el) => el.classList.add('is-in'));

  /* ---------- hero: rotating word ---------- */
  const rot = $('[data-rotator]');
  if (rot && !still) {
    const words = $$('.rot__w', rot);
    let i = 0;
    setInterval(() => {
      if (document.hidden) return;
      const cur = words[i];
      i = (i + 1) % words.length;
      cur.classList.remove('is-on'); cur.classList.add('is-out');
      words[i].classList.remove('is-out'); words[i].classList.add('is-on');
      setTimeout(() => cur.classList.remove('is-out'), 600);
    }, 2400);
  }

  /* ---------- hero: manifesto video (sound on by default) ----------
     Browsers block autoplay *with sound* until the visitor interacts with the page.
     So: try with sound → if blocked, play muted and switch the sound on at the
     visitor's first tap/click/key. After one full pass it keeps looping silently. */
  if (film) {
    const v = $('video', film);
    const playBtn = $('[data-film-toggle]', film);
    const playLabel = $('[data-film-label]', film);
    const sndBtn = $('[data-film-sound]', film);
    const sndLabel = $('[data-sound-label]', film);
    const light = matchMedia('(max-width: 900px)').matches || (navigator.connection && navigator.connection.saveData);
    let userPaused = still;
    let wantSound = true;
    let inView = false;
    v.muted = false;

    const setPlay = (on) => {
      film.classList.toggle('is-paused', !on);
      playLabel.textContent = on ? 'Jeda' : 'Putar';
      playBtn.setAttribute('aria-label', on ? 'Jeda video' : 'Putar video');
    };
    const setSound = () => {
      const on = !v.muted;
      film.classList.toggle('is-muted', !on);
      sndLabel.textContent = on ? 'Suara aktif' : 'Nyalakan suara';
      sndBtn.setAttribute('aria-pressed', String(on));
      sndBtn.setAttribute('aria-label', on ? 'Matikan suara' : 'Nyalakan suara');
    };
    const unlock = (e) => {
      if (e.target.closest && e.target.closest('[data-film-sound]')) return disarm();
      if (wantSound && v.muted) { v.muted = false; setSound(); }
      disarm();
    };
    const arm = () => ['pointerdown', 'keydown', 'touchstart'].forEach((t) => addEventListener(t, unlock, true));
    const disarm = () => ['pointerdown', 'keydown', 'touchstart'].forEach((t) => removeEventListener(t, unlock, true));

    let busy = false;
    const play = () => {
      if (busy) return;
      busy = true;
      if (!v.getAttribute('src')) v.src = light ? v.dataset.srcSm : v.dataset.srcLg;
      Promise.resolve(v.play())
        .catch((err) => {
          if (err && err.name === 'NotAllowedError' && !v.muted) {
            v.muted = true; setSound(); arm();   // blocked with sound → continue muted
            return v.play();
          }
          throw err;
        })
        .catch(() => setTimeout(() => { if (inView && !userPaused && v.paused) v.play().catch(() => {}); }, 400))
        .finally(() => { busy = false; });
    };
    v.addEventListener('playing', () => setPlay(true));
    v.addEventListener('pause', () => setPlay(false));

    playBtn.addEventListener('click', () => {
      if (v.paused) { userPaused = false; play(); } else { userPaused = true; v.pause(); setPlay(false); }
    });
    sndBtn.addEventListener('click', () => {
      v.muted = !v.muted; wantSound = !v.muted; setSound();
      if (!v.muted) disarm();
      if (v.paused && !userPaused) play();
    });
    v.addEventListener('ended', () => {
      // one full pass with sound done → keep looping silently
      v.muted = true; wantSound = false; disarm(); setSound();
      v.loop = true; v.currentTime = 0; v.play();
    });

    setPlay(false); setSound();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => {
        inView = en.isIntersecting;
        if (inView) { if (!userPaused) play(); }
        else if (!v.paused) v.pause();
      }, { threshold: 0.25 }).observe(film);
    } else { inView = true; if (!userPaused) play(); }
  }

  /* ---------- features: auto-advancing showcase ---------- */
  const feat = $('[data-feat]');
  if (feat) {
    const items = $$('.feat__item', feat);
    const imgs = $$('.feat__img', feat);
    let cur = 0;
    const show = (i, focus) => {
      cur = (i + items.length) % items.length;
      items.forEach((b, k) => {
        const on = k === cur;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-selected', String(on));
        b.tabIndex = on ? 0 : -1;
        // restart bar animation
        const bar = $('.feat__bar i', b); bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
      });
      imgs.forEach((im, k) => im.classList.toggle('is-on', k === cur));
      if (focus) items[cur].focus();
    };
    items.forEach((b, k) => {
      b.addEventListener('click', () => show(k));
      $('.feat__bar i', b).addEventListener('animationend', () => { if (b.classList.contains('is-on')) show(cur + 1); });
      b.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); show(cur + 1, true); }
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); show(cur - 1, true); }
      });
    });
    if (still) feat.classList.add('static');
    // pause while hovered, focused, or offscreen
    const pause = (p) => feat.classList.toggle('paused', p);
    feat.addEventListener('pointerenter', () => pause(true));
    feat.addEventListener('pointerleave', () => pause(false));
    feat.addEventListener('focusin', () => pause(true));
    feat.addEventListener('focusout', () => pause(false));
    if ('IntersectionObserver' in window) {
      let visible = false;
      new IntersectionObserver(([en]) => {
        visible = en.isIntersecting;
        feat.classList.toggle('offscreen', !visible);
        if (!feat.matches(':hover')) pause(!visible);
      }, { threshold: 0.3 }).observe(feat);
    }
  }

  /* ---------- Hijra Box simulator ---------- */
  const sim = $('[data-sim]');
  if (sim) {
    const amount = $('[data-amount]', sim);
    const amountOut = $('[data-amount-out]', sim);
    const sliders = $$('[data-p]', sim);
    const quick = $$('[data-set]', sim);
    const jars = { main: $('[data-jar="main"]', sim), 0: $('[data-jar="0"]', sim), 1: $('[data-jar="1"]', sim), 2: $('[data-jar="2"]', sim) };
    const paint = (jar, pct, value) => {
      $('.jar__fill', jar).style.setProperty('--p', pct);
      $('[data-pct]', jar).textContent = `${pct}%`;
      $('[data-rp]', jar).textContent = rupiah(value);
    };
    const track = (el) => el.style.setProperty('--v', `${((el.value - el.min) / (el.max - el.min)) * 100}%`);
    const render = () => {
      const total = Number(amount.value);
      [amount, ...sliders].forEach(track);
      amountOut.textContent = rupiah(total);
      quick.forEach((q) => q.classList.toggle('on', Number(q.dataset.set) === total));
      let used = 0;
      sliders.forEach((s) => {
        const p = Number(s.value);
        used += p;
        $(`[data-p-out="${s.dataset.p}"]`, sim).textContent = `${p}%`;
        paint(jars[s.dataset.p], p, total * p / 100);
      });
      const main = Math.max(0, 100 - used);
      paint(jars.main, main, total * main / 100);
    };
    sliders.forEach((s) => s.addEventListener('input', () => {
      const others = sliders.filter((o) => o !== s).reduce((a, o) => a + Number(o.value), 0);
      if (Number(s.value) + others > 100) s.value = 100 - others;
      render();
    }));
    amount.addEventListener('input', render);
    quick.forEach((q) => q.addEventListener('click', () => { amount.value = q.dataset.set; render(); }));
    render();
  }

  /* ---------- products: expanding cards + spotlight ---------- */
  const prods = $('[data-prods]');
  if (prods) {
    const cards = $$('.prod', prods);
    const open = (c) => cards.forEach((x) => x.classList.toggle('is-open', x === c));
    cards.forEach((c) => {
      c.addEventListener('mouseenter', () => { if (fine) open(c); });
      c.addEventListener('focusin', () => open(c));
      c.addEventListener('click', () => open(c));
      c.addEventListener('pointermove', (e) => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--x', `${e.clientX - r.left}px`);
        c.style.setProperty('--y', `${e.clientY - r.top}px`);
      });
    });
  }

  /* ---------- scroll-lit statement ---------- */
  const fill = $('[data-fill]');
  let words = [];
  if (fill) {
    const text = fill.textContent.trim().split(/\s+/);
    fill.innerHTML = text.map((w, i) => `<span class="w${i >= text.length - 2 ? ' accent' : ''}">${w}</span>`).join(' ');
    fill.setAttribute('aria-label', text.join(' '));
    words = $$('.w', fill);
  }
  function fillWords() {
    if (!fill || still) { words.forEach((w) => w.classList.add('lit')); return; }
    const r = fill.getBoundingClientRect();
    const vh = innerHeight;
    const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.5)));
    const n = Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle('lit', i < n));
  }

  /* ---------- video card grows to full-bleed while scrolling ---------- */
  function expandFilm() {
    if (!film || still) return;
    const w = film.offsetWidth;
    const vw = document.documentElement.clientWidth;
    if (w >= vw - 1) { film.style.transform = ''; return; }
    const p = Math.min(1, Math.max(0, scrollY / (innerHeight * 0.55)));
    const k = 1 + (vw / w - 1) * p;
    film.style.transform = `scale(${k.toFixed(4)})`;
    film.style.borderRadius = `${(28 * (1 - p) / k).toFixed(2)}px`;
  }
  addEventListener('resize', expandFilm);

  /* ---------- media marquee: duplicate for seamless loop ---------- */
  const track = $('[data-media]');
  if (track && !still) {
    $$('.mcard', track).forEach((c) => {
      const d = c.cloneNode(true);
      d.setAttribute('aria-hidden', 'true'); d.tabIndex = -1;
      track.appendChild(d);
    });
  }

  onScroll();
})();
