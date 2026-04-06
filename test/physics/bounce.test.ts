import { describe, it, expect } from 'vitest';
import { bounceVelocityFor } from '../../src/physics/bounce';

const MAX_BOUNCE = 800;
const MIN_BOUNCE = 300;

const trampoline = { x: 100, y: 500, width: 200, height: 20 };
// trampolineCenterX = 100 + 200/2 = 200

describe('bounceVelocityFor', () => {
  it('returns maxBounceVelocity when player is at the trampoline center (t=0)', () => {
    const playerCenterX = 200; // exactly at center
    expect(bounceVelocityFor(playerCenterX, trampoline)).toBe(MAX_BOUNCE);
  });

  it('returns minBounceVelocity when player is at the trampoline edge (t=1)', () => {
    const playerCenterX = 300; // center + width/2 = 200 + 100 = 300
    expect(bounceVelocityFor(playerCenterX, trampoline)).toBe(MIN_BOUNCE);
  });

  it('returns minBounceVelocity when player is beyond the trampoline edge (t>1, clamps)', () => {
    const playerCenterX = 450; // well beyond edge
    expect(bounceVelocityFor(playerCenterX, trampoline)).toBe(MIN_BOUNCE);
  });

  it('returns interpolated velocity at the midpoint (t=0.5)', () => {
    const playerCenterX = 250; // 50 units from center, t = 50/100 = 0.5
    const expected = MAX_BOUNCE + 0.5 * (MIN_BOUNCE - MAX_BOUNCE); // lerp = 550
    expect(bounceVelocityFor(playerCenterX, trampoline)).toBeCloseTo(expected);
  });

  it('is symmetric: same velocity for equal distance left and right of center', () => {
    const leftOfCenter = 150;  // 50 units left of center
    const rightOfCenter = 250; // 50 units right of center
    expect(bounceVelocityFor(leftOfCenter, trampoline)).toBe(
      bounceVelocityFor(rightOfCenter, trampoline)
    );
  });
});
