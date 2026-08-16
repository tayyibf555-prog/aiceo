/* One-off Phase 3 embed verification. page.evaluate runs fixed local code. */
import { chromium, devices } from "playwright";

const BASE = "http://localhost:3000";
const OUT = "/private/tmp/claude-501/-Users-tayyibarbab-ai-ceo-website/f533a11a-32c7-49b5-9d8f-8bae857424a4/scratchpad";
const browser = await chromium.launch();

// ── Desktop ──────────────────────────────────────────────────────────────
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const officeRequests = [];
page.on("request", (r) => {
  if (r.url().includes("/office/")) officeRequests.push(r.url().split("/office/")[1]);
});
await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const beforeScroll = [...officeRequests];

await page.evaluate(() => {
  const el = document.getElementById("office");
  window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 100, behavior: "instant" });
});
await page.waitForTimeout(4500); // iframe mount + app boot
const afterScroll = [...officeRequests];
const iframeInline = await page.$("#office iframe");

// wheel over the panel must scroll the page (no trap)
const yBefore = await page.evaluate(() => window.scrollY);
const panel = await page.$("#office [class*=aspect]");
const box = await panel.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.wheel(0, 400);
await page.waitForTimeout(400);
const yAfter = await page.evaluate(() => window.scrollY);

await page.screenshot({ path: `${OUT}/embed-desktop.png` });

// fullscreen dialog
await page.click("#office button:has-text('FULLSCREEN')");
await page.waitForTimeout(2500);
const dialogOpen = await page.evaluate(() => document.querySelector("dialog[open] iframe") !== null);
await page.screenshot({ path: `${OUT}/embed-dialog.png` });
await page.click("dialog button:has-text('CLOSE')");
await page.waitForTimeout(300);
const dialogClosed = await page.evaluate(() => document.querySelector("dialog[open]") === null);
const inlineStill = await page.$("#office iframe");

console.log(JSON.stringify({
  lazyBeforeScroll: beforeScroll,           // expect poster only, no assets/
  loadedAfterScroll: afterScroll.filter(u => u.startsWith("assets/")).length,
  inlineIframeMounted: !!iframeInline,
  wheelScrolledPage: yAfter > yBefore,
  dialogOpen, dialogClosed, inlineSurvivesDialog: !!inlineStill,
}, null, 1));
await page.close();

// ── Mobile (coarse pointer) ──────────────────────────────────────────────
const ctx = await browser.newContext({ ...devices["iPhone 13"] });
const m = await ctx.newPage();
const mRequests = [];
m.on("request", (r) => { if (r.url().includes("/office/assets/")) mRequests.push(1); });
await m.goto(BASE, { waitUntil: "networkidle" });
await m.evaluate(() => {
  const el = document.getElementById("office");
  window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 100, behavior: "instant" });
});
await m.waitForTimeout(1500);
const mobileLazyHeld = mRequests.length === 0; // no inline iframe on mobile ever
await m.tap("#office button[aria-label]");
await m.waitForTimeout(4000);
const mobileDialog = await m.evaluate(() => document.querySelector("dialog[open] iframe") !== null);
await m.screenshot({ path: `${OUT}/embed-mobile-dialog.png` });
console.log(JSON.stringify({ mobileLazyHeld, mobileDialog }, null, 1));

await browser.close();
