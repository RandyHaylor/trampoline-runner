import type { Rect } from '../types';

const FLOAT_SPEED = 2; // radians per second
const FLOAT_AMPLITUDE = 15; // pixels

export class Enemy {
  static readonly WIDTH = 40;
  static readonly HEIGHT = 40;
  static readonly FLOAT_AMPLITUDE = FLOAT_AMPLITUDE;

  x: number;
  y: number;
  baseY: number;
  private phase: number;
  private elapsed: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.baseY = y;
    this.phase = x * 0.05; // offset based on x position
    this.elapsed = 0;
    this.y = y;
  }

  update(dt: number): void {
    this.elapsed += dt;
    this.y = this.baseY + Math.sin(this.elapsed * FLOAT_SPEED + this.phase) * FLOAT_AMPLITUDE;
  }

  bounds(): Rect {
    return { x: this.x, y: this.y, width: Enemy.WIDTH, height: Enemy.HEIGHT };
  }

  isFarBehind(playerX: number): boolean {
    return this.x + Enemy.WIDTH < playerX - 1000;
  }
}
