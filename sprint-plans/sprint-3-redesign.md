# Sprint 3: Redesign -- Remove Auto-Scroll, Add Left/Right Player Movement

## User Request

"Built what I asked, illustrating that what I asked for didn't make sense. Can we change it so it doesn't auto scroll and the user presses left or right to move."

## Design Decision

The game was an auto-runner where the world scrolled left automatically. The user wants direct player control instead. The redesign:

1. **Remove auto-scroll** -- Trampolines, coins, and enemies no longer scroll left each frame. They stay at fixed world positions.
2. **Add left/right input** -- Player moves horizontally via left/right arrow keys (and A/D). The Player class gains `moveLeft()`, `moveRight()`, `stopHorizontal()` methods and a `MOVE_SPEED` constant.
3. **Camera system** -- Instead of entities scrolling, a camera follows the player horizontally. The renderer draws entities offset by camera position.
4. **Adapt SpawnSystem** -- Instead of spawning at the right canvas edge on a timer, pre-place a level layout or spawn based on player position (ahead of the player in the direction of movement).
5. **Remove scrollSpeed from GameConfig** -- No longer needed.
6. **Entity update() signatures change** -- Trampoline, Coin, Enemy no longer take scrollSpeed. They become static (or move on their own patterns later).
7. **Player.update() applies vx** -- Horizontal movement via velocity.

## Features (in TDD order)

| # | Feature | Tests |
|---|---------|-------|
| 1 | Player horizontal movement (moveLeft, moveRight, stopHorizontal, vx applied in update) | 4 new tests |
| 2 | InputSystem -- tracks key state, calls player movement methods | 3 new tests |
| 3 | Camera -- follows player x, provides offset for rendering | 3 new tests |
| 4 | Remove scrollSpeed from entities (Trampoline, Coin, Enemy update() no longer scroll) | Update existing tests |
| 5 | World.update() no longer passes scrollSpeed; uses player position for offscreen cleanup | Update existing tests |
| 6 | SpawnSystem redesign -- spawns based on player x position, not elapsed distance | Update existing tests |
| 7 | Renderer uses camera offset | Update existing tests |

## Constraints

- All 56 existing tests must be updated or replaced -- none left broken
- Strict TDD: write failing test, make it pass, repeat
- No auto-scroll behavior remains
