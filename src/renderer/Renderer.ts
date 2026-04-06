import type { World } from '../World';
import { Player } from '../entities/Player';
import { Trampoline } from '../entities/Trampoline';
import { Coin } from '../entities/Coin';
import { Enemy } from '../entities/Enemy';
import { Camera } from '../Camera';

export class Renderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  render(world: World, camera: Camera): void {
    const { width, height } = this.ctx.canvas;

    // Clear
    this.ctx.clearRect(0, 0, width, height);

    // Background gradient sky
    this.ctx.fillStyle = '#87CEEB';
    this.ctx.fillRect(0, 0, width, height);

    // Trampolines
    this.ctx.fillStyle = '#4CAF50';
    for (const t of world.trampolines) {
      this.ctx.fillRect(camera.worldToScreen(t.x), camera.worldToScreenY(t.y), t.width, Trampoline.HEIGHT);
    }

    // Coins (yellow squares)
    this.ctx.fillStyle = '#FFD700';
    for (const c of world.coins) {
      this.ctx.fillRect(camera.worldToScreen(c.x), camera.worldToScreenY(c.y), Coin.WIDTH, Coin.HEIGHT);
    }

    // Enemies (red)
    this.ctx.fillStyle = '#FF0000';
    for (const e of world.enemies) {
      this.ctx.fillRect(camera.worldToScreen(e.x), camera.worldToScreenY(e.y), Enemy.WIDTH, Enemy.HEIGHT);
    }

    // Player (blue)
    this.ctx.fillStyle = '#2196F3';
    this.ctx.fillRect(camera.worldToScreen(world.player.x), camera.worldToScreenY(world.player.y), Player.WIDTH, Player.HEIGHT);

    // Score
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = '24px sans-serif';
    this.ctx.fillText(`Score: ${world.score}`, 16, 36);
  }
}
