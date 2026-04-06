import type { Rect } from '../types';

export class Enemy {
  static readonly WIDTH = 40;
  static readonly HEIGHT = 40;

  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  bounds(): Rect {
    return { x: this.x, y: this.y, width: Enemy.WIDTH, height: Enemy.HEIGHT };
  }

  isFarBehind(playerX: number): boolean {
    return this.x + Enemy.WIDTH < playerX - 1000;
  }
}
