/* Builds the starting demo dataset: the original sample rows plus generated history, all with real timestamps. */
import { initialDemoData } from '../data/demo.js';
import { DAY, startOfDay, parseLabel, rng, round2, clone } from './util.js';

const DATE_KEYS = {
  bills: ['date'], sessions: ['openedAt', 'closedAt'], giftCards: ['issuedAt', 'expires'], quotations: ['createdAt', 'expires'],
  onlinePayments: ['submittedAt'], stockCounts: ['startedAt'], transfers: ['createdAt'], purchaseOrders: ['createdAt', 'expectedAt'],
  receipts: ['receivedAt'], landedCosts: ['date'], onlineOrders: ['date'], expenses: ['date'], categories: ['updatedAt'],
};
const FUTURE_KEYS = new Set(['expires', 'expectedAt']);
const TAX = 8;
const pad = (n, w = 5) => String(n).padStart(w, '0');

export function buildSeed(nowTs = Date.now()) {
  const src = clone(initialDemoData);
  const r = rng(2026);
  const today0 = startOfDay(nowTs);
  const year = new Date(nowTs).getFullYear();

  for (const [coll, keys] of Object.entries(DATE_KEYS)) {
    for (const row of src[coll] || []) {
      for (const key of keys) {
        let ts = parseLabel(row[key], nowTs);
        if (ts != null && !FUTURE_KEYS.has(key) && ts > nowTs) ts = nowTs - 60000;
        row[key] = ts;
      }
    }
  }

  const products = src.products;
  const popularity = [5, 3, 4, 4, 1, 3, 3, 2];
  const customers = src.customers;
  customers.forEach((c, i) => { c.creditLimit = 3000; c.joinedAt = nowTs - (i * 17 + 9) * DAY; });

  const makeLines = (maxLines = 4) => {
    const n = r.weighted([1, 2, 3, 4].slice(0, maxLines), [4, 4, 2, 1].slice(0, maxLines));
    const used = new Set(); const lines = [];
    for (let i = 0; i < n; i++) {
      const p = r.weighted(products, popularity);
      if (used.has(p.sku)) continue;
      used.add(p.sku);
      lines.push({ sku: p.sku, name: p.name, price: p.price, qty: r.weighted([1, 2, 3], [6, 3, 1]) });
    }
    return lines;
  };
  const linesForUnits = (units) => {
    const lines = []; const used = new Set(); let left = Math.max(1, units);
    while (left > 0) {
      const p = r.weighted(products, popularity);
      if (used.has(p.sku) && used.size < products.length) continue;
      used.add(p.sku);
      const qty = Math.min(left, r.int(1, 2));
      lines.push({ sku: p.sku, name: p.name, price: p.price, qty }); left -= qty;
    }
    return lines;
  };
  const sum = (lines) => lines.reduce((s, l) => s + l.price * l.qty, 0);
  const units = (lines) => lines.reduce((s, l) => s + l.qty, 0);

  /* ----- bills: ~40 days of history, newest first ----- */
  const generated = [];
  for (let off = 0; off < 40; off++) {
    const day = today0 - off * DAY;
    const dow = new Date(day).getDay();
    let count = 11 + (dow === 5 || dow === 6 ? 6 : 0) + r.int(0, 8);
    let start = day + 8 * 3600000; let end = day + 20 * 3600000;
    if (off === 0) {
      const frac = Math.min(1, Math.max(0.15, (nowTs - start) / (12 * 3600000)));
      count = Math.max(4, Math.round(count * frac));
      if (nowTs < start + 30 * 60000) { start = day; }
      end = Math.min(nowTs - 1000, end);
    }
    for (let i = 0; i < count; i++) {
      const ts = Math.floor(start + r() * Math.max(60000, end - start));
      const lines = makeLines();
      const method = r.weighted(['Card', 'Cash', 'Transfer', 'Credit'], [42, 34, 18, 6]);
      let customer = r() < 0.38 ? r.pick(customers).name : 'Walk-in customer';
      if (method === 'Credit' && customer === 'Walk-in customer') customer = r.pick(customers).name;
      const roll = r();
      let status = 'Completed';
      if (method === 'Credit' && r() < 0.4) status = 'Pending';
      else if (roll < 0.03) status = 'Voided';
      else if (roll < 0.045 && off > 0) status = 'Refunded';
      const total = round2(sum(lines));
      generated.push({
        date: ts, customer, items: units(lines), method, subtotal: total, discount: 0, tax: round2(total * TAX / (100 + TAX)), total,
        outlet: r.weighted(['Main branch', 'Branch 1'], [68, 32]), status, lines, sessionId: null, note: '',
      });
    }
  }
  generated.sort((a, b) => b.date - a.date);
  const openSessionId = 'SES-00814';
  generated.forEach((bill, i) => {
    bill.id = `AF-${year}-${pad(1842 - i)}`;
    const seedRow = src.bills[i];
    if (seedRow) { bill.customer = seedRow.customer; bill.method = seedRow.method; bill.status = seedRow.status; }
    if (bill.method === 'Credit' && bill.customer === 'Walk-in customer') bill.customer = customers[0].name;
    if (bill.date >= today0 && bill.outlet === 'Main branch' && bill.status !== 'Voided') bill.sessionId = openSessionId;
  });
  src.bills = generated;

  /* ----- sessions ----- */
  src.sessions.forEach((s) => {
    s.outlet = s.register === 'Branch 1 counter' ? 'Branch 1' : 'Main branch';
    s.openingFloat = 1500; s.cashIn = 0; s.cashOut = 0;
    const v = Number(s.variance);
    s.variance = Number.isFinite(v) && s.variance !== '—' ? v : null;
    s.counted = s.status === 'Closed' && s.variance != null ? s.expectedCash + s.variance : null;
    s.activity = [];
  });
  const live = src.sessions[0];
  live.openedAt = Math.min(live.openedAt, nowTs - 5 * 60000);
  if (live.openedAt < today0) live.openedAt = today0;
  live.expectedCash = null; live.closedAt = null;
  live.activity = [{ ts: live.openedAt, text: 'Register opened', amount: 1500, tone: 'green' }];
  src.bills.forEach((b) => { if (b.sessionId === openSessionId && b.date < live.openedAt) b.sessionId = null; });

  /* ----- quotations / online orders with real line items ----- */
  src.quotations.forEach((q) => { q.lines = linesForUnits(q.items); q.items = units(q.lines); q.total = round2(sum(q.lines)); q.note = q.note || ''; });
  const payments = src.onlinePayments;
  src.onlineOrders.forEach((o) => {
    o.lines = linesForUnits(o.items); o.items = units(o.lines); o.total = round2(sum(o.lines));
    const pay = payments.find((p) => p.order === o.id);
    if (pay) { pay.amount = o.total; pay.customer = o.customer; }
  });
  const channels = ['Web store', 'Instagram', 'Marketplace'];
  for (let i = 0; i < 26; i++) {
    const age = r.int(1, 38);
    const ts = today0 - age * DAY + r.int(9, 19) * 3600000;
    const lines = linesForUnits(r.int(2, 6));
    const id = `ON-${pad(4378 - i, 5)}`;
    const cancelled = r() < 0.08;
    const status = cancelled ? 'Cancelled' : age <= 2 ? r.pick(['Processing', 'Ready to ship']) : 'Completed';
    const customer = r.pick(customers).name;
    const method = r() < 0.5 ? 'Card' : 'Bank transfer';
    src.onlineOrders.push({ id, channel: r.pick(channels), customer, date: ts, items: units(lines), total: round2(sum(lines)), outlet: r.pick(['Main branch', 'Branch 1']), status, lines });
    payments.push({ id: `PAY-${pad(9008 - i, 5)}`, order: id, customer, method, submittedAt: ts, amount: round2(sum(lines)), status: cancelled ? 'Rejected' : 'Approved' });
  }
  src.onlineOrders.sort((a, b) => b.date - a.date);
  payments.sort((a, b) => b.submittedAt - a.submittedAt);

  /* ----- purchasing ----- */
  const pos = src.purchaseOrders;
  const received = { 'PO-00984': 0, 'PO-00983': 3, 'PO-00982': 16 };
  pos.forEach((p) => { p.receivedUnits = received[p.id] ?? p.items; });
  const supplierNames = src.suppliers.map((s) => s.name);
  for (let i = 0; i < 5; i++) {
    const created = today0 - (9 + i * 11) * DAY;
    const items = r.int(6, 20);
    pos.push({ id: `PO-${pad(981 - i, 5)}`, supplier: r.pick(supplierNames.slice(0, 3)), createdAt: created + 10 * 3600000, expectedAt: created + 4 * DAY, items, receivedUnits: items, total: r.int(40, 200) * 100, outlet: 'Main branch', status: 'Received' });
  }

  /* ----- gift cards / expenses ----- */
  const gcs = src.giftCards;
  for (let i = 0; i < 3; i++) {
    const issued = today0 - (14 + i * 9) * DAY;
    gcs.push({ code: `GC-${pad(4808 - i, 6)}`, customer: r.pick(customers).name, issuedAt: issued, balance: i === 1 ? 0 : [300, 0, 750][i], expires: issued + 365 * DAY, status: i === 1 ? 'Redeemed' : 'Active', value: [300, 400, 750][i] });
  }
  gcs.forEach((g) => { if (g.value == null) g.value = g.balance === 0 ? 500 : g.balance; });
  const expenseSets = {
    Utilities: [['Electricity bill', 'STELCO', 1650], ['Water bill', 'MWSC', 380], ['Monthly internet', 'FiberNet', 1200]],
    'Store supplies': [['Cleaning supplies', 'Office Corner', 260], ['Shelf labels', 'Print House', 190], ['Packaging tape', 'Office Corner', 140]],
    Transport: [['Delivery fuel', 'M. Santos', 520], ['Courier fee', 'Island Express', 330]],
    Marketing: [['Social media ads', 'Meta', 900], ['Flyer print', 'Print House', 640]],
  };
  const cats = Object.keys(expenseSets);
  for (let i = 0; i < 22; i++) {
    const cat = cats[i % cats.length];
    const [description, payee, amount] = r.pick(expenseSets[cat]);
    src.expenses.push({ date: today0 - r.int(2, 58) * DAY + r.int(9, 17) * 3600000, category: cat, description, payee, method: r.pick(['Cash', 'Transfer', 'Card']), amount: amount + r.int(0, 8) * 10, status: 'Approved', receipt: '' });
  }
  src.expenses.forEach((e) => { e.receipt = e.receipt || ''; });
  src.expenses.sort((a, b) => b.date - a.date);

  src.receipts.forEach((x) => { x.note = x.note || ''; });
  delete src.orderProducts;
  src.activity = [];
  src.seededAt = nowTs;
  return src;
}
