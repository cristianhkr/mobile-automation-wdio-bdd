import type { Capabilities } from '@wdio/types';

// ============================================================
// Android Capabilities
// ============================================================
// Update these values to match your actual device/emulator
const androidCapabilities = {
  platformName: 'Android',
  'appium:deviceName': 'emulator-5554', // ← Change to your actual deviceName (e.g., Pixel_6_API_34)
  'appium:platformVersion': '14',       // ← Change to your emulator/device Android version
  'appium:automationName': 'UiAutomator2',
  'appium:app': './apps/Android.SauceLabs.Mobile.Sample.app.2.7.1.apk', // ← Path to your APK
  // 'appium:app': './apps/SwagLabsMobile.apk',   // ← Alternative: Sauce Labs demo app

  // Activity wait configuration (SplashActivity transitions to MainActivity quickly)
  'appium:appWaitActivity': 'com.swaglabsmobileapp.MainActivity',
  'appium:appWaitDuration': 30000,      // max time (ms) to wait for the app activity

  // Additional recommended options
  'appium:noReset': false,             // true to keep app data between sessions
  'appium:fullReset': false,           // true to clear app data after each session
  'appium:autoGrantPermissions': true, // automatically grant requested permissions
  'appium:newCommandTimeout': 120,     // timeout between commands (seconds)
  'appium:forceAppLanguage': 'en',     // force app language

  // To connect to a remote physical device (optional)
  // 'appium:udid': 'emulator-5554',
};

// Use a broader config type that includes capabilities for the test runner
const wdioConfig = {
  // ============================================================
  // Runner Configuration
  // ============================================================
  runner: 'local',

  // ============================================================
  // Framework & Specs
  // ============================================================
  framework: 'cucumber',

  specFileRetries: 0,
  specFileRetriesDelay: 0,
  specFileRetriesDeferred: false,

  specs: ['./src/features/**/*.feature'],

  // ============================================================
  // Cucumber Framework
  // ============================================================
  cucumberOpts: {
    require: ['./src/step-definitions/**/*.ts'],
    backtrace: false,
    // Note: WebdriverIO v10 has built-in TypeScript support via tsx.
    // Do NOT add 'ts-node/register' here — it conflicts with the built-in loader.
    requireModule: [],
    dryRun: false,
    failFast: false,
    snippets: true,
    source: true,
    profile: [],
    strict: true,
    tagExpression: '',
    timeout: 60000,
    ignoreUndefinedDefinitions: false,
    retry: 0,
    retryTagFilter: '',
    tagsInTitle: true,
  },

  // ============================================================
  // Services
  // ============================================================
  services: [
    [
      'appium',
      {
        // Appium is installed as a local dependency and launched automatically
        command: 'appium',
        args: {
          // Relaxes security to allow unrestricted testing
          relaxedSecurity: true,
          // Default Appium port
          port: 4723,
        },
        logPath: './logs',
      },
    ],
  ],

  // ============================================================
  // Capabilities
  // ============================================================
  maxInstances: 1,

  capabilities: [androidCapabilities],

  // ============================================================
  // Logging
  // ============================================================
  logLevel: 'info',
  bail: 0,
  baseUrl: '',
  waitforTimeout: 15000,
  connectionRetryTimeout: 180000,
  connectionRetryCount: 3,

  // ============================================================
  // Reporters
  // ============================================================
  reporters: [
    ['allure', {
      outputDir: './allure-results',
      disableWebdriverStepsReporting: false,
      disableWebdriverScreenshotsReporting: false,
      disableMochaHooks: false,
    }],
    ['spec', {
      symbols: {
        ok: '✓',
        err: '✗',
        bold: '‣',
        indent: '  ',
      },
    }],
  ],

  // ============================================================
  // Hooks
  // ============================================================

  /**
   * Runs before each feature file.
   */
  beforeFeature: function (uri: string, feature: { name?: string }) {
    console.log(`\n🚀 Starting Feature: ${feature.name || uri}`);
  },

  /**
   * Runs before each scenario.
   * Restarts the app so every scenario starts from a clean login screen.
   */
  beforeScenario: async function (world: { pickle: { name: string; tags: { name: string }[] } }) {
    const tags = world.pickle.tags.map((t: { name: string }) => t.name);
    console.log(`  ▶ Scenario: ${world.pickle.name} [${tags.join(', ')}]`);
    // Terminate and relaunch the app to reset its state between scenarios
    try {
      await browser.terminateApp('com.swaglabsmobileapp');
    } catch {
      // app was not running — ignore
    }
    await browser.activateApp('com.swaglabsmobileapp');
    // Wait for the login screen to be ready
    await browser.$('~test-Username').waitForDisplayed({ timeout: 20000 });
  },

  /**
   * Runs after each step.
   * Captures a screenshot and attaches it to Allure if the step failed.
   */
  afterStep: async function (
    step: { text: string },
    world: { attach: (data: string, mimeType: string, name: string) => void; [key: string]: unknown },
    result: { error?: Error; duration?: number } | null | undefined
  ) {
    if (result?.error) {
      try {
        const screenshot = await browser.takeScreenshot();
        // Attach screenshot to Allure report
        world.attach(
          screenshot,
          'image/png',
          `Screenshot on failure: ${step.text}`
        );
      } catch (e) {
        console.error('⚠️  Failed to capture screenshot:', e);
      }
    }
  },

  /**
   * Runs after each scenario.
   */
  afterScenario: function (world: { pickle: { name: string }; result?: { status: string } }) {
    if (world.result?.status === 'FAILED') {
      console.log(`  ✗ Scenario failed: ${world.pickle.name}`);
    }
  },
};

export const config = wdioConfig;
