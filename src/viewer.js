import { ASSETS, CATEGORIES } from './registry.js';
import { rng } from './colors.js';
import { diamond } from './iso.js';
import { water as waterTile } from './assets/terrain.js';
import { decorate } from './assets/holiday.js';
import { SEASONS, HOLIDAYS, HOLIDAY_LABEL, applySeason, seasonFor, holidayFor, loadLocation, saveLocation } from './season.js';

const state = { seed: 1, grid: true, dark: false, anim: true, cat: 'All', zoom: 1, season: 'auto', holiday: 'auto', loc: loadLocation() };
const resolved = () => ({
  season: state.season === 'auto' ? seasonFor(new Date(), state.loc.lat) : state.season,
  holiday: state.holiday === 'auto' ? holidayFor(new Date()) : state.holiday === 'none' ? null : state.holiday,
});
const qs = new URLSearchParams(location.search);
if (qs.get('cat')) state.cat = qs.get('cat');
const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
const cells = [];

function drawCard(c, frame) {
  const { a, canvas, index } = c;
  const dirs = a.dirs ? 4 : 1;
  const cw = a.dirs ? (a.cw || 190) : (a.w || 210), ch = a.h || 200;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cw * dirs, ch);
  for (let d = 0; d < dirs; d++) {
    ctx.save();
    ctx.translate(cw * d + cw / 2, a.oy);
    ctx.scale(a.scale * state.zoom, a.scale * state.zoom);
    if (a.base === 'water') waterTile(ctx, rng(5));
    else if (state.grid) {
      ctx.globalAlpha = 0.35;
      diamond(ctx, -0.5, -0.5, 0.5, 0.5, 0, state.dark ? '#5d6a52' : '#c9d6b0');
      ctx.globalAlpha = 1;
    }
    const r = rng(state.seed * 131 + index * 17 + (a.seedOffset || 0));
    try {
      a.draw(ctx, r, { dir: d, frame });
      decorate(ctx, rng(state.seed * 7 + index), a, resolved().holiday);
    } catch (e) {
      console.error(a.name, e);
    }
    ctx.restore();
  }
}

function download(c) {
  const link = document.createElement('a');
  link.download = `${c.a.cat}-${c.a.name}`.toLowerCase().replace(/\s+/g, '-') + '.png';
  link.href = c.canvas.toDataURL('image/png');
  link.click();
}

function build() {
  const root = document.getElementById('grid');
  root.innerHTML = '';
  cells.length = 0;
  let idx = 0;
  for (const cat of CATEGORIES) {
    if (state.cat !== 'All' && state.cat !== cat) { idx += ASSETS.filter((x) => x.cat === cat).length; continue; }
    const h = document.createElement('h2');
    h.textContent = cat;
    root.appendChild(h);
    const row = document.createElement('div');
    row.className = 'row';
    root.appendChild(row);
    for (const a of ASSETS.filter((x) => x.cat === cat)) {
      const card = document.createElement('figure');
      card.className = 'card' + (a.dirs ? ' wide' : '');
      const canvas = document.createElement('canvas');
      const w = a.dirs ? (a.cw || 190) * 4 : (a.w || 210), h2 = a.h || 200;
      canvas.width = w * dpr;
      canvas.height = h2 * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h2 + 'px';
      const cap = document.createElement('figcaption');
      cap.textContent = a.name;
      card.append(canvas, cap);
      row.appendChild(card);
      const cell = { a, canvas, index: idx++ };
      card.addEventListener('click', () => download(cell));
      cells.push(cell);
    }
  }
  redraw(0);
}

function redraw(frame = 0) {
  const rs = resolved();
  applySeason(rs.season, rs.holiday);
  document.body.dataset.season = rs.season;
  const lab = document.getElementById('status');
  if (lab) lab.textContent = state.loc.name + ' | ' + rs.season + (rs.holiday ? ' | ' + HOLIDAY_LABEL[rs.holiday] : '');
  document.body.classList.toggle('dark', state.dark);
  cells.forEach((c) => drawCard(c, c.a.anim ? frame : 0));
}

function init() {
  const bar = document.getElementById('bar');
  const mk = (label, fn, cls = '') => {
    const b = document.createElement('button');
    b.textContent = label;
    b.className = cls;
    b.onclick = () => fn(b);
    bar.appendChild(b);
    return b;
  };
  mk('World map', () => { location.href = 'map.html'; });
  mk('Re-roll variants', () => { state.seed = Math.floor(Math.random() * 1e6); redraw(0); });
  mk('Grid', (b) => { state.grid = !state.grid; b.classList.toggle('on', state.grid); redraw(0); }, 'on');
  mk('Dark', (b) => { state.dark = !state.dark; b.classList.toggle('on', state.dark); redraw(0); });
  mk('Animate', (b) => { state.anim = !state.anim; b.classList.toggle('on', state.anim); }, 'on');
  const sel = (label, opts, get, set) => {
    const s = document.createElement('select');
    s.title = label;
    for (const [val, text] of opts) { const o = document.createElement('option'); o.value = val; o.textContent = text; s.appendChild(o); }
    s.value = get(); s.onchange = () => { set(s.value); redraw(0); };
    bar.appendChild(s); return s;
  };
  sel('Season', [['auto', 'Season: auto'], ...SEASONS.map((x) => [x, x[0].toUpperCase() + x.slice(1)])], () => state.season, (x) => (state.season = x));
  sel('Holiday', [['auto', 'Holiday: auto'], ['none', 'No holiday'], ...HOLIDAYS.map((x) => [x, HOLIDAY_LABEL[x]])], () => state.holiday, (x) => (state.holiday = x));
  mk('Use my location', (b) => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((p) => { state.loc = { name: 'My location', lat: p.coords.latitude, lon: p.coords.longitude }; saveLocation(state.loc); redraw(0); }, () => { b.textContent = 'Location blocked'; });
  });
  const z = document.createElement('input');
  z.type = 'range'; z.min = 0.6; z.max = 1.4; z.step = 0.05; z.value = 1;
  z.oninput = () => { state.zoom = +z.value; redraw(0); };
  bar.appendChild(z);
  const sep = document.createElement('span'); sep.className = 'sep'; bar.appendChild(sep);
  for (const cat of ['All', ...CATEGORIES]) {
    const b = mk(cat, () => { state.cat = cat; [...bar.querySelectorAll('.chip')].forEach((x) => x.classList.toggle('on', x.textContent === cat)); build(); }, 'chip' + (cat === 'All' ? ' on' : ''));
  }
  [...bar.querySelectorAll('.chip')].forEach((x) => x.classList.toggle('on', x.textContent === state.cat));
  if (qs.get('season')) state.season = qs.get('season');
  if (qs.get('holiday')) state.holiday = qs.get('holiday');
  build();
  let t = 0;
  setInterval(() => {
    if (!state.anim) return;
    t = (t + 1) % 4;
    const f = [0, 1, 0, 2][t];
    cells.forEach((c) => c.a.anim && drawCard(c, f));
  }, 200);
}

init();
