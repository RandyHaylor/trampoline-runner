# Sprint 0 — Architecture Plan

## Overview

Trampoline Runner is a mobile browser auto-runner. The player bounces automatically on every trampoline landing; bounce height is determined by where on the trampoline the player lands (center = maximum height, edge = minimum height). The player collects coins and avoids floating enemies. All gameplay logic must be unit-testable without a canvas instance.

---

## Game Loop Design

### requestAnimationFrame Loop

The top-level loop lives in a single `GameLoop` class. It owns the `requestAnimationFrame` handle and drives two phases per tick:

```
update(dt: number)   — pure logic: physics, collision, scoring, spawning
render(ctx: CanvasRenderingContext2D) — draws the current state to canvas
```

`dt` (delta time in seconds) is computed as `(currentTimestamp - previousTimestamp) / 1000`. The loop caps `dt` at `0.05 s` (~20 fps minimum) to prevent tunneling on tab restore.

```
GameLoop
  ├── update(dt)
  │     ├── world.update(dt)        — advances all entities
  │     └── collisionSystem.check() — resolves overlaps / triggers
  └── render(ctx)
        └── world.render(ctx)       — draws background, entities, HUD
```

### Testability Contract

`update` and all entity update methods are **pure functions of state + dt**: no DOM, no canvas, no global side effects. Tests import entity classes directly and call `update(dt)` with hand-crafted state. The canvas is touched only inside `render` methods, which are not unit-tested (visual regression / manual QA only).

---

## Key Entities

### Player

**Properties**
| Field | Type | Description |
|---|---|---|
| `x` | `number` | Horizontal position (world coords) |
| `y` | `number` | Vertical position (world coords) |
| `vx` | `number` | Horizontal velocity (constant forward speed) |
| `vy` | `number` | Vertical velocity |
| `width` | `number` | Collision box width |
| `height` | `number` | Collision box height |
| `isAlive` | `boolean` | False after enemy collision |
| `score` | `number` | Coin count |

**Responsibilities**
- Apply gravity each tick: `vy += GRAVITY * dt`
- Apply velocity: `x += vx * dt`, `y += vy * dt`
- Expose `bounds(): Rect` for collision detection
- Respond to `bounce(velocityY: number)`: sets `vy = -velocityY` (called by collision system)
- Respond to `collectCoin()`: increments `score`
- Respond to `die()`: sets `isAlive = false`

**Does NOT** know about canvas, trampolines, or enemies.

---

### Trampoline

**Properties**
| Field | Type | Description |
|---|---|---|
| `x` | `number` | Left edge (world coords) |
| `y` | `number` | Top surface Y |
| `width` | `number` | Total width |
| `height` | `number` | Visual thickness (for rendering) |
| `minBounceVelocity` | `number` | `vy` applied when landing at edge |
| `maxBounceVelocity` | `number` | `vy` applied when landing at center |

**Responsibilities**
- Expose `bounds(): Rect`
- Expose `bounceVelocityFor(playerCenterX: number): number` — the core physics calculation (see Bounce Physics Model below)
- Scroll leftward each tick: `x -= SCROLL_SPEED * dt`
- Expose `isOffscreen(): boolean` so the world can cull it

**Does NOT** know about the player or rendering.

---

### Coin

**Properties**
| Field | Type | Description |
|---|---|---|
| `x` | `number` | Center X |
| `y` | `number` | Center Y |
| `radius` | `number` | Collision radius |
| `collected` | `boolean` | True once player touches it |

**Responsibilities**
- Expose `bounds(): Rect` (axis-aligned box around circle)
- Scroll leftward each tick
- Expose `isOffscreen(): boolean`

---

### Enemy

**Properties**
| Field | Type | Description |
|---|---|---|
| `x` | `number` | Center X |
| `y` | `number` | Center Y (floats at fixed height) |
| `width` | `number` | |
| `height` | `number` | |
| `patrolAmplitude` | `number` | Optional vertical patrol range |
| `patrolSpeed` | `number` | Optional patrol frequency |

**Responsibilities**
- Scroll leftward each tick
- Optional sinusoidal vertical patrol: `y = baseY + sin(time * patrolSpeed) * patrolAmplitude`
- Expose `bounds(): Rect`
- Expose `isOffscreen(): boolean`

---

## Bounce Physics Model

The trampoline surface is divided into three zones based on the player's center X relative to the trampoline's center:

```
offset = |playerCenterX - trampolineCenterX|
maxOffset = trampoline.width / 2

// Normalized 0 (center) → 1 (edge)
t = clamp(offset / maxOffset, 0, 1)

bounceVelocity = lerp(maxBounceVelocity, minBounceVelocity, t)
```

`lerp(a, b, t) = a + (b - a) * t`

This is a linear model; it can be replaced with a curve (e.g., `t²` for a sharper drop-off at edges) without changing the interface.

**Worked example (default values)**
- `maxBounceVelocity = 800 px/s`, `minBounceVelocity = 300 px/s`
- Dead-center landing: `t=0`, velocity = 800 px/s
- Quarter-way from edge: `t=0.5`, velocity = 550 px/s
- Edge landing: `t=1`, velocity = 300 px/s

The collision system calls `trampoline.bounceVelocityFor(playerCenterX)` and passes the result to `player.bounce(velocity)`.

---

## Collision Detection

All entities expose a `bounds(): Rect` method returning `{ x, y, width, height }` in world coordinates.

### Approach: AABB (Axis-Aligned Bounding Box)

```
function overlaps(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.width
      && a.x + a.width > b.x
      && a.y < b.y + b.height
      && a.y + a.height > b.y
}
```

### Player–Trampoline

Checked only when `player.vy > 0` (falling). Landing is confirmed when:
1. The player's bottom edge crosses the trampoline's top surface (`player.y + player.height >= trampoline.y`)
2. Horizontal overlap exists

On landing: snap `player.y = trampoline.y - player.height`, then call `player.bounce(trampoline.bounceVelocityFor(player.x + player.width / 2))`.

### Player–Coin

Standard AABB overlap. On match: `coin.collected = true`, `player.collectCoin()`.

### Player–Enemy

Standard AABB overlap. On match: `player.die()`.

### Performance

For Sprint 1, brute-force O(n) over the small entity lists is fine. If needed later, a spatial grid or sorted x-list can replace this without touching entity code.

---

## File / Module Structure

```
trampoline-runner/
├── index.html                   # Entry point — creates canvas, boots GameLoop
├── src/
│   ├── main.ts                  # Wires DOM → GameLoop, handles resize
│   ├── GameLoop.ts              # rAF driver; owns update/render cycle
│   ├── World.ts                 # Container for all live entities + spawner
│   ├── entities/
│   │   ├── Player.ts
│   │   ├── Trampoline.ts
│   │   ├── Coin.ts
│   │   └── Enemy.ts
│   ├── systems/
│   │   ├── CollisionSystem.ts   # Stateless; takes world snapshot, fires callbacks
│   │   └── SpawnSystem.ts       # Decides when/where to add trampolines, coins, enemies
│   ├── physics/
│   │   └── bounce.ts            # bounceVelocityFor(), lerp(), clamp() — pure functions
│   ├── renderer/
│   │   ├── WorldRenderer.ts     # Orchestrates per-entity draw calls
│   │   └── HUDRenderer.ts       # Score, lives overlay
│   └── types.ts                 # Shared: Rect, Vec2, GameConfig
├── tests/
│   ├── entities/
│   │   ├── Player.test.ts
│   │   ├── Trampoline.test.ts
│   │   ├── Coin.test.ts
│   │   └── Enemy.test.ts
│   ├── systems/
│   │   ├── CollisionSystem.test.ts
│   │   └── SpawnSystem.test.ts
│   └── physics/
│       └── bounce.test.ts
├── dev-docs/
├── dev-log/
├── sprint-plans/
├── vitest.config.ts
└── tsconfig.json
```

**Key design rules**
- `entities/` and `physics/` have zero DOM or canvas imports — pure TypeScript classes/functions.
- `renderer/` is the only layer that imports `CanvasRenderingContext2D`.
- `CollisionSystem` takes entity arrays as arguments; it does not reach into global state.
- `World` is a thin coordinator: it holds arrays of entities and delegates to systems.

---

## Recommended Sprint 1 Scope and Order

Sprint 1 should establish a runnable game skeleton with the minimum loop that is actually fun.

### Priority Order

1. **`types.ts`** — Define `Rect`, `Vec2`, `GameConfig`. Unblocks everything.

2. **`physics/bounce.ts`** — Pure functions (`lerp`, `clamp`, `bounceVelocityFor`). Write tests first; this is the core mechanic and should be rock-solid before anything uses it.

3. **`Player` entity** — Gravity, velocity, `bounds()`, `bounce()`, `collectCoin()`, `die()`. No canvas. Full unit test coverage.

4. **`Trampoline` entity** — `bounceVelocityFor()`, scrolling, `bounds()`. Unit tests.

5. **`CollisionSystem`** — Player–Trampoline only. Tests with mock entity objects.

6. **`World` + `GameLoop`** — Wire player + one hardcoded trampoline into the rAF loop. At this point the game is physically runnable in a browser even without spawning or scoring.

7. **`Coin` + Player–Coin collision** — Score counter working.

8. **`Enemy` + Player–Enemy collision** — Death state.

9. **`SpawnSystem`** — Procedural generation of trampolines, coins, enemies as world scrolls.

10. **`WorldRenderer` + `HUDRenderer`** — Simple colored rectangles first; polish later.

### What to defer past Sprint 1

- Sprite / spritesheet animation
- Sound effects
- Touch/swipe input (player has no lateral control in v1 — purely auto-runner)
- Difficulty scaling over time
- High score persistence
- Level design / handcrafted stages
