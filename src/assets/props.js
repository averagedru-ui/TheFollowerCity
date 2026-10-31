// Street furniture, utilities, industrial props.
import { box, poly, face, line, P, shadow, cyl, cylBand, cone, blob, diamond, win } from '../iso.js';
import { tone, shade } from '../colors.js';
import { PAL } from '../palette.js';

const post = (ctx, x, y, h, c = '#4a4f55', w = 0.012) => box(ctx, x - w, y - w, x + w, y + w, 0, h, c);

export function streetLamp(ctx, r) {
  shadow(ctx, 0.3, 0.3, 0.1);
  post(ctx, 0, 0, 44, '#3b3f45');
  box(ctx, -0.012, -0.012, 0.15, 0.012, 44, 46, '#3b3f45');
  box(ctx, 0.11, -0.03, 0.2, 0.03, 40, 44, '#f6e7a8');
  blob(ctx, 0.15, 0, 38, 9, 'rgba(255,240,170,.18)');
}
export function trafficLight(ctx, r) {
  shadow(ctx, 0.3, 0.3, 0.1);
  post(ctx, 0, 0, 40, '#3b3f45');
  box(ctx, -0.03, 0.01, 0.03, 0.05, 28, 46, '#2f3238');
  const [x, y] = P(0, 0.05, 0);
  [['#d6382f', 42], ['#f0b429', 37], ['#4fb08a', 32]].forEach(([c, z], i) => { ctx.beginPath(); ctx.arc(x - 0.5, y - z - 3, 2.2, 0, Math.PI * 2); ctx.fillStyle = i === 2 ? c : shade(c, -0.25); ctx.fill(); });
}
export function stopSign(ctx, r) {
  shadow(ctx, 0.25, 0.25, 0.1);
  post(ctx, 0, 0, 30, '#8a9298', 0.008);
  const [x, y] = P(0, 0, 36);
  ctx.beginPath();
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 + Math.PI / 8; ctx.lineTo(x + Math.cos(a) * 7.5, y + Math.sin(a) * 7.5); }
  ctx.closePath(); ctx.fillStyle = '#c9342b'; ctx.fill(); ctx.strokeStyle = '#fbf5e4'; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = '#fbf5e4'; ctx.fillRect(x - 4, y - 1, 8, 2);
}
export function bench(ctx, r) {
  shadow(ctx, 0.5, 0.3, 0.1);
  box(ctx, -0.18, -0.06, 0.18, 0.06, 5, 7, '#8a6240');
  box(ctx, -0.18, -0.07, 0.18, -0.05, 7, 14, '#8a6240');
  for (const x of [-0.15, 0.15]) box(ctx, x - 0.012, -0.05, x + 0.012, 0.05, 0, 5, '#3b3f45');
}
export function hydrant(ctx, r) {
  shadow(ctx, 0.2, 0.2, 0.1);
  cyl(ctx, 0, 0, 0.04, 0, 10, '#d6382f', 3);
  box(ctx, -0.07, -0.015, 0.07, 0.015, 5, 7, '#d6382f');
}
export function mailbox(ctx, r) {
  shadow(ctx, 0.2, 0.2, 0.1);
  post(ctx, 0, 0, 9, '#8a9298', 0.01);
  box(ctx, -0.05, -0.035, 0.05, 0.035, 9, 15, '#3f7fb5');
}
export function trashBin(ctx, r) {
  shadow(ctx, 0.25, 0.25, 0.1);
  cyl(ctx, 0, 0, 0.06, 0, 13, r.pick(['#4f9a58', '#3f7fb5', '#5a5f66']));
}
export function busStop(ctx, r) {
  shadow(ctx, 0.9, 0.5, 0.1);
  for (const [x, y] of [[-0.25, -0.1], [0.25, -0.1], [-0.25, 0.1], [0.25, 0.1]]) post(ctx, x, y, 28, '#6c7176', 0.01);
  box(ctx, -0.3, -0.14, 0.3, 0.14, 28, 30, '#4f7fb5');
  face(ctx, 'y', 0.1, -0.24, 0.24, 6, 26, tone('#a9cfdc').left);
  box(ctx, -0.16, -0.08, 0.16, -0.04, 0, 6, '#8a6240');
  box(ctx, 0.34, 0.08, 0.36, 0.1, 0, 36, '#6c7176');
  box(ctx, 0.3, 0.075, 0.4, 0.105, 30, 38, '#4f7fb5');
}
export function billboard(ctx, r) {
  shadow(ctx, 0.6, 0.3, 0.1);
  post(ctx, -0.2, 0, 34, '#6c7176', 0.015); post(ctx, 0.2, 0, 34, '#6c7176', 0.015);
  box(ctx, -0.35, -0.02, 0.35, 0.04, 34, 56, '#3b3f45');
  const c = r.pick(['#e8c14a', '#58a37a', '#d6382f', '#4f7fb5']);
  face(ctx, 'y', 0.041, -0.33, 0.33, 36, 54, tone(c).left);
  face(ctx, 'y', 0.042, -0.2, 0.0, 42, 48, tone('#fbf5e4').left);
}
export function statue(ctx, r) {
  shadow(ctx, 0.5, 0.5, 0.12);
  box(ctx, -0.12, -0.12, 0.12, 0.12, 0, 6, '#c9c4b8');
  box(ctx, -0.07, -0.07, 0.07, 0.07, 6, 22, '#d8d2c4');
  const [x, y] = P(0, 0, 22);
  ctx.fillStyle = '#9a7a4a'; ctx.beginPath(); ctx.roundRect(x - 3, y - 14, 6, 14, 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x, y - 17, 3, 0, Math.PI * 2); ctx.fill();
}
export function fenceX(ctx, r) {
  for (const x of [-0.45, -0.15, 0.15, 0.45]) post(ctx, x, 0, 12, '#8a6240', 0.014);
  box(ctx, -0.46, -0.006, 0.46, 0.006, 8, 10, '#a67c52');
  box(ctx, -0.46, -0.006, 0.46, 0.006, 3, 5, '#a67c52');
}
export function fenceY(ctx, r) {
  for (const y of [-0.45, -0.15, 0.15, 0.45]) post(ctx, 0, y, 12, '#8a6240', 0.014);
  box(ctx, -0.006, -0.46, 0.006, 0.46, 8, 10, '#a67c52');
  box(ctx, -0.006, -0.46, 0.006, 0.46, 3, 5, '#a67c52');
}
export function hedge(ctx, r) {
  shadow(ctx, 1, 0.3, 0.1);
  box(ctx, -0.48, -0.1, 0.48, 0.1, 0, 12, r.pick(['#4f8250', '#5f8f4a']));
  box(ctx, -0.48, -0.1, 0.48, 0.1, 12, 12.5, '#6fa055');
}
export function powerPole(ctx, r) {
  shadow(ctx, 0.3, 0.3, 0.1);
  post(ctx, 0, 0, 78, '#8a6a4a', 0.016);
  box(ctx, -0.2, -0.012, 0.2, 0.012, 70, 73, '#8a6a4a');
  box(ctx, -0.14, -0.012, 0.14, 0.012, 58, 60, '#8a6a4a');
  for (const x of [-0.18, 0, 0.18]) box(ctx, x - 0.01, -0.01, x + 0.01, 0.01, 73, 77, '#c9ced0');
}
export function cellTower(ctx, r) {
  shadow(ctx, 0.5, 0.5, 0.1);
  for (const [x, y] of [[-0.06, -0.06], [0.06, -0.06], [-0.06, 0.06], [0.06, 0.06]]) line(ctx, [x, y, 0], [0, 0, 120], '#b9c0c4', 1.4);
  for (const z of [30, 60, 90]) { const k = 1 - z / 120; line(ctx, [-0.06 * k, 0.06 * k, z], [0.06 * k, 0.06 * k, z], '#b9c0c4', 1); line(ctx, [0.06 * k, -0.06 * k, z], [0.06 * k, 0.06 * k, z], '#b9c0c4', 1); }
  for (const a of [-0.03, 0.03]) box(ctx, a - 0.01, 0.02, a + 0.01, 0.045, 108, 122, '#e8e4d8');
}
export function windTurbine(ctx, r) {
  shadow(ctx, 0.5, 0.5, 0.1);
  cyl(ctx, 0, 0, 0.035, 0, 96, '#f1efe8');
  const hub = P(0, 0.03, 98);
  const ang = r.range(0, 2);
  ctx.fillStyle = '#f1efe8'; ctx.strokeStyle = '#c9ced0'; ctx.lineWidth = 0.8;
  for (let i = 0; i < 3; i++) {
    const th = ang + (i * Math.PI * 2) / 3, ca = Math.cos(th), sa = Math.sin(th);
    ctx.beginPath();
    ctx.moveTo(hub[0] - sa * 1.6, hub[1] + ca * 1.6);
    ctx.lineTo(hub[0] + ca * 44 - sa * 0.6, hub[1] + sa * 44 + ca * 0.6);
    ctx.lineTo(hub[0] - sa * -1.6 * 0.2 + ca * 44, hub[1] + sa * 44);
    ctx.lineTo(hub[0] + sa * 1.6, hub[1] - ca * 1.6);
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(hub[0], hub[1], 3, 0, Math.PI * 2); ctx.fillStyle = '#d8dce0'; ctx.fill();
}
export function solarPanel(ctx, r) {
  shadow(ctx, 0.6, 0.4, 0.1);
  poly(ctx, [[-0.2, -0.12, 14], [0.2, -0.12, 14], [0.2, 0.08, 6], [-0.2, 0.08, 6]], '#2f5a8f');
  poly(ctx, [[-0.2, -0.12, 14], [0.2, -0.12, 14], [0.2, -0.1, 14], [-0.2, -0.1, 14]], '#c9ced0');
  for (let k = -1; k <= 1; k++) line(ctx, [k * 0.13, -0.12, 14], [k * 0.13, 0.08, 6], 'rgba(220,230,240,.6)', 0.7);
  post(ctx, -0.12, 0, 8, '#8a9298', 0.01); post(ctx, 0.12, 0, 8, '#8a9298', 0.01);
}
export function pallet(ctx, r) {
  shadow(ctx, 0.5, 0.5, 0.1);
  box(ctx, -0.18, -0.14, 0.18, 0.14, 0, 3, '#b08a5a');
  for (const [x, y, z, c] of [[-0.09, -0.06, 3, '#c9a370'], [0.09, -0.06, 3, '#d9b880'], [-0.09, 0.06, 3, '#d9b880'], [0.09, 0.06, 3, '#c9a370'], [0, 0, 11, '#c9a370']]) box(ctx, x - 0.08, y - 0.06, x + 0.08, y + 0.06, z, z + 8, c);
}
export function shippingContainers(ctx, r) {
  shadow(ctx, 1.1, 0.6, 0.14);
  const cols = ['#d6382f', '#3f7fb5', '#e8c14a', '#4f9a58', '#e58a3d', '#8a6fb0'];
  for (const [x, y, z] of [[-0.25, -0.18, 0], [-0.25, 0.18, 0], [0.25, -0.18, 0], [-0.25, 0.18, 9], [0.25, 0.18, 0]]) {
    const c = r.pick(cols);
    box(ctx, x - 0.22, y - 0.08, x + 0.22, y + 0.08, z, z + 9, c);
  }
}
export function crane(ctx, r) {
  shadow(ctx, 0.6, 0.6, 0.12);
  box(ctx, -0.12, -0.12, 0.12, 0.12, 0, 6, '#8a9298');
  for (const [x, y] of [[-0.05, -0.05], [0.05, -0.05], [-0.05, 0.05], [0.05, 0.05]]) line(ctx, [x * 1.4, y * 1.4, 6], [x * 0.8, y * 0.8, 110], '#e8892f', 2);
  for (let z = 20; z < 110; z += 20) { const k = 1 - z / 140; line(ctx, [-0.07 * k, 0.07 * k, z], [0.07 * k, 0.07 * k, z], '#e8892f', 1); }
  box(ctx, -0.5, -0.02, 0.2, 0.02, 110, 114, '#e8892f');
  box(ctx, 0.05, -0.04, 0.2, 0.04, 100, 110, '#6c7176');
  line(ctx, [-0.35, 0, 110], [-0.35, 0, 70], '#3b3a3f', 1);
  box(ctx, -0.4, -0.04, -0.3, 0.04, 62, 70, '#e8c14a');
}
export function tent(ctx, r) {
  shadow(ctx, 0.6, 0.5, 0.1);
  const c = r.pick(['#d6682f', '#4f7fb5', '#58a37a']);
  poly(ctx, [[-0.2, 0.18, 0], [0.2, 0.18, 0], [0, 0, 22]], tone(c).left);
  poly(ctx, [[0.2, -0.18, 0], [0.2, 0.18, 0], [0, 0, 22]], tone(c).right);
  poly(ctx, [[-0.2, 0.18, 0], [0, 0, 22], [-0.2, -0.18, 0]], tone(shade(c, -0.1)).right);
}
export function picnicTable(ctx, r) {
  shadow(ctx, 0.6, 0.5, 0.1);
  box(ctx, -0.2, -0.1, 0.2, 0.1, 9, 11, '#a67c52');
  box(ctx, -0.2, -0.2, 0.2, -0.13, 5, 7, '#a67c52');
  box(ctx, -0.2, 0.13, 0.2, 0.2, 5, 7, '#a67c52');
  for (const x of [-0.14, 0.14]) box(ctx, x - 0.01, -0.2, x + 0.01, 0.2, 0, 9, '#8a6240');
}
