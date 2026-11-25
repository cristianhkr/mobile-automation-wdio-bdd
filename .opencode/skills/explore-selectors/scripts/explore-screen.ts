/* Throwaway UI exploration script — DO NOT commit as part of the suite.
 * Copy to <project>/scripts/explore-screen.ts, adapt the NAVIGATION section,
 * and run with: npx tsx scripts/explore-screen.ts
 */
import { remote } from 'webdriverio';

async function main() {
  const driver = await remote({
    hostname: '127.0.0.1',
    port: 4723,
    path: '/',
    capabilities: {
      platformName: 'Android',
      'appium:deviceName': 'emulator-5554',
      'appium:platformVersion': '14',
      'appium:automationName': 'UiAutomator2',
      'appium:noReset': true,
      'appium:appPackage': 'com.swaglabsmobileapp',
      'appium:appActivity': 'com.swaglabsmobileapp.SplashActivity',
      'appium:appWaitActivity': 'com.swaglabsmobileapp.MainActivity',
      'appium:appWaitDuration': 30000,
    } as Record<string, unknown>,
  });

  try {
    // ================= NAVIGATION (adapt to reach your screen) ================
    await driver.$('~test-Username').setValue('standard_user');
    await driver.$('~test-Password').setValue('secret_sauce');
    await driver.$('~test-LOGIN').click();
    await driver.pause(4000);

    // Example: open the cart
    // await driver.$('~test-Cart').click();
    // await driver.pause(2000);
    // ============================================================================

    const source = await driver.getPageSource();

    // Every content-desc with its match count (spot ambiguous selectors)
    const descs = [...(source.match(/content-desc="[^"]+"/g) ?? [])]
      .map((d) => d.replace('content-desc=', '').replace(/"/g, ''))
      .filter((d) => d.length > 0);
    const descCounts = new Map<string, number>();
    for (const d of descs) descCounts.set(d, (descCounts.get(d) ?? 0) + 1);
    for (const [desc, count] of descCounts) {
      console.log(`DESC: ~${desc}${count > 1 ? `  (${count} matches!)` : ''}`);
    }

    // Visible texts (useful for XPath text= selectors)
    const texts = [
      ...new Set(
        (source.match(/text="[^"]+"/g) ?? [])
          .map((t) => t.replace('text=', '').replace(/"/g, ''))
          .filter((t) => t.length > 0),
      ),
    ];
    for (const t of texts) console.log(`TEXT: "${t}"`);
  } finally {
    await driver.deleteSession();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
