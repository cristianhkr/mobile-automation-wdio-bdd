---
name: Debug Failing Tests
description: Triage failing mobile test scenarios using Allure artifacts and screenshots, classify the root cause and apply the minimal fix. Use when a test run fails, flakiness appears, or the user asks why scenarios are broken.
---

## Workflow

Triage the failing tests in this project and fix them.

### 1. Collect evidence

- Read the most recent `*-result.json` files in `allure-results/` to find
  failed scenarios, the failing step and the error message.
- Look for screenshot attachments of the failures and inspect them to see
  the actual app state at the moment of failure.

### 2. Classify each failure into one of these root causes

| Root cause            | How to identify                                            | Fix pattern                                                                                                                                |
| --------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Selector drift**    | Element not found / not displayed                          | Dump the real screen with the `explore-selectors` skill and update the page object                                                         |
| **State leak**        | Scenario depends on leftovers from a previous scenario     | `beforeScenario` restarts the app, but cart data survives restarts — use the `the user's cart is empty` step (RESET APP STATE) when needed |
| **Timing / wait**     | Intermittent failures, "still not displayed after Xms"     | Replace fixed pauses with the explicit-wait helpers from `BasePage`, or raise the timeout                                                  |
| **Wrong expectation** | The app behaves differently from the assertion             | Verify the real app behavior first (explore if needed), then fix the test — never weaken an assertion just to go green                     |
| **Environment**       | "Could not find a connected Android device", driver errors | Restart the emulator (`npm run emulator:headless`), check `adb devices`, ANDROID_HOME, drivers                                             |

### 3. Apply the minimal fix for each failure

One root cause at a time; avoid drive-by refactors while debugging.

### 4. Verify

Run only the affected feature with:

```bash
export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
export ANDROID_SDK_ROOT=$ANDROID_HOME
npx wdio run wdio.conf.ts --spec <feature-file>
```

Then run the full suite (`npm run test:android`) to check for regressions.

### 5. Report

A summary table: scenario, root cause, fix applied, status after the fix.
