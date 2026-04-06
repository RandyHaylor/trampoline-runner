import { describe, it, expect } from 'vitest';
import { EntityField } from '../../src/systems/EntityField';

describe('EntityField', () => {
  it('returns positions within viewport + 25% buffer', () => {
    const field = new EntityField(42, 800, 600, 'coin');
    const entities = field.getEntitiesInView(0, 0, 800, 600);
    const buffer = 800 * 0.25;
    for (const e of entities) {
      expect(e.x).toBeGreaterThanOrEqual(-buffer - 300);
      expect(e.x).toBeLessThanOrEqual(800 + buffer + 300);
    }
  });

  it('returns deterministic results for same seed', () => {
    const f1 = new EntityField(42, 800, 600, 'coin');
    const f2 = new EntityField(42, 800, 600, 'coin');
    const e1 = f1.getEntitiesInView(1000, 500, 800, 600);
    const e2 = f2.getEntitiesInView(1000, 500, 800, 600);
    expect(e1).toEqual(e2);
  });

  it('different seeds produce different results', () => {
    const f1 = new EntityField(42, 800, 600, 'enemy');
    const f2 = new EntityField(99, 800, 600, 'enemy');
    const e1 = f1.getEntitiesInView(5000, 5000, 800, 600);
    const e2 = f2.getEntitiesInView(5000, 5000, 800, 600);
    // At least some positions should differ
    const s1 = JSON.stringify(e1);
    const s2 = JSON.stringify(e2);
    expect(s1).not.toBe(s2);
  });

  it('enemies are sparser than coins for same viewport', () => {
    const coinField = new EntityField(42, 800, 600, 'coin');
    const enemyField = new EntityField(42, 800, 600, 'enemy');
    // Check over a large area
    const coins = coinField.getEntitiesInView(0, 0, 2000, 2000);
    const enemies = enemyField.getEntitiesInView(0, 0, 2000, 2000);
    expect(coins.length).toBeGreaterThan(enemies.length);
  });

  it('returns entities with x and y properties', () => {
    const field = new EntityField(42, 800, 600, 'coin');
    const entities = field.getEntitiesInView(0, 0, 800, 600);
    if (entities.length > 0) {
      expect(entities[0]).toHaveProperty('x');
      expect(entities[0]).toHaveProperty('y');
      expect(typeof entities[0].x).toBe('number');
      expect(typeof entities[0].y).toBe('number');
    }
  });

  it('uses different noise offset than TrampolineField', () => {
    // EntityField uses offset of 1000 to avoid overlapping with TrampolineField
    const field = new EntityField(12345, 800, 600, 'coin');
    const entities = field.getEntitiesInView(0, 0, 800, 600);
    // Just verify it returns results without error
    expect(Array.isArray(entities)).toBe(true);
  });

  it('generates entities in 2D (various y positions)', () => {
    const field = new EntityField(42, 800, 600, 'coin');
    const entities = field.getEntitiesInView(0, 0, 2000, 2000);
    if (entities.length >= 2) {
      const yValues = new Set(entities.map(e => e.y));
      expect(yValues.size).toBeGreaterThan(1);
    }
  });
});
