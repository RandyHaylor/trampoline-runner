import { describe, it, expect } from "vitest";
import { WorldGen, WorldGenConfig } from "../../src/systems/WorldGen";

function makeConfig(overrides?: Partial<WorldGenConfig>): WorldGenConfig {
  return {
    cellSize: 100,
    trampolines: { chance: 0.3, minSpacing: 2, sizeRange: { min: 60, max: 140 } },
    coins: { chance: 0.4, minSpacing: 1 },
    enemies: { chance: 0.2, minSpacing: 3 },
    ...overrides,
  };
}

describe("WorldGen", () => {
  it("produces deterministic output for the same viewport", () => {
    const gen = new WorldGen(makeConfig());
    const a = gen.getEntitiesInView(0, 0, 800, 600);
    const b = gen.getEntitiesInView(0, 0, 800, 600);
    expect(a).toEqual(b);
  });

  it("produces different layouts for different positions", () => {
    const gen = new WorldGen(makeConfig());
    const a = gen.getEntitiesInView(0, 0, 800, 600);
    const b = gen.getEntitiesInView(5000, 5000, 800, 600);
    // Different camera positions should produce different entity positions
    const aPositions = a.trampolines.map((t) => `${t.x},${t.y}`).join(";");
    const bPositions = b.trampolines.map((t) => `${t.x},${t.y}`).join(";");
    expect(aPositions).not.toEqual(bPositions);
  });

  it("only returns entities within viewport + 25% buffer zone", () => {
    const cellSize = 100;
    const gen = new WorldGen(makeConfig({ cellSize }));
    const cameraX = 1000;
    const cameraY = 1000;
    const vw = 800;
    const vh = 600;
    const result = gen.getEntitiesInView(cameraX, cameraY, vw, vh);

    const bufferX = vw * 0.25;
    const bufferY = vh * 0.25;
    const left = cameraX - bufferX;
    const right = cameraX + vw + bufferX;
    const top = cameraY - bufferY;
    const bottom = cameraY + vh + bufferY;

    // Align bounds to grid cells
    const minX = Math.floor(left / cellSize) * cellSize;
    const maxX = Math.floor(right / cellSize) * cellSize;
    const minY = Math.floor(top / cellSize) * cellSize;
    const maxY = Math.floor(bottom / cellSize) * cellSize;

    for (const t of result.trampolines) {
      expect(t.x).toBeGreaterThanOrEqual(minX);
      expect(t.x).toBeLessThanOrEqual(maxX);
      expect(t.y).toBeGreaterThanOrEqual(minY);
      expect(t.y).toBeLessThanOrEqual(maxY);
    }
    for (const c of result.coins) {
      expect(c.x).toBeGreaterThanOrEqual(minX);
      expect(c.x).toBeLessThanOrEqual(maxX);
      expect(c.y).toBeGreaterThanOrEqual(minY);
      expect(c.y).toBeLessThanOrEqual(maxY);
    }
    for (const e of result.enemies) {
      expect(e.x).toBeGreaterThanOrEqual(minX);
      expect(e.x).toBeLessThanOrEqual(maxX);
      expect(e.y).toBeGreaterThanOrEqual(minY);
      expect(e.y).toBeLessThanOrEqual(maxY);
    }
  });

  it("enforces neighbor spacing (no two trampolines within minSpacing)", () => {
    // Use high chance so many would spawn without spacing
    const gen = new WorldGen(
      makeConfig({
        trampolines: { chance: 0.9, minSpacing: 2, sizeRange: { min: 60, max: 140 } },
      })
    );
    const result = gen.getEntitiesInView(0, 0, 2000, 2000);
    const cellSize = 100;
    const minDist = 2 * cellSize;

    for (let i = 0; i < result.trampolines.length; i++) {
      for (let j = i + 1; j < result.trampolines.length; j++) {
        const a = result.trampolines[i];
        const b = result.trampolines[j];
        const dist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
        expect(dist).toBeGreaterThanOrEqual(minDist);
      }
    }
  });

  it("chance=0 means no spawns", () => {
    const gen = new WorldGen(
      makeConfig({
        trampolines: { chance: 0, minSpacing: 1 },
        coins: { chance: 0, minSpacing: 1 },
        enemies: { chance: 0, minSpacing: 1 },
      })
    );
    const result = gen.getEntitiesInView(0, 0, 800, 600);
    expect(result.trampolines).toHaveLength(0);
    expect(result.coins).toHaveLength(0);
    expect(result.enemies).toHaveLength(0);
  });

  it("chance=1 yields maximum spawns (limited only by spacing)", () => {
    const gen = new WorldGen(
      makeConfig({
        trampolines: { chance: 1, minSpacing: 0 },
        coins: { chance: 1, minSpacing: 0 },
        enemies: { chance: 1, minSpacing: 0 },
      })
    );
    const result = gen.getEntitiesInView(0, 0, 400, 400);
    // With chance=1 and minSpacing=0, every grid cell should spawn
    // viewport 400x400 with cellSize 100 + 25% buffer means ~6x6 grid = 36 cells roughly
    expect(result.trampolines.length).toBeGreaterThan(10);
    expect(result.coins.length).toBeGreaterThan(10);
    expect(result.enemies.length).toBeGreaterThan(10);
  });

  it("trampoline width falls within sizeRange", () => {
    const sizeRange = { min: 50, max: 150 };
    const gen = new WorldGen(
      makeConfig({
        trampolines: { chance: 0.8, minSpacing: 0, sizeRange },
      })
    );
    const result = gen.getEntitiesInView(0, 0, 2000, 2000);
    expect(result.trampolines.length).toBeGreaterThan(0);
    for (const t of result.trampolines) {
      expect(t.width).toBeGreaterThanOrEqual(sizeRange.min);
      expect(t.width).toBeLessThanOrEqual(sizeRange.max);
    }
  });

  it("collected coins do not reappear", () => {
    const collected = new Set<string>();
    const gen = new WorldGen(
      makeConfig({ coins: { chance: 1, minSpacing: 0 } }),
      collected
    );
    const first = gen.getEntitiesInView(0, 0, 400, 400);
    expect(first.coins.length).toBeGreaterThan(0);

    // Collect all coins
    for (const c of first.coins) {
      gen.collectCoin(c.x, c.y);
    }

    const second = gen.getEntitiesInView(0, 0, 400, 400);
    expect(second.coins).toHaveLength(0);
  });

  it("works with negative coordinates", () => {
    const gen = new WorldGen(makeConfig());
    const result = gen.getEntitiesInView(-1000, -1000, 800, 600);
    // Should not throw, and all entity positions should be negative or near-negative
    const allX = [
      ...result.trampolines.map((t) => t.x),
      ...result.coins.map((c) => c.x),
      ...result.enemies.map((e) => e.x),
    ];
    if (allX.length > 0) {
      expect(Math.max(...allX)).toBeLessThanOrEqual(0);
    }
  });

  it("entities are placed at multiples of cellSize", () => {
    const cellSize = 100;
    const gen = new WorldGen(makeConfig({ cellSize }));
    const result = gen.getEntitiesInView(0, 0, 800, 600);

    for (const t of result.trampolines) {
      expect(Math.abs(t.x % cellSize)).toBe(0);
      expect(Math.abs(t.y % cellSize)).toBe(0);
    }
    for (const c of result.coins) {
      expect(Math.abs(c.x % cellSize)).toBe(0);
      expect(Math.abs(c.y % cellSize)).toBe(0);
    }
    for (const e of result.enemies) {
      expect(Math.abs(e.x % cellSize)).toBe(0);
      expect(Math.abs(e.y % cellSize)).toBe(0);
    }
  });
});
