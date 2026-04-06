import { describe, it, expect } from 'vitest';
import { Player } from '../../src/entities/Player';

describe('Player', () => {
  it('initializes at given position with zero velocity', () => {
    const p = new Player(50, 100);
    expect(p.x).toBe(50);
    expect(p.y).toBe(100);
    expect(p.vx).toBe(0);
    expect(p.vy).toBe(0);
  });

  it('bounds() returns a Rect matching position and size', () => {
    const p = new Player(10, 20);
    const b = p.bounds();
    expect(b.x).toBe(10);
    expect(b.y).toBe(20);
    expect(b.width).toBe(Player.WIDTH);
    expect(b.height).toBe(Player.HEIGHT);
  });

  it('update applies gravity to vy and moves y', () => {
    const p = new Player(0, 0);
    p.vy = 0;
    const gravity = 980;
    const dt = 0.016; // ~60fps
    p.update(dt, gravity);
    expect(p.vy).toBeCloseTo(gravity * dt);
    expect(p.y).toBeCloseTo(gravity * dt * dt);
  });

  it('centerX returns horizontal center of player', () => {
    const p = new Player(100, 0);
    expect(p.centerX()).toBe(100 + Player.WIDTH / 2);
  });

  it('centerY returns vertical center of player', () => {
    const p = new Player(0, 200);
    expect(p.centerY()).toBe(200 + Player.HEIGHT / 2);
  });

  it('has static WIDTH and HEIGHT constants', () => {
    expect(Player.WIDTH).toBeGreaterThan(0);
    expect(Player.HEIGHT).toBeGreaterThan(0);
  });

  it('has a MOVE_SPEED constant', () => {
    expect(Player.MOVE_SPEED).toBeGreaterThan(0);
  });

  it('moveLeft sets vx to negative MOVE_SPEED', () => {
    const p = new Player(100, 100);
    p.moveLeft();
    expect(p.vx).toBe(-Player.MOVE_SPEED);
  });

  it('moveRight sets vx to positive MOVE_SPEED', () => {
    const p = new Player(100, 100);
    p.moveRight();
    expect(p.vx).toBe(Player.MOVE_SPEED);
  });

  it('stopHorizontal sets vx to zero', () => {
    const p = new Player(100, 100);
    p.moveRight();
    p.stopHorizontal();
    expect(p.vx).toBe(0);
  });

  it('update applies vx to x position', () => {
    const p = new Player(100, 100);
    p.moveRight();
    p.update(0.016, 980);
    expect(p.x).toBeCloseTo(100 + Player.MOVE_SPEED * 0.016);
  });
});
