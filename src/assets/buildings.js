import { box, poly, face, win, door, gable, hip, parapet, parapetFront, frustum, cyl, cylBand, shadow, line, P } from '../iso.js';
import { tone, shade } from '../colors.js';
import { PAL } from '../palette.js';

export function cottage(ctx, r) {
  const wall = r.pick(PAL.wall), rt = tone(r.pick(PAL.roof));
  const x0 = -0.36, x1 = 0.36, y0 = -0.3, y1 = 0.3, H = 22;
  shadow(ctx, 1, 1);
  box(ctx, x0, y0, x1, y1, 0, H, wall);
  box(ctx, x0 - 0.01, y0 - 0.01, x1 + 0.01, y1 + 0.01, 0, 3, shade(wall, -0.12)); // foundation
  door(ctx, 'y', y1, -0.14, 0.16, 3, 15, r.pick(['#8a6240', '#5f7f8a', '#a8503c']));
  win(ctx, 'y', y1, 0.17, 0.2, 8, 11);
  win(ctx, 'x', x1, 0, 0.2, 8, 11);
  box(ctx, 0.12, -0.1, 0.22, -0.02, H + 4, H + 24, PAL.brick); // chimney sits behind the ridge
  gable(ctx, x0, y0, x1, y1, H, 16, rt, 0.06, 'x', tone(wall));
  win(ctx, 'x', x1 + 0.001, 0, 0.1, H + 2, 7, { cross: false });
}

export function house(ctx, r) {
  const wall = r.pick(PAL.wall), rt = tone(r.pick(PAL.roof));
  const x0 = -0.4, x1 = 0.4, y0 = -0.34, y1 = 0.34, H = 44;
  shadow(ctx, 1.1, 1.1);
  box(ctx, x0, y0, x1, y1, 0, H, wall);
  box(ctx, x0 - 0.01, y0 - 0.01, x1 + 0.01, y1 + 0.01, 0, 3, shade(wall, -0.12));
  face(ctx, 'y', y1 + 0.001, x0, x1, 21, 23, tone(shade(wall, -0.08))['left']);
  face(ctx, 'x', x1 + 0.001, y0, y1, 21, 23, tone(shade(wall, -0.08))['right']);
  door(ctx, 'y', y1, -0.2, 0.16, 3, 15);
  win(ctx, 'y', y1, 0.05, 0.18, 7, 11);
  win(ctx, 'y', y1, 0.28, 0.18, 7, 11);
  win(ctx, 'y', y1, -0.2, 0.18, 28, 11);
  win(ctx, 'y', y1, 0.05, 0.18, 28, 11);
  win(ctx, 'y', y1, 0.28, 0.18, 28, 11);
  win(ctx, 'x', x1, -0.15, 0.18, 7, 11);
  win(ctx, 'x', x1, 0.15, 0.18, 7, 11);
  win(ctx, 'x', x1, -0.15, 0.18, 28, 11);
  win(ctx, 'x', x1, 0.15, 0.18, 28, 11);
  hip(ctx, x0, y0, x1, y1, H, 20, rt, 0.07);
}

export function farmhouse(ctx, r) {
  const wall = r.pick(['#f1eee2', '#efdab2', '#dbe5d1']), rt = tone(r.pick(['#a3563b', '#6e8da3', '#5f8159']));
  const x0 = -0.46, x1 = 0.46, y0 = -0.3, y1 = 0.3, H = 28;
  shadow(ctx, 1.3, 1);
  box(ctx, x0, y0, x1, y1, 0, H, wall);
  box(ctx, x0 - 0.01, y0 - 0.01, x1 + 0.01, y1 + 0.01, 0, 3, PAL.stone);
  door(ctx, 'y', y1, -0.05, 0.16, 3, 17, '#5f7f8a');
  win(ctx, 'y', y1, -0.3, 0.18, 9, 12);
  win(ctx, 'y', y1, 0.22, 0.18, 9, 12);
  win(ctx, 'x', x1, -0.08, 0.18, 9, 12);
  box(ctx, -0.32, -0.12, -0.22, -0.04, H + 2, H + 26, PAL.brick);
  gable(ctx, x0, y0, x1, y1, H, 18, rt, 0.07, 'x', tone(wall));
  // porch
  box(ctx, -0.2, y1, 0.1, y1 + 0.18, 0, 1.5, PAL.wood);
  box(ctx, -0.19, y1 + 0.15, -0.16, y1 + 0.18, 1.5, 19, PAL.trim);
  box(ctx, 0.07, y1 + 0.15, 0.1, y1 + 0.18, 1.5, 19, PAL.trim);
  poly(ctx, [[-0.22, y1 - 0.01, 21], [0.12, y1 - 0.01, 21], [0.12, y1 + 0.22, 17], [-0.22, y1 + 0.22, 17]], rt.left);
}

export function barn(ctx, r) {
  const red = r.pick(['#b8473a', '#a8503c', '#9c4a3c']), roof = tone(r.pick(['#6d7076', '#7a6a5a', '#587a55']));
  const x0 = -0.55, x1 = 0.55, y0 = -0.42, y1 = 0.42, H = 26;
  const d = y1 - y0, ym = 0, kb = d * 0.2;
  shadow(ctx, 1.5, 1.2);
  box(ctx, x0, y0, x1, y1, 0, H, red);
  const wallR = tone(red);
  // gambrel gable end (right face) wall
  poly(ctx, [[x1, y0, H], [x1, y1, H], [x1, y1 - kb, H + 14], [x1, ym, H + 22], [x1, y0 + kb, H + 14]], wallR.right);
  // trim X doors on the gable end
  const trim = tone(PAL.trim).right;
  face(ctx, 'x', x1, -0.2, 0.2, 0, 19, trim);
  face(ctx, 'x', x1, -0.17, 0.17, 1.5, 17.5, wallR.right);
  line(ctx, [x1, -0.17, 1.5], [x1, 0.17, 17.5], trim, 1.6);
  line(ctx, [x1, 0.17, 1.5], [x1, -0.17, 17.5], trim, 1.6);
  face(ctx, 'x', x1, -0.07, 0.07, H + 2, H + 10, trim);
  face(ctx, 'x', x1, -0.05, 0.05, H + 3.5, H + 8.5, shade(PAL.dark, 0, 0));
  // long side
  face(ctx, 'y', y1, -0.5, -0.1, 0, 17, trim);
  face(ctx, 'y', y1, -0.47, -0.13, 1.5, 15.5, wallR.left);
  line(ctx, [-0.47, y1, 1.5], [-0.13, y1, 15.5], trim, 1.4);
  line(ctx, [-0.13, y1, 1.5], [-0.47, y1, 15.5], trim, 1.4);
  win(ctx, 'y', y1, 0.25, 0.14, 12, 9, { frame: PAL.trim });
  win(ctx, 'y', y1, 0.45, 0.14, 12, 9, { frame: PAL.trim });
  // gambrel roof, +y side: steep lower slope + shallow upper slope
  const o = 0.06;
  poly(ctx, [[x0 - o, y1 + o, H - 3], [x1 + o, y1 + o, H - 3], [x1 + o, y1 - kb, H + 14], [x0 - o, y1 - kb, H + 14]], roof.left);
  poly(ctx, [[x0 - o, y1 - kb, H + 14], [x1 + o, y1 - kb, H + 14], [x1 + o, ym, H + 22], [x0 - o, ym, H + 22]], roof.top);
  line(ctx, [x0 - o, ym, H + 22], [x1 + o, ym, H + 22], shade(PAL.stone, 0.1), 1.6);
  line(ctx, [x0 - o, y1 - kb, H + 14], [x1 + o, y1 - kb, H + 14], roof.right, 1);
}

export function silo(ctx, r) {
  const col = r.pick(['#d6d9d4', '#c9ced0', '#e4dfd0']);
  shadow(ctx, 0.9, 0.9);
  cyl(ctx, 0, 0, 0.26, 0, 58, col, 14);
  for (let z = 12; z < 58; z += 11) cylBand(ctx, 0, 0, 0.26, z, 'rgba(60,70,80,.22)', 1);
  const [sx, sy] = P(0, 0, 58);
  ctx.fillStyle = shade('#c9ced0', -0.2);
  ctx.fillRect(sx - 1, sy - 22, 2, 4);
}

export function shop(ctx, r) {
  const wall = r.pick(PAL.wall), awn = r.pick(['#c4604b', '#5f8f8a', '#d2a03a', '#6e8da3']);
  const x0 = -0.44, x1 = 0.44, y0 = -0.38, y1 = 0.38, H = 30;
  shadow(ctx, 1.1, 1.1);
  box(ctx, x0, y0, x1, y1, 0, H, wall);
  box(ctx, x0 - 0.01, y0 - 0.01, x1 + 0.01, y1 + 0.01, 0, 2, shade(wall, -0.12));
  // shopfront
  face(ctx, 'y', y1, -0.36, 0.2, 3, 19, tone(PAL.trim).left);
  face(ctx, 'y', y1, -0.34, 0.18, 4.5, 17.5, tone('#a9cfdc').left);
  door(ctx, 'y', y1, 0.3, 0.14, 2, 17, '#5f7f8a');
  win(ctx, 'x', x1, -0.12, 0.2, 10, 12);
  win(ctx, 'x', x1, 0.18, 0.2, 10, 12);
  // awning stripes
  const n = 8, xa = -0.4, xb = 0.24, sw = (xb - xa) / n, ay = y1 + 0.17;
  for (let i = 0; i < n; i++) {
    const a = xa + i * sw, b = a + sw;
    poly(ctx, [[a, y1, 25], [b, y1, 25], [b, ay, 19], [a, ay, 19]], i % 2 ? tone(awn).top : tone(awn).left);
    poly(ctx, [[a, ay, 19], [b, ay, 19], [b, ay, 16.5], [a, ay, 16.5]], i % 2 ? tone(awn).top : tone(awn).left);
  }
  // sign board
  box(ctx, -0.3, y1 + 0.005, 0.1, y1 + 0.04, 26, 30, '#5b4636');
  parapet(ctx, x0, y0, x1, y1, H, 3, 0.05, wall, tone(PAL.stone).left);
  box(ctx, -0.2, -0.22, -0.02, -0.06, H + 1, H + 8, '#b6bcc0'); // AC unit
  parapetFront(ctx, x0, y0, x1, y1, H, 3, 0.05, wall);
}

export function apartments(ctx, r) {
  const wall = r.pick(['#e8caa4', '#ead3c9', '#dbe5d1', '#efdab2']), floors = r.pick([3, 4, 5]);
  const x0 = -0.42, x1 = 0.42, y0 = -0.42, y1 = 0.42, fh = 20, H = floors * fh + 4;
  shadow(ctx, 1.2, 1.2);
  box(ctx, x0, y0, x1, y1, 0, H, wall);
  box(ctx, x0 - 0.01, y0 - 0.01, x1 + 0.01, y1 + 0.01, 0, 4, shade(wall, -0.14));
  for (let f = 0; f < floors; f++) {
    const z = 4 + f * fh + 5;
    for (const a of [-0.27, -0.09, 0.09, 0.27]) {
      if (f === 0 && a === -0.09) door(ctx, 'y', y1, a, 0.15, 4, 14, '#5f7f8a');
      else win(ctx, 'y', y1, a, 0.13, z, 11);
      win(ctx, 'x', x1, a, 0.13, z, 11);
    }
    if (f > 0) {
      face(ctx, 'y', y1 + 0.001, x0, x1, 4 + f * fh - 1, 4 + f * fh + 0.6, tone(shade(wall, -0.07)).left);
      face(ctx, 'x', x1 + 0.001, y0, y1, 4 + f * fh - 1, 4 + f * fh + 0.6, tone(shade(wall, -0.07)).right);
    }
  }
  parapet(ctx, x0, y0, x1, y1, H, 4, 0.05, wall, tone(PAL.stone).left);
  box(ctx, -0.3, -0.3, -0.08, -0.12, H + 1, H + 14, wall); // stair head
  box(ctx, 0.08, -0.28, 0.26, -0.1, H + 1, H + 8, '#b6bcc0');
  parapetFront(ctx, x0, y0, x1, y1, H, 4, 0.05, wall);
}

export function windmill(ctx, r) {
  const stone = r.pick(['#efe6d0', '#e8dcc0']), cap = tone(r.pick(['#7a4f3a', '#6e8da3', '#9a5a3d']));
  shadow(ctx, 1, 1);
  const t = tone(stone);
  frustum(ctx, 0, 0, 0.3, 0.2, 0, 52, t);
  door(ctx, 'y', 0.285, 0, 0.14, 0, 14);
  win(ctx, 'y', 0.25, 0, 0.1, 28, 9, { cross: false });
  hip(ctx, -0.2, -0.2, 0.2, 0.2, 52, 18, cap, 0.05);
  // blades on the left-facing plane
  const hub = 0.27, hz = 56, ang = r.range(0.1, 0.7);
  for (let i = 0; i < 4; i++) {
    const th = ang + (i * Math.PI) / 2, c = Math.cos(th), s = Math.sin(th);
    const bp = (u, v) => [(u * c - v * s) / 32, hub, hz + u * s + v * c];
    poly(ctx, [bp(4, -3.2), bp(40, -3.2), bp(40, 3.2), bp(4, 3.2)], '#f4ecd8');
    poly(ctx, [bp(8, -2), bp(38, -2), bp(38, 2), bp(8, 2)], 'rgba(120,95,70,.55)');
    line(ctx, bp(4, 0), bp(40, 0), '#8a6a4a', 1);
  }
  const [hx, hy] = P(0, hub, hz);
  ctx.beginPath(); ctx.arc(hx, hy, 3, 0, Math.PI * 2); ctx.fillStyle = '#6f5238'; ctx.fill();
}

export function waterTower(ctx, r) {
  shadow(ctx, 0.9, 0.9);
  const leg = tone('#8a7a66');
  for (const [lx, ly] of [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]]) {
    box(ctx, lx - 0.02, ly - 0.02, lx + 0.02, ly + 0.02, 0, 34, leg);
  }
  line(ctx, [-0.18, 0.18, 4], [0.18, 0.18, 30], '#7a6a56', 1.2);
  line(ctx, [0.18, 0.18, 4], [-0.18, 0.18, 30], '#7a6a56', 1.2);
  line(ctx, [0.18, -0.18, 4], [0.18, 0.18, 30], '#6a5a46', 1.2);
  line(ctx, [0.18, 0.18, 4], [0.18, -0.18, 30], '#6a5a46', 1.2);
  cyl(ctx, 0, 0, 0.27, 34, 60, r.pick(['#7fa5bd', '#a9c3b0', '#d9d4c4']), 14);
  cylBand(ctx, 0, 0, 0.27, 40, 'rgba(40,60,80,.25)');
  cylBand(ctx, 0, 0, 0.27, 54, 'rgba(40,60,80,.25)');
}
