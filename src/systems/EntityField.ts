import { PerlinNoise } from '../math/PerlinNoise';

const CELL_SIZE = 200;
const NOISE_SCALE = 0.08; // Different from TrampolineField's 0.05
const NOISE_OFFSET = 1000; // Offset to avoid overlapping with TrampolineField noise space
const COIN_THRESHOLD = 0.05;
const ENEMY_THRESHOLD = 0.25; // Higher = sparser

export type EntityType = 'coin' | 'enemy';

export interface EntityPosition {
  x: number;
  y: number;
}

export class EntityField {
  private noise: PerlinNoise;
  private canvasWidth: number;
  private canvasHeight: number;
  private entityType: EntityType;
  private threshold: number;

  constructor(seed: number, canvasWidth: number, canvasHeight: number, entityType: EntityType) {
    this.noise = new PerlinNoise(seed);
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.entityType = entityType;
    this.threshold = entityType === 'coin' ? COIN_THRESHOLD : ENEMY_THRESHOLD;
  }

  getEntitiesInView(
    cameraX: number,
    cameraY: number,
    viewportWidth: number,
    viewportHeight: number,
  ): EntityPosition[] {
    const buffer = viewportWidth * 0.25;

    const left = cameraX - buffer;
    const right = cameraX + viewportWidth + buffer;
    const top = cameraY - buffer;
    const bottom = cameraY + viewportHeight + buffer;

    const cellLeft = Math.floor(left / CELL_SIZE);
    const cellRight = Math.floor(right / CELL_SIZE);
    const cellTop = Math.floor(top / CELL_SIZE);
    const cellBottom = Math.floor(bottom / CELL_SIZE);

    const entities: EntityPosition[] = [];

    for (let cx = cellLeft; cx <= cellRight; cx++) {
      for (let cy = cellTop; cy <= cellBottom; cy++) {
        const noiseVal = this.noise.noise2D(
          cx * NOISE_SCALE + NOISE_OFFSET,
          cy * NOISE_SCALE + NOISE_OFFSET,
        );
        if (noiseVal > this.threshold) {
          entities.push({
            x: cx * CELL_SIZE,
            y: cy * CELL_SIZE,
          });
        }
      }
    }

    return entities;
  }
}
