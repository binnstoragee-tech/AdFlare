/* AdFlare cookie consent: Necessary / Preferences / Statistics / Marketing
   Buttons: Allow all, Allow selection, Deny.  Light: no libraries, no blur, animates only transform + opacity.
   Choice is remembered in localStorage ("af_consent" = JSON).
   Load tracking ONLY after consent by adding to a <script>:
       type="text/plain" data-consent="statistics"   (e.g. Google Analytics)
       type="text/plain" data-consent="marketing"    (e.g. Meta Pixel)
       type="text/plain" data-consent="preferences"
   JS:  AFConsent.get() -> {necessary,preferences,statistics,marketing} | null
        AFConsent.has('marketing') -> true/false      AFConsent.open() -> show the banner again
        window event "af-consent" fires on every choice */
(function () {
  'use strict';
  var KEY = 'af_consent', CATS = ['preferences', 'statistics', 'marketing'];

  function read() {
    var raw = null;
    try { raw = localStorage.getItem(KEY); } catch (e) { return null; }
    if (!raw) return null;
    if (raw === 'allow') return { necessary: true, preferences: true, statistics: true, marketing: true };   // old format
    if (raw === 'deny') return { necessary: true, preferences: false, statistics: false, marketing: false };
    try { var o = JSON.parse(raw); o.necessary = true; return o; } catch (e) { return null; }
  }
  function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }

  var done = {};
  function activate(c) {
    var list = document.querySelectorAll('script[type="text/plain"][data-consent]');
    Array.prototype.forEach.call(list, function (old) {
      var cat = old.getAttribute('data-consent'); if (cat === 'analytics') cat = 'statistics';
      if (!c[cat]) return;
      var s = document.createElement('script');
      Array.prototype.forEach.call(old.attributes, function (a) {
        if (a.name !== 'type' && a.name !== 'data-consent') s.setAttribute(a.name, a.value);
      });
      s.text = old.text;
      old.parentNode.replaceChild(s, old);
    });
  }
  function announce(c) { try { window.dispatchEvent(new CustomEvent('af-consent', { detail: c })); } catch (e) {} }

  window.AFConsent = {
    get: read,
    has: function (k) { var c = read(); return !!(c && c[k]); },
    open: function () { show(); }
  };

  var css =
    '#afCk{position:fixed;left:0;right:0;bottom:0;z-index:2147483000;background:#111;color:#fff;' +
    'border-top:1px solid rgba(255,255,255,.12);box-shadow:0 -10px 40px rgba(0,0,0,.35);' +
    'font:500 13.5px/1.55 Inter,system-ui,sans-serif;max-height:88vh;overflow-y:auto;' +
    'transform:translateY(100%);opacity:0;pointer-events:none;will-change:transform,opacity;' +
    'transition:transform .4s cubic-bezier(.2,.8,.2,1),opacity .25s ease}' +
    '#afCk.on{transform:none;opacity:1;pointer-events:auto}' +
    '#afCk .w{display:flex;gap:28px;align-items:center;justify-content:space-between;max-width:1180px;margin:0 auto;padding:20px 24px}' +
    '#afCk .t{flex:1;min-width:0}' +
    '#afCk h3{margin:0 0 4px;font:700 15px Sora,Inter,sans-serif}' +
    '#afCk p{margin:0;color:rgba(255,255,255,.72)}' +
    '#afCk .tg{display:flex;flex-wrap:wrap;align-items:center;gap:10px 26px;margin-top:14px}' +
    '#afCk label{display:inline-flex;align-items:center;gap:10px;font-weight:600;cursor:pointer;user-select:none}' +
    '#afCk label input{position:absolute;opacity:0;width:0;height:0}' +
    '#afCk label i{position:relative;width:42px;height:24px;border-radius:99px;background:rgba(255,255,255,.22);transition:background .2s ease;flex:none}' +
    '#afCk label i::after{content:"";position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .2s ease}' +
    '#afCk label input:checked+i{background:#ff2b2b}' +
    '#afCk label input:checked+i::after{transform:translateX(18px)}' +
    '#afCk label input:disabled+i{opacity:.6}' +
    '#afCk label input:focus-visible+i{outline:2px solid #fff;outline-offset:2px}' +
    '#afCk .sd{background:none;border:0;color:#fff;font:600 13.5px Inter,sans-serif;cursor:pointer;padding:0;display:inline-flex;align-items:center;gap:6px}' +
    '#afCk .sd svg{width:14px;height:14px;transition:transform .25s ease}' +
    '#afCk.open .sd svg{transform:rotate(90deg)}' +
    '#afCk .dt{display:none;margin-top:12px;font-size:12.5px;color:rgba(255,255,255,.65)}' +
    '#afCk.open .dt{display:block}' +
    '#afCk .dt b{color:#fff}' +
    '#afCk .dt div+div{margin-top:4px}' +
    '#afCk .bt{display:flex;flex-direction:column;gap:10px;width:210px;flex:none}' +
    '#afCk .bt button{height:42px;border-radius:10px;border:1.5px solid rgba(255,255,255,.3);background:transparent;color:#fff;' +
    'font:700 13.5px Inter,sans-serif;cursor:pointer;-webkit-tap-highlight-color:transparent;display:flex;align-items:center;justify-content:center;text-align:center;white-space:nowrap}' +
    '#afCk .bt button.y{background:#ff2b2b;border-color:#ff2b2b}' +
    '#afCk .bt button:active{transform:scale(.98)}' +
    ':root[data-theme="light"] #afCk{background:#fff;color:#111;border-top-color:rgba(0,0,0,.1);box-shadow:0 -10px 40px rgba(0,0,0,.14)}' +
    ':root[data-theme="light"] #afCk p,:root[data-theme="light"] #afCk .dt{color:#555}' +
    ':root[data-theme="light"] #afCk .dt b,:root[data-theme="light"] #afCk .sd{color:#111}' +
    ':root[data-theme="light"] #afCk label i{background:rgba(0,0,0,.2)}' +
    ':root[data-theme="light"] #afCk label input:checked+i{background:#ff2b2b}' +
    ':root[data-theme="light"] #afCk .bt button{color:#111;border-color:rgba(0,0,0,.25)}' +
    ':root[data-theme="light"] #afCk .bt button.y{color:#fff;border-color:#ff2b2b}' +
    '@media (max-width:760px){#afCk .w{flex-direction:column;align-items:stretch;gap:16px;padding:16px 16px calc(16px + env(safe-area-inset-bottom))}' +
    '#afCk .bt{width:auto;flex-direction:row;gap:8px}#afCk .bt button{flex:1 1 0;min-width:0;padding:0 4px;font-size:12px}#afCk .bt button[data-a=sel]{flex:1.45 1 0}#afCk .tg{gap:10px 18px}}' +
    '@media (prefers-reduced-motion:reduce){#afCk,#afCk label i,#afCk label i::after{transition:none}}';

  var box;
  function build() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    box = document.createElement('div');
    box.id = 'afCk'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Cookie consent');
    box.innerHTML =
      '<div class="w"><div class="t">' +
        '<h3>This website uses cookies</h3>' +
        '<p>We use cookies to remember your settings, to measure how the site is used, and to show more relevant ads. Choose what you allow. You can change it anytime.</p>' +
        '<div class="tg">' +
          '<label><input type="checkbox" checked disabled><i></i>Necessary</label>' +
          '<label><input type="checkbox" data-c="preferences"><i></i>Preferences</label>' +
          '<label><input type="checkbox" data-c="statistics"><i></i>Statistics</label>' +
          '<label><input type="checkbox" data-c="marketing"><i></i>Marketing</label>' +
          '<button type="button" class="sd" aria-expanded="false">Show details <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg></button>' +
        '</div>' +
        '<div class="dt">' +
          '<div><b>Necessary:</b> needed for the site to work (login, security). Always on.</div>' +
          '<div><b>Preferences:</b> remembers your choices, like light or dark mode.</div>' +
          '<div><b>Statistics:</b> anonymous counts of visits and pages, so we can improve the site.</div>' +
          '<div><b>Marketing:</b> Meta Pixel and similar tools that measure ads and show you relevant ads.</div>' +
        '</div>' +
      '</div>' +
      '<div class="bt"><button type="button" class="y" data-a="all">Allow all</button>' +
      '<button type="button" data-a="sel">Allow selection</button>' +
      '<button type="button" data-a="deny">Deny</button></div></div>';
    box.addEventListener('click', function (e) {
      var sd = e.target.closest('.sd');
      if (sd) { var o = box.classList.toggle('open'); sd.setAttribute('aria-expanded', o ? 'true' : 'false'); return; }
      var b = e.target.closest('button[data-a]'); if (!b) return;
      var a = b.getAttribute('data-a'), c = { necessary: true };
      CATS.forEach(function (k) {
        c[k] = a === 'all' ? true : a === 'deny' ? false : !!box.querySelector('input[data-c="' + k + '"]').checked;
      });
      save(c); box.classList.remove('on'); activate(c); announce(c);
    });
    document.body.appendChild(box);
  }
  function show() {
    if (!box) build();
    var c = read() || {};
    CATS.forEach(function (k) { box.querySelector('input[data-c="' + k + '"]').checked = !!c[k]; });
    requestAnimationFrame(function () { requestAnimationFrame(function () { box.classList.add('on'); }); });
  }

  function init() {
    var c = read();
    if (c) { activate(c); return; }
    // wait until the page is idle so it never competes with loading / animations
    var go = function () { setTimeout(show, 900); };
    if (document.readyState === 'complete') go(); else window.addEventListener('load', go);
  }
  if (document.body) init(); else document.addEventListener('DOMContentLoaded', init);
})();
