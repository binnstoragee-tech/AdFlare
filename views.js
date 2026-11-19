import { navGroups, pageMeta, reportCards, settingsFields, settingsSections } from '../data/demo.js';
import { state, money, moneyShort, signed, statusClass, openSession, outletMatches, productStatus } from './core.js';
import { svgIcon } from './icons.js';
import { esc, fmtDate, fmtTime, periodRange, PERIODS, TABLE_PERIODS, inRange, toInputDate, round2, num } from './util.js';
import { OUTLETS, DATE_COLS, DATE_ONLY, MONEY_COLS, STATUS_OPTIONS, CREATE_LABEL } from './config.js';
import { homeMetrics, salesSeries, getRows, DATE_FIELD, reportData, REPORT_SOURCE, analytics, sessionStats, notifications, notificationSignature, globalSearch, isSale, billsIn } from './selectors.js';
import { cartTotals, paymentMethods } from './actions.js';

const OUTLET_CHOICES = ['All branches', ...OUTLETS];

/* ====================== chrome ====================== */
export function renderSidebar() {
  const d = state.data; const session = openSession();
  const reviewCount = d.onlinePayments.filter((p) => p.status === 'Review').length;
  const nav = navGroups.map((group) => `
    <div class="nav-group"><div class="nav-label">${esc(group.label)}</div>
      ${group.items.map((item) => `<button class="nav-item ${state.view === item.id ? 'active' : ''}" type="button" data-view="${item.id}" aria-current="${state.view === item.id ? 'page' : 'false'}">${svgIcon(item.icon, 17)}<span>${esc(item.label)}</span>${item.id === 'online-payments' && reviewCount ? `<i class="nav-count">${reviewCount}</i>` : ''}</button>`).join('')}
    </div>`).join('');
  const company = esc(state.settings.storeName || 'Adflare Market');
      const isAll = state.outlet === 'All branches';
      const mainTitle = isAll ? company : esc(state.outlet);
      const sub = isAll ? 'All branches' : company;
  return `
    <aside class="sidebar">
      <div class="sidebar-head"><div class="brand-lockup"><img src="/img/favicon.png" alt="" /><span>adflare<small>POINT OF SALE</small></span></div><button class="icon-btn sidebar-close" type="button" data-action="close-nav" aria-label="Close navigation">${svgIcon('close', 19)}</button></div>
      <div class="outlet-switch-wrap"><button class="outlet-switch" type="button" data-action="outlet-menu" aria-expanded="${Boolean(state.outletMenuOpen)}"><span class="outlet-mark">AF</span><span class="outlet-info"><b>${mainTitle}</b><small>${sub}</small></span>${svgIcon('chevron', 15)}</button>${state.outletMenuOpen ? `<div class="outlet-menu" role="menu" aria-label="Choose branch">${OUTLET_CHOICES.map((o) => `<button type="button" role="menuitemradio" aria-checked="${state.outlet === o}" data-outlet-choice="${esc(o)}">${o === 'All branches' ? `<span class=\"outlet-opt\"><b>${company}</b><small>All branches</small></span>` : esc(o)}${state.outlet === o ? svgIcon('check', 14) : ''}</button>`).join('')}</div>` : ''}</div>
      <nav class="side-nav" aria-label="Main navigation">${nav}</nav>
      <div class="sidebar-footer">
        <div class="register-status"><span class="status-dot ${session ? 'green' : 'gray'}"></span><span><b>${session ? 'Register open' : 'Register closed'}</b><small>${session ? `${esc(session.register)} · ${esc(session.id.replace('SES-00', 'Session '))}` : 'No active session'}</small></span><button type="button" class="mini-action" data-view="register" aria-label="Manage register">${svgIcon('chevron', 15)}</button></div>
        <div class="sidebar-profile"><div class="avatar">AF</div><span><b>Adflare Owner</b><small>Demo workspace</small></span><button class="mini-action" type="button" data-action="profile-menu" aria-label="Profile options">${svgIcon('dots', 18)}</button></div>
      </div>
    </aside>`;
}

export function renderTopbar(meta) {
  const sig = notificationSignature(); const unseen = sig && sig !== state.notifSeen;
  const hits = state.gq.trim().length >= 2 ? globalSearch(state.gq) : null;
  return `
    <header class="topbar">
      <div class="topbar-left"><button class="icon-btn menu-toggle" type="button" data-action="toggle-nav" aria-label="Open navigation">${svgIcon('menu', 20)}</button><div class="breadcrumbs"><span>Adflare POS</span>${svgIcon('chevron', 14)}<b>${esc(meta.title)}</b></div></div>
      <div class="topbar-actions">
        <div class="gs-wrap"><label class="global-search">${svgIcon('search', 17)}<input type="search" data-global-search placeholder="Search everything" value="${esc(state.gq)}" aria-label="Search products, customers, bills and orders" autocomplete="off" /><kbd>⌘ K</kbd></label>${hits ? `<div class="gs-results" role="listbox">${hits.length ? hits.map((h) => `<button type="button" role="option" data-action="gs-open" data-view="${h.view}" data-key="${h.key}" data-index="${h.index}"><b>${esc(h.label)}</b><small>${esc(h.sub)}</small></button>`).join('') : '<div class="gs-empty">No matches found.</div>'}</div>` : ''}</div>
        <span class="topbar-divider"></span>
        <span class="sample-pill"><i></i> Demo mode</span>
        <div class="pop-anchor"><button class="icon-btn notification-btn" type="button" data-action="notifications" aria-label="Notifications" aria-expanded="${state.popover === 'notif'}">${svgIcon('bell', 18)}${unseen ? '<i></i>' : ''}</button>${state.popover === 'notif' ? renderNotifPop() : ''}</div>
        <div class="pop-anchor"><button class="top-avatar" type="button" data-action="profile-menu" aria-label="Open profile menu" aria-expanded="${state.popover === 'profile'}">AF</button>${state.popover === 'profile' ? renderProfilePop() : ''}</div>
        <button class="icon-btn" type="button" data-action="logout" aria-label="Exit demo" title="Exit demo">${svgIcon('logout', 16)}</button>
      </div>
    </header>`;
}

function renderNotifPop() {
  const list = notifications();
  return `<div class="pop pop-notif" role="dialog" aria-label="Notifications"><div class="pop-head"><b>Notifications</b><button type="button" class="text-action" data-action="mark-seen">Mark all read</button></div><div class="pop-list">${list.length ? list.map((n) => `<button type="button" class="pop-item" ${n.view ? `data-view="${n.view}"` : 'data-action="close-pop"'}><i class="activity-dot ${esc(n.tone)}"></i><span><b>${esc(n.title)}</b><small>${esc(n.detail)}</small></span></button>`).join('') : '<div class="pop-empty">You&rsquo;re all caught up.</div>'}</div></div>`;
}
function renderProfilePop() {
  return `<div class="pop pop-profile" role="menu"><div class="pop-user"><span class="avatar">AF</span><span><b>Adflare Owner</b><small>${esc(state.settings.email || 'owner@adflare.test')}</small></span></div>
    <button type="button" role="menuitem" data-view="admin">${svgIcon('settings', 16)} Store settings</button>
    <button type="button" role="menuitem" data-action="export-all">${svgIcon('download', 16)} Export all data (JSON)</button>
    <button type="button" role="menuitem" data-action="reset-data">${svgIcon('refresh', 16)} Reset demo data</button>
    <button type="button" role="menuitem" data-action="logout">${svgIcon('logout', 16)} Exit demo</button></div>`;
}

export function renderNotice() {
  return `<div class="preview-notice">${svgIcon('info', 17)}<div><b>Demo mode — fully working, no database needed</b><span>Everything you add or change is saved in this browser only. Nothing is sent to Supabase yet.</span></div><button type="button" class="notice-link" data-action="reset-data">Reset data</button></div>`;
}

export function pageHeading(meta, action = '') {
  return `<div class="page-heading"><div><div class="eyebrow">${esc(state.view === 'home' ? 'OVERVIEW' : 'ADFLARE POS')}</div><h1>${esc(meta.title)}</h1><p>${esc(meta.subtitle)}</p></div><div class="heading-actions">${action}</div></div>`;
}

const periodSelect = (options = PERIODS) => `<label class="select-wrap">${svgIcon('calendar', 16)}<select data-home-filter="period" aria-label="Reporting period">${options.map((p) => `<option ${state.period === p ? 'selected' : ''}>${p}</option>`).join('')}</select></label>`;
const outletSelect = () => `<label class="select-wrap">${svgIcon('filter', 16)}<select data-home-filter="outlet" aria-label="Branch">${OUTLET_CHOICES.map((o) => `<option ${state.outlet === o ? 'selected' : ''}>${o}</option>`).join('')}</select></label>`;

/* ====================== charts ====================== */
function niceMax(v) { if (v <= 0) return 3; const unit = 10 ** Math.floor(Math.log10(v / 3)); return Math.ceil(v / (3 * unit)) * 3 * unit; }
const thin = (items, max = 8) => { const step = Math.ceil(items.length / max); return items.map((x, i) => (i % step === 0 ? x : '')); };

function lineChart(series, isMoney) {
  const n = series.length; const max = niceMax(Math.max(0, ...series.map((p) => p.value)));
  const fmt = (v) => (isMoney ? moneyShort(v) : String(Math.round(v)));
  const x = (i) => (n === 1 ? 192 : 20 + i * (344 / (n - 1)));
  const y = (v) => 158 - (v / max) * 112;
  const pts = series.map((p, i) => `${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const labels = thin(series.map((p) => p.label));
  const ticks = [max, (max * 2) / 3, max / 3, 0];
  return `<div class="chart-area"><div class="chart-y">${ticks.map((t) => `<span>${t ? fmt(t) : '0'}</span>`).join('')}</div><div class="chart-plot"><div class="chart-grid-lines"><i></i><i></i><i></i><i></i></div>
    <svg viewBox="0 0 384 168" preserveAspectRatio="none" role="img" aria-label="Trend chart"><defs><linearGradient id="salesFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#ed2939" stop-opacity=".18"/><stop offset="100%" stop-color="#ed2939" stop-opacity="0"/></linearGradient></defs>
    <polygon points="${pts} ${x(n - 1).toFixed(1)},168 ${x(0).toFixed(1)},168" fill="url(#salesFill)"/><polyline points="${pts}" fill="none" stroke="#ed2939" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
    ${n <= 14 ? series.map((p, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(p.value).toFixed(1)}" r="4" fill="#fff" stroke="#ed2939" stroke-width="2" vector-effect="non-scaling-stroke"><title>${esc(p.label)}: ${isMoney ? money(p.value) : p.value}</title></circle>`).join('') : ''}</svg>
    <div class="chart-x" style="display:grid;grid-template-columns:repeat(${n},minmax(0,1fr))">${labels.map((l) => `<span style="text-align:center;overflow:visible;white-space:nowrap">${esc(l)}</span>`).join('')}</div></div></div>`;
}
function barChart(series) {
  const max = Math.max(1, ...series.map((p) => p.value)); const labels = thin(series.map((p) => p.label), 10);
  return `<div class="bar-chart">${series.map((p, i) => `<div class="bar-col" title="${esc(p.label)}: ${p.value}"><div class="bar-wrap"><i style="height:${Math.max(p.value ? 4 : 0, Math.round((p.value / max) * 100))}%"></i></div><span>${esc(labels[i])}</span></div>`).join('')}</div>`;
}

/* ====================== home ====================== */
export function renderHome(meta) {
  const m = homeMetrics(); const range = m.range;
  const sel = state.chartMetric; const isMoney = sel !== 'count';
  const main = salesSeries(range, sel); const counts = salesSeries(range, 'count');
  const total = counts.reduce((s, p) => s + p.value, 0);
  const days = Math.max(1, Math.round((Math.min(range.end, Date.now() + 864e5) - range.start) / 864e5));
  const pos = (c) => (String(c).startsWith('+') ? 'positive' : 'neutral');
  const cards = [
    ['Net sales', money(m.net), m.netChange, 'coins', 'red', 'vs. previous period', 'bill-history'],
    ['Sales count', String(m.count), m.countChange, 'receipt', 'blue', 'vs. previous period', 'bill-history'],
    ['Month to date', money(m.mtd), m.mtdChange, 'chart', 'violet', 'vs. last month', 'sales-report'],
    ['Outstanding', money(m.outstanding), `${m.owingCount} accounts`, 'wallet', 'amber', 'customer balances', 'customers'],
    ['Customers', m.customers.toLocaleString(), `+${m.joined}`, 'users', 'green', 'joined this month', 'customers'],
    ['Products sold', m.units.toLocaleString(), m.unitsChange, 'box', 'slate', 'vs. previous period', 'order-products'],
    ['Refunds', money(m.refundAmount), `${m.refundCount} bills`, 'refresh', 'orange', state.period.toLowerCase(), 'bill-history', 'Refunded'],
    ['Voids', String(m.voidCount), money(m.voidAmount), 'close', 'rose', state.period.toLowerCase(), 'bill-history', 'Voided'],
  ];
  const recent = state.data.bills.filter(outletMatches).slice(0, 4);
  const low = state.data.products.filter((p) => num(p.stockQty) <= num(state.settings.lowStockThreshold)).slice(0, 4);
  const ml = { sales: 'Net sales', count: 'Transactions', average: 'Average sale' };
  const chartTitle = { sales: 'Net sales', count: 'Transactions', average: 'Average sale' }[sel];
  return `${pageHeading(meta, `${outletSelect()}${periodSelect()}`)}
    <section class="brand-banner"><div class="banner-content"><span class="banner-tag">ADFLARE · SMARTER OPERATIONS</span><h2>Make every shift count.</h2><p>One clear view for your sales, inventory and customers.</p><button class="banner-button" type="button" data-view="analytics">Explore analytics ${svgIcon('arrow', 15)}</button></div><div class="banner-art" aria-hidden="true"><div class="banner-ring ring-one"></div><div class="banner-ring ring-two"></div><div class="banner-card"><span class="spark">✦</span><b>AF</b><small>ADFLARE</small></div><div class="banner-line line-one"></div><div class="banner-line line-two"></div></div></section>
    <section class="metric-grid" aria-label="Sales metrics">${cards.map(([label, value, change, icon, tone, note, view, status]) => `<article class="metric-card"><div class="metric-top"><span class="metric-icon tone-${tone}">${svgIcon(icon, 17)}</span><button class="metric-more" type="button" data-view="${view}" ${status ? `data-status="${status}"` : ''} aria-label="Open ${esc(label)} details">${svgIcon('arrow', 16)}</button></div><span class="metric-label">${esc(label)}</span><strong>${esc(value)}</strong><div class="metric-foot"><span class="metric-change ${tone === 'amber' || tone === 'rose' || tone === 'orange' ? 'neutral' : pos(change)}">${esc(change)}</span><span>${esc(note)}</span></div></article>`).join('')}</section>
    <section class="content-grid home-grid">
      <article class="card sales-chart-card"><div class="card-head"><div><h2>${chartTitle}</h2><p>${esc(state.period)} · ${esc(state.outlet)}</p></div><label class="select-plain"><select data-chart-metric aria-label="Chart metric" style="border:0;background:transparent;font:inherit;color:inherit;cursor:pointer">${Object.entries(ml).map(([k, v]) => `<option value="${k}" ${sel === k ? 'selected' : ''}>${v}</option>`).join('')}</select></label></div><div class="chart-legend"><span><i class="legend-dot red"></i> ${chartTitle}</span></div>${lineChart(main, isMoney)}</article>
      <article class="card sales-count-card"><div class="card-head"><div><h2>Sales count</h2><p>Transactions · ${esc(state.period)}</p></div><span class="count-total">${total.toLocaleString()} <small>total</small></span></div>${barChart(counts)}<div class="count-summary"><span>Average per day</span><b>${total ? Math.max(1, Math.round(total / days)) : 0} bills</b></div></article>
      <article class="card recent-card"><div class="card-head"><div><h2>Recent bills</h2><p>Latest transactions</p></div><button type="button" class="text-action" data-view="bill-history">View all ${svgIcon('arrow', 15)}</button></div><div class="mini-table">${recent.map((b) => `<button type="button" class="mini-row mini-click" data-action="detail" data-key="bills" data-index="${state.data.bills.indexOf(b)}"><span class="mini-avatar">${esc(b.customer.split(' ').map((x) => x[0]).slice(0, 2).join(''))}</span><span class="mini-person"><b>${esc(b.customer)}</b><small>${esc(b.id)} · ${esc(fmtDate(b.date))}</small></span><span class="mini-amount">${money(b.total)}</span><span class="status-pill ${statusClass(b.status)}">${esc(b.status)}</span></button>`).join('') || '<div class="empty-state">No bills yet.</div>'}</div></article>
      <article class="card low-stock-card"><div class="card-head"><div><h2>Stock to review</h2><p>Items running low or out</p></div><button type="button" class="text-action" data-view="inventory">Inventory ${svgIcon('arrow', 15)}</button></div><div class="stock-alert-list">${low.map((p) => `<button type="button" class="stock-alert-row mini-click" data-action="detail" data-key="products" data-index="${state.data.products.indexOf(p)}"><span class="product-thumb">${svgIcon('box', 18)}</span><span class="stock-product"><b>${esc(p.name)}</b><small>${esc(p.sku)} · ${esc(p.category)}</small></span><span class="stock-qty ${num(p.stockQty) === 0 ? 'out' : ''}">${num(p.stockQty) === 0 ? 'Out' : `${esc(p.stockQty)} left`}</span></button>`).join('') || '<div class="empty-state">Stock levels look healthy.</div>'}</div></article>
    </section>`;
}

/* ====================== sell ====================== */
export function renderSell(meta) {
  const s = state.settings; const session = openSession();
  const q = state.productQuery.toLowerCase();
  const track = s.trackStock !== false && !s.allowNegativeStock;
  const products = state.data.products.filter((p) => p.status !== 'Archived' && `${p.name} ${p.category} ${p.sku}`.toLowerCase().includes(q) && (state.productCategory === 'all' || p.category === state.productCategory) && (!state.inStockOnly || num(p.stockQty) > 0));
  const cats = state.data.categories.filter((c) => c.status !== 'Archived').map((c) => c.name);
  return `${pageHeading(meta, `<button type="button" class="btn btn-secondary" data-view="bill-history">${svgIcon('receipt', 16)} Bill history</button>`)}
    <div class="pos-layout">
      <section class="card catalog-panel"><div class="catalog-toolbar"><label class="catalog-search">${svgIcon('search', 17)}<input type="search" data-product-search placeholder="Scan barcode or search products" value="${esc(state.productQuery)}" /></label><button type="button" class="icon-btn filter-button ${state.inStockOnly ? 'active' : ''}" data-action="product-filter" aria-pressed="${state.inStockOnly}" aria-label="Show in-stock products only" title="In-stock only">${svgIcon('filter', 17)}</button></div>
      <div class="category-chips"><button class="chip ${state.productCategory === 'all' ? 'active' : ''}" type="button" data-category="all">All items</button>${cats.map((c) => `<button class="chip ${state.productCategory === c ? 'active' : ''}" type="button" data-category="${esc(c)}">${esc(c)}</button>`).join('')}</div>
      <div class="product-grid">${renderProductTiles(products, track)}</div></section>
      ${renderCartPanel(session)}
    </div>`;
}
export function renderProductTiles(products, track) {
  return products.map((p) => { const out = track && num(p.stockQty) <= 0; return `<article class="product-tile ${out ? 'is-out' : ''}"><div class="product-tile-art">${svgIcon('box', 25)}<span class="product-category">${esc(p.category)}</span></div><div class="product-tile-info"><b>${esc(p.name)}</b><small>${esc(p.sku)} · ${out ? 'Out of stock' : `${esc(p.stockQty)} in stock`}</small><div><strong>${money(p.price)}</strong><button type="button" class="add-product" data-action="add-cart" data-id="${esc(p.sku)}" aria-label="Add ${esc(p.name)}" ${out ? 'disabled' : ''}>${svgIcon('plus', 17)}</button></div></div></article>`; }).join('') || '<div class="empty-state">No matching products.</div>';
}
export function renderCartPanel(session = openSession()) {
  const t = cartTotals(); const s = state.settings; const cust = t.customer;
  const canRedeem = s.enabled !== false && cust && num(cust.loyalty) >= 100 && num(s.redemptionValue) > 0;
  return `<aside class="card cart-panel"><div class="cart-head"><div><h2>Current sale</h2><p>${t.units} ${t.units === 1 ? 'item' : 'items'} in cart${state.cartQuote ? ` · from ${esc(state.cartQuote)}` : ''}</p></div><button class="icon-btn" type="button" data-action="clear-cart" aria-label="Clear cart" title="Clear cart">${svgIcon('trash', 17)}</button></div>
    <div class="cart-register"><span class="status-dot ${session ? 'green' : 'gray'}"></span><span><b>${session ? esc(session.register) : 'Register closed'}</b><small>${session ? `Session ${esc(session.id)}` : 'Open a register to begin'}</small></span><button type="button" class="text-action" ${session ? 'data-view="register"' : 'data-action="open-register-modal"'}>${session ? 'Manage' : 'Open'}</button></div>
    <label class="customer-select"><span>Customer</span><select id="cart-customer" data-cart-customer><option ${state.cartCustomer === 'Walk-in customer' ? 'selected' : ''}>Walk-in customer</option>${state.data.customers.filter((c) => c.status !== 'Blocked').map((c) => `<option ${state.cartCustomer === c.name ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select></label>
    <div class="cart-lines">${state.cart.length ? state.cart.map((l) => `<div class="cart-line"><span class="cart-line-thumb">${svgIcon('box', 16)}</span><span class="cart-line-name"><b>${esc(l.name)}</b><small>${money(l.price)} each</small></span><span class="qty-stepper"><button type="button" data-action="qty-down" data-id="${esc(l.sku ?? '')}" data-name="${esc(l.name)}" aria-label="Decrease quantity">−</button><b>${l.quantity}</b><button type="button" data-action="qty-up" data-id="${esc(l.sku ?? '')}" data-name="${esc(l.name)}" aria-label="Increase quantity">+</button></span><strong>${money(l.price * l.quantity)}</strong></div>`).join('') : `<div class="cart-empty"><span class="cart-empty-icon">${svgIcon('cart', 22)}</span><b>Your cart is empty</b><small>Tap + on a product to start a sale.</small></div>`}</div>
    <div class="cart-discount"><label><span>Discount</span><input type="number" min="0" step="any" data-cart-discount placeholder="0" value="${esc(state.cartDiscount)}" /></label><select data-cart-discount-type aria-label="Discount type"><option value="amount" ${state.cartDiscountType === 'amount' ? 'selected' : ''}>MVR</option><option value="percent" ${state.cartDiscountType === 'percent' ? 'selected' : ''}>%</option></select></div>
    ${canRedeem ? `<label class="cart-redeem"><input type="checkbox" data-cart-redeem ${state.redeemPoints ? 'checked' : ''} /><span>Redeem points <small>(${cust.loyalty} available)</small></span></label>` : ''}
    <div class="cart-summary"><div><span>Subtotal</span><b>${money(t.subtotal)}</b></div>${t.discount ? `<div><span>Discount</span><b>−${money(t.discount)}</b></div>` : ''}${t.redeem ? `<div><span>Points redeemed (${t.pointsUsed})</span><b>−${money(t.redeem)}</b></div>` : ''}${t.service ? `<div><span>Service fee (${s.serviceFee}%)</span><b>${money(t.service)}</b></div>` : ''}<div><span>${s.pricesIncludeTax ? 'Tax included' : 'Tax'} (${s.taxRate}%)</span><b>${money(t.tax)}</b></div><div class="cart-total"><span>Total</span><strong>${money(t.total)}</strong></div></div>
    <button class="btn btn-primary btn-wide checkout-button" type="button" data-action="checkout" ${!state.cart.length ? 'disabled' : ''}>${svgIcon('card', 17)} Checkout <span>${money(t.total)}</span></button>
    <button class="btn btn-secondary btn-wide" type="button" data-action="save-quote" ${!state.cart.length ? 'disabled' : ''}>${svgIcon('quote', 16)} Save as quotation</button>
    <p class="cart-footnote">${t.earned ? `Earns ${t.earned} loyalty points · ` : ''}Demo sale · no real payment is processed</p></aside>`;
}

/* ====================== register ====================== */
export function renderRegister(meta) {
  const open = openSession(); const last = state.data.sessions.find((s) => s.status === 'Closed');
  const s = open || last; const st = s ? sessionStats(s) : null;
  const acts = [];
  if (s) {
    (s.activity || []).forEach((a) => acts.push({ ts: a.ts, title: a.text, sub: fmtTime(a.ts), amount: a.amount != null ? money(a.amount) : '—', tone: a.tone || 'blue' }));
    state.data.bills.filter((b) => b.sessionId === s.id).slice(0, 5).forEach((b) => acts.push({ ts: b.date, title: `Sale ${b.status === 'Completed' || b.status === 'Pending' ? 'completed' : b.status.toLowerCase()}`, sub: `${b.id} · ${fmtTime(b.date)}`, amount: money(b.total), tone: 'red' }));
    acts.sort((a, b) => b.ts - a.ts);
  }
  const buttons = open ? `<button class="btn btn-secondary" type="button" data-action="cash-move-modal">${svgIcon('cash', 16)} Cash in / out</button><button class="btn btn-primary" type="button" data-action="close-register-modal">Close register</button>` : `<button class="btn btn-primary" type="button" data-action="open-register-modal">Open register</button>`;
  return `${pageHeading(meta, buttons)}
    <section class="register-summary-grid"><article class="card register-main-card"><div class="register-hero"><span class="register-icon">${svgIcon('cash', 22)}</span><span class="status-pill ${open ? 'status-open' : 'status-closed'}"><i></i>${open ? 'Open' : 'Closed'}</span></div><h2>${esc(s?.register || 'Front counter')}</h2><p>${esc(s?.outlet || 'Main branch')} · ${open ? 'Active session' : 'Last session summary'}</p>
      <div class="register-meta"><div><span>${open ? 'Current session' : 'Last session'}</span><b>${esc(s?.id || 'None yet')}</b></div><div><span>Opened by</span><b>${esc(s?.openedBy || '—')}</b></div><div><span>Opening float</span><b>${s ? money(s.openingFloat) : '—'}</b></div><div><span>${open ? 'Started' : 'Closed'}</span><b>${s ? esc(fmtDate(open ? s.openedAt : s.closedAt)) : '—'}</b></div></div>
      <div class="register-note">${svgIcon('info', 16)} ${open ? 'Sales made on the Sell page are added to this session automatically.' : 'The register is closed. Open a session to start selling.'}</div></article>
      <article class="card register-stats"><h3>${open ? 'Shift snapshot' : 'Last shift'}</h3>${st ? `<div class="shift-stat"><span>Sales this shift (${st.count})</span><b>${money(st.sales)}</b></div><div class="shift-stat"><span>Cash payments</span><b>${money(st.cash)}</b></div><div class="shift-stat"><span>Card payments</span><b>${money(st.card)}</b></div><div class="shift-stat"><span>Other payments</span><b>${money(st.other)}</b></div>${num(s.cashIn) || num(s.cashOut) ? `<div class="shift-stat"><span>Cash in / out</span><b>${money(s.cashIn)} / ${money(s.cashOut)}</b></div>` : ''}<div class="shift-stat total"><span>${open ? 'Expected in drawer' : 'Counted in drawer'}</span><b>${money(open ? st.expected : s.counted)}</b></div>${!open && s.variance != null ? `<div class="shift-stat"><span>Variance</span><b>${signed(s.variance)}</b></div>` : ''}` : '<div class="empty-state">No sessions yet.</div>'}<button type="button" class="text-action" data-view="sessions">View session history ${svgIcon('arrow', 15)}</button></article></section>
    <section class="card register-lower"><div class="card-head"><div><h2>Register activity</h2><p>Recent actions in ${open ? 'the open' : 'the last'} session</p></div><button class="text-action" type="button" data-view="sessions">All sessions ${svgIcon('arrow', 15)}</button></div><div class="activity-list">${acts.slice(0, 6).map((a) => `<div><i class="activity-dot ${esc(a.tone)}"></i><span><b>${esc(a.title)}</b><small>${esc(a.sub)}</small></span><strong>${esc(a.amount)}</strong></div>`).join('') || '<div class="empty-state">No activity yet.</div>'}</div></section>`;
}

/* ====================== inventory ====================== */
export function renderInventory(meta) {
  const d = state.data; const th = num(state.settings.lowStockThreshold);
  const low = d.products.filter((p) => num(p.stockQty) <= th);
  const value = d.products.reduce((sum, p) => sum + num(p.price) * num(p.stockQty), 0);
  const pending = d.transfers.filter((t) => ['Draft', 'Approved', 'In transit'].includes(t.status)).length;
  return `${pageHeading(meta, `<button class="btn btn-secondary" type="button" data-action="export-products">${svgIcon('download', 16)} Export</button><button class="btn btn-primary" type="button" data-action="new-stock-count">${svgIcon('checklist', 16)} Start stock count</button>`)}
    <section class="inventory-kpis"><article class="card inventory-kpi"><span>Units on hand</span><strong>${d.products.reduce((s, p) => s + num(p.stockQty), 0).toLocaleString()}</strong><small>Across ${d.products.length} products</small></article><article class="card inventory-kpi"><span>Stock value</span><strong>${money(value)}</strong><small>Retail value, not cost</small></article><article class="card inventory-kpi"><span>Low stock</span><strong class="red-text">${low.length}</strong><small>At or below ${th} units</small></article><article class="card inventory-kpi"><span>Pending transfers</span><strong>${pending}</strong><small>Draft, approved or in transit</small></article></section>
    <section class="content-grid inventory-grid"><article class="card"><div class="card-head"><div><h2>Stock health</h2><p>Inventory by product</p></div><button class="text-action" type="button" data-view="products">View products ${svgIcon('arrow', 15)}</button></div><div class="stock-table">${d.products.slice(0, 8).map((p) => `<button type="button" class="stock-table-row mini-click" data-action="detail" data-key="products" data-index="${d.products.indexOf(p)}"><span class="product-thumb">${svgIcon('box', 17)}</span><span class="stock-product"><b>${esc(p.name)}</b><small>${esc(p.sku)} · ${esc(p.category)}</small></span><span class="stock-meter"><i style="width:${Math.min(100, num(p.stockQty) * 2)}%"></i></span><span class="stock-qty ${num(p.stockQty) <= th ? 'out' : ''}">${num(p.stockQty)} units</span><span class="status-pill ${statusClass(p.status)}">${esc(p.status)}</span></button>`).join('')}</div></article>
      <article class="card low-stock-side"><div class="card-head"><div><h2>Needs attention</h2><p>Reorder suggestions</p></div><span class="attention-count">${low.length}</span></div>${low.map((p) => `<div class="attention-row"><span class="attention-icon">${svgIcon('inventory', 17)}</span><span><b>${esc(p.name)}</b><small>${num(p.stockQty) === 0 ? 'Out of stock' : `Only ${esc(p.stockQty)} units left`}</small></span><button class="icon-btn" type="button" data-action="detail" data-key="products" data-index="${d.products.indexOf(p)}" aria-label="Open ${esc(p.name)}">${svgIcon('chevron', 15)}</button></div>`).join('') || '<div class="empty-state">No low-stock items.</div>'}<button class="btn btn-secondary btn-wide" type="button" data-view="purchase-orders">Review purchasing</button></article></section>
    <section class="inventory-links">${[['stock-counts', 'Stock counts', 'Count and reconcile inventory', 'checklist'], ['stock-transfers', 'Stock transfers', 'Move stock between branches', 'transfer'], ['suppliers', 'Suppliers', 'Manage vendor contacts', 'truck'], ['purchase-orders', 'Purchase orders', 'Create and approve orders', 'purchase'], ['receive-stock', 'Receive stock', 'Record deliveries', 'checklist']].map(([id, title, detail, ic]) => `<button class="card inventory-link" type="button" data-view="${id}"><span class="link-icon">${svgIcon(ic, 19)}</span><span><b>${title}</b><small>${detail}</small></span>${svgIcon('chevron', 16)}</button>`).join('')}</section>`;
}

/* ====================== receive stock ====================== */
export function renderReceive(meta) {
  const d = state.data;
  const open = d.purchaseOrders.filter((p) => ['Awaiting delivery', 'Part received'].includes(p.status));
  const chosen = open.find((p) => p.id === state.receivePo) || open[0];
  const remaining = chosen ? num(chosen.items) - num(chosen.receivedUnits) : 0;
  return `${pageHeading(meta, `<button class="btn btn-secondary" type="button" data-view="purchase-orders">${svgIcon('purchase', 16)} Purchase orders</button>`)}
    <section class="receive-layout"><form class="card receive-form" data-form="receive"><div class="card-head receive-head"><div><h2>Record a delivery</h2><p>Adds the delivered units to your stock.</p></div></div>
      <div class="receive-fields"><label class="form-field"><span>Purchase order <i>*</i></span><select name="purchaseOrder" data-receive-po required>${open.map((p) => `<option value="${esc(p.id)}" ${chosen && p.id === chosen.id ? 'selected' : ''}>${esc(p.id)} · ${esc(p.supplier)}</option>`).join('') || '<option value="" disabled selected>No open purchase orders</option>'}</select></label>
      <label class="form-field"><span>Product <i>*</i></span><select name="sku" required>${d.products.map((p) => `<option value="${esc(p.sku)}">${esc(p.name)} · ${esc(p.sku)}</option>`).join('')}</select></label>
      <label class="form-field"><span>Quantity received <i>*</i></span><input name="quantity" type="number" min="1" max="${remaining || ''}" step="1" value="1" required /></label>
      <label class="form-field"><span>Received on</span><input name="receivedAt" type="date" value="${toInputDate(Date.now())}" /></label>
      <label class="form-field span-two"><span>Delivery note</span><input name="note" type="text" placeholder="Optional reference" /></label></div>
      ${chosen ? `<div class="preview-callout">${svgIcon('info', 16)} ${esc(chosen.id)}: ${num(chosen.receivedUnits)} of ${num(chosen.items)} units received · <b>${remaining} still expected</b>.</div>` : ''}
      <button class="btn btn-primary" type="submit" ${open.length ? '' : 'disabled'}>${svgIcon('check', 16)} Record receipt</button></form>
      <section class="card receipt-history"><div class="card-head"><div><h2>Recent receipts</h2><p>Receiving activity</p></div><span class="chart-tag">${d.receipts.length} records</span></div><div class="receipt-list">${d.receipts.slice(0, 8).map((r) => `<article class="receipt-row"><span class="receipt-icon">${svgIcon('checklist', 17)}</span><span class="receipt-copy"><b>${esc(r.product)}</b><small>${esc(r.id)} · ${esc(r.purchaseOrder)}</small></span><span class="receipt-quantity">+${esc(r.quantity)}</span><span class="receipt-date">${esc(fmtDate(r.receivedAt, false))}</span></article>`).join('') || '<div class="empty-state">No receipts yet.</div>'}</div></section></section>`;
}

/* ====================== reports / analytics ====================== */
export function renderReports(meta) {
  return `${pageHeading(meta, '')}<section class="report-intro card"><div class="report-intro-mark">${svgIcon('report', 24)}</div><div><h2>Reports for a sharper view</h2><p>Pick a report to see live totals, charts and the rows behind them. Figures update as you sell.</p></div>${periodSelect()}</section><section class="report-card-grid">${reportCards.map((c) => `<button type="button" class="card report-card" data-view="${c.id}"><span class="report-icon accent-${c.accent}">${svgIcon(c.icon, 20)}</span><span class="report-card-copy"><b>${esc(c.label)} report</b><small>${esc(c.detail)}</small></span>${svgIcon('chevron', 16)}</button>`).join('')}</section>`;
}

export function renderReportDetail(meta) {
  const data = reportData(state.view); const src = REPORT_SOURCE[state.view];
  const items = data.series.items; const max = Math.max(1, ...items.map((i) => i.value)); const labels = thin(items.map((i) => i.label), 10);
  const fmtV = (v) => (data.series.money ? money(v) : v.toLocaleString());
  return `${pageHeading(meta, `<button class="btn btn-secondary" type="button" data-view="reports">${svgIcon('arrow', 16)} All reports</button><button class="btn btn-primary" type="button" data-action="export-report">${svgIcon('download', 16)} Export</button>`)}
    <div class="report-controls card">${periodSelect()}${outletSelect()}<span class="report-sample-note">${esc(state.period)} · ${esc(state.outlet)}</span></div>
    <section class="report-stats">${data.stats.map((x) => `<article class="card"><span>${esc(x.label)}</span><strong>${x.kind === 'money' ? money(x.value) : Number(x.value).toLocaleString()}</strong><small class="${String(x.sub).startsWith('+') ? 'positive' : ''}">${esc(x.sub)}</small></article>`).join('')}</section>
    <section class="content-grid report-detail-grid"><article class="card"><div class="card-head"><div><h2>${esc(data.series.title)}</h2><p>${esc(state.period)}</p></div><span class="chart-tag">${esc(data.series.tag)}</span></div><div class="report-bars">${items.length ? items.map((i, n) => `<div class="report-bar" title="${esc(i.label)}: ${esc(fmtV(i.value))}"><i style="height:${Math.max(i.value ? 3 : 0, Math.round(i.value / max * 100))}%"></i><span>${esc(labels[n])}</span></div>`).join('') : '<div class="empty-state">No data for this period.</div>'}</div></article>
      <article class="card"><div class="card-head"><div><h2>${esc(data.breakdown.title)}</h2><p>${esc(data.breakdown.sub)}</p></div></div><div class="payment-breakdown">${data.breakdown.items.map((b) => `<div><span><i class="payment-swatch ${b.color}"></i>${esc(b.label)}</span><b>${data.breakdown.format === 'count' ? `${b.value} · ${b.share}%` : `${b.share}%`}</b></div>`).join('') || '<div class="empty-state">Nothing to break down yet.</div>'}</div></article></section>
    ${renderTableCard(pageMeta[src.page], { dataKey: src.dataKey, report: true })}`;
}

export function renderAnalytics(meta) {
  const a = analytics(); const peak = Math.max(1, ...a.momentum.map((p) => p.value)); const labels = thin(a.momentum.map((p) => p.label), 10);
  return `${pageHeading(meta, `${outletSelect()}${periodSelect()}`)}<section class="analytics-kpis"><article class="card"><span>Gross merchandise value</span><strong>${money(a.net)}</strong><small class="${a.netChange.startsWith('+') ? 'positive' : ''}">${esc(a.netChange)} vs previous period</small></article><article class="card"><span>Average basket</span><strong>${money(a.average)}</strong><small>${a.basket} items per sale</small></article><article class="card"><span>Repeat customers</span><strong>${a.repeat}%</strong><small>Named customers with 2+ bills</small></article><article class="card"><span>Sell-through</span><strong>${a.sellThrough}%</strong><small>Units sold vs. units on hand</small></article></section>
    <section class="content-grid analytics-grid"><article class="card"><div class="card-head"><div><h2>Sales momentum</h2><p>Net sales · ${esc(state.period)}</p></div><span class="growth-pill">${svgIcon('arrow', 14)} ${esc(a.netChange)}</span></div><div class="analytics-bars">${a.momentum.map((p, i) => `<div title="${esc(p.label)}: ${esc(money(p.value))}"><i style="height:${Math.max(p.value ? 3 : 0, Math.round(p.value / peak * 100))}%"></i><span>${esc(labels[i])}</span></div>`).join('')}</div></article>
      <article class="card"><div class="card-head"><div><h2>Best performers</h2><p>Top products by revenue</p></div><button class="text-action" type="button" data-view="order-products">All products ${svgIcon('arrow', 15)}</button></div><div class="performer-list">${a.performers.map((p, i) => `<div class="performer-row"><span class="rank">0${i + 1}</span><span class="performer-name"><b>${esc(p.name)}</b><small>${p.quantity} units sold</small></span><b>${money(p.revenue)}</b></div>`).join('') || '<div class="empty-state">No sales in this period.</div>'}</div></article>
      <article class="card channel-card"><div class="card-head"><div><h2>Sales channels</h2><p>Revenue mix</p></div></div>${a.channels.map((c) => `<div class="channel-row"><span><i class="channel-dot ${c.color}"></i>${esc(c.label)}</span><b>${c.share}%</b><div class="channel-meter ${c.color === 'red' ? '' : c.color}"><i style="width:${c.share}%"></i></div></div>`).join('') || '<div class="empty-state">No sales yet.</div>'}</article></section>`;
}

/* ====================== admin & settings ====================== */
export function renderAdmin(meta) {
  return `${pageHeading(meta, '')}<section class="admin-summary card"><div class="admin-summary-icon">${svgIcon('settings', 23)}</div><div><h2>Store controls</h2><p>These settings drive the demo: taxes, payment methods, stock thresholds, loyalty and more.</p></div><span class="sample-pill small-pill"><i></i> Demo mode</span></section>
    <section class="settings-grid">${settingsSections.map((s) => `<button class="card setting-tile" type="button" data-view="${s.id}"><span class="setting-icon">${svgIcon(s.icon, 19)}</span><span><b>${esc(s.label)}</b><small>${esc(s.detail)}</small></span>${svgIcon('chevron', 16)}</button>`).join('')}</section>
    <section class="card data-card"><div><h2>Demo data</h2><p>Your changes live in this browser. Export a backup, or start again from fresh sample data.</p></div><div class="heading-actions"><button class="btn btn-secondary" type="button" data-action="export-all">${svgIcon('download', 16)} Export JSON</button><button class="btn btn-secondary" type="button" data-action="reset-data">${svgIcon('refresh', 16)} Reset demo data</button></div></section>`;
}

export function renderSettings(meta) {
  const fields = settingsFields[meta.key] || []; const sec = settingsSections.find((x) => x.id === state.view);
  const hint = meta.key === 'general' ? '<p class="field-hint">Display currency only changes how amounts are shown (1 USD = 15.42 MVR). Stored amounts stay in MVR.</p>' : '';
  return `${pageHeading(meta, `<button class="btn btn-secondary" type="button" data-view="admin">${svgIcon('arrow', 16)} All settings</button>`)}<section class="settings-layout"><aside class="card settings-nav"><div class="settings-nav-title">Settings</div>${settingsSections.map((x) => `<button class="settings-nav-item ${x.id === state.view ? 'active' : ''}" type="button" data-view="${x.id}">${svgIcon(x.icon, 16)}${esc(x.label)}</button>`).join('')}</aside>
    <article class="card settings-form-card"><div class="settings-card-head"><span class="setting-icon">${svgIcon(sec?.icon || 'settings', 19)}</span><div><h2>${esc(meta.title)}</h2><p>${esc(meta.subtitle)}</p></div></div><form data-form="settings"><div class="settings-fields">${fields.map(([k, label, type, opts]) => settingField(k, label, type, opts)).join('')}</div>${hint}<div class="settings-save-row"><span>Saved in this browser and applied across the whole demo.</span><button class="btn btn-primary" type="submit">Save settings</button></div></form></article></section>`;
}
function settingField(key, label, type, options) {
  const value = state.settings[key];
  if (type === 'checkbox') return `<label class="setting-check"><input type="checkbox" name="${esc(key)}" ${value ? 'checked' : ''} /><span class="toggle"><i></i></span><span>${esc(label)}</span></label>`;
  if (type === 'select') return `<label class="form-field"><span>${esc(label)}</span><select name="${esc(key)}">${options.map((o) => `<option ${String(value) === o ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select></label>`;
  return `<label class="form-field"><span>${esc(label)}</span><input name="${esc(key)}" type="${esc(type)}" value="${esc(value)}" ${type === 'number' ? 'min="0" step="any"' : ''} /></label>`;
}

/* ====================== tables ====================== */
export const PAGE_ACTIONS = { sessions: 'New session' };

export function renderTablePage(meta) {
  const key = meta.dataKey;
  const create = key === 'sessions' ? 'New session' : CREATE_LABEL[key];
  const extra = key === 'onlineOrders' ? `<button class="btn btn-primary" type="button" data-action="simulate-order">${svgIcon('globe', 16)} Simulate online order</button>` : '';
  const buttons = `<button class="btn btn-secondary" type="button" data-action="export">${svgIcon('download', 16)} Export</button>${extra}${create ? `<button class="btn btn-primary" type="button" data-action="create">${svgIcon('plus', 16)} ${esc(create)}</button>` : ''}`;
  return `${pageHeading(meta, buttons)}${renderTableCard(meta, { dataKey: key })}`;
}

export function queryRows(dataKey, columns, { report = false } = {}) {
  let rows = getRows(dataKey);
  const field = DATE_FIELD[dataKey];
  const range = periodRange(report ? state.period : state.tablePeriod);
  rows = rows.filter(({ row }) => (!field || inRange(row[field], range) || (row[field] == null && !report)) && (dataKey === 'orderProducts' || outletMatches(row)));
  if (state.statusFilter !== 'all') rows = rows.filter(({ row }) => row.status === state.statusFilter);
  const q = state.query.trim().toLowerCase();
  if (q) rows = rows.filter(({ row }) => Object.entries(row).some(([k, v]) => k !== 'lines' && k !== 'activity' && (DATE_COLS.has(k) && typeof v === 'number' ? fmtDate(v) : String(v ?? '')).toLowerCase().includes(q)));
  if (state.sort.key && columns.some(([k]) => k === state.sort.key)) {
    const k = state.sort.key; const dir = state.sort.dir;
    rows = [...rows].sort((a, b) => { const x = a.row[k]; const y = b.row[k]; if (typeof x === 'number' && typeof y === 'number') return (x - y) * dir; return String(x ?? '').localeCompare(String(y ?? ''), undefined, { numeric: true, sensitivity: 'base' }) * dir; });
  }
  return rows;
}

export function formatCell(key, value, dataKey) {
  if (value == null || value === '') return '<span class="muted-cell">—</span>';
  if (dataKey === 'stockCounts' && key === 'variance') return `<span>${value} item${Number(value) === 1 ? '' : 's'}</span>`;
  if (key === 'variance') return `<span class="money-cell">${signed(value)}</span>`;
  if (DATE_COLS.has(key)) return `<span>${esc(fmtDate(value, !DATE_ONLY(dataKey, key)))}</span>`;
  if (MONEY_COLS.has(key)) return `<span class="money-cell">${money(value)}</span>`;
  if (key === 'status') return `<span class="status-pill ${statusClass(value)}">${esc(value)}</span>`;
  if (['name', 'customer', 'supplier', 'register', 'description'].includes(key)) return `<span class="primary-cell">${esc(value)}</span>`;
  return `<span>${esc(value)}</span>`;
}

export function renderTableCard(meta, { dataKey, report = false }) {
  const columns = meta.columns || [];
  const all = queryRows(dataKey, columns, { report });
  const pages = Math.max(1, Math.ceil(all.length / state.pageSize));
  state.page = Math.min(state.page, pages - 1);
  const start = state.page * state.pageSize;
  const visible = all.slice(start, start + state.pageSize);
  const statuses = STATUS_OPTIONS[dataKey] || [...new Set(getRows(dataKey).map((r) => r.row.status).filter(Boolean))];
  const body = visible.map(({ row, index }) => {
    const clickable = index >= 0;
    return `<tr class="${clickable ? 'row-click' : ''}" ${clickable ? `data-action="detail" data-key="${esc(dataKey)}" data-index="${index}"` : ''}>${columns.map(([k]) => `<td>${formatCell(k, row[k], dataKey)}</td>`).join('')}<td class="row-actions">${clickable ? `<button class="icon-btn row-menu" type="button" data-action="detail" data-key="${esc(dataKey)}" data-index="${index}" aria-label="Open ${esc(row.id || row.name || row.code || 'row')}">${svgIcon('dots', 18)}</button>` : ''}</td></tr>`;
  }).join('');
  const pageButtons = pages <= 1 ? '' : '';
  return `<section class="card table-card ${report ? 'report-table' : ''}" id="table-card">
    <div class="table-toolbar"><label class="table-search">${svgIcon('search', 16)}<input type="search" data-page-search placeholder="Search ${esc(meta.title.toLowerCase())}" value="${esc(state.query)}" /></label>
      <div class="table-filters">${statuses.length ? `<select data-status-filter aria-label="Filter by status"><option value="all">All statuses</option>${statuses.map((s) => `<option value="${esc(s)}" ${state.statusFilter === s ? 'selected' : ''}>${esc(s)}</option>`).join('')}</select>` : ''}${!report && DATE_FIELD[dataKey] ? `<select data-table-period aria-label="Date range">${TABLE_PERIODS.map((p) => `<option ${state.tablePeriod === p ? 'selected' : ''}>${p}</option>`).join('')}</select>` : ''}</div></div>
    <div class="table-scroll"><table><thead><tr>${columns.map(([k, label]) => `<th aria-sort="${state.sort.key === k ? (state.sort.dir > 0 ? 'ascending' : 'descending') : 'none'}"><button type="button" class="th-sort" data-sort="${esc(k)}">${esc(label)}<i>${state.sort.key === k ? (state.sort.dir > 0 ? '↑' : '↓') : ''}</i></button></th>`).join('')}<th aria-label="Actions"></th></tr></thead>
    <tbody>${body || `<tr><td colspan="${columns.length + 1}"><div class="empty-state">No ${esc(meta.title.toLowerCase())} match these filters.</div></td></tr>`}</tbody></table></div>
    <div class="table-footer"><span>${all.length ? `Showing ${start + 1}–${Math.min(start + state.pageSize, all.length)} of ${all.length}` : 'Showing 0 results'}</span><div class="pagination"><button type="button" class="icon-btn" data-action="page-prev" aria-label="Previous page" ${state.page === 0 ? 'disabled' : ''}>${svgIcon('chevron', 15).replace('<svg ', '<svg class="flip-x" ')}</button><span>${state.page + 1} / ${pages}</span><button type="button" class="icon-btn" data-action="page-next" aria-label="Next page" ${state.page >= pages - 1 ? 'disabled' : ''}>${svgIcon('chevron', 15)}</button></div></div>${pageButtons}</section>`;
}

export function renderPage(meta) {
  switch (meta.type) {
    case 'home': return renderHome(meta);
    case 'sell': return renderSell(meta);
    case 'register': return renderRegister(meta);
    case 'inventory': return renderInventory(meta);
    case 'receive': return renderReceive(meta);
    case 'reports': return renderReports(meta);
    case 'report': return renderReportDetail(meta);
    case 'analytics': return renderAnalytics(meta);
    case 'admin': return renderAdmin(meta);
    case 'settings': return renderSettings(meta);
    default: return renderTablePage(meta);
  }
}
