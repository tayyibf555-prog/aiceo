/*
  Focused probe for the office redesign round: screenshots the office
  panel, mechanism cards and pricing cards against a running dev server,
  and reports console errors. Usage: node scripts/verify-office.mjs [outDir]
*/
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.VERIFY_URL ?? "http://localhost:3000";
const OUT = process.argv[2] ?? "verify-out";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const consoleIssues = [];
page.on("console", (msg) => {
  if (msg.type() === "error" || msg.type() === "warning")
    consoleIssues.push(`${msg.type()}: ${msg.text().slice(0, 300)}`);
});
page.on("pageerror", (err) => consoleIssues.push(`pageerror: ${String(err).slice(0, 300)}`));

await page.goto(BASE, { waitUntil: "networkidle" });

for (const id of ["office", "mechanism", "pricing"]) {
  const el = page.locator(`#${id}`);
  await el.scrollIntoViewIfNeeded();
  if (id === "office") {
    // the 3D engine loads lazily; wait for its canvas (or the SVG fallback)
    await page
      .waitForSelector("#office canvas, #office svg.office-svg", { timeout: 20000 })
      .catch(() => {});
    await page.waitForTimeout(1800);
  } else {
    await page.waitForTimeout(700);
  }
  await el.screenshot({ path: `${OUT}/${id}.png` });
}
console.log(
  "ENGINE:",
  (await page.$("#office canvas")) ? "webgl" : (await page.$("#office svg.office-svg")) ? "svg" : "none"
);

// zoom interaction sanity: click the boardroom zone hit poly via rail
await page.locator("#office").scrollIntoViewIfNeeded();
await page.getByRole("button", { name: /Boardroom/ }).click();
await page.waitForTimeout(700);
await page.locator("#office").screenshot({ path: `${OUT}/office-zoom.png` });

// all four mechanism icons render revealed in static (narrow) mode
await page.setViewportSize({ width: 900, height: 900 });
await page.goto(BASE, { waitUntil: "networkidle" });
await page.locator("#mechanism").scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
await page.locator("#mechanism").screenshot({ path: `${OUT}/mechanism-static.png` });

console.log("CONSOLE ISSUES:", consoleIssues.length ? consoleIssues : "none");
await browser.close();
