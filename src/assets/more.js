// Entertainment, food, services, sports, utilities and outdoors.
import { box, poly, face, win, door, gable, hip, parapet, parapetFront, frustum, cyl, cylBand, cone, shadow, line, P, curtain, windows, slab, diamond, blob } from '../iso.js';
import { tone, shade } from '../colors.js';
import { PAL } from '../palette.js';
import { base, speckle } from './terrain.js';

const H5 = 0.5;
const rect = (ctx, x0, y0, x1, y1, fill, z = 0) => poly(ctx, [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]], fill);

// ============ Entertainment ============
export function cinema(ctx, r) {
  const wall = r.pick(['#7a5a8a', '#5a6a8a', '#8a4a4a']);
  shadow(ctx, 1.3, 1);
  box(ctx, -0.5, -0.38, 0.5, 0.38, 0, 34, wall);
  box(ctx, -0.5, 0.38, 0.5, 0.52, 18, 22, '#f1ead2');
  face(ctx, 'y', 0.521, -0.5, 0.5, 18, 22, tone('#f6e7a8').left);
  for (const x of [-0.4, -0.2, 0, 0.2, 0.4]) face(ctx, 'y', 0.522, x - 0.012, x + 0.012, 18.6, 21.4, tone('#f0c22f').left);
  box(ctx, -0.18, 0.37, 0.18, 0.4, 24, 32, '#2b2433');
  face(ctx, 'y', 0.401, -0.15, 0.15, 25, 31, tone('#e0506a').left);
  for (const a of [-0.38, -0.2, 0.2, 0.38]) face(ctx, 'y', 0.385, a - 0.06, a + 0.06, 3, 14, tone('#2b2433').left);
  door(ctx, 'y', 0.38, 0, 0.18, 0, 14, '#2b2433');
  box(ctx, -0.5, -0.38, 0.5, 0.38, 34, 38, '#2b2433');
  box(ctx, -0.4, -0.3, 0.2, 0.0, 38, 48, '#3b3f45');
}

export function museum(ctx, r) {
  const st = '#e8e2d2';
  shadow(ctx, 1.6, 1.1);
  box(ctx, -0.7, -0.35, 0.7, 0.35, 0, 30, st);
  box(ctx, -0.7, 0.35, 0.7, 0.55, 0, 2, '#d8d2c0');
  for (let i = -3; i <= 3; i++) box(ctx, i * 0.17 - 0.018, 0.4, i * 0.17 + 0.018, 0.436, 2, 30, '#fbf5e4');
  face(ctx, 'y', 0.351, -0.6, 0.6, 3, 28, tone('#cfc8b4').left);
  gable(ctx, -0.64, 0.35, 0.64, 0.55, 30, 14, tone(st), 0.02, 'x');
  door(ctx, 'y', 0.35, 0, 0.2, 2, 18, '#4a3a30');
  cyl(ctx, 0, -0.1, 0.18, 30, 44, '#d8d2c0', 12);
}

export function ferrisWheel(ctx, r) {
  shadow(ctx, 0.9, 0.5, 0.12);
  const [cx, cy] = P(0, 0, 0), hubY = cy - 74, R = 56;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#8a9298'; ctx.lineWidth = 3;
  for (const dx of [-22, 22]) { ctx.beginPath(); ctx.moveTo(cx + dx, cy + 6 * Math.sign(dx)); ctx.lineTo(cx, hubY); ctx.stroke(); }
  ctx.strokeStyle = '#d6382f'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(cx, hubY, R, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = 1.2; ctx.strokeStyle = '#e8892f'; ctx.beginPath(); ctx.arc(cx, hubY, R * 0.55, 0, Math.PI * 2); ctx.stroke();
  const n = 12, ang = r.range(0, 1);
  for (let i = 0; i < n; i++) {
    const a = ang + (i / n) * Math.PI * 2, x = cx + Math.cos(a) * R, y = hubY + Math.sin(a) * R;
    ctx.strokeStyle = 'rgba(180,180,190,.9)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx, hubY); ctx.lineTo(x, y); ctx.stroke();
    ctx.fillStyle = ['#f0c22f', '#4f9ad6', '#e0506a', '#58c27a'][i % 4]; ctx.beginPath(); ctx.roundRect(x - 4, y, 8, 7, 1.5); ctx.fill();
  }
  ctx.fillStyle = '#6c7176'; ctx.beginPath(); ctx.arc(cx, hubY, 4, 0, Math.PI * 2); ctx.fill();
}

export function carousel(ctx, r) {
  shadow(ctx, 0.9, 0.9, 0.12);
  cyl(ctx, 0, 0, 0.3, 0, 4, '#8a6240');
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; box(ctx, Math.cos(a) * 0.24 - 0.008, Math.sin(a) * 0.24 - 0.008, Math.cos(a) * 0.24 + 0.008, Math.sin(a) * 0.24 + 0.008, 4, 26, i % 2 ? '#f0c22f' : '#e0506a'); }
  cyl(ctx, 0, 0, 0.34, 26, 29, '#fbf5e4');
  const [x, y] = P(0, 0, 29);
  const rx = (0.36 * 64) / Math.SQRT2, ry = (0.36 * 32) / Math.SQRT2;
  for (let i = 0; i < 10; i++) {
    const a0 = (i / 10) * Math.PI * 2, a1 = ((i + 1) / 10) * Math.PI * 2;
    ctx.fillStyle = i % 2 ? '#fbf5e4' : '#d6382f';
    ctx.beginPath(); ctx.moveTo(x, y - 16); ctx.lineTo(x + Math.cos(a0) * rx, y + Math.sin(a0) * ry); ctx.lineTo(x + Math.cos(a1) * rx, y + Math.sin(a1) * ry); ctx.fill();
  }
  ctx.fillStyle = '#f0c22f'; ctx.fillRect(x - 0.8, y - 24, 1.6, 8);
}

export function circusTent(ctx, r) {
  shadow(ctx, 1.1, 1.1, 0.14);
  cyl(ctx, 0, 0, 0.42, 0, 20, '#fbf5e4');
  const [x, y] = P(0, 0, 20), rx = (0.42 * 64) / Math.SQRT2, ry = (0.42 * 32) / Math.SQRT2;
  for (let i = 0; i < 14; i++) {
    const a0 = (i / 14) * Math.PI * 2, a1 = ((i + 1) / 14) * Math.PI * 2;
    ctx.fillStyle = i % 2 ? '#fbf5e4' : '#d6382f';
    ctx.beginPath(); ctx.moveTo(x, y - 36); ctx.lineTo(x + Math.cos(a0) * rx, y + Math.sin(a0) * ry); ctx.lineTo(x + Math.cos(a1) * rx, y + Math.sin(a1) * ry); ctx.fill();
  }
  ctx.strokeStyle = '#6c7176'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x, y - 36); ctx.lineTo(x, y - 48); ctx.stroke();
  ctx.fillStyle = '#f0c22f'; ctx.beginPath(); ctx.moveTo(x, y - 48); ctx.lineTo(x + 9, y - 45); ctx.lineTo(x, y - 42); ctx.fill();
}

// ============ Food ============
export function restaurant(ctx, r) {
  const wall = r.pick(['#d9a37a', '#e8dcc0', '#9fc0b0', '#c4604b']);
  shadow(ctx, 1.2, 1);
  box(ctx, -0.45, -0.34, 0.4, 0.3, 0, 24, wall);
  curtain(ctx, 'y', 0.301, -0.4, 0.1, 4, 18, { glass: ['#9cc3d6', '#a9cfdc'], frame: '#f1ead2', cols: 4, floorH: 14 });
  door(ctx, 'y', 0.3, 0.26, 0.14, 0, 16, '#6a4a3a');
  box(ctx, -0.45, 0.3, 0.4, 0.34, 18, 22, '#2b2433');
  face(ctx, 'y', 0.341, -0.4, 0.34, 18.6, 21.4, tone('#e0506a').left);
  parapet(ctx, -0.45, -0.34, 0.4, 0.3, 24, 2, 0.03, wall, tone('#b9b2a2').left);
  parapetFront(ctx, -0.45, -0.34, 0.4, 0.3, 24, 2, 0.03, wall);
  for (const [tx, ty] of [[-0.3, 0.46], [0.0, 0.5]]) { box(ctx, tx - 0.07, ty - 0.05, tx + 0.07, ty + 0.05, 7, 8.4, '#f1ead2'); box(ctx, tx - 0.008, ty - 0.008, tx + 0.008, ty + 0.008, 0, 7, '#6c7176'); cone(ctx, tx, ty, 9, 20, 25, tone('#d6382f')); box(ctx, tx - 0.006, ty - 0.006, tx + 0.006, ty + 0.006, 8, 20, '#8a9298'); }
}

export function bakery(ctx, r) {
  shadow(ctx, 1, 0.9);
  box(ctx, -0.34, -0.3, 0.34, 0.3, 0, 26, '#f0d9b0');
  for (let i = 0; i < 6; i++) { const a = -0.34 + i * 0.113; poly(ctx, [[a, 0.3, 20], [a + 0.113, 0.3, 20], [a + 0.113, 0.44, 14], [a, 0.44, 14]], i % 2 ? '#fbf5e4' : '#e0809a'); }
  curtain(ctx, 'y', 0.301, -0.28, 0.1, 3, 14, { glass: ['#a9cfdc'], frame: '#fbf5e4', cols: 3, floorH: 11 });
  door(ctx, 'y', 0.3, 0.24, 0.12, 0, 14, '#8a5a3a');
  gable(ctx, -0.34, -0.3, 0.34, 0.3, 26, 12, tone('#b5694f'), 0.05, 'y', tone('#f0d9b0'));
  box(ctx, 0.18, -0.2, 0.26, -0.12, 30, 44, '#b5694f');
}

// ============ Services ============
export function bank(ctx, r) {
  shadow(ctx, 1.1, 1);
  box(ctx, -0.4, -0.34, 0.4, 0.34, 0, 36, '#d8d2c0');
  for (const x of [-0.28, -0.14, 0, 0.14, 0.28]) box(ctx, x - 0.02, 0.34, x + 0.02, 0.38, 2, 32, '#fbf5e4');
  box(ctx, -0.4, 0.34, 0.4, 0.44, 0, 2, '#cfc8b4');
  gable(ctx, -0.36, 0.34, 0.36, 0.44, 32, 9, tone('#d8d2c0'), 0.02, 'x');
  door(ctx, 'y', 0.34, 0, 0.18, 2, 18, '#3b3a3f');
  box(ctx, -0.4, -0.34, 0.4, 0.34, 36, 40, '#b9b2a2');
}

export function postOffice(ctx, r) {
  shadow(ctx, 1.1, 0.9);
  box(ctx, -0.42, -0.3, 0.42, 0.3, 0, 22, '#e8dcc0');
  windows(ctx, 'y', 0.3, -0.38, 0.38, 2, 22, { floorH: 20, cols: 4, w: 0.12, h: 12, pad: 5 });
  door(ctx, 'y', 0.3, 0, 0.16, 0, 16, '#2f4f8f');
  face(ctx, 'y', 0.301, -0.3, 0.3, 18, 21, tone('#2f4f8f').left);
  parapet(ctx, -0.42, -0.3, 0.42, 0.3, 22, 3, 0.03, '#e8dcc0', tone('#b9b2a2').left);
  parapetFront(ctx, -0.42, -0.3, 0.42, 0.3, 22, 3, 0.03, '#e8dcc0');
  box(ctx, 0.5, 0.4, 0.58, 0.46, 0, 12, '#2f4f8f');
}

export function library(ctx, r) {
  shadow(ctx, 1.3, 1);
  box(ctx, -0.5, -0.34, 0.5, 0.34, 0, 30, '#b5694f');
  windows(ctx, 'y', 0.34, -0.46, 0.46, 2, 30, { floorH: 28, cols: 5, w: 0.1, h: 18, pad: 5, frame: '#fbf5e4' });
  box(ctx, -0.14, 0.34, 0.14, 0.44, 0, 36, '#d8c8a8');
  door(ctx, 'y', 0.44, 0, 0.14, 0, 16, '#4a3a30');
  gable(ctx, -0.14, 0.34, 0.14, 0.44, 36, 10, tone('#e8dcc0'), 0.02, 'x');
  hip(ctx, -0.5, -0.34, 0.5, 0.34, 30, 8, tone('#5a5f6a'), 0.04);
}

export function gym(ctx, r) {
  shadow(ctx, 1.2, 0.9);
  box(ctx, -0.44, -0.3, 0.44, 0.3, 0, 26, '#5a6a78');
  curtain(ctx, 'y', 0.301, -0.4, 0.4, 5, 22, { glass: ['#8fb8d8', '#9cc3e0'], frame: '#3b4a58', cols: 6, floorH: 17 });
  face(ctx, 'y', 0.302, -0.44, 0.44, 22, 26, tone('#e8892f').left);
  box(ctx, -0.44, -0.3, 0.44, 0.3, 26, 28, '#3b4a58');
  box(ctx, -0.2, -0.2, 0.1, 0.0, 28, 34, '#8a9298');
}

export function university(ctx, r) {
  shadow(ctx, 2, 1.1);
  box(ctx, -0.8, -0.3, 0.8, 0.3, 0, 34, '#b5694f');
  windows(ctx, 'y', 0.3, -0.76, 0.76, 2, 34, { floorH: 16, cols: 9, w: 0.1, h: 10, pad: 4, frame: '#fbf5e4' });
  box(ctx, -0.8, -0.3, 0.8, 0.3, 34, 37, '#e8dcc0');
  box(ctx, -0.14, 0.3, 0.14, 0.44, 0, 44, '#d8c8a8');
  box(ctx, -0.12, -0.12, 0.12, 0.12, 37, 82, '#b5694f');
  hip(ctx, -0.12, -0.12, 0.12, 0.12, 82, 26, tone('#6fae97'), 0.03);
  const [x, y] = P(0, 0.12, 66); ctx.beginPath(); ctx.arc(x + 0.4, y, 6, 0, Math.PI * 2); ctx.fillStyle = '#fbf5e4'; ctx.fill(); ctx.strokeStyle = '#3b3a3f'; ctx.lineWidth = 0.9; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 0.4, y); ctx.lineTo(x + 0.4, y - 4); ctx.moveTo(x + 0.4, y); ctx.lineTo(x + 3.4, y); ctx.stroke();
  door(ctx, 'y', 0.44, 0, 0.16, 0, 18, '#4a3a30');
  hip(ctx, -0.14, 0.3, 0.14, 0.44, 44, 8, tone('#6fae97'), 0.02);
}

export function subwayEntrance(ctx, r) {
  shadow(ctx, 0.5, 0.5, 0.1);
  box(ctx, -0.18, -0.18, 0.18, 0.18, 0, 14, '#8a9298');
  face(ctx, 'y', 0.181, -0.12, 0.12, 0, 11, tone('#1e1f24').left);
  box(ctx, -0.2, -0.2, 0.2, 0.2, 14, 17, '#3f7fb5');
  box(ctx, 0.14, 0.14, 0.17, 0.17, 17, 36, '#6c7176');
  box(ctx, 0.04, 0.12, 0.2, 0.19, 36, 44, '#3f7fb5');
}

// ============ Sports ============
export function arena(ctx, r) {
  shadow(ctx, 1.6, 1.6, 0.14);
  cyl(ctx, 0, 0, 0.62, 0, 34, '#cfd6da');
  for (let i = 0; i < 12; i++) cylBand(ctx, 0, 0, 0.62, 4 + i * 2.5, 'rgba(60,70,80,.08)');
  cylBand(ctx, 0, 0, 0.62, 26, '#8fb8d8', 5);
  cyl(ctx, 0, 0, 0.54, 34, 40, '#b9c0c4', 10);
  cyl(ctx, 0, 0, 0.2, 48, 52, '#e8892f');
}

export function skiLodge(ctx, r) {
  const wood = '#8a5a3a';
  shadow(ctx, 1.2, 1);
  box(ctx, -0.46, -0.34, 0.46, 0.34, 0, 24, wood);
  for (let z = 4; z < 24; z += 5) face(ctx, 'y', 0.341, -0.46, 0.46, z, z + 0.8, 'rgba(60,35,20,.35)');
  win(ctx, 'y', 0.34, -0.28, 0.2, 6, 14);
  win(ctx, 'y', 0.34, 0.28, 0.2, 6, 14);
  door(ctx, 'y', 0.34, 0, 0.16, 0, 16, '#4a3020');
  gable(ctx, -0.46, -0.34, 0.46, 0.34, 24, 34, tone('#5a5f6a'), 0.08, 'y', tone(wood));
  poly(ctx, [[0.46, -0.34, 24], [0.46, 0.34, 24], [0.46, 0, 58]], 'rgba(255,255,255,0)');
  box(ctx, 0.2, -0.2, 0.3, -0.1, 24, 58, '#8a8f94');
  ctx.fillStyle = 'rgba(255,255,255,.9)';
  const [sx, sy] = P(0, 0.12, 30); ctx.beginPath(); ctx.ellipse(sx - 14, sy - 6, 16, 3, 0, 0, Math.PI * 2); ctx.fill();
}

export function chairlift(ctx, r) {
  shadow(ctx, 0.4, 0.4, 0.1);
  box(ctx, -0.02, -0.02, 0.02, 0.02, 0, 60, '#6c7176');
  box(ctx, -0.22, -0.02, 0.22, 0.02, 58, 61, '#6c7176');
  const [x, y] = P(0, 0, 58);
  ctx.strokeStyle = '#3b3a3f'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - 60, y + 30); ctx.lineTo(x + 60, y - 30); ctx.stroke();
  ctx.strokeStyle = '#6c7176'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x + 8, y - 4); ctx.lineTo(x + 8, y + 10); ctx.stroke();
  ctx.fillStyle = '#d6382f'; ctx.fillRect(x + 3, y + 10, 12, 4); ctx.fillRect(x + 3, y + 5, 2, 6);
}

export function skiRun(ctx, r) {
  base(ctx, '#f2f6f8', 6);
  poly(ctx, [[-H5, -0.18, 0], [H5, -0.18, 0], [H5, 0.18, 0], [-H5, 0.18, 0]], '#e0eaf0');
  for (const [x, y] of [[-0.3, 0.05], [0.0, -0.08], [0.25, 0.1], [-0.1, 0.12]]) { const [sx, sy] = P(x, y); ctx.fillStyle = 'rgba(180,200,215,.7)'; ctx.beginPath(); ctx.ellipse(sx, sy, 5, 2, 0, 0, Math.PI * 2); ctx.fill(); }
  for (const [x, y] of [[-0.4, -0.35], [0.38, 0.38], [-0.3, 0.4]]) { const [sx, sy] = P(x, y); ctx.fillStyle = '#2f5a4a'; ctx.beginPath(); ctx.moveTo(sx, sy - 18); ctx.lineTo(sx - 6, sy); ctx.lineTo(sx + 6, sy); ctx.fill(); }
}

export function golfGreen(ctx, r) {
  base(ctx, '#7fb560', 6);
  const [cx, cy] = P(0.05, -0.05);
  ctx.fillStyle = '#9fd47a'; ctx.beginPath(); ctx.ellipse(cx, cy, 20, 10, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#e6d3a0'; ctx.beginPath(); ctx.ellipse(cx - 22, cy + 8, 9, 4.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#2b2a30'; ctx.beginPath(); ctx.ellipse(cx, cy + 1, 2.2, 1, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#fbf5e4'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy - 16); ctx.stroke();
  ctx.fillStyle = '#d6382f'; ctx.beginPath(); ctx.moveTo(cx, cy - 16); ctx.lineTo(cx + 8, cy - 13); ctx.lineTo(cx, cy - 10); ctx.fill();
}

export function swimmingPool(ctx, r) {
  base(ctx, '#d6cfbc', 6);
  poly(ctx, [[-0.34, -0.26, 0], [0.34, -0.26, 0], [0.34, 0.26, 0], [-0.34, 0.26, 0]], '#f1ead2');
  poly(ctx, [[-0.3, -0.22, 0.4], [0.3, -0.22, 0.4], [0.3, 0.22, 0.4], [-0.3, 0.22, 0.4]], '#5fb8d6');
  for (let i = -2; i <= 2; i++) line(ctx, [-0.3, i * 0.08, 0.5], [0.3, i * 0.08, 0.5], 'rgba(255,255,255,.7)', 0.8);
  for (const [x, y, c] of [[-0.42, 0.0, '#e0506a'], [0.42, 0.1, '#f0c22f']]) { box(ctx, x - 0.04, y - 0.06, x + 0.04, y + 0.06, 0, 5, c); }
}

export function skatePark(ctx, r) {
  base(ctx, '#b9b5aa', 6);
  poly(ctx, [[-0.38, -0.3, 0], [-0.1, -0.3, 0], [-0.1, 0.3, 0], [-0.38, 0.3, 0]], '#8a8f94');
  poly(ctx, [[-0.1, -0.3, 0], [0.12, -0.3, 8], [0.12, 0.3, 8], [-0.1, 0.3, 0]], '#c9c4b8');
  box(ctx, 0.12, -0.3, 0.38, -0.05, 0, 8, '#c9c4b8');
  box(ctx, 0.14, 0.08, 0.34, 0.3, 0, 4, '#e0506a');
  line(ctx, [-0.3, 0.0, 1], [-0.1, 0.0, 1], '#3b3a3f', 1.4);
}

export function footballField(ctx, r) {
  base(ctx, '#7fb560', 6);
  for (let i = -4; i < 4; i++) rect(ctx, i * 0.11, -0.4, i * 0.11 + 0.11, 0.4, i % 2 ? '#78ad59' : '#86bd67');
  rect(ctx, -0.46, -0.4, -0.38, 0.4, '#c4604b'); rect(ctx, 0.38, -0.4, 0.46, 0.4, '#4f7fb5');
  for (let i = -3; i <= 3; i++) line(ctx, [i * 0.11, -0.4, 0], [i * 0.11, 0.4, 0], 'rgba(255,255,255,.7)', 0.8);
  for (const x of [-0.46, 0.46]) { box(ctx, x - 0.006, -0.06, x + 0.006, -0.054, 0, 16, '#f0c22f'); box(ctx, x - 0.006, 0.054, x + 0.006, 0.06, 0, 16, '#f0c22f'); box(ctx, x - 0.006, -0.06, x + 0.006, 0.06, 10, 11, '#f0c22f'); }
}

export function basketballCourt(ctx, r) {
  base(ctx, '#b9763f', 6);
  rect(ctx, -0.36, -0.2, 0.36, 0.2, '#d9965a');
  const L = (a, b) => line(ctx, a, b, 'rgba(255,255,255,.9)', 1);
  L([-0.34, -0.18, 0], [0.34, -0.18, 0]); L([0.34, -0.18, 0], [0.34, 0.18, 0]); L([0.34, 0.18, 0], [-0.34, 0.18, 0]); L([-0.34, 0.18, 0], [-0.34, -0.18, 0]); L([0, -0.18, 0], [0, 0.18, 0]);
  rect(ctx, -0.36, -0.07, -0.22, 0.07, '#c4604b'); rect(ctx, 0.22, -0.07, 0.36, 0.07, '#c4604b');
  for (const x of [-0.37, 0.37]) { box(ctx, x - 0.006, -0.006, x + 0.006, 0.006, 0, 18, '#6c7176'); box(ctx, x - 0.006, -0.05, x + 0.006, 0.05, 16, 22, '#fbf5e4'); }
}

// ============ Utilities ============
function coolingTower(ctx, cx, cy, h, rb, rw, rt) {
  const [sx, sy] = P(cx, cy);
  const g = ctx.createLinearGradient(sx - rb, 0, sx + rb, 0);
  g.addColorStop(0, '#d8d2c4'); g.addColorStop(0.4, '#ece6d8'); g.addColorStop(1, '#a8a496');
  ctx.beginPath();
  ctx.moveTo(sx - rb, sy);
  ctx.quadraticCurveTo(sx - rw, sy - h * 0.55, sx - rt, sy - h);
  ctx.ellipse(sx, sy - h, rt, rt * 0.5, 0, Math.PI, 0, false);
  ctx.quadraticCurveTo(sx + rw, sy - h * 0.55, sx + rb, sy);
  ctx.ellipse(sx, sy, rb, rb * 0.5, 0, 0, Math.PI, false);
  ctx.closePath(); ctx.fillStyle = g; ctx.fill();
  ctx.beginPath(); ctx.ellipse(sx, sy - h, rt, rt * 0.5, 0, 0, Math.PI * 2); ctx.fillStyle = '#6a6f74'; ctx.fill();
  for (let i = 0; i < 3; i++) blob(ctx, cx + i * 0.04, cy - i * 0.04, h + 8 + i * 12, 9 + i * 4, `rgba(250,250,250,${0.85 - i * 0.22})`);
}
export function powerPlant(ctx, r) {
  shadow(ctx, 2, 1.4);
  box(ctx, -0.8, -0.1, 0.1, 0.4, 0, 30, '#b9b2a2');
  windows(ctx, 'y', 0.4, -0.76, 0.06, 4, 30, { floorH: 24, cols: 5, w: 0.1, h: 14, pad: 3 });
  coolingTower(ctx, 0.35, -0.3, 62, 26, 15, 18);
  coolingTower(ctx, -0.25, -0.45, 62, 26, 15, 18);
  cyl(ctx, -0.55, 0.55, 0.06, 0, 74, '#b5694f');
  cylBand(ctx, -0.55, 0.55, 0.06, 66, '#d6382f', 3);
}
export function substation(ctx, r) {
  base(ctx, '#b9b5aa', 6);
  for (const [x, y] of [[-0.2, -0.15], [0.12, -0.18], [0.0, 0.14]]) { box(ctx, x - 0.08, y - 0.06, x + 0.08, y + 0.06, 0, 12, '#7a8a8f'); for (let i = -1; i <= 1; i++) box(ctx, x + i * 0.04 - 0.008, y - 0.008, x + i * 0.04 + 0.008, y + 0.008, 12, 22, '#e8e4d8'); }
  for (const [x1, y1, x2, y2] of [[-0.5, -0.5, 0.5, -0.5], [0.5, -0.5, 0.5, 0.5], [-0.5, 0.5, 0.5, 0.5], [-0.5, -0.5, -0.5, 0.5]]) line(ctx, [x1, y1, 7], [x2, y2, 7], '#8a9298', 1);
}
export function pumpjack(ctx, r) {
  shadow(ctx, 0.6, 0.6, 0.12);
  box(ctx, -0.16, -0.12, 0.16, 0.12, 0, 4, '#6c7176');
  const [x, y] = P(0, 0, 4), t = r.range(-0.25, 0.25);
  ctx.strokeStyle = '#d6382f'; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - 10, y); ctx.lineTo(x, y - 20); ctx.lineTo(x + 10, y); ctx.stroke();
  ctx.save(); ctx.translate(x, y - 20); ctx.rotate(t);
  ctx.strokeStyle = '#e8c14a'; ctx.lineWidth = 3.4; ctx.beginPath(); ctx.moveTo(-26, 0); ctx.lineTo(18, 0); ctx.stroke();
  ctx.fillStyle = '#e8c14a'; ctx.beginPath(); ctx.moveTo(-26, -6); ctx.quadraticCurveTo(-34, 0, -26, 8); ctx.lineTo(-22, 0); ctx.fill();
  ctx.fillStyle = '#3b3a3f'; ctx.fillRect(14, -2, 8, 11);
  ctx.restore();
  ctx.strokeStyle = '#3b3a3f'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - 26, y - 14); ctx.lineTo(x - 26, y + 6); ctx.stroke();
}
export function grainElevator(ctx, r) {
  shadow(ctx, 1.2, 1);
  for (let i = 0; i < 4; i++) cyl(ctx, -0.36 + i * 0.24, 0.1, 0.1, 0, 50, '#d9d4c4', 8);
  for (let i = 0; i < 3; i++) cyl(ctx, -0.24 + i * 0.24, -0.1, 0.1, 0, 50, '#e4dfd0', 8);
  box(ctx, -0.42, -0.35, -0.2, -0.15, 0, 84, '#cfc8b4');
  box(ctx, -0.44, -0.37, -0.18, -0.13, 84, 90, '#8a9298');
  line(ctx, [-0.3, -0.25, 86], [0.4, 0.05, 52], '#6c7176', 2);
}
export function dam(ctx, r) {
  base(ctx, PAL.grass, 6);
  poly(ctx, [[-H5, -H5, 36], [H5, -H5, 36], [H5, -0.14, 36], [-H5, -0.14, 36]], PAL.water);
  poly(ctx, [[-H5, 0.14, 0.5], [H5, 0.14, 0.5], [H5, H5, 0.5], [-H5, H5, 0.5]], PAL.water);
  box(ctx, -H5, -0.14, H5, 0.14, 0, 38, '#c9c4b8');
  for (let i = -3; i <= 3; i++) face(ctx, 'y', 0.141, i * 0.14 - 0.03, i * 0.14 + 0.03, 4, 36, 'rgba(255,255,255,.55)');
  box(ctx, -H5, -0.14, H5, -0.1, 38, 42, '#8a9298');
}
export function wastewater(ctx, r) {
  shadow(ctx, 1.2, 1.2, 0.12);
  base(ctx, '#b9b5aa', 4);
  for (const [x, y, rr] of [[-0.24, -0.2, 0.22], [0.24, 0.2, 0.22]]) { cyl(ctx, x, y, rr, 0, 8, '#cfd6da'); const [sx, sy] = P(x, y, 8); ctx.beginPath(); ctx.ellipse(sx, sy, rr * 45, rr * 22, 0, 0, Math.PI * 2); ctx.fillStyle = '#7d8f6a'; ctx.fill(); line(ctx, [x, y, 9], [x + rr, y, 9], '#6c7176', 1.5); }
  box(ctx, 0.1, -0.4, 0.4, -0.2, 0, 14, '#8a9298');
}

// ============ Outdoors ============
export function logCabin(ctx, r) {
  shadow(ctx, 0.9, 0.8);
  box(ctx, -0.34, -0.26, 0.34, 0.26, 0, 20, '#9a6a42');
  for (let z = 3; z < 20; z += 3.4) { face(ctx, 'y', 0.261, -0.34, 0.34, z, z + 0.7, 'rgba(60,35,20,.4)'); face(ctx, 'x', 0.341, -0.26, 0.26, z, z + 0.7, 'rgba(40,25,15,.4)'); }
  door(ctx, 'y', 0.26, -0.1, 0.14, 0, 14, '#5a3a20');
  win(ctx, 'y', 0.26, 0.15, 0.16, 6, 9);
  gable(ctx, -0.34, -0.26, 0.34, 0.26, 20, 16, tone('#5f4a38'), 0.08, 'x', tone('#9a6a42'));
  box(ctx, 0.12, -0.14, 0.2, -0.06, 20, 36, '#8a8f94');
}
export function campground(ctx, r) {
  base(ctx, PAL.grass, 6);
  for (const [x, y, c] of [[-0.25, -0.15, '#d6682f'], [0.2, -0.2, '#4f7fb5']]) { poly(ctx, [[x - 0.12, y + 0.1, 0], [x + 0.12, y + 0.1, 0], [x, y, 16]], tone(c).left); poly(ctx, [[x + 0.12, y - 0.1, 0], [x + 0.12, y + 0.1, 0], [x, y, 16]], tone(c).right); }
  const [fx, fy] = P(0.0, 0.2);
  ctx.fillStyle = '#6c7176'; ctx.beginPath(); ctx.ellipse(fx, fy, 6, 3, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#f0822f'; ctx.beginPath(); ctx.moveTo(fx - 3, fy); ctx.quadraticCurveTo(fx, fy - 12, fx + 3, fy); ctx.fill();
  ctx.fillStyle = '#f6d25a'; ctx.beginPath(); ctx.moveTo(fx - 1.4, fy); ctx.quadraticCurveTo(fx, fy - 6, fx + 1.4, fy); ctx.fill();
}
export function cemetery(ctx, r) {
  base(ctx, PAL.grass, 6);
  for (const [x, y] of [[-0.3, -0.25], [0.0, -0.28], [0.3, -0.22], [-0.2, 0.0], [0.15, 0.02], [-0.3, 0.28], [0.1, 0.3]]) { const [sx, sy] = P(x, y); ctx.fillStyle = 'rgba(40,40,40,.2)'; ctx.beginPath(); ctx.ellipse(sx + 1, sy, 4, 1.4, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#a9aeb4'; ctx.beginPath(); ctx.roundRect(sx - 3, sy - 9, 6, 9, [3, 3, 0, 0]); ctx.fill(); ctx.fillStyle = '#6d7278'; ctx.fillRect(sx - 0.5, sy - 7, 1, 4); }
  box(ctx, -H5, 0.46, H5, 0.5, 0, 6, '#2f3238');
}
export function lighthouse(ctx, r) {
  shadow(ctx, 0.8, 0.8);
  box(ctx, -0.3, -0.3, 0.3, 0.3, 0, 4, '#8a8f94');
  frustum(ctx, 0, 0, 0.2, 0.12, 4, 70, tone('#f1efe8'));
  for (const [a, b] of [[16, 26], [40, 50]]) frustum(ctx, 0, 0, 0.2 - (a - 4) * 0.0012, 0.2 - (b - 4) * 0.0012, a, b, tone('#d6382f'));
  box(ctx, -0.16, -0.16, 0.16, 0.16, 70, 73, '#3b3a3f');
  box(ctx, -0.1, -0.1, 0.1, 0.1, 73, 86, '#f6e7a8');
  hip(ctx, -0.12, -0.12, 0.12, 0.12, 86, 12, tone('#d6382f'), 0.02);
}
export function dock(ctx, r) {
  base(ctx, PAL.water, 3);
  poly(ctx, [[-H5, -0.1, 4], [0.3, -0.1, 4], [0.3, 0.1, 4], [-H5, 0.1, 4]], '#a67c52');
  for (let i = -4; i <= 2; i++) line(ctx, [i * 0.1, -0.1, 4.2], [i * 0.1, 0.1, 4.2], 'rgba(60,35,20,.4)', 0.8);
  for (let x = -0.4; x <= 0.3; x += 0.2) for (const y of [-0.1, 0.1]) box(ctx, x - 0.012, y - 0.012, x + 0.012, y + 0.012, -2, 8, '#6a4a2a');
}
export function boathouse(ctx, r) {
  shadow(ctx, 1, 0.9);
  box(ctx, -0.4, -0.3, 0.4, 0.3, 0, 22, '#8a9ab0');
  face(ctx, 'y', 0.301, -0.3, 0.3, 0, 16, tone('#3b3a3f').left);
  win(ctx, 'x', 0.4, 0, 0.16, 8, 9);
  gable(ctx, -0.4, -0.3, 0.4, 0.3, 22, 18, tone('#b5694f'), 0.06, 'x', tone('#8a9ab0'));
}
