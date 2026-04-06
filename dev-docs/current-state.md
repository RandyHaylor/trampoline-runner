# Current State

Sprint 3 (remove auto-scroll, add left/right player control) is complete.

**70 tests passing across 13 test files.**

## Implemented Modules

| Module | Path | Tests |
|--------|------|-------|
| Types | src/types.ts | 3 |
| Bounce Physics | src/physics/bounce.ts | 5 |
| Player | src/entities/Player.ts | 10 |
| Trampoline | src/entities/Trampoline.ts | 6 |
| Coin | src/entities/Coin.ts | 5 |
| Enemy | src/entities/Enemy.ts | 5 |
| CollisionSystem | src/systems/CollisionSystem.ts | 5 |
| InputSystem | src/systems/InputSystem.ts | 5 |
| SpawnSystem | src/systems/SpawnSystem.ts | 5 |
| Camera | src/Camera.ts | 4 |
| World | src/World.ts | 5 |
| GameLoop | src/GameLoop.ts | 4 |
| Renderer | src/renderer/Renderer.ts | 8 |

## Entry Points

| File | Purpose |
|------|---------|
| index.html | Canvas element, mobile-first viewport, loads game |
| src/main.ts | Wires GameLoop + SpawnSystem + InputSystem + Camera + Renderer, starts rAF loop |

## Architecture

- All entities are pure TS classes with `bounds(): Rect`, no canvas dependency
- Entities are static in world space -- no auto-scrolling
- Player moves left/right via arrow keys or A/D (InputSystem maps keys to moveLeft/moveRight/stopHorizontal)
- Camera follows player horizontally, Renderer uses camera.worldToScreen() for all drawing
- Entities have isFarBehind(playerX) for cleanup when player moves past them
- SpawnSystem spawns entities ahead of the player based on player.x position
- CollisionSystem is stateless -- AABB checks only
- World.update() handles gravity, bounce resolution, coin collection, and far-behind cleanup
- Renderer is the ONLY layer that touches canvas -- draws all entities and score with camera offset
- main.ts wires everything together with requestAnimationFrame

## Sprint 3 Changes (from Sprint 2)

- Removed auto-scroll: scrollSpeed removed from GameConfig and all entities
- Added Player.moveLeft(), moveRight(), stopHorizontal(), vx applied in update()
- Added InputSystem: maps ArrowLeft/A to moveLeft, ArrowRight/D to moveRight
- Added Camera: follows player, provides worldToScreen() for rendering
- Entities now have isFarBehind(playerX) instead of isOffScreen()
- SpawnSystem uses player.x position instead of distance traveled
- Renderer accepts Camera parameter, applies offset to all entity positions

## Next Steps

- Sprint 4: Game-over detection (enemy collision, falling off screen), restart flow, touch input
