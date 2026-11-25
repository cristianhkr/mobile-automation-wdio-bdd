---
name: Verify Project Health
description: Full health check of the mobile automation suite — check emulator, Appium drivers, TypeScript and run the whole Android test suite. Use when asked to verify the project works, check that everything is green, or validate changes before committing.
---

## Workflow

Run a complete health check of this WebdriverIO + Appium + Cucumber project and report the results.

1. **Check the environment** (run these with the shell tool):
   ```bash
   export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
   export PATH=$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH
   export ANDROID_SDK_ROOT=$ANDROID_HOME
   adb devices
   npx appium driver list --installed
   npx tsc --noEmit
   ```
2. **Start an emulator if none is connected**: run `npm run emulator:headless`
   in the background, then wait until
   `adb shell getprop sys.boot_completed` returns `1`.
3. **Run the full suite**: `npm run test:android`.
4. **Report** a table with scenario name, status and duration for every
   scenario, plus the total counts.
5. **If anything fails**: show the failing step, the error message and the
   screenshot attached in `allure-results/` — report only, do not fix
   (that is what the `debug` skill is for).

Finish with a one-line verdict: the project is healthy, or the list of
what is broken.
