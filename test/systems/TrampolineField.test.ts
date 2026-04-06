import { describe, it, expect } from 'vitest';
import { TrampolineField } from '../../src/systems/TrampolineField';

const SEED = 42;
const CANVAS_W = 800;
const CANVAS_H = 600;

describe('TrampolineField', () => {
  it('returns trampolines within viewport area', () => {
    const field = new TrampolineField(SEED, CANVAS_W, CANVAS_H);
    const result = field.getTrampolinesInView(0, 0, CANVAS_W, CANVAS_H);
    expect(result.length).toBeGreaterThan(0);
    for (const t of result) {
      expect(t.bounds).toBeDefined();
    }
  });

  it('is deterministic: same position returns same trampolines', () => {
    const field1 = new TrampolineField(SEED, CANVAS_W, CANVAS_H);
    const field2 = new TrampolineField(SEED, CANVAS_W, CANVAS_H);
    const r1 = field1.getTrampolinesInView(500, 300, CANVAS_W, CANVAS_H);
    const r2 = field2.getTrampolinesInView(500, 300, CANVAS_W, CANVAS_H);
    expect(r1.length).toBe(r2.length);
    for (let i = 0; i < r1.length; i++) {
      expect(r1[i].x).toBe(r2[i].x);
      expect(r1[i].y).toBe(r2[i].y);
      expect(r1[i].width).toBe(r2[i].width);
    }
  });

  it('trampoline widths vary (not all the same)', () => {
    const field = new TrampolineField(SEED, CANVAS_W, CANVAS_H);
    // Sample a large area to get variety
    const result = field.getTrampolinesInView(0, 0, 2000, 2000);
    expect(result.length).toBeGreaterThan(2);
    const widths = new Set(result.map(t => t.width));
    expect(widths.size).toBeGreaterThan(1);
  });

  it('returns trampolines for negative coordinates', () => {
    const field = new TrampolineField(SEED, CANVAS_W, CANVAS_H);
    const result = field.getTrampolinesInView(-2000, -2000, CANVAS_W, CANVAS_H);
    expect(result.length).toBeGreaterThan(0);
    const hasNegative = result.some(t => t.x < 0 || t.y < 0);
    expect(hasNegative).toBe(true);
  });

  it('produces many trampolines (dense field)', () => {
    const field = new TrampolineField(SEED, CANVAS_W, CANVAS_H);
    const result = field.getTrampolinesInView(0, 0, CANVAS_W, CANVAS_H);
    // With cell size 250 and 800x600 viewport + buffer, expect several
    expect(result.length).toBeGreaterThanOrEqual(3);
  });

  it('buffer zone: returns trampolines slightly outside viewport', () => {
    const field = new TrampolineField(SEED, CANVAS_W, CANVAS_H);
    const allResult = field.getTrampolinesInView(0, 0, CANVAS_W, CANVAS_H);
    // Check that some trampolines are outside the strict viewport but within buffer
    const outsideViewport = allResult.filter(
      t => t.x < 0 || t.x > CANVAS_W || t.y < 0 || t.y > CANVAS_H
    );
    // Buffer is 25% of viewport width = 200px, so we should find some outside
    expect(outsideViewport.length).toBeGreaterThan(0);
  });
});
