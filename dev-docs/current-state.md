# Current State

Sprint 2 (renderer + playable HTML) is complete. The game is now playable in a browser.

**56 tests passing across 11 test files.**

## Implemented Modules

| Module | Path | Tests |
|--------|------|-------|
| Types | src/types.ts | 3 |
| Bounce Physics | src/physics/bounce.ts | 5 |
| Player | src/entities/Player.ts | 5 |
| Trampoline | src/entities/Trampoline.ts | 6 |
| Coin | src/entities/Coin.ts | 5 |
| Enemy | src/entities/Enemy.ts | 5 |
| CollisionSystem | src/systems/CollisionSystem.ts | 5 |
| SpawnSystem | src/systems/SpawnSystem.ts | 5 |
| World | src/World.ts | 5 |
| GameLoop | src/GameLoop.ts | 4 |
| Renderer | src/renderer/Renderer.ts | 8 |

## Entry Points

| File | Purpose |
|------|---------|
| index.html | Canvas element, mobile-first viewport, loads game |
| src/main.ts | Wires GameLoop + SpawnSystem + Renderer, starts rAF loop |

## Architecture

- All entities are pure TS classes with `bounds(): Rect`, no canvas dependency
- CollisionSystem is stateless -- AABB checks only
- World.update() handles gravity, scrolling, bounce resolution, coin collection, and offscreen cleanup
- SpawnSystem spawns entities at distance-based intervals at the right edge of the canvas
- Renderer is the ONLY layer that touches canvas -- draws all entities and score
- main.ts wires everything together with requestAnimationFrame

## Next Steps

- Sprint 3: Game-over detection (enemy collision, falling off screen), restart flow, touch input
