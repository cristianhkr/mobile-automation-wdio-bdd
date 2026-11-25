---
name: Explore App Selectors
description: Discover the real accessibility IDs and texts of any screen of the demo app by launching Appium, navigating and dumping the UI source. Use before writing page objects for unknown screens, or to verify why a selector is not matching.
---

## Workflow

Never guess mobile selectors — dump the real UI and extract them.

### 1. Ensure an emulator is running and Appium is started

```bash
export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
export PATH=$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH
export ANDROID_SDK_ROOT=$ANDROID_HOME

adb devices   # must list emulator-5554 (or another device) as "device"
# If empty: npm run emulator:headless (background), wait for sys.boot_completed=1
```

Start Appium in the background if it is not already running:

```bash
npx appium --base-path / --relaxed-security --port 4723 > /tmp/appium.log 2>&1 &
```

### 2. Copy the template and adapt it

Copy `scripts/explore-screen.ts` (next to this SKILL.md) into the
project's `scripts/` folder as a throwaway script. Adapt the
navigation section to reach the screen you need:

- Log in if necessary (`standard_user` / `secret_sauce`).
- Tap, scroll or navigate until the target screen is displayed.
- Then dump.

### 3. Run it and extract the selectors

```bash
npx tsx scripts/explore-screen.ts 2>&1 | grep -E "DESC:|TEXT:"
```

The script prints every `content-desc` (use as `~id`) and visible `text`
(use as XPath `//android.widget.TextView[@text="..."]`) with element
counts, so ambiguous selectors are obvious.

### 4. Rules for turning dumps into page-object selectors

- Prefer accessibility IDs (`~test-...`) — stable across layout changes.
- A `content-desc` that appears N times is NOT a valid `$` selector
  (strict mode); use `$$` and index, or scope it with an XPath under a
  unique ancestor.
- Counters/badges often have no `content-desc`; find their XPath inside
  a unique container (e.g. the cart badge TextView inside `test-Cart`).

### 5. Clean up

Delete the throwaway script after extracting the selectors, and kill the
background Appium if you started it.
