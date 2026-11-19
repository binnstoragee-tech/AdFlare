/* Pure helpers: no DOM, no state. */
export const DAY = 864e5;

export const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const clone = (value) => JSON.parse(JSON.stringify(value));
export const num = (value) => { const n = Number(value); return Number.isFinite(n) ? n : 0; };
export const round2 = (value) => Math.round((num(value) + Number.EPSILON) * 100) / 100;
export const toLabel = (key) => String(key).replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());

/* ---------- dates ---------- */
export const startOfDay = (ts) => { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); };
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const monthName = (i) => MONTHS[i];

export function fmtTime(ts) {
  const d = new Date(ts);
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ap}`;
}

export function fmtDate(ts, withTime = true) {
  if (ts == null || ts === '') return '—';
  if (typeof ts === 'string' && Number.isNaN(Number(ts))) return ts;
  const t = Number(ts);
  const today = startOfDay(Date.now());
  const day = startOfDay(t);
  const time = withTime ? `, ${fmtTime(t)}` : '';
  if (day === today) return withTime ? `Today${time}` : 'Today';
  if (day === today - DAY) return withTime ? `Yesterday${time}` : 'Yesterday';
  const d = new Date(t);
  const year = d.getFullYear();
  const base = `${MONTHS[d.getMonth()]} ${d.getDate()}`;
  if (!withTime) return `${base}, ${year}`;
  return year === new Date().getFullYear() ? `${base}${time}` : `${base}, ${year}`;
}

export const toInputDate = (ts) => {
  if (!ts) return '';
  const d = new Date(Number(ts));
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
export const fromInputDate = (str) => {
  if (!str) return null;
  const [y, m, d] = String(str).split('-').map(Number);
  if (!y) return null;
  return new Date(y, m - 1, d, 12, 0, 0).getTime();
};
export const addMonths = (ts, months) => { const d = new Date(ts); d.setMonth(d.getMonth() + months); return d.getTime(); };

/* Convert the seed's human labels ("Today, 9:24 AM", "Nov 16, 2026") to timestamps. */
export function parseLabel(label, nowTs = Date.now()) {
  if (typeof label === 'number') return label;
  if (label == null) return null;
  const text = String(label).trim();
  if (!text || text === '—') return null;
  const clock = (h, m, ap) => { let hh = Number(h) % 12; if (/pm/i.test(ap)) hh += 12; return [hh, Number(m)]; };
  let m = text.match(/^(today|yesterday)(?:,\s*(\d{1,2}):(\d{2})\s*(AM|PM))?$/i);
  if (m) {
    const base = startOfDay(nowTs) - (m[1].toLowerCase() === 'yesterday' ? DAY : 0);
    const [h, mm] = m[2] ? clock(m[2], m[3], m[4]) : [12, 0];
    return base + (h * 60 + mm) * 60000;
  }
  m = text.match(/^([A-Za-z]{3})\s+(\d{1,2})(?:,\s*(\d{4}))?(?:,\s*(\d{1,2}):(\d{2})\s*(AM|PM))?$/);
  if (m) {
    const mi = MONTHS.findIndex((x) => x.toLowerCase() === m[1].toLowerCase());
    if (mi < 0) return null;
    const year = m[3] ? Number(m[3]) : new Date(nowTs).getFullYear();
    const [h, mm] = m[4] ? clock(m[4], m[5], m[6]) : [12, 0];
    return new Date(year, mi, Number(m[2]), h, mm).getTime();
  }
  const parsed = Date.parse(text);
  return Number.isNaN(parsed) ? null : parsed;
}

/* ---------- periods ---------- */
export const PERIODS = ['Today', 'This week', 'Last 7 days', 'This month', 'Last month', 'This quarter', 'Year to date'];
export const TABLE_PERIODS = ['All time', 'Today', 'Last 7 days', 'Last 30 days', 'This month', 'Last month', 'This quarter', 'Year to date'];

export function periodRange(period, nowTs = Date.now()) {
  const t0 = startOfDay(nowTs);
  const end = t0 + DAY;
  const d = new Date(t0);
  switch (period) {
    case 'All time': return { start: 0, end: Infinity };
    case 'Today': return { start: t0, end };
    case 'This week': return { start: t0 - ((d.getDay() + 6) % 7) * DAY, end };
    case 'Last 30 days': return { start: t0 - 29 * DAY, end };
    case 'This month': return { start: new Date(d.getFullYear(), d.getMonth(), 1).getTime(), end };
    case 'Last month': return { start: new Date(d.getFullYear(), d.getMonth() - 1, 1).getTime(), end: new Date(d.getFullYear(), d.getMonth(), 1).getTime() };
    case 'This quarter': return { start: new Date(d.getFullYear(), Math.floor(d.getMonth() / 3) * 3, 1).getTime(), end };
    case 'Year to date': return { start: new Date(d.getFullYear(), 0, 1).getTime(), end };
    case 'Last 7 days':
    default: return { start: t0 - 6 * DAY, end };
  }
}
export const prevRange = (range) => ({ start: range.start - (range.end - range.start), end: range.start });
export const inRange = (ts, range) => ts != null && ts >= range.start && ts < range.end;

/* Time buckets for charts, sized to the selected range. */
export function buckets(range) {
  const days = Math.max(1, Math.round((range.end - range.start) / DAY));
  const out = [];
  if (days <= 1) {
    for (let h = 8; h <= 21; h++) out.push({ label: h === 12 ? '12p' : h > 12 ? `${h - 12}p` : `${h}a`, start: range.start + h * 3600000, end: range.start + (h + 1) * 3600000 });
    out[0].start = range.start; out[out.length - 1].end = range.end;
    return out;
  }
  if (days <= 31) {
    for (let i = 0; i < days; i++) {
      const start = range.start + i * DAY;
      const d = new Date(start);
      out.push({ label: days <= 7 ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()] : `${MONTHS[d.getMonth()]} ${d.getDate()}`, start, end: start + DAY });
    }
    return out;
  }
  if (days <= 100) {
    for (let start = range.start; start < range.end; start += 7 * DAY) {
      const d = new Date(start);
      out.push({ label: `${MONTHS[d.getMonth()]} ${d.getDate()}`, start, end: Math.min(start + 7 * DAY, range.end) });
    }
    return out;
  }
  const first = new Date(range.start);
  for (let y = first.getFullYear(), m = first.getMonth(); ; m++) {
    const start = new Date(y, m, 1).getTime();
    if (start >= range.end) break;
    out.push({ label: MONTHS[new Date(start).getMonth()], start: Math.max(start, range.start), end: Math.min(new Date(y, m + 1, 1).getTime(), range.end) });
  }
  return out;
}

export function pctChange(cur, prev) {
  if (!prev) return cur ? 'new' : '—';
  const v = ((cur - prev) / prev) * 100;
  return `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`;
}

/* ---------- random (seeded) ---------- */
export function rng(seed = 2026) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  next.int = (min, max) => Math.floor(next() * (max - min + 1)) + min;
  next.pick = (list) => list[Math.floor(next() * list.length)];
  next.weighted = (list, weights) => {
    const total = weights.reduce((s, w) => s + w, 0);
    let r = next() * total;
    for (let i = 0; i < list.length; i++) { r -= weights[i]; if (r <= 0) return list[i]; }
    return list[list.length - 1];
  };
  return next;
}

/* ---------- ids ---------- */
export function nextSeq(list, key = 'id') {
  let max = 0;
  for (const row of list) { const m = String(row[key] ?? '').match(/(\d+)$/); if (m) max = Math.max(max, Number(m[1])); }
  return max + 1;
}
export const makeId = (prefix, list, key = 'id', pad = 5) => `${prefix}${String(nextSeq(list, key)).padStart(pad, '0')}`;

export function csvEscape(value) { return `"${String(value ?? '').replaceAll('"', '""')}"`; }
