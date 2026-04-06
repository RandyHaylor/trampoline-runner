import type { GameConfig } from './types';
import { Player } from './entities/Player';
import { Trampoline } from './entities/Trampoline';
import { Coin } from './entities/Coin';
import { Enemy } from './entities/Enemy';
import { CollisionSystem } from './systems/CollisionSystem';
import { bounceVelocityFor } from './physics/bounce';
import { TrampolineField } from './systems/TrampolineField';
import { EntityField } from './systems/EntityField';

export class World {
  config: GameConfig;
  player: Player;
  trampolines: Trampoline[];
  trampolineField: TrampolineField | null;
  coinField: EntityField | null;
  enemyField: EntityField | null;
  coins: Coin[];
  enemies: Enemy[];
  score: number;
  cameraX: number;
  cameraY: number;
  collectedCoins: Set<string>;

  constructor(config: GameConfig) {
    this.config = config;
    this.player = new Player(config.canvasWidth * 0.2, config.canvasHeight * 0.5);
    this.trampolines = [];
    this.trampolineField = null;
    this.coinField = null;
    this.enemyField = null;
    this.coins = [];
    this.enemies = [];
    this.score = 0;
    this.cameraX = 0;
    this.cameraY = 0;
    this.collectedCoins = new Set();
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

  private coinKey(x: number, y: number): string {
    return `${x},${y}`;
  }

  update(dt: number): void {
    this.player.update(dt, this.config.gravity);

    // Get trampolines from field if available
    if (this.trampolineField) {
      this.trampolines = this.trampolineField.getTrampolinesInView(
        this.cameraX,
        this.cameraY,
        this.config.canvasWidth,
        this.config.canvasHeight,
      );
    }

    // Get coins from field if available
    if (this.coinField) {
      const coinPositions = this.coinField.getEntitiesInView(
        this.cameraX,
        this.cameraY,
        this.config.canvasWidth,
        this.config.canvasHeight,
      );
      this.coins = coinPositions
        .filter(p => !this.collectedCoins.has(this.coinKey(p.x, p.y)))
        .map(p => new Coin(p.x, p.y));
    }

    // Get enemies from field if available
    if (this.enemyField) {
      const enemyPositions = this.enemyField.getEntitiesInView(
        this.cameraX,
        this.cameraY,
        this.config.canvasWidth,
        this.config.canvasHeight,
      );
      this.enemies = enemyPositions.map(p => new Enemy(p.x, p.y));
    }

    // Update enemy floating
    for (const enemy of this.enemies) {
      enemy.update(dt);
    }

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
        this.collectedCoins.add(this.coinKey(c.x, c.y));
        return false;
      }
      return true;
    });

    // Remove entities far behind the player (only for non-field mode)
    if (!this.trampolineField) {
      this.trampolines = this.trampolines.filter(t => !t.isFarBehind(this.player.x));
    }
    if (!this.coinField) {
      this.coins = this.coins.filter(c => !c.isFarBehind(this.player.x));
    }
    if (!this.enemyField) {
      this.enemies = this.enemies.filter(e => !e.isFarBehind(this.player.x));
    }
  }
}
