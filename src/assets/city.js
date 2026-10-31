// Large and mid-size city buildings (Denver-flavoured: glass towers, art deco, brick warehouses, Victorians, a gold-domed capitol).
import { box, poly, face, win, door, gable, hip, parapet, parapetFront, frustum, cyl, cylBand, cone, shadow, line, P, curtain, windows, slab, diamond, blob } from '../iso.js';
import { tone, shade } from '../colors.js';
import { PAL } from '../palette.js';

const GLASS = [
  ['#7fb0c8', '#8cbdd2', '#74a6bf'],
  ['#6f9fb8', '#82b3c8', '#628fa8'],
  ['#8fb8b0', '#9cc6be', '#80aaa2'],
  ['#9aa8c8', '#a8b6d4', '#8896b8'],
];

const lawn = (ctx, x0, y0, x1, y1) => diamond(ctx, x0, y0, x1, y1, 0, '#b3cf8a');
const rooftopUnits = (ctx, r, z, xa, xb, ya, yb, n = 3) => {
  for (let i = 0; i < n; i++) {
    const x = r.range(xa, xb), y = r.range(ya, yb), s = r.range(0.05, 0.1);
    box(ctx, x - s, y - s, x + s, y + s, z, z + r.range(4, 8), '#b9c0c4');
  }
};

export function glassTower(ctx, r) {
  const g = r.pick(GLASS);
  shadow(ctx, 1.6, 1.6);
  box(ctx, -0.5, -0.5, 0.5, 0.5, 0, 9, '#d8d2c4');
  door(ctx, 'y', 0.5, 0, 0.2, 0, 7, '#4a5a66');
  slab(ctx, { x0: -0.4, x1: 0.4, y0: -0.4, y1: 0.4, z0: 9, z1: 120, facade: 'glass', glass: g, cols: 7, floorH: 11, wall: '#cfd8dc' });
  slab(ctx, { x0: -0.3, x1: 0.3, y0: -0.3, y1: 0.3, z0: 120, z1: 160, facade: 'glass', glass: g, cols: 5, floorH: 11, wall: '#cfd8dc' });
  slab(ctx, { x0: -0.2, x1: 0.2, y0: -0.2, y1: 0.2, z0: 160, z1: 184, facade: 'glass', glass: g, cols: 3, floorH: 11, wall: '#cfd8dc' });
  box(ctx, -0.012, -0.012, 0.012, 0.012, 184, 215, '#c9ced0');
}

export function officeTower(ctx, r) {
  const g = r.pick(GLASS);
  shadow(ctx, 1.3, 1);
  slab(ctx, { x0: -0.45, x1: 0.45, y0: -0.34, y1: 0.34, z0: 0, z1: 96, facade: 'glass', glass: g, cols: 6, floorH: 12, wall: '#d0d6d8', frame: '#cfd6d8' });
  box(ctx, -0.45, -0.34, 0.45, 0.34, 96, 99, '#b9c0c4');
  rooftopUnits(ctx, r, 99, -0.3, 0.3, -0.2, 0.2, 3);
}

export function artDecoTower(ctx, r) {
  const stone = r.pick(['#e2d6bc', '#d8cdb4', '#e8dcc0']);
  const crown = tone(r.pick(['#6fae97', '#7fb59f']));
  shadow(ctx, 1.4, 1.4);
  const tiers = [[0.44, 0, 70], [0.34, 70, 112], [0.24, 112, 142]];
  for (const [h, z0, z1] of tiers) {
    box(ctx, -h, -h, h, h, z0, z1, stone);
    windows(ctx, 'y', h, -h + 0.05, h - 0.05, z0 + 4, z1, { floorH: 14, cols: Math.round(h * 12), w: 0.06, h: 9, glass: '#6f98ac', frame: '#cbbf9f', pad: 3 });
    windows(ctx, 'x', h, -h + 0.05, h - 0.05, z0 + 4, z1, { floorH: 14, cols: Math.round(h * 12), w: 0.06, h: 9, glass: '#6f98ac', frame: '#cbbf9f', pad: 3 });
  }
  hip(ctx, -0.16, -0.16, 0.16, 0.16, 142, 34, crown, 0.04);
  box(ctx, -0.01, -0.01, 0.01, 0.01, 176, 200, '#b9c0c4');
}

export function officeMid(ctx, r) {
  const wall = r.pick(['#c9a98b', '#d9c9a8', '#b5694f', '#c9c4b8']);
  shadow(ctx, 1.1, 1);
  slab(ctx, { x0: -0.4, x1: 0.4, y0: -0.32, y1: 0.32, z0: 0, z1: 62, wall, facade: 'punched', cols: 5, floorH: 15, w: 0.12, h: 9, pad: 4 });
  parapet(ctx, -0.4, -0.32, 0.4, 0.32, 62, 3, 0.04, wall, tone('#b9b2a2').left);
  rooftopUnits(ctx, r, 63, -0.25, 0.2, -0.15, 0.15, 3);
  parapetFront(ctx, -0.4, -0.32, 0.4, 0.32, 62, 3, 0.04, wall);
}

export function apartmentTower(ctx, r) {
  const wall = r.pick(['#e8dcc0', '#dcd4c4', '#e6cfc0', '#d6dccb']);
  shadow(ctx, 1.2, 1.2);
  const x0 = -0.38, x1 = 0.38, y0 = -0.38, y1 = 0.38, fl = 6, fh = 16;
  box(ctx, x0, y0, x1, y1, 0, fl * fh + 4, wall);
  for (let f = 0; f < fl; f++) {
    const z = 4 + f * fh;
    for (const a of [-0.24, -0.08, 0.08, 0.24]) {
      win(ctx, 'y', y1, a, 0.12, z + 4, 9);
      win(ctx, 'x', x1, a, 0.12, z + 4, 9);
    }
    // balconies on the left face
    box(ctx, -0.34, y1, -0.14, y1 + 0.07, z, z + 1.5, '#cfc8b4');
    box(ctx, 0.14, y1, 0.34, y1 + 0.07, z, z + 1.5, '#cfc8b4');
    face(ctx, 'y', y1 + 0.07, -0.34, -0.14, z + 1.5, z + 5, tone('#8fb8cc').left);
    face(ctx, 'y', y1 + 0.07, 0.14, 0.34, z + 1.5, z + 5, tone('#8fb8cc').left);
  }
  box(ctx, -0.38, -0.38, 0.38, 0.38, fl * fh + 4, fl * fh + 7, shade(wall, -0.08));
  box(ctx, -0.2, -0.25, 0.0, -0.05, fl * fh + 7, fl * fh + 17, wall);
}

export function mansion(ctx, r) {
  const wall = r.pick(['#f1eee2', '#ecdcc0', '#d9cfc0']), rt = tone(r.pick(['#5a5f6a', '#6a4a3a', '#4f5f58']));
  const H = 46, y0 = -0.36, y1 = 0.36;
  lawn(ctx, -1.05, -0.8, 1.05, 0.8);
  shadow(ctx, 2.2, 1.4);
  // left wing
  box(ctx, -0.95, -0.28, -0.5, 0.28, 0, 36, wall);
  windows(ctx, 'y', 0.28, -0.92, -0.53, 0, 36, { floorH: 18, cols: 2, w: 0.1, h: 11, pad: 4 });
  hip(ctx, -0.95, -0.28, -0.5, 0.28, 36, 16, rt, 0.05);
  // center block
  box(ctx, -0.5, y0, 0.5, y1, 0, H, wall);
  windows(ctx, 'y', y1, -0.46, 0.46, 2, H, { floorH: 22, cols: 5, w: 0.1, h: 13, pad: 5 });
  hip(ctx, -0.5, y0, 0.5, y1, H, 22, rt, 0.06);
  // portico
  for (const cx of [-0.17, -0.06, 0.06, 0.17]) box(ctx, cx - 0.018, y1 + 0.1, cx + 0.018, y1 + 0.136, 2, 38, '#fbf5e4');
  door(ctx, 'y', y1, 0, 0.18, 2, 18, '#4a3a30');
  box(ctx, -0.24, y1, 0.24, y1 + 0.18, 0, 2, '#d8d2c4');
  gable(ctx, -0.24, y1, 0.24, y1 + 0.2, 38, 11, tone('#fbf5e4'), 0.02, 'x');
  // right wing (in front of center)
  box(ctx, 0.5, -0.28, 0.95, 0.28, 0, 36, wall);
  windows(ctx, 'y', 0.28, 0.53, 0.92, 0, 36, { floorH: 18, cols: 2, w: 0.1, h: 11, pad: 4 });
  windows(ctx, 'x', 0.95, -0.24, 0.24, 0, 36, { floorH: 18, cols: 2, w: 0.1, h: 11, pad: 4 });
  hip(ctx, 0.5, -0.28, 0.95, 0.28, 36, 16, rt, 0.05);
}

export function townhouses(ctx, r) {
  shadow(ctx, 1.6, 0.8);
  const cols = [r.pick(['#b5694f', '#a8503c']), r.pick(['#d9c9a8', '#e8caa4']), r.pick(['#6e8da3', '#7d8fa0']), r.pick(['#b5694f', '#8f5a45'])];
  const y0 = -0.3, y1 = 0.3;
  for (let i = 0; i < 4; i++) {
    const x0 = -0.62 + i * 0.31, x1 = x0 + 0.31, H = 40 + (i % 2) * 6;
    box(ctx, x0, y0, x1, y1, 0, H, cols[i]);
    box(ctx, x0, y0, x1, y1, H, H + 3, '#f1ead2');
    door(ctx, 'y', y1, x0 + 0.1, 0.1, 5, 15, r.pick(['#5f7f8a', '#a8503c', '#3b3a3f']));
    win(ctx, 'y', y1, x0 + 0.23, 0.1, 9, 12);
    win(ctx, 'y', y1, x0 + 0.1, 0.11, 27, 12);
    win(ctx, 'y', y1, x0 + 0.23, 0.1, 27, 12);
    box(ctx, x0 + 0.03, y1, x0 + 0.17, y1 + 0.09, 0, 5, '#cfc8b4');
  }
  windows(ctx, 'x', 0.62, -0.2, 0.2, 4, 40, { floorH: 20, cols: 2, w: 0.1, h: 11, pad: 3 });
}

export function victorian(ctx, r) {
  const wall = r.pick(['#a58cc0', '#7fb0a0', '#d9a0a8', '#e0c070']), trim = '#fbf5e4', rt = tone(r.pick(['#5f5a6a', '#6a4a3a']));
  shadow(ctx, 1, 1);
  box(ctx, -0.34, -0.3, 0.34, 0.3, 0, 40, wall);
  win(ctx, 'y', 0.3, -0.12, 0.14, 8, 15, { frame: trim });
  win(ctx, 'y', 0.3, 0.1, 0.14, 8, 15, { frame: trim });
  win(ctx, 'y', 0.3, -0.12, 0.14, 26, 11, { frame: trim });
  win(ctx, 'x', 0.34, -0.08, 0.14, 8, 15, { frame: trim });
  win(ctx, 'x', 0.34, 0.12, 0.14, 8, 15, { frame: trim });
  gable(ctx, -0.34, -0.3, 0.34, 0.3, 40, 26, rt, 0.05, 'y', tone(wall));
  // turret
  cyl(ctx, 0.3, 0.26, 0.11, 0, 48, wall);
  cone(ctx, 0.3, 0.26, 7.5, 48, 76, rt);
  // porch
  box(ctx, -0.34, 0.3, 0.12, 0.46, 0, 2, '#d8d2c4');
  for (const px of [-0.32, -0.12, 0.1]) box(ctx, px - 0.012, 0.44, px + 0.012, 0.464, 2, 20, trim);
  poly(ctx, [[-0.36, 0.3, 24], [0.14, 0.3, 24], [0.14, 0.48, 19], [-0.36, 0.48, 19]], rt.left);
  door(ctx, 'y', 0.3, -0.02, 0.14, 2, 17, '#6a4a3a');
}

export function bungalow(ctx, r) {
  const wall = r.pick(['#d9c9a8', '#c9a98b', '#a8c0a0', '#e8dcc0']), rt = tone(r.pick(['#6a5a4a', '#5f6a5a', '#7a4a3a']));
  shadow(ctx, 1, 0.9);
  box(ctx, -0.4, -0.26, 0.4, 0.26, 0, 16, wall);
  win(ctx, 'y', 0.26, 0.22, 0.16, 5, 8);
  win(ctx, 'y', 0.26, -0.26, 0.16, 5, 8);
  win(ctx, 'x', 0.4, 0, 0.16, 5, 8);
  gable(ctx, -0.4, -0.26, 0.4, 0.26, 16, 11, rt, 0.1, 'x', tone(wall));
  box(ctx, -0.14, 0.26, 0.14, 0.4, 0, 1.5, '#cfc8b4');
  for (const px of [-0.12, 0.12]) box(ctx, px - 0.014, 0.37, px + 0.014, 0.394, 1.5, 12, '#fbf5e4');
  poly(ctx, [[-0.18, 0.26, 14], [0.18, 0.26, 14], [0.18, 0.42, 11], [-0.18, 0.42, 11]], rt.left);
  door(ctx, 'y', 0.26, 0, 0.1, 1.5, 10, '#8a4a3a');
}

export function warehouse(ctx, r) {
  const wall = r.pick(['#c9c4b8', '#b5b8b0', '#b9a98b']);
  shadow(ctx, 2.2, 1.4);
  const x0 = -0.85, x1 = 0.85, y0 = -0.5, y1 = 0.5, H = 30;
  box(ctx, x0, y0, x1, y1, 0, H, wall);
  face(ctx, 'y', y1 + 0.001, x0, x1, H - 6, H - 1, tone(shade(wall, -0.1)).left);
  // roll-up dock doors on the long face
  for (let i = 0; i < 5; i++) {
    const a = -0.62 + i * 0.3;
    face(ctx, 'y', y1 + 0.002, a - 0.1, a + 0.1, 0, 18, tone('#8a8f94').left);
    for (let k = 3; k < 18; k += 3) face(ctx, 'y', y1 + 0.003, a - 0.1, a + 0.1, k, k + 0.8, tone('#6c7176').left);
    box(ctx, a - 0.12, y1, a + 0.12, y1 + 0.1, 0, 5, '#9a9488');
  }
  face(ctx, 'x', x1 + 0.001, y0, y1, 22, 27, tone('#5a7a8f').right);
  win(ctx, 'x', x1, -0.25, 0.14, 7, 9, { cross: false });
  win(ctx, 'x', x1, 0.25, 0.14, 7, 9, { cross: false });
  parapet(ctx, x0, y0, x1, y1, H, 3, 0.04, wall, tone('#aab0b2').left);
  rooftopUnits(ctx, r, H + 1, -0.6, 0.6, -0.3, 0.3, 4);
  parapetFront(ctx, x0, y0, x1, y1, H, 3, 0.04, wall);
}

export function factory(ctx, r) {
  const wall = r.pick(['#b5694f', '#a8503c', '#9c6a50']);
  shadow(ctx, 1.8, 1.2);
  // smokestacks (behind)
  for (const sx of [-0.55, -0.35]) {
    cyl(ctx, sx, -0.45, 0.07, 0, 96, '#b5694f');
    cylBand(ctx, sx, -0.45, 0.07, 88, '#f1ead2', 3);
    for (let i = 0; i < 3; i++) blob(ctx, sx + i * 0.05, -0.45 - i * 0.08, 104 + i * 11, 6 + i * 2.5, `rgba(250,250,250,${0.8 - i * 0.2})`);
  }
  const x0 = -0.7, x1 = 0.7, y0 = -0.4, y1 = 0.4, H = 34;
  box(ctx, x0, y0, x1, y1, 0, H, wall);
  windows(ctx, 'y', y1, x0 + 0.05, x1 - 0.05, 2, H, { floorH: 30, cols: 6, w: 0.12, h: 16, pad: 6, glass: '#7aa7be' });
  door(ctx, 'x', x1, 0.1, 0.22, 0, 20, '#6c7176');
  // sawtooth roof
  const n = 5, wd = (x1 - x0) / n, tl = tone('#7a8a8f'), gl = tone('#8fb8cc');
  for (let i = 0; i < n; i++) {
    const a = x0 + i * wd, b = a + wd;
    poly(ctx, [[a, y1, H], [b, y1, H], [b, y1, H + 12]], tl.left);
    poly(ctx, [[a, y0, H], [b, y0, H + 12], [b, y1, H + 12], [a, y1, H]], tl.top);
    poly(ctx, [[b, y0, H], [b, y1, H], [b, y1, H + 12], [b, y0, H + 12]], gl.right);
  }
}

export function church(ctx, r) {
  const wall = r.pick(['#f1eee2', '#d9d2c0', '#e8dcc0']), rt = tone(r.pick(['#5f6a78', '#6a4a3a']));
  shadow(ctx, 1.4, 1);
  box(ctx, -0.55, -0.26, 0.4, 0.26, 0, 30, wall);
  for (const a of [-0.4, -0.15, 0.1]) win(ctx, 'y', 0.26, a, 0.1, 8, 16, { glass: '#7a68b0', cross: false });
  gable(ctx, -0.55, -0.26, 0.4, 0.26, 30, 18, rt, 0.05, 'x', tone(wall));
  win(ctx, 'x', 0.4, 0, 0.12, 10, 18, { glass: '#7a68b0', cross: false });
  // steeple
  box(ctx, 0.12, 0.1, 0.46, 0.44, 0, 56, wall);
  win(ctx, 'y', 0.44, 0.29, 0.12, 36, 12, { glass: '#3b3a3f', cross: false });
  door(ctx, 'y', 0.44, 0.29, 0.16, 0, 20, '#6a4a3a');
  hip(ctx, 0.12, 0.1, 0.46, 0.44, 56, 44, rt, 0.03);
  box(ctx, 0.285, 0.265, 0.295, 0.275, 100, 114, '#fbf5e4');
  box(ctx, 0.27, 0.262, 0.31, 0.278, 108, 111, '#fbf5e4');
}

export function school(ctx, r) {
  const wall = '#b5694f';
  shadow(ctx, 2, 1.1);
  box(ctx, -0.85, -0.3, 0.85, 0.3, 0, 40, wall);
  windows(ctx, 'y', 0.3, -0.8, -0.2, 2, 40, { floorH: 19, cols: 3, w: 0.12, h: 11, pad: 4, frame: '#fbf5e4' });
  windows(ctx, 'y', 0.3, 0.2, 0.8, 2, 40, { floorH: 19, cols: 3, w: 0.12, h: 11, pad: 4, frame: '#fbf5e4' });
  windows(ctx, 'x', 0.85, -0.2, 0.2, 2, 40, { floorH: 19, cols: 2, w: 0.1, h: 11, pad: 4, frame: '#fbf5e4' });
  box(ctx, -0.85, -0.3, 0.85, 0.3, 40, 43, '#e8dcc0');
  box(ctx, -0.2, 0.3, 0.2, 0.42, 0, 46, '#d8c8a8');
  door(ctx, 'y', 0.42, 0, 0.2, 0, 18, '#4a3a30');
  gable(ctx, -0.2, 0.3, 0.2, 0.42, 46, 12, tone('#e8dcc0'), 0.02, 'x');
  box(ctx, -0.07, -0.07, 0.07, 0.07, 43, 62, '#e8dcc0');
  hip(ctx, -0.07, -0.07, 0.07, 0.07, 62, 12, tone('#6e8da3'), 0.02);
  box(ctx, 0.6, 0.45, 0.612, 0.462, 0, 70, '#c9ced0');
  poly(ctx, [[0.612, 0.45, 70], [0.612, 0.45, 60], [0.612, 0.58, 65]], '#d65a4a');
}

export function hospital(ctx, r) {
  shadow(ctx, 1.4, 1);
  slab(ctx, { x0: -0.6, x1: 0.1, y0: -0.34, y1: 0.34, z0: 0, z1: 90, wall: '#f1efe8', facade: 'punched', cols: 4, floorH: 15, w: 0.1, h: 9, pad: 4, glass: '#8fb8d8' });
  slab(ctx, { x0: 0.1, x1: 0.6, y0: -0.22, y1: 0.22, z0: 0, z1: 40, wall: '#f1efe8', facade: 'punched', cols: 3, floorH: 15, w: 0.1, h: 9, pad: 4, glass: '#8fb8d8' });
  // red cross
  face(ctx, 'y', 0.341, -0.4, -0.2, 70, 84, tone('#d65a4a').left);
  face(ctx, 'y', 0.342, -0.32, -0.28, 72, 82, tone('#fbf5e4').left);
  face(ctx, 'y', 0.342, -0.36, -0.24, 75, 79, tone('#fbf5e4').left);
  // helipad
  poly(ctx, [[-0.5, -0.24, 90.5], [-0.12, -0.24, 90.5], [-0.12, 0.2, 90.5], [-0.5, 0.2, 90.5]], '#8a9298');
  poly(ctx, [[-0.4, -0.14, 91], [-0.22, -0.14, 91], [-0.22, 0.1, 91], [-0.4, 0.1, 91]], '#f1ead2');
  door(ctx, 'y', 0.22, 0.35, 0.2, 0, 16, '#5f7f8a');
}

export function fireStation(ctx, r) {
  shadow(ctx, 1.3, 1);
  box(ctx, -0.6, -0.35, 0.4, 0.35, 0, 34, '#b5502f');
  for (const a of [-0.42, -0.12, 0.18]) {
    face(ctx, 'y', 0.351, a - 0.12, a + 0.12, 0, 22, tone('#fbf5e4').left);
    face(ctx, 'y', 0.352, a - 0.1, a + 0.1, 1.5, 21, tone('#d65a4a').left);
    for (let k = 5; k < 21; k += 4) face(ctx, 'y', 0.353, a - 0.1, a + 0.1, k, k + 0.8, tone('#a8402f').left);
  }
  win(ctx, 'x', 0.4, -0.1, 0.12, 12, 12);
  win(ctx, 'x', 0.4, 0.15, 0.12, 12, 12);
  box(ctx, -0.6, -0.35, 0.4, 0.35, 34, 37, '#e8dcc0');
  box(ctx, 0.4, -0.3, 0.64, -0.06, 0, 74, '#b5502f');
  box(ctx, 0.4, -0.3, 0.64, -0.06, 74, 77, '#e8dcc0');
  win(ctx, 'y', -0.06, 0.52, 0.1, 50, 12, { cross: false });
  face(ctx, 'y', 0.351, -0.5, 0.3, 26, 32, tone('#f1ead2').left);
}

export function policeStation(ctx, r) {
  shadow(ctx, 1.2, 1);
  slab(ctx, { x0: -0.5, x1: 0.5, y0: -0.34, y1: 0.34, z0: 0, z1: 44, wall: '#8a9bb0', facade: 'punched', cols: 5, floorH: 20, w: 0.1, h: 11, pad: 5, frame: '#e8eef4' });
  door(ctx, 'y', 0.34, 0, 0.2, 0, 17, '#2f3f5a');
  box(ctx, -0.5, -0.34, 0.5, 0.34, 44, 47, '#e8eef4');
  box(ctx, -0.06, 0.34, 0.06, 0.4, 20, 30, '#4f7fb5');
  box(ctx, 0.2, -0.2, 0.26, -0.14, 47, 57, '#4f7fb5');
  box(ctx, -0.6, 0.3, 0.6, 0.5, 0, 2, '#cfc8b4');
}

export function capitol(ctx, r) {
  const st = '#ece6d6';
  lawn(ctx, -1, -0.7, 1, 0.7);
  shadow(ctx, 2, 1.4);
  box(ctx, -0.8, -0.34, 0.8, 0.34, 0, 36, st);
  windows(ctx, 'y', 0.34, -0.76, -0.3, 2, 36, { floorH: 18, cols: 3, w: 0.1, h: 12, pad: 3, frame: '#fbf5e4' });
  windows(ctx, 'y', 0.34, 0.3, 0.76, 2, 36, { floorH: 18, cols: 3, w: 0.1, h: 12, pad: 3, frame: '#fbf5e4' });
  box(ctx, -0.8, -0.34, 0.8, 0.34, 36, 40, '#d8d2c0');
  for (const cx of [-0.22, -0.11, 0, 0.11, 0.22]) box(ctx, cx - 0.018, 0.4, cx + 0.018, 0.436, 2, 34, '#fbf5e4');
  box(ctx, -0.3, 0.34, 0.3, 0.46, 0, 2, '#d8d2c0');
  gable(ctx, -0.28, 0.34, 0.28, 0.46, 36, 12, tone(st), 0.02, 'x');
  cyl(ctx, 0, 0, 0.26, 40, 74, '#f1eee2');
  for (let i = -3; i <= 3; i++) {
    const [sx, sy] = P(0 + i * 0.065, 0.2, 0);
    ctx.fillStyle = 'rgba(80,80,90,.22)';
    ctx.fillRect(sx - 1.5, sy - 70, 3, 24);
  }
  cyl(ctx, 0, 0, 0.26, 74, 78, '#d8d2c0');
  cyl(ctx, 0, 0, 0.24, 78, 80, '#e0b84a', 30);
  cyl(ctx, 0, 0, 0.06, 104, 114, '#f0d27a', 8);
  box(ctx, -0.004, -0.004, 0.004, 0.004, 120, 138, '#e0b84a');
}

export function stadium(ctx, r) {
  const [cx, cy] = P(0, 0);
  const rx = 52, ry = 26;
  shadow(ctx, 2.3, 2.3, 0.14);
  const g = ctx.createLinearGradient(cx - rx, 0, cx + rx, 0);
  g.addColorStop(0, '#d8d2c4'); g.addColorStop(0.5, '#e8e2d4'); g.addColorStop(1, '#a8a496');
  const bowl = (z0, z1, k = 1) => {
    ctx.beginPath();
    ctx.moveTo(cx - rx * k, cy - z1);
    ctx.lineTo(cx - rx * k, cy - z0);
    ctx.ellipse(cx, cy - z0, rx * k, ry * k, 0, Math.PI, 0, true);
    ctx.lineTo(cx + rx * k, cy - z1);
    ctx.ellipse(cx, cy - z1, rx * k, ry * k, 0, 0, Math.PI, false);
    ctx.closePath();
    ctx.fillStyle = g;
    ctx.fill();
  };
  const ell = (k, z, fill) => { ctx.beginPath(); ctx.ellipse(cx, cy - z, rx * k, ry * k, 0, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); };
  // outer wall with rhythm of arches
  bowl(0, 36);
  for (let i = -5; i <= 5; i++) { ctx.fillStyle = 'rgba(90,90,100,.18)'; ctx.fillRect(cx + i * 9 - 1.5, cy + ry * Math.sqrt(Math.max(0, 1 - (i * 9) ** 2 / rx ** 2)) - 30, 3, 22); }
  ell(1, 36, '#a85a48');          // upper seats
  ell(0.82, 30, '#c4604b');
  ell(0.7, 22, '#4f7fb5');        // lower seats
  ell(0.56, 14, '#3f6f9f');
  ell(0.5, 10, '#8fbf6f');        // grass
  ctx.save();
  ctx.beginPath(); ctx.ellipse(cx, cy - 10, rx * 0.5, ry * 0.5, 0, 0, Math.PI * 2); ctx.clip();
  for (let i = -6; i < 6; i++) { ctx.fillStyle = i % 2 ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.06)'; ctx.fillRect(cx + i * 5, cy - 40, 5, 60); }
  ctx.restore();
  for (const [px, py] of [[-0.85, -0.85], [0.85, -0.85], [-0.85, 0.85], [0.85, 0.85]]) {
    box(ctx, px - 0.02, py - 0.02, px + 0.02, py + 0.02, 0, 70, '#b9c0c4');
    box(ctx, px - 0.07, py - 0.03, px + 0.07, py + 0.03, 70, 76, '#f1ead2');
  }
}

export function brewery(ctx, r) {
  shadow(ctx, 1.5, 1);
  for (const [tx, ty] of [[-0.35, -0.45], [-0.12, -0.45], [0.11, -0.45]]) {
    cyl(ctx, tx, ty, 0.09, 0, 60, '#cfd6da', 16);
    cylBand(ctx, tx, ty, 0.09, 40, 'rgba(60,70,80,.25)');
  }
  box(ctx, -0.55, -0.32, 0.55, 0.3, 0, 32, '#a8503c');
  windows(ctx, 'y', 0.3, -0.5, 0.5, 2, 32, { floorH: 30, cols: 4, w: 0.14, h: 20, pad: 4, frame: '#fbf5e4', glass: '#7a98a8' });
  windows(ctx, 'x', 0.55, -0.26, 0.26, 2, 32, { floorH: 30, cols: 2, w: 0.14, h: 20, pad: 4, frame: '#fbf5e4', glass: '#7a98a8' });
  box(ctx, -0.55, -0.32, 0.55, 0.3, 32, 35, '#8a4030');
  box(ctx, -0.3, 0.3, 0.3, 0.34, 36, 52, '#3b3a3f');
  const [sx, sy] = P(0, 0.34, 44);
  ctx.fillStyle = '#e8b84a'; ctx.beginPath(); ctx.roundRect(sx - 7, sy - 5, 12, 11, 2); ctx.fill();
  ctx.fillStyle = '#fbf5e4'; ctx.fillRect(sx - 7, sy - 5, 12, 4);
}

export function cafe(ctx, r) {
  const wall = r.pick(['#e8caa4', '#d9e4d0', '#f0e0c0']), awn = r.pick(['#c4604b', '#5f8f8a', '#d2a03a']);
  shadow(ctx, 1.1, 1);
  box(ctx, -0.35, -0.3, 0.2, 0.2, 0, 22, wall);
  face(ctx, 'y', 0.201, -0.3, 0.0, 3, 15, tone('#a9cfdc').left);
  door(ctx, 'y', 0.2, 0.1, 0.12, 0, 15, '#6a4a3a');
  for (let i = 0; i < 6; i++) {
    const a = -0.34 + i * 0.1;
    poly(ctx, [[a, 0.2, 19], [a + 0.1, 0.2, 19], [a + 0.1, 0.34, 14], [a, 0.34, 14]], i % 2 ? tone(awn).top : tone(awn).left);
  }
  parapet(ctx, -0.35, -0.3, 0.2, 0.2, 22, 2, 0.03, wall, tone('#b9b2a2').left);
  parapetFront(ctx, -0.35, -0.3, 0.2, 0.2, 22, 2, 0.03, wall);
  for (const [tx, ty] of [[0.38, 0.08], [0.38, 0.35], [0.1, 0.5]]) {
    box(ctx, tx - 0.008, ty - 0.008, tx + 0.008, ty + 0.008, 0, 11, '#8a7258');
    cone(ctx, tx, ty, 9, 11, 17, tone(r.pick(['#c4604b', '#d2a03a', '#5f8f8a'])));
    cyl(ctx, tx, ty, 0.06, 9, 10, '#f1ead2');
  }
}

export function gasStation(ctx, r) {
  shadow(ctx, 1.5, 1.2);
  box(ctx, -0.5, -0.32, -0.1, 0.0, 0, 16, '#f1efe8');
  face(ctx, 'y', 0.001, -0.46, -0.14, 2, 11, tone('#a9cfdc').left);
  box(ctx, -0.5, -0.32, -0.1, 0.0, 16, 18, '#d65a4a');
  for (const [px, py] of [[0.0, 0.1], [0.5, 0.1], [0.0, 0.5], [0.5, 0.5]]) box(ctx, px - 0.02, py - 0.02, px + 0.02, py + 0.02, 0, 24, '#e8e4d8');
  for (const px of [0.15, 0.35]) box(ctx, px - 0.03, 0.27, px + 0.03, 0.33, 0, 10, '#d65a4a');
  box(ctx, -0.04, 0.04, 0.54, 0.56, 24, 28, '#f1efe8');
  face(ctx, 'y', 0.561, -0.04, 0.54, 24, 28, tone('#d65a4a').left);
  box(ctx, -0.45, 0.4, -0.43, 0.42, 0, 44, '#b9c0c4');
  box(ctx, -0.55, 0.38, -0.33, 0.44, 44, 56, '#f1efe8');
  face(ctx, 'y', 0.441, -0.53, -0.35, 46, 54, tone('#d65a4a').left);
}

export function bigBox(ctx, r) {
  const mall = r.chance(0.5);
  const wall = r.pick(['#d9d4c4', '#c9d6d4', '#e8dcc0']), accent = r.pick(['#4f7fb5', '#d65a4a', '#58a37a']);
  shadow(ctx, 2.6, 1.6);
  const x0 = -1, x1 = 1, y0 = -0.6, y1 = 0.6, H = mall ? 40 : 28;
  box(ctx, x0, y0, x1, y1, 0, H, wall);
  face(ctx, 'y', y1 + 0.001, x0, x1, 0, 4, tone('#aab0b2').left);
  curtain(ctx, 'y', y1 + 0.001, -0.7, 0.2, 5, 18, { glass: ['#9cc3d6', '#a9cfdc'], cols: 7, floorH: 13 });
  door(ctx, 'y', y1, 0.45, 0.2, 0, 16, '#5f7f8a');
  face(ctx, 'y', y1 + 0.001, x0, x1, H - 8, H - 2, tone(accent).left);
  face(ctx, 'x', x1 + 0.001, y0, y1, H - 8, H - 2, tone(accent).right);
  if (mall) windows(ctx, 'y', y1, x0 + 0.1, x1 - 0.1, 20, H - 8, { floorH: 14, cols: 8, w: 0.1, h: 7, pad: 3 });
  box(ctx, -0.5, -0.4, -0.2, -0.2, H, H + 8, '#b9c0c4');
}

export function hotel(ctx, r) {
  const wall = r.pick(['#d9cfc0', '#c9c4b8', '#e0d4c0']);
  shadow(ctx, 1.2, 1.1);
  slab(ctx, { x0: -0.35, x1: 0.35, y0: -0.3, y1: 0.3, z0: 0, z1: 110, wall, facade: 'punched', cols: 5, floorH: 12, w: 0.1, h: 7, pad: 3, glass: '#7aa0b8' });
  box(ctx, -0.35, -0.3, 0.35, 0.3, 110, 114, '#8a8478');
  // canopy + entrance
  box(ctx, -0.2, 0.3, 0.2, 0.55, 18, 20, '#3b3a3f');
  for (const px of [-0.18, 0.18]) box(ctx, px - 0.012, 0.52, px + 0.012, 0.54, 0, 18, '#c9a95a');
  door(ctx, 'y', 0.3, 0, 0.2, 0, 16, '#4a3a30');
  box(ctx, -0.25, -0.1, 0.25, 0.04, 114, 128, '#b9372f');
}

export function unionStation(ctx, r) {
  const st = '#d8cdb0';
  shadow(ctx, 2.4, 1.3);
  box(ctx, -0.95, -0.3, 0.95, 0.3, 0, 40, st);
  windows(ctx, 'y', 0.3, -0.9, -0.2, 3, 40, { floorH: 36, cols: 5, w: 0.1, h: 24, pad: 6, frame: '#fbf5e4', cross: true });
  windows(ctx, 'y', 0.3, 0.2, 0.9, 3, 40, { floorH: 36, cols: 5, w: 0.1, h: 24, pad: 6, frame: '#fbf5e4', cross: true });
  box(ctx, -0.95, -0.3, 0.95, 0.3, 40, 44, '#b9ae92');
  box(ctx, -0.2, 0.3, 0.2, 0.36, 0, 58, '#e0d6bc');
  face(ctx, 'y', 0.361, -0.14, 0.14, 4, 34, tone('#6a8fa0').left);
  box(ctx, -0.14, -0.14, 0.14, 0.14, 58, 86, st);
  hip(ctx, -0.14, -0.14, 0.14, 0.14, 86, 20, tone('#6fae97'), 0.03);
  const [cx, cy] = P(0, 0.15, 72);
  ctx.beginPath(); ctx.arc(cx + 0.4, cy, 7, 0, Math.PI * 2); ctx.fillStyle = '#fbf5e4'; ctx.fill();
  ctx.strokeStyle = '#3b3a3f'; ctx.lineWidth = 1; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + 0.4, cy); ctx.lineTo(cx + 0.4, cy - 5); ctx.moveTo(cx + 0.4, cy); ctx.lineTo(cx + 4, cy); ctx.stroke();
  // platform canopies
  box(ctx, -0.95, 0.32, 0.95, 0.52, 14, 16, '#3b3a3f');
}

export function airportTerminal(ctx, r) {
  shadow(ctx, 2.4, 1.3);
  box(ctx, -0.95, -0.4, 0.95, 0.4, 0, 26, '#e8eef0');
  curtain(ctx, 'y', 0.4, -0.9, 0.9, 4, 24, { glass: ['#8fb8d8', '#9cc3e0'], frame: '#f1f4f6', cols: 14, floorH: 10 });
  curtain(ctx, 'x', 0.95, -0.35, 0.35, 4, 24, { glass: ['#8fb8d8', '#9cc3e0'], frame: '#f1f4f6', cols: 4, floorH: 10 });
  for (let i = 0; i < 5; i++) {
    const a = -0.95 + i * 0.4;
    gable(ctx, a, -0.4, a + 0.4, 0.4, 26, 8, tone('#f1f4f6'), 0.01, 'y');
  }
  for (const a of [-0.5, 0.1]) box(ctx, a, 0.4, a + 0.12, 0.8, 14, 20, '#b9c0c4'); // jet bridges
}

export function controlTower(ctx, r) {
  shadow(ctx, 0.9, 0.9);
  cyl(ctx, 0, 0, 0.1, 0, 78, '#e8e4d8');
  cylBand(ctx, 0, 0, 0.1, 30, 'rgba(0,0,0,.12)');
  cyl(ctx, 0, 0, 0.19, 78, 84, '#b9c0c4');
  cyl(ctx, 0, 0, 0.18, 84, 100, '#7fb0c8', 8);
  cyl(ctx, 0, 0, 0.21, 100, 103, '#d8d2c4');
  box(ctx, -0.006, -0.006, 0.006, 0.006, 103, 124, '#c9ced0');
}

export function hangar(ctx, r) {
  shadow(ctx, 2, 1.6);
  const x0 = -0.8, x1 = 0.8, y0 = -0.6, y1 = 0.6, H = 22, A = 26, n = 10;
  const t = tone(r.pick(['#c9ced0', '#b9c0c4']));
  box(ctx, x0, y0, x1, y1, 0, H, t.base);
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const th = Math.PI * (i / n);
    pts.push([y0 + (y1 - y0) * (0.5 - 0.5 * Math.cos(th)), H + A * Math.sin(th)]);
  }
  for (let i = 0; i < n; i++) {
    const [ya, za] = pts[i], [yb, zb] = pts[i + 1];
    const k = i / (n - 1);
    poly(ctx, [[x0, ya, za], [x1, ya, za], [x1, yb, zb], [x0, yb, zb]], k < 0.5 ? t.top : t.left);
  }
  poly(ctx, [[x1, y0, H], [x1, y1, H], ...pts.slice().reverse().map(([y, z]) => [x1, y, z])], t.right);
  face(ctx, 'x', x1 + 0.001, -0.5, 0.5, 0, 28, tone('#6c7176').right);
  for (let k = -0.4; k <= 0.41; k += 0.2) face(ctx, 'x', x1 + 0.002, k - 0.005, k + 0.005, 0, 28, tone('#555a5f').right);
}

export function parkingGarage(ctx, r) {
  shadow(ctx, 1.2, 1);
  const x0 = -0.5, x1 = 0.5, y0 = -0.4, y1 = 0.4, lv = 5, fh = 12;
  box(ctx, x0, y0, x1, y1, 0, lv * fh + 2, '#4a4f55');
  for (let i = 0; i < lv; i++) {
    const z = i * fh;
    face(ctx, 'y', y1 + 0.001, x0, x1, z, z + 4, tone('#c9c4b8').left);
    face(ctx, 'x', x1 + 0.001, y0, y1, z, z + 4, tone('#c9c4b8').right);
    for (let k = 0; k < 4; k++) {
      const a = x0 + 0.12 + k * 0.25;
      face(ctx, 'y', y1 + 0.001, a, a + 0.1, z + 4, z + 8, tone(r.pick(PAL.car)).left);
    }
    face(ctx, 'y', y1 + 0.001, x0, x1, z + 11, z + fh, tone('#c9c4b8').left);
  }
  for (let k = 0; k <= 4; k++) { const a = x0 + k * 0.25; face(ctx, 'y', y1 + 0.002, a - 0.012, a + 0.012, 0, lv * fh, tone('#d8d2c4').left); }
  box(ctx, x0, y0, x1, y1, lv * fh, lv * fh + 3, '#c9c4b8');
}
