export class Camera {
  x: number;
  y: number;
  private viewportWidth: number;
  private viewportHeight: number;

  constructor(viewportWidth: number, viewportHeight: number = 0) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.x = 0;
    this.y = 0;
  }

  follow(playerCenterX: number, playerCenterY?: number): void {
    const leftBound = this.x + this.viewportWidth / 3;
    const rightBound = this.x + (2 * this.viewportWidth) / 3;

    if (playerCenterX < leftBound) {
      this.x -= leftBound - playerCenterX;
    } else if (playerCenterX > rightBound) {
      this.x += playerCenterX - rightBound;
    }

    if (playerCenterY !== undefined && this.viewportHeight > 0) {
      const topBound = this.y + this.viewportHeight / 3;
      const bottomBound = this.y + (2 * this.viewportHeight) / 3;

      if (playerCenterY < topBound) {
        this.y -= topBound - playerCenterY;
      } else if (playerCenterY > bottomBound) {
        this.y += playerCenterY - bottomBound;
      }
    }
  }

  worldToScreen(worldX: number): number {
    return worldX - this.x;
  }

  worldToScreenY(worldY: number): number {
    return worldY - this.y;
  }
}
