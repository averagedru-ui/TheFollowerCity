// Infinite-world viewer. Terrain is generated in chunks on demand. The planner (?admin=1) lays out plots and roads;
// players claim one plot each, then pick a building from the build menu. World state is shared through /api/state.
import { makeWorld, SEA, K, CH, BUILDABLE } from './worldgen.js';
import { fitList, layoutPlot, drawerFor } from './buildings.js';
import { rng, hexToHsl, hsl, shade } from '../colors.js';
import { PAL } from '../palette.js';
import { P, poly } from '../iso.js';
import { SEASONS, HOLIDAYS, HOLIDAY_LABEL, applySeason, seasonFor, holidayFor, loadLocation } from '../season.js';
import { decorate, pumpkinPatch, scarecrow, graveyard, snowmanProp, treeLights } from '../assets/holiday.js';
import * as N from '../assets/nature.js';
import * as B from '../assets/buildings.js';
import * as V from '../assets/vehicles.js';
import * as PR from '../assets/props.js';
import * as M from '../assets/more.js';
import * as I from '../assets/infra.js';

const Z = 380;            // vertical px for a height of 1.0
const MAX_PLOT = 24;
const MAX_RANGE = 0.07;   // tallest height spread a plot may flatten
const qs = new URLSearchParams(location.search);
const admin = qs.get('admin') === '1';
const state = {
  seed: +(qs.get('seed') || 7), season: qs.get('season') || 'auto', holiday: qs.get('holiday') || 'auto',
  loc: loadLocation(), zoom: +(qs.get('zoom') || 0.7), cam: [0, 0], world: null, dirty: true,
  mode: 'play', tool: 'plot', preset: '4x4', rot: false, zone: 'residential', selected: null, hover: null, drag: null, stroke: null,
};
const canvas = document.getElementById('view');
const ctx = canvas.getContext('2d');
const mini = document.getElementById('mini');
const mctx = mini.getContext('2d');
let rcache = new Map(), sprites = new Map();
const ckey = (ci, cj) => ci * 1000003 + cj;
const $ = (id) => document.getElementById(id);
const mk = (tag, props = {}, kids = []) => { const e = Object.assign(document.createElement(tag), props); for (const k of kids) e.append(k); return e; };

const resolved = () => ({
  season: state.season === 'auto' ? seasonFor(new Date(), state.loc.lat) : state.season,
  holiday: state.holiday === 'auto' ? holidayFor(new Date()) : state.holiday === 'none' ? null : state.holiday,
});

// ---------- player ----------
const player = { id: '', name: '' };
try {
  player.id = localStorage.getItem('player.id') || '';
  player.name = localStorage.getItem('player.name') || '';
} catch { /* storage blocked */ }
if (!player.id) {
  player.id = 'p' + Math.random().toString(36).slice(2, 10);
  try { localStorage.setItem('player.id', player.id); } catch { /* ignore */ }
}
const myPlot = () => plots.find((p) => p.owner === player.id) || null;

// ---------- zones ----------
const ZONES = {
  residential: ['Residential', '#f0b84a'], commercial: ['Commercial', '#4f9ad6'], industrial: ['Industrial', '#8a8f94'],
  park: ['Park', '#58a37a'], farm: ['Farm', '#c9a063'], civic: ['Civic', '#9a6fb5'], reserved: ['Reserved', '#ffffff'],
};
const PRESETS = ['2x2', '3x3', '4x4', '5x5', '6x6', '8x8', '2x3', '3x4', '4x6', '5x8', '6x10', '8x12', '12x12', 'custom'];

// ---------- sprites ----------
const SPR = {
  pine: N.pine, spruce: N.spruce, leaf: N.leafTree, aspen: N.aspen, cottonwood: N.cottonwood, bush: N.bush, rock: N.rock,
  flowers: N.flowers, haybale: N.hayBale, cabin: M.logCabin, barn: B.barn, farmhouse: B.farmhouse, silo: B.silo,
  fenceX: PR.fenceX, fenceY: PR.fenceY, pumpkins: pumpkinPatch, scarecrow, graves: graveyard, snowman: snowmanProp, xmasTree: treeLights,
  fountain: I.fountain, playground: I.playground, picnic: PR.picnicTable,
  cow: (c, r) => V.cow(c, r, { dir: r.pick([0, 1, 2, 3]) }),
};
const HOUSE = { cat: 'Homes', w: 210, oy: 150, scale: 1.8 };
const DECOR = new Set(['barn', 'farmhouse', 'cabin']);
const RES = 2;
function sprite(o) {
  const isB = o.type.startsWith('B:');
  const key = o.type + (o.seed % (isB ? 4 : 5));
  let s = sprites.get(key);
  if (s) return s;
  const c = document.createElement('canvas');
  const g = c.getContext('2d');
  if (isB) { c.width = 320 * RES; c.height = 420 * RES; g.scale(RES, RES); g.translate(160, 330); } else { c.width = 240; c.height = 300; g.translate(120, 230); }
  const r = rng(o.seed % (isB ? 4 : 5) * 977 + 13);
  try {
    if (isB) {
      const def = drawerFor(o.type.slice(2));
      def.draw(g, r, {});
      if (def.cat === 'Homes') decorate(g, rng(o.seed), HOUSE, resolved().holiday);
    } else {
      SPR[o.type](g, r);
      if (DECOR.has(o.type)) decorate(g, rng(o.seed), HOUSE, resolved().holiday);
    }
  } catch (e) { console.error(o.type, e); }
  s = { c, isB };
  sprites.set(key, s);
  return s;
}

// ---------- shared world state (plots + roads) ----------
let plots = [], occ = new Map(), roadMap = new Map(), nextId = 1, version = 0, shared = false, itemIdx = new Map();
const tk = (i, j) => (i + 65536) * 131072 + (j + 65536);
const plotAt = (i, j) => occ.get(tk(i, j));
const roadAt = (i, j) => roadMap.has(tk(i, j));
const FIELDS = ['id', 'i', 'j', 'w', 'd', 'zone', 'name', 'h', 'owner', 'ownerName', 'bld', 'bseed'];
const localKey = () => `world.${state.seed}`;
const emptyDoc = () => ({ version: 0, state: { plots: [], roads: [], nextId: 1 } });

function snapshot() {
  return { plots: plots.map((p) => Object.fromEntries(FIELDS.map((f) => [f, p[f]]))), roads: [...roadMap.values()].map(([i, j]) => [i, j]), nextId };
}
async function remoteGet() {
  try {
    const r = await fetch(`/api/state/${state.seed}`, { cache: 'no-store' });
    if (!r.ok) throw new Error('no api');
    shared = true;
    return await r.json();
  } catch {
    shared = false;
    try { return JSON.parse(localStorage.getItem(localKey()) || 'null') || emptyDoc(); } catch { return emptyDoc(); }
  }
}
async function remotePush(st, base) {
  if (shared) {
    try {
      const r = await fetch(`/api/state/${state.seed}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ baseVersion: base, state: st }) });
      if (r.ok || r.status === 409) return await r.json();
    } catch { shared = false; }
  }
  let cur = emptyDoc();
  try { cur = JSON.parse(localStorage.getItem(localKey()) || 'null') || cur; } catch { /* ignore */ }
  if (cur.version !== base) return { ok: false, ...cur };
  const doc = { version: base + 1, state: st };
  try { localStorage.setItem(localKey(), JSON.stringify(doc)); } catch { /* ignore */ }
  return { ok: true, ...doc };
}

function adopt(doc) {
  const keepId = state.selected && state.selected.id;
  version = doc.version;
  plots = doc.state.plots.map((p) => ({ ...p }));
  nextId = doc.state.nextId || 1;
  occ = new Map(); roadMap = new Map(); itemIdx = new Map();
  for (const p of plots) for (let y = p.j; y < p.j + p.d; y++) for (let x = p.i; x < p.i + p.w; x++) occ.set(tk(x, y), p);
  for (const [i, j] of doc.state.roads) roadMap.set(tk(i, j), [i, j]);
  state.world.edits.clear();
  for (const p of plots) applyEdits(p);
  state.world.chunks.clear();
  rcache = new Map();
  for (const p of plots) for (const o of layoutPlot(p, Z)) { const k = ckey(Math.floor(o.i / CH), Math.floor(o.j / CH)); (itemIdx.get(k) || itemIdx.set(k, []).get(k)).push(o); }
  state.selected = keepId ? plots.find((p) => p.id === keepId) || null : null;
  state.dirty = true;
  showPanel(); refreshHeader();
}
async function sync() {
  const doc = await remoteGet();
  if (doc.version !== version || !state.synced) {
    adopt(doc);
    if (!state.synced) { state.synced = true; const mine = myPlot(); if (mine && !qs.get('cx')) centerOn(mine); }
  }
}
// run an edit on a copy of the latest state; retry on a version conflict
async function mutate(fn) {
  for (let t = 0; t < 4; t++) {
    const draft = snapshot();
    const err = fn(draft);
    if (err) { flash(err); return false; }
    const res = await remotePush(draft, version);
    adopt(res);
    if (res.ok) return true;
  }
  flash('The world is busy, try again');
  return false;
}

function applyEdits(p) {
  const w = state.world;
  for (let y = p.j - 1; y <= p.j + p.d + 1; y++) for (let x = p.i - 1; x <= p.i + p.w + 1; x++) {
    const inner = x >= p.i && x <= p.i + p.w && y >= p.j && y <= p.j + p.d;
    if (inner) w.edits.set(w.ek(x, y), p.h);
    else if (!vertexOwned(x, y)) w.edits.set(w.ek(x, y), w.H(x, y) * 0.5 + p.h * 0.5);
  }
}
const vertexOwned = (x, y) => occ.has(tk(x - 1, y - 1)) || occ.has(tk(x, y - 1)) || occ.has(tk(x - 1, y)) || occ.has(tk(x, y));

// ---------- plot / road rules ----------
function validate(i, j, w, d) {
  const world = state.world;
  if (w > MAX_PLOT || d > MAX_PLOT) return { ok: false, reason: `max ${MAX_PLOT} tiles a side` };
  let lo = 9, hi = -9, sum = 0, n = 0;
  for (let y = j; y <= j + d; y++) for (let x = i; x <= i + w; x++) { const h = world.H(x, y); lo = Math.min(lo, h); hi = Math.max(hi, h); sum += h; n++; }
  for (let y = j; y < j + d; y++) for (let x = i; x < i + w; x++) {
    if (plotAt(x, y)) return { ok: false, reason: 'overlaps another plot' };
    if (roadAt(x, y)) return { ok: false, reason: 'road in the way' };
    const t = world.tile(x, y);
    if (t.kind === K.WATER) return { ok: false, reason: 'water in the way' };
    if (!BUILDABLE.has(t.kind)) return { ok: false, reason: 'too rocky or high' };
    if (world.ranchAt(x, y)) return { ok: false, reason: 'ranch land' };
  }
  if (hi - lo > MAX_RANGE) return { ok: false, reason: 'too steep' };
  return { ok: true, level: Math.max(SEA + 0.02, sum / n) };
}
function roadOk(i, j) {
  if (plotAt(i, j) || state.world.ranchAt(i, j)) return false;
  const t = state.world.tile(i, j);
  return BUILDABLE.has(t.kind) && t.slope <= 0.08;
}
const planOnly = () => { if (!admin) { flash('Only the planner can do that'); return true; } return false; };

async function planAddPlot(r) {
  if (planOnly()) return;
  const v = validate(r.i, r.j, r.w, r.d);
  if (!v.ok) { flash(`Can't place plot: ${v.reason}`); return; }
  await mutate((st) => {
    const id = st.nextId++;
    st.plots.push({ id, i: r.i, j: r.j, w: r.w, d: r.d, zone: state.zone, name: `Plot ${id}`, h: v.level, owner: null, ownerName: null, bld: null, bseed: 0 });
    return null;
  });
}
async function planRemovePlot(id) {
  if (planOnly()) return;
  await mutate((st) => { st.plots = st.plots.filter((p) => p.id !== id); return null; });
  state.selected = null; showPanel();
}
async function planRoads(tiles, erase) {
  if (planOnly()) return;
  const list = erase ? tiles : tiles.filter(([i, j]) => roadOk(i, j));
  if (!list.length) { flash(erase ? 'No road there' : "Can't build a road there"); return; }
  await mutate((st) => {
    const have = new Map(st.roads.map(([i, j]) => [tk(i, j), [i, j]]));
    for (const [i, j] of list) { if (erase) have.delete(tk(i, j)); else have.set(tk(i, j), [i, j]); }
    st.roads = [...have.values()];
    return null;
  });
}
async function claimPlot(id) {
  if (!player.name.trim()) { flash('Enter your name first (top bar)'); $('pname').focus(); return; }
  const ok = await mutate((st) => {
    const p = st.plots.find((q) => q.id === id);
    if (!p) return 'That plot is gone';
    if (p.owner) return 'Somebody already claimed it';
    if (st.plots.some((q) => q.owner === player.id)) return 'You already own a plot';
    p.owner = player.id; p.ownerName = player.name.trim(); p.bld = null;
    return null;
  });
  if (ok) { state.selected = plots.find((p) => p.id === id); showPanel(); openBuild(state.selected); }
}
async function buildOn(id, bld) {
  await mutate((st) => {
    const p = st.plots.find((q) => q.id === id);
    if (!p || p.owner !== player.id) return 'Not your plot';
    p.bld = bld; p.bseed = Math.floor(Math.random() * 1e6);
    return null;
  });
}
async function editPlot(id, patch, mineOnly = true) {
  await mutate((st) => {
    const p = st.plots.find((q) => q.id === id);
    if (!p || (mineOnly && p.owner !== player.id && !admin)) return 'Not your plot';
    Object.assign(p, patch);
    return null;
  });
}
async function releasePlot(id) {
  await mutate((st) => {
    const p = st.plots.find((q) => q.id === id);
    if (!p || (p.owner !== player.id && !admin)) return 'Not your plot';
    p.owner = null; p.ownerName = null; p.bld = null;
    return null;
  });
}

// ---------- terrain ----------
const hash = (i, j) => { let x = (i * 374761393 + j * 668265263) | 0; x = (x ^ (x >>> 13)) * 1274126177; return ((x ^ (x >>> 16)) >>> 0) / 4294967296; };
const zv = (x, y) => Math.max(state.world.H(x, y), SEA) * Z;
function groundZ(i, j, fx = 0, fy = 0) {
  const x = Math.floor(i), y = Math.floor(j), u = i - x + fx, v = j - y + fy;
  return (zv(x, y) * (1 - u) + zv(x + 1, y) * u) * (1 - v) + (zv(x, y + 1) * (1 - u) + zv(x + 1, y + 1) * u) * v;
}
const VS = CH + 1;
const cz = (c, lx, ly) => Math.max(c.V[ly * VS + lx], SEA) * Z;

function tileColor(c, lx, ly, k) {
  const t = ly * CH + lx, h = c.hAt[t], sl = c.slope[t], winter = PAL.winter, fall = PAL.season === 'fall';
  switch (k) {
    case K.WATER: return c.shallow[t] ? shade(PAL.water, 0.06, 0, 0) : shade(PAL.water, -0.03);
    case K.SAND: return PAL.sand;
    case K.FOREST: return winter ? '#dbe4e9' : shade(PAL.grass, -0.09, 0, 0.06);
    case K.ALPINE: return winter ? '#e4eaee' : fall ? '#b9ae7a' : '#a6b08a';
    case K.ROCK: return winter && sl < 0.03 ? '#e6ecef' : sl > 0.09 ? '#7d7a77' : '#908c86';
    case K.SNOW: return '#f3f6f8';
    default: return h > 0.55 && !winter ? shade(PAL.grass, 0.0, -4, -0.05) : PAL.grass;
  }
}

function pathTile(g, i, j, z00, z10, z11, z01) {
  const a = P(i, j, z00), b = P(i + 1, j, z10), c = P(i + 1, j + 1, z11), d = P(i, j + 1, z01);
  g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.lineTo(c[0], c[1]); g.lineTo(d[0], d[1]); g.closePath();
}
function edge(g, i, j, z, side) {
  // side 0: j edge, 1: i+1 edge, 2: j+1 edge, 3: i edge
  const pts = [[i, j, i + 1, j], [i + 1, j, i + 1, j + 1], [i, j + 1, i + 1, j + 1], [i, j, i, j + 1]][side];
  const a = P(pts[0], pts[1], z[0]), b = P(pts[2], pts[3], z[1]);
  g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
}
function drawRoadTile(g, i, j, z00, z10, z11, z01) {
  pathTile(g, i, j, z00, z10, z11, z01);
  g.fillStyle = '#86827d'; g.fill();
  const nb = [roadAt(i, j - 1), roadAt(i + 1, j), roadAt(i, j + 1), roadAt(i - 1, j)];
  g.strokeStyle = '#cfc9b9'; g.lineWidth = 2.2; g.lineCap = 'butt';
  const zs = [[z00, z10], [z10, z11], [z01, z11], [z00, z01]];
  nb.forEach((has, s) => { if (!has) edge(g, i, j, zs[s], s); });
  const zc = (z00 + z10 + z11 + z01) / 4, [cx, cy] = P(i + 0.5, j + 0.5, zc);
  const mids = [[i + 0.5, j, (z00 + z10) / 2], [i + 1, j + 0.5, (z10 + z11) / 2], [i + 0.5, j + 1, (z01 + z11) / 2], [i, j + 0.5, (z00 + z01) / 2]];
  g.strokeStyle = '#f1e2a0'; g.lineWidth = 1.5; g.setLineDash([5, 4]);
  let any = false;
  nb.forEach((has, s) => { if (has) { any = true; const [mx, my] = P(...mids[s]); g.beginPath(); g.moveTo(cx, cy); g.lineTo(mx, my); g.stroke(); } });
  g.setLineDash([]);
  if (!any) { g.fillStyle = '#f1e2a0'; g.beginPath(); g.arc(cx, cy, 1.6, 0, 7); g.fill(); }
}

function plotTint(p) {
  const base = ZONES[p.zone][1];
  return { fill: base + (p.owner ? '55' : '40'), line: p.owner === player.id ? '#ffffff' : shade(base, -0.18) };
}

function renderChunk(c) {
  const i0 = c.ci * CH, j0 = c.cj * CH;
  let minY = 1e9, maxY = -1e9;
  for (let y = 0; y <= CH; y++) for (let x = 0; x <= CH; x++) {
    const sy = (i0 + x + j0 + y) * 16 - cz(c, x, y);
    minY = Math.min(minY, sy); maxY = Math.max(maxY, sy);
  }
  const minX = (i0 - (j0 + CH)) * 32 - 3, maxX = ((i0 + CH) - j0) * 32 + 3;
  minY -= 4; maxY += 6;
  const cv = document.createElement('canvas');
  cv.width = Math.ceil(maxX - minX); cv.height = Math.ceil(maxY - minY);
  const g = cv.getContext('2d');
  g.translate(-minX, -minY);
  g.lineJoin = 'round';
  for (let d = 0; d <= 2 * CH - 2; d++) {
    for (let lx = Math.max(0, d - CH + 1); lx <= Math.min(CH - 1, d); lx++) {
      const ly = d - lx, i = i0 + lx, j = j0 + ly;
      const k = c.kinds[ly * CH + lx];
      const z00 = cz(c, lx, ly), z10 = cz(c, lx + 1, ly), z11 = cz(c, lx + 1, ly + 1), z01 = cz(c, lx, ly + 1);
      let col;
      if (k === K.WATER) col = tileColor(c, lx, ly, k);
      else {
        const base = tileColor(c, lx, ly, k);
        const dx = (z10 + z11 - z00 - z01) / 2, dy = (z01 + z11 - z00 - z10) / 2;
        const delta = Math.max(-0.2, Math.min(0.18, 0.02 * (dx * 0.7 - dy * 0.3))) + (hash(i, j) - 0.5) * 0.025;
        const [hh, ss, ll] = hexToHsl(base);
        col = hsl(hh - (delta < 0 ? 5 : 0), ss, ll + delta);
      }
      poly(g, [[i, j, z00], [i + 1, j, z10], [i + 1, j + 1, z11], [i, j + 1, z01]], col);
      if (k === K.WATER && hash(i * 3, j * 7) < 0.16) {
        const [sx, sy] = P(i + 0.5, j + 0.5, z00);
        g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 1; g.beginPath(); g.moveTo(sx - 4, sy); g.lineTo(sx + 4, sy); g.stroke();
      }
      if (roadAt(i, j)) drawRoadTile(g, i, j, z00, z10, z11, z01);
      const p = plotAt(i, j);
      if (p) {
        const tint = plotTint(p);
        pathTile(g, i, j, z00, z10, z11, z01);
        g.fillStyle = tint.fill; g.fill();
        g.strokeStyle = tint.line; g.lineWidth = 2.2;
        if (plotAt(i, j - 1) !== p) edge(g, i, j, [z00, z10], 0);
        if (plotAt(i + 1, j) !== p) edge(g, i, j, [z10, z11], 1);
        if (plotAt(i, j + 1) !== p) edge(g, i, j, [z01, z11], 2);
        if (plotAt(i - 1, j) !== p) edge(g, i, j, [z00, z01], 3);
      }
    }
  }
  return { canvas: cv, ox: minX, oy: minY, ci: c.ci, cj: c.cj };
}

// ---------- world lifecycle ----------
let mmOrg = null, mmBase = null;
async function buildWorld(fresh) {
  const rs = resolved();
  applySeason(rs.season, rs.holiday);
  document.body.dataset.season = rs.season;
  if (fresh || !state.world || state.world.seed !== state.seed) {
    state.world = makeWorld(state.seed);
    plots = []; occ = new Map(); roadMap = new Map(); itemIdx = new Map(); version = 0; state.synced = false;
    state.selected = null;
    const st = state.world.findStart();
    const i = +(qs.get('cx') || st.i), j = +(qs.get('cy') || st.j);
    const c = P(i + 0.5, j + 0.5, groundZ(i, j));
    state.cam = [c[0], c[1]];
  }
  rcache = new Map(); sprites = new Map(); mmOrg = null;
  state.dirty = true;
  showPanel();
  await sync();
}
function centerOn(p) { const c = P(p.i + p.w / 2, p.j + p.d / 2, p.h * Z); state.cam = [c[0], c[1]]; state.dirty = true; }

// ---------- minimap ----------
const MR = 128, MS = 2;
mini.width = MR; mini.height = MR;
function miniRebuild(ci, cj) {
  const world = state.world, oi = Math.round(ci - MR * MS / 2), oj = Math.round(cj - MR * MS / 2);
  const img = mctx.createImageData(MR, MR);
  const colors = {
    [K.WATER]: '#6aa5c8', [K.FOREST]: '#4f7f4a', [K.ROCK]: '#8a8782', [K.SNOW]: '#f2f5f7', [K.ALPINE]: '#a6b08a', [K.SAND]: '#e0cf9c',
    [K.GRASS]: PAL.winter ? '#e9eff2' : PAL.grass,
  };
  for (let y = 0; y < MR; y++) for (let x = 0; x < MR; x++) {
    const n = parseInt(colors[world.sampleKind(oi + x * MS, oj + y * MS)].slice(1), 16), p = (y * MR + x) * 4;
    img.data[p] = (n >> 16) & 255; img.data[p + 1] = (n >> 8) & 255; img.data[p + 2] = n & 255; img.data[p + 3] = 255;
  }
  mmBase = img; mmOrg = { i: oi, j: oj };
}
const toMini = (i, j) => [(i - mmOrg.i) / MS, (j - mmOrg.j) / MS];

// ---------- projection helpers ----------
function screenToTile(sx, sy) {
  const wx = state.cam[0] + (sx - canvas.clientWidth / 2) / state.zoom, wy = state.cam[1] + (sy - canvas.clientHeight / 2) / state.zoom;
  let z = SEA * Z, i = 0, j = 0;
  for (let k = 0; k < 5; k++) {
    const s = (wy + z) / 16, d = wx / 32;
    i = (s + d) / 2; j = (s - d) / 2;
    z = groundZ(i, j);
  }
  return [i, j];
}
const camTile = () => screenToTile(canvas.clientWidth / 2, canvas.clientHeight / 2);

// ---------- ghost / selection drawing ----------
const planning = () => admin && state.mode === 'plan';
function ghostRect() {
  if (!planning() || state.tool !== 'plot' || !state.hover) return null;
  const h = state.hover;
  if (state.preset === 'custom') {
    const d = state.drag;
    if (d && d.rect) {
      const i = Math.min(d.rect.i0, d.rect.i1), j = Math.min(d.rect.j0, d.rect.j1);
      return { i, j, w: Math.abs(d.rect.i1 - d.rect.i0) + 1, d: Math.abs(d.rect.j1 - d.rect.j0) + 1 };
    }
    return { i: Math.floor(h.fi), j: Math.floor(h.fj), w: 1, d: 1 };
  }
  let [w, d] = state.preset.split('x').map(Number);
  if (state.rot) [w, d] = [d, w];
  return { i: Math.round(h.fi - w / 2), j: Math.round(h.fj - d / 2), w, d };
}
let ghostCache = { key: '', v: null };
function ghostValid(r) {
  const key = `${r.i},${r.j},${r.w},${r.d},${version}`;
  if (ghostCache.key !== key) ghostCache = { key, v: validate(r.i, r.j, r.w, r.d) };
  return ghostCache.v;
}
function outline(i, j, w, d, z) {
  const pts = [];
  for (let x = 0; x <= w; x++) pts.push([i + x, j]);
  for (let y = 1; y <= d; y++) pts.push([i + w, j + y]);
  for (let x = w - 1; x >= 0; x--) pts.push([i + x, j + d]);
  for (let y = d - 1; y > 0; y--) pts.push([i, j + y]);
  ctx.beginPath();
  pts.forEach(([x, y], n) => { const [sx, sy] = P(x, y, z === undefined ? zv(x, y) + 1 : z); n ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy); });
  ctx.closePath();
}
function drawGhost(r) {
  const v = ghostValid(r), z = v.ok ? v.level * Z + 1 : null;
  const col = v.ok ? ZONES[state.zone][1] : '#e0506a';
  ctx.save();
  ctx.fillStyle = col + '88';
  for (let y = 0; y < r.d; y++) for (let x = 0; x < r.w; x++) {
    const i = r.i + x, j = r.j + y;
    const zs = z === null ? [zv(i, j) + 1, zv(i + 1, j) + 1, zv(i + 1, j + 1) + 1, zv(i, j + 1) + 1] : [z, z, z, z];
    pathTile(ctx, i, j, ...zs); ctx.fill();
  }
  outline(r.i, r.j, r.w, r.d, z === null ? undefined : z);
  ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 6; ctx.stroke();
  ctx.strokeStyle = v.ok ? shade(col, -0.2) : col; ctx.lineWidth = 3; ctx.setLineDash(v.ok ? [] : [7, 5]); ctx.stroke();
  ctx.restore();
  return v;
}
function drawStroke() {
  const s = state.stroke;
  if (!s) return;
  ctx.save();
  for (const [i, j] of s.tiles) {
    const ok = s.erase ? roadAt(i, j) : roadOk(i, j);
    ctx.fillStyle = s.erase ? 'rgba(224,80,106,.55)' : ok ? 'rgba(90,86,80,.75)' : 'rgba(224,80,106,.45)';
    pathTile(ctx, i, j, zv(i, j) + 1, zv(i + 1, j) + 1, zv(i + 1, j + 1) + 1, zv(i, j + 1) + 1); ctx.fill();
  }
  ctx.restore();
}
function drawSelected(p) {
  ctx.save();
  outline(p.i, p.j, p.w, p.d, p.h * Z + 1);
  ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 6; ctx.stroke();
  ctx.strokeStyle = shade(ZONES[p.zone][1], -0.28); ctx.lineWidth = 3; ctx.setLineDash([9, 6]); ctx.stroke();
  ctx.restore();
}
function label(text, i, j, z, strong) {
  const [x, y] = P(i, j, z);
  ctx.save();
  ctx.font = '700 12px system-ui, sans-serif';
  const w = ctx.measureText(text).width + 14;
  ctx.fillStyle = strong ? 'rgba(74,63,51,.92)' : 'rgba(251,246,232,.9)';
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - 24, w, 20, 10); ctx.fill();
  ctx.fillStyle = strong ? '#fbf6e8' : '#4a3f33'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y - 14);
  ctx.restore();
}
const plotLabel = (p) => (p.owner ? `${p.ownerName}${p.bld && p.bld !== 'Park' && p.bld !== 'Farmstead' ? ' · ' + p.bld : ''}` : `${p.name} · ${p.w}×${p.d} · free`);

// ---------- frame ----------
function render() {
  const w = state.world, rs = resolved(), t0 = performance.now();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const W = canvas.clientWidth, Hh = canvas.clientHeight;
  if (canvas.width !== W * dpr || canvas.height !== Hh * dpr) { canvas.width = W * dpr; canvas.height = Hh * dpr; }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  const winter = PAL.winter;
  sky.addColorStop(0, winter ? '#dfe9f0' : '#cfe6f2'); sky.addColorStop(1, winter ? '#f0f4f6' : '#eef3e4');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, canvas.width, canvas.height);
  const z = state.zoom * dpr;
  ctx.setTransform(z, 0, 0, z, canvas.width / 2 - state.cam[0] * z, canvas.height / 2 - state.cam[1] * z);
  const vx0 = state.cam[0] - canvas.width / 2 / z, vx1 = state.cam[0] + canvas.width / 2 / z;
  const vy0 = state.cam[1] - canvas.height / 2 / z, vy1 = state.cam[1] + canvas.height / 2 / z;

  const sMin = vy0 / 16, sMax = (vy1 + Z) / 16, dMin = vx0 / 32, dMax = vx1 / 32;
  const ci0 = Math.floor((sMin + dMin) / 2 / CH) - 1, ci1 = Math.floor((sMax + dMax) / 2 / CH) + 1;
  const cj0 = Math.floor((sMin - dMax) / 2 / CH) - 1, cj1 = Math.floor((sMax - dMin) / 2 / CH) + 1;
  const need = [];
  for (let cj = cj0; cj <= cj1; cj++) for (let ci = ci0; ci <= ci1; ci++) {
    const x0 = (ci * CH - (cj + 1) * CH) * 32, x1 = ((ci + 1) * CH - cj * CH) * 32;
    const y0 = (ci + cj) * CH * 16 - Z - 20, y1 = (ci + cj + 2) * CH * 16 + 60;
    if (x1 < vx0 - 100 || x0 > vx1 + 100 || y1 < vy0 - 60 || y0 > vy1 + 200) continue;
    need.push([ci, cj]);
  }
  const [cti, ctj] = camTile();
  const cci = cti / CH, ccj = ctj / CH;
  const missing = need.filter(([ci, cj]) => !rcache.has(ckey(ci, cj))).sort((a, b) => Math.hypot(a[0] + 0.5 - cci, a[1] + 0.5 - ccj) - Math.hypot(b[0] + 0.5 - cci, b[1] + 0.5 - ccj));
  let more = false;
  for (const [ci, cj] of missing) {
    if (performance.now() - t0 > 22) { more = true; break; }
    rcache.set(ckey(ci, cj), renderChunk(w.chunk(ci, cj)));
  }
  need.sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
  const lowDetail = state.zoom < 0.5, thin = state.zoom < 0.38;
  const depth = (o) => o.i + o.fx + o.j + o.fy;
  let drawn = 0;
  for (const [ci, cj] of need) {
    const rc = rcache.get(ckey(ci, cj));
    if (!rc) continue;
    ctx.drawImage(rc.canvas, rc.ox, rc.oy);
    const c = w.chunk(ci, cj), i0 = ci * CH, j0 = cj * CH, its = itemIdx.get(ckey(ci, cj));
    const list = its ? c.objects.concat(its).sort((a, b) => depth(a) - depth(b)) : c.objects;
    for (const o of list) {
      if (!o.item && (plotAt(o.i, o.j) || roadAt(o.i, o.j))) continue;
      if (o.hol && !o.hol.includes(rs.holiday)) continue;
      if (lowDetail && (o.type === 'rock' || o.type === 'flowers' || o.type === 'bush')) continue;
      if (thin && !o.k && (o.seed & 1)) continue;
      let zz = o.z;
      if (zz === undefined) {
        const lx = o.i - i0, ly = o.j - j0;
        zz = (cz(c, lx, ly) * (1 - o.fx) + cz(c, lx + 1, ly) * o.fx) * (1 - o.fy) + (cz(c, lx, ly + 1) * (1 - o.fx) + cz(c, lx + 1, ly + 1) * o.fx) * o.fy;
      }
      const [sx, sy] = P(o.i + o.fx, o.j + o.fy, zz);
      if (sx < vx0 - 220 || sx > vx1 + 220 || sy < vy0 - 100 || sy > vy1 + 380) continue;
      const s = sprite(o);
      if (s.isB) { const k = o.k; ctx.drawImage(s.c, sx - 160 * k, sy - 330 * k, 320 * k, 420 * k); } else {
        const sc = o.scale * (o.type === 'fenceX' || o.type === 'fenceY' ? 1 : 0.9);
        ctx.drawImage(s.c, sx - 120 * sc, sy - 230 * sc, 240 * sc, 300 * sc);
      }
      drawn++;
    }
  }
  if (rcache.size > 520) {
    const far = [...rcache.entries()].map(([k, v]) => [k, Math.hypot(v.ci - cci, v.cj - ccj)]).sort((a, b) => b[1] - a[1]);
    for (const [k] of far.slice(0, 120)) rcache.delete(k);
  }

  for (const p of plots) {
    const [sx, sy] = P(p.i + p.w / 2, p.j + p.d / 2, p.h * Z);
    if (sx < vx0 - 200 || sx > vx1 + 200 || sy < vy0 - 200 || sy > vy1 + 400) continue;
    if (p === state.selected) drawSelected(p);
    if (state.zoom > 0.5 || p === state.selected || p.owner === player.id) label(plotLabel(p), p.i + p.w / 2, p.j + p.d / 2, p.h * Z + (p.bld ? 60 : 4), p === state.selected || p.owner === player.id);
  }
  drawStroke();
  const r = ghostRect();
  if (r) state.ghostInfo = { r, v: drawGhost(r) }; else state.ghostInfo = null;

  if (!mmOrg || Math.abs(cti - (mmOrg.i + MR * MS / 2)) > 70 || Math.abs(ctj - (mmOrg.j + MR * MS / 2)) > 70) miniRebuild(cti, ctj);
  mctx.putImageData(mmBase, 0, 0);
  mctx.fillStyle = '#6b6761';
  for (const [i, j] of roadMap.values()) { const [mx, my] = toMini(i, j); mctx.fillRect(mx, my, 1, 1); }
  for (const p of plots) {
    const [mx, my] = toMini(p.i, p.j), mw = Math.max(1.5, p.w / MS), md = Math.max(1.5, p.d / MS);
    mctx.fillStyle = p.owner ? ZONES[p.zone][1] : 'rgba(255,255,255,.8)'; mctx.strokeStyle = p.owner === player.id ? '#d6382f' : '#4a3f33'; mctx.lineWidth = p.owner === player.id ? 1.2 : 0.6;
    mctx.fillRect(mx, my, mw, md); mctx.strokeRect(mx, my, mw, md);
  }
  const corners = [[0, 0], [W, 0], [W, Hh], [0, Hh]].map(([x, y]) => screenToTile(x, y)).map(([i, j]) => toMini(i, j));
  mctx.strokeStyle = '#fff'; mctx.lineWidth = 1.4; mctx.beginPath();
  corners.forEach(([x, y], n) => (n ? mctx.lineTo(x, y) : mctx.moveTo(x, y))); mctx.closePath(); mctx.stroke();

  $('perf').textContent = `${drawn} sprites, ${need.length} chunks, ${plots.length} plots, ${roadMap.size} road tiles`;
  $('status').textContent = `seed ${w.seed} | tile ${Math.round(cti)}, ${Math.round(ctj)} | ${rs.season}${rs.holiday ? ' | ' + HOLIDAY_LABEL[rs.holiday] : ''} | ${shared ? 'shared world' : 'local only'}`;
  setHint(state.ghostInfo);
  if (more) state.dirty = true;
}
function setHint(info) {
  const el = $('hint');
  let text = '', cls = '';
  if (planning()) {
    if (state.tool === 'plot') {
      if (!info) text = 'Move over the map to place a plot';
      else { cls = info.v.ok ? 'ok' : 'bad'; text = info.v.ok ? `${info.r.w}×${info.r.d} plot · ${info.r.w * info.r.d} tiles · click to place` : `Can't place: ${info.v.reason}`; }
    } else if (state.tool === 'road') text = 'Drag to paint road · right-drag to pan';
    else text = 'Drag over roads to erase · click a plot to remove it';
  }
  el.textContent = text; el.className = cls;
}
function loop() {
  if (state.dirty) { state.dirty = false; render(); }
  requestAnimationFrame(loop);
}

// ---------- UI helpers ----------
let flashTimer = 0;
function flash(msg) {
  const el = $('toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(flashTimer); flashTimer = setTimeout(() => el.classList.remove('show'), 2400);
}
function syncModeUI() {
  for (const b of document.querySelectorAll('[data-mode]')) b.classList.toggle('on', b.dataset.mode === state.mode);
  for (const b of document.querySelectorAll('[data-tool]')) b.classList.toggle('on', b.dataset.tool === state.tool);
  $('planTools').style.display = planning() ? 'contents' : 'none';
  $('plotOpts').style.display = planning() && state.tool === 'plot' ? 'contents' : 'none';
  canvas.style.cursor = planning() ? 'crosshair' : '';
}
function setMode(m) { state.mode = m; state.drag = null; state.stroke = null; state.ghostInfo = null; syncModeUI(); state.dirty = true; }
function setTool(t) { state.tool = t; state.drag = null; state.stroke = null; syncModeUI(); state.dirty = true; }
function refreshHeader() {
  const mine = myPlot(), b = $('mine');
  if (!b) return;
  b.style.display = mine ? '' : 'none';
  if (mine) b.textContent = `My plot: ${mine.name}`;
}

// ---------- plot panel ----------
function showPanel() {
  const el = $('panel'), p = state.selected;
  if (!p) { el.style.display = 'none'; el.textContent = ''; return; }
  el.style.display = 'block'; el.textContent = '';
  const mine = p.owner === player.id, row = mk('div', { className: 'prow' });
  const status = p.owner ? (mine ? 'Yours' : `Owned by ${p.ownerName}`) : 'Available';
  el.append(
    mk('div', { className: 'ptitle', textContent: p.name }),
    mk('div', { className: 'pmeta', textContent: `${p.w} × ${p.d} tiles · ${ZONES[p.zone][0]} · ${status}` }),
  );
  if (mine || (admin && planning())) {
    const name = mk('input', { value: p.name, maxLength: 28 });
    name.onchange = () => editPlot(p.id, { name: name.value.trim() || p.name }, false);
    el.append(mk('label', { textContent: 'Name' }, [name]));
  }
  if (admin && planning()) {
    const zone = mk('select');
    for (const [k, [t]] of Object.entries(ZONES)) zone.append(mk('option', { value: k, textContent: t }));
    zone.value = p.zone; zone.onchange = () => editPlot(p.id, { zone: zone.value, bld: null }, false);
    el.append(mk('label', { textContent: 'Zone' }, [zone]));
    row.append(mk('button', { textContent: 'Remove plot', className: 'danger', onclick: () => planRemovePlot(p.id) }));
  } else if (!p.owner) {
    const have = myPlot();
    if (have) {
      el.append(mk('div', { className: 'note', textContent: `You already own ${have.name}. One plot per person.` }));
      row.append(mk('button', { textContent: 'Go to my plot', onclick: () => { state.selected = have; centerOn(have); showPanel(); } }));
    } else row.append(mk('button', { textContent: 'Claim this plot', className: 'primary', onclick: () => claimPlot(p.id) }));
  } else if (mine) {
    row.append(mk('button', { textContent: p.bld ? 'Change building' : 'Build', className: 'primary', onclick: () => openBuild(p) }));
    if (p.bld) row.append(mk('button', { textContent: 'New look', onclick: () => buildOn(p.id, p.bld) }), mk('button', { textContent: 'Demolish', onclick: () => editPlot(p.id, { bld: null }) }));
    row.append(mk('button', { textContent: 'Release plot', className: 'danger', onclick: () => { if (confirm('Give this plot up? Your building goes with it.')) releasePlot(p.id); } }));
  }
  row.append(mk('button', { textContent: 'Center', onclick: () => centerOn(p) }), mk('button', { textContent: 'Close', onclick: () => { state.selected = null; showPanel(); state.dirty = true; } }));
  el.append(row);
}

// ---------- build menu ----------
function bounds(c) {
  const g = c.getContext('2d'), { width: w, height: h } = c, d = g.getImageData(0, 0, w, h).data;
  let x0 = w, y0 = h, x1 = 0, y1 = 0;
  for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) if (d[(y * w + x) * 4 + 3] > 12) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  return x1 > x0 ? [x0, y0, x1 - x0 + 2, y1 - y0 + 2] : [0, 0, w, h];
}
function thumb(type, seed) {
  const s = sprite({ type, seed });
  const cv = mk('canvas', { width: 150, height: 120 }), g = cv.getContext('2d');
  g.imageSmoothingQuality = 'high';
  const [x, y, w, h] = bounds(s.c), k = Math.min(130 / w, 104 / h, 2.4);
  g.drawImage(s.c, x, y, w, h, 75 - (w * k) / 2, 112 - h * k, w * k, h * k);
  return cv;
}
function openBuild(p) {
  if (!p || p.owner !== player.id) return;
  const menu = $('build'), grid = mk('div', { className: 'bgrid' });
  menu.textContent = '';
  const close = () => { menu.style.display = 'none'; };
  const pick = async (bld) => { close(); await buildOn(p.id, bld); };
  const specialThumb = { Park: 'fountain', Farmstead: 'barn' };
  for (const def of fitList(p.zone, p.w, p.d)) {
    const type = def.special ? specialThumb[def.name] : 'B:' + def.name;
    grid.append(mk('button', { className: 'bcard', onclick: () => pick(def.name) }, [
      thumb(type, 3),
      mk('div', { className: 'bname', textContent: def.special ? (def.name === 'Park' ? 'Park (trees & play)' : 'Farmstead') : def.name }),
    ]));
  }
  if (!grid.children.length) grid.append(mk('div', { className: 'note', textContent: `Nothing fits a ${p.w}×${p.d} ${ZONES[p.zone][0]} plot.` }));
  menu.append(mk('div', { className: 'bcard-wrap' }, [
    mk('div', { className: 'ptitle', textContent: `What will you build on ${p.name}?` }),
    mk('div', { className: 'pmeta', textContent: `${p.w} × ${p.d} tiles · ${ZONES[p.zone][0]} zone. Bigger plots hold several copies.` }),
    grid, mk('div', { className: 'prow' }, [mk('button', { textContent: 'Leave empty for now', onclick: close })]),
  ]));
  menu.style.display = 'flex';
}
$('build').addEventListener('pointerdown', (e) => { if (e.target === $('build')) $('build').style.display = 'none'; });

// ---------- input ----------
let down = null;
const localXY = (e) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
function updateHover(e) {
  const [x, y] = localXY(e), [fi, fj] = screenToTile(x, y);
  const h = state.hover;
  if (!h || Math.floor(fi) !== Math.floor(h.fi) || Math.floor(fj) !== Math.floor(h.fj) || planning()) state.dirty = true;
  state.hover = { fi, fj, i: Math.floor(fi), j: Math.floor(fj) };
}
// 4-connected tiles between two tiles
function line4(a, b) {
  const out = [];
  let [x, y] = a;
  const dx = Math.abs(b[0] - x), dy = Math.abs(b[1] - y), sx = x < b[0] ? 1 : -1, sy = y < b[1] ? 1 : -1;
  let err = dx - dy;
  while ((x !== b[0] || y !== b[1]) && out.length < 400) {
    if (2 * err > -dy) { err -= dy; x += sx; } else { err += dx; y += sy; }
    out.push([x, y]);
  }
  return out;
}
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
canvas.addEventListener('pointerdown', (e) => {
  updateHover(e);
  down = { x: e.clientX, y: e.clientY, cam: [...state.cam], btn: e.button, moved: false, rect: null, paint: false };
  if (planning() && e.button === 0) {
    if (state.tool === 'plot' && state.preset === 'custom') { down.rect = { i0: state.hover.i, j0: state.hover.j, i1: state.hover.i, j1: state.hover.j }; state.drag = { rect: down.rect }; }
    if (state.tool === 'road' || state.tool === 'erase') {
      const t = [state.hover.i, state.hover.j];
      state.stroke = { tiles: [t], last: t, erase: state.tool === 'erase' };
      down.paint = true;
    }
  }
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', (e) => {
  updateHover(e);
  if (!down) return;
  const dx = e.clientX - down.x, dy = e.clientY - down.y;
  if (Math.hypot(dx, dy) > 5) down.moved = true;
  if (down.rect) {
    down.rect.i1 = Math.max(down.rect.i0 - MAX_PLOT + 1, Math.min(down.rect.i0 + MAX_PLOT - 1, state.hover.i));
    down.rect.j1 = Math.max(down.rect.j0 - MAX_PLOT + 1, Math.min(down.rect.j0 + MAX_PLOT - 1, state.hover.j));
    state.dirty = true;
  } else if (down.paint && state.stroke) {
    const t = [state.hover.i, state.hover.j], s = state.stroke;
    if (t[0] !== s.last[0] || t[1] !== s.last[1]) { s.tiles.push(...line4(s.last, t)); s.last = t; state.dirty = true; }
  } else if (down.moved) {
    state.cam = [down.cam[0] - dx / state.zoom, down.cam[1] - dy / state.zoom];
    state.dirty = true;
  }
});
canvas.addEventListener('pointerup', async () => {
  const d = down; down = null;
  if (!d) return;
  if (d.rect) { const r = ghostRect(); state.drag = null; if (r) await planAddPlot(r); state.dirty = true; return; }
  if (d.paint && state.stroke) {
    const s = state.stroke; state.stroke = null;
    const under = state.hover && plotAt(state.hover.i, state.hover.j);
    // a plain click with the erase tool removes the plot under the cursor
    if (s.erase && !d.moved && under && !roadAt(state.hover.i, state.hover.j)) await planRemovePlot(under.id);
    else await planRoads(s.tiles, s.erase);
    state.dirty = true; return;
  }
  if (d.moved || d.btn !== 0) return;
  if (planning() && state.tool === 'plot') { const r = ghostRect(); if (r) await planAddPlot(r); }
  else { state.selected = state.hover ? plotAt(state.hover.i, state.hover.j) || null : null; showPanel(); }
  state.dirty = true;
});
canvas.addEventListener('pointerleave', () => { if (!down) { state.hover = null; state.dirty = true; } });
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const f = Math.exp(-e.deltaY * 0.0012), old = state.zoom;
  state.zoom = Math.max(0.35, Math.min(1.8, old * f));
  const rect = canvas.getBoundingClientRect(), mx = e.clientX - rect.left - rect.width / 2, my = e.clientY - rect.top - rect.height / 2;
  state.cam = [state.cam[0] + mx * (1 / old - 1 / state.zoom), state.cam[1] + my * (1 / old - 1 / state.zoom)];
  state.dirty = true;
}, { passive: false });
window.addEventListener('keydown', (e) => {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) { if (e.key === 'Escape') e.target.blur(); return; }
  const s = 80 / state.zoom, m = { w: [0, -s], s: [0, s], a: [-s, 0], d: [s, 0], ArrowUp: [0, -s], ArrowDown: [0, s], ArrowLeft: [-s, 0], ArrowRight: [s, 0] }[e.key];
  if (m) { state.cam = [state.cam[0] + m[0], state.cam[1] + m[1]]; state.dirty = true; }
  else if (e.key === 'r' || e.key === 'R') { state.rot = !state.rot; syncRot(); state.dirty = true; }
  else if (e.key === 'Escape') { $('build').style.display = 'none'; state.selected = null; showPanel(); state.dirty = true; }
});
mini.addEventListener('pointerdown', (e) => {
  const r = mini.getBoundingClientRect(), i = mmOrg.i + ((e.clientX - r.left) / r.width) * MR * MS, j = mmOrg.j + ((e.clientY - r.top) / r.height) * MR * MS;
  const c = P(i, j, groundZ(i, j));
  state.cam = [c[0], c[1]]; state.dirty = true;
});
window.addEventListener('resize', () => { state.dirty = true; });

// ---------- UI ----------
let rotBtn = null;
function syncRot() { if (rotBtn) rotBtn.classList.toggle('on', state.rot); }
function ui() {
  const bar = $('bar'), sel = (opts, get, set, host = bar) => {
    const s = document.createElement('select');
    for (const [v, t] of opts) { const o = document.createElement('option'); o.value = v; o.textContent = t; s.appendChild(o); }
    s.value = get(); s.onchange = () => set(s.value); host.appendChild(s); return s;
  };
  const btn = (t, fn, host = bar) => { const b = mk('button', { textContent: t, onclick: fn }); host.appendChild(b); return b; };

  const pname = mk('input', { id: 'pname', placeholder: 'Your name', value: player.name, maxLength: 20 });
  pname.onchange = () => { player.name = pname.value.trim(); try { localStorage.setItem('player.name', player.name); } catch { /* ignore */ } };
  bar.append(pname);
  btn('', () => { const m = myPlot(); if (m) { state.selected = m; centerOn(m); showPanel(); } }).id = 'mine';
  if (admin) {
    const pm = btn('Play', () => setMode('play')); pm.dataset.mode = 'play';
    const pl = btn('Plan', () => setMode('plan')); pl.dataset.mode = 'plan';
    const tools = $('planTools');
    bar.append(tools);
    for (const [t, name] of [['plot', 'Plots'], ['road', 'Roads'], ['erase', 'Erase']]) { const b = btn(name, () => setTool(t), tools); b.dataset.tool = t; }
    const opts = $('plotOpts');
    tools.append(opts);
    sel(PRESETS.map((p) => [p, p === 'custom' ? 'Custom (drag)' : p.replace('x', '×')]), () => state.preset, (v) => { state.preset = v; state.dirty = true; }, opts);
    rotBtn = btn('Rotate (R)', () => { state.rot = !state.rot; syncRot(); state.dirty = true; }, opts);
    sel(Object.entries(ZONES).map(([k, [t]]) => [k, t]), () => state.zone, (v) => { state.zone = v; state.dirty = true; }, opts);
    btn('New world', () => { state.seed = Math.floor(Math.random() * 99999); buildWorld(true); });
  }
  sel([['auto', 'Season: auto'], ...SEASONS.map((s) => [s, s[0].toUpperCase() + s.slice(1)])], () => state.season, (v) => { state.season = v; buildWorld(); });
  sel([['auto', 'Holiday: auto'], ['none', 'No holiday'], ...HOLIDAYS.map((h) => [h, HOLIDAY_LABEL[h]])], () => state.holiday, (v) => { state.holiday = v; buildWorld(); });
  btn('Assets', () => { location.href = 'index.html'; });
  syncModeUI(); refreshHeader();
}
ui();
buildWorld(true);
state.zoom = +(qs.get('zoom') || 0.7);
if (admin && qs.get('mode') === 'plan') setMode('plan');
setInterval(() => { if (!down) sync(); }, 4000);
loop();
window.__map = state;
window.__api = { validate, claimPlot, planAddPlot, planRoads, buildOn, get plots() { return plots; }, screenToTile, player, mutate };
