/* Flare — AdFlare AI assistant. Lives in the nav bar: tap "Ask Flare" and the bar turns into an AI bar
   (waveform, type or talk with the mic). Speaks only when asked, and hosts the guided tour from the bar.
   Needs flare.css. Load AFTER tour.js. */
(function () {
  'use strict';
  var IS_HOME = !!document.getElementById('hero');
  var VKEY = 'af_flare_voice', HKEY = 'af_flare_hint';
  var LINKS = {
    fb: 'https://www.facebook.com/profile.php?id=61572123664215',
    ig: 'https://www.instagram.com/ad_flaree/',
    wa: 'https://wa.me/9607862274',
    mail: 'mailto:adflare@gmail.com'
  };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  function el(tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }
  var reduced = function () { return window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; };

  /* ---------- her face: red-haired line-art, every part is a separate group so CSS can swap expressions ---------- */
  var HAIR_DEFS = '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs><linearGradient id="flHairG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6a5c"/><stop offset=".55" stop-color="#ff2b2b"/><stop offset="1" stop-color="#b30f1e"/></linearGradient></defs></svg>';
  var INK = 'fill="none" stroke="#14080a" stroke-linecap="round" stroke-linejoin="round"';
  var POSE_R = 
    '<path fill="url(#flHairG)" d="M50 2C72 2 90 22 96 50C100 70 94 90 78 95C64 98 50 90 40 84L34 87L35 79C24 76 12 70 6 60C0 46 4 30 14 18C24 6 38 2 50 2Z"/>' +
    '<path fill="#fff" d="M64 30C70 34 76 38 79 41C84 52 83 64 76 72C70 78 58 81 45 81L41 80C34 78 28 76 24 73L25 54C34 54 44 53 52 50C60 47 65 40 64 30Z"/>' +
    '<g class="blush"><ellipse cx="36" cy="66" rx="5" ry="3" fill="#ff6b6b" opacity=".4"/><ellipse cx="73" cy="66" rx="4" ry="2.6" fill="#ff6b6b" opacity=".4"/></g>' +
    '<path d="M24 53.5C17 52 14 57 15 63C16 68 19 70 23 71" ' + INK + ' stroke-width="4.4"/>' +
    '<g class="eyes">' +
      '<path class="fx eL" d="M46 59C48 54 51 51 54 53C56 55 57 58 58 61" ' + INK + ' stroke-width="4.4"/>' +
      '<path class="fx eR" d="M71 52L69 62" ' + INK + ' stroke-width="4.4"/>' +
      '<path class="fx hL" d="M46 59Q51.5 51.5 57 59" ' + INK + ' stroke-width="4.2"/>' +
      '<path class="fx hR" d="M64 59Q69.5 51.5 75 59" ' + INK + ' stroke-width="4.2"/>' +
    '</g>' +
    '<path d="M79 41C85 54 80 70 66 77C60 80 52 81 45 81M52 82L52 90" ' + INK + ' stroke-width="4.4"/>' +
    '<path class="fx m-n" d="M57 70Q62 72.5 67 70" ' + INK + ' stroke-width="3.4"/>' +
    '<path class="fx m-smile" d="M55 68.5Q62 75 69 68.5" ' + INK + ' stroke-width="3.4"/>' +
    '<g class="fx m-big"><path d="M54.5 67.5Q62 69 69.5 67.5Q68.5 76 62 76Q55.5 76 54.5 67.5Z" fill="#7a0f1b"/><ellipse cx="62" cy="73.6" rx="3.6" ry="1.8" fill="#ff7a8a"/></g>' +
    '<ellipse class="fx m-o" cx="62" cy="71.5" rx="3" ry="3.6" fill="#7a0f1b"/>' +
    '<path class="fx m-flat" d="M58 71.5L67 70" ' + INK + ' stroke-width="3.4"/>' +
    '<path class="fx m-sad" d="M56.5 73.5Q62 68.5 67.5 73.5" ' + INK + ' stroke-width="3.4"/>' +
    '<g class="fx m-talk"><g class="mt-in"><path d="M55.5 68Q62 69.2 68.5 68Q67.5 75.5 62 75.5Q56.5 75.5 55.5 68Z" fill="#7a0f1b"/><ellipse cx="62" cy="73.3" rx="3.2" ry="1.6" fill="#ff7a8a"/></g></g>' +
    '';
  var POSE_F =
    '<path fill="url(#flHairG)" d="M50 3C76 3 95 22 95 50C95 72 88 88 74 94L68 85C60 89 40 89 32 85L26 94C12 88 5 72 5 50C5 22 24 3 50 3Z"/>' +
    '<path fill="#fff" d="M24 54C32 46 42 40 50 33C58 40 68 46 76 54C77 68 72 79 62 83C56 86 44 86 38 83C28 79 23 68 24 54Z"/>' +
    '<g class="blush"><ellipse cx="33" cy="68" rx="4.5" ry="2.8" fill="#ff6b6b" opacity=".4"/><ellipse cx="67" cy="68" rx="4.5" ry="2.8" fill="#ff6b6b" opacity=".4"/></g>' +
    '<path d="M24 55C18 54 15 59 16 64C17 69 20 71 24 71M76 55C82 54 85 59 84 64C83 69 80 71 76 71" ' + INK + ' stroke-width="4.4"/>' +
    '<g class="eyes">' +
      '<path class="fx eL" d="M41 54.5L40 63.5" ' + INK + ' stroke-width="4.4"/>' +
      '<path class="fx eR" d="M59 54.5L60 63.5" ' + INK + ' stroke-width="4.4"/>' +
      '<path class="fx hL" d="M34.5 62Q40.5 54 46.5 62" ' + INK + ' stroke-width="4.2"/>' +
      '<path class="fx hR" d="M53.5 62Q59.5 54 65.5 62" ' + INK + ' stroke-width="4.2"/>' +
    '</g>' +
    '<path d="M27 70C29 80 38 87 50 87C62 87 71 80 73 70M50 88L50 93" ' + INK + ' stroke-width="4.4"/>' +
    '<path class="fx m-n" d="M45 72Q50 74.5 55 72" ' + INK + ' stroke-width="3.4"/>' +
    '<path class="fx m-smile" d="M43.5 70.5Q50 77 56.5 70.5" ' + INK + ' stroke-width="3.4"/>' +
    '<g class="fx m-big"><path d="M43 69.5Q50 71 57 69.5Q56 78 50 78Q44 78 43 69.5Z" fill="#7a0f1b"/><ellipse cx="50" cy="75.6" rx="3.6" ry="1.8" fill="#ff7a8a"/></g>' +
    '<ellipse class="fx m-o" cx="50" cy="73.5" rx="3" ry="3.6" fill="#7a0f1b"/>' +
    '<path class="fx m-flat" d="M45.5 73L54.5 73" ' + INK + ' stroke-width="3.4"/>' +
    '<path class="fx m-sad" d="M44.5 75.5Q50 70.5 55.5 75.5" ' + INK + ' stroke-width="3.4"/>' +
    '<g class="fx m-talk"><g class="mt-in"><path d="M43.5 70Q50 71.2 56.5 70Q55.5 77.5 50 77.5Q44.5 77.5 43.5 70Z" fill="#7a0f1b"/><ellipse cx="50" cy="75.3" rx="3.2" ry="1.6" fill="#ff7a8a"/></g></g>';
  // three poses of the same girl: looking right (drawn), front, and left (the right pose mirrored) so she can glance around
  var FACE = '<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false"><g class="fl-idle"><g class="fl-head"><g transform="translate(50 50) scale(.82) translate(-50 -50)">' +
    '<g class="pose pose-r">' + POSE_R + '</g><g class="pose pose-f">' + POSE_F + '</g><g class="pose pose-l" transform="translate(100 0) scale(-1 1)">' + POSE_R + '</g>' +
    '</g></g></g></svg>';

  /* ---------- expressions: picked from what she is saying ---------- */
  var EXR = [
    [/sorry|can't|cannot|unable|don't have|not sure|unfortunately|hmm|blocked|didn't catch/i, 'sorry'],
    [/\?\s*$/, 'curious'],
    [/i'm flare|i am flare|virtual assistant|ai assistant/i, 'wink'],
    [/wow|amazing|awesome|great|love|welcome|congrat|most popular|happy to help|sit back|fast|quickly|scale|sure!/i, 'excited'],
    [/thank|you're welcome|bye|see you|\bhi\b|hello|!/i, 'happy'],
    [/step|first|then|here's how|how we work|process|settings|click|choose|search|confirm|budget|report|data|packages/i, 'think']
  ];
  function exprFromText(t) { t = t || ''; for (var i = 0; i < EXR.length; i++) if (EXR[i][0].test(t)) return EXR[i][1]; return 'neutral'; }
  function exTrack(text) {
    var parts = text.match(/[^.!?]+[.!?]*\s*/g) || [text], out = [], n = 0;
    parts.forEach(function (p) { n += p.length; out.push([n, exprFromText(p)]); });
    return out;
  }
  var I_VOL = '<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
  var I_MUTE = '<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 6M21 9l-5 6"/></svg>';
  var I_X = '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  var I_SEND = '<svg viewBox="0 0 24 24"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></svg>';

  /* ---------- what she knows (all taken from this site) ---------- */
  var TIPS = { pricing: '#pricing', samples: '#samples', contact: '#contact', process: '#process', why: '#why', services: '#services', about: '#about' };
  var A = {
    price: { l: 'See pricing', go: '#pricing', main: 1 }, wa: { l: 'Message on WhatsApp', href: LINKS.wa, main: 1 },
    contact: { l: 'Contact form', go: '#contact' }, access: { l: 'Open the guide', go: 'access.html', main: 1 },
    tour: { l: 'Take the tour', run: 'tour', main: 1 }, samples: { l: 'See samples', go: '#samples', main: 1 },
    process: { l: 'See the process', go: '#process' }, mail: { l: 'Email us', href: LINKS.mail },
    fb: { l: 'Facebook', href: LINKS.fb, main: 1 }, ig: { l: 'Instagram', href: LINKS.ig, main: 1 }
  };
  function Q(t) { return { l: t, ask: t }; }

  var INTENTS = [
    { id: 'greet', w: 1, k: [/\b(hi|hello|hey|hiya|yo|hola|kumusta|kamusta)\b/, /\bgood (morning|afternoon|evening)\b/],
      a: "Hi there! I'm Flare, AdFlare's assistant. I can tell you about our packages, how we work, or how to give us access to your Page. What would you like to know?",
      acts: [Q('What are your packages?'), Q('How does it work?'), Q('How do I give access?')] },
    { id: 'bot', w: 3, k: [/\bare you (a |an )?(bot|ai|robot|real|human|person)\b/, /\bwho are you\b/, /\byour name\b/, /\bflare\b/],
      a: "I'm Flare, AdFlare's virtual assistant. I answer from the information on this site, and for anything custom I'll point you to the real team.",
      acts: [A.wa, Q('What do you offer?')] },
    { id: 'about', w: 2, k: [/\bwhat is adflare\b/, /\bwho is adflare\b/, /\babout (adflare|you|us|the agency)\b/, /\btell me about\b/, /\bwho are (you|they|adflare)\b/, /\bwhat (do|does) (you|adflare|you guys) do\b/, /\bsino kayo\b/, /\bano ang adflare\b/],
      a: "AdFlare is a dedicated Meta Ads agency focused only on Facebook and Instagram advertising. We handle full campaign management: setup, testing and scaling, with transparent reporting so you can see exactly what's working.",
      acts: [Q('What are your packages?'), A.samples] },
    { id: 'services', w: 1, k: [/\bservices?\b/, /\boffer(s|ing)?\b/, /\bprovide\b/, /\bserbisyo\b/, /\bcampaigns?\b/, /\bmanage(ment)?\b/, /\bwhat can you do\b/, /\bhelp (me|my)\b/],
      a: "We run Facebook and Instagram campaigns end to end: setup, testing and scaling, plus the content behind them like posts, reels, stories and captions, ads management and reporting. Packages start at $99 a month.",
      say: "We run Facebook and Instagram campaigns end to end: setup, testing and scaling, plus the content behind them, like posts, reels, stories and captions. Packages start at 99 dollars a month.",
      acts: [A.price, A.process] },
    { id: 'pricing', w: 2, k: [/\b(price|prices|pricing|cost|costs|rates?|fees?|packages?|plans?)\b/, /\bhow much\b/, /\b(magkano|presyo|bayad)\b/, /\b(cheap|affordable)\b/],
      a: "We have three monthly packages:\n• Starter, $99/month: 10 posts, 3 reels, basic design and captions\n• Basic, $249/month (most popular): 12 posts, 10 reels, stories, and Facebook and Instagram ads management\n• Growth, $399/month: full social media management, 20 posts, 15 reels, ads optimization and scaling, and a monthly performance report\nAd budget is paid separately.",
      say: "We have three monthly packages. Starter is 99 dollars, Basic is 249 dollars, and Growth is 399 dollars. Ad budget is paid separately. Tap a plan on the pricing section to see everything it includes.",
      acts: [A.price, Q('Tell me about Starter'), Q('Tell me about Growth'), Q('Any add-ons?')] },
    { id: 'starter', w: 3, k: [/\bstarter\b/, /\$?\b99\b/],
      a: "Starter is $99/month, for brands just getting started on social: 10 high-quality posts, 3 reels, basic graphic design, caption writing, and page posting and scheduling.",
      say: "Starter is 99 dollars a month, for brands just getting started: 10 high quality posts, 3 reels, basic graphic design, caption writing, and page posting and scheduling.",
      acts: [A.price, Q('Tell me about Basic')] },
    { id: 'basic', w: 3, k: [/\bbasic\b/, /\b249\b/, /\bmost popular\b/],
      a: "Basic is $249/month and our most popular plan, for growing brands ready to run real ad campaigns: 12 professional posts, 10 reels or short videos, stories, custom graphics, caption and content strategy, onsite shooting if needed, Facebook and Instagram ads management, audience targeting and basic boosting support.",
      say: "Basic is 249 dollars a month, and our most popular plan. You get 12 professional posts, 10 reels, stories, custom graphics, and Facebook and Instagram ads management with audience targeting.",
      acts: [A.price, Q('Tell me about Growth')] },
    { id: 'growth', w: 3, k: [/\bgrowth\b/, /\bgrowth (plan|package)\b/, /\b399\b/, /\btell me about growth\b/, /\bfull (social media )?management\b/],
      a: "Growth is $399/month, our full-scale management plan: 20 posts, 15 reels or promo videos, daily stories, advanced video editing, campaign planning, ads optimization and scaling, competitor analysis and market research, community management, copywriting and CTA strategy, lead generation strategy, and a monthly performance report and strategy review.",
      say: "Growth is 399 dollars a month. It's our full-scale plan: 20 posts, 15 reels, daily stories, campaign planning, ads optimization and scaling, lead generation strategy, and a monthly performance report and strategy review.",
      acts: [A.price, A.wa] },
    { id: 'addons', w: 3, k: [/\badd[- ]?ons?\b/, /\bextras?\b/, /\blogo\b/, /\bposter\b/, /\bbranding\b/, /\bweb(site| development)\b/, /\blink[- ]in[- ]bio\b/, /\bphoto editing\b/, /\bcontent calendar\b/],
      a: "Add-ons: extra reel editing from $25, custom poster design from $10, product photo editing from $15, Meta Ads setup and optimization from $20, caption writing from $5 per post, monthly content calendar from $30, product promotion campaigns from $40, logo design and branding from $50, basic website or link-in-bio setup from $40, and an analytics and insights report from $25. On-site shooting is custom priced, and web development is coming soon.",
      say: "We have add-ons like extra reel editing from 25 dollars, custom poster design from 10 dollars, logo design from 50 dollars, and more. You can see the full list on the pricing section.",
      acts: [A.price, A.wa] },
    { id: 'budget', w: 3, k: [/\bad (budget|spend)\b/, /\bads budget\b/, /\bboost(ing)?\b/, /\bspend\b/, /\bmonthly budget\b/],
      a: "The ad budget is paid separately by you, on top of our package. In the contact form you can pick your monthly ad budget range, or say you're not sure yet.",
      acts: [A.contact, A.price] },
    { id: 'process', w: 2, k: [/\bprocess\b/, /\bhow (does|do) (it|this|you|adflare) work\b/, /\bhow it works\b/, /\bsteps?\b/, /\btimeline\b/, /\bonboarding\b/, /\bshoot\b/, /\bworkflow\b/, /\b(get|getting) started\b/, /\bproseso\b/],
      a: "Here's how we work, in 4 steps:\n1. Onboarding: we learn your business, goals and who you want to reach.\n2. One-day shoot: we capture the photos and videos your ads need.\n3. Deliverables for approval: we edit the ads and captions, and you review and approve.\n4. Run ads and feedback report: your ads go live and you get a clear report on the results.",
      acts: [A.process, A.contact] },
    { id: 'industries', w: 2, k: [/\bindustr(y|ies)\b/, /\bniche\b/, /\bclients?\b/, /\bwho do you work with\b/, /\b(restaurants?|catering|dental|clinics?|real estate|travel|tour|automotive|car|cars|franchis(e|ing)|distribution|supply|construction|aesthetic)\b/],
      a: "We've run campaigns for distribution and supply, catering and restaurants, franchising, travel and tour agencies, real estate, dental clinics, car and automotive, aesthetic clinics, and home and construction. Not on that list? Message the team and ask.",
      acts: [A.wa, A.samples] },
    { id: 'why', w: 2, k: [/\bwhy (adflare|you|choose|should)\b/, /\bwhat makes you different\b/, /\bdifferent\b/, /\bspecial(ist|ize|ise)\b/, /\bgeneral agency\b/, /\badvantage\b/, /\bbetter than\b/],
      a: "AdFlare only does Meta ads, so 100% of our expertise is Facebook and Instagram. We're data-first, transparent about reporting and fees, and fast: campaigns go live quickly and we scale the winners.",
      acts: [{ l: 'Why AdFlare', go: '#why' }, A.contact] },
    { id: 'strategy', w: 3, k: [/\bstrategy call\b/, /\bfree call\b/, /\bconsult(ation)?\b/, /\bbook( a)?\b/, /\bappointment\b/, /\bschedule\b/, /\bmeeting\b/],
      a: "You can book a free strategy call from the contact form or by messaging us on WhatsApp. Share your goal and a rough budget, and the team will reply with next steps.",
      acts: [A.wa, A.contact] },
    { id: 'contact', w: 2, k: [/\bcontact\b/, /\bphone\b/, /\bcall (you|us|the team)\b/, /\bnumber\b/, /\be-?mail\b/, /\bwhatsapp\b/, /\breach\b/, /\btalk to\b/, /\bspeak to\b/, /\bhuman\b/, /\bteam\b/, /\binquir(y|e)\b/, /\bkausapin\b/, /\btawag\b/],
      a: "You can reach the team by:\n• WhatsApp or phone: +960 7862274\n• Email: adflare@gmail.com\n• The contact form on this site\nThey reply with next steps.",
      say: "You can reach the team on WhatsApp or phone at +960 7862274, by email at adflare@gmail.com, or through the contact form.",
      acts: [A.wa, A.mail, A.contact] },
    { id: 'access', w: 4, k: [/\baccess\b/, /\bpage access\b/, /\badmin\b/, /\binvite\b/, /\bpermission\b/, /\bfull control\b/, /\bbusiness manager\b/, /\badd (you|adflare|us)\b/, /\bmanage my page\b/, /\bgive you\b/],
      a: "Happy to help! You need to be an admin of your Facebook Page. Open your Page, go to Settings, then Page access, click Add new, search adflare@gmail.com, choose Full control and click Give access, then confirm with your password. Facebook keeps the password private; we never see it. The Give Access page has an animated step-by-step guide.",
      say: "Happy to help! You need to be an admin of your Page. Go to Settings, then Page access, click Add new, search for adflare@gmail.com, choose Full control, click Give access, and confirm with your password. We never see your password. The Give Access page has an animated guide.",
      acts: [A.access, A.wa] },
    { id: 'samples', w: 2, k: [/\bsamples?\b/, /\bportfolio\b/, /\bexamples?\b/, /\breels?\b/, /\bposters?\b/, /\b(our|your|past|previous) work\b/, /\bdesigns?\b/, /\bads? you (made|created)\b/],
      a: "You can browse sample ads, reels and websites in the Samples section. Switch tabs to see each type, and tap an image to enlarge it.",
      acts: [A.samples, A.price] },
    { id: 'tour', w: 4, k: [/\btour\b/, /\bshow me around\b/, /\bguide me\b/, /\bwalk ?through\b/, /\bwalk me through\b/, /\bdemo\b/],
      a: IS_HOME ? "Sure! I'll walk you through the site. Sit back and watch." : "The tour is on the home page. Want me to take you there?",
      acts: IS_HOME ? [A.tour] : [{ l: 'Go to home page', go: 'index.html', main: 1 }] },
    { id: 'social', w: 3, k: [/\binstagram\b/, /\binsta\b/, /\bfollow\b/, /\byour (facebook|fb) page\b/, /\bsocial (media )?(links?|accounts?)\b/],
      a: "You can find us on Facebook and Instagram:", acts: [A.fb, A.ig] },
    { id: 'results', w: 2, k: [/\bresults?\b/, /\bguarantee\b/, /\broi\b/, /\bproof\b/, /\btestimonials?\b/, /\breviews?\b/, /\beffective\b/, /\bdoes it work\b/],
      a: "I can't promise specific numbers here, but every package comes with reporting so you can see what's working, and the Growth plan includes a monthly performance report and strategy review. For specifics, the team can walk you through it on a free strategy call.",
      acts: [A.wa, A.contact] },
    { id: 'where', w: 2, k: [/\bwhere (are you|is adflare|do you)\b/, /\blocation\b/, /\boffice\b/, /\baddress\b/, /\bbased\b/],
      a: "I don't have an office address on file. Message the team on WhatsApp or email adflare@gmail.com and they'll tell you.", acts: [A.wa, A.mail] },
    { id: 'voice', w: 3, k: [/\bvoice\b/, /\bmute\b/, /\bspeak(ing)?\b/, /\bsound\b/, /\bloud(er)?\b/],
      a: "You can turn my voice on or off with the speaker button at the top of this chat. You can also drag me anywhere on the screen, and I'll step aside when I'm covering your reading.", acts: [] },
    { id: 'thanks', w: 1, k: [/\b(thanks|thank you|thx|ty|salamat|great|awesome|cool|nice|perfect)\b/],
      a: "You're welcome! Anything else you'd like to know?", acts: [Q('What are your packages?'), A.wa] },
    { id: 'bye', w: 2, k: [/\b(bye|goodbye|see you|paalam)\b/], a: "Bye for now! I'm here whenever you need me.", acts: [] }
  ];
  var FALLBACK = {
    a: "Hmm, I'm not sure about that one. I can help with packages and pricing, how we work, giving us Page access, or reaching the team. For anything else, the team is happy to help on WhatsApp.",
    acts: [Q('What are your packages?'), Q('How does it work?'), A.wa]
  };
  function answer(text) {
    var q = ' ' + text.toLowerCase().replace(/[^a-z0-9$@+.\s'-]/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
    var best = null, bs = 0;
    INTENTS.forEach(function (it) {
      var s = 0; it.k.forEach(function (re) { if (re.test(q)) s += it.w; });
      if (s > bs) { bs = s; best = it; }
    });
    return best || FALLBACK;
  }

  /* ---------- her voice: one female English voice, best available on the device ---------- */
  var synth = window.speechSynthesis, voice = null, voiceOn = ls('af_sfx_off') !== '1', speaking = false, sid = 0, unlocked = false, watchdog = 0;
  var PREFER = [/aria/i, /jenny/i, /sonia/i, /libby/i, /samantha/i, /google us english/i, /ava\b/i, /allison/i, /zira/i, /susan/i, /karen/i, /serena/i, /moira/i, /tessa/i, /hazel/i, /google uk english female/i, /female/i];
  var MALE = /\b(david|mark|daniel|alex|fred|guy|ryan|george|james|thomas|oliver|rishi|arthur|male|evan|tom|gordon|aaron|reed|eddy|rocko|ralph|bruce|junior|lee|nathan|christopher|eric|roger|steffan|brian|andrew|liam)\b/i;
  function pickVoice() {
    if (!synth) return null;
    var all = synth.getVoices() || [];
    var en = all.filter(function (v) { return /^en([-_]|$)/i.test(v.lang); });
    var pool = en.filter(function (v) { return !(MALE.test(v.name) && !/female/i.test(v.name)); });
    if (!pool.length) pool = en;
    var us = pool.filter(function (v) { return /^en[-_]us/i.test(v.lang); });
    var order = us.length ? us.concat(pool) : pool;
    for (var i = 0; i < PREFER.length; i++) for (var j = 0; j < order.length; j++) if (PREFER[i].test(order[j].name)) return (voice = order[j]);
    return (voice = order[0] || null);
  }
  if (synth && synth.addEventListener) synth.addEventListener('voiceschanged', function () { voice = null; });
  function unlock() {
    if (unlocked || !synth) return; unlocked = true;
    try { var u = new SpeechSynthesisUtterance(' '); u.volume = 0; synth.speak(u); } catch (e) {}
  }
  function spoken(t) {
    return t.replace(/AdFlare/g, 'Ad Flare').replace(/adflare@gmail\.com/gi, 'adflare at gmail dot com').replace(/\+960\s?7862274/g, 'plus 9 6 0, 7 8 6 2 2 7 4')
      .replace(/\$(\d+)\s*\/\s*month/gi, '$1 dollars a month').replace(/from \$(\d+)/gi, 'from $1 dollars').replace(/\$(\d+)/g, '$1 dollars').replace(/\/month/gi, ' a month')
      .replace(/[\u{1F300}-\u{1FAFF}\u2600-\u27BF\u2022]/gu, '').replace(/&/g, ' and ').replace(/\n+/g, '. ').replace(/\s+/g, ' ').trim();
  }
  function chunks(t) {
    var parts = t.match(/[^.!?]+[.!?]*/g) || [t], out = [], cur = '';
    parts.forEach(function (p) { if (cur && (cur.length >= 48 || (cur + p).length > 170)) { out.push(cur); cur = p; } else cur += p; });
    if (cur.trim()) out.push(cur);
    return out;
  }
  /* ---------- shared state: voice + UI ---------- */
  var nav, bar, askBtn, hint, card, cardText, cardGhost, cardLive, cardActs, cardLabel, cardVoice, input, form, micBtn, avEl, ttl, ttSub, segs;
  var bubble, isOpen = false, mode = 'chat', tourOn = false, listening = false, thinking = false, typing = false, ttsOn = false;
  var curEx = 'neutral', exNow = 'neutral', exSeq = [], coverT = 0;
  var curLook = 'right', lookT = 0;
  function applyExpr() { var l = document.querySelectorAll('.flare-av'); for (var i = 0; i < l.length; i++) { l[i].setAttribute('data-ex', curEx); l[i].setAttribute('data-look', curLook); } }
  function setLook(n) { if (n === curLook) return; curLook = n; applyExpr(); }
  function lookLoop() {   // idle: she glances around (right / front / left); when the bar is open she faces you
    clearTimeout(lookT); if (isOpen || tourOn) return;
    if (!reduced() && !document.hidden) { var o = ['right', 'front', 'left'].filter(function (x) { return x !== curLook; }); setLook(o[Math.floor(Math.random() * o.length)]); }
    lookT = setTimeout(lookLoop, 2400 + Math.random() * 2600);
  }
  function setExpr(n) { if (n === curEx) return; curEx = n; applyExpr(); }
  function exAt(i) { for (var k = 0; k < exSeq.length; k++) if (i < exSeq[k][0]) return exSeq[k][1]; return exSeq.length ? exSeq[exSeq.length - 1][1] : 'neutral'; }
  var state = 'idle', typeTimer = 0, thinkTimer = 0, hintT = 0, recog = null, listenBoost = 0, tourLast = '';
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var PH = 'Ask about packages, pricing, access…';
  var I_MIC = '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>';
  var I_SPARK = '<svg viewBox="0 0 24 24"><path d="M12 3l1.9 5.6 5.6 1.9-5.6 1.9L12 18l-1.9-5.6L4.5 10.5l5.6-1.9z"/></svg>';
  var I_PREV = '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>';
  var I_NEXT = '<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>';
  var I_MIN = '<svg viewBox="0 0 24 24"><path d="M6 12h12"/></svg>';
  var I_ENTER = '<svg viewBox="0 0 24 24"><path d="M20 5v6a3 3 0 0 1-3 3H5m0 0 4-4m-4 4 4 4"/></svg>';

  function setTalking(on) { ttsOn = on; if (bubble) bubble.classList.toggle('is-talking', on); refresh(); }
  function stopSpeech() {
    sid++; clearTimeout(watchdog); speaking = false; setTalking(false);
    try { if (synth) synth.cancel(); } catch (e) {}
  }
  function speak(text) {
    stopSpeech();
    if (!synth || !voiceOn || !text) return;
    var my = sid, list = chunks(spoken(text)), i = 0, v = voice || pickVoice();
    if (!list.length) return;
    speaking = true;
    watchdog = setTimeout(function () { if (my === sid && !synth.speaking) { speaking = false; } }, 3000);
    function end() { if (my !== sid) return; speaking = false; setTalking(false); clearTimeout(watchdog); }
    function next() {
      if (my !== sid) return;
      if (i >= list.length) { end(); return; }
      var cur = list[i++], u = new SpeechSynthesisUtterance(cur);
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-US';
      u.pitch = 1.12; u.rate = 1.02; u.volume = 1;
      u.onstart = function () { if (my !== sid) return; exNow = exprFromText(cur); setTalking(true); if (state === 'speak') setExpr(exNow); };
      u.onend = next; u.onerror = end;
      try { synth.speak(u); } catch (e) { end(); }
    }
    setTimeout(next, 60);      // Chrome drops a speak() fired right after cancel()
  }


  /* ---------- state machine: idle / think / speak / listen ---------- */
  function refresh() {
    if (!nav) return;
    var s = listening ? 'listen' : (typing || ttsOn) ? 'speak' : thinking ? 'think' : 'idle';
    if (!isOpen) s = 'idle';
    if (s !== state) {
      state = s;
      nav.classList.toggle('fl-listen', s === 'listen'); nav.classList.toggle('fl-speak', s === 'speak'); nav.classList.toggle('fl-think', s === 'think');
      avEl.classList.toggle('is-talking', s === 'speak');
      micBtn.classList.toggle('is-live', s === 'listen');
      setExpr(s === 'speak' ? exNow : s === 'listen' ? 'listen' : s === 'think' ? 'think' : 'neutral');
      setLook(s === 'think' ? 'left' : 'front');
    }
    var lbl = { listen: 'Flare is listening', think: 'Flare is thinking', speak: (voiceOn && synth) ? 'Flare is speaking' : 'Flare is answering', idle: 'Flare' }[state];
    if (cardLabel.textContent !== lbl) cardLabel.textContent = lbl;
    card.classList.toggle('is-live', state !== 'idle');
  }

  /* ---------- waveform (canvas, no libraries) ---------- */
  var NB = 38, bt = [], bv = [], dv = [], lastR = 0, raf = 0, waves = [];
  for (var wi = 0; wi < NB; wi++) { bt.push(Math.random()); bv.push(Math.random()); dv.push(.05); }
  function drawWave(c, t) {
    var w = c.clientWidth, h = c.clientHeight; if (!w || !h) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
    var g = c.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
    var step = w / NB, bw = Math.max(2, step * .56);
    for (var i = 0; i < NB; i++) {
      var tp = .55 + .45 * Math.sin(Math.PI * (i + .5) / NB), v = dv[i] * tp;
      var bh = Math.max(3, v * h), x = i * step + (step - bw) / 2, y = (h - bh) / 2, k = Math.min(1, v * 1.4);
      g.fillStyle = 'rgba(255,' + Math.round(255 - (1 - k) * 100) + ',' + Math.round(255 - (1 - k) * 100) + ',' + (.55 + .45 * k) + ')';
      g.beginPath(); if (g.roundRect) g.roundRect(x, y, bw, bh, bw / 2); else g.rect(x, y, bw, bh); g.fill();
    }
  }
  var lastF = 0;
  function loop(ts) {
    raf = requestAnimationFrame(loop);
    if (ts - lastF < 32) return;   // 30fps is plenty for the bars and halves the work
    lastF = ts;
    var t = ts / 1000;
    if (ts - lastR > 85) { lastR = ts; for (var i = 0; i < NB; i++) bt[i] = Math.random(); }
    if (listening) listenBoost = Math.max(.12, listenBoost * .975);
    var env = .45 + .55 * Math.abs(Math.sin(t * 7.3) * Math.sin(t * 3.1 + 1));
    for (var j = 0; j < NB; j++) {
      bv[j] += (bt[j] - bv[j]) * .22;
      var v;
      if (state === 'speak') v = env * (.22 + .78 * bv[j]);
      else if (state === 'listen') v = (.1 + listenBoost * .85) * (.3 + .7 * bv[j]) + .04;
      else if (state === 'think') v = .1 + .3 * (Math.sin(t * 5 - j * .45) * .5 + .5);
      else v = .06 + .06 * (Math.sin(t * 1.6 + j * .5) * .5 + .5);
      dv[j] += (v - dv[j]) * .3;
    }
    waves.forEach(function (c) { drawWave(c, t); });
  }

  /* ---------- the answer card ---------- */
  function placeCard() {
    if (!nav) return;
    var r = nav.getBoundingClientRect(), vv = window.visualViewport, vh = vv ? vv.height : innerHeight;
    card.style.bottom = 'auto';
    card.style.top = (r.bottom + 10) + 'px'; card.style.maxHeight = Math.max(160, vh - r.bottom - 24) + 'px';
  }
  function showCard() {
    placeCard(); card.classList.add('on');
    /* nav / keyboard can still be settling on phones: re-pin right under the nav */
    requestAnimationFrame(placeCard); setTimeout(placeCard, 350); setTimeout(placeCard, 900);
  }
  function hideCard() { card.classList.remove('on'); }
  function setCardText(t, dots) {
    cardGhost.textContent = t || '';
    if (dots) cardLive.innerHTML = '<span class="fn-dots"><i></i><i></i><i></i></span>'; else cardLive.textContent = '';
  }
  function showActs(acts) {
    cardActs.classList.remove('on'); cardActs.innerHTML = '';
    if (!acts || !acts.length) return;
    acts.forEach(function (a, i) {
      var b;
      if (a.href) { b = el('a'); b.href = a.href; b.target = '_blank'; b.rel = 'noopener'; }
      else { b = el('button'); b.type = 'button'; b.addEventListener('click', function () { runAct(a); }); }
      b.textContent = a.l; b.style.setProperty('--i', i); if (a.main) b.className = 'go'; cardActs.appendChild(b);
    });
    requestAnimationFrame(function () { requestAnimationFrame(function () { cardActs.classList.add('on'); }); });
  }
  function respond(r, o) {
    o = o || {};
    clearTimeout(thinkTimer); clearInterval(typeTimer); typing = false; thinking = true;
    cardActs.classList.remove('on'); cardActs.innerHTML = '';
    var shown = (o.speak !== false && voiceOn && synth && r.say) ? r.say : r.a;
    setCardText(shown, true); showCard(); refresh();
    var d = o.delay != null ? o.delay : 550 + Math.min(r.a.length * 4, 450);
    thinkTimer = setTimeout(function () {
      thinking = false;
      if (o.speak !== false) speak(r.say || r.a);
      var text = shown;
      exSeq = exTrack(text); exNow = exAt(0);
      if (reduced()) { setCardText(text); typing = false; refresh(); showActs(r.acts); return; }
      typing = true; refresh();
      var i = 0, per = Math.max(1, Math.ceil(text.length / 130));
      cardLive.textContent = '';
      var tn = document.createTextNode(''); cardLive.appendChild(tn); var cr = el('i', 'fn-caret'); cardLive.appendChild(cr);
      typeTimer = setInterval(function () {
        i += per; tn.nodeValue = text.slice(0, i);
        if (!ttsOn) { var e2 = exAt(i); if (e2 !== exNow) { exNow = e2; if (state === 'speak') setExpr(exNow); } }
        if (i >= text.length) { clearInterval(typeTimer); typing = false; cr.remove(); refresh(); showActs(r.acts); }
      }, 24);
    }, d);
  }
  function submitQ(text) {
    text = (text || '').trim(); if (!text) return;
    unlock(); stopSpeech(); stopListen();
    input.value = text; syncText();
    respond(answer(text));
  }
  function greet() {
    var w = "Hi! I'm Flare, AdFlare's AI assistant. How can I help you today?";
    respond({ a: w, say: w, acts: [Q('What are your packages?'), Q('How does it work?'), Q('How do I give access?'), Q('Contact the team')] }, { speak: true, delay: 450 });
  }
  function runAct(a) {
    if (a.ask) { submitQ(a.ask); return; }
    if (a.run === 'tour') { if (window.afStartTour && IS_HOME) window.afStartTour(); else window.location.href = 'index.html'; return; }
    if (a.go) {
      var h = a.go;
      if (h.charAt(0) === '#') {
        var t = $(h);
        if (t) { if (window.afNavRelease) window.afNavRelease(); t.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' }); hideCard(); }
        else window.location.href = 'index.html' + h;
      } else window.location.href = h;
    }
  }

  /* ---------- microphone (browser speech recognition) ---------- */
  function stopListen() {
    if (recog) { var r = recog; recog = null; r.onend = r.onresult = r.onerror = r.onspeechstart = r.onspeechend = r.onaudiostart = null; try { r.abort(); } catch (e) {} }
    listening = false; listenBoost = 0; if (input) input.placeholder = PH; refresh();
  }
  function say(msg) { respond({ a: msg, acts: [] }, { speak: false, delay: 150 }); }
  function startListen() {
    if (!SR || tourOn) return;
    stopSpeech(); clearTimeout(thinkTimer); clearInterval(typeTimer); typing = false; thinking = false;
    var r; try { r = new SR(); } catch (e) { return; }
    recog = r; r.lang = 'en-US'; r.interimResults = true; r.continuous = false; r.maxAlternatives = 1;
    var heard = '', err = '';
    r.onaudiostart = function () { if (recog === r) listenBoost = .3; };
    r.onspeechstart = function () { if (recog === r) listenBoost = 1; };
    r.onspeechend = function () { if (recog === r) listenBoost = .12; };
    r.onresult = function (e) {
      if (recog !== r) return;
      var txt = '';
      for (var i = e.resultIndex; i < e.results.length; i++) txt += e.results[i][0].transcript;
      for (var k = 0; k < e.resultIndex; k++) txt = e.results[k][0].transcript + txt;
      heard = txt; input.value = txt; syncText(); listenBoost = 1;
    };
    r.onerror = function (e) { if (recog === r) err = e.error || 'error'; };
    r.onend = function () {
      if (recog !== r) return;
      recog = null; listening = false; listenBoost = 0; input.placeholder = PH; refresh();
      if (heard.trim()) { submitQ(heard); return; }
      if (err === 'not-allowed' || err === 'service-not-allowed') say('The microphone is blocked. Allow mic access for this site in your browser, or just type your question.');
      else if (err === 'network') say('Voice input needs an internet connection. You can type your question instead.');
      else if (err === 'aborted') hideCard();
      else say("I didn't catch that. Tap the mic and try again, or type your question.");
    };
    try {
      r.start(); listening = true; input.value = ''; input.placeholder = 'Listening…'; syncText();
      setCardText('Listening… go ahead and ask me.'); cardLive.textContent = 'Listening… go ahead and ask me.'; cardActs.innerHTML = ''; showCard(); refresh();
    } catch (e) { recog = null; listening = false; refresh(); }
  }
  function syncText() { form.classList.toggle('has-text', !!input.value.trim()); }

  /* ---------- open / close the AI bar ---------- */
  function setOrigin() {
    var r = askBtn.getBoundingClientRect(), b = nav.getBoundingClientRect(), ox, oy;
    if (r.width) { ox = r.left + r.width / 2 - b.left; oy = r.top + r.height / 2 - b.top; } else { ox = b.width / 2; oy = b.height / 2; }
    var rad = Math.hypot(Math.max(ox, b.width - ox), Math.max(oy, b.height - oy)) + 30;
    var s0 = clamp(((r.width || b.height) / 2) / rad, .02, .6);   // starts exactly as big as the button
    bar.style.setProperty('--ox', ox + 'px'); bar.style.setProperty('--oy', oy + 'px'); bar.style.setProperty('--rad', rad + 'px'); bar.style.setProperty('--s0', s0);
  }
  function setInert(on) {
    Array.prototype.forEach.call(nav.children, function (c) { if (c === bar) return; if (on) c.setAttribute('inert', ''); else c.removeAttribute('inert'); });
  }
  function openBar() {
    if (isOpen) { if (!tourOn) input.focus(); return; }
    isOpen = true; unlock(); hideHint();
    clearTimeout(lookT); setLook('front');
    nav.classList.remove('menu-open'); var hb = $('#hamburger'); if (hb) hb.classList.remove('active');
    setOrigin(); void bar.offsetWidth;                       // commit the start state so the circle really grows from the button
    nav.classList.add('fl-on'); bar.classList.add('is-on'); setInert(true);
    clearTimeout(coverT); coverT = setTimeout(function () { if (isOpen) nav.classList.add('fl-covered'); }, 540);   // drop the blur only once the bar fully covers it
    if (!tourOn) {
      greet();
      if (!window.matchMedia || matchMedia('(hover: hover)').matches) setTimeout(function () { if (isOpen && !tourOn) input.focus(); }, 560);   // no auto-keyboard on phones: it jolts the animation
    }
  }
  function closeBar() {
    if (!isOpen) return;
    if (tourOn && window.afTour) { window.afTour.stop(); return; }
    clearTimeout(coverT); nav.classList.remove('fl-covered');   // blur comes back while the bar is still covering it
    setOrigin(); isOpen = false; setExpr('neutral');
    clearTimeout(lookT); lookT = setTimeout(lookLoop, 1200);
    stopSpeech(); stopListen(); clearTimeout(thinkTimer); clearInterval(typeTimer); typing = false; thinking = false;
    setInert(false); hideCard(); bar.classList.remove('is-on'); nav.classList.remove('fl-on', 'fl-listen', 'fl-speak', 'fl-think'); state = 'idle';
    avEl.classList.remove('is-talking'); micBtn.classList.remove('is-live'); input.blur();
    setTimeout(function () { if (!isOpen) cancelAnimationFrame(raf); }, 700);
  }
  window.flareOpen = openBar;

  function setMode(m) { mode = m; bar.setAttribute('data-mode', m); }
  function onTour(e) {
    var d = e.detail || {};
    if (d.state === 'start') {
      tourOn = true; tourLast = ''; setMode('tour'); stopSpeech(); stopListen(); clearTimeout(thinkTimer); clearInterval(typeTimer); typing = false; thinking = false; hideCard();
      segs.innerHTML = ''; for (var i = 0; i < d.total; i++) segs.appendChild(el('i', 'fn-seg'));
      document.body.classList.add('flare-tour');
      if (!isOpen) openBar();
    } else if (d.state === 'step') {
      var all = segs.children;
      for (var k = 0; k < all.length; k++) { all[k].classList.toggle('done', k < d.idx); all[k].classList.toggle('cur', k === d.idx); }
      ttSub.textContent = (d.idx + 1) + ' of ' + d.total + (d.label ? ' · ' + d.label : '');
      ttSub.classList.remove('swap'); void ttSub.offsetWidth; ttSub.classList.add('swap');
    } else if (d.state === 'stop') {
      tourOn = false; tourLast = ''; stopSpeech(); document.body.classList.remove('flare-tour');
      closeBar(); setTimeout(function () { if (!isOpen) setMode('chat'); }, 800);
    }
  }

  /* ---------- hint under the button (first visit) ---------- */
  function placeHint() {
    var r = askBtn.getBoundingClientRect(); if (!r.width) return false;
    var cx = r.left + r.width / 2, left = clamp(cx, 80, innerWidth - 80);
    hint.style.left = left + 'px'; hint.style.top = (r.bottom + 12) + 'px'; hint.style.setProperty('--ax', (cx - left + hint.offsetWidth / 2) + 'px');
    return true;
  }
  function showHint() {
    if (isOpen || tourOn || ls(HKEY)) return;
    if (!placeHint()) return;
    ls(HKEY, '1'); hint.classList.add('on'); hintT = setTimeout(hideHint, 7500);
  }
  function hideHint() { clearTimeout(hintT); hint.classList.remove('on'); }

  /* ---------- she hosts the guided tour (tour.js): her face + voice on every bubble ---------- */
  function hookTour() {
    var bub = $('.af-bubble'); if (!bub) return false;
    bubble = bub; bub.classList.add('has-flare');
    bub.insertBefore(el('div', 'flare-mini flare-av', FACE), bub.firstChild); applyExpr();
    var label = $('b', bub); if (label) label.textContent = 'Flare';
    new MutationObserver(function () {
      var span = $('span', bub), t = span ? span.textContent : '';
      if (tourOn && bub.classList.contains('on') && t && t !== tourLast) { tourLast = t; exNow = exprFromText(t); setExpr(exNow); speak(t); }
    }).observe(bub, { attributes: true, attributeFilter: ['class'], childList: true, subtree: true, characterData: true });
    return true;
  }

  /* ---------- mount ---------- */
  function mount() {
    nav = $('#navbar'); if (!nav) return;
    document.body.classList.add('flare-nav');

    askBtn = el('button', 'fn-ask', '<span class="fn-ask-fx"></span><span class="fn-ask-av flare-av">' + FACE + '</span><span class="fn-ask-t">Ask Flare</span><i class="fn-ask-dot"></i>');
    askBtn.type = 'button'; askBtn.id = 'afAsk'; askBtn.setAttribute('aria-label', 'Ask Flare, the AdFlare AI assistant'); askBtn.setAttribute('aria-expanded', 'false');
    nav.insertBefore(askBtn, $('#afSfx', nav) || $('#themeWrap', nav) || $('#hamburger', nav));

    bar = el('div', 'fn-bar'); bar.setAttribute('data-mode', 'chat');
    bar.innerHTML =
      '<div class="fn-sheen"><i class="fn-reveal"></i><i class="fn-plate"></i></div>' +
      '<div class="fn-av flare-av">' + FACE + '</div>' +
      '<div class="fn-in">' +
        '<form class="fn-form" autocomplete="off" style="--i:1"><input type="text" placeholder="' + PH + '" aria-label="Ask Flare a question" enterkeyhint="send" maxlength="200"><button type="submit" class="fn-send" aria-label="Send"><span class="t">Enter</span>' + I_ENTER + '</button></form>' +
        '<button type="button" class="fn-btn fn-mic" aria-label="Ask with your voice" style="--i:2">' + I_MIC + '</button>' +
        '<button type="button" class="fn-btn fn-spark" aria-label="Take the site tour" title="Take the site tour" style="--i:3">' + I_SPARK + '</button>' +
        '<button type="button" class="fn-btn fn-x" aria-label="Close Flare" style="--i:4">' + I_X + '</button>' +
      '</div>' +
      '<div class="fn-tr">' +
        '<div class="fn-tt" style="--i:0"><strong>Site tour</strong><small></small></div>' +
        '<div class="fn-segs" style="--i:1"></div>' +
        '<button type="button" class="fn-btn fn-sfxb af-sfx-btn" aria-label="Sound" style="--i:2"></button>' +
        '<button type="button" class="fn-btn fn-prev" aria-label="Previous step" style="--i:3">' + I_PREV + '</button>' +
        '<button type="button" class="fn-btn fn-next" aria-label="Next step" style="--i:4">' + I_NEXT + '</button>' +
        '<button type="button" class="fn-skip" style="--i:5">Skip</button>' +
      '</div>';
    nav.appendChild(bar);
    document.body.insertAdjacentHTML('beforeend', HAIR_DEFS); applyExpr();
    lookT = setTimeout(lookLoop, 1800);
    avEl = $('.fn-av', bar); form = $('.fn-form', bar); input = $('input', form); micBtn = $('.fn-mic', bar);
    ttSub = $('.fn-tt small', bar); segs = $('.fn-segs', bar);
    waves = Array.prototype.slice.call(bar.querySelectorAll('.fn-wave'));

    card = el('div', 'fn-card');
    card.setAttribute('role', 'region'); card.setAttribute('aria-label', 'Flare\'s answer');
    card.innerHTML =
      '<div class="fn-card-head"><span class="fn-eq"><i></i><i></i><i></i><i></i></span><span class="fn-label">Flare</span><button type="button" class="fn-vbtn" data-voice></button><button type="button" class="fn-vbtn" data-min aria-label="Minimize" title="Minimize">' + I_MIN + '</button></div>' +
      '<div class="fn-text" aria-live="polite"><div class="fn-ghost"></div><div class="fn-live" aria-hidden="true"></div></div>' +
      '<div class="fn-acts"></div>';
    document.body.appendChild(card);
    cardLabel = $('.fn-label', card); cardGhost = $('.fn-ghost', card); cardLive = $('.fn-live', card); cardActs = $('.fn-acts', card); cardVoice = $('[data-voice]', card);

    hint = el('div', 'fn-hint', 'Tap to talk to Flare'); document.body.appendChild(hint);

    if (!SR) micBtn.style.display = 'none';
    if (!synth) cardVoice.style.display = 'none';
    function paintVoice() {
      cardVoice.innerHTML = voiceOn ? I_VOL : I_MUTE;
      cardVoice.setAttribute('aria-label', voiceOn ? 'Turn my voice off' : 'Turn my voice on'); cardVoice.setAttribute('aria-pressed', voiceOn ? 'true' : 'false');
    }
    paintVoice();
    // one master switch: the site's sound button (tour.js) controls effects AND Flare's voice together
    function setSound(on) { voiceOn = on; paintVoice(); if (!on) stopSpeech(); refresh(); }
    window.addEventListener('af:sound', function (e) { setSound(!!(e.detail && e.detail.on)); });
    cardVoice.addEventListener('click', function () { var b = $('#afSfx'); if (b) b.click(); else setSound(!voiceOn); });

    $('[data-min]', card).addEventListener('click', hideCard);
    askBtn.addEventListener('click', function () { askBtn.setAttribute('aria-expanded', 'true'); openBar(); });
    hint.addEventListener('click', openBar);
    $('.fn-x', bar).addEventListener('click', function () { askBtn.setAttribute('aria-expanded', 'false'); closeBar(); askBtn.focus({ preventScroll: true }); });
    $('.fn-spark', bar).addEventListener('click', function () { runAct({ run: 'tour' }); });
    micBtn.addEventListener('click', function () { unlock(); if (listening) { try { recog.stop(); } catch (e) {} } else startListen(); });
    form.addEventListener('submit', function (e) { e.preventDefault(); if (!input.value.trim()) { input.focus(); return; } submitQ(input.value); });
    input.addEventListener('input', function () { syncText(); });
    input.addEventListener('focus', function () { if (input.value) { try { input.select(); } catch (e) {} } });
    $('.fn-prev', bar).addEventListener('click', function () { if (window.afTour) window.afTour.back(); });
    $('.fn-next', bar).addEventListener('click', function () { if (window.afTour) window.afTour.next(); });
    $('.fn-skip', bar).addEventListener('click', function () { if (window.afTour) window.afTour.stop(); });
    $('.fn-sfxb', bar).addEventListener('click', function () { var b = $('#afSfx'); if (b) b.click(); });
    if (window.afPaintSfx) window.afPaintSfx();

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen && !tourOn && !$('.af-pal.is-on')) { closeBar(); askBtn.focus({ preventScroll: true }); }
    });
    window.addEventListener('af:tour', onTour);
    if (window.visualViewport) window.visualViewport.addEventListener('resize', function () { if (card.classList.contains('on')) placeCard(); });
    window.addEventListener('resize', function () { if (card.classList.contains('on')) placeCard(); if (hint.classList.contains('on')) placeHint(); });
    window.addEventListener('scroll', function () { if (hint.classList.contains('on')) hideHint(); }, { passive: true });

    setTimeout(showHint, 2800);
    var tries = 0;
    (function wait() { if (!hookTour() && ++tries < 30) setTimeout(wait, 300); })();
    window.afFlare = { speaking: function () { return speaking; }, open: openBar, close: closeBar, say: speak };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
})();
