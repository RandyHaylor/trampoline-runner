import type { Rect } from '../types';

export class Coin {
  static readonly WIDTH = 24;
  static readonly HEIGHT = 24;

  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  bounds(): Rect {
    return { x: this.x, y: this.y, width: Coin.WIDTH, height: Coin.HEIGHT };
  }

  isFarBehind(playerX: number): boolean {
    return this.x + Coin.WIDTH < playerX - 1000;
  }
}
