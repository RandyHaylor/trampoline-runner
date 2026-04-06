import { describe, it, expect } from 'vitest';
import { Trampoline } from '../../src/entities/Trampoline';

describe('Trampoline', () => {
  it('initializes at given position with default size', () => {
    const t = new Trampoline(100, 400);
    expect(t.x).toBe(100);
    expect(t.y).toBe(400);
  });

  it('bounds() returns a Rect with correct dimensions', () => {
    const t = new Trampoline(50, 300);
    const b = t.bounds();
    expect(b.x).toBe(50);
    expect(b.y).toBe(300);
    expect(b.width).toBe(Trampoline.WIDTH);
    expect(b.height).toBe(Trampoline.HEIGHT);
  });

  it('scrolls left by scrollSpeed * dt', () => {
    const t = new Trampoline(500, 300);
    t.update(0.016, 200);
    expect(t.x).toBeCloseTo(500 - 200 * 0.016);
  });

  it('isOffScreen returns true when fully past left edge', () => {
    const t = new Trampoline(-Trampoline.WIDTH - 1, 300);
    expect(t.isOffScreen()).toBe(true);
  });

  it('isOffScreen returns false when still visible', () => {
    const t = new Trampoline(100, 300);
    expect(t.isOffScreen()).toBe(false);
  });

  it('has static WIDTH and HEIGHT constants', () => {
    expect(Trampoline.WIDTH).toBeGreaterThan(0);
    expect(Trampoline.HEIGHT).toBeGreaterThan(0);
  });
});
