# Sprint Log

| Sprint | Goal | Status |
|--------|------|--------|
| 0 | Architecture planning -- game loop design, entity model, bounce physics, collision approach, file structure | Complete |
| 1 | Core game engine -- types, physics, entities, collision, world, game loop, spawning | Complete |
| 2 | Renderer layer + playable HTML entry point | Complete |
| 3 | Remove auto-scroll, add left/right player movement, camera system | Complete |
| 4 | Camera follow all directions, Perlin-driven world generation, floating enemies, coins | Complete |
| 5 | Replace Perlin noise with grid-based HashRandom world generation | Complete |

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

## Sprint 4 Details (2026-04-06)

**Delivered:**
- src/Camera.ts -- dead-zone follow in middle 1/3 for both x and y axes, no >= 0 clamping, worldToScreenY()
- src/entities/Player.ts -- added centerY() method
- src/math/PerlinNoise.ts -- seeded 2D gradient noise, deterministic, smooth
- src/systems/TrampolineField.ts -- Perlin-driven procedural trampoline placement in all directions, variable width (80-300px), viewport + 25% buffer query
- src/entities/Trampoline.ts -- optional width parameter, instance-based bounds
- src/systems/EntityField.ts -- Perlin-driven procedural coin and enemy placement with configurable density thresholds
- src/entities/Enemy.ts -- sinusoidal floating with phase offset based on x position
- src/World.ts -- uses trampolineField, coinField, enemyField; collected coins tracked in Set
- src/main.ts -- wires TrampolineField and EntityField instances, removed SpawnSystem
- Deleted src/systems/SpawnSystem.ts (replaced by Perlin fields)
- src/renderer/Renderer.ts -- uses camera y offset and instance trampoline width

**Test results:** 104 tests, 15 test files, all passing

**New test files:**
- test/math/PerlinNoise.test.ts (6 tests) -- range, determinism, seed variation, smoothness, negative coords, integer boundaries
- test/systems/TrampolineField.test.ts (6 tests) -- viewport query, determinism, variable width, negative coords, density, buffer zone
- test/systems/EntityField.test.ts (7 tests) -- determinism, seed variation, coin/enemy sparsity, 2D distribution, viewport query

## Sprint 5 Details (2026-04-06)

**Delivered:**
- src/math/HashRandom.ts -- deterministic integer hash from (x,y) grid coords returning float [0,1)
- src/systems/WorldGen.ts -- unified grid-based world generation replacing TrampolineField + EntityField
  - Configurable per-entity spawn configs: chance, minSpacing, sizeRange
  - Neighbor spacing enforcement (highest hash wins among conflicts)
  - Different hash channels per entity type to avoid correlation
  - Coin collection tracking via collectCoin()
- src/World.ts -- updated to use single worldGen property instead of three separate fields
- src/main.ts -- wires WorldGen with tunable spawn configs
- Deleted: PerlinNoise.ts, TrampolineField.ts, EntityField.ts and their test files

**Test results:** 100 tests, 14 test files, all passing

**New test files:**
- test/math/HashRandom.test.ts (5 tests) -- range, determinism, uniqueness, negative coords, distribution
- test/systems/WorldGen.test.ts (10 tests) -- determinism, layout variation, viewport bounds, spacing, density control, size ranges, coin collection, negative coords, grid alignment

**Developers:** Robert Martin (HashRandom, World.ts integration), Martin Fowler (WorldGen, file cleanup)

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
