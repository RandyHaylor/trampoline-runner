# Sprint Log

| Sprint | Goal | Status |
|--------|------|--------|
| 0 | Architecture planning -- game loop design, entity model, bounce physics, collision approach, file structure | Complete |
| 1 | Core game engine -- types, physics, entities, collision, world, game loop, spawning | Complete |
| 2 | Renderer layer + playable HTML entry point | Complete |

## Sprint 2 Details (2026-04-06)

**Delivered:**
- src/renderer/Renderer.ts -- draws background, player (blue), trampolines (green), coins (yellow), enemies (red), score text
- src/main.ts -- wires GameLoop + SpawnSystem + Renderer, starts rAF loop with dt cap at 50ms
- index.html -- full-viewport canvas, mobile-first (touch-action: none, user-scalable=no), module script loading

**Test results:** 56 tests, 11 test files, all passing

**Renderer tests cover:**
- Construction with canvas context
- clearRect called on render
- Player drawn via fillRect at correct position
- Trampolines drawn via fillRect
- Coins drawn (fillRect or arc)
- Enemies drawn via fillRect
- Score text drawn via fillText with correct value
- Background cleared before entities

## Sprint 1 Details (2026-04-06)

**Delivered:**
- src/types.ts -- Rect, EntityState, GameConfig interfaces
- src/physics/bounce.ts -- bounceVelocityFor with lerp between max (800) and min (300) velocity
- src/entities/Player.ts -- gravity-driven player with bounds/centerX
- src/entities/Trampoline.ts -- scrolling platform with offscreen detection
- src/entities/Coin.ts -- collectible with scroll and offscreen
- src/entities/Enemy.ts -- hazard with scroll and offscreen
- src/systems/CollisionSystem.ts -- stateless AABB collision detection
- src/systems/SpawnSystem.ts -- distance-based entity spawning (trampolines, coins, enemies)
- src/World.ts -- game state container integrating gravity, scrolling, bounce, coin collection, offscreen cleanup
- src/GameLoop.ts -- tick-based loop with elapsed time tracking

**Test results:** 48 tests, 10 test files, all passing
