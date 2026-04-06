import type { GameConfig } from './types';
import { Player } from './entities/Player';
import { Trampoline } from './entities/Trampoline';
import { Coin } from './entities/Coin';
import { Enemy } from './entities/Enemy';
import { CollisionSystem } from './systems/CollisionSystem';
import { bounceVelocityFor } from './physics/bounce';

export class World {
  config: GameConfig;
  player: Player;
  trampolines: Trampoline[];
  coins: Coin[];
  enemies: Enemy[];
  score: number;

  constructor(config: GameConfig) {
    this.config = config;
    this.player = new Player(config.canvasWidth * 0.2, config.canvasHeight * 0.5);
    this.trampolines = [];
    this.coins = [];
    this.enemies = [];
    this.score = 0;
  }

  addTrampoline(x: number, y: number): void {
    this.trampolines.push(new Trampoline(x, y));
  }

  addCoin(x: number, y: number): void {
    this.coins.push(new Coin(x, y));
  }

  addEnemy(x: number, y: number): void {
    this.enemies.push(new Enemy(x, y));
  }

  update(dt: number): void {
    this.player.update(dt, this.config.gravity);

    // Bounce off trampolines
    const playerBounds = this.player.bounds();
    for (const t of this.trampolines) {
      if (CollisionSystem.aabb(playerBounds, t.bounds()) && this.player.vy > 0) {
        this.player.vy = -bounceVelocityFor(this.player.centerX(), t.bounds());
        this.player.y = t.y - Player.HEIGHT;
      }
    }

    // Collect coins
    this.coins = this.coins.filter(c => {
      if (CollisionSystem.aabb(playerBounds, c.bounds())) {
        this.score += 1;
        return false;
      }
      return true;
    });

    // Remove entities far behind the player
    this.trampolines = this.trampolines.filter(t => !t.isFarBehind(this.player.x));
    this.coins = this.coins.filter(c => !c.isFarBehind(this.player.x));
    this.enemies = this.enemies.filter(e => !e.isFarBehind(this.player.x));
  }
}
