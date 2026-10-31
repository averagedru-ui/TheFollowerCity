// Isometric drawing kit. World units: 1 = one tile on x/y, z is in screen pixels.
// +x runs down-right, +y runs down-left. Visible faces are +y ("left") and +x ("right").
import { tone } from './colors.js';

export const TW = 64;
export const TH = 32;
export const P = (x, y, z = 0) => [((x - y) * TW) / 2, ((x + y) * TH) / 2 - z];

export function poly(ctx, pts, fill) {
  ctx.beginPath();
  pts.forEach((p, i) => {
    const [sx, sy] = P(p[0], p[1], p[2] || 0);
    i ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy);
  });
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  // same-color hairline stroke hides seams between neighbouring faces
  ctx.strokeStyle = fill;
  ctx.lineWidth = 0.6;
  ctx.lineJoin = 'round';
  ctx.stroke();
}

export function line(ctx, a, b, color, w = 1) {
  const [ax, ay] = P(...a);
  const [bx, by] = P(...b);
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.lineCap = 'round';
  ctx.stroke();
}

export function shadow(ctx, w = 1, d = 1, a = 0.16, ox = 4, oy = 3) {
  const [cx, cy] = P(0, 0);
  ctx.save();
  ctx.fillStyle = `rgba(45,55,30,${a})`;
  ctx.beginPath();
  ctx.ellipse(cx + ox, cy + oy, (w + d) * 12.5, (w + d) * 6.3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function box(ctx, x0, y0, x1, y1, z0, z1, t) {
  if (typeof t === 'string') t = tone(t);
  poly(ctx, [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], t.left);
  poly(ctx, [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], t.right);
  poly(ctx, [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], t.top);
}

// flat rectangle lying on a wall plane. plane 'y' = left face at y=c, plane 'x' = right face at x=c
export function face(ctx, plane, c, a0, a1, z0, z1, fill) {
  const pts =
    plane === 'y'
      ? [[a0, c, z0], [a1, c, z0], [a1, c, z1], [a0, c, z1]]
      : [[c, a0, z0], [c, a1, z0], [c, a1, z1], [c, a0, z1]];
  poly(ctx, pts, fill);
}

export function win(ctx, plane, c, a, w, z, h, o = {}) {
  const side = plane === 'y' ? 'left' : 'right';
  const fr = tone(o.frame || '#f7f0dc')[side];
  const gl = tone(o.glass || '#8fb8cc')[side];
  face(ctx, plane, c, a - w / 2, a + w / 2, z, z + h, fr);
  face(ctx, plane, c, a - w / 2 + 0.022, a + w / 2 - 0.022, z + 1.4, z + h - 1.4, gl);
  if (o.cross !== false) {
    face(ctx, plane, c, a - 0.007, a + 0.007, z + 1, z + h - 1, fr);
    face(ctx, plane, c, a - w / 2 + 0.02, a + w / 2 - 0.02, z + h / 2 - 0.6, z + h / 2 + 0.6, fr);
  }
}

export function door(ctx, plane, c, a, w, z, h, color = '#8a6240', frame = '#fbf5e4') {
  const side = plane === 'y' ? 'left' : 'right';
  face(ctx, plane, c, a - w / 2 - 0.015, a + w / 2 + 0.015, z, z + h + 1.5, tone(frame)[side]);
  face(ctx, plane, c, a - w / 2, a + w / 2, z, z + h, tone(color)[side]);
  // knob
  const [kx, ky] = plane === 'y' ? P(a + w * 0.3, c, z + h * 0.45) : P(c, a + w * 0.3, z + h * 0.45);
  ctx.fillStyle = '#e7c46a';
  ctx.fillRect(kx - 0.7, ky - 0.7, 1.4, 1.4);
}

function eaveDrop(rh, half, o) {
  return (rh * o) / half;
}

export function gable(ctx, x0, y0, x1, y1, z, rh, t, o = 0.06, axis = 'x', wallTone) {
  const X0 = x0 - o, X1 = x1 + o, Y0 = y0 - o, Y1 = y1 + o;
  const xm = (x0 + x1) / 2, ym = (y0 + y1) / 2, zr = z + rh;
  if (axis === 'x') {
    const ze = z - eaveDrop(rh, (y1 - y0) / 2, o);
    poly(ctx, [[x1, y0, z], [x1, y1, z], [x1, ym, zr]], (wallTone || t).right);
    poly(ctx, [[X0, ym, zr], [X1, ym, zr], [X1, Y1, ze], [X0, Y1, ze]], t.left);
    line(ctx, [X0, ym, zr], [X1, ym, zr], t.top, 1.6);
    line(ctx, [X0, Y1, ze], [X1, Y1, ze], t.right, 1);
  } else {
    const ze = z - eaveDrop(rh, (x1 - x0) / 2, o);
    poly(ctx, [[x0, y1, z], [x1, y1, z], [xm, y1, zr]], (wallTone || t).left);
    poly(ctx, [[xm, Y0, zr], [xm, Y1, zr], [X1, Y1, ze], [X1, Y0, ze]], t.right);
    line(ctx, [xm, Y0, zr], [xm, Y1, zr], t.top, 1.6);
    line(ctx, [X1, Y0, ze], [X1, Y1, ze], t.right, 1);
  }
}

export function hip(ctx, x0, y0, x1, y1, z, rh, t, o = 0.06) {
  const X0 = x0 - o, X1 = x1 + o, Y0 = y0 - o, Y1 = y1 + o;
  const w = X1 - X0, d = Y1 - Y0, xm = (X0 + X1) / 2, ym = (Y0 + Y1) / 2, zr = z + rh;
  const ze = z - eaveDrop(rh, Math.min(x1 - x0, y1 - y0) / 2, o);
  let r0, r1;
  if (w >= d) { r0 = [X0 + d / 2, ym]; r1 = [X1 - d / 2, ym]; }
  else { r0 = [xm, Y0 + w / 2]; r1 = [xm, Y1 - w / 2]; }
  if (w >= d) {
    poly(ctx, [[X0, Y1, ze], [X1, Y1, ze], [r1[0], r1[1], zr], [r0[0], r0[1], zr]], t.left);
    poly(ctx, [[X1, Y0, ze], [X1, Y1, ze], [r1[0], r1[1], zr]], t.right);
  } else {
    poly(ctx, [[X0, Y1, ze], [X1, Y1, ze], [r1[0], r1[1], zr]], t.left);
    poly(ctx, [[X1, Y0, ze], [X1, Y1, ze], [r1[0], r1[1], zr], [r0[0], r0[1], zr]], t.right);
  }
  if (r0[0] !== r1[0] || r0[1] !== r1[1]) line(ctx, [r0[0], r0[1], zr], [r1[0], r1[1], zr], t.top, 1.6);
}

// flat roof with parapet walls; back walls first, then deck, then front walls
export function parapet(ctx, x0, y0, x1, y1, z, h, th, wall, deck) {
  const wt = typeof wall === 'string' ? tone(wall) : wall;
  box(ctx, x0, y0, x1, y0 + th, z, z + h, wt);
  box(ctx, x0, y0, x0 + th, y1, z, z + h, wt);
  poly(ctx, [[x0 + th, y0 + th, z + 1], [x1, y0 + th, z + 1], [x1, y1, z + 1], [x0 + th, y1, z + 1]], deck);
}
export function parapetFront(ctx, x0, y0, x1, y1, z, h, th, wall) {
  const wt = typeof wall === 'string' ? tone(wall) : wall;
  box(ctx, x0, y1 - th, x1, y1, z, z + h, wt);
  box(ctx, x1 - th, y0, x1, y1, z, z + h, wt);
}

// square frustum (tapered tower)
export function frustum(ctx, cx, cy, b, tp, z0, z1, t) {
  poly(ctx, [[cx - b, cy + b, z0], [cx + b, cy + b, z0], [cx + tp, cy + tp, z1], [cx - tp, cy + tp, z1]], t.left);
  poly(ctx, [[cx + b, cy - b, z0], [cx + b, cy + b, z0], [cx + tp, cy + tp, z1], [cx + tp, cy - tp, z1]], t.right);
  poly(ctx, [[cx - tp, cy - tp, z1], [cx + tp, cy - tp, z1], [cx + tp, cy + tp, z1], [cx - tp, cy + tp, z1]], t.top);
}

// upright cylinder with optional dome. r in tiles.
export function cyl(ctx, cx, cy, r, z0, z1, base, dome = 0) {
  const t = typeof base === 'string' ? tone(base) : base;
  const [sx, sy] = P(cx, cy);
  const rx = (r * TW) / Math.SQRT2, ry = (r * TH) / Math.SQRT2;
  const g = ctx.createLinearGradient(sx - rx, 0, sx + rx, 0);
  g.addColorStop(0, t.left);
  g.addColorStop(0.4, t.top);
  g.addColorStop(1, t.right);
  ctx.beginPath();
  ctx.moveTo(sx - rx, sy - z1);
  ctx.lineTo(sx - rx, sy - z0);
  ctx.ellipse(sx, sy - z0, rx, ry, 0, Math.PI, 0, true);
  ctx.lineTo(sx + rx, sy - z1);
  ctx.ellipse(sx, sy - z1, rx, ry, 0, 0, Math.PI, false);
  ctx.closePath();
  ctx.fillStyle = g;
  ctx.fill();
  if (dome > 0) {
    ctx.beginPath();
    ctx.moveTo(sx - rx, sy - z1);
    ctx.ellipse(sx, sy - z1, rx, dome, 0, Math.PI, Math.PI * 2, false);
    ctx.ellipse(sx, sy - z1, rx, ry, 0, 0, Math.PI, false);
    ctx.closePath();
    ctx.fillStyle = g;
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.ellipse(sx, sy - z1, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = t.top;
    ctx.fill();
  }
}

// ring on a cylinder (darker band)
export function cylBand(ctx, cx, cy, r, z, color, w = 1) {
  const [sx, sy] = P(cx, cy);
  const rx = (r * TW) / Math.SQRT2, ry = (r * TH) / Math.SQRT2;
  ctx.beginPath();
  ctx.ellipse(sx, sy - z, rx, ry, 0, 0, Math.PI, false);
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.stroke();
}

// polygon prism from tile-space points (used for rocks, ponds edges, etc.)
export function prism(ctx, pts, z0, z1, t) {
  const n = pts.length;
  const edges = [];
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n];
    const nx = b[1] - a[1], ny = -(b[0] - a[0]); // outward for CCW in tile space
    if (nx + ny <= 0) continue; // faces away from the camera
    edges.push({ a, b, nx, ny, k: a[0] + a[1] + b[0] + b[1] });
  }
  edges.sort((p, q) => p.k - q.k);
  for (const e of edges) {
    poly(ctx, [[e.a[0], e.a[1], z0], [e.b[0], e.b[1], z0], [e.b[0], e.b[1], z1], [e.a[0], e.a[1], z1]], e.ny >= e.nx ? t.left : t.right);
  }
  poly(ctx, pts.map((p) => [p[0], p[1], z1]), t.top);
}

// screen-space cone (pine layers)
export function cone(ctx, cx, cy, rx, z0, z1, t) {
  const [sx, sy] = P(cx, cy);
  const ry = rx * 0.5;
  ctx.beginPath();
  ctx.moveTo(sx, sy - z1);
  ctx.lineTo(sx - rx, sy - z0);
  ctx.ellipse(sx, sy - z0, rx, ry, 0, Math.PI, Math.PI / 2, true);
  ctx.closePath();
  ctx.fillStyle = t.left;
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(sx, sy - z1);
  ctx.lineTo(sx + rx, sy - z0);
  ctx.ellipse(sx, sy - z0, rx, ry, 0, 0, Math.PI / 2, false);
  ctx.closePath();
  ctx.fillStyle = t.right;
  ctx.fill();
}

export function blob(ctx, cx, cy, z, rad, color) {
  const [sx, sy] = P(cx, cy, z);
  ctx.beginPath();
  ctx.arc(sx, sy, rad, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

export function diamond(ctx, x0, y0, x1, y1, z, fill) {
  poly(ctx, [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]], fill);
}

// ---- facade helpers ----
// glass curtain wall: frame-colored backing + a grid of glass panes with slight tone variation
export function curtain(ctx, plane, c, a0, a1, z0, z1, o = {}) {
  const side = plane === 'y' ? 'left' : 'right';
  const frame = tone(o.frame || '#dfe6e8')[side];
  const glassSet = (o.glass || ['#7fb0c8', '#8cbdd2', '#74a6bf']).map((g) => tone(g)[side]);
  face(ctx, plane, c, a0, a1, z0, z1, frame);
  const fh = o.floorH || 12;
  const cols = o.cols || Math.max(2, Math.round((a1 - a0) / 0.11));
  const cw = (a1 - a0) / cols;
  const rows = Math.max(1, Math.floor((z1 - z0) / fh));
  const rh = (z1 - z0) / rows;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const g = glassSet[(i * 7 + j * 3 + Math.floor(a0 * 10)) % glassSet.length];
      face(ctx, plane, c, a0 + i * cw + 0.008, a0 + (i + 1) * cw - 0.008, z0 + j * rh + 1.4, z0 + (j + 1) * rh - 1.2, g);
    }
  }
}

// rows of punched windows
export function windows(ctx, plane, c, a0, a1, z0, z1, o = {}) {
  const fh = o.floorH || 18, cols = o.cols || Math.max(2, Math.round((a1 - a0) / 0.17));
  const rows = Math.max(1, Math.floor((z1 - z0) / fh));
  const cw = (a1 - a0) / cols;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      win(ctx, plane, c, a0 + (i + 0.5) * cw, (o.w || 0.1), z0 + j * fh + (o.pad ?? 5), o.h || 9, o);
    }
  }
}

// a solid slab (box + facade on both visible faces). facade: 'glass' | 'punched' | 'plain'
export function slab(ctx, b) {
  const { x0, x1, y0, y1, z0, z1 } = b;
  const wall = b.wall || '#e8dcc0';
  box(ctx, x0, y0, x1, y1, z0, z1, wall);
  const f = b.facade || 'punched';
  const pad = b.inset ?? 0.05;
  if (f === 'glass') {
    curtain(ctx, 'y', y1, x0 + 0.02, x1 - 0.02, z0 + 2, z1 - 2, b);
    curtain(ctx, 'x', x1, y0 + 0.02, y1 - 0.02, z0 + 2, z1 - 2, b);
  } else if (f === 'punched') {
    windows(ctx, 'y', y1, x0 + pad, x1 - pad, z0, z1, b);
    windows(ctx, 'x', x1, y0 + pad, y1 - pad, z0, z1, b);
  }
}
