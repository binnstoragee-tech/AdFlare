import { state, money, signed, statusClass, openSession } from './core.js';
import { svgIcon } from './icons.js';
import { esc, fmtDate, toLabel, num, round2 } from './util.js';
import { getFields, EDITABLE, DELETABLE, CREATE_LABEL } from './config.js';
import { rowActions, cartTotals, paymentMethods } from './actions.js';
import { getRows, sessionStats } from './selectors.js';
import { formatCell } from './views.js';

const HIDDEN_KEYS = new Set(['lines', 'activity', 'stockReserved', 'stockReleased', 'counted']);

function shell(title, eyebrow, body, { wide = false, id = 'modal-title' } = {}) {
  return `<div class="modal-backdrop" data-action="close-modal"><section class="modal-card ${wide ? 'modal-wide' : ''}" role="dialog" aria-modal="true" aria-labelledby="${id}"><div class="modal-head"><div><span class="eyebrow">${esc(eyebrow)}</span><h2 id="${id}">${esc(title)}</h2></div><button type="button" class="icon-btn" data-action="close-modal" aria-label="Close">${svgIcon('close', 18)}</button></div>${body}</section></div>`;
}
const errorBox = (m) => (m.error ? `<p class="form-error" role="alert">${svgIcon('info', 15)} ${esc(m.error)}</p>` : '');

export function fieldHtml(f, values = {}) {
  const v = values[f.name] ?? f.value ?? '';
  const req = f.required ? ' <i>*</i>' : '';
  const attrs = `name="${esc(f.name)}" ${f.required ? 'required' : ''} ${f.min != null ? `min="${f.min}"` : ''} ${f.step ? `step="${f.step}"` : ''}`;
  let control;
  if (f.type === 'select') control = `<select ${attrs}>${(f.options || []).map((o) => `<option ${String(v) === String(o) ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
  else control = `<input ${attrs} type="${esc(f.type)}" value="${esc(v)}" ${f.placeholder ? `placeholder="${esc(f.placeholder)}"` : ''} />`;
  return `<label class="form-field ${f.span ? 'span-two' : ''}"><span>${esc(f.label)}${req}</span>${control}</label>`;
}

/* ---------- detail ---------- */
function plain(key, value, dataKey) { return formatCell(key, value, dataKey); }

function detailBody(m) {
  const { key } = m; const display = getRows(key)[m.index]?.row; const row = state.data[key][m.index];
  if (!row) return '<div class="empty-state">This record no longer exists.</div>';
  if (key === 'customers') return customerTabs(m, row);
  if (key === 'products') return productTabs(m, row);
  if (key === 'bills') return billDetail(row);
  const entries = Object.entries(display).filter(([k]) => !HIDDEN_KEYS.has(k));
  let extra = '';
  if (key === 'sessions') { const st = sessionStats(row); extra = `<div class="detail-stat-grid"><article><span>Sales</span><b>${money(st.sales)}</b></article><article><span>Cash</span><b>${money(st.cash)}</b></article><article><span>Card & other</span><b>${money(st.card + st.other)}</b></article></div>`; }
  if (row.lines?.length) extra += `<div class="lines-table">${row.lines.map((l) => `<div><span>${esc(l.name)} × ${l.qty}</span><b>${money(l.price * l.qty)}</b></div>`).join('')}</div>`;
  return `${extra}<div class="detail-list">${entries.map(([k, v]) => `<div><span>${esc(toLabel(k))}</span><b>${plain(k, v, key)}</b></div>`).join('')}</div>`;
}

function billDetail(b) {
  return `<div class="detail-profile"><span class="detail-avatar">${svgIcon('receipt', 22)}</span><div><h3>${esc(b.id)}</h3><p>${esc(b.customer)} · ${esc(fmtDate(b.date))}</p><span class="status-pill ${statusClass(b.status)}">${esc(b.status)}</span></div></div>
    <div class="lines-table">${(b.lines || []).map((l) => `<div><span>${esc(l.name)} × ${l.qty}</span><b>${money(l.price * l.qty)}</b></div>`).join('') || '<div><span>No itemised lines recorded</span><b></b></div>'}</div>
    <div class="detail-list"><div><span>Payment</span><b>${esc(b.method)}</b></div><div><span>Branch</span><b>${esc(b.outlet || '—')}</b></div><div><span>Discount</span><b>${money(b.discount || 0)}</b></div><div><span>Tax</span><b>${money(b.tax || 0)}</b></div><div><span>Total</span><b>${money(b.total)}</b></div><div><span>Session</span><b>${esc(b.sessionId || '—')}</b></div></div>`;
}

function customerTabs(m, row) {
  const tabs = [['profile', 'Profile'], ['credit', 'Credit'], ['loyalty', 'Loyalty'], ['orders', 'Bills']]; const active = m.tab || 'profile';
  let panel;
  if (active === 'credit') { const bal = num(row.outstanding); const limit = num(row.creditLimit || 3000); panel = `<div class="detail-stat-grid"><article><span>Outstanding</span><b>${money(bal)}</b></article><article><span>Credit limit</span><b>${money(limit)}</b></article><article><span>Available</span><b>${money(Math.max(0, limit - bal))}</b></article></div><div class="detail-callout">Credit sales add to the outstanding balance. Use “Receive payment” below when the customer pays.</div>`; }
  else if (active === 'loyalty') { const pts = num(row.loyalty); const tier = pts >= 350 ? 'Gold' : pts >= 150 ? 'Silver' : 'Member'; panel = `<div class="loyalty-card"><span class="loyalty-mark">${svgIcon('star', 21)}</span><div><small>ADFLARE REWARDS</small><h3>${tier} member</h3><p>Points earned on every sale and redeemable at checkout.</p></div><strong>${pts} <small>points</small></strong></div><div class="detail-stat-grid"><article><span>Visits</span><b>${esc(row.visits || 0)}</b></article><article><span>Points</span><b>${pts}</b></article><article><span>Worth</span><b>${money(Math.floor(pts / 100) * num(state.settings.redemptionValue))}</b></article></div>`; }
  else if (active === 'orders') { const bills = state.data.bills.filter((b) => b.customer === row.name).slice(0, 12); panel = `<div class="detail-orders">${bills.map((b) => `<article><span><b>${esc(b.id)}</b><small>${esc(fmtDate(b.date))} · ${esc(b.method)}</small></span><strong>${money(b.total)}</strong><i class="status-pill ${statusClass(b.status)}">${esc(b.status)}</i></article>`).join('') || '<div class="empty-state">No bills for this customer yet.</div>'}</div>`; }
  else { const ini = (row.name || 'C').split(' ').map((p) => p[0]).slice(0, 2).join(''); panel = `<div class="detail-profile"><span class="detail-avatar">${esc(ini)}</span><div><h3>${esc(row.name)}</h3><p>${esc(row.email || 'No email')} · ${esc(row.mobile || 'No phone')}</p><span class="status-pill ${statusClass(row.status)}">${esc(row.status || 'Active')}</span></div></div><div class="detail-list"><div><span>Phone</span><b>${esc(row.mobile || '—')}</b></div><div><span>Email</span><b>${esc(row.email || '—')}</b></div><div><span>Address</span><b>${esc(row.address || '—')}</b></div><div><span>Visits</span><b>${esc(row.visits || 0)}</b></div><div><span>Outstanding</span><b>${money(row.outstanding || 0)}</b></div><div><span>Customer since</span><b>${esc(fmtDate(row.joinedAt, false))}</b></div></div>`; }
  return tabbed(tabs, active, panel);
}
function productTabs(m, row) {
  const tabs = [['overview', 'Overview'], ['stock', 'Stock']]; const active = m.tab || 'overview'; let panel;
  if (active === 'stock') panel = `<div class="detail-stat-grid"><article><span>On hand</span><b>${esc(row.stockQty || 0)} units</b></article><article><span>Reorder at</span><b>${esc(state.settings.lowStockThreshold)} units</b></article><article><span>Status</span><b>${esc(row.status || '—')}</b></article></div><div class="detail-callout">Use “Adjust stock” below to correct counts. Sales, receipts and stock counts also update this number.</div>`;
  else panel = `<div class="detail-profile"><span class="detail-avatar">${svgIcon('box', 22)}</span><div><h3>${esc(row.name)}</h3><p>${esc(row.sku)} · ${esc(row.category)}</p><span class="status-pill ${statusClass(row.status)}">${esc(row.status || 'Active')}</span></div></div><div class="detail-list"><div><span>SKU</span><b>${esc(row.sku)}</b></div><div><span>Category</span><b>${esc(row.category)}</b></div><div><span>Price</span><b>${money(row.price || 0)}</b></div><div><span>On hand</span><b>${esc(row.stockQty || 0)} units</b></div></div>`;
  return tabbed(tabs, active, panel);
}
const tabbed = (tabs, active, panel) => `<div class="detail-tabs" role="tablist">${tabs.map(([id, label]) => `<button type="button" role="tab" aria-selected="${active === id}" aria-controls="record-detail-panel" class="detail-tab ${active === id ? 'active' : ''}" data-detail-tab="${id}">${label}</button>`).join('')}</div><div class="detail-tab-panel" id="record-detail-panel" role="tabpanel" tabindex="0">${panel}</div>`;

function renderDetail(m) {
  const row = state.data[m.key]?.[m.index];
  const acts = row ? rowActions(m.key, row) : [];
  const title = row ? (row.id || row.name || row.code || row.sku || 'Record') : 'Record';
  const buttons = [
    ...acts.map((a) => `<button type="button" class="btn ${a.danger ? 'btn-danger' : 'btn-secondary'}" data-action="row-action" data-act="${a.id}" data-key="${esc(m.key)}" data-index="${m.index}">${svgIcon(a.icon, 15)} ${esc(a.label)}</button>`),
    EDITABLE.has(m.key) ? `<button type="button" class="btn btn-secondary" data-action="edit-record" data-key="${esc(m.key)}" data-index="${m.index}">${svgIcon('edit', 15)} Edit</button>` : '',
    DELETABLE.has(m.key) ? `<button type="button" class="btn btn-danger" data-action="delete-record" data-key="${esc(m.key)}" data-index="${m.index}">${svgIcon('trash', 15)} Delete</button>` : '',
  ].join('');
  return shell(String(title), 'DETAILS', `${detailBody(m)}<div class="modal-actions">${buttons}</div><div class="modal-foot"><span class="modal-hint">Saved in this browser</span><button class="btn btn-secondary" type="button" data-action="close-modal">Done</button></div>`, { wide: true });
}

/* ---------- forms ---------- */
function renderForm(m, mode) {
  const row = mode === 'edit' ? state.data[m.key][m.index] : null;
  const fields = getFields(m.key, row || undefined).map((f) => (m.values && m.values[f.name] !== undefined && !m.error ? { ...f, value: m.values[f.name] } : f));
  const title = mode === 'edit' ? `Edit ${row?.name || row?.id || row?.code || row?.sku || 'record'}` : (m.key === 'sessions' ? 'New session' : CREATE_LABEL[m.key] || 'New item');
  return shell(title, mode === 'edit' ? 'EDIT' : 'NEW', `<form data-form="${mode}"><div class="form-grid">${fields.map((f) => fieldHtml(f, m.error ? m.values : {})).join('')}</div>${errorBox(m)}<div class="modal-foot"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit">${mode === 'edit' ? 'Save changes' : 'Add'}</button></div></form>`);
}

function renderPrompt(m) {
  return shell(m.title, 'ACTION', `<form data-form="prompt">${m.hint ? `<p class="modal-lead">${esc(m.hint)}</p>` : ''}<div class="form-grid">${m.fields.map((f) => fieldHtml(f, m.error ? m.values : {})).join('')}</div>${errorBox(m)}<div class="modal-foot"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit">Confirm</button></div></form>`);
}

function renderConfirm(m) {
  return shell(m.title || 'Are you sure?', 'CONFIRM', `<p class="modal-lead">${esc(m.message)}</p>${errorBox(m)}<div class="modal-foot"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn ${m.danger === false ? 'btn-primary' : 'btn-danger'}" type="button" data-action="confirm-yes">${esc(m.confirmLabel || 'Confirm')}</button></div>`);
}

/* ---------- checkout / receipt ---------- */
function renderCheckout(m) {
  const t = cartTotals(); const methods = paymentMethods(); const sel = m.values?.method && methods.includes(m.values.method) ? m.values.method : methods[0];
  const cards = state.data.giftCards.filter((g) => g.status === 'Active' && num(g.balance) > 0);
  const cust = t.customer; const avail = cust ? num(cust.creditLimit || 3000) - num(cust.outstanding) : 0;
  return shell('Checkout', 'COMPLETE SALE', `<div class="checkout-total"><span>Total to collect</span><b>${money(t.total)}</b></div>
    <form data-form="checkout"><div class="method-grid" role="radiogroup" aria-label="Payment method">${methods.map((x) => `<label class="method-chip"><input type="radio" name="method" value="${esc(x)}" ${x === sel ? 'checked' : ''} /><span>${esc(x)}</span></label>`).join('')}</div>
      <div data-method-section="Cash" ${sel === 'Cash' ? '' : 'hidden'}><label class="form-field"><span>Cash received</span><input name="tendered" type="number" min="0" step="any" value="${esc(m.values?.tendered ?? t.total)}" data-tendered data-total="${t.total}" /></label><div class="change-row"><span>Change due</span><b data-change>${money(0)}</b></div></div>
      <div data-method-section="Gift card" ${sel === 'Gift card' ? '' : 'hidden'}><label class="form-field"><span>Gift card</span><select name="giftCode">${cards.map((g) => `<option value="${esc(g.code)}">${esc(g.code)} · ${money(g.balance)}</option>`).join('') || '<option value="">No active gift cards</option>'}</select></label></div>
      <div data-method-section="Credit" ${sel === 'Credit' ? '' : 'hidden'}><div class="preview-callout">${svgIcon('info', 16)} ${cust ? `${esc(cust.name)} has ${money(Math.max(0, avail))} credit available.` : 'Select a saved customer on the Sell page to use credit.'}</div></div>
      <div data-method-section="Card" ${sel === 'Card' ? '' : 'hidden'}><div class="preview-callout">${svgIcon('info', 16)} Demo mode: no card is charged. The sale is recorded as paid by card.</div></div>
      <div data-method-section="Transfer" ${sel === 'Transfer' ? '' : 'hidden'}><div class="preview-callout">${svgIcon('info', 16)} Record the sale as paid by bank transfer.</div></div>
      <label class="form-field"><span>Customer</span><input value="${esc(state.cartCustomer)}" disabled /></label>
      <label class="form-field"><span>Note (optional)</span><input name="note" value="${esc(m.values?.note || '')}" placeholder="Add a note to the receipt" /></label>${errorBox(m)}
      <div class="modal-foot"><button type="button" class="btn btn-secondary" data-action="close-modal">Cancel</button><button type="submit" class="btn btn-primary">Complete sale · ${money(t.total)}</button></div></form>`);
}

function renderReceipt(m) {
  const b = state.data.bills.find((x) => x.id === m.billId);
  if (!b) return shell('Receipt', 'RECEIPT', '<div class="empty-state">Receipt not found.</div>');
  const s = state.settings;
  const body = `<div class="receipt" id="receipt-print"><div class="receipt-top"><b>${esc(s.storeName)}</b><small>${esc(s.address)}</small><small>${esc(s.phone)}</small></div>
    ${b.status !== 'Completed' && b.status !== 'Pending' ? `<div class="receipt-void">${esc(b.status.toUpperCase())}</div>` : ''}
    <div class="receipt-meta"><div><span>Bill</span><b>${esc(b.id)}</b></div><div><span>Date</span><b>${esc(fmtDate(b.date))}</b></div><div><span>Customer</span><b>${esc(b.customer)}</b></div><div><span>Cashier</span><b>Adflare Owner</b></div></div>
    <div class="receipt-lines">${(b.lines || []).map((l) => `<div><span>${esc(l.name)}<small>${l.qty} × ${money(l.price)}</small></span><b>${money(l.price * l.qty)}</b></div>`).join('') || '<div><span>Items</span><b>—</b></div>'}</div>
    <div class="receipt-sum"><div><span>Subtotal</span><b>${money(b.subtotal ?? b.total)}</b></div>${num(b.discount) ? `<div><span>Discount</span><b>−${money(b.discount)}</b></div>` : ''}${num(b.serviceFee) ? `<div><span>Service fee</span><b>${money(b.serviceFee)}</b></div>` : ''}<div><span>${s.pricesIncludeTax ? 'Tax included' : 'Tax'}</span><b>${money(b.tax || 0)}</b></div><div class="receipt-total"><span>Total</span><b>${money(b.total)}</b></div><div><span>Paid by</span><b>${esc(b.method)}${b.giftCode ? ` (${esc(b.giftCode)})` : ''}</b></div>${b.tendered != null ? `<div><span>Cash received</span><b>${money(b.tendered)}</b></div><div><span>Change</span><b>${money(b.change || 0)}</b></div>` : ''}${b.status === 'Pending' ? '<div><span>Status</span><b>Unpaid (on account)</b></div>' : ''}${num(b.pointsEarned) ? `<div><span>Points earned</span><b>${b.pointsEarned}</b></div>` : ''}</div>
    ${b.note ? `<p class="receipt-note">${esc(b.note)}</p>` : ''}<p class="receipt-thanks">Thank you for shopping with us!</p></div>
    <div class="modal-foot no-print"><button class="btn btn-secondary" type="button" data-action="print-receipt">${svgIcon('print', 15)} Print</button><button class="btn btn-primary" type="button" data-action="close-modal">${m.fresh ? 'New sale' : 'Done'}</button></div>`;
  return shell(m.fresh ? 'Sale complete' : 'Receipt', m.fresh ? 'SUCCESS' : 'RECEIPT', body);
}

/* ---------- register ---------- */
function renderOpenRegister(m) {
  return shell('Open register', 'REGISTER', `<form data-form="open-register"><div class="form-grid"><label class="form-field"><span>Register</span><select name="register">${['Front counter', 'Branch 1 counter'].map((r) => `<option ${m.values?.register === r ? 'selected' : ''}>${r}</option>`).join('')}</select></label><label class="form-field"><span>Opening float (MVR) <i>*</i></span><input name="openingFloat" type="number" min="0" step="any" value="${esc(m.values?.openingFloat ?? 1500)}" required /></label><label class="form-field span-two"><span>Opened by</span><input name="openedBy" value="${esc(m.values?.openedBy ?? 'Adflare Owner')}" /></label></div>${errorBox(m)}<div class="modal-foot"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit">Open register</button></div></form>`);
}
function renderCloseRegister(m) {
  const s = state.data.sessions.find((x) => x.id === m.sessionId); const st = s ? sessionStats(s) : { expected: 0, sales: 0, count: 0 };
  return shell('Close register', s ? s.id : 'REGISTER', `<form data-form="close-register"><div class="detail-stat-grid"><article><span>Sales (${st.count})</span><b>${money(st.sales)}</b></article><article><span>Opening float</span><b>${money(s?.openingFloat || 0)}</b></article><article><span>Expected cash</span><b>${money(st.expected)}</b></article></div>
    <label class="form-field"><span>Cash counted in drawer <i>*</i></span><input name="counted" type="number" min="0" step="any" value="${esc(m.values?.counted ?? st.expected)}" data-counted data-expected="${st.expected}" required /></label><div class="change-row"><span>Variance</span><b data-variance>${signed(0)}</b></div>${errorBox(m)}
    <div class="modal-foot"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit">Close register</button></div></form>`);
}
function renderCashMove(m) {
  return shell('Cash in / out', 'REGISTER', `<form data-form="cash-move"><div class="form-grid"><label class="form-field"><span>Type</span><select name="kind"><option value="in" ${m.values?.kind === 'in' ? 'selected' : ''}>Cash in</option><option value="out" ${m.values?.kind === 'out' ? 'selected' : ''}>Cash out</option></select></label><label class="form-field"><span>Amount (MVR) <i>*</i></span><input name="amount" type="number" min="0" step="any" value="${esc(m.values?.amount ?? '')}" required /></label><label class="form-field span-two"><span>Reason</span><input name="reason" value="${esc(m.values?.reason ?? '')}" placeholder="e.g. Bank drop, change top-up" /></label></div>${errorBox(m)}<div class="modal-foot"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit">Save</button></div></form>`);
}
function renderCount(m) {
  const sc = state.data.stockCounts[m.index];
  return shell(`Count sheet · ${sc?.id || ''}`, 'STOCK COUNT', `<form data-form="count"><p class="modal-lead">Enter what you actually counted. Differences are applied to stock when you finish.</p><div class="count-table"><div class="count-head"><span>Product</span><span>System</span><span>Counted</span></div>${state.data.products.map((p) => `<div><span><b>${esc(p.name)}</b><small>${esc(p.sku)}</small></span><span>${num(p.stockQty)}</span><input type="number" min="0" step="1" name="${esc(p.sku)}" value="${esc(m.values?.[p.sku] ?? p.stockQty)}" aria-label="Counted ${esc(p.name)}" /></div>`).join('')}</div>${errorBox(m)}<div class="modal-foot"><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="submit">Finish count</button></div></form>`, { wide: true });
}

export function renderModal() {
  const m = state.modal;
  if (!m) return '';
  switch (m.type) {
    case 'detail': return renderDetail(m);
    case 'create': return renderForm(m, 'create');
    case 'edit': return renderForm(m, 'edit');
    case 'prompt': return renderPrompt(m);
    case 'confirm': return renderConfirm(m);
    case 'checkout': return renderCheckout(m);
    case 'receipt': return renderReceipt(m);
    case 'open-register': return renderOpenRegister(m);
    case 'close-register': return renderCloseRegister(m);
    case 'cash-move': return renderCashMove(m);
    case 'count': return renderCount(m);
    default: return '';
  }
}
