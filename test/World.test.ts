import { describe, it, expect } from 'vitest';
import { World } from '../src/World';
import type { GameConfig } from '../src/types';

const config: GameConfig = { gravity: 980, scrollSpeed: 200, canvasWidth: 800, canvasHeight: 600 };

describe('World', () => {
  it('initializes with a player and empty entity lists', () => {
    const w = new World(config);
    expect(w.player).toBeDefined();
    expect(w.trampolines).toEqual([]);
    expect(w.coins).toEqual([]);
    expect(w.enemies).toEqual([]);
  });

  it('stores the game config', () => {
    const w = new World(config);
    expect(w.config).toBe(config);
  });

  it('addTrampoline adds to trampolines array', () => {
    const w = new World(config);
    w.addTrampoline(400, 500);
    expect(w.trampolines).toHaveLength(1);
    expect(w.trampolines[0].x).toBe(400);
  });

  it('update moves the player with gravity', () => {
    const w = new World(config);
    const initialY = w.player.y;
    w.update(0.016);
    expect(w.player.y).not.toBe(initialY);
  });

  it('update scrolls trampolines and removes offscreen ones', () => {
    const w = new World(config);
    w.addTrampoline(-190, 300); // almost offscreen
    w.update(1); // scroll 200 pixels left => x = -390, offscreen
    expect(w.trampolines).toHaveLength(0);
  });
});
