// Boats, RVs, buses, food trucks, balloons.
import { Rig, glassTone } from '../rig.js';
import { shadow, P } from '../iso.js';
import { tone } from '../colors.js';
import { PAL } from '../palette.js';
import { wheels, lamps } from './vehicles.js';

const WHITE = '#f1efe8', DARK = '#2f3238';

function hull(rig, L0, L1, W, c, top = '#f1efe8') {
  rig.add(L0, L1, -W * 0.7, W * 0.7, 0, 3, shade(c));
  rig.add(L0, L1 - 0.12, -W, W, 3, 8, c);
  rig.add(L1 - 0.12, L1, -W * 0.55, W * 0.55, 3, 8, c);
  rig.add(L0 + 0.02, L1 - 0.14, -W * 0.9, W * 0.9, 8, 8.8, top);
}
const shade = (c) => c;

export function sailboat(ctx, r, { dir = 0 } = {}) {
  const c = r.pick(['#3f7fb5', '#d6382f', '#f1efe8', '#2f3a48']);
  const rig = new Rig(dir);
  hull(rig, -0.32, 0.34, 0.1, c);
  rig.add(-0.03, 0.01, -0.01, 0.01, 8.8, 40, '#8a6a4a');
  for (let i = 0; i < 5; i++) rig.add(-0.27 + i * 0.05, 0.0, -0.008, 0.008, 10 + i * 5.5, 15.5 + i * 5.5, i % 2 ? '#f1ead2' : WHITE);
  for (let i = 0; i < 3; i++) rig.add(0.02, 0.3 - i * 0.09, -0.006, 0.006, 10 + i * 5.5, 15.5 + i * 5.5, WHITE);
  rig.render(ctx);
}

export function motorBoat(ctx, r, { dir = 0 } = {}) {
  const c = r.pick(['#d6382f', '#f1efe8', '#3f7fb5']);
  const rig = new Rig(dir);
  hull(rig, -0.3, 0.32, 0.095, c);
  rig.add(-0.12, 0.08, -0.07, 0.07, 8.8, 15, glassTone(WHITE, '#6f98ac'));
  rig.add(-0.13, 0.09, -0.075, 0.075, 15, 16, WHITE);
  rig.add(-0.34, -0.3, -0.03, 0.03, 2, 8, DARK);
  rig.render(ctx);
}

export function ferry(ctx, r, { dir = 0 } = {}) {
  const rig = new Rig(dir);
  hull(rig, -0.6, 0.62, 0.15, '#2f4f78');
  rig.add(-0.5, 0.4, -0.13, 0.13, 8.8, 18, glassTone(WHITE, '#7aa7be'));
  rig.add(-0.5, 0.4, -0.13, 0.13, 18, 19, WHITE);
  rig.add(-0.4, 0.2, -0.11, 0.11, 19, 28, glassTone(WHITE, '#7aa7be'));
  rig.add(-0.4, 0.2, -0.11, 0.11, 28, 29, WHITE);
  rig.add(-0.3, -0.22, -0.03, 0.03, 29, 40, '#d6382f');
  rig.render(ctx);
}

export function fishingBoat(ctx, r, { dir = 0 } = {}) {
  const rig = new Rig(dir);
  hull(rig, -0.34, 0.36, 0.11, '#3f6f9f', '#c9a063');
  rig.add(-0.22, -0.04, -0.08, 0.08, 8.8, 20, glassTone(WHITE));
  rig.add(-0.23, -0.03, -0.085, 0.085, 20, 21, WHITE);
  rig.add(0.1, 0.12, -0.008, 0.008, 8.8, 44, '#6c7176');
  rig.add(-0.3, 0.12, -0.004, 0.004, 40, 41, '#6c7176');
  rig.render(ctx);
}

export function kayak(ctx, r, { dir = 0 } = {}) {
  const c = r.pick(['#e8892f', '#d6382f', '#f0c22f', '#4f9a58']);
  const rig = new Rig(dir);
  rig.add(-0.26, 0.26, -0.035, 0.035, 0, 4, c);
  rig.add(-0.3, -0.26, -0.015, 0.015, 1, 3.4, c);
  rig.add(0.26, 0.3, -0.015, 0.015, 1, 3.4, c);
  rig.add(-0.03, 0.03, -0.03, 0.03, 4, 11, '#3f4a63');
  rig.add(-0.02, 0.02, -0.16, 0.16, 8, 9, '#6c7176');
  rig.render(ctx);
}

export function rv(ctx, r, { dir = 0 } = {}) {
  const c = r.pick(['#f1efe8', '#e8dcc0']);
  const rig = new Rig(dir);
  wheels(rig, [-0.28, 0.3], 0.14, 4.2);
  rig.add(-0.5, 0.45, -0.14, 0.14, 4, 28, c);
  rig.add(0.3, 0.45, -0.13, 0.13, 12, 24, glassTone(c));
  rig.add(-0.5, 0.45, -0.143, 0.143, 11, 14, r.pick(['#d6382f', '#3f7fb5', '#4f9a58']), 'body', 0.4);
  rig.add(-0.3, 0.1, -0.146, 0.146, 14, 22, glassTone(c, '#7aa7be'), 'body', 0.4);
  rig.add(-0.5, 0.45, -0.14, 0.14, 28, 29, '#d8d4c8');
  lamps(rig, 0.45, 0.14, 7);
  shadow(ctx, 1.4, 0.6, 0.18, 3, 2);
  rig.render(ctx);
}

export function schoolBus(ctx, r, { dir = 0 } = {}) {
  const rig = new Rig(dir);
  wheels(rig, [-0.34, 0.3], 0.14, 4.6);
  rig.add(-0.5, 0.5, -0.14, 0.14, 4, 11, '#f0b429');
  rig.add(-0.49, 0.49, -0.135, 0.135, 11, 21, glassTone('#f0b429', '#6f98ac'));
  rig.add(-0.5, 0.5, -0.142, 0.142, 9, 10.2, DARK, 'body', 0.4);
  rig.add(-0.5, 0.5, -0.14, 0.14, 21, 22.5, '#f0b429');
  rig.add(0.5, 0.52, -0.12, 0.12, 12, 20, '#d6382f', 'front');
  lamps(rig, 0.5, 0.14, 6);
  shadow(ctx, 1.6, 0.6, 0.18, 3, 2);
  rig.render(ctx);
}

export function snowplow(ctx, r, { dir = 0 } = {}) {
  const rig = new Rig(dir);
  wheels(rig, [-0.26, 0.2], 0.14, 4.6);
  rig.add(-0.4, 0.34, -0.13, 0.13, 5, 18, '#e58a3d');
  rig.add(0.12, 0.34, -0.125, 0.125, 18, 27, glassTone('#e58a3d'));
  rig.add(0.1, 0.35, -0.13, 0.13, 27, 28.2, '#e58a3d');
  rig.add(-0.4, -0.05, -0.11, 0.11, 18, 21, '#8a8f94');
  rig.add(0.3, 0.38, -0.18, 0.18, 5, 17, '#8a8f94');
  rig.add(0.2, 0.28, -0.04, 0.04, 28.2, 31, '#f0c22f');
  lamps(rig, 0.34, 0.13, 8);
  shadow(ctx, 1.4, 0.6, 0.18, 3, 2);
  rig.render(ctx);
}

export function foodTruck(ctx, r, { dir = 0 } = {}) {
  const c = r.pick(['#e0506a', '#58a37a', '#f0b429', '#4f9ad6']);
  const rig = new Rig(dir);
  wheels(rig, [-0.2, 0.2], 0.13, 4.2);
  rig.add(-0.34, 0.34, -0.13, 0.13, 4, 24, c);
  rig.add(0.24, 0.34, -0.12, 0.12, 12, 21, glassTone(c));
  rig.add(-0.2, 0.1, -0.132, 0.132, 11, 19, '#2b2433', 'body', 0.4);
  rig.add(-0.22, 0.12, -0.14, 0.14, 19, 20.4, '#fbf5e4', 'body', 0.5);
  rig.add(-0.34, 0.34, -0.13, 0.13, 24, 25, '#d8d4c8');
  lamps(rig, 0.34, 0.13, 7);
  shadow(ctx, 1.1, 0.55, 0.18, 3, 2);
  rig.render(ctx);
}

// hot air balloon (screen space; parked on the ground, tethered)
export function hotAirBalloon(ctx, r) {
  const [bx, by] = P(0, 0);
  ctx.fillStyle = 'rgba(40,50,30,.16)'; ctx.beginPath(); ctx.ellipse(bx + 3, by + 1, 14, 6, 0, 0, Math.PI * 2); ctx.fill();
  const cols = r.chance(0.5) ? ['#e0506a', '#f0c22f', '#4f9ad6'] : ['#d6382f', '#fbf5e4', '#3f7fb5'];
  const cy = by - 74, R = 32;
  const n = 8;
  for (let i = 0; i < n; i++) {
    const a0 = Math.PI * (i / n), a1 = Math.PI * ((i + 1) / n);
    ctx.fillStyle = cols[i % cols.length];
    ctx.beginPath();
    ctx.moveTo(bx + Math.cos(a0) * R, cy - Math.sin(a0) * R * 0.0);
    ctx.bezierCurveTo(bx + Math.cos(a0) * R * 1.15, cy - 6, bx + Math.cos(a0) * R * 0.8, cy + 22, bx, by - 30);
    ctx.bezierCurveTo(bx + Math.cos(a1) * R * 0.8, cy + 22, bx + Math.cos(a1) * R * 1.15, cy - 6, bx + Math.cos(a1) * R, cy);
    ctx.bezierCurveTo(bx + Math.cos(a1) * R * 0.9, cy - R * 1.1, bx + Math.cos(a0) * R * 0.9, cy - R * 1.1, bx + Math.cos(a0) * R, cy);
    ctx.fill();
  }
  const g = ctx.createRadialGradient(bx - 10, cy - 12, 2, bx, cy, R * 1.3);
  g.addColorStop(0, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(0,0,0,.18)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(bx, cy - 4, R, R * 1.05, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#6a4a2a'; ctx.lineWidth = 0.8;
  for (const dx of [-6, 6]) { ctx.beginPath(); ctx.moveTo(bx + dx * 1.6, cy + 26); ctx.lineTo(bx + dx, by - 9); ctx.stroke(); }
  ctx.fillStyle = '#a67c52'; ctx.fillRect(bx - 8, by - 9, 16, 9);
  ctx.fillStyle = '#6a4a2a'; ctx.fillRect(bx - 8, by - 9, 16, 2);
}
