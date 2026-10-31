// What can stand on a plot, and how it is laid out. A building has a native cell size `c` (tiles).
// A plot is divided into a grid of cells; each cell holds one copy, scaled to fit the cell.
import { rng } from '../colors.js';
import { ASSETS } from '../registry.js';

const KMAX = 1.3;        // never blow a sprite up more than this
const MAX_COPIES = 36;
const GAP = 1.4;         // each copy gets a cell this many times its native size, leaving yard around it

// [registry name, native cell size in tiles]
const LISTS = {
  residential: [['Cottage', 1], ['House', 1], ['Bungalow', 1.2], ['Victorian', 1.2], ['Townhouses', 2], ['Mansion', 2.2], ['Apartments', 1.6], ['Apartment tower', 1.3]],
  commercial: [['Shop', 1], ['Café', 1], ['Restaurant', 1], ['Bakery', 1], ['Bank', 1], ['Brewery', 1.4], ['Gas station', 1.6], ['Hotel', 1.3], ['Office block', 1.2],
    ['Office tower', 1.1], ['Glass tower', 1.1], ['Art deco tower', 1], ['Supermarket / mall', 2.2], ['Parking garage', 1.6], ['Cinema', 1.8], ['Gym', 1.2]],
  industrial: [['Warehouse', 2], ['Factory', 2], ['Power plant', 2.2], ['Grain elevator', 1], ['Water tower', 1], ['Substation', 1.2], ['Wastewater plant', 1.8],
    ['Shipping containers', 1], ['Crane', 1.4], ['Hangar', 2.2]],
  civic: [['Church', 1.4], ['School', 2], ['Hospital', 1.8], ['Fire station', 1.4], ['Police station', 1.2], ['Capitol', 2.4], ['Library', 1.2], ['Post office', 1],
    ['Museum', 1.8], ['University', 2.2], ['Stadium', 2.8], ['Arena', 2.2]],
  farm: [['Barn', 1.4], ['Farmhouse', 1.2], ['Windmill', 1]],
  park: [], reserved: [],
};
// layouts that fill a plot on their own
const SPECIAL = { park: [['Park', 2]], farm: [['Farmstead', 4]] };

const byName = new Map(ASSETS.map((a) => [a.name, a]));
export const CATALOG = {};
for (const [zone, list] of Object.entries(LISTS)) {
  CATALOG[zone] = list.filter(([n]) => byName.has(n)).map(([name, c]) => ({ name, c, asset: byName.get(name) }));
}
for (const [zone, list] of Object.entries(SPECIAL)) for (const [name, min] of list) CATALOG[zone].unshift({ name, c: min / 1.4, special: true, min });

export const fits = (def, w, d) => (def.special ? Math.min(w, d) >= def.min : Math.min(w, d) >= def.c);
export const fitList = (zone, w, d) => (CATALOG[zone] || []).filter((def) => fits(def, w, d));
export const drawerFor = (name) => byName.get(name);

// grid of copies for a plain building
function copies(def, w, d) {
  let cx = Math.max(1, Math.floor(w / (def.c * GAP) + 0.4)), cd = Math.max(1, Math.floor(d / (def.c * GAP) + 0.4));
  while (cx * cd > MAX_COPIES) { if (cx >= cd) cx--; else cd--; }
  return [cx, cd];
}
export function autoPick(zone, w, d, seed) {
  let list = fitList(zone, w, d);
  const modest = list.filter((def) => def.special || copies(def, w, d).reduce((a, b) => a * b, 1) <= 9);
  if (modest.length) list = modest;
  if (!list.length) return null;
  const sp = list.filter((x) => x.special);
  if (sp.length) return sp[0].name;                     // parks and farms always use their layout
  return list[Math.floor(rng(seed)() * list.length)].name;
}

const put = (out, type, x, y, extra = {}) => out.push({ type, i: Math.floor(x), j: Math.floor(y), fx: x - Math.floor(x), fy: y - Math.floor(y), item: true, ...extra });

function park(p, r) {
  const out = [], { i, j, w, d } = p;
  for (let y = 0; y < d; y++) for (let x = 0; x < w; x++) {
    const q = r();
    const px = i + x + r.range(0.2, 0.8), py = j + y + r.range(0.2, 0.8);
    if (q < 0.2) put(out, r() < 0.3 ? 'cottonwood' : 'leaf', px, py, { scale: r.range(0.8, 1), seed: Math.floor(r() * 1e6) });
    else if (q < 0.3) put(out, 'bush', px, py, { scale: 0.9, seed: Math.floor(r() * 1e6) });
    else if (q < 0.45) put(out, 'flowers', px, py, { scale: 0.8, seed: Math.floor(r() * 1e6) });
  }
  if (w >= 3 && d >= 3) put(out, 'fountain', i + w / 2, j + d / 2, { scale: 1, seed: 1 });
  if (w >= 4 && d >= 4) { put(out, 'playground', i + 1.5, j + d - 1.5, { scale: 1, seed: 2 }); put(out, 'picnic', i + w - 1.5, j + 1.5, { scale: 1, seed: 3 }); }
  return out;
}
function farm(p, r) {
  const out = [], { i, j, w, d } = p, S = () => Math.floor(r() * 1e6);
  for (let x = 0; x < w; x++) { put(out, 'fenceX', i + x + 0.5, j + 0.05, { scale: 1, seed: S() }); put(out, 'fenceX', i + x + 0.5, j + d - 0.05, { scale: 1, seed: S() }); }
  for (let y = 0; y < d; y++) { put(out, 'fenceY', i + 0.05, j + y + 0.5, { scale: 1, seed: S() }); put(out, 'fenceY', i + w - 0.05, j + y + 0.5, { scale: 1, seed: S() }); }
  put(out, 'barn', i + w * 0.3, j + d * 0.35, { scale: 0.9, seed: S() });
  put(out, 'farmhouse', i + w * 0.72, j + d * 0.3, { scale: 0.95, seed: S() });
  if (w >= 6) put(out, 'silo', i + w * 0.5, j + d * 0.2, { scale: 0.9, seed: S() });
  put(out, 'haybale', i + w * 0.75, j + d * 0.7, { scale: 0.9, seed: S() });
  for (let c = 0; c < Math.max(2, Math.floor(w * d / 8)); c++) put(out, 'cow', i + r.range(1, w - 1), j + r.range(d * 0.55, d - 0.8), { scale: 1, seed: S() });
  return out;
}

// items for one plot, sorted for drawing; z is the (flattened) ground height in px
export function layoutPlot(p, Z) {
  if (!p.bld) return [];
  const r = rng(p.id * 7919 + (p.bseed || 0));
  const z = p.h * Z;
  let out;
  if (p.bld === 'Park') out = park(p, r);
  else if (p.bld === 'Farmstead') out = farm(p, r);
  else {
    const def = (CATALOG[p.zone] || []).find((x) => x.name === p.bld);
    if (!def) return [];
    const [cx, cd] = copies(def, p.w, p.d), sw = p.w / cx, sd = p.d / cd, k = Math.min(KMAX, Math.min(sw, sd) / (def.c * GAP));
    out = [];
    for (let y = 0; y < cd; y++) for (let x = 0; x < cx; x++) put(out, 'B:' + def.name, p.i + (x + 0.5) * sw, p.j + (y + 0.5) * sd, { k, seed: Math.floor(r() * 1e6) });
  }
  for (const o of out) o.z = z;
  return out.sort((a, b) => a.i + a.fx + a.j + a.fy - (b.i + b.fx + b.j + b.fy));
}
