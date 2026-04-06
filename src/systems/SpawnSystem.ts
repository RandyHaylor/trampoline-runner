import type { GameConfig } from '../types';
import { World } from '../World';

const TRAMPOLINE_INTERVAL = 300; // pixels between trampolines
const COIN_INTERVAL = 200; // pixels between coins
const ENEMY_INTERVAL = 600; // pixels between enemies

export class SpawnSystem {
  private config: GameConfig;
  private lastTrampolineSpawnX: number;
  private lastCoinSpawnX: number;
  private lastEnemySpawnX: number;

  constructor(config: GameConfig) {
    this.config = config;
    this.lastTrampolineSpawnX = 0;
    this.lastCoinSpawnX = 0;
    this.lastEnemySpawnX = 0;
  }

  update(world: World, _dt: number): void {
    const playerX = world.player.x;

    if (playerX - this.lastTrampolineSpawnX >= TRAMPOLINE_INTERVAL) {
      const y = this.config.canvasHeight * 0.6 + Math.random() * (this.config.canvasHeight * 0.3);
      world.addTrampoline(playerX + this.config.canvasWidth, y);
      this.lastTrampolineSpawnX = playerX;
    }

    if (playerX - this.lastCoinSpawnX >= COIN_INTERVAL) {
      const y = this.config.canvasHeight * 0.2 + Math.random() * (this.config.canvasHeight * 0.4);
      world.addCoin(playerX + this.config.canvasWidth, y);
      this.lastCoinSpawnX = playerX;
    }

    if (playerX - this.lastEnemySpawnX >= ENEMY_INTERVAL) {
      const y = this.config.canvasHeight * 0.5 + Math.random() * (this.config.canvasHeight * 0.3);
      world.addEnemy(playerX + this.config.canvasWidth, y);
      this.lastEnemySpawnX = playerX;
    }
  }
}
