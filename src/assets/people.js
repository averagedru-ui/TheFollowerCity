import { PAL } from '../palette.js';
import { shade } from '../colors.js';

// Chibi walkers, drawn in screen space with feet at (0,0).
// dir: 0 = toward down-right, 1 = down-left, 2 = up-left (back), 3 = up-right (back)
// frame: 0 idle, 1/2 walk steps
export function person(ctx, r, { dir = 1, frame = 0 } = {}) {
  const skin = r.pick(PAL.skin), hair = r.pick(PAL.hair), shirt = r.pick(PAL.shirt), pants = r.pick(PAL.pants);
  const kid = r.chance(0.2), longHair = r.chance(0.4), hat = r.chance(0.15);
  const s = kid ? 0.78 : 1;
  const front = dir < 2;
  const sx = dir === 0 || dir === 3 ? 1 : -1;
  const swing = frame === 0 ? 0 : frame === 1 ? 1.8 : -1.8;
  const bob = frame === 0 ? 0 : -0.6;

  ctx.save();
  ctx.scale(s, s);
  ctx.fillStyle = 'rgba(45,55,30,.2)';
  ctx.beginPath();
  ctx.ellipse(0, 0.5, 6.5, 2.8, 0, 0, Math.PI * 2);
  ctx.fill();

  const rect = (x, y, w, h, c, rad = 0.8) => {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, rad);
    ctx.fillStyle = c;
    ctx.fill();
  };

  // legs + shoes (the back leg is drawn first)
  const legY = -6 + bob;
  rect(-2.6 - swing * sx * 0.5, legY, 2.5, 6 - Math.abs(swing) * 0.3, shade(pants, -0.08));
  rect(0.1 + swing * sx * 0.5, legY, 2.5, 6 - Math.abs(swing) * 0.3, pants);
  rect(-2.8 - swing * sx * 0.5, -1.2 + Math.abs(swing) * 0.3, 2.9, 1.5, '#3b3338');
  rect(-0.1 + swing * sx * 0.5, -1.2 + Math.abs(swing) * 0.3, 2.9, 1.5, '#3b3338');

  // arms behind torso when walking away
  const armY = -13.2 + bob;
  if (!front) {
    rect(-5 - swing * 0.4, armY, 1.9, 5.5, shade(shirt, -0.06));
    rect(3.1 + swing * 0.4, armY, 1.9, 5.5, shade(shirt, -0.06));
  }
  rect(-4, -14 + bob, 8, 8.6, shirt, 2);
  rect(-4, -9.2 + bob, 8, 3.8, shade(shirt, -0.07), 1.4);
  if (front) {
    rect(-5.2 + swing * 0.4, armY, 1.9, 5.5, shade(shirt, -0.05));
    rect(3.3 - swing * 0.4, armY, 1.9, 5.5, shade(shirt, -0.05));
    rect(-5.1 + swing * 0.4, armY + 4.8, 1.7, 1.5, skin, 0.7);
    rect(3.4 - swing * 0.4, armY + 4.8, 1.7, 1.5, skin, 0.7);
  }

  // head
  const hx = sx * 0.5, hy = -18.6 + bob;
  ctx.beginPath();
  ctx.arc(hx, hy, 4.3, 0, Math.PI * 2);
  ctx.fillStyle = skin;
  ctx.fill();
  ctx.fillStyle = hair;
  ctx.beginPath();
  if (front) {
    ctx.arc(hx, hy, 4.5, Math.PI * 1.02, Math.PI * 1.98);
    ctx.lineTo(hx + sx * 3.2, hy - 1.4);
    ctx.quadraticCurveTo(hx, hy - 3.2, hx - sx * 3.6, hy - 0.8);
    ctx.closePath();
    ctx.fill();
    if (longHair) rect(hx - 4.6, hy - 2, 2, 6.5, hair, 1);
    ctx.fillStyle = '#2b2a30';
    ctx.beginPath();
    ctx.arc(hx + sx * 1.2 - 1.3, hy + 0.5, 0.65, 0, Math.PI * 2);
    ctx.arc(hx + sx * 1.2 + 1.3, hy + 0.5, 0.65, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.arc(hx, hy, 4.5, 0, Math.PI * 2);
    ctx.fill();
    if (longHair) rect(hx - 4.4, hy - 1, 8.8, 6.5, hair, 2);
  }
  if (hat) {
    const hc = r.pick(['#d2a03a', '#c4604b', '#6e8da3']);
    rect(hx - 5.4, hy - 3.2, 10.8, 1.8, hc, 0.9);
    rect(hx - 3.6, hy - 6.6, 7.2, 3.6, hc, 1.6);
  }
  ctx.restore();
}
