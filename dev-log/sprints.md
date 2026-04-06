# Sprint Log

| Sprint | Goal | Status |
|--------|------|--------|
| 0 | Architecture planning -- game loop design, entity model, bounce physics, collision approach, file structure | Complete |
| 1 | Core game engine -- types, physics, entities, collision, world, game loop, spawning | Complete |

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
