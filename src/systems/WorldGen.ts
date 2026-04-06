import { hashRandom } from "../math/HashRandom";

export interface SpawnConfig {
  chance: number; // 0-1
  minSpacing: number; // in grid cells
  sizeRange?: { min: number; max: number };
}

export interface WorldGenConfig {
  cellSize?: number; // default 100
  trampolines: SpawnConfig;
  coins: SpawnConfig;
  enemies: SpawnConfig;
}

export interface WorldGenEntities {
  trampolines: Array<{ x: number; y: number; width: number }>;
  coins: Array<{ x: number; y: number }>;
  enemies: Array<{ x: number; y: number }>;
}

type EntityType = "trampolines" | "coins" | "enemies";

const CHANNEL_OFFSET: Record<EntityType, number> = {
  trampolines: 0,
  coins: 1,
  enemies: 2,
};

export class WorldGen {
  private readonly cellSize: number;
  private readonly configs: Record<EntityType, SpawnConfig>;
  private readonly collectedCoins: Set<string>;

  constructor(config: WorldGenConfig, collectedCoins?: Set<string>) {
    this.cellSize = config.cellSize ?? 100;
    this.configs = {
      trampolines: config.trampolines,
      coins: config.coins,
      enemies: config.enemies,
    };
    this.collectedCoins = collectedCoins ?? new Set();
  }

  private hash(gridX: number, gridY: number, type: EntityType): number {
    return hashRandom(gridX * 3 + CHANNEL_OFFSET[type], gridY);
  }

  private shouldSpawn(
    gridX: number,
    gridY: number,
    type: EntityType
  ): boolean {
    const config = this.configs[type];
    const h = this.hash(gridX, gridY, type);
    if (h >= config.chance) return false;

    // Neighbor spacing: check all cells within minSpacing radius
    const r = config.minSpacing;
    for (let dx = -r; dx <= r; dx++) {
      for (let dy = -r; dy <= r; dy++) {
        if (dx === 0 && dy === 0) continue;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > r) continue;
        const nx = gridX + dx;
        const ny = gridY + dy;
        const nh = this.hash(nx, ny, type);
        if (nh < config.chance && nh > h) {
          // Neighbor also wants to spawn and has higher hash — we lose
          return false;
        }
      }
    }
    return true;
  }

  getEntitiesInView(
    cameraX: number,
    cameraY: number,
    viewportWidth: number,
    viewportHeight: number
  ): WorldGenEntities {
    const bufferX = viewportWidth * 0.25;
    const bufferY = viewportHeight * 0.25;

    const left = cameraX - bufferX;
    const right = cameraX + viewportWidth + bufferX;
    const top = cameraY - bufferY;
    const bottom = cameraY + viewportHeight + bufferY;

    const minGX = Math.floor(left / this.cellSize);
    const maxGX = Math.floor(right / this.cellSize);
    const minGY = Math.floor(top / this.cellSize);
    const maxGY = Math.floor(bottom / this.cellSize);

    const result: WorldGenEntities = {
      trampolines: [],
      coins: [],
      enemies: [],
    };

    for (let gx = minGX; gx <= maxGX; gx++) {
      for (let gy = minGY; gy <= maxGY; gy++) {
        const worldX = gx * this.cellSize;
        const worldY = gy * this.cellSize;

        // Trampolines
        if (this.shouldSpawn(gx, gy, "trampolines")) {
          const cfg = this.configs.trampolines;
          let width = this.cellSize;
          if (cfg.sizeRange) {
            const sizeHash = hashRandom(gx * 3 + 10, gy);
            width =
              cfg.sizeRange.min +
              sizeHash * (cfg.sizeRange.max - cfg.sizeRange.min);
          }
          result.trampolines.push({ x: worldX, y: worldY, width });
        }

        // Coins
        if (this.shouldSpawn(gx, gy, "coins")) {
          const key = `${gx},${gy}`;
          if (!this.collectedCoins.has(key)) {
            result.coins.push({ x: worldX, y: worldY });
          }
        }

        // Enemies
        if (this.shouldSpawn(gx, gy, "enemies")) {
          result.enemies.push({ x: worldX, y: worldY });
        }
      }
    }

    return result;
  }

  collectCoin(x: number, y: number): void {
    const gx = Math.round(x / this.cellSize);
    const gy = Math.round(y / this.cellSize);
    this.collectedCoins.add(`${gx},${gy}`);
  }
}
