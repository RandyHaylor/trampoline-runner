import { PerlinNoise } from '../math/PerlinNoise';
import { Trampoline } from '../entities/Trampoline';

const CELL_SIZE = 250;
const NOISE_THRESHOLD = 0.1;
const MIN_WIDTH = 80;
const MAX_WIDTH = 300;
const NOISE_SCALE = 0.05;

export class TrampolineField {
  private noise: PerlinNoise;
  private canvasWidth: number;
  private canvasHeight: number;

  constructor(seed: number, canvasWidth: number, canvasHeight: number) {
    this.noise = new PerlinNoise(seed);
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  getTrampolinesInView(
    cameraX: number,
    cameraY: number,
    viewportWidth: number,
    viewportHeight: number,
  ): Trampoline[] {
    const buffer = viewportWidth * 0.25;

    const left = cameraX - buffer;
    const right = cameraX + viewportWidth + buffer;
    const top = cameraY - buffer;
    const bottom = cameraY + viewportHeight + buffer;

    const cellLeft = Math.floor(left / CELL_SIZE);
    const cellRight = Math.floor(right / CELL_SIZE);
    const cellTop = Math.floor(top / CELL_SIZE);
    const cellBottom = Math.floor(bottom / CELL_SIZE);

    const trampolines: Trampoline[] = [];

    for (let cx = cellLeft; cx <= cellRight; cx++) {
      for (let cy = cellTop; cy <= cellBottom; cy++) {
        const noiseVal = this.noise.noise2D(cx * NOISE_SCALE, cy * NOISE_SCALE);
        if (noiseVal > NOISE_THRESHOLD) {
          // Map noise from (THRESHOLD, 1] to [MIN_WIDTH, MAX_WIDTH]
          const t = (noiseVal - NOISE_THRESHOLD) / (1 - NOISE_THRESHOLD);
          const width = MIN_WIDTH + t * (MAX_WIDTH - MIN_WIDTH);
          const x = cx * CELL_SIZE;
          const y = cy * CELL_SIZE;
          trampolines.push(new Trampoline(x, y, width));
        }
      }
    }

    return trampolines;
  }
}
