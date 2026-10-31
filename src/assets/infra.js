// Tile-sized infrastructure: roads, rail, runways, parks, farmland, mountains, bridges.
import { poly, line, P, diamond, box, cone, shadow, blob, face } from '../iso.js';
import { tone, shade } from '../colors.js';
import { PAL } from '../palette.js';
import { base, speckle } from './terrain.js';

const H = 0.5;
const ARMS = [[1, 0], [0, 1], [-1, 0], [0, -1]]; // +x +y -x -y

const rect = (ctx, x0, y0, x1, y1, fill, z = 0) => poly(ctx, [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]], fill);

// connected road tile. arms: array of 0..3 indices into ARMS
export function roadTile(ctx, arms, city = true) {
  base(ctx, city ? '#cfc8b4' : PAL.grass, 6);
  const W = 0.34;
  rect(ctx, -W, -W, W, W, PAL.asphalt);
  for (const a of arms) {
    const [dx, dy] = ARMS[a];
    if (dx) rect(ctx, dx > 0 ? W : -H, -W, dx > 0 ? H : -W, W, PAL.asphalt);
    else rect(ctx, -W, dy > 0 ? W : -H, W, dy > 0 ? H : -W, PAL.asphalt);
    // lane dash
    const s = a < 2 ? 1 : -1;
    if (dx) rect(ctx, dx > 0 ? 0.4 : -0.46, -0.012, dx > 0 ? 0.46 : -0.4, 0.012, '#f1ead2');
    else rect(ctx, -0.012, dy > 0 ? 0.4 : -0.46, 0.012, dy > 0 ? 0.46 : -0.4, '#f1ead2');
  }
  if (arms.length === 2 && (arms[0] + 2) % 4 === arms[1]) {
    // through-road: continuous center dashes
    const [dx] = ARMS[arms[0]];
    for (let i = -2; i <= 2; i++) {
      if (dx) rect(ctx, i * 0.14 - 0.04, -0.012, i * 0.14 + 0.04, 0.012, '#f1ead2');
      else rect(ctx, -0.012, i * 0.14 - 0.04, 0.012, i * 0.14 + 0.04, '#f1ead2');
    }
  }
}
export const roadCorner = (ctx, r, { dir = 0 } = {}) => roadTile(ctx, [dir, (dir + 1) % 4]);
export const roadT = (ctx, r, { dir = 0 } = {}) => roadTile(ctx, [0, 1, 2, 3].filter((a) => a !== (dir + 2) % 4));
export const roadEnd = (ctx, r, { dir = 0 } = {}) => roadTile(ctx, [dir]);
export const cityStreet = (ctx, r, { dir = 0 } = {}) => roadTile(ctx, dir % 2 ? [1, 3] : [0, 2]);

export function sidewalk(ctx, r) {
  base(ctx, '#d6cfbc', 6);
  for (let i = -3; i <= 3; i++) {
    line(ctx, [i / 6, -H, 0], [i / 6, H, 0], 'rgba(120,110,90,.25)', 0.8);
    line(ctx, [-H, i / 6, 0], [H, i / 6, 0], 'rgba(120,110,90,.25)', 0.8);
  }
}

export function parkingLot(ctx, r) {
  base(ctx, PAL.asphalt, 6);
  for (let i = -3; i <= 3; i++) line(ctx, [-0.42, i * 0.12, 0], [0.42, i * 0.12, 0], 'rgba(255,255,255,.7)', 1);
  for (const [x, y] of [[-0.2, -0.24], [0.1, 0.06], [-0.2, 0.3]]) {
    box(ctx, x - 0.14, y - 0.045, x + 0.14, y + 0.045, 0, 6, r.pick(PAL.car));
  }
}

// ---- rail ----
function railLine(ctx, pts, off) {
  // pts: centerline [[x,y],..] with normals; draw two steel rails
}

function straightTrack(ctx, axis) {
  base(ctx, PAL.grass, 6);
  const A = (t, o) => (axis === 'x' ? [t, o, 1] : [o, t, 1]);
  const quad = (t0, t1, o0, o1, fill) => poly(ctx, [A(t0, o0), A(t1, o0), A(t1, o1), A(t0, o1)], fill);
  quad(-H, H, -0.2, 0.2, '#a89f8c'); // ballast
  quad(-H, H, -0.2, -0.17, '#97907e');
  for (let t = -0.45; t <= 0.46; t += 0.1) quad(t - 0.018, t + 0.018, -0.15, 0.15, '#6a4a3a');
  for (const o of [-0.075, 0.075]) {
    line(ctx, A(-H, o), A(H, o), '#4a4f55', 2.2);
    line(ctx, A(-H, o), A(H, o), '#c9ced0', 1);
  }
}
export const trackX = (ctx) => straightTrack(ctx, 'x');
export const trackY = (ctx) => straightTrack(ctx, 'y');

// quarter-turn track, dir picks the corner (0..3 matches roadCorner)
export function trackCurve(ctx, r, { dir = 0 } = {}) {
  base(ctx, PAL.grass, 6);
  const a = ARMS[dir], b = ARMS[(dir + 1) % 4];
  const sx = a[0] + b[0], sy = a[1] + b[1]; // corner direction
  const C = [sx * H, sy * H];
  // arc runs between edge midpoints a*H and b*H, centered on the shared corner
  const at = (th, rad) => {
    const ca = Math.cos(th), sa = Math.sin(th);
    // start direction from center to the a-midpoint, end direction to the b-midpoint
    const va = [a[0] * H - C[0], a[1] * H - C[1]], vb = [b[0] * H - C[0], b[1] * H - C[1]];
    const k = rad / H;
    return [C[0] + (va[0] * ca + vb[0] * sa) * k, C[1] + (va[1] * ca + vb[1] * sa) * k, 1];
  };
  const N = 14;
  const band = (r0, r1, fill) => {
    const pts = [];
    for (let i = 0; i <= N; i++) pts.push(at((i / N) * Math.PI / 2, r0));
    for (let i = N; i >= 0; i--) pts.push(at((i / N) * Math.PI / 2, r1));
    poly(ctx, pts, fill);
  };
  band(H - 0.2, H + 0.2, '#a89f8c');
  for (let i = 0; i <= 12; i++) {
    const th = (i / 12) * Math.PI / 2;
    line(ctx, at(th, H - 0.15), at(th, H + 0.15), '#6a4a3a', 1.5);
  }
  for (const o of [-0.075, 0.075]) {
    const pts = [];
    for (let i = 0; i <= N; i++) pts.push(at((i / N) * Math.PI / 2, H + o));
    for (let i = 0; i < N; i++) { line(ctx, pts[i], pts[i + 1], '#4a4f55', 2.2); line(ctx, pts[i], pts[i + 1], '#c9ced0', 1); }
  }
}

export function railCrossing(ctx) {
  base(ctx, PAL.grass, 6);
  rect(ctx, -H, -0.36, H, 0.36, PAL.asphalt);
  rect(ctx, -0.36, -H, 0.36, H, PAL.asphalt, 0.5);
  for (const o of [-0.075, 0.075]) { line(ctx, [-0.36, o, 1], [0.36, o, 1], '#4a4f55', 2.2); line(ctx, [-0.36, o, 1], [0.36, o, 1], '#c9ced0', 1); }
  for (const [x, y] of [[-0.38, 0.4], [0.38, -0.4]]) {
    box(ctx, x - 0.008, y - 0.008, x + 0.008, y + 0.008, 0, 30, '#e8e4d8');
    box(ctx, x - 0.05, y - 0.008, x + 0.05, y + 0.008, 24, 28, '#f1efe8');
    box(ctx, x - 0.04, y - 0.01, x - 0.01, y + 0.01, 22, 26, '#d6382f');
  }
}

export function trainPlatform(ctx, r) {
  straightTrack(ctx, 'x');
  box(ctx, -H, 0.22, H, 0.5, 0, 4, '#cfc8b4');
  line(ctx, [-H, 0.26, 4.2], [H, 0.26, 4.2], '#e8c14a', 2);
  for (const x of [-0.3, 0.3]) {
    box(ctx, x - 0.01, 0.4, x + 0.01, 0.42, 4, 30, '#6c7176');
  }
  box(ctx, -0.42, 0.34, 0.42, 0.5, 30, 32, '#8a9298');
}

// ---- airport ----
export function runway(ctx, r, { dir = 0 } = {}) {
  const ax = dir % 2 === 0;
  base(ctx, PAL.grass, 6);
  const A = (t, o, z = 0) => (ax ? [t, o, z] : [o, t, z]);
  const quad = (t0, t1, o0, o1, fill) => poly(ctx, [A(t0, o0), A(t1, o0), A(t1, o1), A(t0, o1)], fill);
  quad(-H, H, -0.42, 0.42, '#5d6066');
  quad(-H, H, -0.42, -0.4, '#f1ead2');
  quad(-H, H, 0.4, 0.42, '#f1ead2');
  for (let i = -2; i <= 2; i++) quad(i * 0.2 - 0.07, i * 0.2 + 0.07, -0.012, 0.012, '#f1ead2');
}
export function runwayEnd(ctx, r, { dir = 0 } = {}) {
  const ax = dir % 2 === 0;
  runway(ctx, r, { dir });
  const A = (t, o) => (ax ? [t, o, 0] : [o, t, 0]);
  const quad = (t0, t1, o0, o1, fill) => poly(ctx, [A(t0, o0), A(t1, o0), A(t1, o1), A(t0, o1)], fill);
  for (let i = -4; i <= 3; i++) quad(0.28, 0.46, i * 0.1 + 0.015, i * 0.1 + 0.075, '#f1ead2');
  quad(0.22, 0.24, -0.4, 0.4, '#f1ead2');
}
export function taxiway(ctx, r, { dir = 0 } = {}) {
  const ax = dir % 2 === 0;
  base(ctx, PAL.grass, 6);
  const A = (t, o) => (ax ? [t, o, 0] : [o, t, 0]);
  const quad = (t0, t1, o0, o1, fill) => poly(ctx, [A(t0, o0), A(t1, o0), A(t1, o1), A(t0, o1)], fill);
  quad(-H, H, -0.26, 0.26, '#6a6d73');
  quad(-H, H, -0.01, 0.01, '#e8c14a');
  for (let i = -3; i <= 3; i++) box(ctx, ...(ax ? [i * 0.15 - 0.01, 0.3, i * 0.15 + 0.01, 0.32] : [0.3, i * 0.15 - 0.01, 0.32, i * 0.15 + 0.01]), 0, 2.5, '#4f7fb5');
}
export function apron(ctx, r) {
  base(ctx, '#b9b5aa', 6);
  for (let i = -2; i <= 2; i++) {
    line(ctx, [i / 4, -H, 0], [i / 4, H, 0], 'rgba(80,80,70,.3)', 0.8);
    line(ctx, [-H, i / 4, 0], [H, i / 4, 0], 'rgba(80,80,70,.3)', 0.8);
  }
  line(ctx, [-0.4, 0.2, 0], [0.4, 0.2, 0], '#e8c14a', 1.5);
}
export function windsock(ctx) {
  shadow(ctx, 0.3, 0.3, 0.12);
  box(ctx, -0.012, -0.012, 0.012, 0.012, 0, 34, '#e8e4d8');
  const [x, y] = P(0, 0, 32);
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = i % 2 ? '#fbf5e4' : '#e8782f';
    ctx.beginPath();
    ctx.moveTo(x + i * 5, y - 3 + i * 0.8);
    ctx.lineTo(x + (i + 1) * 5, y - 2 + i * 0.8 + 0.3);
    ctx.lineTo(x + (i + 1) * 5, y + 2 - i * 0.2);
    ctx.lineTo(x + i * 5, y + 3 - i * 0.2);
    ctx.fill();
  }
}

// ---- parks and sports ----
export function parkLawn(ctx, r) {
  base(ctx, '#b3cf8a', 6);
  poly(ctx, [[-H, -0.05, 0], [H, -0.05, 0], [H, 0.05, 0], [-H, 0.05, 0]], '#e0d5b4');
  poly(ctx, [[-0.05, -H, 0], [0.05, -H, 0], [0.05, H, 0], [-0.05, H, 0]], '#e0d5b4');
  speckle(ctx, r, ['#a3c27a', '#c4dc9a'], 30);
}
export function soccerField(ctx, r) {
  base(ctx, '#8fbf6f', 6);
  for (let i = -3; i < 3; i++) rect(ctx, i / 3.2 - 0.1, -0.42, i / 3.2 + 0.1, 0.42, i % 2 ? '#86b666' : '#98c878');
  const L = (a, b) => line(ctx, a, b, 'rgba(255,255,255,.9)', 1.2);
  L([-0.4, -0.3, 0], [0.4, -0.3, 0]); L([0.4, -0.3, 0], [0.4, 0.3, 0]); L([0.4, 0.3, 0], [-0.4, 0.3, 0]); L([-0.4, 0.3, 0], [-0.4, -0.3, 0]); L([0, -0.3, 0], [0, 0.3, 0]);
  for (const gx of [-0.4, 0.4]) L([gx, -0.07, 0], [gx, 0.07, 0]);
}
export function tennisCourt(ctx, r) {
  base(ctx, '#5f8f8a', 6);
  rect(ctx, -0.36, -0.22, 0.36, 0.22, '#4f7fb5');
  const L = (a, b) => line(ctx, a, b, 'rgba(255,255,255,.9)', 1);
  L([-0.34, -0.2, 0], [0.34, -0.2, 0]); L([0.34, -0.2, 0], [0.34, 0.2, 0]); L([0.34, 0.2, 0], [-0.34, 0.2, 0]); L([-0.34, 0.2, 0], [-0.34, -0.2, 0]);
  L([0, -0.2, 0], [0, 0.2, 0]);
  box(ctx, -0.006, -0.22, 0.006, 0.22, 0, 5, '#e8e4d8');
}
export function baseballDiamond(ctx, r) {
  base(ctx, '#8fbf6f', 6);
  poly(ctx, [[-0.3, 0, 0], [0, -0.3, 0], [0.3, 0, 0], [0, 0.3, 0]], '#c9a97c');
  poly(ctx, [[-0.22, 0, 0.5], [0, -0.22, 0.5], [0.22, 0, 0.5], [0, 0.22, 0.5]], '#9fcf7f');
  for (const [x, y] of [[-0.3, 0], [0, -0.3], [0.3, 0], [0, 0.3]]) rect(ctx, x - 0.03, y - 0.03, x + 0.03, y + 0.03, '#fbf5e4', 1);
}
export function playground(ctx, r) {
  base(ctx, '#e6d3a0', 6);
  box(ctx, -0.3, -0.3, -0.12, -0.12, 0, 14, '#d6382f');
  poly(ctx, [[-0.12, -0.3, 14], [-0.12, -0.12, 14], [0.2, -0.12, 0], [0.2, -0.3, 0]], '#4f7fb5');
  for (const sx of [0.12, 0.3]) { box(ctx, sx - 0.01, 0.2, sx + 0.01, 0.4, 0, 18, '#8a9298'); }
  box(ctx, 0.1, 0.2, 0.32, 0.22, 17, 19, '#8a9298');
  line(ctx, [0.18, 0.21, 16], [0.18, 0.21, 6], '#3b3a3f', 1);
  line(ctx, [0.26, 0.21, 16], [0.26, 0.21, 6], '#3b3a3f', 1);
  box(ctx, 0.17, 0.2, 0.27, 0.23, 5, 6.5, '#e8c14a');
}
export function pond(ctx, r) {
  base(ctx, PAL.grass, 6);
  const rim = [], water = [];
  for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2, k = r.range(0.88, 1.08); rim.push([Math.cos(a) * 0.42 * k, Math.sin(a) * 0.38 * k, 0]); water.push([Math.cos(a) * 0.35 * k, Math.sin(a) * 0.31 * k, 0.4]); }
  poly(ctx, rim, '#e6d3a0');
  poly(ctx, water, PAL.water);
  for (const [x, y] of [[0.36, -0.3], [0.4, -0.22], [-0.35, 0.3]]) { line(ctx, [x, y, 0], [x, y, 14], '#6f9a50', 1.4); box(ctx, x - 0.01, y - 0.01, x + 0.01, y + 0.01, 14, 20, '#7a5a3a'); }
}
export function fountain(ctx, r) {
  shadow(ctx, 0.9, 0.9, 0.12);
  base(ctx, '#d6cfbc', 4);
  box(ctx, -0.3, -0.3, 0.3, 0.3, 0, 7, '#c9c4b8');
  diamond(ctx, -0.26, -0.26, 0.26, 0.26, 7.2, PAL.water);
  box(ctx, -0.05, -0.05, 0.05, 0.05, 7, 22, '#c9c4b8');
  box(ctx, -0.14, -0.14, 0.14, 0.14, 22, 24, '#c9c4b8');
  ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 1.4;
  const [sx, sy] = P(0, 0, 24);
  for (const dx of [-8, 0, 8]) { ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(sx + dx * 0.5, sy - 16, sx + dx, sy + 6); ctx.stroke(); }
}

// ---- farmland ----
export function fieldCorn(ctx, r) {
  base(ctx, '#a98860', 6);
  for (let i = 0; i < 7; i++) {
    const y = -0.42 + i * 0.14;
    for (let x = -0.42; x <= 0.43; x += 0.06) {
      const [sx, sy] = P(x, y);
      ctx.strokeStyle = '#6f9a50'; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx, sy - 9); ctx.stroke();
      ctx.fillStyle = '#e0c060'; ctx.fillRect(sx - 0.7, sy - 11, 1.4, 2);
    }
  }
}
export function fieldSolar(ctx, r) {
  base(ctx, PAL.grass, 6);
  for (let i = 0; i < 3; i++) {
    const y = -0.34 + i * 0.3;
    poly(ctx, [[-0.4, y, 5], [0.4, y, 5], [0.4, y + 0.2, 1], [-0.4, y + 0.2, 1]], '#2f5a8f');
    poly(ctx, [[-0.4, y + 0.01, 5.2], [0.4, y + 0.01, 5.2], [0.4, y + 0.19, 1.2], [-0.4, y + 0.19, 1.2]], 'rgba(120,170,220,.25)');
    for (let k = -3; k <= 3; k++) line(ctx, [k * 0.11, y, 5], [k * 0.11, y + 0.2, 1], 'rgba(220,230,240,.6)', 0.6);
  }
}
export function orchard(ctx, r) {
  base(ctx, '#a9c981', 6);
  for (const [x, y] of [[-0.25, -0.25], [0.25, -0.25], [-0.25, 0.25], [0.25, 0.25]]) {
    box(ctx, x - 0.015, y - 0.015, x + 0.015, y + 0.015, 0, 8, PAL.wood);
    blob(ctx, x, y, 14, 9, tone('#6fa055').right); blob(ctx, x - 0.02, y, 16, 8, '#7aa85b');
    blob(ctx, x + 0.03, y, 15, 1.6, '#d6382f'); blob(ctx, x - 0.05, y, 13, 1.6, '#d6382f');
  }
}

// ---- terrain features ----
function pyramid(ctx, cx, cy, hw, z0, zr, t, snow = 0.3) {
  const L = [cx - hw, cy + hw], Rr = [cx + hw, cy + hw], Rb = [cx + hw, cy - hw], A = [cx, cy];
  poly(ctx, [[L[0], L[1], z0], [Rr[0], Rr[1], z0], [A[0], A[1], zr]], t.left);
  poly(ctx, [[Rb[0], Rb[1], z0], [Rr[0], Rr[1], z0], [A[0], A[1], zr]], t.right);
  if (snow) {
    const lp = (p, k) => [A[0] + (p[0] - A[0]) * k, A[1] + (p[1] - A[1]) * k, zr + (z0 - zr) * k];
    poly(ctx, [lp([L[0], L[1]], snow), lp([Rr[0], Rr[1]], snow), [A[0], A[1], zr]], '#f4f6f8');
    poly(ctx, [lp([Rb[0], Rb[1]], snow), lp([Rr[0], Rr[1]], snow), [A[0], A[1], zr]], '#cfd8e0');
  }
}
export function mountain(ctx, r) {
  shadow(ctx, 1.6, 1.6, 0.12);
  base(ctx, '#8a9a70', 6);
  const t = tone(r.pick(['#8a8a8e', '#7f858c', '#908a82']));
  pyramid(ctx, -0.1, -0.12, 0.4, 0, 58, t, 0.38);
  pyramid(ctx, 0.14, 0.06, 0.32, 0, 40, tone(shade(t.base, 0.04)), 0.28);
  pyramid(ctx, -0.2, 0.2, 0.22, 0, 24, tone(shade(t.base, -0.03)), 0);
}
export function hill(ctx, r) {
  base(ctx, PAL.grass, 6);
  const [cx, cy] = P(0, 0);
  const g = ctx.createLinearGradient(cx - 34, 0, cx + 34, 0);
  g.addColorStop(0, '#b4d28a'); g.addColorStop(0.45, '#c2de98'); g.addColorStop(1, '#8aa866');
  ctx.beginPath(); ctx.ellipse(cx, cy - 2, 34, 17, 0, 0, Math.PI, false); ctx.lineTo(cx - 34, cy - 2); ctx.bezierCurveTo(cx - 20, cy - 34, cx + 20, cy - 34, cx + 34, cy - 2); ctx.fillStyle = g; ctx.fill();
}
export function bridge(ctx, r, { dir = 0 } = {}) {
  const ax = dir % 2 === 0;
  base(ctx, PAL.water, 3);
  const A = (t, o, z = 0) => (ax ? [t, o, z] : [o, t, z]);
  const quad = (t0, t1, o0, o1, z, fill) => poly(ctx, [A(t0, o0, z), A(t1, o0, z), A(t1, o1, z), A(t0, o1, z)], fill);
  for (const t of [-0.3, 0.3]) for (const o of [-0.25, 0.25]) box(ctx, ...(ax ? [t - 0.04, o - 0.04, t + 0.04, o + 0.04] : [o - 0.04, t - 0.04, o + 0.04, t + 0.04]), -3, 6, '#a8a090');
  quad(-H, H, -0.3, 0.3, 7, PAL.asphalt);
  quad(-H, H, -0.3, -0.27, 7.2, '#cfc8b4');
  quad(-H, H, 0.27, 0.3, 7.2, '#cfc8b4');
  for (let i = -3; i <= 3; i++) quad(i * 0.14 - 0.04, i * 0.14 + 0.04, -0.012, 0.012, 7.3, '#f1ead2');
  for (const o of [-0.285, 0.285]) {
    for (let t = -0.45; t <= 0.46; t += 0.15) box(ctx, ...(ax ? [t - 0.008, o - 0.008, t + 0.008, o + 0.008] : [o - 0.008, t - 0.008, o + 0.008, t + 0.008]), 7, 14, '#8a9298');
  }
}
