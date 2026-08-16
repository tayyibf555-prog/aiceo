/*
  Dev verification harness. Against a running server (default :3000):
    1. Screenshots every section element (desktop 1280) + full page mobile 375
    2. Asserts the HUD exec label swaps as each section scrolls into the band
    3. Reports console errors and hydration warnings
  Usage: node scripts/verify-page.mjs [outDir]

  Note on safety: page.evaluate/$$eval below run fixed, author-written
  functions inside our own local dev page (Playwright's standard DOM
  API). No untrusted input is ever evaluated.
*/
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.VERIFY_URL ?? "http://localhost:3000";
const OUT = process.argv[2] ?? "verify-out";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

const consoleIssues = [];
page.on("console", (msg) => {
  if (msg.type() === "error" || msg.type() === "warning")
    consoleIssues.push(`${msg.type()}: ${msg.text().slice(0, 200)}`);
});

await page.goto(BASE, { waitUntil: "networkidle" });

// Per-section element screenshots (desktop)
const ids = await page.$$eval("[data-exec]", (els) => els.map((e) => e.id));
for (const id of ids) {
  const el = page.locator(`#${id}`);
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(450); // let reveals play
  await el.screenshot({ path: `${OUT}/desktop-${id}.png` });
}

// HUD label assertions
const hudResults = [];
for (const id of ids) {
  await page.evaluate((sid) => {
    const el = document.getElementById(sid);
    const y = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: y - window.innerHeight * 0.42 + 10, behavior: "instant" });
  }, id);
  await page.waitForTimeout(250);
  const label = await page.evaluate(
    () => document.querySelector(".hud-cursor")?.parentElement?.textContent ?? "?"
  );
  const expected = await page.evaluate(
    (sid) => document.getElementById(sid)?.dataset.exec,
    id
  );
  hudResults.push({
    section: id,
    expected,
    got: label.trim(),
    ok: label.includes(expected ?? "∅"),
  });
}

// Mobile full page
await page.setViewportSize({ width: 375, height: 812 });
await page.goto(BASE, { waitUntil: "networkidle" });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(600);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/mobile-full.png`, fullPage: true });

console.log("HUD:", JSON.stringify(hudResults, null, 1));
console.log("CONSOLE ISSUES:", consoleIssues.length ? consoleIssues : "none");
console.log("SECTIONS SHOT:", ids.join(", "));
await browser.close();
