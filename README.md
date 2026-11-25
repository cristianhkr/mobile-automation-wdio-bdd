# 📱 Mobile Automation Template — WebdriverIO + Appium + Cucumber + POM + Allure

[![Mobile Test Suite](https://github.com/cristianhkr/mobile-automation-wdio-bdd/actions/workflows/mobile-tests.yml/badge.svg)](https://github.com/cristianhkr/mobile-automation-wdio-bdd/actions/workflows/mobile-tests.yml)
[![Allure Report](https://img.shields.io/badge/Allure-Latest_Report-ff4b8b?logo=allure&logoColor=white)](https://cristianhkr.github.io/mobile-automation-wdio-bdd/)

A production-ready **template** for **native Android** mobile test automation.
Click **"Use this template"** (green button above) to generate your own repo from it.
Every push runs the full suite on a cloud Android emulator (GitHub Actions) and
publishes the Allure report to GitHub Pages — click the badge above to see the
latest live report with screenshots and step-by-step results.

## 📊 Live Test Report

### ➡️ [Open the Allure Report](https://cristianhkr.github.io/mobile-automation-wdio-bdd/)

Hosted on GitHub Pages and regenerated on **every push**. No cloning, no setup —
just click and explore:

- ✅ **8 BDD scenarios** with step-by-step results and timings
- 📸 **Screenshots** attached automatically to failing steps
- 📈 **Trends and history** accumulated across runs
- 🌳 **Suites by feature** (login / shopping) with tags like `@smoke`

## 🏗️ Tech Stack

| Component              | Tool                                  |
| ---------------------- | ------------------------------------- |
| **Framework**          | WebdriverIO v10                       |
| **Service**            | Appium v4                             |
| **Language**           | TypeScript (strict mode)              |
| **BDD**                | Cucumber (`@wdio/cucumber-framework`) |
| **Pattern**            | Page Object Model (POM)               |
| **Reports**            | Allure Report                         |
| **Android Automation** | UiAutomator2                          |

## 📂 Project Structure

```
├── apps/                                                       # Test APKs
│   └── Android.SauceLabs.Mobile.Sample.app.2.7.1.apk          # ← Place your APK here
├── src/
│   ├── features/                  # Gherkin .feature files
│   │   └── login.feature
│   ├── pages/                     # Page Objects (POM)
│   │   ├── BasePage.ts            # Base class with reusable methods
│   │   └── LoginPage.ts           # Login screen page object
│   └── step-definitions/          # Cucumber step definitions
│       └── login.steps.ts
├── allure-results/                # Allure raw results (git-ignored)
├── allure-report/                 # Generated HTML report (git-ignored)
├── wdio.conf.ts                   # WebdriverIO + Appium configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json
```

## 🚀 Getting Started

Generate a new repo from this one with the **"Use this template"** button,
clone it, and you are three steps away from running tests.

### 1. Install dependencies

```bash
npm install
```

### 2. Install the Appium Android driver

```bash
# List installed drivers
npx appium driver list

# Install UiAutomator2
npx appium driver install uiautomator2
```

> **Prerequisites:** Android SDK installed with `ANDROID_HOME` set. A running emulator or a physical device connected via ADB.

### 3. Place the APK

Download the demo app or place your own APK in the `apps/` folder:

```bash
# Example: download the Sauce Labs demo app
curl -L -o apps/Android-MyDemoAppRN.apk \
  https://github.com/saucelabs/sample-app-mobile/releases/download/3.5.0/Android.SauceLabs.Mobile.Sample.app.2.7.1.apk
```

## ▶️ Running Tests

### Run all scenarios

```bash
npm run test:android
```

### Run everything in one command (emulator + tests)

```bash
npm run test:android:live
```

Launches a visible emulator if none is running, waits for boot, then executes
the suite — watch the test run live in the emulator window.

### Run smoke tests only

```bash
npm run test:android:smoke
```

### Run a specific feature file

```bash
npx wdio run wdio.conf.ts --spec src/features/login.feature
```

## 📊 Allure Reports

### Generate and open the report

```bash
# Generate the HTML report from raw results
npm run allure:generate

# Open the report in your browser
npm run allure:open

# Or do both in one command
npm run allure:report
```

## ⚙️ Device Configuration

Edit `wdio.conf.ts` → `capabilities` to match your environment:

```typescript
'appium:deviceName': 'emulator-5554',    // ← Your device name
'appium:platformVersion': '14.0',        // ← Android version
'appium:app': './apps/Android-MyDemoAppRN.apk',  // ← Path to your APK
```

To find your emulator's device name:

```bash
adb devices
```

## 🔧 Available Scripts

| Command                      | Description                                            |
| ---------------------------- | ------------------------------------------------------ |
| `npm run test:android`       | Run all tests                                          |
| `npm run test:android:live`  | Launch visible emulator (if needed) + run tests        |
| `npm run test:android:smoke` | Run `@smoke` tests only                                |
| `npm run allure:generate`    | Generate HTML report                                   |
| `npm run allure:open`        | Open report in browser                                 |
| `npm run allure:report`      | Generate and open report                               |
| `npm run appium:drivers`     | List Appium drivers                                    |
| `npm run emulator`           | Launch emulator with visible window (watch tests live) |
| `npm run emulator:headless`  | Launch emulator without window (lighter)               |
| `npm run clean:allure`       | Clean results and reports                              |
| `npm run lint`               | ESLint over the whole project                          |
| `npm run lint:fix`           | ESLint with auto-fix                                   |
| `npm run format`             | Prettier format over the whole project                 |
| `npm run check`              | Full quality gate: lint + format check + typecheck     |

## 🧹 Code Quality

The project enforces best practices automatically:

| Tool            | Role                                                      |
| --------------- | --------------------------------------------------------- |
| **ESLint**      | Static analysis: unused code, unsafe `any`, bad patterns  |
| **Prettier**    | Consistent code style across every contribution           |
| **Husky**       | Git pre-commit hook — blocks commits that fail the checks |
| **lint-staged** | Runs the checks only on staged files (fast commits)       |

Every commit automatically runs ESLint + Prettier on the staged files and a
full TypeScript typecheck (`tsc --noEmit`). A commit is only created when
everything passes — no broken code enters the repository.

## 🔑 Demo App Credentials

The Sauce Labs sample app (v2.7.1) uses these credentials:

| Username        | Password       | Result                             |
| --------------- | -------------- | ---------------------------------- |
| `standard_user` | `secret_sauce` | Successful login → product catalog |
| anything else   | anything else  | Error message displayed            |

The login screen also shows tap-to-autofill buttons (`test-standard_user`, `test-locked_out_user`, `test-problem_user`).

## 📝 Adding New Tests

1. **Create a feature file** in `src/features/` using Gherkin syntax.
2. **Create a page object** in `src/pages/` extending `BasePage`.
3. **Create step definitions** in `src/step-definitions/`.
4. **Run** with `npm run test:android`.

Or just use the built-in OpenCode commands (see below).

## 🤖 OpenCode AI Tooling

This repo ships [OpenCode](https://opencode.ai) skills in
`.opencode/skills/` plus project-level instructions in `AGENTS.md`.
Skills are picked up automatically when a task matches their
description, or can be invoked explicitly:

| Skill                | Description                                                                                    |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| `@verify`            | Full health check: emulator, drivers, typecheck, runs the suite and reports                    |
| `@new-test`          | Scaffolds a new BDD suite (feature + steps + page object) following repo conventions           |
| `@debug`             | Triages failing tests using Allure artifacts and proposes fixes                                |
| `@explore-selectors` | Dumps the real app UI to discover selectors for new screens (includes a ready-to-adapt script) |

`AGENTS.md` gives any AI agent working in the repo the project
conventions, commands, scenario-isolation strategy and the testing
best practices to follow.

## 🐛 Troubleshooting

| Problem                                                 | Solution                                                                                                                                   |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `Appium driver not found`                               | Run `npm run appium:install:uiautomator2`                                                                                                  |
| `No device connected`                                   | Start an emulator or connect a device (`adb devices`)                                                                                      |
| `Element not found`                                     | Verify the accessibility ID using Appium Inspector                                                                                         |
| `TypeScript compilation error`                          | Run `npx tsc --noEmit` to check for type errors                                                                                            |
| `Unable to compile TypeScript` (weird line/col numbers) | Don't add `ts-node/register` to `cucumberOpts.requireModule` — WebdriverIO v10 has built-in TS support via `tsx` and both loaders conflict |
| `SplashActivity never started`                          | Add `'appium:appWaitActivity': '<your.MainActivity>'` to capabilities (splash screens transition too fast for Appium)                      |
| `ANDROID_HOME not set`                                  | `export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools` (or your SDK path)                                                      |
| `Could not find 'aapt2'`                                | Install Build Tools: `sdkmanager "build-tools;34.0.0"`                                                                                     |
