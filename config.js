import { state } from './core.js';
import { toInputDate, addMonths, DAY } from './util.js';

export const DATE_COLS = new Set(['date', 'createdAt', 'issuedAt', 'submittedAt', 'openedAt', 'closedAt', 'startedAt', 'receivedAt', 'updatedAt', 'expires', 'expectedAt', 'joinedAt']);
export const DATE_ONLY = (dataKey, key) => key === 'expires' || key === 'expectedAt' || (dataKey === 'landedCosts' && key === 'date');
export const MONEY_COLS = new Set(['total', 'amount', 'balance', 'outstanding', 'price', 'revenue', 'expectedCash', 'freight', 'duties', 'other', 'budget', 'monthToDate', 'openingFloat', 'counted', 'creditLimit']);
export const OUTLETS = ['Main branch', 'Branch 1', 'Branch 2'];

export const STATUS_OPTIONS = {
  products: ['In stock', 'Low stock', 'Out of stock'], customers: ['Active', 'Review', 'Blocked'], categories: ['Active', 'Archived'],
  giftCards: ['Active', 'Redeemed', 'Cancelled', 'Expired'], quotations: ['Open', 'Converted', 'Expired', 'Cancelled'],
  onlinePayments: ['Review', 'Approved', 'Rejected'], bills: ['Completed', 'Pending', 'Voided', 'Refunded'], sessions: ['Open', 'Closed'],
  stockCounts: ['In progress', 'Completed'], transfers: ['Draft', 'Approved', 'In transit', 'Received', 'Cancelled'], suppliers: ['Active', 'On hold'],
  purchaseOrders: ['Pending approval', 'Awaiting delivery', 'Part received', 'Received', 'Cancelled'],
  onlineOrders: ['Payment review', 'Processing', 'Ready to ship', 'Completed', 'Cancelled'], expenses: ['Review', 'Approved', 'Rejected'],
  expenseCategories: ['On track', 'Over budget'],
};
export const EDITABLE = new Set(['customers', 'products', 'categories', 'giftCards', 'quotations', 'suppliers', 'purchaseOrders', 'landedCosts', 'expenses', 'expenseCategories', 'stockCounts', 'transfers']);
export const DELETABLE = EDITABLE;
const EDIT_STATUS = new Set(['customers', 'categories', 'suppliers', 'giftCards', 'quotations']);
export const NAME_KEY = { customers: 'name', products: 'sku', categories: 'name', giftCards: 'code', suppliers: 'name', expenseCategories: 'name' };

const f = (name, label, type = 'text', required = false, extra = {}) => ({ name, label, type, required, ...extra });
const names = (list, key = 'name') => list.map((x) => x[key]);
const enabledMethods = () => ['Cash', 'Card', 'Transfer', 'Credit'].filter((m) => state.settings[{ Cash: 'cashEnabled', Card: 'cardEnabled', Transfer: 'transferEnabled', Credit: 'creditEnabled' }[m]] !== false);

/* Field definitions. `row` is the record being edited (undefined when creating). */
export function getFields(key, row) {
  const d = state.data; const s = state.settings; const edit = Boolean(row);
  const val = (name, fallback = '') => (edit ? row[name] ?? fallback : fallback);
  const date = (name, fallbackTs) => (edit ? toInputDate(row[name]) : fallbackTs ? toInputDate(fallbackTs) : '');
  const status = () => (edit && EDIT_STATUS.has(key) ? [f('status', 'Status', 'select', true, { options: STATUS_OPTIONS[key], value: row.status })] : []);
  const now = Date.now();
  const customers = ['Walk-in customer', ...names(d.customers)];
  switch (key) {
    case 'customers': return [f('name', 'Customer name', 'text', true, { value: val('name') }), f('mobile', 'Phone', 'tel', false, { value: val('mobile') }), f('email', 'Email', 'email', false, { value: val('email') }), f('address', 'Address', 'text', false, { value: val('address') }), f('loyalty', 'Loyalty points', 'number', false, { value: val('loyalty', 0), min: 0 }), f('creditLimit', 'Credit limit (MVR)', 'number', false, { value: val('creditLimit', 3000), min: 0 }), ...status()];
    case 'products': return [f('sku', 'SKU', 'text', true, { value: val('sku', `${s.skuPrefix || 'AF'}-${1001 + d.products.length}`) }), f('name', 'Product name', 'text', true, { value: val('name') }), f('category', 'Category', 'select', true, { options: names(d.categories), value: val('category', d.categories[0]?.name) }), f('stockQty', edit ? 'On hand' : 'Opening stock', 'number', true, { value: val('stockQty', 0), min: 0, step: 1 }), f('price', 'Price (MVR)', 'number', true, { value: val('price'), min: 0, step: 'any' })];
    case 'categories': return [f('name', 'Category name', 'text', true, { value: val('name') }), f('description', 'Description', 'text', false, { value: val('description') }), ...status()];
    case 'giftCards': return [f('code', 'Card number', 'text', true, { value: val('code', `GC-${String(Math.floor(now / 1000) % 1000000).padStart(6, '0')}`) }), f('customer', 'Customer', 'select', false, { options: customers, value: val('customer', 'Walk-in customer') }), f('balance', edit ? 'Balance' : 'Initial value', 'number', true, { value: val('balance', s.minimumValue || 100), min: 0, step: 'any' }), f('expires', 'Expires', 'date', false, { value: date('expires', addMonths(now, Number(s.defaultExpiry || 12))) }), ...status()];
    case 'quotations': return [f('customer', 'Customer', 'select', true, { options: customers, value: val('customer', 'Walk-in customer') }), f('items', 'Units', 'number', true, { value: val('items', 1), min: 1, step: 1 }), f('total', 'Total', 'number', true, { value: val('total'), min: 0, step: 'any' }), f('expires', 'Valid until', 'date', false, { value: date('expires', now + 7 * DAY) }), f('note', 'Notes', 'text', false, { value: val('note'), span: true }), ...status()];
    case 'stockCounts': return [f('outlet', 'Branch', 'select', true, { options: OUTLETS, value: val('outlet', 'Main branch') }), f('scope', 'Count scope', 'text', true, { value: val('scope', 'All products') }), f('startedAt', 'Start date', 'date', true, { value: date('startedAt', now) })];
    case 'transfers': return [f('from', 'From branch', 'select', true, { options: OUTLETS, value: val('from', 'Main branch') }), f('to', 'To branch', 'select', true, { options: OUTLETS, value: val('to', 'Branch 1') }), f('items', 'Number of items', 'number', true, { value: val('items', 1), min: 1, step: 1 }), f('note', 'Note', 'text', false, { value: val('note') })];
    case 'suppliers': return [f('name', 'Supplier name', 'text', true, { value: val('name') }), f('contact', 'Contact name', 'text', false, { value: val('contact') }), f('email', 'Email', 'email', false, { value: val('email') }), f('phone', 'Phone', 'tel', false, { value: val('phone') }), f('leadTime', 'Lead time (days)', 'number', false, { value: String(val('leadTime', s.defaultLeadTime || 4)).replace(/\D/g, ''), min: 0, step: 1 }), ...status()];
    case 'purchaseOrders': return [f('supplier', 'Supplier', 'select', true, { options: names(d.suppliers), value: val('supplier', d.suppliers[0]?.name) }), f('expectedAt', 'Expected date', 'date', false, { value: date('expectedAt', now + Number(s.defaultLeadTime || 4) * DAY) }), f('items', 'Units ordered', 'number', true, { value: val('items', 10), min: 1, step: 1 }), f('total', 'Estimated total', 'number', true, { value: val('total'), min: 0, step: 'any' })];
    case 'landedCosts': return [f('purchaseOrder', 'Purchase order', 'select', true, { options: names(d.purchaseOrders, 'id'), value: val('purchaseOrder', d.purchaseOrders[0]?.id) }), f('freight', 'Freight', 'number', true, { value: val('freight', 0), min: 0, step: 'any' }), f('duties', 'Duties', 'number', false, { value: val('duties', 0), min: 0, step: 'any' }), f('other', 'Other costs', 'number', false, { value: val('other', 0), min: 0, step: 'any' }), f('date', 'Date', 'date', false, { value: date('date', now) })];
    case 'expenses': return [f('date', 'Date', 'date', true, { value: date('date', now) }), f('category', 'Category', 'select', true, { options: names(d.expenseCategories), value: val('category', d.expenseCategories[0]?.name) }), f('description', 'Description', 'text', true, { value: val('description') }), f('payee', 'Payee', 'text', false, { value: val('payee') }), f('amount', 'Amount (MVR)', 'number', true, { value: val('amount'), min: 0, step: 'any' }), f('method', 'Payment method', 'select', false, { options: enabledMethods(), value: val('method', 'Cash') }), f('receipt', `Receipt reference${s.requireReceipt ? ` (required above MVR ${s.approvalLimit})` : ''}`, 'text', false, { value: val('receipt'), span: true })];
    case 'expenseCategories': return [f('name', 'Category name', 'text', true, { value: val('name') }), f('budget', 'Monthly budget (MVR)', 'number', false, { value: val('budget', 0), min: 0, step: 'any' })];
    default: return [];
  }
}

export const CREATE_LABEL = { customers: 'Add customer', products: 'Add product', categories: 'Add category', giftCards: 'Issue gift card', quotations: 'New quotation', stockCounts: 'Start stock count', transfers: 'New transfer', suppliers: 'Add supplier', purchaseOrders: 'Create purchase order', landedCosts: 'Add landed cost', expenses: 'New expense', expenseCategories: 'Add category' };
