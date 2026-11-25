# AGENTS.md — Mobile Automation Template

Guidance for any AI agent (or human) working in this repository.

## What this is

A template repository for **native mobile test automation**:

| Component          | Tool                                  |
| ------------------ | ------------------------------------- |
| Framework / Runner | WebdriverIO v10                       |
| Mobile service     | Appium v4 (UiAutomator2 driver)       |
| Language           | TypeScript (strict)                   |
| BDD                | Cucumber (`@wdio/cucumber-framework`) |
| Pattern            | Page Object Model                     |
| Reports            | Allure                                |

Demo app under test: **Sauce Labs Mobile Sample** (`com.swaglabsmobileapp`,
APK in `apps/`). Valid credentials: `standard_user` / `secret_sauce`.
App accessibility IDs are prefixed with `test-` (e.g. `~test-LOGIN`).

## Commands

| Command                      | Purpose                                       |
| ---------------------------- | --------------------------------------------- |
| `npm run test:android`       | Run the full suite                            |
| `npm run test:android:live`  | Boot a visible emulator if needed + run suite |
| `npm run test:android:smoke` | Run `@smoke` scenarios only                   |
| `npm run allure:report`      | Generate + open the Allure report             |
| `npm run emulator:headless`  | Boot the emulator without a window            |
| `npm run lint`               | ESLint over the whole project                 |
| `npm run format`             | Prettier format over the whole project        |
| `npm run check`              | Full quality gate: lint + format + typecheck  |
| `npx tsc --noEmit`           | Typecheck (must always pass)                  |

Environment needed for anything that touches the device:

```bash
export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
export ANDROID_SDK_ROOT=$ANDROID_HOME
```

## Repository layout

```
src/features/            Gherkin .feature files (login, shopping)
src/pages/               Page Objects extending BasePage
src/step-definitions/    Cucumber steps wiring features to page objects
scripts/test-live.sh     One-command live run (emulator + suite)
apps/                    The APK under test
allure-results/          Raw Allure output (git-ignored)
```

## Conventions

### Page Objects

- Always extend `BasePage` (`src/pages/BasePage.ts`) and reuse its
  explicit-wait helpers: `waitForElementVisible`, `clickElement`,
  `setValue`, `isElementVisible`, `waitForElementHidden`.
- Selectors are private getters returning selector strings.
- Prefer accessibility IDs (`~test-...`) over XPath or coordinates.
- If a selector matches several elements use `$$` and index into it —
  WebdriverIO v10 strict mode makes ambiguous `$` selectors fail.
- Verify selectors against the real screen: never guess them (see the
  `explore-selectors` skill).

### BDD

- Gherkin in English, business-readable steps — never selectors or
  implementation details in the feature files.
- Tag every feature; `@smoke` only on the most critical scenarios.
- Shared setup goes in a `Background:` section.
- Keep `strict: true` in `cucumberOpts` (undefined steps must fail).

### Scenario isolation (critical)

`beforeScenario` (in `wdio.conf.ts`) terminates and relaunches the app
so every scenario starts at the login screen — the app does not persist
its session across restarts. **However, cart data survives restarts.**
Any scenario that depends on cart contents must include the
`And the user's cart is empty` step, which resets state through the
app's own "RESET APP STATE" menu option (fast, keeps the session).
Never rely on state left by a previous scenario, and never clean state
with `mobile: clearApp` — it forces a slow React Native cold start
(minutes, not seconds).

## Testing best practices

- No `pause()`/sleeps — use explicit waits.
- One assertion focus per `Then` step.
- Assert state before acting on it (fail fast with a descriptive error).
- Screenshots are attached to Allure automatically on step failure.
- `npx tsc --noEmit` must pass with zero errors before any commit.
- A Husky pre-commit hook runs ESLint + Prettier (via lint-staged) and the
  typecheck automatically on every commit — never bypass it with
  `git commit --no-verify`.
- The full suite (`npm run test:android`) must be green before pushing.

## Git policy (critical)

- **Never commit or push without asking the user first.** Always show what
  will be committed and the proposed message, then wait for explicit
  approval.
- Never use `git push` on the user's behalf unless the user has just
  approved it.
- Keep commits small and focused: one logical change per commit, with a
  conventional message (`feat:`, `fix:`, `chore:`, `docs:`).

## Known gotchas (learned the hard way)

- **ts-node conflict**: do NOT add `ts-node/register` to
  `cucumberOpts.requireModule` — WebdriverIO v10 compiles TypeScript via
  its built-in `tsx` loader and the two conflict with bizarre errors.
- **Splash screens**: apps whose splash activity transitions quickly need
  `'appium:appWaitActivity': 'com.swaglabsmobileapp.MainActivity'` in
  the capabilities.
- **First run needs**: `ANDROID_HOME` exported, Build Tools installed
  (`sdkmanager "build-tools;34.0.0"` — provides `aapt2`), and the
  `uiautomator2` driver (`npm run appium:install:uiautomator2`).
- **Emulator cold boots**: after killing an emulator, restart it with
  `-no-snapshot` to avoid corrupted quick-boot snapshots.
- **CI runners need the KVM udev rule**: `android-emulator-runner` fails with
  "Software CPU emulation (-accel off) is not supported" unless `/dev/kvm` is
  opened to the runner user first (see the workflow's
  "Enable KVM hardware acceleration" step).
- **React Native renders slowly on CI emulators**: software-GPU cloud
  emulators can take 30-60s for the first screen render — screen-visibility
  waits in `wdio.conf.ts` and `ProductsPage` are deliberately generous for
  this reason. Never lower them to "speed up" the suite.
- **CI runner performance varies wildly between runs** (shared machines):
  `cucumberOpts.timeout` (180s) must stay above the sum of waits inside any
  single step or hook, and `specFileRetries: 1` absorbs one-off runner
  slowness. A timeout killed at exactly 60s means the step ceiling was hit,
  not a broken test.
- **Allure reports cannot be opened via `file://`**: `index.html` must be
  served over HTTP — use `npm run allure:open` locally, or the GitHub Pages
  deployment.

## OpenCode skills available in this repo

Load with `@skill-id` (or let the model pick them up automatically):

| Skill                | Use                                                      |
| -------------------- | -------------------------------------------------------- |
| `@verify`            | Full health check: env, drivers, typecheck, suite run    |
| `@new-test`          | Scaffold a new BDD suite (feature + steps + page object) |
| `@debug`             | Triage failing scenarios with Allure artifacts           |
| `@explore-selectors` | Dump the real UI to find selectors for new screens       |
