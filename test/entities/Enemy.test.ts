import { describe, it, expect } from 'vitest';
import { Enemy } from '../../src/entities/Enemy';

describe('Enemy', () => {
  it('initializes at given position', () => {
    const e = new Enemy(300, 400);
    expect(e.x).toBe(300);
    expect(e.y).toBe(400);
  });

  it('bounds() returns correct Rect', () => {
    const e = new Enemy(10, 20);
    const b = e.bounds();
    expect(b.width).toBe(Enemy.WIDTH);
    expect(b.height).toBe(Enemy.HEIGHT);
  });

  it('scrolls left on update', () => {
    const e = new Enemy(500, 100);
    e.update(0.1, 200);
    expect(e.x).toBeCloseTo(480);
  });

  it('isOffScreen when past left edge', () => {
    const e = new Enemy(-Enemy.WIDTH - 1, 0);
    expect(e.isOffScreen()).toBe(true);
  });

  it('is not offscreen when visible', () => {
    const e = new Enemy(100, 0);
    expect(e.isOffScreen()).toBe(false);
  });
});
