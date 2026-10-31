// Oriented multi-part objects (vehicles, animals). Parts are authored once in local space
// (l = along heading, w = sideways) and rotated to any of the 4 iso headings.
//   dir 0 = +x (down-right), 1 = +y (down-left), 2 = -x (up-left), 3 = -y (up-right)
import { box, P } from './iso.js';
import { tone } from './colors.js';

const MAP = [
  (l, w) => [l, w],
  (l, w) => [-w, l],
  (l, w) => [-l, -w],
  (l, w) => [w, -l],
];

export class Rig {
  constructor(dir) {
    this.dir = dir;
    this.parts = [];
  }

  // kind: 'body' | 'wheel' | 'front' | 'rear' | 'top'
  add(l0, l1, w0, w1, z0, z1, t, kind = 'body', layer = null) {
    const f = MAP[this.dir];
    const a = f(l0, w0), b = f(l1, w1);
    this.parts.push({
      x0: Math.min(a[0], b[0]), x1: Math.max(a[0], b[0]),
      y0: Math.min(a[1], b[1]), y1: Math.max(a[1], b[1]),
      z0, z1, t: typeof t === 'string' ? tone(t) : t, kind, layer: layer ?? Math.floor(z0 / 9),
    });
    return this;
  }

  // disc wheel on the vehicle's side; only the camera-facing side is ever drawn
  wheel(l, w, R, color = '#2f3238') {
    const [x, y] = MAP[this.dir](l, w);
    this.parts.push({ kind: 'disc', x0: x, x1: x, y0: y, y1: y, z0: 0, z1: 0, R, color, layer: 0 });
    return this;
  }

  render(ctx) {
    const axisX = this.dir % 2 === 0;
    const frontVisible = this.dir < 2;
    const list = [];
    for (const p of this.parts) {
      if (p.kind === 'front' && !frontVisible) continue;
      if (p.kind === 'rear' && frontVisible) continue;
      const cx = (p.x0 + p.x1) / 2, cy = (p.y0 + p.y1) / 2;
      const near = axisX ? cy > 0 : cx > 0;
      if (p.kind === 'disc' && !near) continue;
      let layer = p.layer;
      if (p.kind === 'leg') layer = near ? 3 : -1;
      if (p.kind === 'disc') layer = 3;
      if (p.kind === 'front' || p.kind === 'rear') layer = 2;
      list.push({ ...p, cx, cy, layer });
    }
    list.sort((a, b) => a.layer - b.layer || a.cx + a.cy - (b.cx + b.cy) || a.z0 - b.z0);
    for (const p of list) {
      if (p.kind === 'disc') {
        // wheels are drawn as true screen-space circles so they always read as round
        const [sx, sy] = P(p.cx, p.cy, p.R);
        const dot = (R, fill) => { ctx.beginPath(); ctx.arc(sx, sy, R, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); };
        dot(p.R, p.color);
        dot(p.R * 0.62, '#9aa0a6');
        dot(p.R * 0.42, '#d5d9dc');
        dot(p.R * 0.15, '#6c7278');
      } else box(ctx, p.x0, p.y0, p.x1, p.y1, p.z0, p.z1, p.t);
    }
  }
}

// greenhouse tones: glass sides, body-colored roof
export function glassTone(bodyHex, glassHex = '#8fb9cd') {
  const b = tone(bodyHex), g = tone(glassHex);
  return { top: b.top, left: g.left, right: g.right };
}
