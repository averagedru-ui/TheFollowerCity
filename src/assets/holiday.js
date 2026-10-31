// Holiday props + the decorator that dresses any building or tree for the current holiday.
import { box, poly, face, line, P, shadow, cyl, cylBand, cone, blob, win, door, hip, gable } from '../iso.js';
import { tone, shade } from '../colors.js';
import { PAL } from '../palette.js';

// ---------- little screen-space sprites (origin = their base) ----------
export function pumpkin(ctx, x, y, s = 1, face = false) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(40,30,10,.2)'; ctx.beginPath(); ctx.ellipse(1, 0, 7, 2.4, 0, 0, Math.PI * 2); ctx.fill();
  const g = ctx.createLinearGradient(-7, 0, 7, 0);
  g.addColorStop(0, '#f09a3a'); g.addColorStop(0.5, '#f6ad4a'); g.addColorStop(1, '#c9661f');
  ctx.fillStyle = g;
  for (const [dx, w] of [[-3.4, 4.6], [3.4, 4.6], [0, 5]]) { ctx.beginPath(); ctx.ellipse(dx, -5, w, 5.4, 0, 0, Math.PI * 2); ctx.fill(); }
  ctx.strokeStyle = 'rgba(150,70,10,.5)'; ctx.lineWidth = 0.7;
  for (const dx of [-3.4, 3.4]) { ctx.beginPath(); ctx.ellipse(dx * 0.5, -5, 2.4, 5.2, 0, 0, Math.PI * 2); ctx.stroke(); }
  ctx.fillStyle = '#5f7f3a'; ctx.fillRect(-0.9, -12, 1.8, 3);
  if (face) {
    ctx.fillStyle = '#ffe27a';
    ctx.beginPath(); ctx.moveTo(-3.8, -7.8); ctx.lineTo(-1.6, -7.8); ctx.lineTo(-2.7, -5.8); ctx.fill();
    ctx.beginPath(); ctx.moveTo(1.6, -7.8); ctx.lineTo(3.8, -7.8); ctx.lineTo(2.7, -5.8); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-3.6, -3.6); ctx.lineTo(3.6, -3.6); ctx.lineTo(2.4, -2); ctx.lineTo(0.8, -3); ctx.lineTo(-0.8, -2); ctx.lineTo(-2.4, -3); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,200,80,.25)'; ctx.beginPath(); ctx.arc(0, -5, 10, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();
}

export function ghost(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(250,250,255,.95)';
  ctx.beginPath();
  ctx.moveTo(-5, 0); ctx.lineTo(-5, -9); ctx.arc(0, -9, 5, Math.PI, 0); ctx.lineTo(5, 0);
  ctx.quadraticCurveTo(3.3, -2.5, 1.7, 0); ctx.quadraticCurveTo(0, -2.5, -1.7, 0); ctx.quadraticCurveTo(-3.3, -2.5, -5, 0);
  ctx.fill();
  ctx.fillStyle = '#2b2a40'; ctx.beginPath(); ctx.arc(-1.8, -9.5, 1, 0, Math.PI * 2); ctx.arc(1.8, -9.5, 1, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(0, -6.6, 1, 1.4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

export function bat(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#2b2433';
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.quadraticCurveTo(-4, -5, -9, -2); ctx.quadraticCurveTo(-7, -1, -6, 2); ctx.quadraticCurveTo(-3, 0, 0, 3);
  ctx.quadraticCurveTo(3, 0, 6, 2); ctx.quadraticCurveTo(7, -1, 9, -2); ctx.quadraticCurveTo(4, -5, 0, 0);
  ctx.fill();
  ctx.beginPath(); ctx.arc(0, -1, 1.8, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

export function tombstone(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(40,40,40,.2)'; ctx.beginPath(); ctx.ellipse(1, 0, 6, 2, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#a9aeb4'; ctx.beginPath(); ctx.roundRect(-4.5, -12, 9, 12, [4.5, 4.5, 0, 0]); ctx.fill();
  ctx.fillStyle = '#8b9096'; ctx.fillRect(1.5, -12, 3, 12);
  ctx.fillStyle = '#6d7278'; ctx.fillRect(-0.6, -9, 1.2, 5); ctx.fillRect(-2, -7.6, 4, 1.2);
  ctx.restore();
}

export function heart(ctx, x, y, s = 1, color = '#e0506a') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = color; ctx.beginPath();
  ctx.moveTo(0, 3); ctx.bezierCurveTo(-7, -2, -4, -7, 0, -3); ctx.bezierCurveTo(4, -7, 7, -2, 0, 3); ctx.fill();
  ctx.restore();
}

export function egg(ctx, x, y, s = 1, color = '#f2b8c6') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(0, -4.5, 3.4, 4.6, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(-3, -4.5); ctx.lineTo(-1.5, -6); ctx.lineTo(0, -4); ctx.lineTo(1.5, -6); ctx.lineTo(3, -4.5); ctx.stroke();
  ctx.restore();
}

export function shamrock(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#3f9a52';
  for (const [dx, dy] of [[-2.4, -6], [2.4, -6], [-2.4, -2.8], [2.4, -2.8]]) { ctx.beginPath(); ctx.arc(dx, dy, 2.4, 0, Math.PI * 2); ctx.fill(); }
  ctx.strokeStyle = '#3f9a52'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(1.5, 1); ctx.stroke();
  ctx.restore();
}

export function flag(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#c9ced0'; ctx.fillRect(-0.5, -22, 1, 22);
  ctx.fillStyle = '#fbf5e4'; ctx.fillRect(0.5, -22, 12, 8);
  ctx.fillStyle = '#c9342b'; for (const k of [0, 2.7, 5.4]) ctx.fillRect(0.5, -22 + k, 12, 1.3);
  ctx.fillStyle = '#2f4f8f'; ctx.fillRect(0.5, -22, 5, 4.4);
  ctx.restore();
}

export function bulb(ctx, x, y, color, r = 1.5) {
  ctx.globalAlpha = 0.28; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r * 2.6, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
}

// string of bulbs between two tile-space points, sagging a little
export function lights(ctx, a, b, colors, n = 9, sag = 2) {
  const [ax, ay] = P(...a), [bx, by] = P(...b);
  ctx.strokeStyle = 'rgba(40,40,40,.55)'; ctx.lineWidth = 0.7;
  ctx.beginPath(); ctx.moveTo(ax, ay);
  ctx.quadraticCurveTo((ax + bx) / 2, (ay + by) / 2 + sag * 2, bx, by); ctx.stroke();
  for (let i = 0; i <= n; i++) {
    const t = i / n, x = ax + (bx - ax) * t, y = ay + (by - ay) * t + Math.sin(t * Math.PI) * sag;
    bulb(ctx, x, y + 1, colors[i % colors.length]);
  }
}

export function bunting(ctx, a, b, n = 7) {
  const [ax, ay] = P(...a), [bx, by] = P(...b);
  const cols = ['#d6382f', '#fbf5e4', '#2f5fa8'];
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n, x = ax + (bx - ax) * t, y = ay + (by - ay) * t + Math.sin(t * Math.PI) * 2;
    ctx.fillStyle = cols[i % 3];
    ctx.beginPath(); ctx.moveTo(x - 2.4, y); ctx.lineTo(x + 2.4, y); ctx.lineTo(x, y + 5.5); ctx.fill();
  }
}

export function wreath(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = '#2f7a42'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 4.4, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = '#d6382f'; ctx.beginPath(); ctx.arc(0, 4.4, 1.6, 0, Math.PI * 2); ctx.fill();
  for (const [dx, dy] of [[-3, -2], [3, 1], [0, -4.4]]) { ctx.fillStyle = '#d6382f'; ctx.beginPath(); ctx.arc(dx, dy, 0.9, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}

export function xmasTree(ctx, x, y, s = 1, lit = true) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#6a4a2a'; ctx.fillRect(-1.5, -4, 3, 4);
  for (const [w, z0, z1, c] of [[10, -4, -16, '#2f6a45'], [8, -12, -24, '#357a4e'], [6, -20, -31, '#3b8a56']]) {
    ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(0, z1); ctx.lineTo(-w, z0); ctx.lineTo(w, z0); ctx.fill();
  }
  if (lit) {
    const cols = ['#e0506a', '#f0c22f', '#4f9ad6', '#fbf5e4'];
    [[-3, -8], [4, -10], [-6, -6], [1, -17], [-2, -23], [3, -26 + 6], [6, -6], [-1, -13]].forEach(([dx, dy], i) => bulb(ctx, dx, dy, cols[i % 4], 1.3));
  }
  ctx.fillStyle = '#f0c22f'; ctx.beginPath();
  for (let i = 0; i < 10; i++) { const a = (i / 10) * Math.PI * 2 - Math.PI / 2, r = i % 2 ? 1.6 : 3.4; ctx.lineTo(Math.cos(a) * r, -33 + Math.sin(a) * r); }
  ctx.fill();
  ctx.restore();
}

export function gift(ctx, x, y, s = 1, c = '#d6382f') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = c; ctx.fillRect(-4, -6, 8, 6);
  ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(-4, -6, 8, 1.5);
  ctx.fillStyle = '#f0c22f'; ctx.fillRect(-0.7, -6, 1.4, 6); ctx.fillRect(-4, -3.4, 8, 1.2);
  ctx.beginPath(); ctx.arc(-1.4, -7, 1.4, 0, Math.PI * 2); ctx.arc(1.4, -7, 1.4, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

export function snowman(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(60,70,90,.18)'; ctx.beginPath(); ctx.ellipse(1, 0, 9, 3, 0, 0, Math.PI * 2); ctx.fill();
  const ball = (cy, r) => { const g = ctx.createRadialGradient(-r * 0.3, cy - r * 0.3, 1, 0, cy, r); g.addColorStop(0, '#ffffff'); g.addColorStop(1, '#cfdde8'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, cy, r, 0, Math.PI * 2); ctx.fill(); };
  ball(-6, 7); ball(-16, 5.4); ball(-24, 4);
  ctx.fillStyle = '#2b2a30'; ctx.fillRect(-4, -31, 8, 1.4); ctx.fillRect(-2.6, -36, 5.2, 5.2);
  ctx.fillStyle = '#d6682f'; ctx.beginPath(); ctx.moveTo(0, -24); ctx.lineTo(5, -23.4); ctx.lineTo(0, -22.6); ctx.fill();
  ctx.fillStyle = '#2b2a30'; for (const [dx, dy] of [[-1.5, -25.4], [1.5, -25.4], [0, -17], [0, -13.5]]) { ctx.beginPath(); ctx.arc(dx, dy, 0.7, 0, Math.PI * 2); ctx.fill(); }
  ctx.strokeStyle = '#d6382f'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-4, -20.5); ctx.lineTo(4, -20.5); ctx.stroke();
  ctx.strokeStyle = '#6a4a2a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-5, -17); ctx.lineTo(-11, -22); ctx.moveTo(5, -17); ctx.lineTo(11, -22); ctx.stroke();
  ctx.restore();
}

// ---------- standalone assets ----------
export function pumpkinPatch(ctx, r) {
  shadow(ctx, 0.5, 0.5, 0.08);
  for (const [x, y, s] of [[-0.18, -0.1, 1.3], [0.15, -0.14, 1.1], [0.0, 0.08, 1.5], [-0.22, 0.2, 1], [0.24, 0.16, 1.2]]) {
    const [sx, sy] = P(x, y); pumpkin(ctx, sx, sy, s);
  }
}
export function jackOLantern(ctx) { const [x, y] = P(0, 0); pumpkin(ctx, x, y, 2.2, true); }
export function ghostProp(ctx, r) { const [x, y] = P(0, 0); shadow(ctx, 0.3, 0.3, 0.1); ghost(ctx, x, y - 6, 2.2); }
export function graveyard(ctx, r) {
  shadow(ctx, 0.5, 0.5, 0.06);
  for (const [x, y] of [[-0.2, -0.18], [0.1, -0.22], [0.26, 0.0], [-0.1, 0.12], [-0.28, 0.2], [0.18, 0.26]]) { const [sx, sy] = P(x, y); tombstone(ctx, sx, sy, 1.1 + r() * 0.3); }
  box(ctx, -0.46, 0.4, 0.46, 0.43, 0, 8, '#2f3238');
}
export function scarecrow(ctx, r) {
  shadow(ctx, 0.3, 0.3, 0.1);
  const [x, y] = P(0, 0);
  ctx.strokeStyle = '#6a4a2a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 34); ctx.moveTo(x - 14, y - 26); ctx.lineTo(x + 14, y - 26); ctx.stroke();
  ctx.fillStyle = '#4f7fb5'; ctx.fillRect(x - 5, y - 28, 10, 13);
  ctx.fillStyle = '#d6a05a'; ctx.fillRect(x - 4, y - 15, 8, 3);
  ctx.fillStyle = '#e8c070'; ctx.beginPath(); ctx.arc(x, y - 33, 4.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#6a4a2a'; ctx.fillRect(x - 7, y - 37, 14, 2); ctx.fillRect(x - 4, y - 44, 8, 7);
  ctx.fillStyle = '#2b2a30'; ctx.fillRect(x - 2.4, y - 34, 1.2, 1.2); ctx.fillRect(x + 1.2, y - 34, 1.2, 1.2);
  ctx.fillStyle = '#e0c060'; for (const dx of [-14, 14]) ctx.fillRect(x + dx - 1.5, y - 25, 3, 4);
}
export function hauntedHouse(ctx, r) {
  const dark = '#4a4258', roof = tone('#2b2433');
  shadow(ctx, 1.4, 1.2, 0.2);
  box(ctx, -0.5, -0.1, 0.5, 0.4, 0, 50, dark);
  box(ctx, -0.1, -0.5, 0.3, 0.1, 0, 70, shade(dark, 0.02));
  const glow = '#ffcf5a';
  for (const [pl, c, a, z] of [['y', 0.4, -0.3, 20], ['y', 0.4, 0.28, 20], ['y', 0.4, 0.0, 32], ['x', 0.5, 0.15, 20], ['x', 0.3, -0.2, 40]]) win(ctx, pl, c, a, 0.14, z, 14, { glass: glow, frame: '#2b2433' });
  door(ctx, 'y', 0.4, -0.02, 0.16, 0, 18, '#1e1a24', '#2b2433');
  gable(ctx, -0.5, -0.1, 0.5, 0.4, 50, 26, roof, 0.05, 'x', tone(dark));
  hip(ctx, -0.1, -0.5, 0.3, 0.1, 70, 30, roof, 0.04);
  box(ctx, 0.3, 0.0, 0.4, 0.1, 50, 80, '#6a5a4a');
  const [bx, by] = P(0.05, -0.2, 112); bat(ctx, bx - 22, by - 8, 1.1); bat(ctx, bx + 26, by + 6, 0.9);
  for (const [x, y] of [[-0.6, 0.55], [0.7, 0.5]]) { const [sx, sy] = P(x, y); tombstone(ctx, sx, sy, 1); }
}
export function treeLights(ctx) { const [x, y] = P(0, 0); xmasTree(ctx, x, y, 2.4); }
export function snowmanProp(ctx) { const [x, y] = P(0, 0); snowman(ctx, x, y, 2); }
export function giftPile(ctx, r) { const [x, y] = P(0, 0); gift(ctx, x - 9, y, 2, '#d6382f'); gift(ctx, x + 8, y + 1, 2, '#3f7fb5'); gift(ctx, x, y - 8, 1.6, '#58a37a'); }
export function easterBasket(ctx, r) {
  const [x, y] = P(0, 0);
  ctx.fillStyle = '#c9a063'; ctx.beginPath(); ctx.moveTo(x - 12, y - 8); ctx.lineTo(x + 12, y - 8); ctx.lineTo(x + 9, y); ctx.lineTo(x - 9, y); ctx.fill();
  ctx.strokeStyle = '#8a6a3a'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(x, y - 8, 11, Math.PI, 0); ctx.stroke();
  [['#f2b8c6', -7], ['#a9d6e8', -1], ['#f5e3a0', 5]].forEach(([c, dx]) => egg(ctx, x + dx, y - 5, 1.6, c));
}
export function fireworks(ctx, r) {
  const [x, y] = P(0, 0, 90);
  for (const [dx, dy, c, n] of [[0, 0, '#ff5a4a', 14], [-34, 20, '#ffd34a', 10], [32, 26, '#5ab4ff', 10]]) {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, R = n > 10 ? 26 : 17;
      ctx.strokeStyle = c; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x + dx + Math.cos(a) * R * 0.45, y + dy + Math.sin(a) * R * 0.45); ctx.lineTo(x + dx + Math.cos(a) * R, y + dy + Math.sin(a) * R); ctx.stroke();
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x + dx + Math.cos(a) * R * 1.12, y + dy + Math.sin(a) * R * 1.12, 1.4, 0, Math.PI * 2); ctx.fill();
    }
  }
  const [gx, gy] = P(0, 0); ctx.fillStyle = 'rgba(40,40,40,.15)'; ctx.beginPath(); ctx.ellipse(gx, gy, 12, 5, 0, 0, Math.PI * 2); ctx.fill();
}
export function valentineHeart(ctx) { const [x, y] = P(0, 0); heart(ctx, x, y - 22, 5); heart(ctx, x - 22, y - 38, 2.4, '#f2a0b4'); heart(ctx, x + 20, y - 44, 2, '#f2a0b4'); }
export function shamrockProp(ctx) { const [x, y] = P(0, 0); shamrock(ctx, x, y, 5); }
export function cornStalks(ctx, r) {
  shadow(ctx, 0.4, 0.4, 0.08);
  for (const [x, y] of [[-0.12, 0], [0.1, -0.05], [0.0, 0.12]]) {
    const [sx, sy] = P(x, y);
    ctx.strokeStyle = '#c9a63a'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx, sy - 32); ctx.stroke();
    ctx.fillStyle = '#d6b84a'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx, sy - 14); ctx.quadraticCurveTo(sx + k * 10, sy - 24, sx + k * 12, sy - 14); ctx.quadraticCurveTo(sx + k * 6, sy - 18, sx, sy - 10); ctx.fill(); }
    ctx.fillStyle = '#e8c85a'; ctx.fillRect(sx - 1.5, sy - 26, 3, 6);
  }
}

// ---------- the decorator ----------
const isBuilding = (a) => ['Homes', 'Downtown', 'Civic', 'Industry', 'Airport', 'Rail', 'Entertainment', 'Food', 'Services', 'Sports'].includes(a.cat);
const isTree = (a) => a.cat === 'Nature' && /tree|pine|spruce|aspen|cottonwood/i.test(a.name);

export function decorate(ctx, r, a, holiday) {
  if (!holiday) return;
  const flat = /field|court|pool|green|ski run|skate|campground|cemetery|dock|runway|taxiway|apron|track|crossing|platform|diamond/i.test(a.name);
  const bld = isBuilding(a) && !flat, tree = isTree(a);
  if (!bld && !tree) return;
  const fp = a.w >= 330 ? 0.9 : 0.42;
  const hgt = Math.max(30, (a.oy - 40) / (a.scale || 1.5));
  const front = (x) => [x, fp + 0.04, 3];
  const dr = r;
  const sc = (x, y, z = 0) => P(x, y, z);

  if (holiday === 'halloween') {
    if (bld) {
      lights(ctx, [-fp, fp + 0.03, 4], [fp, fp + 0.03, 4], ['#f6a03a', '#9a5ad6', '#f6a03a', '#7ad65a'], 10, 2);
      const [px, py] = sc(fp * 0.7, fp + 0.22); pumpkin(ctx, px, py, 1.1, true);
      const [qx, qy] = sc(fp * 0.45, fp + 0.26); pumpkin(ctx, qx, qy, 0.8);
      const [gx, gy] = sc(-fp * 0.8, fp + 0.2); if (dr.chance(0.7)) tombstone(ctx, gx, gy, 0.9);
      const [bx, by] = sc(0, 0, hgt); bat(ctx, bx - 16, by - 12, 0.9); if (dr.chance(0.6)) bat(ctx, bx + 24, by - 4, 0.7);
      if (dr.chance(0.5)) { const [ax, ay] = sc(-fp * 1.1, fp * 0.6); ghost(ctx, ax, ay - 6, 1); }
    } else if (tree) {
      const [x, y] = sc(0.1, 0.15); if (dr.chance(0.6)) pumpkin(ctx, x, y, 1);
      const [gx, gy] = sc(0.02, 0.05, 30); ghost(ctx, gx + 6, gy, 0.8);
    }
  } else if (holiday === 'christmas') {
    if (bld) {
      lights(ctx, [-fp, fp + 0.03, 4], [fp, fp + 0.03, 4], ['#e0506a', '#f0c22f', '#4f9ad6', '#58c27a'], 12, 2);
      lights(ctx, [fp + 0.03, -fp, 4], [fp + 0.03, fp, 4], ['#4f9ad6', '#e0506a', '#f0c22f', '#58c27a'], 12, 2);
      const [wx, wy] = sc(0, fp + 0.02, 12); wreath(ctx, wx, wy, 0.9);
      const [tx, ty] = sc(fp * 0.85, fp + 0.25); xmasTree(ctx, tx, ty, 0.8);
      const [gx, gy] = sc(fp * 0.55, fp + 0.3); gift(ctx, gx, gy, 0.8, '#d6382f');
    } else if (tree && /pine|spruce/i.test(a.name)) {
      const cols = ['#e0506a', '#f0c22f', '#4f9ad6', '#fbf5e4'];
      for (let i = 0; i < 14; i++) { const [x, y] = P(0, 0, 14 + dr() * 50); bulb(ctx, x + (dr() - 0.5) * (30 - (y > -30 ? 0 : 14)) * 0.6, y, cols[i % 4], 1.4); }
      const [sx, sy] = P(0, 0, 76); ctx.fillStyle = '#f0c22f'; ctx.beginPath(); for (let i = 0; i < 10; i++) { const an = (i / 10) * Math.PI * 2 - Math.PI / 2, R = i % 2 ? 1.8 : 4; ctx.lineTo(sx + Math.cos(an) * R, sy + Math.sin(an) * R); } ctx.fill();
    }
  } else if (holiday === 'thanksgiving') {
    if (bld) {
      const [px, py] = sc(fp * 0.7, fp + 0.22); pumpkin(ctx, px, py, 1.1);
      const [qx, qy] = sc(fp * 0.4, fp + 0.27); pumpkin(ctx, qx, qy, 0.8);
      const [hx, hy] = sc(-fp * 0.6, fp + 0.24); ctx.fillStyle = '#d9b44a'; ctx.beginPath(); ctx.roundRect(hx - 5, hy - 9, 10, 9, 2); ctx.fill(); ctx.fillStyle = '#b8942a'; ctx.fillRect(hx - 5, hy - 5, 10, 1.2);
      lights(ctx, [-fp, fp + 0.03, 4], [fp, fp + 0.03, 4], ['#e0a03a', '#c9622f', '#d9822b'], 8, 2);
    }
  } else if (holiday === 'valentines') {
    if (bld) {
      lights(ctx, [-fp, fp + 0.03, 4], [fp, fp + 0.03, 4], ['#e0506a', '#f2a0b4', '#fbf5e4'], 10, 2);
      const [bx, by] = sc(0, 0, hgt); heart(ctx, bx - 14, by - 10, 1.6); heart(ctx, bx + 16, by - 18, 1.2, '#f2a0b4'); heart(ctx, bx + 2, by - 26, 1, '#e0506a');
      const [wx, wy] = sc(0, fp + 0.02, 12); heart(ctx, wx, wy, 1.4);
    }
  } else if (holiday === 'easter') {
    if (bld) {
      const cols = ['#f2b8c6', '#a9d6e8', '#f5e3a0', '#c9b0e8', '#b8e0a8'];
      for (let i = 0; i < 6; i++) { const [x, y] = sc(-fp * 0.8 + i * fp * 0.3, fp + 0.2 + (i % 2) * 0.05); egg(ctx, x, y, 0.9, cols[i % 5]); }
      lights(ctx, [-fp, fp + 0.03, 4], [fp, fp + 0.03, 4], ['#f2b8c6', '#a9d6e8', '#f5e3a0'], 9, 2);
    }
  } else if (holiday === 'stpatricks') {
    if (bld) {
      lights(ctx, [-fp, fp + 0.03, 4], [fp, fp + 0.03, 4], ['#3f9a52', '#7ad65a', '#f0c22f'], 10, 2);
      const [a1, b1] = sc(fp * 0.6, fp + 0.2); shamrock(ctx, a1, b1, 1.2);
      const [a2, b2] = sc(-fp * 0.5, fp + 0.24); shamrock(ctx, a2, b2, 1);
      const [wx, wy] = sc(0, fp + 0.02, 14); shamrock(ctx, wx, wy, 1.2);
    }
  } else if (holiday === 'july4') {
    if (bld) {
      bunting(ctx, [-fp, fp + 0.03, 14], [fp, fp + 0.03, 14], 8);
      const [fx, fy] = sc(fp * 0.9, fp + 0.25); flag(ctx, fx, fy, 1);
    }
  }
}
