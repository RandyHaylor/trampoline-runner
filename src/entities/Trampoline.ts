import type { Rect } from '../types';

export class Trampoline {
  static readonly WIDTH = 200;
  static readonly HEIGHT = 20;

  x: number;
  y: number;
  width: number;

  constructor(x: number, y: number, width: number = Trampoline.WIDTH) {
    this.x = x;
    this.y = y;
    this.width = width;
  }

  bounds(): Rect {
    return { x: this.x, y: this.y, width: this.width, height: Trampoline.HEIGHT };
  }

  isFarBehind(playerX: number): boolean {
    return this.x + this.width < playerX - 1000;
  }
}
