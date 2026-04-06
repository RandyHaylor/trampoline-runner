import { describe, it, expect } from 'vitest';
import { hashRandom } from '../../src/math/HashRandom';

describe('hashRandom', () => {
  it('returns a value in [0, 1) range', () => {
    for (let x = -50; x <= 50; x += 7) {
      for (let y = -50; y <= 50; y += 7) {
        const val = hashRandom(x, y);
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThan(1);
      }
    }
  });

  it('is deterministic — same inputs always return same output', () => {
    expect(hashRandom(3, 7)).toBe(hashRandom(3, 7));
    expect(hashRandom(0, 0)).toBe(hashRandom(0, 0));
    expect(hashRandom(-5, 12)).toBe(hashRandom(-5, 12));
  });

  it('produces different outputs for different inputs', () => {
    const pairs: [number, number][] = [
      [0, 0], [1, 0], [0, 1], [1, 1],
      [10, 20], [20, 10], [5, 5], [6, 5],
    ];
    const values = pairs.map(([x, y]) => hashRandom(x, y));
    const unique = new Set(values);
    expect(unique.size).toBe(pairs.length);
  });

  it('handles negative coordinates', () => {
    const val1 = hashRandom(-10, -20);
    const val2 = hashRandom(-1, -1);
    expect(val1).toBeGreaterThanOrEqual(0);
    expect(val1).toBeLessThan(1);
    expect(val2).toBeGreaterThanOrEqual(0);
    expect(val2).toBeLessThan(1);
    expect(val1).not.toBe(val2);
  });

  it('has good distribution across the [0, 1) range', () => {
    const buckets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const gridSize = 100;

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const val = hashRandom(x, y);
        const bucket = Math.min(Math.floor(val * 10), 9);
        buckets[bucket]++;
      }
    }

    const total = gridSize * gridSize;
    const expected = total / 10;
    for (const count of buckets) {
      // Each bucket should have roughly 10% — allow 5% deviation
      expect(count).toBeGreaterThan(expected * 0.5);
      expect(count).toBeLessThan(expected * 1.5);
    }
  });
});
