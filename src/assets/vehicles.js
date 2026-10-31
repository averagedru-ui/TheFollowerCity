import { Rig, glassTone } from '../rig.js';
import { shadow } from '../iso.js';
import { tone, shade } from '../colors.js';
import { PAL } from '../palette.js';

const TIRE = '#2f3238', LAMP = '#ffe9a8', TAIL = '#c4423a';

export function wheels(rig, ls, W, R = 3.6) {
  for (const l of ls) for (const sd of [-1, 1]) rig.wheel(l, sd * (W + 0.004), R);
}

export function lamps(rig, L, W, z = 6) {
  for (const s of [-1, 1]) {
    rig.add(L - 0.004, L + 0.012, s * W * 0.55 - 0.025, s * W * 0.55 + 0.025, z, z + 2.2, LAMP, 'front');
    rig.add(-L - 0.012, -L + 0.004, s * W * 0.55 - 0.025, s * W * 0.55 + 0.025, z, z + 2.2, TAIL, 'rear');
  }
}

export function car(ctx, r, { dir = 0 } = {}) {
  const c = r.pick(PAL.car);
  const rig = new Rig(dir);
  wheels(rig, [-0.16, 0.16], 0.125, 3.8);
  rig.add(-0.27, 0.27, -0.125, 0.125, 3.5, 11, c);
  rig.add(-0.13, 0.11, -0.115, 0.115, 11, 17, glassTone(c));
  rig.add(-0.14, 0.12, -0.12, 0.12, 17, 18.2, c);
  lamps(rig, 0.27, 0.125);
  shadow(ctx, 0.9, 0.5, 0.18, 3, 2);
  rig.render(ctx);
}

export function pickup(ctx, r, { dir = 0 } = {}) {
  const c = r.pick(['#d65a4a', '#4f7fb5', '#58a37a', '#f1efe8', '#e58a3d']);
  const rig = new Rig(dir);
  wheels(rig, [-0.18, 0.18], 0.13, 4.2);
  rig.add(-0.3, 0.3, -0.13, 0.13, 4, 10, c);
  rig.add(0.0, 0.2, -0.12, 0.12, 10, 17, glassTone(c));
  rig.add(-0.01, 0.21, -0.125, 0.125, 17, 18.2, c);
  rig.add(-0.3, -0.02, -0.13, 0.13, 10, 12, c);
  rig.add(-0.28, -0.04, -0.11, 0.11, 11.5, 12.4, '#8a7258', 'body', 0.5);
  lamps(rig, 0.3, 0.13, 6.5);
  shadow(ctx, 1, 0.55, 0.18, 3, 2);
  rig.render(ctx);
}

export function van(ctx, r, { dir = 0 } = {}) {
  const c = r.pick(['#f1efe8', '#4f7fb5', '#e8c14a', '#d65a4a']);
  const rig = new Rig(dir);
  wheels(rig, [-0.19, 0.18], 0.13, 4.2);
  rig.add(-0.3, 0.3, -0.13, 0.13, 4, 22, c);
  rig.add(0.22, 0.3, -0.12, 0.12, 12, 20, glassTone(c));
  rig.add(0.05, 0.22, -0.131, 0.131, 13, 19, glassTone(c, '#7aa7be'), 'body', 1.2);
  rig.add(-0.3, 0.3, -0.13, 0.13, 22, 23, c);
  lamps(rig, 0.3, 0.13, 6.5);
  shadow(ctx, 1, 0.55, 0.18, 3, 2);
  rig.render(ctx);
}

export function bus(ctx, r, { dir = 0 } = {}) {
  const c = r.pick(['#e8c14a', '#d65a4a', '#58a37a', '#4f7fb5']);
  const rig = new Rig(dir);
  wheels(rig, [-0.34, 0.3], 0.14, 4.6);
  rig.add(-0.5, 0.5, -0.14, 0.14, 4, 11, c);
  rig.add(-0.49, 0.49, -0.135, 0.135, 11, 20, glassTone(c, '#7aa7be'));
  rig.add(-0.5, 0.5, -0.14, 0.14, 20, 21.5, '#f1efe8');
  lamps(rig, 0.5, 0.14, 6);
  shadow(ctx, 1.6, 0.6, 0.18, 3, 2);
  rig.render(ctx);
}

export function truck(ctx, r, { dir = 0 } = {}) {
  const c = r.pick(['#4f7fb5', '#d65a4a', '#58a37a', '#e58a3d']);
  const rig = new Rig(dir);
  wheels(rig, [-0.36, -0.2, 0.34], 0.14, 4.6);
  rig.add(-0.5, 0.2, -0.14, 0.14, 5, 12, '#d8d4c8');
  rig.add(-0.5, 0.2, -0.14, 0.14, 12, 28, '#e8e4d8');
  rig.add(0.22, 0.48, -0.13, 0.13, 5, 15, c);
  rig.add(0.34, 0.48, -0.125, 0.125, 15, 23, glassTone(c));
  rig.add(0.32, 0.49, -0.13, 0.13, 23, 24.2, c);
  rig.add(0.2, 0.22, -0.13, 0.13, 5, 12, '#444');
  lamps(rig, 0.48, 0.13, 7);
  shadow(ctx, 1.6, 0.6, 0.18, 3, 2);
  rig.render(ctx);
}

export function tractor(ctx, r, { dir = 0 } = {}) {
  const c = r.pick(['#5a9a52', '#d65a4a', '#4f7fb5']);
  const rig = new Rig(dir);
  for (const sd of [-1, 1]) {
    rig.wheel(-0.12, sd * 0.1, 8.5);
    rig.wheel(0.17, sd * 0.1, 5);
  }
  rig.add(-0.18, 0.26, -0.085, 0.085, 6, 14, c);
  rig.add(0.08, 0.26, -0.08, 0.08, 14, 18, c);
  rig.add(-0.17, 0.0, -0.1, 0.1, 14, 24, glassTone('#e8dcc0'));
  rig.add(-0.18, 0.01, -0.105, 0.105, 24, 25.2, '#e8dcc0');
  rig.add(0.2, 0.26, -0.07, 0.07, 12, 16, '#444');
  shadow(ctx, 0.9, 0.6, 0.18, 3, 2);
  rig.render(ctx);
}

// mid-size animals reuse the rig
export function cow(ctx, r, { dir = 0, frame = 0 } = {}) {
  const black = r.chance(0.5);
  const spot = black ? '#2f2f33' : '#9a6542';
  const rig = new Rig(dir);
  const sw = frame === 1 ? 0.025 : frame === 2 ? -0.025 : 0;
  for (const [l, s, sg] of [[-0.12, -1, 1], [-0.12, 1, -1], [0.1, -1, -1], [0.1, 1, 1]]) {
    rig.add(l - 0.025 + sw * sg, l + 0.025 + sw * sg, s * 0.05 - 0.02, s * 0.05 + 0.02, 0, 7, '#d8d2c6', 'leg');
  }
  rig.add(-0.18, 0.15, -0.075, 0.075, 6, 15, '#f1eee6');
  rig.add(-0.05, 0.05, -0.077, 0.077, 7, 14.5, spot, 'body', 0.5);
  rig.add(0.11, 0.21, -0.055, 0.055, 9, 17, '#f1eee6', 'body', 0.2);
  rig.add(0.19, 0.225, -0.04, 0.04, 9.5, 12.5, '#e8a8a0', 'body', 0.4);
  rig.add(0.12, 0.16, -0.062, 0.062, 15.5, 17, spot, 'body', 0.6);
  shadow(ctx, 0.8, 0.4, 0.16, 2, 2);
  rig.render(ctx);
}

export function sheep(ctx, r, { dir = 0, frame = 0 } = {}) {
  const rig = new Rig(dir);
  const sw = frame === 1 ? 0.02 : frame === 2 ? -0.02 : 0;
  for (const [l, s, sg] of [[-0.07, -1, 1], [-0.07, 1, -1], [0.07, -1, -1], [0.07, 1, 1]]) {
    rig.add(l - 0.015 + sw * sg, l + 0.015 + sw * sg, s * 0.04 - 0.012, s * 0.04 + 0.012, 0, 5, '#4a4a4f', 'leg');
  }
  rig.add(-0.13, 0.11, -0.075, 0.075, 4, 12, '#f4f1ea');
  rig.add(-0.11, 0.09, -0.08, 0.08, 6, 12.5, '#fbf9f3', 'body', 0.4);
  rig.add(0.1, 0.17, -0.04, 0.04, 6, 12, '#4a4a4f', 'body', 0.2);
  shadow(ctx, 0.6, 0.35, 0.16, 2, 2);
  rig.render(ctx);
}
