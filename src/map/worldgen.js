// Infinite procedural world. Every height is a pure function of (x, y, seed), so chunks are built
// on demand and always line up. Layout echoes Colorado: mountain ranges, foothills, plains, lakes, rivers.
import { makeNoise, smooth } from './noise.js';
import { rng } from '../colors.js';

export const SEA = 0.34;
export const CH = 8;                      // chunk size in tiles
export const K = { WATER: 0, SAND: 1, GRASS: 2, FOREST: 3, ALPINE: 4, ROCK: 5, SNOW: 6, RIVER: 7 };
export const BUILDABLE = new Set([K.SAND, K.GRASS, K.FOREST, K.ALPINE]);

const M = 3;                              // margin (tiles) a chunk looks past its edge
const CELL = 44;                          // ranch site grid

function mix(a, b, c = 0) {
  let x = (Math.imul(a | 0, 0x27d4eb2d) ^ Math.imul(b | 0, 0x165667b1) ^ Math.imul(c | 0, 0x9e3779b1)) | 0;
  x = Math.imul(x ^ (x >>> 15), 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  return (x ^ (x >>> 16)) >>> 0;
}

export function makeWorld(seed = 1) {
  const N = makeNoise(seed), N2 = makeNoise(seed + 101), N3 = makeNoise(seed + 202), N4 = makeNoise(seed + 303);
  const edits = new Map();                // vertex overrides (flattened plots)
  const ek = (x, y) => (x + 1048576) * 2097152 + (y + 1048576);

  // ---------- terrain field ----------
  function baseH(x, y) {
    let h = 0.46 + 0.5 * N.fbm(x * 0.0075, y * 0.0075, 5) + 0.05 * N.fbm(x * 0.045 + 9, y * 0.045, 3);
    const mm = smooth(-0.02, 0.28, N2.fbm(x * 0.0034 + 11, y * 0.0034, 3));
    if (mm > 0) {
      const ridge = 1 - Math.abs(N3.fbm(x * 0.018 + 40, y * 0.018, 4) * 1.6);
      const rr = Math.max(0, ridge);
      h += mm * (0.06 + 0.7 * rr * rr * rr);
    }
    if (h > 0.78) h = 0.78 + (h - 0.78) * 0.55;
    const low = 1 - smooth(0.5, 0.64, h);
    if (low > 0) {
      const lk = N4.fbm(x * 0.011 + 500, y * 0.011 + 500, 2) * 1.6;
      if (lk > 0.16) h -= smooth(0.16, 0.34, lk) * low * 0.42;
    }
    const rv = Math.abs(N2.fbm(x * 0.0045 + 700, y * 0.0045 + 300, 3)) * 1.6;
    if (rv < 0.032) {
      const c = (1 - smooth(0, 0.032, rv)) * (1 - smooth(0.5, 0.72, h));
      h = h * (1 - c) + (SEA - 0.035) * c;
    }
    return Math.min(0.97, Math.max(0.02, h));
  }

  // ---------- ranch sites (flat yards, deterministic per cell) ----------
  const siteCache = new Map();
  function cellSite(cx, cy) {
    const key = cx * 100003 + cy;
    if (siteCache.has(key)) return siteCache.get(key);
    const r = rng(mix(seed, cx, cy));
    let site = null;
    if (r() < 0.6) {
      for (let t = 0; t < 14 && !site; t++) {
        const i = cx * CELL + Math.floor(r.range(10, CELL - 10)), j = cy * CELL + Math.floor(r.range(10, CELL - 10));
        let lo = 9, hi = -9, sum = 0, n = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          const h = baseH(i + dx * 4, j + dy * 4);
          lo = Math.min(lo, h); hi = Math.max(hi, h); sum += h; n++;
        }
        if (lo > SEA + 0.06 && hi < 0.5 && hi - lo < 0.06) site = { i, j, h: sum / n };
      }
    }
    siteCache.set(key, site);
    return site;
  }
  const sitesNear = (x, y) => {
    const cx = Math.floor(x / CELL), cy = Math.floor(y / CELL), out = [];
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const s = cellSite(cx + dx, cy + dy); if (s) out.push(s); }
    return out;
  };
  const ranchAt = (i, j) => sitesNear(i, j).find((s) => Math.abs(i - s.i) <= 5 && Math.abs(j - s.j) <= 5) || null;

  function H(x, y) {
    const e = edits.get(ek(x, y));
    if (e !== undefined) return e;
    let h = baseH(x, y);
    for (const s of sitesNear(x, y)) {
      const d = Math.max(Math.abs(x - (s.i + 0.5)), Math.abs(y - (s.j + 0.5)));
      if (d >= 8) continue;
      const k = d <= 5 ? 1 : 1 - (d - 5) / 3;
      h = h * (1 - k) + s.h * k;
    }
    return h;
  }

  function ranchObjects(s) {
    if (s.objs) return s.objs;
    const r = rng(mix(seed, s.i, s.j) ^ 0x5bd1e995), out = [];
    const add = (i, j, type, fx = 0.5, fy = 0.5, scale = 1, hol) => out.push({ i, j, fx, fy, type, scale, seed: Math.floor(r() * 1e6), hol });
    add(s.i - 2, s.j, 'barn', 0.5, 0.5, 0.9);
    add(s.i + 1, s.j - 1, 'farmhouse', 0.5, 0.5, 0.95);
    add(s.i - 1, s.j - 3, 'silo', 0.5, 0.5, 0.9);
    add(s.i + 3, s.j + 2, 'haybale', 0.5, 0.5, 0.9);
    add(s.i + 3, s.j + 3, 'haybale', 0.3, 0.7, 0.9);
    for (let c = 0; c < 4; c++) add(s.i + Math.floor(r.range(-3, 3)), s.j + Math.floor(r.range(1, 4)), 'cow', r.range(0.2, 0.8), r.range(0.2, 0.8), 1);
    for (let f = -4; f <= 4; f++) {
      add(s.i + f, s.j + 5, 'fenceX', 0.5, 0.95); add(s.i + f, s.j - 5, 'fenceX', 0.5, 0.05);
      add(s.i + 5, s.j + f, 'fenceY', 0.95, 0.5); add(s.i - 5, s.j + f, 'fenceY', 0.05, 0.5);
    }
    // holiday set dressing (filtered at draw time)
    add(s.i + 7, s.j + 1, 'pumpkins', 0.5, 0.5, 1, ['halloween', 'thanksgiving']);
    add(s.i + 7, s.j + 3, 'pumpkins', 0.5, 0.5, 1, ['halloween']);
    add(s.i - 7, s.j - 2, 'graves', 0.5, 0.5, 1, ['halloween']);
    add(s.i + 2, s.j + 7, 'scarecrow', 0.5, 0.5, 1, ['halloween', 'thanksgiving']);
    add(s.i + 3, s.j + 6, 'snowman', 0.5, 0.5, 1, ['christmas']);
    add(s.i - 3, s.j + 6, 'xmasTree', 0.5, 0.5, 1, ['christmas']);
    add(s.i + 6, s.j - 3, 'xmasTree', 0.5, 0.5, 1, ['christmas']);
    s.objs = out;
    return out;
  }

  const moistAt = (i, j) => N2.n01(i * 0.04 + 300, j * 0.04, 3);

  // ---------- chunks ----------
  const chunks = new Map();
  const ckey = (ci, cj) => ci * 1000003 + cj;

  function build(ci, cj) {
    const T = CH + 2 * M, G = T + 1, gi0 = ci * CH - M, gj0 = cj * CH - M;
    const hv = new Float32Array(G * G);
    for (let y = 0; y < G; y++) for (let x = 0; x < G; x++) hv[y * G + x] = H(gi0 + x, gj0 + y);
    const hm = new Float32Array(T * T), sl = new Float32Array(T * T), water = new Uint8Array(T * T);
    for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
      const a = hv[y * G + x], b = hv[y * G + x + 1], c = hv[(y + 1) * G + x], d = hv[(y + 1) * G + x + 1];
      hm[y * T + x] = (a + b + c + d) / 4;
      sl[y * T + x] = Math.max(a, b, c, d) - Math.min(a, b, c, d);
      water[y * T + x] = hm[y * T + x] < SEA - 0.005 ? 1 : 0;
    }
    const nearWater = (x, y, rad) => {
      for (let dy = -rad; dy <= rad; dy++) for (let dx = -rad; dx <= rad; dx++) if (water[(y + dy) * T + x + dx]) return true;
      return false;
    };
    const kinds = new Uint8Array(CH * CH), hAt = new Float32Array(CH * CH), slope = new Float32Array(CH * CH), shallow = new Uint8Array(CH * CH);
    const V = new Float32Array((CH + 1) * (CH + 1));
    for (let y = 0; y <= CH; y++) for (let x = 0; x <= CH; x++) V[y * (CH + 1) + x] = hv[(y + M) * G + x + M];

    const i0 = ci * CH, j0 = cj * CH;
    for (let ly = 0; ly < CH; ly++) for (let lx = 0; lx < CH; lx++) {
      const tx = lx + M, ty = ly + M, ti = ty * T + tx, i = i0 + lx, j = j0 + ly, t = ly * CH + lx;
      const h = hm[ti], s = sl[ti];
      hAt[t] = h; slope[t] = s;
      if (water[ti]) {
        kinds[t] = K.WATER;
        shallow[t] = water[ti - 1] && water[ti + 1] && water[ti - T] && water[ti + T] ? 0 : 1;
        continue;
      }
      let k = K.GRASS;
      if (ranchAt(i, j) && Math.abs(i - ranchAt(i, j).i) <= 4 && Math.abs(j - ranchAt(i, j).j) <= 4) { kinds[t] = K.GRASS; continue; }
      if (h > 0.86) k = K.SNOW;
      else if (h > 0.76 || s > 0.07) k = K.ROCK;
      else if (h > 0.64) k = N.n01(i * 0.1, j * 0.1, 2) > 0.45 ? K.ALPINE : K.ROCK;
      else if (h < SEA + 0.028 && nearWater(tx, ty, 1)) k = K.SAND;
      else {
        const m = moistAt(i, j);
        if ((m > 0.47 && h < 0.62) || (nearWater(tx, ty, 2) && m > 0.4)) k = K.FOREST;
      }
      kinds[t] = k;
    }

    // ---- scatter ----
    const r = rng(mix(seed, ci, cj));
    const objects = [];
    const add = (i, j, type, fx = 0.5, fy = 0.5, scale = 1) => objects.push({ i, j, fx, fy, type, scale, seed: Math.floor(r() * 1e6) });
    for (let ly = 0; ly < CH; ly++) for (let lx = 0; lx < CH; lx++) {
      const t = ly * CH + lx, k = kinds[t], h = hAt[t], i = i0 + lx, j = j0 + ly;
      const rs = ranchAt(i, j);
      if (rs && Math.abs(i - rs.i) <= 5 && Math.abs(j - rs.j) <= 5) continue;
      if (k === K.FOREST) {
        const n = r() < 0.5 ? 2 : 1;
        for (let q = 0; q < n; q++) {
          if (r() > 0.78) continue;
          const fx = r.range(0.15, 0.85), fy = r.range(0.15, 0.85);
          let type;
          if (h > 0.56) type = r() < 0.6 ? 'spruce' : 'pine';
          else if (h > 0.45) type = r() < 0.35 ? 'aspen' : r() < 0.5 ? 'pine' : 'leaf';
          else type = r() < 0.2 ? 'cottonwood' : r() < 0.7 ? 'leaf' : 'pine';
          add(i, j, type, fx, fy, r.range(0.8, 1.05));
        }
      } else if (k === K.GRASS) {
        const p = r();
        if (p < 0.035) add(i, j, r() < 0.5 ? 'leaf' : 'cottonwood', r.range(0.2, 0.8), r.range(0.2, 0.8), r.range(0.8, 1));
        else if (p < 0.06) add(i, j, 'bush', r.range(0.2, 0.8), r.range(0.2, 0.8), 0.9);
        else if (p < 0.11) add(i, j, 'flowers', r.range(0.2, 0.8), r.range(0.2, 0.8), 0.8);
        else if (p < 0.125) add(i, j, 'rock', r.range(0.2, 0.8), r.range(0.2, 0.8), 0.8);
        else if (p < 0.1275 && s_ok(sl[(ly + M) * T + lx + M]) && nearSand(lx, ly)) add(i, j, 'cabin', 0.5, 0.5, 0.9);
      } else if (k === K.ALPINE) {
        const p = r();
        if (p < 0.25) add(i, j, p < 0.15 ? 'pine' : 'spruce', r.range(0.2, 0.8), r.range(0.2, 0.8), 0.85);
        else if (p < 0.33) add(i, j, 'rock', r.range(0.2, 0.8), r.range(0.2, 0.8), 1);
      } else if (k === K.ROCK) {
        const p = r();
        if (p < 0.1) add(i, j, 'rock', r.range(0.2, 0.8), r.range(0.2, 0.8), r.range(1, 1.8));
        else if (p < 0.14 && h < 0.72) add(i, j, 'spruce', r.range(0.2, 0.8), r.range(0.2, 0.8), 0.8);
      } else if (k === K.SAND && r() < 0.03) add(i, j, 'rock', 0.5, 0.5, 0.7);
    }
    function s_ok(s) { return s < 0.03; }
    function nearSand(lx, ly) {
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
        const x = lx + dx, y = ly + dy;
        if (x < 0 || y < 0 || x >= CH || y >= CH) continue;
        if (kinds[y * CH + x] === K.SAND) return true;
      }
      return false;
    }
    // ranch buildings whose tile falls in this chunk
    const c0 = Math.floor((i0 - 12) / CELL), c1 = Math.floor((i0 + CH + 12) / CELL), d0 = Math.floor((j0 - 12) / CELL), d1 = Math.floor((j0 + CH + 12) / CELL);
    for (let cx = c0; cx <= c1; cx++) for (let cy = d0; cy <= d1; cy++) {
      const s = cellSite(cx, cy);
      if (!s) continue;
      for (const o of ranchObjects(s)) if (o.i >= i0 && o.i < i0 + CH && o.j >= j0 && o.j < j0 + CH) objects.push(o);
    }
    objects.sort((a, b) => a.i + a.fx + a.j + a.fy - (b.i + b.fx + b.j + b.fy));
    return { ci, cj, kinds, hAt, slope, shallow, V, objects };
  }

  function chunk(ci, cj) {
    const key = ckey(ci, cj);
    let c = chunks.get(key);
    if (!c) { c = build(ci, cj); chunks.set(key, c); if (chunks.size > 4000) chunks.delete(chunks.keys().next().value); }
    return c;
  }

  function tile(i, j) {
    const ci = Math.floor(i / CH), cj = Math.floor(j / CH), c = chunk(ci, cj), t = (j - cj * CH) * CH + (i - ci * CH);
    return { kind: c.kinds[t], h: c.hAt[t], slope: c.slope[t] };
  }

  // drop cached chunks touched by an edit to tiles [i0..i1] x [j0..j1]; returns their keys
  function invalidate(i0, j0, i1, j1) {
    const out = [];
    for (let ci = Math.floor((i0 - M) / CH); ci <= Math.floor((i1 + M) / CH); ci++)
      for (let cj = Math.floor((j0 - M) / CH); cj <= Math.floor((j1 + M) / CH); cj++) { chunks.delete(ckey(ci, cj)); out.push([ci, cj]); }
    return out;
  }

  function sampleKind(x, y) {
    const h = H(x, y);
    if (h < SEA - 0.005) return K.WATER;
    if (h > 0.86) return K.SNOW;
    if (h > 0.76) return K.ROCK;
    if (h > 0.64) return K.ALPINE;
    if (h < SEA + 0.028) return K.SAND;
    if (moistAt(x, y) > 0.47 && h < 0.62) return K.FOREST;
    return K.GRASS;
  }

  // nearest comfortable meadow to the origin
  function findStart() {
    for (let rad = 0; rad < 600; rad += 6) {
      for (let a = 0; a < Math.max(1, rad / 3); a++) {
        const ang = (a / Math.max(1, rad / 3)) * Math.PI * 2, i = Math.round(Math.cos(ang) * rad), j = Math.round(Math.sin(ang) * rad);
        let lo = 9, hi = -9, ok = true;
        for (let dy = -3; dy <= 3 && ok; dy++) for (let dx = -3; dx <= 3; dx++) {
          const h = H(i + dx * 3, j + dy * 3);
          lo = Math.min(lo, h); hi = Math.max(hi, h);
          if (h < SEA + 0.05 || h > 0.52) { ok = false; break; }
        }
        if (ok && hi - lo < 0.1) return { i, j };
      }
    }
    return { i: 0, j: 0 };
  }

  return { seed, H, edits, ek, chunk, tile, invalidate, sampleKind, ranchAt, findStart, moistAt, chunks };
}
