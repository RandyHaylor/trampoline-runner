# Sprint Log

| Sprint | Goal | Status |
|--------|------|--------|
| 0 | Architecture planning -- game loop design, entity model, bounce physics, collision approach, file structure | Complete |
| 1 | Core game engine -- types, physics, entities, collision, world, game loop, spawning | Complete |
| 2 | Renderer layer + playable HTML entry point | Complete |
| 3 | Remove auto-scroll, add left/right player movement, camera system | Complete |

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

## Sprint 3 Details (2026-04-06)

**Delivered:**
- Removed auto-scroll entirely: scrollSpeed removed from GameConfig, entities no longer scroll left
- src/entities/Player.ts -- added moveLeft(), moveRight(), stopHorizontal(), vx applied in update()
- src/systems/InputSystem.ts -- maps ArrowLeft/A and ArrowRight/D to player movement methods
- src/Camera.ts -- follows player horizontally, provides worldToScreen() offset
- src/entities/Trampoline.ts, Coin.ts, Enemy.ts -- removed update(dt, scrollSpeed) and isOffScreen(), added isFarBehind(playerX)
- src/World.ts -- removed scroll calls, uses isFarBehind for entity cleanup
- src/systems/SpawnSystem.ts -- spawns based on player.x position instead of elapsed distance
- src/renderer/Renderer.ts -- accepts Camera, uses camera.worldToScreen() for all entity x positions
- src/main.ts -- wired InputSystem with keydown/keyup event listeners

**Test results:** 70 tests, 13 test files, all passing

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
