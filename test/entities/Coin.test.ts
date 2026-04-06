import { describe, it, expect } from 'vitest';
import { Coin } from '../../src/entities/Coin';

describe('Coin', () => {
  it('initializes at given position', () => {
    const c = new Coin(200, 300);
    expect(c.x).toBe(200);
    expect(c.y).toBe(300);
  });

  it('bounds() returns correct Rect', () => {
    const c = new Coin(10, 20);
    const b = c.bounds();
    expect(b.width).toBe(Coin.WIDTH);
    expect(b.height).toBe(Coin.HEIGHT);
  });

  it('scrolls left on update', () => {
    const c = new Coin(500, 100);
    c.update(0.1, 200);
    expect(c.x).toBeCloseTo(480);
  });

  it('isOffScreen when past left edge', () => {
    const c = new Coin(-Coin.WIDTH - 1, 0);
    expect(c.isOffScreen()).toBe(true);
  });

  it('is not offscreen when visible', () => {
    const c = new Coin(100, 0);
    expect(c.isOffScreen()).toBe(false);
  });
});
