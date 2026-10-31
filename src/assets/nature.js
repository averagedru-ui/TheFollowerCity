import { box, cone, blob, prism, shadow, cyl, cylBand, poly, P } from '../iso.js';
import { tone, shade } from '../colors.js';
import { PAL } from '../palette.js';

export function pine(ctx, r) {
  const c = tone(r.pick(PAL.pine)), h = r.range(0.85, 1.15);
  shadow(ctx, 0.5, 0.5, 0.16, 5, 2);
  box(ctx, -0.04, -0.04, 0.04, 0.04, 0, 12, PAL.wood);
  const layers = 3;
  for (let i = 0; i < layers; i++) {
    const z0 = (8 + i * 14) * h, z1 = z0 + 26 * h;
    cone(ctx, 0, 0, 17 - i * 4, z0, z1, i === 1 ? tone(shade(c.base, 0.03)) : c);
  }
  if (PAL.winter) {
    ctx.fillStyle = 'rgba(255,255,255,.88)';
    for (const [x, y, w] of [[0, -50 * h, 5], [-6, -36 * h, 7], [6, -26 * h, 8], [-9, -18 * h, 6]]) { ctx.beginPath(); ctx.ellipse(x, y, w, 2.4, 0, 0, Math.PI * 2); ctx.fill(); }
  }
}

// leafless winter tree: trunk, forked branches, snow on the limbs
function bare(ctx, r, h = 1) {
  shadow(ctx, 0.6, 0.6, 0.14, 5, 3);
  box(ctx, -0.045, -0.045, 0.045, 0.045, 0, 20 * h, '#6a5642');
  const [bx, by] = P(0, 0, 20 * h);
  ctx.lineCap = 'round';
  const limbs = [[-16, -20], [14, -22], [-8, -34], [6, -36], [-22, -12], [20, -10], [0, -42]];
  for (const [dx, dy] of limbs) {
    const k = h * r.range(0.8, 1.1);
    ctx.strokeStyle = '#6a5642'; ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + dx * k, by + dy * k); ctx.stroke();
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(bx + dx * k * 0.6, by + dy * k * 0.6); ctx.lineTo(bx + dx * k * 0.6 + dx * 0.4, by + dy * k * 0.6 - 7); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.9)';
    ctx.beginPath(); ctx.ellipse(bx + dx * k, by + dy * k - 1, 3, 1.3, 0, 0, Math.PI * 2); ctx.fill();
  }
}

export function crown(ctx, r, colors, h = 1) {
  if (PAL.winter) return bare(ctx, r, h);
  const c = tone(r.pick(colors));
  shadow(ctx, 0.6, 0.6, 0.16, 5, 3);
  box(ctx, -0.045, -0.045, 0.045, 0.045, 0, 18 * h, PAL.wood);
  const zc = 30 * h;
  blob(ctx, 0.02, 0.0, zc - 6, 17, c.right);
  blob(ctx, -0.05, 0.0, zc, 17, c.right);
  blob(ctx, 0.0, -0.02, zc + 5, 15, c.left);
  blob(ctx, -0.09, 0.02, zc + 4, 12, c.top);
  blob(ctx, -0.12, -0.01, zc + 9, 6, shade(c.base, 0.18));
  for (let i = 0; i < 5; i++) blob(ctx, r.range(-0.12, 0.1), r.range(-0.05, 0.05), zc + r.range(-6, 8), 1.6, c.right);
}

export function leafTree(ctx, r) { crown(ctx, r, PAL.leaf, r.range(0.9, 1.15)); }
export function autumnTree(ctx, r) { crown(ctx, r, PAL.autumn, r.range(0.9, 1.1)); }
export function blossomTree(ctx, r) { crown(ctx, r, PAL.season === 'spring' ? PAL.blossom : PAL.leaf, 0.95); }

export function bush(ctx, r) {
  const c = tone(PAL.winter ? '#7d6e5c' : r.pick(PAL.leaf));
  shadow(ctx, 0.4, 0.4, 0.14, 3, 2);
  blob(ctx, 0.05, 0.0, 6, 7.5, c.right);
  blob(ctx, -0.08, 0.02, 7, 7.5, c.left);
  blob(ctx, -0.02, -0.03, 10, 6.5, c.top);
  if (r.chance(0.5)) for (let i = 0; i < 4; i++) blob(ctx, r.range(-0.12, 0.08), r.range(-0.03, 0.05), r.range(5, 12), 1.5, r.pick(['#f2b8c6', '#f5e3a0', '#fff6e0']));
}

export function rock(ctx, r) {
  const c = tone(r.pick(['#b9b4a8', '#a7a69c', '#c4bdae']));
  shadow(ctx, 0.5, 0.5, 0.14, 3, 2);
  const n = 7, pts = [];
  const rad = r.range(0.14, 0.2);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + r.range(-0.2, 0.2), k = rad * r.range(0.75, 1.15);
    pts.push([Math.cos(a) * k, Math.sin(a) * k]);
  }
  prism(ctx, pts, 0, r.range(7, 11), c);
}

export function flowers(ctx, r) {
  shadow(ctx, 0.3, 0.3, 0.06);
  const cols = r.pick([['#f2b8c6', '#fff6e0'], ['#f5e3a0', '#fff6e0'], ['#b7a4d8', '#f2b8c6']]);
  for (let i = 0; i < (PAL.winter ? 0 : PAL.season === 'spring' ? 22 : 14); i++) {
    const x = r.range(-0.3, 0.3), y = r.range(-0.3, 0.3);
    const [sx, sy] = P(x, y);
    ctx.fillStyle = '#6f9a50';
    ctx.fillRect(sx - 0.6, sy - 3, 1.2, 3);
    ctx.beginPath();
    ctx.arc(sx, sy - 3.5, 1.9, 0, Math.PI * 2);
    ctx.fillStyle = r.pick(cols);
    ctx.fill();
  }
}

export function hayBale(ctx, r) {
  shadow(ctx, 0.5, 0.5, 0.14, 3, 2);
  cyl(ctx, 0, 0, 0.17, 0, 13, '#e0be5c');
  cylBand(ctx, 0, 0, 0.17, 4, 'rgba(120,80,20,.35)');
  cylBand(ctx, 0, 0, 0.17, 9, 'rgba(120,80,20,.35)');
}

export function log(ctx, r) {
  shadow(ctx, 0.5, 0.4, 0.12, 2, 2);
  for (const [x, y, z] of [[-0.06, 0.1, 0], [0.06, 0.1, 0], [0, 0.1, 7]]) {
    box(ctx, x - 0.06, y - 0.2, x + 0.06, y + 0.2, z, z + 7, '#8a6240');
  }
}

export function aspen(ctx, r) {
  const c = tone(r.pick(PAL.aspen));
  shadow(ctx, 0.5, 0.5, 0.16, 4, 2);
  box(ctx, -0.03, -0.03, 0.03, 0.03, 0, 30, '#f1ead8');
  for (const [z, w] of [[8, 0.03], [16, 0.03], [24, 0.03]]) box(ctx, -w - 0.002, -0.032, w + 0.002, 0.032, z, z + 1.2, '#4a4a40');
  if (PAL.winter) {
    for (const [dx, dz] of [[-0.04, 40], [0.04, 46], [0, 54]]) box(ctx, dx - 0.006, -0.006, dx + 0.006, 0.006, 30, dz, '#e8e0cc');
    return;
  }
  blob(ctx, 0.02, 0, 38, 11, c.right);
  blob(ctx, -0.03, 0, 44, 12, c.left);
  blob(ctx, 0, -0.01, 52, 9, c.top);
  blob(ctx, -0.06, 0.01, 40, 7, c.top);
}

export function cottonwood(ctx, r) {
  crown(ctx, r, PAL.cotton, 1.3);
}

export function spruce(ctx, r) {
  const c = tone(r.pick(['#2f5a52', '#35604a', '#2c4f55']));
  shadow(ctx, 0.5, 0.5, 0.16, 5, 2);
  box(ctx, -0.035, -0.035, 0.035, 0.035, 0, 10, PAL.wood);
  for (let i = 0; i < 5; i++) cone(ctx, 0, 0, 16 - i * 2.6, 6 + i * 13, 24 + i * 13, c);
}

export function snowPine(ctx, r) {
  pine(ctx, r);
  ctx.fillStyle = 'rgba(255,255,255,.85)';
  for (const [x, y, w] of [[0, -62, 5], [-5, -44, 6], [4, -30, 7], [-8, -24, 5]]) {
    ctx.beginPath(); ctx.ellipse(x, y, w, 2.2, 0, 0, Math.PI * 2); ctx.fill();
  }
}
