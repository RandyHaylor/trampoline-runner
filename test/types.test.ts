import { describe, it, expect } from 'vitest';
import type { Rect, EntityState, GameConfig } from '../src/types';

describe('types', () => {
  it('Rect holds x, y, width, height', () => {
    const r: Rect = { x: 10, y: 20, width: 30, height: 40 };
    expect(r.x).toBe(10);
    expect(r.y).toBe(20);
    expect(r.width).toBe(30);
    expect(r.height).toBe(40);
  });

  it('EntityState holds x, y, vx, vy', () => {
    const e: EntityState = { x: 1, y: 2, vx: 3, vy: 4 };
    expect(e.vx).toBe(3);
    expect(e.vy).toBe(4);
  });

  it('GameConfig holds gravity, canvasWidth, canvasHeight', () => {
    const c: GameConfig = { gravity: 980, canvasWidth: 800, canvasHeight: 600 };
    expect(c.gravity).toBe(980);
    expect(c.canvasWidth).toBe(800);
  });
});
