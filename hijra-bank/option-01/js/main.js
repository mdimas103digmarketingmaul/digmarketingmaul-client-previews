/* Hijra Bank — Option 01 · interactions (vanilla JS, no dependencies) */
(() => {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const still = reduceMotion.matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const film = $('[data-film]');

  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------- Nav: solid after scrolling, hides on scroll down ---------- */
  const nav = $('[data-nav]');
  const chip = $('.preview-chip');
  const menu = $('[data-menu]');
  const toggle = $('[data-menu-toggle]');
  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    const open = nav.classList.contains('menu-open');
    if (!open) {
      nav.classList.toggle('is-solid', y > 24);
      const down = y > lastY + 4;
      const up = y < lastY - 4;
      const hide = down && y > 600;
      if (hide) { nav.classList.add('is-hidden'); chip && chip.classList.add('is-hidden'); }
      else if (up || y < 600) { nav.classList.remove('is-hidden'); chip && chip.classList.remove('is-hidden'); }
    }
    lastY = y;
    expandFilm();
    markCurrent();
    ctaScroll();
    ticking = false;
  };
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });

  /* ---------- Mobile menu ---------- */
  const setMenu = (open) => {
    nav.classList.toggle('menu-open', open);
    if (open) nav.classList.remove('is-solid', 'is-hidden');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.sr-only').textContent = open ? 'Tutup menu' : 'Buka menu';
    menu.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) update();
  };
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('menu-open')));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('menu-open')) { setMenu(false); toggle.focus(); }
  });
  window.matchMedia('(min-width: 961px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- Active section in nav ----------
     Only highlight a link once its section actually reaches the upper part of the
     viewport; nothing is highlighted while the visitor is still in the hero. */
  const links = $$('.nav__links a');
  const targets = links.map((a) => [a, document.getElementById(a.getAttribute('href').slice(1))]).filter(([, el]) => el);
  function markCurrent() {
    const line = innerHeight * 0.35;
    let current = null;
    targets.forEach(([a, el]) => { if (el.getBoundingClientRect().top <= line) current = a; });
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) current = targets[targets.length - 1][0];
    links.forEach((l) => l.classList.toggle('is-current', l === current));
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
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

  /* ---------- video card grows to full-bleed while scrolling ---------- */
  function expandFilm() {
    if (!film || still) return;
    const w = film.offsetWidth;
    const vw = document.documentElement.clientWidth;
    if (w >= vw - 1) { film.style.transform = ''; return; }
    const p = Math.min(1, Math.max(0, scrollY / (innerHeight * 0.55)));
    const k = 1 + (vw / w - 1) * p;
    film.style.transform = `scale(${k.toFixed(4)})`;
    film.style.borderRadius = `${(24 * (1 - p) / k).toFixed(2)}px`;
  }
  addEventListener('resize', expandFilm);

  /* ---------- Hijra Box: interactive illustration ----------
     Tap a goal → it flies into the phone as a box. Tap a box → "save", coins pop
     and progress grows to its target. Auto-demo once when first seen. */
  const boxPlay = $('[data-boxplay]');
  if (boxPlay) {
    const grid = $('[data-bx-grid]', boxPlay);
    const count = $('[data-bx-count]', boxPlay);
    const live = $('[data-bx-live]', boxPlay);
    const hint = $('[data-bx-hint]', boxPlay);
    const phone = $('[data-bx-tilt]', boxPlay);
    const picks = $$('.bx-pick', boxPlay);
    const tiles = new Map();
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));

    const setCount = () => {
      count.textContent = String(1 + tiles.size);
      count.classList.remove('bump'); void count.offsetWidth; count.classList.add('bump');
    };
    const coins = (from, n) => {
      if (still) return;
      const r = from.getBoundingClientRect();
      for (let i = 0; i < n; i += 1) {
        const c = document.createElement('span');
        c.className = 'bx-coin';
        c.style.left = `${r.left + r.width / 2 - 6}px`;
        c.style.top = `${r.top + r.height / 2 - 6}px`;
        document.body.appendChild(c);
        const dx = (Math.random() - 0.5) * 120;
        const dy = -50 - Math.random() * 70;
        const anim = c.animate([
          { transform: 'translate(0,0) scale(.6)', opacity: 1 },
          { transform: `translate(${dx * 0.6}px, ${dy}px) scale(1)`, opacity: 1, offset: 0.55 },
          { transform: `translate(${dx}px, ${dy + 40}px) scale(.8)`, opacity: 0 }
        ], { duration: 750 + Math.random() * 250, easing: 'cubic-bezier(.2,.8,.2,1)' });
        anim.onfinish = () => c.parentNode && c.parentNode.removeChild(c);
      }
    };
    const save = (key) => {
      const t = tiles.get(key);
      if (!t) return;
      const p = Math.min(100, t.p + 10 + Math.round(Math.random() * 12));
      t.p = p;
      t.el.style.setProperty('--p', p);
      $('.bx-pct', t.el).textContent = `${p}%`;
      t.el.classList.remove('tap'); void t.el.offsetWidth; t.el.classList.add('tap');
      t.el.classList.toggle('is-done', p >= 100);
      coins(t.el, p >= 100 ? 14 : 6);
      live.textContent = `${t.name}: progres ${p}%${p >= 100 ? ', target tercapai' : ''}`;
      hint.textContent = p >= 100 ? 'Target tercapai! Coba box lainnya' : 'Ketuk lagi untuk terus menabung';
    };
    const fly = (from, to) => {
      if (still || !from.animate) return Promise.resolve();
      const a = from.getBoundingClientRect();
      const b = to.getBoundingClientRect();
      const ghost = from.cloneNode(true);
      ghost.classList.add('bx-ghost');
      ghost.removeAttribute('aria-pressed');
      Object.assign(ghost.style, { left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px`, transformOrigin: '0 0' });
      document.body.appendChild(ghost);
      const sx = b.width / a.width;
      const sy = b.height / a.height;
      const anim = ghost.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${(b.left - a.left) * 0.5}px, ${(b.top - a.top) * 0.5 - 60}px) scale(${(1 + sx) / 2}, ${(1 + sy) / 2})`, opacity: 1 },
        { transform: `translate(${b.left - a.left}px, ${b.top - a.top}px) scale(${sx}, ${sy})`, opacity: 0.2 }
      ], { duration: 650, easing: 'cubic-bezier(.5,0,.2,1)' });
      return anim.finished.then(() => ghost.parentNode && ghost.parentNode.removeChild(ghost));
    };
    const addBox = (btn) => {
      const key = btn.dataset.goal;
      if (tiles.has(key)) return Promise.resolve();
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'bx-tile';
      b.style.setProperty('--c', btn.style.getPropertyValue('--c'));
      b.style.setProperty('--p', 0);
      b.setAttribute('aria-label', `Nabung ke box ${btn.dataset.name}`);
      b.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#${btn.dataset.icon}"/></svg><span class="bx-tile__tag">${btn.dataset.tag}</span><b>${btn.dataset.name}</b><span class="bx-bar"><i></i></span><span class="bx-pct">0%</span>`;
      li.appendChild(b);
      li.style.visibility = 'hidden';
      grid.appendChild(li);
      tiles.set(key, { el: b, li, p: 0, name: btn.dataset.name });
      btn.setAttribute('aria-pressed', 'true');
      b.addEventListener('click', () => save(key));
      setCount();
      live.textContent = `Box ${btn.dataset.name} ditambahkan`;
      return fly(btn, b).then(() => { li.style.visibility = ''; b.classList.add('is-new'); });
    };
    const dropBox = (btn) => {
      const t = tiles.get(btn.dataset.goal);
      if (!t) return;
      tiles.delete(btn.dataset.goal);
      btn.setAttribute('aria-pressed', 'false');
      t.el.classList.add('is-out');
      setTimeout(() => t.li.parentNode && t.li.parentNode.removeChild(t.li), 300);
      setCount();
      live.textContent = `Box ${btn.dataset.name} dihapus`;
    };
    picks.forEach((btn) => btn.addEventListener('click', () => {
      if (btn.getAttribute('aria-pressed') === 'true') dropBox(btn); else addBox(btn);
    }));

    if (fine && !still) {
      boxPlay.addEventListener('pointermove', (e) => {
        const r = phone.getBoundingClientRect();
        phone.style.setProperty('--rx', (((e.clientX - r.left) / r.width - 0.5) * 14).toFixed(2));
        phone.style.setProperty('--ry', (-((e.clientY - r.top) / r.height - 0.5) * 10).toFixed(2));
      });
      boxPlay.addEventListener('pointerleave', () => { phone.style.setProperty('--rx', 0); phone.style.setProperty('--ry', 0); });
    }

    const demo = () => {
      const [p1, p2] = picks;
      addBox(p1)
        .then(() => wait(250)).then(() => addBox(p2))
        .then(() => wait(400)).then(() => { save(p1.dataset.goal); return wait(450); })
        .then(() => { save(p1.dataset.goal); save(p2.dataset.goal); });
    };
    if ('IntersectionObserver' in window) {
      const seen = new IntersectionObserver(([en]) => {
        if (en.isIntersecting) { seen.disconnect(); setTimeout(demo, 500); }
      }, { threshold: 0.45 });
      seen.observe(boxPlay);
    } else demo();
  }

  /* ---------- CTA: device picker, word reveal, typing splash, tilt ---------- */
  const words = $('[data-words]');
  if (words) {
    const parts = words.textContent.trim().split(/\s+/);
    words.setAttribute('aria-label', parts.join(' '));
    words.innerHTML = parts.map((w, i) => `<span class="w" style="--i:${i}" aria-hidden="true">${w}</span>`).join(' ');
  }
  const osScope = $('[data-os-scope]');
  const osBtns = $$('[data-os]');
  if (osScope && osBtns.length) {
    const hint = $('[data-os-hint]', osScope);
    const pick = (os) => {
      osBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.os === os)));
      osScope.classList.add('has-os');
      $$('[data-store]', osScope).forEach((a) => a.classList.toggle('is-pick', a.dataset.store === os));
      hint.textContent = os === 'ios' ? 'di iPhone, lalu buka App Store.' : 'di Android, lalu buka Google Play.';
    };
    osBtns.forEach((b) => b.addEventListener('click', () => pick(b.dataset.os)));
    const ua = navigator.userAgent || '';
    if (/iPhone|iPad|iPod/i.test(ua)) pick('ios');
    else if (/Android/i.test(ua)) pick('android');
  }
  const ctaPhone = $('[data-cta-phone]');
  if (ctaPhone) {
    const typed = $('[data-type]', ctaPhone);
    const full = typed.dataset.type;
    const type = () => {
      if (still) return;
      ctaPhone.classList.add('is-typing');
      typed.textContent = '';
      let i = 0;
      const step = () => {
        typed.textContent = full.slice(0, i);
        i += 1;
        if (i <= full.length) setTimeout(step, 70);
        else setTimeout(() => ctaPhone.classList.remove('is-typing'), 1600);
      };
      setTimeout(step, 500);
    };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => { if (en.isIntersecting) type(); }, { threshold: 0.6 }).observe(ctaPhone);
    }
    const cta = $('#unduh');
    if (fine && !still && cta) {
      cta.addEventListener('pointermove', (e) => {
        const r = cta.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        ctaPhone.style.transform = `perspective(1000px) rotateY(${(x * 14).toFixed(2)}deg) rotateX(${(-y * 10).toFixed(2)}deg) rotate(5deg)`;
      });
      cta.addEventListener('pointerleave', () => { ctaPhone.style.transform = ''; });
    }
  }
  const ctaArc = $('.cta__arc');
  const fab = $('[data-fab]');
  function ctaScroll() {
    const cta = $('#unduh');
    if (!cta) return;
    const r = cta.getBoundingClientRect();
    if (ctaArc && !still && r.top < innerHeight && r.bottom > 0) {
      const p = 1 - (r.bottom / (innerHeight + r.height));
      ctaArc.style.setProperty('--rot', `${(p * 24 - 12).toFixed(2)}deg`);
    }
    if (fab) fab.classList.toggle('is-away', r.top < innerHeight * 0.85 || nav.classList.contains('menu-open'));
  }

  /* ---------- Deposito tenor timeline (flow only, no figures) ---------- */
  const timeline = $('[data-timeline]');
  const tenorBtns = $$('[data-tenor]');
  const render = (months) => {
    if (!timeline) return;
    const items = ['<li class="is-start" style="--i:0"><span>Mulai</span></li>'];
    for (let m = 1; m <= months; m += 1) {
      const end = m === months;
      const label = end ? 'Jatuh tempo' : (months > 3 ? String(m) : `Bulan ${m}`);
      items.push(`<li class="${end ? 'is-end' : ''}" style="--i:${m}"><span>${label}</span></li>`);
    }
    timeline.toggleAttribute('data-dense', months > 6);
    timeline.innerHTML = `<div class="timeline__track"><span class="timeline__fill"></span></div><ol>${items.join('')}</ol>
      <p class="sr-only">Tenor ${months} bulan: bagi hasil diberikan setiap bulan, lalu jatuh tempo — dana dapat dicairkan atau diperpanjang otomatis.</p>`;
  };
  tenorBtns.forEach((b) => b.addEventListener('click', () => {
    tenorBtns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    render(Number(b.dataset.tenor));
  }));
  render(12);

  /* ---------- Tabs (WAI-ARIA) ---------- */
  $$('[data-tabs]').forEach((root) => {
    const tabs = $$('[role="tab"]', root);
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const p = document.getElementById(t.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
      if (focus) tab.focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', (e) => {
        const map = { ArrowRight: tabs[(i + 1) % tabs.length], ArrowLeft: tabs[(i - 1 + tabs.length) % tabs.length], Home: tabs[0], End: tabs[tabs.length - 1] };
        if (map[e.key]) { e.preventDefault(); select(map[e.key], true); }
      });
    });
  });

  update();
  markCurrent();
  ctaScroll();
})();
