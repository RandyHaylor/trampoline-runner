import type { Rect } from '../types';

export class Trampoline {
  static readonly WIDTH = 200;
  static readonly HEIGHT = 20;

  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  bounds(): Rect {
    return { x: this.x, y: this.y, width: Trampoline.WIDTH, height: Trampoline.HEIGHT };
  }

  isFarBehind(playerX: number): boolean {
    return this.x + Trampoline.WIDTH < playerX - 1000;
  }
}
