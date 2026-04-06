/**
 * Seeded 2D Perlin noise implementation.
 *
 * Deterministic: same seed + same coordinates = same output.
 * Returns values in the range [-1, 1].
 */
export class PerlinNoise {
  private readonly perm: Uint8Array;

  constructor(seed: number) {
    this.perm = this.buildPermutation(seed);
  }

  /** Returns a noise value in [-1, 1] for the given 2D coordinates. */
  noise2D(x: number, y: number): number {
    // Grid cell coordinates
    const xi = Math.floor(x);
    const yi = Math.floor(y);

    // Relative position within cell [0, 1)
    const xf = x - xi;
    const yf = y - yi;

    // Fade curves for smooth interpolation
    const u = this.fade(xf);
    const v = this.fade(yf);

    // Hash corners of the cell
    const aa = this.hash(xi, yi);
    const ab = this.hash(xi, yi + 1);
    const ba = this.hash(xi + 1, yi);
    const bb = this.hash(xi + 1, yi + 1);

    // Gradient dot products at each corner
    const g00 = this.grad(aa, xf, yf);
    const g10 = this.grad(ba, xf - 1, yf);
    const g01 = this.grad(ab, xf, yf - 1);
    const g11 = this.grad(bb, xf - 1, yf - 1);

    // Bilinear interpolation
    const x0 = this.lerp(g00, g10, u);
    const x1 = this.lerp(g01, g11, u);
    return this.lerp(x0, x1, v);
  }

  /** Quintic fade curve: 6t^5 - 15t^4 + 10t^3 */
  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  /** Linear interpolation */
  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }

  /** Hash 2D integer coords to a permutation value */
  private hash(ix: number, iy: number): number {
    // Mask to 0-255 range (handles negative coords)
    const x = ((ix % 256) + 256) % 256;
    const y = ((iy % 256) + 256) % 256;
    return this.perm[(this.perm[x] + y) % 256];
  }

  /** Compute gradient dot product using hash to select from 4 gradients */
  private grad(hash: number, dx: number, dy: number): number {
    switch (hash & 3) {
      case 0:
        return dx + dy;
      case 1:
        return -dx + dy;
      case 2:
        return dx - dy;
      case 3:
        return -dx - dy;
      default:
        return 0;
    }
  }

  /** Build a seeded permutation table using a simple LCG PRNG */
  private buildPermutation(seed: number): Uint8Array {
    const perm = new Uint8Array(256);
    for (let i = 0; i < 256; i++) perm[i] = i;

    // Fisher-Yates shuffle with seeded PRNG
    let s = seed >>> 0;
    for (let i = 255; i > 0; i--) {
      // LCG step
      s = (s * 1664525 + 1013904223) >>> 0;
      const j = s % (i + 1);
      const tmp = perm[i];
      perm[i] = perm[j];
      perm[j] = tmp;
    }
    return perm;
  }
}
