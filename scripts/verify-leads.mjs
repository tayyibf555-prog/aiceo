/*
  Phase 4 gate: drives the real form in the pricing free card.
  page.evaluate runs fixed author-written code on our own local page.
  Usage: node scripts/verify-leads.mjs
*/
import { chromium } from "playwright";

const BASE = process.env.VERIFY_URL ?? "http://localhost:3000";
const EMAIL = `verify-${process.pid}@aiceo-gate.co.uk`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(BASE, { waitUntil: "networkidle" });
await page.evaluate(() => {
  const el = document.getElementById("pricing");
  window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 80, behavior: "instant" });
});
await page.waitForTimeout(2000); // clear the 1.5s time trap

const freeCard = page.locator("#pricing form").first();
await freeCard.locator("input[name=name]").fill("Gate Check");
await freeCard.locator("input[name=email]").fill(EMAIL);
await freeCard.locator("button[type=submit]").click();
await page.waitForTimeout(2500);
const successVisible = await page
  .locator("#pricing", { hasText: "RESERVED" })
  .count();

// duplicate submit via the 1-on-1 card (same email, different source)
const privCard = page.locator("#pricing form").first(); // free form replaced by success block; first form now = 1-on-1
await page.waitForTimeout(1600);
await privCard.locator("input[name=name]").fill("Gate Check Again");
await privCard.locator("input[name=email]").fill(EMAIL);
await privCard.locator("button[type=submit]").click();
await page.waitForTimeout(2500);
const successCount = await page.locator("text=RESERVED ·").count();

// honeypot: fresh load, fill hidden company field, expect silent success + no row
await page.goto(BASE, { waitUntil: "networkidle" });
await page.evaluate(() => {
  const el = document.getElementById("pricing");
  window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 80, behavior: "instant" });
});
await page.waitForTimeout(2000);
const form2 = page.locator("#pricing form").first();
await form2.locator("input[name=name]").fill("Bot Bot");
await form2.locator("input[name=email]").fill(`bot-${process.pid}@aiceo-gate.co.uk`);
await form2.locator("input[name=company]").evaluate((el) => (el.value = "Botcorp"));
await form2.locator("button[type=submit]").click();
await page.waitForTimeout(2000);
const botSeesSuccess = await page.locator("text=RESERVED ·").count();

console.log(JSON.stringify({ EMAIL, successVisible: successVisible > 0, bothFormsSucceeded: successCount >= 2, botSeesSuccess: botSeesSuccess > 0 }));
await browser.close();
