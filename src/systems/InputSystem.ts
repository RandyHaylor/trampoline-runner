import { Player } from '../entities/Player';

const LEFT_KEYS = new Set(['ArrowLeft', 'KeyA']);
const RIGHT_KEYS = new Set(['ArrowRight', 'KeyD']);

export class InputSystem {
  private player: Player;
  private held: Set<string>;

  constructor(player: Player) {
    this.player = player;
    this.held = new Set();
  }

  keyDown(code: string): void {
    this.held.add(code);
    this.resolve();
  }

  keyUp(code: string): void {
    this.held.delete(code);
    this.resolve();
  }

  private resolve(): void {
    const left = [...this.held].some(k => LEFT_KEYS.has(k));
    const right = [...this.held].some(k => RIGHT_KEYS.has(k));

    if (left && !right) {
      this.player.moveLeft();
    } else if (right && !left) {
      this.player.moveRight();
    } else {
      this.player.stopHorizontal();
    }
  }
}
