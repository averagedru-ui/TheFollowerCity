// Extra road vehicles, rail, aircraft and warehouse machinery. All headings via Rig (dir 0..3).
import { Rig, glassTone } from '../rig.js';
import { shadow } from '../iso.js';
import { tone } from '../colors.js';
import { PAL } from '../palette.js';
import { wheels, lamps } from './vehicles.js';

const WHITE = '#f1efe8', DARK = '#2f3238';

export function sportsCar(ctx, r, { dir = 0 } = {}) {
  const c = r.pick(['#d6382f', '#e8c14a', '#2f6fb5', '#f08a2a', '#3a3f48', '#4fb08a']);
  const rig = new Rig(dir);
  wheels(rig, [-0.17, 0.18], 0.13, 3.6);
  rig.add(-0.3, 0.3, -0.135, 0.135, 3, 8.5, c);
  rig.add(0.12, 0.3, -0.12, 0.12, 8.5, 9.8, c);
  rig.add(-0.12, 0.1, -0.11, 0.11, 8.5, 13.5, glassTone(c, '#5f8fa8'));
  rig.add(-0.13, 0.11, -0.115, 0.115, 13.5, 14.4, c);
  rig.add(-0.3, -0.24, -0.12, 0.12, 9, 11, DARK);
  lamps(rig, 0.3, 0.135, 5.2);
  shadow(ctx, 0.9, 0.5, 0.18, 3, 2);
  rig.render(ctx);
}

export function taxi(ctx, r, { dir = 0 } = {}) {
  const rig = new Rig(dir);
  wheels(rig, [-0.16, 0.16], 0.125, 3.8);
  rig.add(-0.27, 0.27, -0.125, 0.125, 3.5, 11, '#f0c22f');
  rig.add(-0.13, 0.11, -0.115, 0.115, 11, 17, glassTone('#f0c22f'));
  rig.add(-0.14, 0.12, -0.12, 0.12, 17, 18.2, '#f0c22f');
  rig.add(-0.04, 0.04, -0.04, 0.04, 18.2, 21, '#fbf5e4');
  lamps(rig, 0.27, 0.125);
  shadow(ctx, 0.9, 0.5, 0.18, 3, 2);
  rig.render(ctx);
}

export function policeCar(ctx, r, { dir = 0 } = {}) {
  const rig = new Rig(dir);
  wheels(rig, [-0.16, 0.16], 0.125, 3.8);
  rig.add(-0.27, 0.27, -0.125, 0.125, 3.5, 11, WHITE);
  rig.add(-0.27, 0.27, -0.127, 0.127, 3.5, 7, '#2f4f78', 'body', 0.3);
  rig.add(-0.13, 0.11, -0.115, 0.115, 11, 17, glassTone(WHITE));
  rig.add(-0.14, 0.12, -0.12, 0.12, 17, 18.2, '#2f4f78');
  rig.add(-0.05, 0.0, -0.1, -0.01, 18.2, 20.5, '#d6382f');
  rig.add(-0.05, 0.0, 0.01, 0.1, 18.2, 20.5, '#3f7fd6');
  lamps(rig, 0.27, 0.125);
  shadow(ctx, 0.9, 0.5, 0.18, 3, 2);
  rig.render(ctx);
}

export function ambulance(ctx, r, { dir = 0 } = {}) {
  const rig = new Rig(dir);
  wheels(rig, [-0.19, 0.18], 0.13, 4.2);
  rig.add(-0.32, 0.3, -0.13, 0.13, 4, 22, WHITE);
  rig.add(-0.32, 0.3, -0.132, 0.132, 9, 12, '#d6382f', 'body', 0.3);
  rig.add(0.22, 0.3, -0.12, 0.12, 12, 20, glassTone(WHITE));
  rig.add(-0.32, 0.3, -0.13, 0.13, 22, 23, WHITE);
  rig.add(0.12, 0.2, -0.1, -0.01, 23, 25, '#d6382f');
  rig.add(0.12, 0.2, 0.01, 0.1, 23, 25, '#3f7fd6');
  lamps(rig, 0.3, 0.13, 6.5);
  shadow(ctx, 1, 0.55, 0.18, 3, 2);
  rig.render(ctx);
}

export function fireTruck(ctx, r, { dir = 0 } = {}) {
  const red = '#d6382f';
  const rig = new Rig(dir);
  wheels(rig, [-0.36, -0.14, 0.34], 0.14, 4.6);
  rig.add(-0.5, 0.18, -0.14, 0.14, 5, 20, red);
  rig.add(-0.5, 0.18, -0.142, 0.142, 10, 11.5, '#f1ead2', 'body', 0.3);
  rig.add(0.2, 0.48, -0.13, 0.13, 5, 16, red);
  rig.add(0.32, 0.48, -0.125, 0.125, 16, 25, glassTone(red));
  rig.add(0.3, 0.49, -0.13, 0.13, 25, 26.2, red);
  rig.add(-0.45, 0.14, -0.04, 0.04, 20, 22, '#c9ced0');
  rig.add(-0.45, 0.14, -0.1, -0.07, 20, 24, '#c9ced0');
  rig.add(-0.45, 0.14, 0.07, 0.1, 20, 24, '#c9ced0');
  rig.add(0.34, 0.42, -0.1, 0.1, 26.2, 28.5, '#f0c22f');
  lamps(rig, 0.48, 0.13, 7);
  shadow(ctx, 1.6, 0.6, 0.18, 3, 2);
  rig.render(ctx);
}

export function garbageTruck(ctx, r, { dir = 0 } = {}) {
  const c = r.pick(['#4f9a58', '#3f7fb5']);
  const rig = new Rig(dir);
  wheels(rig, [-0.3, 0.3], 0.14, 4.6);
  rig.add(-0.5, 0.16, -0.14, 0.14, 5, 26, c);
  rig.add(-0.5, -0.46, -0.14, 0.14, 26, 28, c);
  rig.add(-0.5, 0.16, -0.143, 0.143, 5, 8, '#555a5f', 'body', 0.3);
  rig.add(0.18, 0.46, -0.13, 0.13, 5, 15, WHITE);
  rig.add(0.3, 0.46, -0.125, 0.125, 15, 24, glassTone(WHITE));
  rig.add(0.28, 0.47, -0.13, 0.13, 24, 25.2, WHITE);
  lamps(rig, 0.46, 0.13, 7);
  shadow(ctx, 1.5, 0.6, 0.18, 3, 2);
  rig.render(ctx);
}

export function semiTruck(ctx, r, { dir = 0 } = {}) {
  const c = r.pick(['#d6382f', '#3f7fb5', '#2f3a48', '#e58a3d']);
  const rig = new Rig(dir);
  wheels(rig, [0.48, 0.28, -0.46, -0.64], 0.14, 4.4);
  rig.add(0.2, 0.62, -0.13, 0.13, 5, 18, c);
  rig.add(0.36, 0.62, -0.125, 0.125, 18, 30, glassTone(c));
  rig.add(0.34, 0.63, -0.13, 0.13, 30, 31.4, c);
  rig.add(0.38, 0.4, -0.04, 0.04, 31.4, 38, '#c9ced0');
  rig.add(-0.8, 0.2, -0.14, 0.14, 7, 32, WHITE);
  rig.add(-0.8, 0.2, -0.143, 0.143, 14, 17, c, 'body', 0.3);
  rig.add(-0.8, 0.2, -0.14, 0.14, 32, 33, '#d8d4c8');
  lamps(rig, 0.62, 0.13, 8);
  shadow(ctx, 2.2, 0.7, 0.18, 3, 2);
  rig.render(ctx);
}

export function forklift(ctx, r, { dir = 0 } = {}) {
  const c = r.pick(['#f0b429', '#e8892f']);
  const rig = new Rig(dir);
  rig.wheel(0.06, 0.075, 3.4);
  rig.wheel(0.06, -0.075, 3.4);
  rig.wheel(-0.1, 0.07, 2.6);
  rig.wheel(-0.1, -0.07, 2.6);
  rig.add(-0.16, 0.12, -0.075, 0.075, 3.5, 10, c);
  rig.add(-0.18, -0.1, -0.08, 0.08, 8, 12, '#3b3a3f');
  for (const [l, w] of [[-0.1, -0.06], [-0.1, 0.06], [0.06, -0.06], [0.06, 0.06]]) rig.add(l - 0.007, l + 0.007, w - 0.007, w + 0.007, 10, 24, '#2f3238');
  rig.add(-0.12, 0.08, -0.07, 0.07, 24, 25, '#2f3238');
  rig.add(0.1, 0.13, -0.05, 0.05, 3, 28, '#8a9298');
  rig.add(0.14, 0.28, -0.045, -0.02, 1, 2.2, '#8a9298');
  rig.add(0.14, 0.28, 0.02, 0.045, 1, 2.2, '#8a9298');
  shadow(ctx, 0.7, 0.4, 0.16, 2, 2);
  rig.render(ctx);
}

export function motorbike(ctx, r, { dir = 0 } = {}) {
  const c = r.pick(PAL.car);
  const rig = new Rig(dir);
  rig.wheel(0.14, 0.012, 3.6);
  rig.wheel(0.14, -0.012, 3.6);
  rig.wheel(-0.14, 0.012, 3.6);
  rig.wheel(-0.14, -0.012, 3.6);
  rig.add(-0.16, 0.14, -0.025, 0.025, 4, 9, c);
  rig.add(-0.12, 0.04, -0.03, 0.03, 9, 11, '#3b3a3f');
  rig.add(0.1, 0.14, -0.06, 0.06, 11, 12, '#3b3a3f');
  shadow(ctx, 0.6, 0.3, 0.16, 2, 2);
  rig.render(ctx);
}

// ---------- rail ----------
function bogies(rig, ls, W = 0.1) {
  for (const l of ls) for (const sd of [-1, 1]) rig.wheel(l, sd * (W + 0.015), 3.4);
}

export function locomotive(ctx, r, { dir = 0 } = {}) {
  const c = r.pick(['#d6382f', '#f0b429', '#3f7fb5', '#4f9a58']);
  const rig = new Rig(dir);
  bogies(rig, [-0.36, -0.2, 0.2, 0.36], 0.11);
  rig.add(-0.5, 0.5, -0.12, 0.12, 5, 7, DARK);
  rig.add(-0.5, 0.5, -0.125, 0.125, 7, 17, c);
  rig.add(0.24, 0.5, -0.12, 0.12, 17, 20, c);
  rig.add(-0.5, -0.1, -0.12, 0.12, 17, 24, c);
  rig.add(-0.5, -0.12, -0.115, 0.115, 24, 30, glassTone(c));
  rig.add(-0.51, -0.1, -0.12, 0.12, 30, 31, DARK);
  rig.add(-0.06, 0.18, -0.07, 0.07, 20, 25, '#3b3a3f');
  rig.add(0.5, 0.52, -0.1, 0.1, 8, 15, '#ffe9a8', 'front');
  rig.add(-0.52, -0.5, -0.1, 0.1, 8, 15, '#c4423a', 'rear');
  shadow(ctx, 1.6, 0.5, 0.18, 3, 2);
  rig.render(ctx);
}

export function boxcar(ctx, r, { dir = 0 } = {}) {
  const c = r.pick(['#a8503c', '#7a5a3a', '#5f7f8a', '#8a4030']);
  const rig = new Rig(dir);
  bogies(rig, [-0.34, -0.2, 0.2, 0.34], 0.11);
  rig.add(-0.5, 0.5, -0.12, 0.12, 5, 7, DARK);
  rig.add(-0.5, 0.5, -0.125, 0.125, 7, 25, c);
  rig.add(-0.12, 0.12, -0.128, 0.128, 8, 23, '#6a4030', 'body', 0.3);
  rig.add(-0.5, 0.5, -0.127, 0.127, 25, 26, '#d8d4c8');
  shadow(ctx, 1.6, 0.5, 0.18, 3, 2);
  rig.render(ctx);
}

export function tankCar(ctx, r, { dir = 0 } = {}) {
  const rig = new Rig(dir);
  bogies(rig, [-0.34, -0.2, 0.2, 0.34], 0.11);
  rig.add(-0.5, 0.5, -0.12, 0.12, 5, 7, DARK);
  rig.add(-0.48, 0.48, -0.1, 0.1, 7, 24, '#c9ced0');
  rig.add(-0.48, 0.48, -0.115, 0.115, 11, 20, '#c9ced0');
  rig.add(-0.5, 0.5, -0.12, 0.12, 14, 17, '#e8e4d8', 'body', 0.3);
  rig.add(-0.04, 0.04, -0.05, 0.05, 24, 27, '#8a9298');
  shadow(ctx, 1.6, 0.5, 0.18, 3, 2);
  rig.render(ctx);
}

export function containerCar(ctx, r, { dir = 0 } = {}) {
  const rig = new Rig(dir);
  bogies(rig, [-0.34, -0.2, 0.2, 0.34], 0.11);
  rig.add(-0.5, 0.5, -0.12, 0.12, 5, 8, DARK);
  rig.add(-0.48, -0.02, -0.11, 0.11, 8, 24, r.pick(['#d6382f', '#3f7fb5', '#e8c14a', '#4f9a58']));
  rig.add(0.02, 0.48, -0.11, 0.11, 8, 24, r.pick(['#e58a3d', '#8a6fb0', '#f1efe8', '#3f7fb5']));
  shadow(ctx, 1.6, 0.5, 0.18, 3, 2);
  rig.render(ctx);
}

export function passengerCar(ctx, r, { dir = 0 } = {}) {
  const c = r.pick(['#c9ced0', '#e8e4d8']);
  const rig = new Rig(dir);
  bogies(rig, [-0.34, -0.2, 0.2, 0.34], 0.11);
  rig.add(-0.5, 0.5, -0.12, 0.12, 5, 7, DARK);
  rig.add(-0.5, 0.5, -0.125, 0.125, 7, 14, c);
  rig.add(-0.49, 0.49, -0.12, 0.12, 14, 24, glassTone(c, '#6f98ac'));
  rig.add(-0.5, 0.5, -0.125, 0.125, 24, 26, '#8a9298');
  rig.add(-0.5, 0.5, -0.127, 0.127, 10, 12, '#d6382f', 'body', 0.3);
  shadow(ctx, 1.6, 0.5, 0.18, 3, 2);
  rig.render(ctx);
}

export function lightRail(ctx, r, { dir = 0 } = {}) {
  const rig = new Rig(dir);
  bogies(rig, [-0.6, -0.4, 0.4, 0.6], 0.11);
  rig.add(-0.8, 0.8, -0.125, 0.125, 5, 9, '#e8eef0');
  rig.add(-0.8, 0.8, -0.128, 0.128, 9, 12, '#3f7fb5', 'body', 0.3);
  rig.add(-0.79, 0.79, -0.12, 0.12, 12, 22, glassTone('#e8eef0', '#5f8fa8'));
  rig.add(-0.8, 0.8, -0.125, 0.125, 22, 25, '#e8eef0');
  rig.add(-0.8, 0.8, -0.128, 0.128, 22, 24, '#58a37a', 'body', 0.3);
  rig.add(0.8, 0.83, -0.1, 0.1, 6, 16, '#d8dce0', 'front');
  rig.add(-0.18, 0.18, -0.07, 0.07, 25, 26, '#3b3a3f');
  rig.add(-0.01, 0.01, -0.07, 0.07, 26, 30, '#3b3a3f');
  shadow(ctx, 2.4, 0.5, 0.18, 3, 2);
  rig.render(ctx);
}

// ---------- aircraft ----------
export function propPlane(ctx, r, { dir = 0 } = {}) {
  const c = r.pick(['#d6382f', '#3f7fb5', '#e8c14a']);
  const rig = new Rig(dir);
  rig.add(-0.26, 0.18, -0.06, 0.06, 8, 17, WHITE);
  rig.add(-0.44, -0.26, -0.035, 0.035, 11, 16, WHITE);
  rig.add(0.18, 0.27, -0.055, 0.055, 9, 16, c);
  rig.add(-0.02, 0.1, -0.055, 0.055, 17, 21, glassTone(WHITE, '#5f8fa8'));
  rig.add(-0.03, 0.1, -0.5, 0.5, 10, 11.6, '#dfe4e8');
  rig.add(-0.03, 0.1, -0.5, -0.4, 10, 11.7, c);
  rig.add(-0.03, 0.1, 0.4, 0.5, 10, 11.7, c);
  rig.add(-0.44, -0.3, -0.014, 0.014, 14, 31, c);
  rig.add(-0.44, -0.33, -0.2, 0.2, 12, 13.6, '#dfe4e8');
  rig.add(0.27, 0.285, -0.12, 0.12, 9, 15, DARK);
  rig.add(0.045, 0.065, -0.058, -0.045, 2, 9, DARK);
  rig.add(0.045, 0.065, 0.045, 0.058, 2, 9, DARK);
  rig.wheel(0.055, 0.062, 2.8);
  rig.wheel(0.055, -0.062, 2.8);
  shadow(ctx, 1.2, 1.2, 0.16, 3, 2);
  rig.render(ctx);
}

export function airliner(ctx, r, { dir = 0 } = {}) {
  const stripe = r.pick(['#3f7fb5', '#d6382f', '#4f9a58', '#e58a3d']);
  const rig = new Rig(dir);
  rig.add(-0.9, 0.7, -0.1, 0.1, 10, 26, WHITE);
  rig.add(0.7, 0.95, -0.075, 0.075, 12, 22, WHITE);
  rig.add(-1.08, -0.9, -0.07, 0.07, 17, 26, WHITE);
  rig.add(0.72, 0.84, -0.085, 0.085, 21, 25, glassTone(WHITE, '#3b4a58'));
  rig.add(-0.9, 0.7, -0.103, 0.103, 14, 16.5, stripe, 'body', 0.3);
  // swept wings
  for (const s of [-1, 1]) {
    rig.add(-0.12, 0.22, Math.min(s * 0.1, s * 0.55), Math.max(s * 0.1, s * 0.55), 14, 16, '#d8dce0');
    rig.add(-0.38, -0.02, Math.min(s * 0.5, s * 0.95), Math.max(s * 0.5, s * 0.95), 14, 16, '#d8dce0');
    rig.add(-0.5, -0.3, Math.min(s * 0.92, s * 0.98), Math.max(s * 0.92, s * 0.98), 14, 20, stripe);
    rig.add(0.0, 0.2, Math.min(s * 0.3, s * 0.4), Math.max(s * 0.3, s * 0.4), 8, 14, '#9aa0a6');
  }
  rig.add(-1.08, -0.82, -0.014, 0.014, 26, 56, stripe);
  rig.add(-1.06, -0.9, -0.3, 0.3, 21, 23, '#d8dce0');
  rig.add(0.46, 0.5, -0.016, 0.016, 2, 10, DARK);
  rig.add(-0.12, -0.08, -0.07, -0.05, 2, 10, DARK);
  rig.add(-0.12, -0.08, 0.05, 0.07, 2, 10, DARK);
  rig.wheel(0.48, 0.02, 3.2);
  rig.wheel(0.48, -0.02, 3.2);
  rig.wheel(-0.1, 0.1, 3.6);
  rig.wheel(-0.1, -0.1, 3.6);
  shadow(ctx, 2.2, 2.2, 0.16, 4, 3);
  rig.render(ctx);
}

export function helicopter(ctx, r, { dir = 0 } = {}) {
  const c = r.pick(['#d6382f', '#f1efe8', '#3f7fb5']);
  const rig = new Rig(dir);
  rig.add(-0.12, 0.16, -0.07, 0.07, 6, 17, c);
  rig.add(0.06, 0.18, -0.065, 0.065, 8, 17, glassTone(c, '#5f8fa8'));
  rig.add(-0.5, -0.1, -0.02, 0.02, 11, 15, c);
  rig.add(-0.5, -0.46, -0.01, 0.01, 15, 24, c);
  rig.add(-0.05, 0.05, -0.02, 0.02, 17, 22, '#3b3a3f');
  rig.add(-0.35, 0.35, -0.012, 0.012, 22, 23, '#3b3a3f');
  rig.add(-0.012, 0.012, -0.35, 0.35, 22.4, 23.4, '#3b3a3f');
  rig.add(-0.12, 0.14, -0.1, -0.09, 1, 2.2, '#3b3a3f');
  rig.add(-0.12, 0.14, 0.09, 0.1, 1, 2.2, '#3b3a3f');
  rig.add(-0.06, -0.04, -0.1, 0.1, 1, 6, '#3b3a3f');
  shadow(ctx, 1, 1, 0.16, 3, 2);
  rig.render(ctx);
}
