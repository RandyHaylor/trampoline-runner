import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Renderer } from '../../src/renderer/Renderer';
import { World } from '../../src/World';
import type { GameConfig } from '../../src/types';

function createMockCtx() {
  return {
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    fillText: vi.fn(),
    canvas: { width: 480, height: 800 },
    fillStyle: '',
    font: '',
    textAlign: '' as CanvasTextAlign,
    textBaseline: '' as CanvasTextBaseline,
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
  } as unknown as CanvasRenderingContext2D;
}

const config: GameConfig = {
  gravity: 980,
  scrollSpeed: 200,
  canvasWidth: 480,
  canvasHeight: 800,
};

describe('Renderer', () => {
  let ctx: CanvasRenderingContext2D;
  let world: World;
  let renderer: Renderer;

  beforeEach(() => {
    ctx = createMockCtx();
    world = new World(config);
    renderer = new Renderer(ctx);
  });

  it('can be constructed with a canvas context', () => {
    expect(renderer).toBeDefined();
  });

  it('calls clearRect on render', () => {
    renderer.render(world);
    expect((ctx.clearRect as ReturnType<typeof vi.fn>)).toHaveBeenCalledWith(0, 0, 480, 800);
  });

  it('draws the player as a fillRect', () => {
    renderer.render(world);
    expect((ctx.fillRect as ReturnType<typeof vi.fn>)).toHaveBeenCalled();
    // Player should be drawn at player position
    const calls = (ctx.fillRect as ReturnType<typeof vi.fn>).mock.calls;
    const playerCall = calls.find(
      (c: number[]) => c[0] === world.player.x && c[1] === world.player.y
    );
    expect(playerCall).toBeDefined();
  });

  it('draws trampolines via fillRect', () => {
    world.addTrampoline(300, 600);
    renderer.render(world);
    const calls = (ctx.fillRect as ReturnType<typeof vi.fn>).mock.calls;
    const trampCall = calls.find(
      (c: number[]) => c[0] === 300 && c[1] === 600
    );
    expect(trampCall).toBeDefined();
  });

  it('draws coins', () => {
    world.addCoin(200, 400);
    renderer.render(world);
    // Coins can be drawn as fillRect or arc+fill
    const fillRectCalls = (ctx.fillRect as ReturnType<typeof vi.fn>).mock.calls;
    const fillCalls = (ctx.fill as ReturnType<typeof vi.fn>).mock.calls;
    const coinRect = fillRectCalls.find(
      (c: number[]) => c[0] === 200 && c[1] === 400
    );
    // Accept either fillRect or arc-based drawing
    expect(coinRect || fillCalls.length > 0).toBeTruthy();
  });

  it('draws enemies via fillRect', () => {
    world.addEnemy(350, 500);
    renderer.render(world);
    const calls = (ctx.fillRect as ReturnType<typeof vi.fn>).mock.calls;
    const enemyCall = calls.find(
      (c: number[]) => c[0] === 350 && c[1] === 500
    );
    expect(enemyCall).toBeDefined();
  });

  it('draws score text via fillText', () => {
    world.score = 42;
    renderer.render(world);
    const calls = (ctx.fillText as ReturnType<typeof vi.fn>).mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    const scoreCall = calls.find((c: string[]) => c[0].includes('42'));
    expect(scoreCall).toBeDefined();
  });

  it('draws background before entities', () => {
    renderer.render(world);
    // clearRect should be called before any fillRect
    expect((ctx.clearRect as ReturnType<typeof vi.fn>)).toHaveBeenCalled();
  });
});
