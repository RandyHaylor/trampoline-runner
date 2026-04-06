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

  it('stays at its position (no auto-scroll)', () => {
    const t = new Trampoline(500, 300);
    expect(t.x).toBe(500);
    // No update method that scrolls
  });

  it('isFarBehind returns true when far left of given x', () => {
    const t = new Trampoline(100, 300);
    expect(t.isFarBehind(1500)).toBe(true);
  });

  it('isFarBehind returns false when near given x', () => {
    const t = new Trampoline(400, 300);
    expect(t.isFarBehind(500)).toBe(false);
  });

  it('accepts custom width parameter', () => {
    const t = new Trampoline(50, 300, 150);
    expect(t.width).toBe(150);
    expect(t.bounds().width).toBe(150);
  });

  it('defaults width to static WIDTH when not provided', () => {
    const t = new Trampoline(50, 300);
    expect(t.width).toBe(Trampoline.WIDTH);
    expect(t.bounds().width).toBe(Trampoline.WIDTH);
  });

  it('isFarBehind uses instance width', () => {
    const t = new Trampoline(100, 300, 50);
    // x + width = 150, playerX - 1000 = 500 => 150 < 500 => true
    expect(t.isFarBehind(1500)).toBe(true);
  });

  it('has static WIDTH and HEIGHT constants', () => {
    expect(Trampoline.WIDTH).toBeGreaterThan(0);
    expect(Trampoline.HEIGHT).toBeGreaterThan(0);
  });
});
