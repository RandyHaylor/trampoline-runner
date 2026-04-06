/**
 * Deterministic hash-based random number generator.
 * Takes integer grid coordinates and returns a float in [0, 1).
 * Same (x, y) always produces the same result.
 */
export function hashRandom(x: number, y: number): number {
  // Multiply-shift integer hash using large primes
  let h = (x * 374761393 + y * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h = Math.imul(h ^ (h >>> 16), 1911520717);
  h = h ^ (h >>> 13);
  // Convert to [0, 1) by masking to positive 31-bit int
  return (h >>> 0) / 4294967296;
}
