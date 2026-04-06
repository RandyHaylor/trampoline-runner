import { describe, it, expect } from "vitest";
import { PerlinNoise } from "../../src/math/PerlinNoise";

describe("PerlinNoise", () => {
  it("returns values in [-1, 1] range", () => {
    const perlin = new PerlinNoise(42);
    const coords = [
      [0.5, 0.5],
      [1.7, 3.2],
      [10.1, 20.9],
      [-5.3, 8.1],
      [100.7, 200.3],
      [0, 0],
      [1, 1],
    ];
    for (const [x, y] of coords) {
      const val = perlin.noise2D(x, y);
      expect(val).toBeGreaterThanOrEqual(-1);
      expect(val).toBeLessThanOrEqual(1);
    }
  });

  it("is deterministic: same seed and coords produce same result", () => {
    const a = new PerlinNoise(99);
    const b = new PerlinNoise(99);
    expect(a.noise2D(3.7, 8.2)).toBe(b.noise2D(3.7, 8.2));
    expect(a.noise2D(-1.5, 0.3)).toBe(b.noise2D(-1.5, 0.3));
  });

  it("different seeds produce different results for same coords", () => {
    const a = new PerlinNoise(1);
    const b = new PerlinNoise(2);
    // Extremely unlikely to be equal with different permutation tables
    expect(a.noise2D(5.5, 5.5)).not.toBe(b.noise2D(5.5, 5.5));
  });

  it("is smooth: nearby coords produce closer values than distant coords on average", () => {
    const perlin = new PerlinNoise(42);
    let nearDiffSum = 0;
    let farDiffSum = 0;
    const samples = 50;
    for (let i = 0; i < samples; i++) {
      const x = i * 0.73;
      const y = i * 0.41;
      const nearDiff = Math.abs(perlin.noise2D(x, y) - perlin.noise2D(x + 0.01, y + 0.01));
      const farDiff = Math.abs(perlin.noise2D(x, y) - perlin.noise2D(x + 10, y + 10));
      nearDiffSum += nearDiff;
      farDiffSum += farDiff;
    }
    expect(nearDiffSum / samples).toBeLessThan(farDiffSum / samples);
  });

  it("returns values at negative coordinates", () => {
    const perlin = new PerlinNoise(7);
    const val = perlin.noise2D(-3.5, -7.2);
    expect(val).toBeGreaterThanOrEqual(-1);
    expect(val).toBeLessThanOrEqual(1);
    // Should not be exactly 0 (degenerate)
    expect(perlin.noise2D(-10.1, -20.9)).not.toBe(0);
  });

  it("has no discontinuities at integer boundaries", () => {
    const perlin = new PerlinNoise(42);
    // Check that values just below and just above an integer boundary are close
    const epsilon = 0.001;
    const boundaries = [0, 1, -1, 5, -5];
    for (const b of boundaries) {
      const below = perlin.noise2D(b - epsilon, 0.5);
      const above = perlin.noise2D(b + epsilon, 0.5);
      expect(Math.abs(above - below)).toBeLessThan(0.05);
    }
  });
});
