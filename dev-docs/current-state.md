# Current State

Sprint 4 (camera follow all directions, Perlin-driven world generation, floating enemies) is complete.

**104 tests passing across 15 test files.**

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
| PerlinNoise | src/math/PerlinNoise.ts | 6 |
| TrampolineField | src/systems/TrampolineField.ts | 6 |
| EntityField | src/systems/EntityField.ts | 7 |
| Camera | src/Camera.ts | 12 |
| World | src/World.ts | 9 |
| GameLoop | src/GameLoop.ts | 4 |
| Renderer | src/renderer/Renderer.ts | 8 |

## Entry Points

| File | Purpose |
|------|---------|
| index.html | Canvas element, mobile-first viewport, loads game |
| src/main.ts | Wires GameLoop + TrampolineField + EntityField + InputSystem + Camera + Renderer, starts rAF loop |

## Architecture

- All entities are pure TS classes with `bounds(): Rect`, no canvas dependency
- World is procedurally generated using seeded 2D Perlin noise (deterministic)
- TrampolineField: divides world into cells, Perlin noise determines placement and width (80-300px)
- EntityField: separate Perlin fields for coins (dense, threshold 0.05) and enemies (sparse, threshold 0.25)
- Entities exist in all directions (negative and positive x/y coordinates)
- Viewport-based visibility: fields return only entities within viewport + 25% buffer
- Camera uses dead-zone (middle 1/3) approach for both x and y axes -- no clamping to >= 0
- Player moves left/right via arrow keys or A/D (InputSystem maps keys to moveLeft/moveRight/stopHorizontal)
- Enemies float sinusoidally with phase offsets based on x position
- Collected coins tracked in a Set so they don't reappear from the field
- CollisionSystem is stateless -- AABB checks only
- World.update() handles gravity, bounce resolution, coin collection, enemy floating
- Renderer is the ONLY layer that touches canvas -- draws all entities and score with camera offset (both x and y)
- main.ts wires everything together with requestAnimationFrame

## Sprint 4 Changes (from Sprint 3)

- Camera follows player in middle 1/3 dead zone on both axes (x and y), no >= 0 clamp
- Camera.follow() accepts both centerX and centerY, worldToScreenY() added
- Player.centerY() added
- Renderer applies camera offset to both x and y for all entities
- PerlinNoise module: seeded 2D gradient noise with deterministic output
- TrampolineField: Perlin-driven procedural trampoline placement in all directions, variable width
- Trampoline accepts optional width parameter, instance width used in bounds()
- EntityField: Perlin-driven procedural coin and enemy placement with different densities
- Enemy.update(dt) adds sinusoidal floating with phase offset
- SpawnSystem removed entirely -- all entity placement is now Perlin-driven
- World uses trampolineField, coinField, enemyField for viewport-based entity queries
- Collected coins tracked in Set to prevent reappearing

## Next Steps

- Sprint 5: Game-over detection (enemy collision, falling off screen), restart flow, touch input, score display improvements
