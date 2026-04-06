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

  it('stays at its position (no auto-scroll)', () => {
    const c = new Coin(500, 100);
    expect(c.x).toBe(500);
  });

  it('isFarBehind returns true when far left of given x', () => {
    const c = new Coin(100, 300);
    expect(c.isFarBehind(1500)).toBe(true);
  });

  it('isFarBehind returns false when near given x', () => {
    const c = new Coin(400, 300);
    expect(c.isFarBehind(500)).toBe(false);
  });
});
