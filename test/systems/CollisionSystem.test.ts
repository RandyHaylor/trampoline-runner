import { describe, it, expect } from 'vitest';
import { CollisionSystem } from '../../src/systems/CollisionSystem';
import type { Rect } from '../../src/types';

describe('CollisionSystem', () => {
  it('detects overlapping rects', () => {
    const a: Rect = { x: 0, y: 0, width: 50, height: 50 };
    const b: Rect = { x: 25, y: 25, width: 50, height: 50 };
    expect(CollisionSystem.aabb(a, b)).toBe(true);
  });

  it('returns false for non-overlapping rects', () => {
    const a: Rect = { x: 0, y: 0, width: 50, height: 50 };
    const b: Rect = { x: 100, y: 100, width: 50, height: 50 };
    expect(CollisionSystem.aabb(a, b)).toBe(false);
  });

  it('returns false for rects touching exactly on edge (no overlap)', () => {
    const a: Rect = { x: 0, y: 0, width: 50, height: 50 };
    const b: Rect = { x: 50, y: 0, width: 50, height: 50 };
    expect(CollisionSystem.aabb(a, b)).toBe(false);
  });

  it('detects overlap when one rect contains the other', () => {
    const outer: Rect = { x: 0, y: 0, width: 100, height: 100 };
    const inner: Rect = { x: 10, y: 10, width: 20, height: 20 };
    expect(CollisionSystem.aabb(outer, inner)).toBe(true);
  });

  it('is symmetric', () => {
    const a: Rect = { x: 10, y: 10, width: 30, height: 30 };
    const b: Rect = { x: 20, y: 20, width: 30, height: 30 };
    expect(CollisionSystem.aabb(a, b)).toBe(CollisionSystem.aabb(b, a));
  });
});
