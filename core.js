/*
 * Core: shared state, browser persistence, formatters and toast.
 * Everything is stored in localStorage so the dashboard works with no backend.
 * When Supabase is added later, replace load()/flush() (and the mutations in actions.js)
 * with API calls — the views only read from `state.data`.
 */
import { demoSettings, pageMeta } from '../data/demo.js';
import { buildSeed } from './seed.js';
import { clone, esc } from './util.js';
import { svgIcon } from './icons.js';

const STORAGE_KEY = 'afpos-demo-v2';
export const USD_RATE = 15.42;

export const state = {
  view: 'home',
  data: null,
  settings: null,
  // table UI
  query: '', statusFilter: 'all', tablePeriod: 'All time', sort: { key: null, dir: 1 }, page: 0, pageSize: 10,
  // sell
  cart: [], cartCustomer: 'Walk-in customer', cartDiscount: '', cartDiscountType: 'amount', redeemPoints: false, cartQuote: null,
  productQuery: '', productCategory: 'all', inStockOnly: false,
  // chrome
  modal: null, mobileNav: false, outlet: 'All branches', outletMenuOpen: false, period: 'Last 7 days', chartMetric: 'sales',
  popover: null, gq: '', notifSeen: '', modalReturnSelector: null, restoreFocusSelector: null,
};

export const hooks = { render: () => {}, renderTable: () => {} };
export const render = () => hooks.render();

function migrateBranches(node) {
  const RENAME = { 'Main store': 'Main branch', 'Studio kiosk': 'Branch 1', 'Pop-up booth': 'Branch 2' };
  if (Array.isArray(node)) { node.forEach(migrateBranches); return; }
  if (!node || typeof node !== 'object') return;
  Object.keys(node).forEach((k) => {
    const v = node[k];
    if (typeof v === 'string') {
      if (k === 'register' && v === 'Studio kiosk') node[k] = 'Branch 1 counter';
      else if ((k === 'outlet' || k === 'from' || k === 'to') && RENAME[v]) node[k] = RENAME[v];
    } else migrateBranches(v);
  });
}

function applyPersisted(saved) {
  migrateBranches(saved.data);
  state.data = saved.data;
  state.settings = { ...clone(demoSettings), ...(saved.settings || {}) };
  state.cart = saved.cart || [];
  state.cartCustomer = saved.cartCustomer || 'Walk-in customer';
  const OLD_BRANCH = { 'Main store': 'Main branch', 'Studio kiosk': 'Branch 1', 'Pop-up booth': 'Branch 2' };
  state.outlet = !saved.outlet || saved.outlet === 'All outlets' || saved.outlet === 'All shops' ? 'All branches' : (OLD_BRANCH[saved.outlet] || saved.outlet);
  state.period = saved.period || 'Last 7 days';
  state.notifSeen = saved.notifSeen || '';
}

export function initState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (saved && saved.v === 2 && saved.data && saved.data.bills) applyPersisted(saved);
    }
  } catch (error) { /* corrupt or blocked storage: fall back to a fresh seed */ }
  if (!state.data) resetData();
  window.addEventListener('beforeunload', flush);
}

export function resetData() {
  state.data = buildSeed();
  state.settings = clone(demoSettings);
  state.cart = []; state.cartCustomer = 'Walk-in customer'; state.cartQuote = null; state.cartDiscount = '';
  state.notifSeen = '';
  flush();
}

let timer;
export function save() { clearTimeout(timer); timer = setTimeout(flush, 120); }
export function flush() {
  clearTimeout(timer);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: 2, data: state.data, settings: state.settings, cart: state.cart, cartCustomer: state.cartCustomer, outlet: state.outlet, period: state.period, notifSeen: state.notifSeen }));
  } catch (error) { /* storage full or unavailable: keep working in memory */ }
}

/* ---------- formatting ---------- */
export function money(value) {
  const usd = state.settings?.currency === 'USD';
  const n = Number(value || 0) / (usd ? USD_RATE : 1);
  return `${usd ? 'USD' : 'MVR'} ${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
export const moneyShort = (value) => {
  const usd = state.settings?.currency === 'USD';
  const n = Number(value || 0) / (usd ? USD_RATE : 1);
  const abs = Math.abs(n);
  const body = abs >= 1000 ? `${(n / 1000).toFixed(abs >= 10000 ? 0 : 1).replace(/\.0$/, '')}k` : String(Math.round(n));
  return `${usd ? 'USD' : 'MVR'} ${body}`;
};
export const signed = (value) => `${Number(value) > 0 ? '+' : ''}${Number(value || 0).toLocaleString('en-US')}`;

export function statusClass(status) {
  const value = String(status || '').toLowerCase();
  if (/(complete|approved|active|received|in stock|on track|^open$|converted|ready|redeemed)/.test(value)) return 'status-good';
  if (/(review|pending|progress|await|low|draft|over budget|transit|processing|part)/.test(value)) return 'status-warn';
  if (/(void|cancel|reject|out of stock|expired|hold|closed|refund|blocked|archived)/.test(value)) return 'status-bad';
  return 'status-neutral';
}

/* ---------- toast ---------- */
let toastTimer;
export function toast(message, tone = 'ok') {
  const app = document.querySelector('#app');
  if (!app) return;
  let el = app.querySelector('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); app.append(el); }
  el.classList.toggle('toast-warn', tone === 'warn');
  el.innerHTML = `${svgIcon(tone === 'warn' ? 'info' : 'check', 16)}<span>${esc(message)}</span>`;
  requestAnimationFrame(() => el.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 250); }, 2600);
}

/* ---------- small selectors ---------- */
export const openSession = () => state.data.sessions.find((s) => s.status === 'Open') || null;
export const outletMatches = (row) => state.outlet === 'All branches' || !row.outlet || row.outlet === state.outlet;
export function logActivity(text, tone = 'blue', view = null) {
  state.data.activity = state.data.activity || [];
  state.data.activity.unshift({ ts: Date.now(), text, tone, view });
  state.data.activity.length = Math.min(state.data.activity.length, 40);
}
export function productStatus(product) {
  const qty = Number(product.stockQty || 0);
  if (qty <= 0) return 'Out of stock';
  if (qty <= Number(state.settings.lowStockThreshold ?? 10)) return 'Low stock';
  return 'In stock';
}
export const syncProductStatus = (product) => { product.status = productStatus(product); };

/* ---------- navigation ---------- */
export function go(view) {
  if (!pageMeta[view]) return;
  state.view = view; state.modal = null; state.query = ''; state.statusFilter = 'all'; state.page = 0;
  state.sort = { key: null, dir: 1 }; state.tablePeriod = 'All time'; state.mobileNav = false; state.popover = null; state.gq = '';
  render();
  try { history.replaceState(null, '', `?demo=1#${encodeURIComponent(view)}`); } catch (e) { /* ignore */ }
  window.scrollTo?.(0, 0);
}
