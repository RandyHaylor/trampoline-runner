import { World } from './World';
import { GameLoop } from './GameLoop';
import { TrampolineField } from './systems/TrampolineField';
import { EntityField } from './systems/EntityField';
import { Renderer } from './renderer/Renderer';
import { Camera } from './Camera';
import { InputSystem } from './systems/InputSystem';
import type { GameConfig } from './types';

export function startGame(canvas: HTMLCanvasElement): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2d context');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const config: GameConfig = {
    gravity: 980,
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
  };

  const world = new World(config);
  const gameLoop = new GameLoop(world);
  const trampolineField = new TrampolineField(12345, config.canvasWidth, config.canvasHeight);
  const coinField = new EntityField(54321, config.canvasWidth, config.canvasHeight, 'coin');
  const enemyField = new EntityField(67890, config.canvasWidth, config.canvasHeight, 'enemy');
  world.trampolineField = trampolineField;
  world.coinField = coinField;
  world.enemyField = enemyField;
  const camera = new Camera(config.canvasWidth, config.canvasHeight);
  const renderer = new Renderer(ctx);

  const input = new InputSystem(world.player);
  window.addEventListener('keydown', (e) => input.keyDown(e.code));
  window.addEventListener('keyup', (e) => input.keyUp(e.code));

  let lastTime = 0;

  function frame(time: number) {
    const dt = Math.min((time - lastTime) / 1000, 0.05); // cap at 50ms
    lastTime = time;

    // Update config dimensions on resize
    config.canvasWidth = canvas.width;
    config.canvasHeight = canvas.height;

    camera.follow(world.player.centerX(), world.player.centerY());
    world.cameraX = camera.x;
    world.cameraY = camera.y;
    gameLoop.tick(dt);
    renderer.render(world, camera);

    requestAnimationFrame(frame);
  }

  requestAnimationFrame((time) => {
    lastTime = time;
    requestAnimationFrame(frame);
  });
}
