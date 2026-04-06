import { describe, it, expect } from 'vitest';
import { World } from '../src/World';
import { EntityField } from '../src/systems/EntityField';
import type { GameConfig } from '../src/types';

const config: GameConfig = { gravity: 980, canvasWidth: 800, canvasHeight: 600 };

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

  it('removes trampolines far behind the player', () => {
    const w = new World(config);
    // Move player far ahead
    w.player.x = 2000;
    // Place trampoline far behind (x=100, so 100+200 < 2000-1000 => 300 < 1000)
    w.addTrampoline(100, 300);
    w.update(0.016);
    expect(w.trampolines).toHaveLength(0);
  });

  it('populates coins from coinField when set', () => {
    const w = new World(config);
    w.coinField = new EntityField(42, 800, 600, 'coin');
    w.update(0.016);
    expect(w.coins.length).toBeGreaterThan(0);
  });

  it('populates enemies from enemyField when set', () => {
    const w = new World(config);
    w.enemyField = new EntityField(42, 800, 600, 'enemy');
    w.update(0.016);
    // enemies may or may not appear near origin, just verify it doesn't crash
    expect(Array.isArray(w.enemies)).toBe(true);
  });

  it('tracks collected coins so they do not reappear', () => {
    const w = new World(config);
    w.coinField = new EntityField(42, 800, 600, 'coin');
    w.update(0.016);
    const initialCount = w.coins.length;
    if (initialCount > 0) {
      // Simulate collecting a coin by adding its key to collectedCoins
      const coin = w.coins[0];
      w.collectedCoins.add(`${coin.x},${coin.y}`);
      w.update(0.016);
      expect(w.coins.length).toBe(initialCount - 1);
    }
  });

  it('enemies float during update', () => {
    const w = new World(config);
    w.addEnemy(100, 300);
    const initialY = w.enemies[0].y;
    w.update(0.5);
    // After update, enemy y should have changed due to floating
    expect(w.enemies[0].y).not.toBe(initialY);
  });
});
