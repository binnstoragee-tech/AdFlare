/* AdFlare — guided tour (cursor + chat bubble), command palette, nav highlight,
   theme reveal animation, numbered section labels. Needs index.html + portfolio-ui.css. */
(function () {
  'use strict';
  var KEY = 'af_tour_seen';
  var IS_HOME = !!document.getElementById('hero');
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = function () { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; };
  var store = {
    get: function () { try { return localStorage.getItem(KEY); } catch (e) { return null; } },
    set: function () { try { localStorage.setItem(KEY, '1'); } catch (e) {} }
  };
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  /* ---------- sound effects (synthesised, no audio files) ----------
     soft plucks in C major pentatonic + a touch of echo, so everything sits in the same key */
  var AC = null, bus = null, SFX_KEY = 'af_sfx_off';
  var muted = (function () { try { return localStorage.getItem(SFX_KEY) === '1'; } catch (e) { return false; } })();
  function actx() {
    if (muted) return null;
    if (!AC) {
      var C = window.AudioContext || window.webkitAudioContext; if (!C) return null;
      try { AC = new C(); } catch (e) { return null; }
      bus = AC.createGain(); bus.gain.value = 0.9;
      var lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 5200;
      var dl = AC.createDelay(); dl.delayTime.value = 0.13;
      var fb = AC.createGain(); fb.gain.value = 0.26;
      var wet = AC.createGain(); wet.gain.value = 0.2;
      bus.connect(lp); lp.connect(AC.destination);
      lp.connect(dl); dl.connect(fb); fb.connect(dl); dl.connect(wet); wet.connect(AC.destination);
    }
    if (AC.state === 'suspended') AC.resume();
    return AC;
  }
  function note(freq, dur, vol, delay) {          // soft pluck: fundamental + quiet octave
    var c = actx(); if (!c) return;
    var t = c.currentTime + (delay || 0), g = c.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    g.connect(bus);
    [[freq, 1], [freq * 2, 0.22]].forEach(function (p) {
      var o = c.createOscillator(), og = c.createGain();
      o.type = 'sine'; o.frequency.value = p[0]; og.gain.value = p[1];
      o.connect(og); og.connect(g); o.start(t); o.stop(t + dur + 0.03);
    });
  }
  function swoosh(dur, f1, f2, vol) {
    var c = actx(); if (!c) return;
    var len = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    var src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(), t = c.currentTime;
    src.buffer = buf; f.type = 'bandpass'; f.Q.value = 0.9;
    f.frequency.setValueAtTime(f1, t); f.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.4); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(bus); src.start(t);
  }
  var N = { C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880, C6: 1046.5, E6: 1318.5, G4: 392 };
  var sfx = {
    tick: function () { note(N.E6, 0.07, 0.05); },
    pop: function () { note(N.G5, 0.16, 0.08); note(N.C6, 0.2, 0.06, 0.07); },
    move: function () { swoosh(0.4, 500, 1900, 0.045); },
    done: function () { [N.C5, N.E5, N.G5, N.C6].forEach(function (f, i) { note(f, 0.34, 0.07, i * 0.09); }); },
    on: function () { note(N.A5, 0.12, 0.07); note(N.E6, 0.18, 0.06, 0.07); },
    theme: function (dark) {
      if (dark) { swoosh(0.5, 2200, 500, 0.05); note(N.C5, 0.24, 0.07); note(N.G4, 0.36, 0.07, 0.1); }
      else { swoosh(0.5, 500, 2200, 0.05); note(N.G5, 0.22, 0.07); note(N.C6, 0.36, 0.07, 0.1); }
    }
  };
  var SPK_ON = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
  var SPK_OFF = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 6M21 9l-5 6"/></svg>';
  function paintSfxBtns() {
    $$('.af-sfx-btn').forEach(function (b) {
      b.innerHTML = muted ? SPK_OFF : SPK_ON;
      b.setAttribute('aria-pressed', muted ? 'false' : 'true');
      b.setAttribute('aria-label', muted ? 'Turn sound on' : 'Turn sound off');
    });
  }
  function toggleSfx() {
    if (!muted) sfx.tick();
    muted = !muted;
    try { localStorage.setItem(SFX_KEY, muted ? '1' : '0'); } catch (e) {}
    paintSfxBtns(); if (!muted) sfx.on();
    try { window.dispatchEvent(new CustomEvent('af:sound', { detail: { on: !muted } })); } catch (e) {}   // Flare's voice follows this one switch
  }

  /* ---------- 1. numbered section labels ---------- */
  ['about', 'services', 'samples', 'process', 'pricing', 'why', 'contact'].forEach(function (id, i) {
    var lab = $('#' + id + ' .section-label');
    if (lab) lab.setAttribute('data-num', String(i + 1).padStart(2, '0') + ' —');
  });

  /* ---------- 2. nav: highlight on click ---------- */
  var navLinks = $$('#navbar .nav-links a');
  /* the clicked link stays highlighted until the visitor scrolls on their own */
  var lockTarget = null, fixes = 0;
  function release() {
    if (!window.__afNavLock) return;
    window.__afNavLock = false; lockTarget = null;
    window.dispatchEvent(new Event('scroll'));
  }
  window.afNavRelease = release;
  function onScrollEnd() {            // page layout can shift mid-scroll, so re-aim once or twice
    if (!lockTarget) return;
    if (Math.abs(lockTarget.getBoundingClientRect().top) > 10 && fixes < 2) {
      fixes++; lockTarget.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' });
    }
  }
  if ('onscrollend' in window) window.addEventListener('scrollend', onScrollEnd);
  ['wheel', 'touchmove'].forEach(function (ev) { window.addEventListener(ev, release, { passive: true }); });
  window.addEventListener('keydown', function (e) {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].indexOf(e.key) > -1) release();
  });
  navLinks.forEach(function (a) {
    a.addEventListener('click', function () {
      sfx.tick();
      if ((a.getAttribute('href') || '').charAt(0) !== '#') return;   // links to other pages: just navigate
      navLinks.forEach(function (x) { x.classList.toggle('active', x === a); });
      window.__afNavLock = true; fixes = 0;
      lockTarget = $(a.getAttribute('href'));
      if (!('onscrollend' in window)) setTimeout(onScrollEnd, 1300);
    });
  });
  var logo = $('#navbar .nav-logo');
  if (logo) logo.addEventListener('click', function () { navLinks.forEach(function (x) { x.classList.remove('active'); }); });

  /* ---------- 3. theme switch: circle reveal from the toggle ---------- */
  window.afThemeReveal = function (change0, origin) {
    var change = function () { change0(); sfx.theme(document.documentElement.getAttribute('data-theme') === 'dark'); };
    if (!document.startViewTransition || reduced()) { change(); return; }
    var r = origin.getBoundingClientRect();
    var x = r.left + r.width / 2, y = r.top + r.height / 2;
    var rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    var t = document.startViewTransition(change);
    t.ready.then(function () {
      document.documentElement.animate(
        { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + rad + 'px at ' + x + 'px ' + y + 'px)'] },
        { duration: 750, easing: 'cubic-bezier(.4, 0, .2, 1)', pseudoElement: '::view-transition-new(root)' }
      );
    }).catch(function () {});
  };

  /* ---------- 4. tour steps ----------
     Each step: n (label), t (cursor target: selector or function), text (string or function),
       fx / fy  where the cursor lands inside the target (0-1)      fixed  no scrolling needed
       align    (0-1) put the target at this height of the screen    s      scroll to this element instead
       when     include the step only if this returns true           pre    runs before the cursor moves
       act      runs once the cursor has arrived (a "click"); return false if nothing happened
       then     where the cursor goes after act (e.g. the opened lightbox / plan window)
       keep     re-applied every frame while on the step             pauseDash  hold the dashboard tabs still
     Anything a step opens is closed again automatically (see later()). */
  function pick(sel, i) { return $$(sel)[i] || null; }
  function press(n) { if (n && n.click) n.click(); }
  var cleanups = [];
  function later(fn) { cleanups.push(fn); }
  function runCleanups() { var had = cleanups.length > 0; while (cleanups.length) { try { cleanups.pop()(); } catch (e) {} } return had; }
  function resolve(t) { return typeof t === 'function' ? t() : (t ? $(t) : null); }
  function txt(s) { var v = typeof s.text === 'function' ? s.text() : s.text; return v || ''; }
  function unpauseDash() {
    var d = $('#dash'); if (!d) return;
    var r = d.getBoundingClientRect();
    if (r.bottom > 0 && r.top < innerHeight) d.classList.remove('is-paused');   // off-screen, the page pauses it itself
  }

  var dashTab = function (i) { return function () { return pick('#dash .dash-tab', i); }; };
  var sgTab = function (i) { return function () { return pick('#sgShowcase .sg-tab', i); }; };
  var sgNow = function (panel, part) { return '#sgPanel' + panel + ' .sg-slide.is-active ' + part; };

  function dashStep(i, n, text) {
    return { n: n, t: dashTab(i), align: .48, fx: .5, fy: .5, pauseDash: 1, wait: 1500, text: text,
      act: function () { press(dashTab(i)()); return false; } };
  }
  function tabStep(i, n, text) {
    return { n: n, t: sgTab(i), fx: .5, fy: .5, text: text, act: function () { press(sgTab(i)()); return false; } };
  }
  function adStep(panel, n, text) {           // taps the ad, the full-size viewer opens, cursor follows it
    var sel = sgNow(panel, '.ad-art img');
    return { n: n, t: sel, fx: .5, fy: .45, text: text, wait: 550, then: '#sgLightbox img', out: 1, fx2: .98, fy2: .1,
      act: function () {
        var im = $(sel); if (!im || !im.naturalWidth) return false;
        press(im);
        later(function () { var lb = $('#sgLightbox'); if (lb && lb.classList.contains('open')) lb.click(); });
        return true;
      } };
  }
  function planStep(i) {                      // taps the plan, its window opens with everything it includes
    var card = function () { return pick('.pricing-grid .price-card', i); };
    return { n: 'Plan', t: card, fx: .5, fy: .3, wait: 600, then: '.offer-modal-content', out: 1, fx2: .97, fy2: .08,
      text: function () {
        var c = card(); if (!c) return '';
        var q = function (s) { var e = c.querySelector(s); return e ? e.textContent.trim() : ''; };
        var li = c.querySelectorAll('.price-features li').length;
        return q('h3') + ', ' + q('.price-amount') + q('.price-period') + '. ' + q('.price-desc') + ' It includes ' + li + ' things, listed here.';
      },
      act: function () {
        var c = card(); if (!c) return false;
        press(c);
        later(function () { press($('#offerModalClose')); });
        return true;
      } };
  }
  function prKeep(i) {                        // shows the timeline up to step i (i = -1: nothing yet)
    return function () {
      window.__afHoldProcess = true;          // the page's own timeline autoplay stays off while the tour drives it
      var st = $$('#prTrack .pr-step'), tr = $('#prTrack'); if (!st.length || !tr) return;
      st.forEach(function (x, k) { x.classList.toggle('on', k <= i); x.classList.toggle('now', k === i && i < st.length - 1); });
      tr.style.setProperty('--p', st.length > 1 ? Math.max(0, i) / (st.length - 1) : 0);
    };
  }
  function prReset() {                        // leaving the timeline: hand it back blank, the page replays it by itself
    window.__afHoldProcess = false;
    var st = $$('#prTrack .pr-step'), tr = $('#prTrack');
    st.forEach(function (x) { x.classList.remove('on', 'now'); });
    if (tr) tr.style.setProperty('--p', 0);
  }
  function prStep(i, text) {                  // the step only appears when the cursor "taps" it
    var shown = false, keep = function () { prKeep(shown ? i : i - 1)(); };
    return { n: 'Process', proc: 1, t: function () { return pick('#prTrack .pr-step', i); }, fx: .5, fy: .25, text: text,
      reset: function () { shown = false; }, pre: keep, keep: keep,
      act: function () { shown = true; keep(); return false; } };
  }
  function rsStep(i, text) {
    return { n: 'Sample story', t: function () { return pick('#rsTabs button', i); }, fx: .5, fy: .5, text: text,
      act: function () { press(pick('#rsTabs button', i)); return false; } };
  }

  var steps = [
    { n: 'Welcome', t: '#hero .hero-title', fx: 1.04, fy: .3, text: 'Hi! Welcome to AdFlare. We run Meta ads that turn cold audiences into customers. 👋' },
    { n: 'Flare', t: '#navbar', fixed: 1, fx: .5, fy: .95, text: 'This bar is my home. Tap Ask Flare to type or talk to me anytime. The menu, theme and sound controls live here too.' },
    { n: 'Start', t: '#hero .hero-cta-group', fx: .5, fy: .5, text: 'Start here: book a free strategy call, or see what we do.' },
    { n: 'Report', t: '#dash .dash-window', s: '#dash', align: .3, fx: .5, fy: .2, pauseDash: 1, pre: function () { press(dashTab(0)()); },
      text: 'This is a live report window. It has three tabs, so let me click through them.' },
    dashStep(0, 'Growth', 'Growth tab: the trend line shows how a client’s numbers climb after launch.'),
    dashStep(1, 'Results', 'Results tab: return on ad spend, click-through rate, cost per lead and conversion lift.'),
    dashStep(2, 'Totals', 'Totals tab: campaigns run, ad spend managed and client satisfaction.'),
    { n: 'Numbers', t: '#hero .hero-stats', fx: .3, text: 'Our results at a glance: average growth, campaigns launched and client satisfaction.' },

    { n: 'About', t: '#about .section-title', fx: .7, text: 'We only do Meta advertising, and we handle it end to end: setup, testing and scaling, with clear reports.' },

    { n: 'Industries', t: '#services .industries-title', fx: .7, text: 'These are the industries we have already run campaigns for.' },

    { n: 'Samples', t: '#samples .section-title', fx: .7, text: 'Sample work in four categories. I will open each one for you.' },
    tabStep(0, 'Premium', 'Premium tab: our Premium ad designs.'),
    { n: 'Premium', t: function () { return pick('#sgPanel0 .sg-item', 2); }, align: .6, fx: .5, fy: .5,
      text: 'Tap any sample in this list to switch ads.', act: function () { press(pick('#sgPanel0 .sg-item', 2)); return false; } },
    adStep(0, 'Premium ad', 'Tap any ad to see it full size. Tap again to close.'),
    tabStep(1, 'Standard', 'Standard tab: clean, ready-to-run ads for tighter budgets.'),
    adStep(1, 'Standard ad', 'Same here: tap an ad to enlarge it.'),
    tabStep(2, 'Reels', 'Reels tab: short vertical videos made to stop the scroll.'),
    { n: 'Reels', t: sgNow(2, '.sg-poster'), fx: .5, fy: .4, text: 'Reels play on their own and move to the next one when they finish.' },
    tabStep(3, 'Websites', 'Websites tab: sites we have built for real clients.'),
    { n: 'Websites', t: sgNow(3, '.web-shot'), fx: .5, fy: .4, text: 'Tap a screenshot, or Visit Website, to open the live site.' },

    { n: 'Brand', t: '#presenceBanner .promo-title', fx: .5, fy: .3, text: 'We help your brand look strong online and perform strong too.' },

    { n: 'Process', proc: 1, pre: prKeep(-1), keep: prKeep(-1), t: '#process .section-title', s: '#prStage', fx: .7, text: 'From first call to a campaign that keeps improving. Four steps.' },
    prStep(0, 'Step 1, Onboarding: we learn your business, goals and who you want to reach.'),
    prStep(1, 'Step 2, One day shoot: one day to capture the photos and videos your ads need.'),
    prStep(2, 'Step 3, Deliverables: we edit the ads and captions, and you approve them before anything goes live.'),
    prStep(3, 'Step 4, Run ads and feedback report: your ads go live, and you get a clear report.'),

    { n: 'Sample story', t: '#results .section-title', fx: .7, text: 'A sample story: what $50 in ads can do. The tabs show where the results came from.' },
    rsStep(1, 'Audience: who the ads reached.'),
    rsStep(2, 'Age and gender: who responded.'),
    rsStep(3, 'Top countries: where the people are.'),

    { n: 'Pricing', t: '#pricing .section-title', fx: .7, text: 'Pick a package. I will open each plan to show what it includes.' },
    planStep(0), planStep(1), planStep(2),
    { n: 'Pricing', t: '#pricing .pricing-note', fx: .4, text: 'Ad budget is paid separately by the client.' },

    { n: 'Why us', t: '#why .section-title', fx: .7, text: 'One specialty, done well. Here is how we differ from a general agency.' },
    { n: 'Why us', t: '#why .why-list', fx: .5, fy: .2, text: 'Pure Meta focus means deeper knowledge and better results.' },

    { n: 'Contact', t: '#contact .section-title', fx: .7, text: 'Ready to start? Tell us about your business here.' },
    { n: 'Contact', t: '#inqForm', fx: .5, fy: .2, text: 'Share your name, email, goal and budget. We reply with next steps.' },
    { n: 'WhatsApp', t: '#waFabToggle', fixed: 1, text: 'Want to talk now? Message us on WhatsApp from here.' }
  ];

  /* ---------- 5. tour UI ---------- */
  var root = el('div', 'af-tour');
  var cur = el('div', 'af-cursor',
    '<svg viewBox="0 0 24 24"><path d="M4 2.5l15.5 8.2-6.6 2 -2.3 6.8z" fill="#fff" stroke="#111" stroke-width="1.5" stroke-linejoin="round"/></svg>');
  var bub = el('div', 'af-bubble', '<b>AdFlare</b><span></span>');
  var skip = el('button', 'af-skip', 'skip tour <kbd>esc</kbd>');
  skip.type = 'button';
  var sfxTour = el('button', 'af-skip af-skip-sfx af-sfx-btn'); sfxTour.type = 'button';
  var dock = el('div', 'af-dock'); dock.appendChild(skip); dock.appendChild(sfxTour);
  root.appendChild(cur); root.appendChild(bub); root.appendChild(dock);

  var live = [], idx = 0, running = false, raf = 0, timer = 0, arrived = false, token = 0, prevFocus = null, dir = 1, focusFn = null;

  function visible(n) {
    if (!n) return false;
    var r = n.getBoundingClientRect(), cs = getComputedStyle(n);
    return cs.display !== 'none' && cs.visibility !== 'hidden' && (r.width > 0 || r.height > 0);
  }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  /* scale.css zooms the page (html { zoom: .75 }) on desktop. Element rects are in screen pixels, but the cursor and
     bubble live inside the zoomed page, so their coordinates have to be divided by the zoom or they land short. */
  function zf() {
    var w = root.offsetWidth; if (!w) return 1;
    var z = root.getBoundingClientRect().width / w;
    return (z > .3 && z < 3) ? z : 1;
  }
  function moveCur(L) { var z = zf(); cur.style.transform = 'translate(' + (L.cx / z) + 'px,' + (L.cy / z) + 'px)'; }
  // cursor + bubble positions. On narrow screens the bubble sits below (or above) the target so it never covers it.
  function layout(s, n) {
    n = n || resolve(s.t); if (!n) return null;
    var z = zf(), r = n.getBoundingClientRect(), w = bub.offsetWidth * z, h = bub.offsetHeight * z, L = {};
    if (innerWidth < 640 && s.out && s.phase === 2) {          // an opened viewer: bubble goes above / below it, never over it
      L.cx = clamp(r.left + r.width * .5, 20, innerWidth - 20);
      if (innerHeight - r.bottom > h + 40) { L.cy = r.bottom - 16; L.by = r.bottom + 12; }
      else { L.cy = r.top + 16; L.by = Math.max(80, r.top - h - 12); }
      L.bx = clamp(L.cx - w / 2, 12, innerWidth - w - 12);
    } else if (innerWidth < 640) {
      var tall = r.height > 260;
      L.cx = clamp(r.left + r.width * .5, 20, innerWidth - 20);
      var below = tall || r.bottom + 28 + h < innerHeight - 64;
      if (tall) { L.cy = clamp(r.top + 60, 90, innerHeight - 160); L.by = L.cy + 22; }
      else if (below) { L.cy = clamp(r.bottom - 4, 12, innerHeight - 150); L.by = L.cy + 22; }
      else { L.cy = Math.max(12, r.top + 4); L.by = Math.max(80, r.top - h - 14); }
      L.bx = clamp(L.cx - w / 2, 12, innerWidth - w - 12);
    } else {
      var fx = s.phase === 2 && s.fx2 != null ? s.fx2 : s.fx, fy = s.phase === 2 && s.fy2 != null ? s.fy2 : s.fy;
      L.cx = clamp(r.left + r.width * (fx == null ? .5 : fx), 12, innerWidth - 12);
      L.cy = clamp(r.top + Math.min(r.height, 140) * (fy == null ? .6 : fy), 12, innerHeight - 70);
      var gap = 16, top0 = 92, bot0 = innerHeight - 72;
      var small = r.height <= 300 && r.width <= innerWidth * .6;
      if (small) {                       // small target (tab, button, label): park the bubble next to it, never on it
        var bx0 = clamp(L.cx - 30, 12, innerWidth - w - 12);
        if (r.bottom + gap + h <= bot0) { L.bx = bx0; L.by = r.bottom + gap; }
        else if (r.top - gap - h >= top0) { L.bx = bx0; L.by = r.top - gap - h; }
        else if (r.right + gap + w <= innerWidth - 12) { L.bx = r.right + gap; L.by = clamp(L.cy - h / 2, top0, bot0 - h); }
        else if (r.left - gap - w >= 12) { L.bx = r.left - gap - w; L.by = clamp(L.cy - h / 2, top0, bot0 - h); }
      }
      if (L.bx == null) {                // big target: beside the cursor, flipped away from the screen edges
        L.bx = L.cx + 18; L.by = L.cy + 16;
        if (L.bx + w > innerWidth - 12) L.bx = Math.max(12, L.cx - w - 6);
        if (L.by + h > bot0) L.by = Math.max(top0, L.cy - h - 14);
      }
    }
    return L;
  }
  function apply(L) {
    moveCur(L);
    var z = zf(); bub.style.left = (L.bx / z) + 'px'; bub.style.top = (L.by / z) + 'px';
  }
  function settle(done, my) {            // wait until smooth scrolling stops
    var last = -1, still = 0, t0 = performance.now();
    (function tick() {
      if (my !== token || !running) return;
      var y = window.scrollY;
      still = Math.abs(y - last) < 1 ? still + 1 : 0; last = y;
      if (still > 6 || performance.now() - t0 > 1500) done(); else requestAnimationFrame(tick);
    })();
  }

  function emit(state) {
    try { window.dispatchEvent(new CustomEvent('af:tour', { detail: { state: state, idx: idx, total: live.length, label: (live[idx] && live[idx].n) || '' } })); } catch (e) {}
  }

  function skipStep(my) {                // target missing right now: move on in the direction we were going
    if (my !== token || !running) return;
    if (dir < 0 && idx > 0) go(idx - 1);
    else if (idx < live.length - 1) go(idx + 1);
    else stop(true);
  }

  function go(i) {
    var before = live[idx];
    idx = i; var my = ++token, s = live[i];
    if (s.reset) { try { s.reset(); } catch (e) {} }
    if (before && before.proc && !s.proc) prReset();
    if (s.proc) window.__afHoldProcess = true;
    emit('step');
    clearTimeout(timer); arrived = false; focusFn = null;
    bub.classList.remove('on', 'glide'); cur.classList.remove('track', 'press');
    if (before && before.pauseDash && !s.pauseDash) unpauseDash();
    var closed = runCleanups();            // close whatever the last step opened (viewer, plan window, menu)
    setTimeout(function () {
      if (my !== token || !running) return;
      if (s.pre) { try { s.pre(); } catch (e) {} }
      var n = resolve(s.t);
      if (!n) { skipStep(my); return; }
      var sn = resolve(s.s) || n;
      if (!s.fixed) {
        var r = sn.getBoundingClientRect();
        var off = s.align != null ? innerHeight * s.align : (r.height > innerHeight * .6 ? 110 : innerHeight * (innerWidth < 640 ? .25 : .32));
        window.scrollTo({ top: Math.max(0, window.scrollY + r.top - off), behavior: reduced() ? 'auto' : 'smooth' });
      }
      settle(function () { arrive(s, my); }, my);
    }, closed ? 450 : 0);
  }

  function arrive(s, my) {
    var alive = function () { return my === token && running; };
    s.phase = 1;
    var n = resolve(s.t);
    if (!n) { skipStep(my); return; }
    $('span', bub).textContent = txt(s);       // set while the bubble is hidden, so Flare only speaks once it appears
    focusFn = function () { return resolve(s.t); };
    var L = layout(s, n); if (!L) { skipStep(my); return; }
    cur.classList.add('on');
    sfx.move();
    moveCur(L);

    function finish() {
      if (!alive()) return;
      $('span', bub).textContent = txt(s);
      var Lf = layout(s, focusFn()) || L; apply(Lf);
      bub.classList.add('on'); sfx.pop();
      setTimeout(function () { if (alive()) bub.classList.add('glide'); }, 320);   // after the pop-in, follow the target smoothly
      cur.classList.add('track'); arrived = true;
      var hold = 2300 + txt(s).length * 30, t0 = performance.now();
      (function wait() {                      // let Flare finish speaking before moving on
        if (!alive()) return;
        var talking = window.afFlare && window.afFlare.speaking && window.afFlare.speaking();
        var el0 = performance.now() - t0;
        if ((el0 < hold || talking) && el0 < 25000) timer = setTimeout(wait, 250); else timer = setTimeout(next, 0);
      })();
    }

    setTimeout(function () {
      if (!alive()) return;
      var L2 = layout(s, resolve(s.t)) || L; apply(L2);        // cursor has landed: "click"
      if (!s.act) { finish(); return; }
      cur.classList.add('press'); sfx.tick();
      setTimeout(function () { cur.classList.remove('press'); }, 200);
      var did = false;
      try { did = s.act(); } catch (e) {}
      setTimeout(function () {
        if (!alive()) return;
        var n2 = did !== false && s.then ? resolve(s.then) : null;
        if (!n2) { finish(); return; }
        focusFn = function () { return resolve(s.then); };       // the cursor travels on to what just opened
        s.phase = 2;
        var L3 = layout(s, n2);
        if (L3) { sfx.move(); moveCur(L3); }
        setTimeout(finish, reduced() ? 0 : 950);
      }, reduced() ? 0 : (s.wait || 450));
    }, reduced() ? 0 : 950);
  }

  function follow() {                    // keep cursor glued to its target after arriving
    if (!running) return;
    var s = live[idx];
    if (s && s.pauseDash) { var d = $('#dash'); if (d && !d.classList.contains('is-paused')) d.classList.add('is-paused'); }
    if (s && s.keep) { try { s.keep(); } catch (e) {} }
    if (arrived && focusFn && s) { var n = focusFn(), L = n && layout(s, n); if (L) apply(L); }
    raf = requestAnimationFrame(follow);
  }

  function start() {
    if (!IS_HOME) return;
    closePal(); release();
    $$('#sgShowcase img[loading="lazy"]').forEach(function (i) { i.loading = 'eager'; });   // so every sample can open full size
    live = steps.filter(function (s) {
      try { return s.when ? s.when() : visible(resolve(s.t)); } catch (e) { return false; }
    });
    if (!live.length) return;
    running = true; prevFocus = document.activeElement; dir = 1;
    chip.classList.remove('is-on');
    root.classList.add('is-on');
    cancelAnimationFrame(raf); raf = requestAnimationFrame(follow);
    emit('start');
    go(0);
  }
  function stop(finished) {
    if (!running) return;
    running = false; token++; clearTimeout(timer); cancelAnimationFrame(raf);
    runCleanups(); unpauseDash(); prReset();
    root.classList.remove('is-on'); cur.classList.remove('on', 'track', 'press'); bub.classList.remove('on', 'glide');
    emit('stop');
    store.set(); if (finished) sfx.done(); else sfx.tick();
    $('.af-chip-go', chip).textContent = 'take the tour again';
    chip.classList.add('is-on');
    if (prevFocus && prevFocus.focus) prevFocus.focus({ preventScroll: true });
    if (finished) window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
  }
  window.afStartTour = function () { start(); };
  function next() { if (!running) return; dir = 1; if (idx < live.length - 1) go(idx + 1); else stop(true); }
  function back() { if (running && idx > 0) { dir = -1; go(idx - 1); } }
  window.afTour = { next: next, back: back, stop: function () { stop(false); } };
  window.afPaintSfx = paintSfxBtns;

  bub.addEventListener('click', next);
  skip.addEventListener('click', function () { stop(false); });
  sfxTour.addEventListener('click', toggleSfx);

  /* ---------- 6. "take the tour" chip ---------- */
  var chip = el('div', 'af-chip',
    '<button type="button" class="af-chip-go">take the tour</button>' +
    '<button type="button" class="af-chip-x" aria-label="Dismiss">×</button>');
  $('.af-chip-go', chip).addEventListener('click', function () { sfx.tick(); start(); });
  $('.af-chip-x', chip).addEventListener('click', function () { chip.classList.remove('is-on'); });

  /* ---------- 7. command palette (Alt+K) ---------- */
  var pal = el('div', 'af-pal');
  pal.setAttribute('role', 'dialog'); pal.setAttribute('aria-modal', 'true'); pal.setAttribute('aria-label', 'Search the site');
  pal.innerHTML = '<div class="af-pal-box"><input type="text" placeholder="Where do you want to go?" aria-label="Search" autocomplete="off"><ul></ul><div class="af-pal-foot">↑ ↓ to move, Enter to open, Esc to close</div></div>';
  var palIn = $('input', pal), palList = $('ul', pal), items = [], sel = 0;
  var actions = [
    { n: 'Take the site tour', h: 'Alt+T', run: start },
    { n: 'About', h: 'section', go: '#about' }, { n: 'Industries we serve', h: 'section', go: '#services' },
    { n: 'Sample work', h: 'section', go: '#samples' }, { n: 'Process timeline', h: 'section', go: '#process' },
    { n: 'Pricing', h: 'section', go: '#pricing' }, { n: 'Why AdFlare', h: 'section', go: '#why' },
    { n: 'Contact', h: 'section', go: '#contact' },
    { n: 'Ask Flare (AI chat)', h: 'chat', run: function () { if (window.flareOpen) window.flareOpen(); } },
    { n: 'Give us Facebook Page access', h: 'how-to', page: 'access.html' },
    { n: 'Message us on WhatsApp', h: 'link', href: 'https://wa.me/9607862274' },
    { n: 'Switch theme', h: 'toggle', run: function () { var b = $('#themeBtn'); if (b) b.click(); } }
  ];
  if (!IS_HOME) actions = actions.filter(function (a) { return a.n !== 'Take the site tour'; });
  function drawPal() {
    var q = palIn.value.trim().toLowerCase();
    items = actions.filter(function (a) { return a.n.toLowerCase().indexOf(q) > -1; });
    sel = 0; paintPal();
  }
  function paintPal() {
    palList.innerHTML = items.length ? items.map(function (a, i) {
      return '<li data-i="' + i + '" class="' + (i === sel ? 'on' : '') + '"><span>' + a.n + '</span><small>' + a.h + '</small></li>';
    }).join('') : '<li class="af-empty">Nothing matches. Try "pricing" or "contact".</li>';
  }
  function openPal() { if (running) return; pal.classList.add('is-on'); palIn.value = ''; drawPal(); palIn.focus(); }
  function closePal() { pal.classList.remove('is-on'); }
  function runItem(a) {
    closePal(); sfx.tick();
    if (!a) return;
    if (a.run) a.run();
    else if (a.page) window.location.href = a.page;
    else if (a.go && !IS_HOME) window.location.href = './' + a.go;
    else if (a.go) { release(); var t = $(a.go); if (t) t.scrollIntoView({ behavior: 'smooth' }); }
    else if (a.href) window.open(a.href, '_blank', 'noopener');
  }
  palIn.addEventListener('input', drawPal);
  palList.addEventListener('click', function (e) { var li = e.target.closest('li[data-i]'); if (li) runItem(items[+li.dataset.i]); });
  pal.addEventListener('mousedown', function (e) { if (e.target === pal) closePal(); });
  palIn.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, items.length - 1); paintPal(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); paintPal(); }
    else if (e.key === 'Enter') { e.preventDefault(); runItem(items[sel]); }
  });

  /* ---------- 8. nav sound button ---------- */
  var nav = $('#navbar');
  if (nav) {
    var sb = el('button', 'af-sfx-btn');
    sb.type = 'button'; sb.id = 'afSfx';
    sb.addEventListener('click', toggleSfx);
    nav.insertBefore(sb, $('#themeWrap', nav) || null);
  }

  /* ---------- 9. keyboard ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.altKey && !e.ctrlKey && !e.metaKey) {
      var k = e.key.toLowerCase();
      if (k === 'k' || e.code === 'KeyK') { e.preventDefault(); openPal(); return; }
      if (k === 't' || e.code === 'KeyT') { e.preventDefault(); start(); return; }
    }
    if (e.key === 'Escape') { if (pal.classList.contains('is-on')) closePal(); else if (running) stop(false); return; }
    if (running) {
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); back(); }
    }
  });

  /* ---------- 10. mount ---------- */
  function mount() {
    document.body.appendChild(root); document.body.appendChild(chip); document.body.appendChild(pal);
    paintSfxBtns();
    if (store.get()) $('.af-chip-go', chip).textContent = 'take the tour again';
    if (IS_HOME) setTimeout(function () { if (!running) chip.classList.add('is-on'); }, 1200);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
