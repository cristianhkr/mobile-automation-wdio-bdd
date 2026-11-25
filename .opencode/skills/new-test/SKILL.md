---
name: Create New Test Suite
description: Scaffold a new BDD mobile test suite (Gherkin feature, step definitions and Page Objects) following the repository conventions. Use when asked to add tests for new app functionality or create a new feature file.
---

## Workflow

Create a new BDD test suite for the functionality the user describes.

### 1. Discover the app state

- The demo app is the Sauce Labs Mobile Sample (`com.swaglabsmobileapp`).
- Real accessibility IDs are prefixed with `test-` (e.g. `~test-Username`,
  `~test-LOGIN`).
- If the selectors for the target screen are unknown, load the
  `explore-selectors` skill first and follow it to dump the real UI.

### 2. Create or extend the Page Object in `src/pages/`

- Extend `BasePage` and reuse its explicit-wait helpers
  (`waitForElementVisible`, `clickElement`, `setValue`, `isElementVisible`).
- Selectors are private getters returning strings.
- Action methods and verification methods, each documented with JSDoc.
- If a selector matches several elements, use `$$` and index into it
  (WebdriverIO strict mode fails on ambiguous `$` selectors).

### 3. Create the Gherkin feature in `src/features/<name>.feature`

- English wording, business-readable steps (never selectors in Gherkin).
- Tag the feature (e.g. `@checkout`) and add `@smoke` only to the most
  critical scenario.
- Use a `Background:` section for shared setup (e.g. logging in).
- If scenarios depend on cart contents, include the
  `And the user's cart is empty` step — it resets cart state through the
  app's own "RESET APP STATE" menu option (fast, keeps the session).

### 4. Create the step definitions in `src/step-definitions/<name>.steps.ts`

- Instantiate page objects once at module level.
- Use `Given/When/Then` from `@wdio/cucumber-framework`.
- Assert with the global `expect(...)`; throw a descriptive `Error` for
  state checks before asserting.

### 5. Quality gates before finishing

- `npx tsc --noEmit` passes with zero errors.
- Run the new feature alone:
  ```bash
  export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
  export ANDROID_SDK_ROOT=$ANDROID_HOME
  npx wdio run wdio.conf.ts --spec src/features/<name>.feature
  ```
- All new scenarios must pass; fix them if they don't.
- Respect the testing best practices listed in `AGENTS.md` (no sleeps,
  scenario isolation, one assertion focus per `Then`).
