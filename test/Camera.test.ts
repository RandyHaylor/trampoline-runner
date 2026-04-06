import { describe, it, expect } from 'vitest';
import { Camera } from '../src/Camera';

describe('Camera', () => {
  it('initializes with x offset of 0', () => {
    const cam = new Camera(800, 600);
    expect(cam.x).toBe(0);
  });

  it('initializes with y offset of 0', () => {
    const cam = new Camera(800, 600);
    expect(cam.y).toBe(0);
  });

  it('does not move when player is within middle third horizontally', () => {
    const cam = new Camera(600, 600);
    // Middle third of 600-wide viewport at x=0 is [200, 400]
    cam.follow(300);
    expect(cam.x).toBe(0);
  });

  it('pans right when player exceeds right third boundary', () => {
    const cam = new Camera(600, 600);
    // Right boundary = 0 + 2*600/3 = 400. Player at 450 exceeds by 50.
    cam.follow(450);
    expect(cam.x).toBe(50);
  });

  it('pans left when player exceeds left third boundary', () => {
    const cam = new Camera(600, 600);
    cam.x = 300; // left bound = 300 + 200 = 500
    cam.follow(400);
    // player 400 < leftBound 500, so x -= 100
    expect(cam.x).toBe(200);
  });

  it('allows camera x to go negative (world extends left)', () => {
    const cam = new Camera(600, 600);
    // leftBound = 0 + 200 = 200. Player at 50 < 200, so x -= 150 => -150
    cam.follow(50);
    expect(cam.x).toBe(-150);
  });

  it('pans down when player exceeds bottom third boundary', () => {
    const cam = new Camera(600, 600);
    // Bottom bound = 0 + 2*600/3 = 400. Player at 500 exceeds by 100.
    cam.follow(300, 500);
    expect(cam.y).toBe(100);
  });

  it('pans up when player exceeds top third boundary', () => {
    const cam = new Camera(600, 600);
    cam.y = 300; // top bound = 300 + 200 = 500
    cam.follow(300, 400);
    // player 400 < topBound 500, so y -= 100
    expect(cam.y).toBe(200);
  });

  it('allows camera y to go negative (world extends upward)', () => {
    const cam = new Camera(600, 600);
    // topBound = 0 + 200 = 200. Player at 50 < 200, so y -= 150 => -150
    cam.follow(300, 50);
    expect(cam.y).toBe(-150);
  });

  it('does not move when player is within middle third vertically', () => {
    const cam = new Camera(600, 600);
    cam.follow(300, 300);
    expect(cam.y).toBe(0);
  });

  it('worldToScreen converts world x to screen x', () => {
    const cam = new Camera(600, 600);
    cam.x = 200;
    expect(cam.worldToScreen(250)).toBe(50);
  });

  it('worldToScreenY converts world y to screen y', () => {
    const cam = new Camera(600, 600);
    cam.y = 100;
    expect(cam.worldToScreenY(350)).toBe(250);
  });
});
