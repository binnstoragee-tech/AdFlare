/* All data changes live here. Each function returns an error string on failure, or null on success. */
import { state, render, save, toast, money, openSession, logActivity, syncProductStatus, go, flush } from './core.js';
import { num, round2, makeId, nextSeq, fromInputDate, addMonths, DAY, rng, csvEscape, fmtDate, esc } from './util.js';
import { getFields, NAME_KEY, STATUS_OPTIONS, EDITABLE, DATE_COLS, OUTLETS } from './config.js';
import { sessionStats, getRows, DATE_FIELD } from './selectors.js';

const d = () => state.data;
const thisMonth = (ts) => { const a = new Date(ts); const b = new Date(); return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth(); };
const customerByName = (name) => d().customers.find((c) => c.name === name);
const productBySku = (sku) => d().products.find((p) => p.sku === sku);

/* ---------- form values ---------- */
export function parseValues(key, raw, row) {
  const out = {};
  for (const field of getFields(key, row)) {
    let v = raw[field.name];
    if (v === undefined) continue;
    if (field.type === 'number') v = v === '' ? 0 : num(v);
    else if (field.type === 'date') v = fromInputDate(v);
    else v = String(v).trim();
    out[field.name] = v;
  }
  return out;
}
function validate(key, v, row) {
  for (const field of getFields(key, row)) {
    if (field.required && (v[field.name] === '' || v[field.name] == null || (field.type === 'date' && !v[field.name]))) return `${field.label.replace(/ \(.*\)/, '')} is required.`;
    if (field.type === 'number' && v[field.name] != null && v[field.name] < 0) return `${field.label.replace(/ \(.*\)/, '')} cannot be negative.`;
  }
  const nk = NAME_KEY[key];
  if (nk && v[nk]) {
    const clash = d()[key].some((r) => r !== row && String(r[nk]).toLowerCase() === String(v[nk]).toLowerCase());
    if (clash) return `${field0(key, nk)} "${v[nk]}" already exists.`;
  }
  return null;
}
const field0 = (key, name) => getFields(key).find((f) => f.name === name)?.label.replace(/ \(.*\)/, '') || 'Value';

/* ---------- create ---------- */
export function createRecord(key, raw) {
  const v = parseValues(key, raw);
  const err = validate(key, v);
  if (err) return err;
  const now = Date.now(); const s = state.settings; const list = d()[key];
  let row; let label = 'Record';
  switch (key) {
    case 'customers': row = { ...v, visits: 0, outstanding: 0, creditLimit: v.creditLimit || 3000, status: 'Active', joinedAt: now }; label = v.name; break;
    case 'products':
      row = { ...v }; syncProductStatus(row); label = v.name;
      break;
    case 'categories': row = { ...v, products: 0, updatedAt: now, status: 'Active' }; label = v.name; break;
    case 'giftCards':
      if (v.balance < num(s.minimumValue)) return `Minimum gift card value is ${money(s.minimumValue)}.`;
      row = { ...v, customer: v.customer || 'Walk-in customer', issuedAt: now, value: v.balance, expires: v.expires || addMonths(now, num(s.defaultExpiry) || 12), status: 'Active' }; label = v.code; break;
    case 'quotations': row = { id: makeId('QT-', list), ...v, createdAt: now, expires: v.expires || now + 7 * DAY, lines: [], status: 'Open' }; label = row.id; break;
    case 'stockCounts': row = { id: makeId('CNT-', list), ...v, items: d().products.length, variance: null, status: 'In progress' }; label = row.id; break;
    case 'transfers':
      if (v.from === v.to) return 'Choose two different branches.';
      row = { id: makeId('TR-', list), ...v, createdAt: now, status: 'Draft' }; label = row.id; break;
    case 'suppliers': row = { ...v, leadTime: num(v.leadTime) || 0, status: 'Active' }; label = v.name; break;
    case 'purchaseOrders':
      row = { id: makeId(`${s.poPrefix || 'PO'}-`, list), ...v, createdAt: now, expectedAt: v.expectedAt || now + num(s.defaultLeadTime || 4) * DAY, receivedUnits: 0, outlet: 'Main branch', status: s.requireApproval ? 'Pending approval' : 'Awaiting delivery' };
      label = row.id; break;
    case 'landedCosts': {
      const po = d().purchaseOrders.find((p) => p.id === v.purchaseOrder);
      row = { ...v, supplier: po?.supplier || '—', date: v.date || now, total: round2(v.freight + v.duties + v.other) }; label = v.purchaseOrder; break;
    }
    case 'expenses': {
      if (s.requireReceipt && v.amount > num(s.approvalLimit) && !v.receipt) return `A receipt reference is required for expenses above ${money(s.approvalLimit)}.`;
      row = { ...v, date: v.date || now, status: v.amount > num(s.approvalLimit) ? 'Review' : 'Approved' };
      if (row.status === 'Approved') applyExpense(row, 1);
      label = v.description; break;
    }
    case 'expenseCategories': row = { ...v, monthToDate: 0 }; label = v.name; break;
    default: return 'This record type cannot be created.';
  }
  list.unshift(row);
  logActivity(`Added ${label}`, 'green');
  save(); return null;
}

/* ---------- update ---------- */
export function updateRecord(key, index, raw) {
  const row = d()[key][index];
  if (!row) return 'Record not found.';
  const v = parseValues(key, raw, row);
  const err = validate(key, v, row);
  if (err) return err;
  const old = { ...row };
  if (key === 'transfers' && v.from === v.to) return 'Choose two different branches.';
  if (key === 'expenses') { if (old.status === 'Approved') applyExpense(old, -1); }
  Object.assign(row, v);
  if (key === 'customers' && old.name !== row.name) {
    ['bills', 'quotations', 'giftCards', 'onlineOrders', 'onlinePayments'].forEach((k) => d()[k].forEach((x) => { if (x.customer === old.name) x.customer = row.name; }));
    if (state.cartCustomer === old.name) state.cartCustomer = row.name;
  }
  if (key === 'products') { syncProductStatus(row); if (old.category !== row.category) touchCategory(row.category); }
  if (key === 'categories' && old.name !== row.name) d().products.forEach((p) => { if (p.category === old.name) p.category = row.name; });
  if (key === 'categories') row.updatedAt = Date.now();
  if (key === 'suppliers') row.leadTime = num(row.leadTime);
  if (key === 'suppliers' && old.name !== row.name) { d().purchaseOrders.forEach((p) => { if (p.supplier === old.name) p.supplier = row.name; }); d().landedCosts.forEach((p) => { if (p.supplier === old.name) p.supplier = row.name; }); }
  if (key === 'expenseCategories' && old.name !== row.name) d().expenses.forEach((e) => { if (e.category === old.name) e.category = row.name; });
  if (key === 'landedCosts') { row.total = round2(row.freight + row.duties + row.other); row.supplier = d().purchaseOrders.find((p) => p.id === row.purchaseOrder)?.supplier || row.supplier; }
  if (key === 'expenses') { if (row.status === 'Approved') applyExpense(row, 1); }
  if (key === 'giftCards' && row.status === 'Active' && row.balance <= 0) row.status = 'Redeemed';
  logActivity(`Updated ${row.name || row.id || row.code || row.sku || 'record'}`, 'blue');
  save(); return null;
}
function touchCategory(name) { const c = d().categories.find((x) => x.name === name); if (c) c.updatedAt = Date.now(); }
function applyExpense(exp, sign) {
  if (!thisMonth(exp.date)) return;
  const cat = d().expenseCategories.find((c) => c.name === exp.category);
  if (cat) cat.monthToDate = Math.max(0, round2(num(cat.monthToDate) + sign * num(exp.amount)));
}

/* ---------- delete ---------- */
export function deleteRecord(key, index) {
  if (!EDITABLE.has(key)) return 'This record cannot be deleted.';
  const row = d()[key][index];
  if (!row) return 'Record not found.';
  if (key === 'categories' && d().products.some((p) => p.category === row.name)) return 'Move or delete the products in this category first.';
  if (key === 'suppliers' && d().purchaseOrders.some((p) => p.supplier === row.name && !['Received', 'Cancelled'].includes(p.status))) return 'This supplier still has open purchase orders.';
  if (key === 'expenseCategories' && d().expenses.some((e) => e.category === row.name)) return 'This category still has expenses recorded against it.';
  if (key === 'expenses' && row.status === 'Approved') applyExpense(row, -1);
  d()[key].splice(index, 1);
  logActivity(`Deleted ${row.name || row.id || row.code || row.sku || 'record'}`, 'red');
  save(); return null;
}

/* ---------- row actions ---------- */
export function rowActions(key, row) {
  const A = (id, label, icon, extra = {}) => ({ id, label, icon, ...extra });
  const list = [];
  switch (key) {
    case 'bills':
      list.push(A('receipt', 'View receipt', 'receipt'));
      if (row.status === 'Pending') list.push(A('mark-paid', 'Mark as paid', 'check'));
      if (row.status === 'Completed') list.push(A('refund', 'Refund bill', 'undo', { danger: true, confirm: 'Refund this bill? Stock and customer balances will be restored.' }));
      if (row.status === 'Completed' || row.status === 'Pending') list.push(A('void', 'Void bill', 'ban', { danger: true, confirm: 'Void this bill? Stock and customer balances will be restored.' }));
      break;
    case 'sessions': if (row.status === 'Open') list.push(A('close-session', 'Close session', 'cash')); break;
    case 'giftCards': if (row.status === 'Active') { list.push(A('redeem', 'Redeem value', 'gift', { prompt: [{ name: 'amount', label: 'Amount to redeem (MVR)', type: 'number', value: state.settings.allowPartialRedemption === false ? row.balance : '', min: 0, step: 'any', required: true }], hint: state.settings.allowPartialRedemption === false ? 'Partial redemption is off: the full balance is used.' : `Balance ${money(row.balance)}` })); list.push(A('cancel-card', 'Cancel card', 'ban', { danger: true, confirm: 'Cancel this gift card? The remaining balance becomes unusable.' })); } break;
    case 'quotations': if (row.status === 'Open') { list.push(A('convert-quote', 'Convert to sale', 'cart')); list.push(A('cancel-quote', 'Cancel quotation', 'ban', { danger: true, confirm: 'Cancel this quotation?' })); } break;
    case 'onlinePayments': if (row.status === 'Review') { list.push(A('approve-payment', 'Approve payment', 'check')); list.push(A('reject-payment', 'Reject payment', 'ban', { danger: true, confirm: 'Reject this payment? The linked order will be cancelled.' })); } break;
    case 'customers':
      if (num(row.outstanding) > 0) list.push(A('collect', 'Receive payment', 'cash', { prompt: [{ name: 'amount', label: 'Amount received (MVR)', type: 'number', value: row.outstanding, min: 0, step: 'any', required: true }], hint: `Outstanding ${money(row.outstanding)}` }));
      list.push(A('adjust-points', 'Adjust points', 'star', { prompt: [{ name: 'delta', label: 'Points to add (use a minus to remove)', type: 'number', value: '', step: 1, required: true }], hint: `Current balance ${row.loyalty || 0} points` }));
      break;
    case 'products':
      list.push(A('adjust-stock', 'Adjust stock', 'inventory', { prompt: [{ name: 'delta', label: 'Quantity change (use a minus to remove)', type: 'number', value: '', step: 1, required: true }, { name: 'reason', label: 'Reason', type: 'select', options: ['Recount', 'Damaged', 'Returned to supplier', 'Found stock', 'Other'], value: 'Recount' }], hint: `On hand ${row.stockQty}` }));
      if (num(row.stockQty) > 0) list.push(A('sell-product', 'Add to sale', 'cart'));
      break;
    case 'categories': list.push(A('toggle-category', row.status === 'Archived' ? 'Reactivate' : 'Archive', 'folder')); break;
    case 'stockCounts': if (row.status !== 'Completed') list.push(A('count-sheet', 'Open count sheet', 'checklist')); break;
    case 'transfers':
      if (row.status === 'Draft' && state.settings.requireApproval) list.push(A('approve-transfer', 'Approve transfer', 'check'));
      if ((row.status === 'Draft' && !state.settings.requireApproval) || row.status === 'Approved') list.push(A('send-transfer', 'Send stock', 'transfer'));
      if (row.status === 'In transit') list.push(A('receive-transfer', 'Mark received', 'check'));
      if (row.status === 'Draft' || row.status === 'Approved') list.push(A('cancel-transfer', 'Cancel transfer', 'ban', { danger: true, confirm: 'Cancel this transfer?' }));
      break;
    case 'suppliers':
      list.push(A('new-po', 'New purchase order', 'purchase'));
      list.push(A('toggle-supplier', row.status === 'On hold' ? 'Reactivate' : 'Put on hold', 'truck'));
      break;
    case 'purchaseOrders':
      if (row.status === 'Pending approval') list.push(A('approve-po', 'Approve order', 'check'));
      if (['Awaiting delivery', 'Part received'].includes(row.status)) list.push(A('receive-po', 'Receive stock', 'checklist'));
      if (['Pending approval', 'Awaiting delivery'].includes(row.status)) list.push(A('cancel-po', 'Cancel order', 'ban', { danger: true, confirm: 'Cancel this purchase order?' }));
      break;
    case 'onlineOrders': {
      const next = { 'Payment review': 'Accept payment & process', Processing: 'Mark ready to ship', 'Ready to ship': 'Mark completed' }[row.status];
      if (next) list.push(A('advance-order', next, 'check'));
      if (!['Completed', 'Cancelled'].includes(row.status)) list.push(A('cancel-order', 'Cancel order', 'ban', { danger: true, confirm: 'Cancel this order? Reserved stock is released.' }));
      break;
    }
    case 'expenses': if (row.status === 'Review') { list.push(A('approve-expense', 'Approve expense', 'check')); list.push(A('reject-expense', 'Reject expense', 'ban', { danger: true, confirm: 'Reject this expense?' })); } break;
    default: break;
  }
  return list;
}

/* Returns { error?, message?, next? } where next is a UI instruction for the caller. */
export function runRowAction(key, index, actionId, values = {}) {
  const row = d()[key][index];
  if (!row) return { error: 'Record not found.' };
  const ok = (message, extra = {}) => { save(); return { message, ...extra }; };
  switch (actionId) {
    case 'receipt': return { next: { modal: { type: 'receipt', billId: row.id } } };
    case 'mark-paid':
      row.status = 'Completed';
      if (row.method === 'Credit') { const c = customerByName(row.customer); if (c) c.outstanding = Math.max(0, round2(num(c.outstanding) - row.total)); }
      logActivity(`${row.id} marked as paid`, 'green', 'bill-history'); return ok(`${row.id} marked as paid.`);
    case 'refund': case 'void': {
      const status = actionId === 'void' ? 'Voided' : 'Refunded';
      reverseBill(row, status); logActivity(`${row.id} ${status.toLowerCase()}`, 'red', 'bill-history'); return ok(`${row.id} ${status.toLowerCase()}. Stock restored.`);
    }
    case 'close-session': return { next: { modal: { type: 'close-register', sessionId: row.id } } };
    case 'redeem': {
      const amount = round2(values.amount);
      if (amount <= 0) return { error: 'Enter an amount above zero.' };
      if (amount > row.balance) return { error: `The balance is only ${money(row.balance)}.` };
      if (state.settings.allowPartialRedemption === false && amount !== row.balance) return { error: 'Partial redemption is turned off in settings.' };
      row.balance = round2(row.balance - amount); if (row.balance <= 0) row.status = 'Redeemed';
      logActivity(`${row.code} redeemed ${money(amount)}`, 'blue', 'gift-cards'); return ok(`Redeemed ${money(amount)} from ${row.code}.`);
    }
    case 'cancel-card': row.status = 'Cancelled'; return ok(`${row.code} cancelled.`);
    case 'convert-quote': return convertQuote(row);
    case 'cancel-quote': row.status = 'Cancelled'; return ok(`${row.id} cancelled.`);
    case 'approve-payment': case 'reject-payment': {
      const approve = actionId === 'approve-payment';
      row.status = approve ? 'Approved' : 'Rejected';
      const order = d().onlineOrders.find((o) => o.id === row.order);
      if (order) {
        if (approve && order.status === 'Payment review') order.status = 'Processing';
        if (!approve && order.status !== 'Cancelled') { releaseOrderStock(order); order.status = 'Cancelled'; }
      }
      logActivity(`${row.id} ${approve ? 'approved' : 'rejected'}`, approve ? 'green' : 'red', 'online-payments');
      return ok(approve ? `${row.id} approved. Order moved to processing.` : `${row.id} rejected. Order cancelled.`);
    }
    case 'collect': {
      const amount = round2(values.amount);
      if (amount <= 0) return { error: 'Enter an amount above zero.' };
      if (amount > num(row.outstanding)) return { error: `The outstanding balance is only ${money(row.outstanding)}.` };
      row.outstanding = round2(num(row.outstanding) - amount);
      let left = amount;
      d().bills.filter((b) => b.customer === row.name && b.status === 'Pending' && b.method === 'Credit').reverse().forEach((b) => { if (left >= b.total) { b.status = 'Completed'; left = round2(left - b.total); } });
      logActivity(`Received ${money(amount)} from ${row.name}`, 'green', 'customers'); return ok(`Payment of ${money(amount)} recorded.`);
    }
    case 'adjust-points': {
      const delta = Math.trunc(num(values.delta));
      if (!delta) return { error: 'Enter a number of points.' };
      row.loyalty = Math.max(0, num(row.loyalty) + delta); return ok(`${row.name} now has ${row.loyalty} points.`);
    }
    case 'adjust-stock': {
      const delta = Math.trunc(num(values.delta));
      if (!delta) return { error: 'Enter a quantity above or below zero.' };
      const next = num(row.stockQty) + delta;
      if (next < 0 && !state.settings.allowNegativeStock) return { error: `Only ${row.stockQty} on hand; stock can't go below zero.` };
      row.stockQty = next; syncProductStatus(row);
      logActivity(`${row.name} stock ${delta > 0 ? '+' : ''}${delta} (${values.reason || 'Adjustment'})`, 'blue', 'inventory'); return ok(`${row.name}: ${row.stockQty} on hand.`);
    }
    case 'sell-product': addToCart(row.sku); return { next: { view: 'sell' }, message: null };
    case 'toggle-category': row.status = row.status === 'Archived' ? 'Active' : 'Archived'; row.updatedAt = Date.now(); return ok(`${row.name} ${row.status === 'Archived' ? 'archived' : 'reactivated'}.`);
    case 'count-sheet': return { next: { modal: { type: 'count', index } } };
    case 'approve-transfer': row.status = 'Approved'; return ok(`${row.id} approved.`);
    case 'send-transfer': row.status = state.settings.autoReceive ? 'Received' : 'In transit'; return ok(state.settings.autoReceive ? `${row.id} received at destination.` : `${row.id} is in transit.`);
    case 'receive-transfer': row.status = 'Received'; return ok(`${row.id} received at ${row.to}.`);
    case 'cancel-transfer': row.status = 'Cancelled'; return ok(`${row.id} cancelled.`);
    case 'toggle-supplier': row.status = row.status === 'On hold' ? 'Active' : 'On hold'; return ok(`${row.name} ${row.status === 'On hold' ? 'put on hold' : 'reactivated'}.`);
    case 'new-po': return { next: { view: 'purchase-orders', modal: { type: 'create', key: 'purchaseOrders', values: { supplier: row.name } } } };
    case 'approve-po': row.status = 'Awaiting delivery'; return ok(`${row.id} approved.`);
    case 'receive-po': return { next: { view: 'receive-stock', receivePo: row.id } };
    case 'cancel-po': row.status = 'Cancelled'; return ok(`${row.id} cancelled.`);
    case 'advance-order': {
      const order = row;
      if (order.status === 'Payment review') { const pay = d().onlinePayments.find((p) => p.order === order.id); if (pay) pay.status = 'Approved'; order.status = 'Processing'; }
      else if (order.status === 'Processing') order.status = 'Ready to ship';
      else if (order.status === 'Ready to ship') order.status = 'Completed';
      logActivity(`${order.id} is now ${order.status.toLowerCase()}`, 'blue', 'online-orders'); return ok(`${order.id}: ${order.status}.`);
    }
    case 'cancel-order': {
      releaseOrderStock(row); row.status = 'Cancelled';
      const pay = d().onlinePayments.find((p) => p.order === row.id); if (pay && pay.status === 'Review') pay.status = 'Rejected';
      return ok(`${row.id} cancelled.`);
    }
    case 'approve-expense': row.status = 'Approved'; applyExpense(row, 1); return ok('Expense approved.');
    case 'reject-expense': row.status = 'Rejected'; return ok('Expense rejected.');
    default: return { error: 'Unknown action.' };
  }
}

function releaseOrderStock(order) {
  if (!state.settings.syncInventory || order.stockReleased || order.status === 'Cancelled' || order.status === 'Completed') return;
  if (!order.stockReserved) return;
  (order.lines || []).forEach((l) => { const p = productBySku(l.sku); if (p) { p.stockQty = num(p.stockQty) + l.qty; syncProductStatus(p); } });
  order.stockReleased = true;
}

function reverseBill(bill, status) {
  const wasPending = bill.status === 'Pending';
  if (state.settings.trackStock !== false) (bill.lines || []).forEach((l) => { const p = productBySku(l.sku); if (p) { p.stockQty = num(p.stockQty) + l.qty; syncProductStatus(p); } });
  const c = customerByName(bill.customer);
  if (c) {
    c.visits = Math.max(0, num(c.visits) - 1);
    c.loyalty = Math.max(0, num(c.loyalty) - num(bill.pointsEarned) + num(bill.pointsUsed));
    if (bill.method === 'Credit' && wasPending) c.outstanding = Math.max(0, round2(num(c.outstanding) - bill.total));
  }
  if (bill.giftCode) { const card = d().giftCards.find((g) => g.code === bill.giftCode); if (card) { card.balance = round2(card.balance + bill.total); if (card.status === 'Redeemed') card.status = 'Active'; } }
  bill.status = status;
}

/* ---------- cart ---------- */
export function addToCart(sku) {
  const p = productBySku(sku);
  if (!p) return 'Product not found.';
  const line = state.cart.find((l) => l.sku === sku);
  const qty = (line?.quantity || 0) + 1;
  if (state.settings.trackStock !== false && !state.settings.allowNegativeStock && qty > num(p.stockQty)) { toast(num(p.stockQty) <= 0 ? `${p.name} is out of stock.` : `Only ${p.stockQty} ${p.name} in stock.`, 'warn'); return 'stock'; }
  if (line) line.quantity = qty; else state.cart.push({ sku: p.sku, name: p.name, price: p.price, category: p.category, quantity: 1 });
  save(); return null;
}
export function updateCart(sku, delta, name) {
  const line = state.cart.find((l) => (sku ? l.sku === sku : l.name === name));
  if (!line) return;
  const p = sku ? productBySku(sku) : null;
  const next = line.quantity + delta;
  if (delta > 0 && p && state.settings.trackStock !== false && !state.settings.allowNegativeStock && next > num(p.stockQty)) { toast(`Only ${p.stockQty} ${p.name} in stock.`, 'warn'); return; }
  line.quantity = next;
  if (line.quantity <= 0) state.cart = state.cart.filter((l) => l !== line);
  save();
}
export function clearCart() { state.cart = []; state.cartQuote = null; state.cartDiscount = ''; state.redeemPoints = false; save(); }

export function cartTotals() {
  const s = state.settings;
  const subtotal = round2(state.cart.reduce((sum, l) => sum + l.price * l.quantity, 0));
  const dv = Math.max(0, num(state.cartDiscount));
  let discount = state.cartDiscountType === 'percent' ? subtotal * Math.min(dv, 100) / 100 : Math.min(dv, subtotal);
  discount = round2(discount);
  const customer = customerByName(state.cartCustomer);
  let pointsUsed = 0; let redeem = 0;
  if (state.redeemPoints && s.enabled !== false && customer && num(s.redemptionValue) > 0) {
    const blocks = Math.min(Math.floor(num(customer.loyalty) / 100), Math.ceil((subtotal - discount) / num(s.redemptionValue)));
    redeem = round2(Math.min(blocks * num(s.redemptionValue), subtotal - discount)); pointsUsed = blocks > 0 ? blocks * 100 : 0;
  }
  const net = round2(subtotal - discount - redeem);
  const service = round2(net * num(s.serviceFee) / 100);
  const rate = num(s.taxRate);
  const tax = s.pricesIncludeTax ? round2(net * rate / (100 + rate)) : round2(net * rate / 100);
  const total = round2(s.pricesIncludeTax ? net + service : net + tax + service);
  const earned = s.enabled !== false && customer ? Math.floor(total / 100) * num(s.pointsPerUnit) : 0;
  return { subtotal, discount, redeem, pointsUsed, net, service, tax, total, earned, units: state.cart.reduce((n, l) => n + l.quantity, 0), customer };
}

export function paymentMethods() {
  const s = state.settings;
  return [['Cash', s.cashEnabled], ['Card', s.cardEnabled], ['Transfer', s.transferEnabled], ['Credit', s.creditEnabled], ['Gift card', true]].filter(([, on]) => on !== false).map(([m]) => m);
}

export function completeSale(values) {
  const session = openSession();
  if (!session) return 'Open the register before completing a sale.';
  if (!state.cart.length) return 'The cart is empty.';
  const t = cartTotals(); const method = values.method;
  if (!paymentMethods().includes(method)) return `${method} payments are turned off in settings.`;
  const customerName = state.cartCustomer; const customer = t.customer;
  let tendered = null; let change = 0; let card = null;
  if (method === 'Cash') { tendered = round2(values.tendered === '' || values.tendered == null ? t.total : values.tendered); if (tendered < t.total) return `Cash received is short by ${money(t.total - tendered)}.`; change = round2(tendered - t.total); }
  if (method === 'Credit') {
    if (!customer) return 'Choose a saved customer for a credit sale.';
    if (customer.status === 'Blocked') return `${customer.name} is blocked from credit.`;
    const avail = num(customer.creditLimit || 3000) - num(customer.outstanding);
    if (t.total > avail) return `Over the credit limit. Available credit: ${money(Math.max(0, avail))}.`;
  }
  if (method === 'Gift card') {
    card = d().giftCards.find((g) => g.code === values.giftCode && g.status === 'Active');
    if (!card) return 'Choose an active gift card.';
    if (card.balance < t.total) return `Gift card balance is ${money(card.balance)}.`;
    if (card.expires && card.expires < Date.now()) return 'This gift card has expired.';
  }
  if (state.settings.trackStock !== false && !state.settings.allowNegativeStock) {
    for (const l of state.cart) { const p = l.sku ? productBySku(l.sku) : null; if (p && num(p.stockQty) < l.quantity) return `${p.name}: only ${p.stockQty} in stock.`; }
  }
  const year = new Date().getFullYear();
  const bill = {
    id: `AF-${year}-${String(nextSeq(d().bills)).padStart(5, '0')}`, date: Date.now(), customer: customerName, items: t.units, method,
    subtotal: t.subtotal, discount: round2(t.discount + t.redeem), serviceFee: t.service, tax: t.tax, total: t.total, outlet: session.outlet, sessionId: session.id,
    status: method === 'Credit' ? 'Pending' : 'Completed', lines: state.cart.map((l) => ({ sku: l.sku, name: l.name, price: l.price, qty: l.quantity })), note: values.note || '',
    tendered, change, giftCode: card?.code || null, pointsEarned: t.earned, pointsUsed: t.pointsUsed,
  };
  d().bills.unshift(bill);
  if (state.settings.trackStock !== false) state.cart.forEach((l) => { const p = l.sku ? productBySku(l.sku) : null; if (p) { p.stockQty = num(p.stockQty) - l.quantity; syncProductStatus(p); } });
  if (customer) {
    customer.visits = num(customer.visits) + 1;
    customer.loyalty = Math.max(0, num(customer.loyalty) - t.pointsUsed + t.earned);
    if (method === 'Credit') customer.outstanding = round2(num(customer.outstanding) + t.total);
  }
  if (card) { card.balance = round2(card.balance - t.total); if (card.balance <= 0) card.status = 'Redeemed'; }
  if (state.cartQuote) { const q = d().quotations.find((x) => x.id === state.cartQuote); if (q) q.status = 'Converted'; }
  logActivity(`Sale ${bill.id} · ${money(bill.total)} (${method})`, 'green', 'bill-history');
  state.cart = []; state.cartQuote = null; state.cartDiscount = ''; state.redeemPoints = false; state.cartCustomer = 'Walk-in customer';
  state.modal = { type: 'receipt', billId: bill.id, fresh: true };
  save(); return null;
}

export function saveCartAsQuote() {
  if (!state.cart.length) return 'The cart is empty.';
  const t = cartTotals();
  const q = { id: makeId('QT-', d().quotations), customer: state.cartCustomer, createdAt: Date.now(), items: t.units, total: t.total, expires: Date.now() + 7 * DAY, status: 'Open', note: '', lines: state.cart.map((l) => ({ sku: l.sku, name: l.name, price: l.price, qty: l.quantity })) };
  d().quotations.unshift(q);
  logActivity(`Quotation ${q.id} saved`, 'blue', 'quotations');
  clearCart(); save(); return q.id;
}

function convertQuote(q) {
  state.cart = (q.lines && q.lines.length ? q.lines : [{ sku: null, name: `Quoted items (${q.items})`, price: q.total, qty: 1 }]).map((l) => {
    const p = l.sku ? productBySku(l.sku) : null;
    return { sku: l.sku, name: l.name, price: l.price, category: p?.category || '', quantity: l.qty };
  });
  state.cartCustomer = customerByName(q.customer) ? q.customer : 'Walk-in customer';
  state.cartQuote = q.id; state.cartDiscount = '';
  save(); return { message: `${q.id} loaded into the sale. Complete checkout to convert it.`, next: { view: 'sell' } };
}

/* ---------- register ---------- */
export function openRegister(values) {
  if (openSession()) return 'A register session is already open. Close it first.';
  const float = num(values.openingFloat);
  if (float < 0) return 'Opening float cannot be negative.';
  const register = values.register || 'Front counter';
  const s = { id: makeId('SES-', d().sessions), register, openedBy: String(values.openedBy || '').trim() || 'Adflare Owner', openedAt: Date.now(), closedAt: null, openingFloat: float, cashIn: 0, cashOut: 0, expectedCash: null, counted: null, variance: null, status: 'Open', outlet: register === 'Branch 1 counter' ? 'Branch 1' : 'Main branch', activity: [{ ts: Date.now(), text: 'Register opened', amount: float, tone: 'green' }] };
  d().sessions.unshift(s);
  logActivity(`${register} opened (${s.id})`, 'green', 'register');
  save(); return null;
}
export function closeRegister(sessionId, values) {
  const s = d().sessions.find((x) => x.id === sessionId);
  if (!s || s.status !== 'Open') return 'That session is not open.';
  const counted = values.counted === '' || values.counted == null ? null : num(values.counted);
  if (counted == null || counted < 0) return 'Enter the cash you counted in the drawer.';
  const expected = sessionStats(s).expected;
  s.expectedCash = expected; s.counted = counted; s.variance = round2(counted - expected); s.closedAt = Date.now(); s.status = 'Closed';
  s.activity.unshift({ ts: Date.now(), text: 'Register closed', amount: counted, tone: 'blue' });
  logActivity(`${s.register} closed · variance ${s.variance >= 0 ? '+' : ''}${s.variance}`, 'blue', 'sessions');
  save(); return null;
}
export function cashMove(values) {
  const s = openSession();
  if (!s) return 'Open the register first.';
  const amount = round2(values.amount);
  if (amount <= 0) return 'Enter an amount above zero.';
  const reason = String(values.reason || '').trim() || (values.kind === 'out' ? 'Cash out' : 'Cash in');
  if (values.kind === 'out') { if (amount > sessionStats(s).expected) return 'There is not enough cash in the drawer.'; s.cashOut = round2(num(s.cashOut) + amount); s.activity.unshift({ ts: Date.now(), text: `Cash out · ${reason}`, amount: -amount, tone: 'red' }); }
  else { s.cashIn = round2(num(s.cashIn) + amount); s.activity.unshift({ ts: Date.now(), text: `Cash in · ${reason}`, amount, tone: 'blue' }); }
  save(); return null;
}

/* ---------- stock ---------- */
export function receiveStock(values) {
  const po = d().purchaseOrders.find((p) => p.id === values.purchaseOrder);
  const product = productBySku(values.sku);
  const qty = Math.floor(num(values.quantity));
  if (!po || !['Awaiting delivery', 'Part received'].includes(po.status)) return 'Choose a purchase order that is awaiting delivery.';
  if (!product) return 'Choose a product.';
  if (qty < 1) return 'Quantity must be at least 1.';
  const remaining = num(po.items) - num(po.receivedUnits);
  if (qty > remaining) return `Only ${remaining} unit${remaining === 1 ? '' : 's'} still expected on ${po.id}.`;
  product.stockQty = num(product.stockQty) + qty; syncProductStatus(product);
  po.receivedUnits = num(po.receivedUnits) + qty;
  po.status = po.receivedUnits >= po.items ? 'Received' : 'Part received';
  d().receipts.unshift({ id: makeId('RCV-', d().receipts), purchaseOrder: po.id, product: product.name, quantity: qty, receivedAt: fromInputDate(values.receivedAt) || Date.now(), note: String(values.note || '').trim(), status: 'Received' });
  logActivity(`Received ${qty} × ${product.name} on ${po.id}`, 'green', 'receive-stock');
  save(); return null;
}
export function applyStockCount(index, counts) {
  const sc = d().stockCounts[index];
  if (!sc) return 'Count not found.';
  let diffs = 0;
  d().products.forEach((p) => {
    const raw = counts[p.sku];
    if (raw === '' || raw == null) return;
    const counted = Math.max(0, Math.floor(num(raw)));
    if (counted !== num(p.stockQty)) { diffs++; p.stockQty = counted; syncProductStatus(p); }
  });
  sc.items = d().products.length; sc.variance = diffs; sc.status = 'Completed';
  logActivity(`${sc.id} completed · ${diffs} adjustment${diffs === 1 ? '' : 's'}`, 'blue', 'stock-counts');
  save(); return null;
}

/* ---------- online orders ---------- */
export function simulateOnlineOrder() {
  const r = rng(Date.now() % 100000);
  const stocked = d().products.filter((p) => num(p.stockQty) > 0);
  if (!stocked.length) return 'No products in stock to order.';
  const lines = []; const used = new Set();
  for (let i = 0; i < r.int(1, 3); i++) { const p = r.pick(stocked); if (used.has(p.sku)) continue; used.add(p.sku); lines.push({ sku: p.sku, name: p.name, price: p.price, qty: Math.min(r.int(1, 2), num(p.stockQty)) }); }
  const total = round2(lines.reduce((s, l) => s + l.price * l.qty, 0));
  const customer = r.pick(d().customers).name; const method = r() < 0.5 ? 'Card' : 'Bank transfer';
  const auto = Boolean(state.settings.autoAccept);
  const order = { id: makeId('ON-', d().onlineOrders), channel: r.pick(['Web store', 'Instagram', 'Marketplace']), customer, date: Date.now(), items: lines.reduce((s, l) => s + l.qty, 0), total, outlet: 'Main branch', lines, status: method === 'Card' || auto ? 'Processing' : 'Payment review' };
  d().onlinePayments.unshift({ id: makeId('PAY-', d().onlinePayments), order: order.id, customer, method, submittedAt: Date.now(), amount: total, status: method === 'Card' || auto ? 'Approved' : 'Review' });
  if (state.settings.syncInventory !== false) { lines.forEach((l) => { const p = productBySku(l.sku); if (p) { p.stockQty = Math.max(0, num(p.stockQty) - l.qty); syncProductStatus(p); } }); order.stockReserved = true; }
  d().onlineOrders.unshift(order);
  if (state.settings.orderNotifications !== false) logActivity(`New online order ${order.id} · ${money(total)}`, 'blue', 'online-orders');
  save(); return order.id;
}

/* ---------- settings ---------- */
export function saveSettings(fields, values) {
  const next = { ...state.settings };
  for (const [key, , type] of fields) {
    if (type === 'checkbox') next[key] = Boolean(values[key]);
    else if (type === 'number') { const n = Number(values[key]); if (values[key] === '' || !Number.isFinite(n) || n < 0) return 'Enter a valid number (zero or more).'; next[key] = n; }
    else next[key] = values[key];
  }
  if (!next.cashEnabled && !next.cardEnabled && !next.transferEnabled && !next.creditEnabled) return 'Keep at least one payment method enabled.';
  state.settings = next;
  d().products.forEach(syncProductStatus);
  save(); return null;
}

/* ---------- export ---------- */
function download(name, mime, content) {
  const url = URL.createObjectURL(new Blob([content], { type: mime }));
  const a = document.createElement('a'); a.href = url; a.download = name; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
export function exportCsv(name, columns, rows, dataKey) {
  const head = columns.map(([, label]) => csvEscape(label)).join(',');
  const body = rows.map((row) => columns.map(([key]) => {
    let v = row[key];
    if (DATE_COLS.has(key) && typeof v === 'number') v = fmtDate(v, !(key === 'expires' || key === 'expectedAt'));
    return csvEscape(v);
  }).join(',')).join('\n');
  download(`adflare-${name}.csv`, 'text/csv;charset=utf-8', `${head}\n${body}`);
}
export function exportAllJson() { download('adflare-pos-demo-data.json', 'application/json', JSON.stringify({ exportedAt: new Date().toISOString(), settings: state.settings, data: state.data }, null, 2)); }

export { flush, go, esc, getRows, STATUS_OPTIONS, OUTLETS, DATE_FIELD };
