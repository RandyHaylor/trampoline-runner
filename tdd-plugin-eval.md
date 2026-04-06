# TDD Plugin Evaluation: Trampoline Runner

## Uncle Bob's Framework (verified via web search)

**Three Laws of TDD:**
1. Don't write production code until you have a failing test
2. Don't write more test than is sufficient to fail
3. Don't write more production code than is sufficient to pass

**FIRST Principles:** Fast, Independent, Repeatable, Self-validating, Timely

**Clean Code rules:** Functions do one thing, names are meaningful, classes are small and focused, no side effects

---

## What's Working Well

**Tests are Fast and Self-validating** — 104 tests run in ~67ms. All pass. No flakiness observed.

**Tests are Independent** — Each test creates its own instance. No shared mutable state between tests. `beforeEach` is used correctly in `Renderer.test.ts`.

**Determinism is tested explicitly** — `TrampolineField` and `EntityField` both have tests verifying same seed = same output. This shows good design instinct.

**Tests are behavior-focused, not implementation-focused** — Tests check what a `Player` does (`moveLeft` sets `vx`), not how it works internally.

**Production code is clean:**
- `Player.ts` is 43 lines, single responsibility, no side effects
- `TrampolineField.ts` is focused — one method, one job
- Constants are named (`CELL_SIZE`, `NOISE_THRESHOLD`), not magic numbers
- Types are lean (`GameConfig`, `Rect`)

**Good separation of concerns** — `World`, `Renderer`, `Camera`, `CollisionSystem` are cleanly separated. `World` doesn't know about rendering; `Renderer` doesn't update state.

---

## Issues / Gaps Against Uncle Bob's Standards

### 1. Two Genuinely Weak Assertions (Real Issues)

`World.test.ts` — `populates enemies from worldGen when set`:
```ts
// enemies may or may not appear near origin, just verify it doesn't crash
expect(Array.isArray(w.enemies)).toBe(true);
```
This is a **smoke test**, not a unit test. Uncle Bob: tests should be precise specifications. `Array.isArray` is always true after initialization — this test cannot fail in any meaningful scenario.

`Renderer.test.ts` (coins):
```ts
expect(coinRect || fillCalls.length > 0).toBeTruthy();
```
An `||` in an assertion is a red flag — the test passes if *either* condition is true. This means the coin could be rendered in a completely wrong way and the test still passes. It's testing "something happened" rather than "the right thing happened."

### 2. Test Names Don't Always Match What's Actually Asserted

`World.test.ts` — `'update moves the player with gravity'` only checks `y` changed, but the test name implies gravity specifically. It would fail to catch if, say, gravity was zero but friction moved the player. Better: check the exact physics.

`Renderer.test.ts` — `'draws background before entities'` only verifies `clearRect` was called, not the ordering. The test name promises ordering but the assertion doesn't verify it.

### 3. One Missing Coverage Area

There are no tests for **collision + score** in `World.test.ts`. The `World` has coin-collection logic and `score` increments — these are the core game mechanics — but no test directly asserts `score` increases when player touches a coin.

### 4. Minor: `EntityField.test.ts` comment leaking implementation details

```ts
// EntityField uses offset of 1000 to avoid overlapping with TrampolineField
```
Uncle Bob: test code should read like specification, not documentation. Implementation notes in test comments are fragile and indicate the test is tied to an internal detail.

---

## Summary Scorecard

| Uncle Bob Criterion | Score | Notes |
|---|---|---|
| Tests are Fast | ✅ Excellent | 67ms for 104 tests |
| Tests are Independent | ✅ Good | Clean per-test setup |
| Tests are Repeatable | ✅ Good | Deterministic, no I/O |
| Tests are Self-validating | ⚠️ Mixed | Some assertions too weak (`\|\|`, `isArray`) |
| Tests are Timely (TDD order) | ✅ Good | Sprint logs confirm red-green cycle; "no-auto-scroll" tests are regression guards for a removed feature, not retrofitted docs |
| Single Responsibility | ✅ Good | Classes are focused |
| Meaningful names | ✅ Good | Names are clear throughout |
| No magic numbers | ✅ Good | Constants are named |
| Tests specify behavior precisely | ⚠️ Mixed | 2 tests are too vague (`Array.isArray`, `\|\|` assertion) |
| Coverage of core mechanics | ⚠️ Gap | No test directly asserts score increments on coin collision |

**Overall:** Strong foundation. 102 of 104 tests are well-formed. The only real weaknesses are 2 specific assertions that are too weak to fail meaningfully. Architecture quality — clean separation of concerns, stateless systems, deterministic procedural generation — strongly suggests tests actually drove the design.

---

## AI + TDD Context

This project was generated entirely by AI from a simple prompt across 5 sprints. Getting AI to do real TDD — not just tests-after, but tests that constrain implementation — is notoriously difficult.

**What the plugin got right:**
- Sprint logs show genuine red-green discipline: test written failing, then implementation to pass
- Test count grew incrementally with features (48 → 56 → 70 → 85 → 104)
- Dead code was deleted when superseded (`SpawnSystem`, `PerlinNoise`, `TrampolineField`, `EntityField`)
- Every new module got its own test file — no orphaned untested code

**Verdict:** For AI-generated TDD, this is a meaningful benchmark. The hard problem isn't getting AI to write tests; it's getting AI to let tests constrain the implementation. This project shows evidence that happened. **Grade: B+ / Exceptional for AI.**

---

## Sources

- [Uncle Bob's Three Rules of TDD](http://butunclebob.com/ArticleS.UncleBob.TheThreeRulesOfTdd)
- [Clean Code Chapter 9: Unit Tests Summary](https://www.linkedin.com/pulse/summary-clean-code-chapter-9-unit-tests-robert-c-martin-el-mhamdi)
- [FIRST Principles of Unit Testing](https://medium.com/pragmatic-programmers/unit-tests-are-first-fast-isolated-repeatable-self-verifying-and-timely-a83e8070698e)
- [Clean Code: TDD Episode](https://cleancoders.com/episode/clean-code-episode-6-p1)
