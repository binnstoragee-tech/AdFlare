/* AdFlare: saves every contact-form inquiry to Supabase (table: adflare_inquiries).
   It only listens; the form just shows its success notification.
   Needs supabase-config.js loaded first. Delete this file + its <script> tag to turn it off. */
(function () {
  'use strict';
  var C = window.SUPABASE_CONFIG;
  if (!C || !C.url || !C.anonKey) return;
  document.addEventListener('submit', function (e) {          // capture phase: runs before the form is reset
    var f = e.target;
    if (!f || f.id !== 'inqForm') return;
    var g = function (n) { var x = f.elements[n]; return x ? String(x.value || '').trim() : ''; };
    if (!g('name') || !g('email') || !g('goal') || !g('details')) return;   // same required fields as the form
    var body = {
      name: g('name').slice(0, 120),
      email: g('email').slice(0, 200),
      company: g('company').slice(0, 200) || null,
      project: g('goal').slice(0, 200),
      budget: g('budget').slice(0, 60) || null,
      timeline: g('timeline').slice(0, 120) || null,
      details: g('details').slice(0, 4000)
    };
    try {
      fetch(C.url + '/rest/v1/adflare_inquiries', {
        method: 'POST', keepalive: true,
        headers: { 'Content-Type': 'application/json', apikey: C.anonKey, Prefer: 'return=minimal' },
        body: JSON.stringify(body)
      }).catch(function () {});
    } catch (err) {}
  }, true);
})();
