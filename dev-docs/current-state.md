# Current State

Sprint 5 (replace Perlin noise with grid-based HashRandom world generation) is complete.

**100 tests passing across 14 test files.**

## Implemented Modules

| Module | Path | Tests |
|--------|------|-------|
| Types | src/types.ts | 3 |
| Bounce Physics | src/physics/bounce.ts | 5 |
| Player | src/entities/Player.ts | 11 |
| Trampoline | src/entities/Trampoline.ts | 9 |
| Coin | src/entities/Coin.ts | 5 |
| Enemy | src/entities/Enemy.ts | 9 |
| CollisionSystem | src/systems/CollisionSystem.ts | 5 |
| InputSystem | src/systems/InputSystem.ts | 5 |
| HashRandom | src/math/HashRandom.ts | 5 |
| WorldGen | src/systems/WorldGen.ts | 10 |
| Camera | src/Camera.ts | 12 |
| World | src/World.ts | 9 |
| GameLoop | src/GameLoop.ts | 4 |
| Renderer | src/renderer/Renderer.ts | 8 |

## Entry Points

| File | Purpose |
|------|---------|
| index.html | Canvas element, mobile-first viewport, loads game |
| src/main.ts | Wires GameLoop + WorldGen + InputSystem + Camera + Renderer, starts rAF loop |

## Architecture

- All entities are pure TS classes with `bounds(): Rect`, no canvas dependency
- World is procedurally generated using a deterministic integer hash (HashRandom)
- HashRandom: multiply-shift hash from (x, y) grid coords returning a deterministic float [0, 1)
- WorldGen: grid-based system replacing Perlin noise, with tunable per-entity spawn configs
  - Grid of candidate spawn points every 100px (configurable cellSize)
  - Each grid point uses hashRandom(gridX, gridY) as its deterministic seed
  - Per-entity-type config: spawn chance, minimum spacing (grid cells), size range
  - Neighbor spacing enforced: among conflicting neighbors within minSpacing, highest hash wins
  - Different hash channels per entity type (gridX*3+offset) to avoid correlation
  - Trampoline width derived from hash within sizeRange (80-300px)
  - Coin collection tracked via collectCoin() method
- Viewport-based visibility: WorldGen returns only entities within viewport + 25% buffer
- Camera uses dead-zone (middle 1/3) approach for both x and y axes -- no clamping to >= 0
- Player moves left/right via arrow keys or A/D (InputSystem maps keys to moveLeft/moveRight/stopHorizontal)
- Enemies float sinusoidally with phase offsets based on x position
- CollisionSystem is stateless -- AABB checks only
- World.update() handles gravity, bounce resolution, coin collection, enemy floating
- Renderer is the ONLY layer that touches canvas -- draws all entities and score with camera offset (both x and y)
- main.ts wires everything together with requestAnimationFrame

## Sprint 5 Changes (from Sprint 4)

- Removed PerlinNoise module entirely (too complex, not random enough)
- Removed TrampolineField and EntityField (replaced by unified WorldGen)
- Added HashRandom: simple deterministic hash function for grid-based randomization
- Added WorldGen: configurable grid-based world generation with neighbor spacing rules
- World.ts uses single worldGen property instead of trampolineField/coinField/enemyField
- World.ts calls worldGen.collectCoin() when coins are collected
- main.ts wires WorldGen with tunable spawn configs for trampolines, coins, enemies

## Deleted Files (Sprint 5)

- src/math/PerlinNoise.ts
- src/systems/TrampolineField.ts
- src/systems/EntityField.ts
- test/math/PerlinNoise.test.ts
- test/systems/TrampolineField.test.ts
- test/systems/EntityField.test.ts

## Next Steps

- Game-over detection (enemy collision, falling off screen), restart flow, touch input, score display improvements
