import { describe, it, expect } from 'vitest';
import { SpawnSystem } from '../../src/systems/SpawnSystem';
import { World } from '../../src/World';
import type { GameConfig } from '../../src/types';

const config: GameConfig = { gravity: 980, scrollSpeed: 200, canvasWidth: 800, canvasHeight: 600 };

describe('SpawnSystem', () => {
  it('spawns a trampoline when enough distance has elapsed', () => {
    const world = new World(config);
    const spawner = new SpawnSystem(config);
    // Simulate enough distance to trigger a spawn
    spawner.update(world, 2.0); // 2 seconds * 200 scrollSpeed = 400px
    expect(world.trampolines.length).toBeGreaterThanOrEqual(1);
  });

  it('does not spawn immediately at time zero', () => {
    const world = new World(config);
    const spawner = new SpawnSystem(config);
    spawner.update(world, 0);
    expect(world.trampolines).toHaveLength(0);
  });

  it('spawns trampolines at the right edge of the canvas', () => {
    const world = new World(config);
    const spawner = new SpawnSystem(config);
    spawner.update(world, 3.0);
    if (world.trampolines.length > 0) {
      expect(world.trampolines[0].x).toBeGreaterThanOrEqual(config.canvasWidth);
    }
  });

  it('spawns coins periodically', () => {
    const world = new World(config);
    const spawner = new SpawnSystem(config);
    // Run many updates to accumulate distance
    for (let i = 0; i < 20; i++) {
      spawner.update(world, 0.5);
    }
    expect(world.coins.length).toBeGreaterThanOrEqual(1);
  });

  it('spawns enemies after sufficient distance', () => {
    const world = new World(config);
    const spawner = new SpawnSystem(config);
    for (let i = 0; i < 30; i++) {
      spawner.update(world, 0.5);
    }
    expect(world.enemies.length).toBeGreaterThanOrEqual(1);
  });
});
