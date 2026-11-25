#!/bin/bash
# Runs the Android test suite, launching a visible emulator first if none is running.
#
# Usage: npm run test:android:live

set -e

ANDROID_HOME="${ANDROID_HOME:-/opt/homebrew/share/android-commandlinetools}"
ADB="$ANDROID_HOME/platform-tools/adb"
EMU="$ANDROID_HOME/emulator/emulator"

# 1. Launch the emulator (with a visible window) if none is connected
if ! "$ADB" devices | grep -qE "emulator-.+[[:space:]]+device"; then
  echo "📱 No emulator running — launching Pixel_6_API_34 (visible window)..."
  "$EMU" -avd Pixel_6_API_34 -no-audio &
else
  echo "📱 Emulator already running — reusing it."
fi

# 2. Wait for the device and full Android boot
"$ADB" wait-for-device
echo "⏳ Waiting for Android to finish booting..."
"$ADB" shell 'while [[ -z $(getprop sys.boot_completed) ]]; do sleep 1; done'
echo "✅ Emulator ready"

# 3. Run the full test suite (Appium is started automatically by wdio)
echo "🎬 Running tests — watch the emulator window..."
npx wdio run wdio.conf.ts
