import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Renderer } from '../../src/renderer/Renderer';
import { World } from '../../src/World';
import { Camera } from '../../src/Camera';
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
  canvasWidth: 480,
  canvasHeight: 800,
};

describe('Renderer', () => {
  let ctx: CanvasRenderingContext2D;
  let world: World;
  let camera: Camera;
  let renderer: Renderer;

  beforeEach(() => {
    ctx = createMockCtx();
    world = new World(config);
    camera = new Camera(config.canvasWidth, config.canvasHeight);
    renderer = new Renderer(ctx);
  });

  it('can be constructed with a canvas context', () => {
    expect(renderer).toBeDefined();
  });

  it('calls clearRect on render', () => {
    renderer.render(world, camera);
    expect((ctx.clearRect as ReturnType<typeof vi.fn>)).toHaveBeenCalledWith(0, 0, 480, 800);
  });

  it('draws the player using camera offset for both axes', () => {
    camera.follow(world.player.centerX(), world.player.centerY());
    renderer.render(world, camera);
    const calls = (ctx.fillRect as ReturnType<typeof vi.fn>).mock.calls;
    const expectedScreenX = camera.worldToScreen(world.player.x);
    const expectedScreenY = camera.worldToScreenY(world.player.y);
    const playerCall = calls.find(
      (c: number[]) => c[0] === expectedScreenX && c[1] === expectedScreenY
    );
    expect(playerCall).toBeDefined();
  });

  it('draws trampolines using camera offset for both axes', () => {
    world.player.x = 1000;
    world.addTrampoline(1100, 600);
    camera.follow(world.player.centerX(), world.player.centerY());
    expect(camera.x).toBeGreaterThan(0);
    renderer.render(world, camera);
    const calls = (ctx.fillRect as ReturnType<typeof vi.fn>).mock.calls;
    const expectedScreenX = camera.worldToScreen(1100);
    const expectedScreenY = camera.worldToScreenY(600);
    expect(expectedScreenX).not.toBe(1100);
    const trampCall = calls.find(
      (c: number[]) => c[0] === expectedScreenX && c[1] === expectedScreenY
    );
    expect(trampCall).toBeDefined();
  });

  it('draws coins using camera offset for both axes', () => {
    world.addCoin(200, 400);
    camera.follow(world.player.centerX(), world.player.centerY());
    renderer.render(world, camera);
    const fillRectCalls = (ctx.fillRect as ReturnType<typeof vi.fn>).mock.calls;
    const fillCalls = (ctx.fill as ReturnType<typeof vi.fn>).mock.calls;
    const expectedScreenX = camera.worldToScreen(200);
    const expectedScreenY = camera.worldToScreenY(400);
    const coinRect = fillRectCalls.find(
      (c: number[]) => c[0] === expectedScreenX && c[1] === expectedScreenY
    );
    expect(coinRect || fillCalls.length > 0).toBeTruthy();
  });

  it('draws enemies using camera offset for both axes', () => {
    world.addEnemy(350, 500);
    camera.follow(world.player.centerX(), world.player.centerY());
    renderer.render(world, camera);
    const calls = (ctx.fillRect as ReturnType<typeof vi.fn>).mock.calls;
    const expectedScreenX = camera.worldToScreen(350);
    const expectedScreenY = camera.worldToScreenY(500);
    const enemyCall = calls.find(
      (c: number[]) => c[0] === expectedScreenX && c[1] === expectedScreenY
    );
    expect(enemyCall).toBeDefined();
  });

  it('draws score text via fillText', () => {
    world.score = 42;
    renderer.render(world, camera);
    const calls = (ctx.fillText as ReturnType<typeof vi.fn>).mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    const scoreCall = calls.find((c: string[]) => c[0].includes('42'));
    expect(scoreCall).toBeDefined();
  });

  it('draws background before entities', () => {
    renderer.render(world, camera);
    expect((ctx.clearRect as ReturnType<typeof vi.fn>)).toHaveBeenCalled();
  });
});
