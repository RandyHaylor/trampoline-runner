import type { Rect } from '../types';

export class Player {
  static readonly WIDTH = 40;
  static readonly HEIGHT = 60;
  static readonly MOVE_SPEED = 300;

  x: number;
  y: number;
  vx: number;
  vy: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
  }

  bounds(): Rect {
    return { x: this.x, y: this.y, width: Player.WIDTH, height: Player.HEIGHT };
  }

  centerX(): number {
    return this.x + Player.WIDTH / 2;
  }

  centerY(): number {
    return this.y + Player.HEIGHT / 2;
  }

  moveLeft(): void {
    this.vx = -Player.MOVE_SPEED;
  }

  moveRight(): void {
    this.vx = Player.MOVE_SPEED;
  }

  stopHorizontal(): void {
    this.vx = 0;
  }

  update(dt: number, gravity: number): void {
    this.vy += gravity * dt;
    this.y += this.vy * dt;
    this.x += this.vx * dt;
  }
}
