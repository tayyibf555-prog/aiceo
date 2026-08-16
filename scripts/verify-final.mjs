/* Final captures: full-page prod screenshot + forced-Arial hero (Windows
   fallback approximation). page.evaluate/addStyleTag run fixed local code. */
import { chromium } from "playwright";

const BASE = process.env.VERIFY_URL ?? "http://localhost:3000";
const OUT = process.argv[2] ?? "verify-out";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(BASE, { waitUntil: "networkidle" });
// force all reveals to play
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo({ top: y, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 60));
  }
  window.scrollTo({ top: 0, behavior: "instant" });
});
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/final-desktop-full.png`, fullPage: true });

// forced-Arial hero
await page.addStyleTag({
  content: `* { font-family: Arial, sans-serif !important; } code, pre, [class*=font-mono], [class*=kicker] { font-family: "Courier New", monospace !important; }`,
});
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/final-arial-hero.png` });
console.log("final captures done");
await browser.close();
