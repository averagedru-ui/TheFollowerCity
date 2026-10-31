// Small seeded 2D gradient noise + fBm.
export function makeNoise(seed = 1) {
  let a = seed >>> 0;
  const rand = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const p = new Uint8Array(512);
  const base = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [base[i], base[j]] = [base[j], base[i]]; }
  for (let i = 0; i < 512; i++) p[i] = base[i & 255];
  const grads = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];
  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const dot = (g, x, y) => g[0] * x + g[1] * y;

  const noise = (x, y) => {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
    x -= Math.floor(x); y -= Math.floor(y);
    const u = fade(x), v = fade(y);
    const g = (i, j) => grads[p[p[X + i] + Y + j] & 7];
    const n00 = dot(g(0, 0), x, y), n10 = dot(g(1, 0), x - 1, y);
    const n01 = dot(g(0, 1), x, y - 1), n11 = dot(g(1, 1), x - 1, y - 1);
    return (n00 + u * (n10 - n00)) + v * ((n01 + u * (n11 - n01)) - (n00 + u * (n10 - n00)));
  };
  // fbm in roughly -1..1
  noise.fbm = (x, y, oct = 4, lac = 2, gain = 0.5) => {
    let amp = 1, f = 1, sum = 0, norm = 0;
    for (let i = 0; i < oct; i++) { sum += amp * noise(x * f, y * f); norm += amp; amp *= gain; f *= lac; }
    return sum / norm;
  };
  noise.n01 = (x, y, oct, lac, gain) => Math.min(1, Math.max(0, noise.fbm(x, y, oct, lac, gain) * 0.9 + 0.5));
  return noise;
}

export const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
