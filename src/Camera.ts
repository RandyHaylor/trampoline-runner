export class Camera {
  x: number;
  private viewportWidth: number;

  constructor(viewportWidth: number) {
    this.viewportWidth = viewportWidth;
    this.x = 0;
  }

  follow(playerCenterX: number): void {
    this.x = Math.max(0, playerCenterX - this.viewportWidth / 2);
  }

  worldToScreen(worldX: number): number {
    return worldX - this.x;
  }
}
