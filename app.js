import { pageMeta } from './data/demo.js';
import { state, hooks, initState, save, toast, go, openSession, resetData, flush, money } from './lib/core.js';
import { num } from './lib/util.js';
import { renderSidebar, renderTopbar, renderNotice, renderPage, renderCartPanel, renderProductTiles, renderTableCard, queryRows } from './lib/views.js';
import { renderModal } from './lib/modals.js';
import { notificationSignature, REPORT_SOURCE } from './lib/selectors.js';
import * as A from './lib/actions.js';

const app = document.querySelector('#app');
const demoAllowed = new URLSearchParams(location.search).get('demo') === '1' && sessionStorage.getItem('afpos-demo-auth') === '1';

if (!demoAllowed) location.replace('/pos.html');
else boot();

function boot() {
  initState();
  const hashView = decodeURIComponent(location.hash.slice(1));
  if (pageMeta[hashView]) state.view = hashView;
  hooks.render = rootRender;
  rootRender();
  app.addEventListener('click', onClick);
  app.addEventListener('input', onInput);
  app.addEventListener('change', onChange);
  app.addEventListener('submit', onSubmit);
  document.addEventListener('keydown', onKeydown);
  window.addEventListener('hashchange', () => { const v = decodeURIComponent(location.hash.slice(1)); if (pageMeta[v] && v !== state.view) go(v); });
}

/* ====================== rendering ====================== */
function rootRender() {
  const meta = pageMeta[state.view] || pageMeta.home;
  const hadDialogFocus = Boolean(app.querySelector('[role="dialog"]')?.contains(document.activeElement));
  const scroll = app.querySelector('.modal-card')?.scrollTop || 0;
  app.innerHTML = `
    <div class="app-shell ${state.mobileNav ? 'nav-open' : ''}">
      <div class="mobile-scrim" data-action="close-nav"></div>
      ${renderSidebar()}
      <section class="workspace">
        ${renderTopbar(meta)}
        <main class="page-content" id="page-content">${renderNotice()}${renderPage(meta)}</main>
      </section>
      ${state.modal ? renderModal() : ''}
    </div>`;
  if (state.modal) {
    const dialog = app.querySelector('[role="dialog"]');
    if (dialog) {
      const card = app.querySelector('.modal-card'); if (card) card.scrollTop = scroll;
      const target = hadDialogFocus && state.modal.tab ? dialog.querySelector(`[data-detail-tab="${CSS.escape(state.modal.tab)}"]`) : hadDialogFocus ? null : dialog.querySelector('input:not([type="hidden"]):not([type="radio"]):not(:disabled), select, textarea, [data-detail-tab][aria-selected="true"], .modal-foot .btn-primary');
      target?.focus();
      syncDynamicModal();
    }
  } else if (state.restoreFocusSelector) { app.querySelector(state.restoreFocusSelector)?.focus(); state.restoreFocusSelector = null; }
}

function tableCtx() {
  const report = REPORT_SOURCE[state.view];
  if (report) return { meta: pageMeta[report.page], dataKey: report.dataKey, report: true };
  const meta = pageMeta[state.view];
  return meta?.dataKey ? { meta, dataKey: meta.dataKey, report: false } : null;
}
function refreshTable(focusSel) {
  const ctx = tableCtx(); const old = app.querySelector('#table-card');
  if (!ctx || !old) return rootRender();
  const active = focusSel && document.activeElement?.matches(focusSel) ? document.activeElement : null;
  const pos = active?.selectionStart;
  const wrap = document.createElement('div');
  wrap.innerHTML = renderTableCard(ctx.meta, { dataKey: ctx.dataKey, report: ctx.report });
  old.replaceWith(wrap.firstElementChild);
  if (active) { const next = app.querySelector(focusSel); next?.focus(); if (pos != null) next?.setSelectionRange?.(pos, pos); }
}
function refreshCart(focusSel) {
  const old = app.querySelector('.cart-panel'); if (!old) return rootRender();
  const active = focusSel && document.activeElement?.matches(focusSel) ? document.activeElement : null;
  const pos = active?.selectionStart;
  const wrap = document.createElement('div'); wrap.innerHTML = renderCartPanel();
  old.replaceWith(wrap.firstElementChild);
  if (active) { const next = app.querySelector(focusSel); next?.focus(); try { if (pos != null) next.setSelectionRange(pos, pos); } catch (e) { /* number inputs */ } }
}
function refreshProducts() {
  const grid = app.querySelector('.product-grid'); if (!grid) return rootRender();
  const track = state.settings.trackStock !== false && !state.settings.allowNegativeStock;
  const q = state.productQuery.toLowerCase();
  const list = state.data.products.filter((p) => p.status !== 'Archived' && `${p.name} ${p.category} ${p.sku}`.toLowerCase().includes(q) && (state.productCategory === 'all' || p.category === state.productCategory) && (!state.inStockOnly || num(p.stockQty) > 0));
  grid.innerHTML = renderProductTiles(list, track);
  app.querySelectorAll('[data-category]').forEach((c) => c.classList.toggle('active', c.dataset.category === state.productCategory));
}
function refreshTopbar() {
  const old = app.querySelector('.topbar'); if (!old) return;
  const had = document.activeElement?.matches('[data-global-search]'); const pos = document.activeElement?.selectionStart;
  const wrap = document.createElement('div'); wrap.innerHTML = renderTopbar(pageMeta[state.view] || pageMeta.home);
  old.replaceWith(wrap.firstElementChild);
  if (had) { const i = app.querySelector('[data-global-search]'); i?.focus(); if (pos != null) i?.setSelectionRange(pos, pos); }
}
function syncDynamicModal() {
  const t = app.querySelector('[data-tendered]'); if (t) updateChange(t);
  const c = app.querySelector('[data-counted]'); if (c) updateVariance(c);
}
function updateChange(input) {
  const total = Number(input.dataset.total); const val = input.value === '' ? total : Number(input.value);
  const el = app.querySelector('[data-change]'); if (el) el.textContent = val >= total ? money(val - total) : `Short ${money(total - val)}`;
}
function updateVariance(input) {
  const v = Number(input.value || 0) - Number(input.dataset.expected);
  const el = app.querySelector('[data-variance]'); if (el) el.textContent = `${v > 0 ? '+' : ''}${(Math.round(v * 100) / 100).toLocaleString('en-US')}`;
}

/* ====================== helpers ====================== */
const closeModal = () => { state.restoreFocusSelector = state.modalReturnSelector; state.modalReturnSelector = null; state.modal = null; };
const openModal = (modal, returnSel = null) => { state.modalReturnSelector = returnSel; state.modal = modal; rootRender(); };
function fail(message) {
  if (state.modal && ['create', 'edit', 'prompt', 'confirm', 'checkout', 'open-register', 'close-register', 'cash-move', 'count'].includes(state.modal.type)) { state.modal.error = message; rootRender(); }
  else toast(message, 'warn');
}
function applyResult(res) {
  if (res.error) return fail(res.error);
  closeModal();
  if (res.next?.view) go(res.next.view);
  if (res.next?.receivePo) state.receivePo = res.next.receivePo;
  if (res.next?.modal) state.modal = res.next.modal;
  rootRender();
  if (res.message) toast(res.message);
}
function formValues(form) {
  const values = {};
  new FormData(form).forEach((v, k) => { values[k] = v; });
  return values;
}
function openRowAction(key, index, actId) {
  const row = state.data[key][index]; const act = A.rowActions(key, row).find((a) => a.id === actId);
  if (!act) return;
  if (act.prompt) return openModal({ type: 'prompt', title: act.label, fields: act.prompt, hint: act.hint, key, index, act: act.id });
  if (act.confirm) return openModal({ type: 'confirm', title: act.label, message: act.confirm, confirmLabel: act.label, onConfirm: { kind: 'row', key, index, act: act.id } });
  applyResult(A.runRowAction(key, index, act.id));
}
const exportCurrent = () => {
  const ctx = tableCtx(); if (!ctx) return;
  const rows = queryRows(ctx.dataKey, ctx.meta.columns || [], { report: ctx.report }).map((r) => r.row);
  A.exportCsv(state.view, ctx.meta.columns || [], rows, ctx.dataKey);
  toast(`Exported ${rows.length} row${rows.length === 1 ? '' : 's'} to CSV.`);
};


function switchDetailTab(id) {
  const card = app.querySelector('.modal-card');
  const tabsEl = card && card.querySelector('.detail-tabs');
  const panel = card && card.querySelector('.detail-tab-panel');
  if (!tabsEl || !panel) { state.modal.tab = id; return rootRender(); }
  const btns = Array.from(tabsEl.querySelectorAll('[data-detail-tab]'));
  const from = btns.findIndex((b) => b.classList.contains('active'));
  const to = btns.findIndex((b) => b.dataset.detailTab === id);
  if (to < 0 || to === from) return;
  state.modal.tab = id;
  const tmp = document.createElement('div'); tmp.innerHTML = renderModal();
  const next = tmp.querySelector('.detail-tab-panel');
  if (!next) return rootRender();
  btns.forEach((b, i) => { b.classList.toggle('active', i === to); b.setAttribute('aria-selected', String(i === to)); });
  btns[to].scrollIntoView({ inline: 'nearest', block: 'nearest' });
  panel.innerHTML = next.innerHTML;
  panel.classList.remove('slide-next', 'slide-prev'); void panel.offsetWidth;
  panel.classList.add(to > from ? 'slide-next' : 'slide-prev');
}

/* ====================== clicks ====================== */
function onClick(event) {
  const t = event.target;
  if (state.popover && !t.closest('.pop-anchor')) { state.popover = null; rootRender(); }
  if (state.gq && !t.closest('.gs-wrap')) { state.gq = ''; refreshTopbar(); }
  const outlet = t.closest('[data-outlet-choice]');
  if (outlet) { state.outlet = outlet.dataset.outletChoice; state.outletMenuOpen = false; state.page = 0; save(); rootRender(); app.querySelector('[data-action="outlet-menu"]')?.focus(); toast(`Showing ${state.outlet}.`); return; }
  const tab = t.closest('[data-detail-tab]');
  if (tab && state.modal) { switchDetailTab(tab.dataset.detailTab); return; }
  const cat = t.closest('[data-category]');
  if (cat) { state.productCategory = cat.dataset.category; refreshProducts(); return; }
  const sort = t.closest('[data-sort]');
  if (sort) { const k = sort.dataset.sort; state.sort = state.sort.key === k ? { key: k, dir: -state.sort.dir } : { key: k, dir: 1 }; state.page = 0; refreshTable(); return; }
  const nav = t.closest('[data-view]');
  if (nav) { const status = nav.dataset.status; go(nav.dataset.view); if (status) { state.statusFilter = status; rootRender(); } return; }
  const btn = t.closest('[data-action]');
  if (!btn) return;
  const a = btn.dataset.action; const ds = btn.dataset;
  switch (a) {
    case 'close-nav': state.mobileNav = false; return rootRender();
    case 'toggle-nav': state.mobileNav = !state.mobileNav; return rootRender();
    case 'close-pop': state.popover = null; return rootRender();
    case 'close-modal': if (!btn.classList.contains('modal-backdrop') || t === btn) { closeModal(); rootRender(); } return;
    case 'outlet-menu': state.outletMenuOpen = !state.outletMenuOpen; rootRender(); return app.querySelector(state.outletMenuOpen ? '[data-outlet-choice][aria-checked="true"]' : '[data-action="outlet-menu"]')?.focus();
    case 'notifications': state.popover = state.popover === 'notif' ? null : 'notif'; return rootRender();
    case 'profile-menu': state.popover = state.popover === 'profile' ? null : 'profile'; return rootRender();
    case 'mark-seen': state.notifSeen = notificationSignature(); save(); return rootRender();
    case 'logout': flush(); sessionStorage.removeItem('afpos-demo-auth'); location.replace('/pos.html'); return;
    case 'reset-data': return openModal({ type: 'confirm', title: 'Reset demo data', message: 'This replaces everything in this browser with fresh sample data. Your changes will be lost.', confirmLabel: 'Reset data', onConfirm: { kind: 'reset' } });
    case 'export-all': A.exportAllJson(); toast('Exported all demo data.'); state.popover = null; return rootRender();
    case 'export': return exportCurrent();
    case 'export-report': return exportCurrent();
    case 'export-products': A.exportCsv('products', pageMeta.products.columns, state.data.products, 'products'); return toast('Exported products to CSV.');
    case 'page-prev': state.page = Math.max(0, state.page - 1); return refreshTable();
    case 'page-next': state.page += 1; return refreshTable();
    case 'create': {
      if (state.view === 'sessions') return openModal({ type: 'open-register' }, '[data-action="create"]');
      const key = pageMeta[state.view]?.dataKey; if (!key) return;
      return openModal({ type: 'create', key }, '[data-action="create"]');
    }
    case 'new-stock-count': go('stock-counts'); return openModal({ type: 'create', key: 'stockCounts' });
    case 'detail': { const list = state.data[ds.key] || []; if (!list[Number(ds.index)]) return; return openModal({ type: 'detail', key: ds.key, index: Number(ds.index), tab: null }, `[data-action="detail"][data-key="${ds.key}"][data-index="${ds.index}"]`); }
    case 'gs-open': { const { view, key, index } = ds; state.gq = ''; go(view); return openModal({ type: 'detail', key, index: Number(index) }); }
    case 'row-action': return openRowAction(ds.key, Number(ds.index), ds.act);
    case 'edit-record': return openModal({ type: 'edit', key: ds.key, index: Number(ds.index) });
    case 'delete-record': { const row = state.data[ds.key][Number(ds.index)]; return openModal({ type: 'confirm', title: 'Delete record', message: `Delete ${row?.name || row?.id || row?.code || row?.sku || 'this record'}? This can't be undone.`, confirmLabel: 'Delete', onConfirm: { kind: 'delete', key: ds.key, index: Number(ds.index) } }); }
    case 'confirm-yes': {
      const c = state.modal?.onConfirm; if (!c) return;
      if (c.kind === 'reset') { resetData(); closeModal(); go('home'); return toast('Demo data reset.'); }
      if (c.kind === 'delete') { const err = A.deleteRecord(c.key, c.index); if (err) return fail(err); closeModal(); rootRender(); return toast('Deleted.'); }
      return applyResult(A.runRowAction(c.key, c.index, c.act));
    }
    case 'add-cart': { const r = A.addToCart(ds.id); if (r === null) { refreshCart(); toast('Added to sale.'); } return; }
    case 'qty-up': case 'qty-down': A.updateCart(ds.id || null, a === 'qty-up' ? 1 : -1, ds.name); return refreshCart();
    case 'clear-cart': A.clearCart(); return rootRender();
    case 'product-filter': state.inStockOnly = !state.inStockOnly; return rootRender();
    case 'checkout': if (!state.cart.length) return; if (!openSession()) { toast('Open the register to complete a sale.', 'warn'); return openModal({ type: 'open-register' }); } return openModal({ type: 'checkout' }, '[data-action="checkout"]');
    case 'save-quote': { const r = A.saveCartAsQuote(); if (r && r.startsWith('The')) return toast(r, 'warn'); rootRender(); return toast(`${r} saved. Find it under Quotations.`); }
    case 'open-register-modal': return openModal({ type: 'open-register' });
    case 'close-register-modal': { const s = openSession(); return s && openModal({ type: 'close-register', sessionId: s.id }); }
    case 'cash-move-modal': return openModal({ type: 'cash-move' });
    case 'print-receipt': return window.print();
    case 'simulate-order': { const r = A.simulateOnlineOrder(); if (r.startsWith('No')) return toast(r, 'warn'); rootRender(); return toast(`${r} received.`); }
    default:
  }
}

/* ====================== inputs ====================== */
function onInput(event) {
  const t = event.target;
  if (t.matches('[data-page-search]')) { state.query = t.value; state.page = 0; refreshTable('[data-page-search]'); }
  else if (t.matches('[data-global-search]')) { state.gq = t.value; refreshTopbar(); }
  else if (t.matches('[data-product-search]')) { state.productQuery = t.value; refreshProducts(); }
  else if (t.matches('[data-cart-discount]')) { state.cartDiscount = t.value; save(); refreshCart('[data-cart-discount]'); }
  else if (t.matches('[data-tendered]')) updateChange(t);
  else if (t.matches('[data-counted]')) updateVariance(t);
}

function onChange(event) {
  const t = event.target;
  if (t.matches('[data-status-filter]')) { state.statusFilter = t.value; state.page = 0; refreshTable(); }
  else if (t.matches('[data-table-period]')) { state.tablePeriod = t.value; state.page = 0; refreshTable(); }
  else if (t.matches('[data-home-filter]')) { const k = t.dataset.homeFilter; state[k] = t.value; state.page = 0; save(); rootRender(); app.querySelector(`[data-home-filter="${k}"]`)?.focus(); }
  else if (t.matches('[data-chart-metric]')) { state.chartMetric = t.value; rootRender(); }
  else if (t.matches('[data-cart-customer]')) { state.cartCustomer = t.value; state.redeemPoints = false; save(); refreshCart(); }
  else if (t.matches('[data-cart-discount-type]')) { state.cartDiscountType = t.value; refreshCart(); }
  else if (t.matches('[data-cart-redeem]')) { state.redeemPoints = t.checked; refreshCart(); }
  else if (t.matches('[data-receive-po]')) { state.receivePo = t.value; rootRender(); }
  else if (t.name === 'method' && t.type === 'radio') {
    app.querySelectorAll('[data-method-section]').forEach((el) => { el.hidden = el.dataset.methodSection !== t.value; });
    if (state.modal) state.modal.error = null;
    app.querySelector('.form-error')?.remove();
  }
}

/* ====================== submits ====================== */
function onSubmit(event) {
  const form = event.target.closest('form[data-form]');
  if (!form) return;
  event.preventDefault();
  const type = form.dataset.form; const values = formValues(form); const m = state.modal;
  const withErr = (err) => { if (err) { m.error = err; m.values = values; rootRender(); return true; } return false; };
  switch (type) {
    case 'create': { if (withErr(A.createRecord(m.key, values))) return; const label = m.key; closeModal(); rootRender(); return toast(`Added to ${label.replace(/([A-Z])/g, ' $1').toLowerCase()}.`); }
    case 'edit': { if (withErr(A.updateRecord(m.key, m.index, values))) return; closeModal(); rootRender(); return toast('Changes saved.'); }
    case 'prompt': { const res = A.runRowAction(m.key, m.index, m.act, values); if (res.error) { m.error = res.error; m.values = values; return rootRender(); } return applyResult(res); }
    case 'checkout': { if (withErr(A.completeSale(values))) return; rootRender(); return toast('Sale completed.'); }
    case 'receive': { const err = A.receiveStock(values); if (err) return toast(err, 'warn'); rootRender(); return toast('Receipt recorded. Stock updated.'); }
    case 'open-register': { if (withErr(A.openRegister(values))) return; closeModal(); rootRender(); return toast('Register opened.'); }
    case 'close-register': { if (withErr(A.closeRegister(m.sessionId, values))) return; const s = state.data.sessions.find((x) => x.id === m.sessionId); closeModal(); rootRender(); return toast(`Register closed. Variance ${s.variance > 0 ? '+' : ''}${s.variance}.`); }
    case 'cash-move': { if (withErr(A.cashMove(values))) return; closeModal(); rootRender(); return toast('Cash movement recorded.'); }
    case 'count': { if (withErr(A.applyStockCount(m.index, values))) return; closeModal(); rootRender(); return toast('Stock count completed. Stock updated.'); }
    case 'settings': {
      const meta = pageMeta[state.view]; const fields = (meta && pageMetaSettings(meta.key)) || [];
      const err = A.saveSettings(fields, values); if (err) return toast(err, 'warn');
      rootRender(); return toast('Settings saved.');
    }
    default:
  }
}
import { settingsFields } from './data/demo.js';
const pageMetaSettings = (key) => settingsFields[key];

/* ====================== keyboard ====================== */
function onKeydown(event) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); app.querySelector('[data-global-search]')?.focus(); return; }
  if (event.key === 'Enter' && event.target.matches?.('[data-product-search]')) {
    event.preventDefault();
    const q = state.productQuery.trim().toLowerCase(); if (!q) return;
    const hits = state.data.products.filter((p) => p.sku.toLowerCase() === q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    const exact = hits.find((p) => p.sku.toLowerCase() === q) || (hits.length === 1 ? hits[0] : null);
    if (exact) { if (A.addToCart(exact.sku) === null) { state.productQuery = ''; rootRender(); toast(`${exact.name} added.`); app.querySelector('[data-product-search]')?.focus(); } }
    return;
  }
  if (event.key === 'Escape') {
    if (state.modal) { closeModal(); rootRender(); }
    else if (state.popover) { state.popover = null; rootRender(); }
    else if (state.mobileNav) { state.mobileNav = false; rootRender(); }
    else if (state.outletMenuOpen) { state.outletMenuOpen = false; rootRender(); app.querySelector('[data-action="outlet-menu"]')?.focus(); }
    else if (state.gq) { state.gq = ''; refreshTopbar(); }
  }
  if (event.key === 'Tab' && state.modal) {
    const dialog = app.querySelector('[role="dialog"]');
    const focusable = [...(dialog?.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])') || [])].filter((el) => el.getClientRects().length);
    if (!focusable.length) { event.preventDefault(); dialog?.focus(); return; }
    const first = focusable[0]; const last = focusable.at(-1);
    if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
  }
}
