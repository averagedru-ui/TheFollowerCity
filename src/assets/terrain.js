import { poly, line, P, diamond } from '../iso.js';
import { tone, shade } from '../colors.js';
import { PAL } from '../palette.js';

const H = 0.5;
export const base = (ctx, fill, thick = 0) => {
  if (thick) {
    const t = tone(fill);
    poly(ctx, [[-H, H, 0], [H, H, 0], [H, H, -thick], [-H, H, -thick]], t.left);
    poly(ctx, [[H, -H, 0], [H, H, 0], [H, H, -thick], [H, -H, -thick]], t.right);
  }
  diamond(ctx, -H, -H, H, H, 0, fill);
};

export function speckle(ctx, r, colors, n, size = 1.3) {
  for (let i = 0; i < n; i++) {
    const x = r.range(-H, H), y = r.range(-H, H);
    const [sx, sy] = P(x, y);
    ctx.fillStyle = r.pick(colors);
    ctx.fillRect(sx - size, sy - size / 2, size * 2, size);
  }
}

export function grass(ctx, r) {
  base(ctx, PAL.grass, 6);
  speckle(ctx, r, ['#98ba70', '#b6d28c', '#8fb468'], 40);
}
export function dirt(ctx, r) {
  base(ctx, PAL.dirt, 6);
  speckle(ctx, r, ['#b9976a', '#d6b88c', '#a98860'], 40);
}
export function sand(ctx, r) {
  base(ctx, PAL.sand, 6);
  speckle(ctx, r, ['#d8c48c', '#efe0b2'], 36);
}
export function water(ctx, r) {
  base(ctx, PAL.water, 3);
  for (let i = 0; i < 6; i++) {
    const [sx, sy] = P(r.range(-0.35, 0.35), r.range(-0.35, 0.35));
    ctx.strokeStyle = 'rgba(255,255,255,.55)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sx - 4, sy);
    ctx.lineTo(sx + 4, sy);
    ctx.stroke();
  }
}

export function roadX(ctx) {
  base(ctx, PAL.grass, 6);
  poly(ctx, [[-H, -0.36, 0], [H, -0.36, 0], [H, 0.36, 0], [-H, 0.36, 0]], PAL.asphalt);
  poly(ctx, [[-H, 0.36, 0], [H, 0.36, 0], [H, 0.4, 0], [-H, 0.4, 0]], '#cfc8b4');
  poly(ctx, [[-H, -0.4, 0], [H, -0.4, 0], [H, -0.36, 0], [-H, -0.36, 0]], '#cfc8b4');
  for (let i = -3; i < 3; i++) poly(ctx, [[i / 6 + 0.04, -0.012, 0], [i / 6 + 0.13, -0.012, 0], [i / 6 + 0.13, 0.012, 0], [i / 6 + 0.04, 0.012, 0]], '#f1ead2');
}
export function roadY(ctx) {
  base(ctx, PAL.grass, 6);
  poly(ctx, [[-0.36, -H, 0], [0.36, -H, 0], [0.36, H, 0], [-0.36, H, 0]], PAL.asphalt);
  poly(ctx, [[0.36, -H, 0], [0.4, -H, 0], [0.4, H, 0], [0.36, H, 0]], '#cfc8b4');
  poly(ctx, [[-0.4, -H, 0], [-0.36, -H, 0], [-0.36, H, 0], [-0.4, H, 0]], '#cfc8b4');
  for (let i = -3; i < 3; i++) poly(ctx, [[-0.012, i / 6 + 0.04, 0], [0.012, i / 6 + 0.04, 0], [0.012, i / 6 + 0.13, 0], [-0.012, i / 6 + 0.13, 0]], '#f1ead2');
}
export function roadCross(ctx) {
  base(ctx, PAL.grass, 6);
  poly(ctx, [[-H, -0.36, 0], [H, -0.36, 0], [H, 0.36, 0], [-H, 0.36, 0]], PAL.asphalt);
  poly(ctx, [[-0.36, -H, 0], [0.36, -H, 0], [0.36, H, 0], [-0.36, H, 0]], PAL.asphalt);
  for (let k = -1; k <= 1; k += 2) {
    for (let i = -2; i <= 2; i++) {
      const o = 0.4 * k;
      poly(ctx, [[o - 0.03, i * 0.12 - 0.035, 0], [o + 0.03, i * 0.12 - 0.035, 0], [o + 0.03, i * 0.12 + 0.035, 0], [o - 0.03, i * 0.12 + 0.035, 0]], '#f1ead2');
    }
  }
}

function rows(ctx, soil, row, rowW, crop) {
  base(ctx, soil, 6);
  const n = 7, pad = 0.06, step = (1 - pad * 2) / n;
  for (let i = 0; i < n; i++) {
    const y0 = -H + pad + i * step;
    poly(ctx, [[-H + pad, y0 + step * 0.15, 0], [H - pad, y0 + step * 0.15, 0], [H - pad, y0 + step * (0.15 + rowW), 0], [-H + pad, y0 + step * (0.15 + rowW), 0]], row);
    if (crop) crop(y0 + step * 0.5);
  }
}
export function fieldWheat(ctx) {
  rows(ctx, '#d9c07a', '#e8cf72', 0.7, null);
}
export function fieldCabbage(ctx, r) {
  rows(ctx, '#a98860', '#9fc16f', 0.4, (y) => {
    for (let x = -0.4; x < 0.42; x += 0.13) {
      const [sx, sy] = P(x, y);
      ctx.beginPath();
      ctx.arc(sx, sy - 2, 2.6, 0, Math.PI * 2);
      ctx.fillStyle = '#7fae5c';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(sx - 0.6, sy - 2.6, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = '#b3d67e';
      ctx.fill();
    }
  });
}
export function fieldPlowed(ctx) {
  rows(ctx, '#a98860', '#8f6e48', 0.45, null);
}
