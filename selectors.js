/* Read-only calculations over state.data. Nothing here mutates data. */
import { state, outletMatches } from './core.js';
import { periodRange, prevRange, inRange, buckets, pctChange, round2, DAY, startOfDay, fmtDate } from './util.js';

export const isSale = (b) => b.status === 'Completed' || b.status === 'Pending';
const sumBy = (rows, fn) => round2(rows.reduce((s, r) => s + Number(fn(r) || 0), 0));
export const sumTotal = (rows) => sumBy(rows, (r) => r.total);

export const DATE_FIELD = {
  bills: 'date', sessions: 'openedAt', giftCards: 'issuedAt', quotations: 'createdAt', onlinePayments: 'submittedAt', stockCounts: 'startedAt',
  transfers: 'createdAt', purchaseOrders: 'createdAt', landedCosts: 'date', onlineOrders: 'date', expenses: 'date', receipts: 'receivedAt', customers: 'joinedAt',
};

export const billsIn = (range, useOutlet = true) => state.data.bills.filter((b) => inRange(b.date, range) && (!useOutlet || outletMatches(b)));
const ordersIn = (range) => state.data.onlineOrders.filter((o) => inRange(o.date, range) && outletMatches(o));

/* ---------- dashboard ---------- */
export function homeMetrics() {
  const range = periodRange(state.period);
  const prev = prevRange(range);
  const cur = billsIn(range); const prv = billsIn(prev);
  const sales = cur.filter(isSale); const prevSales = prv.filter(isSale);
  const net = sumTotal(sales); const prevNet = sumTotal(prevSales);
  const mtdRange = periodRange('This month');
  const elapsed = mtdRange.end - mtdRange.start;
  const lastMonth = periodRange('Last month');
  const mtd = sumTotal(billsIn(mtdRange).filter(isSale));
  const lmSame = sumTotal(billsIn({ start: lastMonth.start, end: lastMonth.start + elapsed }).filter(isSale));
  const units = sales.reduce((s, b) => s + Number(b.items || 0), 0);
  const prevUnits = prevSales.reduce((s, b) => s + Number(b.items || 0), 0);
  const refunds = cur.filter((b) => b.status === 'Refunded'); const voids = cur.filter((b) => b.status === 'Voided');
  const owing = state.data.customers.filter((c) => Number(c.outstanding) > 0);
  const joined = state.data.customers.filter((c) => inRange(c.joinedAt, mtdRange)).length;
  return {
    range, net, prevNet, netChange: pctChange(net, prevNet), count: sales.length, countChange: pctChange(sales.length, prevSales.length),
    mtd, mtdChange: pctChange(mtd, lmSame), outstanding: sumBy(owing, (c) => c.outstanding), owingCount: owing.length,
    customers: state.data.customers.length, joined, units, unitsChange: pctChange(units, prevUnits),
    refundAmount: sumTotal(refunds), refundCount: refunds.length, voidCount: voids.length, voidAmount: sumTotal(voids),
  };
}

export function bucketSeries(rows, dateOf, valueOf, range) {
  const bks = buckets(range);
  const values = bks.map(() => 0);
  rows.forEach((row) => {
    const ts = dateOf(row);
    const i = bks.findIndex((b) => ts >= b.start && ts < b.end);
    if (i >= 0) values[i] += Number(valueOf(row) || 0);
  });
  return bks.map((b, i) => ({ label: b.label, value: round2(values[i]) }));
}

export function salesSeries(range, metric = 'sales') {
  const sales = billsIn(range).filter(isSale);
  if (metric === 'count') return bucketSeries(sales, (b) => b.date, () => 1, range);
  if (metric === 'average') {
    const total = bucketSeries(sales, (b) => b.date, (b) => b.total, range); const count = bucketSeries(sales, (b) => b.date, () => 1, range);
    return total.map((p, i) => ({ label: p.label, value: count[i].value ? round2(p.value / count[i].value) : 0 }));
  }
  return bucketSeries(sales, (b) => b.date, (b) => b.total, range);
}

/* ---------- products ---------- */
export function productPerformance(range) {
  const prev = prevRange(range);
  const map = new Map();
  const add = (line, ts, orderKey, returned, where) => {
    const cur = inRange(ts, range); const pr = inRange(ts, prev);
    if (!cur && !pr) return;
    const entry = map.get(line.name) || { name: line.name, sku: line.sku, orderKeys: new Set(), quantity: 0, revenue: 0, returns: 0, prevQty: 0 };
    if (cur) { entry.orderKeys.add(orderKey); if (returned) entry.returns += line.qty; else { entry.quantity += line.qty; entry.revenue += line.price * line.qty; } }
    else if (!returned) entry.prevQty += line.qty;
    map.set(line.name, entry);
  };
  state.data.bills.forEach((b) => { if (!outletMatches(b)) return; if (isSale(b)) (b.lines || []).forEach((l) => add(l, b.date, b.id, false)); else if (b.status === 'Refunded') (b.lines || []).forEach((l) => add(l, b.date, b.id, true)); });
  state.data.onlineOrders.forEach((o) => { if (!outletMatches(o) || o.status === 'Cancelled') return; (o.lines || []).forEach((l) => add(l, o.date, o.id, false)); });
  return [...map.values()].map((e) => {
    const change = e.prevQty ? (e.quantity - e.prevQty) / e.prevQty : e.quantity ? 1 : 0;
    return { name: e.name, sku: e.sku, orders: e.orderKeys.size, quantity: e.quantity, revenue: round2(e.revenue), returns: e.returns, status: change > 0.1 ? 'Trending up' : change < -0.1 ? 'Trending down' : 'Steady' };
  }).sort((a, b) => b.revenue - a.revenue);
}

/* ---------- derived table rows ---------- */
export const sessionStats = (s) => {
  const bills = state.data.bills.filter((b) => b.sessionId === s.id && isSale(b));
  const cash = sumBy(bills.filter((b) => b.method === 'Cash'), (b) => b.total);
  const card = sumBy(bills.filter((b) => b.method === 'Card'), (b) => b.total);
  const other = sumBy(bills.filter((b) => b.method !== 'Cash' && b.method !== 'Card'), (b) => b.total);
  const expected = round2(Number(s.openingFloat || 0) + cash + Number(s.cashIn || 0) - Number(s.cashOut || 0));
  return { sales: round2(cash + card + other), cash, card, other, expected, count: bills.length };
};

export function getRows(dataKey) {
  const d = state.data;
  if (dataKey === 'orderProducts') return productPerformance(periodRange(state.period)).map((row, i) => ({ row, index: -1, key: i }));
  const list = d[dataKey] || [];
  return list.map((row, index) => {
    let view = row;
    if (dataKey === 'suppliers') view = { ...row, openOrders: d.purchaseOrders.filter((p) => p.supplier === row.name && !['Received', 'Cancelled'].includes(p.status)).length, leadTime: `${row.leadTime || 0} days`.replace(/ days days$/, ' days') };
    else if (dataKey === 'categories') view = { ...row, products: d.products.filter((p) => p.category === row.name).length };
    else if (dataKey === 'expenseCategories') { const v = round2(Number(row.monthToDate || 0) - Number(row.budget || 0)); view = { ...row, variance: v, status: v > 0 ? 'Over budget' : 'On track' }; }
    else if (dataKey === 'sessions' && row.status === 'Open') view = { ...row, expectedCash: sessionStats(row).expected };
    else if (dataKey === 'landedCosts') view = { ...row, total: round2(Number(row.freight || 0) + Number(row.duties || 0) + Number(row.other || 0)) };
    return { row: view, index, key: index };
  });
}

/* ---------- reports ---------- */
export const REPORT_SOURCE = {
  'sales-report': { page: 'bill-history', dataKey: 'bills' }, 'product-report': { page: 'order-products', dataKey: 'orderProducts' },
  'online-orders-report': { page: 'online-orders', dataKey: 'onlineOrders' }, 'purchasing-report': { page: 'purchase-orders', dataKey: 'purchaseOrders' },
  'loyalty-report': { page: 'customers', dataKey: 'customers' }, 'gift-card-report': { page: 'gift-cards', dataKey: 'giftCards' },
  'expenses-report': { page: 'expenses', dataKey: 'expenses' },
};
const PALETTE = ['red', 'blue', 'green', 'amber', 'violet', 'orange'];
const breakdown = (map, total) => [...map.entries()].sort((a, b) => b[1] - a[1]).map(([label, value], i) => ({ label, value, share: total ? Math.round((value / total) * 100) : 0, color: PALETTE[i % PALETTE.length] }));
const groupSum = (rows, labelFn, valFn) => { const m = new Map(); rows.forEach((r) => m.set(labelFn(r), (m.get(labelFn(r)) || 0) + Number(valFn(r) || 0))); return m; };

export function reportData(id) {
  const range = periodRange(state.period); const prev = prevRange(range); const d = state.data;
  const inP = (rows, key, r = range) => rows.filter((x) => inRange(x[key], r) && outletMatches(x));
  if (id === 'sales-report') {
    const rows = billsIn(range); const sales = rows.filter(isSale); const prevSales = billsIn(prev).filter(isSale);
    const net = sumTotal(sales); const lost = rows.filter((b) => b.status === 'Refunded' || b.status === 'Voided');
    return { money: true, stats: [
      { label: 'Net sales', value: net, kind: 'money', sub: `${pctChange(net, sumTotal(prevSales))} vs previous period` },
      { label: 'Transactions', value: sales.length, sub: `${pctChange(sales.length, prevSales.length)} vs previous period` },
      { label: 'Average sale', value: sales.length ? round2(net / sales.length) : 0, kind: 'money', sub: 'Across completed and pending sales' },
      { label: 'Refunds & voids', value: sumTotal(lost), kind: 'money', sub: `${lost.length} bill${lost.length === 1 ? '' : 's'}` }],
      series: { title: 'Sales by period', tag: 'Net sales', items: bucketSeries(sales, (b) => b.date, (b) => b.total, range), money: true },
      breakdown: { title: 'Breakdown', sub: 'By payment type', items: breakdown(groupSum(sales, (b) => b.method, (b) => b.total), net), format: 'pct' } };
  }
  if (id === 'product-report') {
    const rows = productPerformance(range); const rev = rows.reduce((s, r) => s + r.revenue, 0); const qty = rows.reduce((s, r) => s + r.quantity, 0);
    return { stats: [
      { label: 'Product revenue', value: round2(rev), kind: 'money', sub: 'Store and online sales' }, { label: 'Units sold', value: qty, sub: 'In the selected period' },
      { label: 'Active products', value: rows.length, sub: 'With at least one sale' }, { label: 'Returns', value: rows.reduce((s, r) => s + r.returns, 0), sub: 'Units refunded' }],
      series: { title: 'Revenue by product', tag: 'MVR', items: rows.slice(0, 8).map((r) => ({ label: r.name.split(' ')[0], value: r.revenue })), money: true },
      breakdown: { title: 'Breakdown', sub: 'Share of revenue', items: breakdown(new Map(rows.slice(0, 5).map((r) => [r.name, r.revenue])), rev), format: 'pct' } };
  }
  if (id === 'online-orders-report') {
    const rows = inP(d.onlineOrders, 'date'); const live = rows.filter((o) => o.status !== 'Cancelled'); const tot = sumTotal(live);
    return { stats: [
      { label: 'Online revenue', value: tot, kind: 'money', sub: `${pctChange(tot, sumTotal(inP(d.onlineOrders, 'date', prev).filter((o) => o.status !== 'Cancelled')))} vs previous period` },
      { label: 'Orders', value: rows.length, sub: 'All channels' }, { label: 'Average order', value: live.length ? round2(tot / live.length) : 0, kind: 'money', sub: 'Excluding cancelled' },
      { label: 'Cancelled', value: rows.length - live.length, sub: 'Orders cancelled' }],
      series: { title: 'Orders by period', tag: 'Revenue', items: bucketSeries(live, (o) => o.date, (o) => o.total, range), money: true },
      breakdown: { title: 'Breakdown', sub: 'By channel', items: breakdown(groupSum(live, (o) => o.channel, (o) => o.total), tot), format: 'pct' } };
  }
  if (id === 'purchasing-report') {
    const rows = inP(d.purchaseOrders, 'createdAt'); const tot = sumTotal(rows);
    return { stats: [
      { label: 'Purchase value', value: tot, kind: 'money', sub: `${rows.length} purchase orders` }, { label: 'Open orders', value: rows.filter((p) => !['Received', 'Cancelled'].includes(p.status)).length, sub: 'Awaiting delivery' },
      { label: 'Units ordered', value: rows.reduce((s, p) => s + Number(p.items || 0), 0), sub: 'Across all orders' }, { label: 'Suppliers used', value: new Set(rows.map((p) => p.supplier)).size, sub: 'In this period' }],
      series: { title: 'Purchases by period', tag: 'MVR', items: bucketSeries(rows, (p) => p.createdAt, (p) => p.total, range), money: true },
      breakdown: { title: 'Breakdown', sub: 'By supplier', items: breakdown(groupSum(rows, (p) => p.supplier, (p) => p.total), tot), format: 'pct' } };
  }
  if (id === 'loyalty-report') {
    const cs = d.customers; const pts = cs.reduce((s, c) => s + Number(c.loyalty || 0), 0);
    const tier = (c) => (c.loyalty >= 350 ? 'Gold' : c.loyalty >= 150 ? 'Silver' : 'Member');
    return { stats: [
      { label: 'Members', value: cs.length, sub: 'Registered customers' }, { label: 'Points outstanding', value: pts, sub: `${money0(pts / 100 * Number(state.settings.redemptionValue || 0))} redeemable` },
      { label: 'Average visits', value: cs.length ? round2(cs.reduce((s, c) => s + Number(c.visits || 0), 0) / cs.length) : 0, sub: 'Per customer' }, { label: 'Gold members', value: cs.filter((c) => tier(c) === 'Gold').length, sub: '350+ points' }],
      series: { title: 'Points by customer', tag: 'Points', items: [...cs].sort((a, b) => b.loyalty - a.loyalty).slice(0, 8).map((c) => ({ label: c.name.split(' ')[0], value: Number(c.loyalty) })) },
      breakdown: { title: 'Breakdown', sub: 'By tier', items: breakdown(groupSum(cs, tier, () => 1), cs.length), format: 'count' } };
  }
  if (id === 'gift-card-report') {
    const gs = d.giftCards; const issued = sumBy(gs, (g) => g.value ?? g.balance); const bal = sumBy(gs.filter((g) => g.status === 'Active'), (g) => g.balance);
    return { stats: [
      { label: 'Cards issued', value: gs.length, sub: 'All time' }, { label: 'Value issued', value: issued, kind: 'money', sub: 'Initial value' },
      { label: 'Outstanding balance', value: bal, kind: 'money', sub: 'On active cards' }, { label: 'Redeemed', value: round2(issued - bal), kind: 'money', sub: 'Used or expired value' }],
      series: { title: 'Issued by period', tag: 'MVR', items: bucketSeries(inP(gs, 'issuedAt'), (g) => g.issuedAt, (g) => g.value ?? g.balance, range), money: true },
      breakdown: { title: 'Breakdown', sub: 'By status', items: breakdown(groupSum(gs, (g) => g.status, () => 1), gs.length), format: 'count' } };
  }
  const rows = inP(d.expenses, 'date').filter((e) => e.status !== 'Rejected'); const tot = sumBy(rows, (e) => e.amount);
  const prevTot = sumBy(inP(d.expenses, 'date', prev).filter((e) => e.status !== 'Rejected'), (e) => e.amount);
  return { stats: [
    { label: 'Total spend', value: tot, kind: 'money', sub: `${pctChange(tot, prevTot)} vs previous period` }, { label: 'Expense items', value: rows.length, sub: 'Excluding rejected' },
    { label: 'Largest expense', value: rows.length ? Math.max(...rows.map((e) => e.amount)) : 0, kind: 'money', sub: 'Single item' }, { label: 'Awaiting review', value: d.expenses.filter((e) => e.status === 'Review').length, sub: 'Needs approval' }],
    series: { title: 'Spend by period', tag: 'MVR', items: bucketSeries(rows, (e) => e.date, (e) => e.amount, range), money: true },
    breakdown: { title: 'Breakdown', sub: 'By category', items: breakdown(groupSum(rows, (e) => e.category, (e) => e.amount), tot), format: 'pct' } };
}
const money0 = (v) => `MVR ${Math.round(v).toLocaleString('en-US')}`;

/* ---------- analytics ---------- */
export function analytics() {
  const range = periodRange(state.period); const prev = prevRange(range);
  const sales = billsIn(range).filter(isSale); const prevSales = billsIn(prev).filter(isSale);
  const net = sumTotal(sales); const units = sales.reduce((s, b) => s + b.items, 0);
  const byCustomer = groupSum(sales.filter((b) => b.customer !== 'Walk-in customer'), (b) => b.customer, () => 1);
  const repeat = byCustomer.size ? Math.round([...byCustomer.values()].filter((n) => n > 1).length / byCustomer.size * 1000) / 10 : 0;
  const onHand = state.data.products.reduce((s, p) => s + Number(p.stockQty || 0), 0);
  const online = ordersIn(range).filter((o) => o.status !== 'Cancelled'); const onlineTotal = sumTotal(online);
  const channels = new Map([['In store', net]]); online.forEach((o) => channels.set(o.channel, (channels.get(o.channel) || 0) + o.total));
  const all = net + onlineTotal;
  return {
    net, netChange: pctChange(net, sumTotal(prevSales)), average: sales.length ? round2(net / sales.length) : 0, basket: sales.length ? round2(units / sales.length) : 0,
    repeat, sellThrough: units + onHand ? Math.round(units / (units + onHand) * 1000) / 10 : 0,
    momentum: salesSeries(range, 'sales'), performers: productPerformance(range).slice(0, 4), channels: breakdown(channels, all),
  };
}

/* ---------- notifications ---------- */
export function notifications() {
  const d = state.data; const list = [];
  const out = d.products.filter((p) => Number(p.stockQty) <= 0).length; const low = d.products.filter((p) => Number(p.stockQty) > 0 && Number(p.stockQty) <= Number(state.settings.lowStockThreshold)).length;
  if (out) list.push({ id: 'out', tone: 'red', title: `${out} product${out > 1 ? 's' : ''} out of stock`, detail: 'Reorder to avoid missed sales', view: 'inventory' });
  if (low) list.push({ id: 'low', tone: 'amber', title: `${low} product${low > 1 ? 's' : ''} running low`, detail: `At or below ${state.settings.lowStockThreshold} units`, view: 'inventory' });
  const rev = d.onlinePayments.filter((p) => p.status === 'Review').length;
  if (rev) list.push({ id: 'pay', tone: 'blue', title: `${rev} online payment${rev > 1 ? 's' : ''} to review`, detail: 'Approve or reject the transfer', view: 'online-payments' });
  const ship = d.onlineOrders.filter((o) => o.status === 'Ready to ship').length;
  if (ship) list.push({ id: 'ship', tone: 'green', title: `${ship} online order${ship > 1 ? 's' : ''} ready to ship`, detail: 'Mark as completed once sent', view: 'online-orders' });
  const soon = d.quotations.filter((q) => q.status === 'Open' && q.expires && q.expires - Date.now() < 3 * DAY).length;
  if (soon) list.push({ id: 'quote', tone: 'amber', title: `${soon} quotation${soon > 1 ? 's' : ''} expiring soon`, detail: 'Follow up or convert to a sale', view: 'quotations' });
  const exp = d.expenses.filter((e) => e.status === 'Review').length;
  if (exp) list.push({ id: 'exp', tone: 'amber', title: `${exp} expense${exp > 1 ? 's' : ''} awaiting approval`, detail: 'Review in Expenses', view: 'expenses' });
  const pend = d.bills.filter((b) => b.status === 'Pending').length;
  if (pend) list.push({ id: 'credit', tone: 'blue', title: `${pend} unpaid credit bill${pend > 1 ? 's' : ''}`, detail: 'Mark paid when settled', view: 'bill-history' });
  if (!d.sessions.some((s) => s.status === 'Open')) list.push({ id: 'reg', tone: 'red', title: 'Register is closed', detail: 'Open a session to start selling', view: 'register' });
  (d.activity || []).slice(0, 4).forEach((a, i) => list.push({ id: `act-${a.ts}-${i}`, tone: a.tone || 'blue', title: a.text, detail: fmtDate(a.ts), view: a.view, activity: true }));
  return list;
}
export const notificationSignature = () => notifications().map((n) => n.id).join('|');

/* ---------- global search ---------- */
export function globalSearch(query) {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const d = state.data; const hits = [];
  const test = (...vals) => vals.some((v) => String(v ?? '').toLowerCase().includes(q));
  d.products.forEach((p, i) => { if (test(p.name, p.sku, p.category)) hits.push({ label: p.name, sub: `Product · ${p.sku}`, view: 'products', key: 'products', index: i }); });
  d.customers.forEach((c, i) => { if (test(c.name, c.mobile, c.email)) hits.push({ label: c.name, sub: `Customer · ${c.mobile || c.email || ''}`, view: 'customers', key: 'customers', index: i }); });
  d.bills.forEach((b, i) => { if (hits.length < 30 && test(b.id, b.customer)) hits.push({ label: b.id, sub: `Bill · ${b.customer}`, view: 'bill-history', key: 'bills', index: i }); });
  d.onlineOrders.forEach((o, i) => { if (test(o.id, o.customer)) hits.push({ label: o.id, sub: `Online order · ${o.customer}`, view: 'online-orders', key: 'onlineOrders', index: i }); });
  d.suppliers.forEach((s, i) => { if (test(s.name, s.contact)) hits.push({ label: s.name, sub: 'Supplier', view: 'suppliers', key: 'suppliers', index: i }); });
  d.purchaseOrders.forEach((p, i) => { if (test(p.id, p.supplier)) hits.push({ label: p.id, sub: `Purchase order · ${p.supplier}`, view: 'purchase-orders', key: 'purchaseOrders', index: i }); });
  d.quotations.forEach((x, i) => { if (test(x.id, x.customer)) hits.push({ label: x.id, sub: `Quotation · ${x.customer}`, view: 'quotations', key: 'quotations', index: i }); });
  return hits.slice(0, 9);
}

export { startOfDay };
