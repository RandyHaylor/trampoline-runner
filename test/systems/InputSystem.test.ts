import { describe, it, expect } from 'vitest';
import { InputSystem } from '../../src/systems/InputSystem';
import { Player } from '../../src/entities/Player';

describe('InputSystem', () => {
  it('pressing ArrowRight calls moveRight on player', () => {
    const player = new Player(100, 100);
    const input = new InputSystem(player);
    input.keyDown('ArrowRight');
    expect(player.vx).toBe(Player.MOVE_SPEED);
  });

  it('pressing ArrowLeft calls moveLeft on player', () => {
    const player = new Player(100, 100);
    const input = new InputSystem(player);
    input.keyDown('ArrowLeft');
    expect(player.vx).toBe(-Player.MOVE_SPEED);
  });

  it('releasing ArrowRight stops horizontal movement', () => {
    const player = new Player(100, 100);
    const input = new InputSystem(player);
    input.keyDown('ArrowRight');
    input.keyUp('ArrowRight');
    expect(player.vx).toBe(0);
  });

  it('releasing one key while other is held keeps movement', () => {
    const player = new Player(100, 100);
    const input = new InputSystem(player);
    input.keyDown('ArrowRight');
    input.keyDown('ArrowLeft');
    input.keyUp('ArrowRight');
    expect(player.vx).toBe(-Player.MOVE_SPEED);
  });

  it('supports A and D keys as alternatives', () => {
    const player = new Player(100, 100);
    const input = new InputSystem(player);
    input.keyDown('KeyD');
    expect(player.vx).toBe(Player.MOVE_SPEED);
    input.keyUp('KeyD');
    input.keyDown('KeyA');
    expect(player.vx).toBe(-Player.MOVE_SPEED);
  });
});
