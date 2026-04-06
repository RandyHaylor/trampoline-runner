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

  it('stays at its position (no auto-scroll)', () => {
    const e = new Enemy(500, 100);
    expect(e.x).toBe(500);
  });

  it('isFarBehind returns true when far left of given x', () => {
    const e = new Enemy(100, 300);
    expect(e.isFarBehind(1500)).toBe(true);
  });

  it('isFarBehind returns false when near given x', () => {
    const e = new Enemy(400, 300);
    expect(e.isFarBehind(500)).toBe(false);
  });

  it('stores base y position', () => {
    const e = new Enemy(100, 300);
    expect(e.baseY).toBe(300);
  });

  it('update oscillates y around baseY sinusoidally', () => {
    const e = new Enemy(100, 300);
    e.update(0.5);
    // y should differ from baseY after some time
    expect(e.y).not.toBe(300);
    // but baseY stays the same
    expect(e.baseY).toBe(300);
  });

  it('y stays within amplitude of baseY', () => {
    const e = new Enemy(100, 300);
    for (let t = 0; t < 100; t++) {
      e.update(0.016);
    }
    expect(Math.abs(e.y - e.baseY)).toBeLessThanOrEqual(Enemy.FLOAT_AMPLITUDE);
  });

  it('uses phase offset based on x so enemies bob differently', () => {
    const e1 = new Enemy(100, 300);
    const e2 = new Enemy(200, 300);
    e1.update(0.5);
    e2.update(0.5);
    expect(e1.y).not.toBe(e2.y);
  });
});
