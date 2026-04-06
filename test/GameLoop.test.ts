import { describe, it, expect } from 'vitest';
import { GameLoop } from '../src/GameLoop';
import { World } from '../src/World';
import type { GameConfig } from '../src/types';

const config: GameConfig = { gravity: 980, scrollSpeed: 200, canvasWidth: 800, canvasHeight: 600 };

describe('GameLoop', () => {
  it('constructs with a world', () => {
    const world = new World(config);
    const loop = new GameLoop(world);
    expect(loop.world).toBe(world);
  });

  it('tick advances the world by dt', () => {
    const world = new World(config);
    const loop = new GameLoop(world);
    const yBefore = world.player.y;
    loop.tick(0.016);
    expect(world.player.y).not.toBe(yBefore);
  });

  it('tick returns the updated world', () => {
    const world = new World(config);
    const loop = new GameLoop(world);
    const result = loop.tick(0.016);
    expect(result).toBe(world);
  });

  it('tracks elapsed time', () => {
    const world = new World(config);
    const loop = new GameLoop(world);
    loop.tick(0.5);
    loop.tick(0.3);
    expect(loop.elapsed).toBeCloseTo(0.8);
  });
});
