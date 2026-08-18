/*
  Renders the two Gmail-style mock screenshots for /thank-you (accepting
  the session invite, and opening the HQ welcome email) from local HTML
  files into public/thank-you/. Mock data only; no network.
  Usage: node scripts/generate-thankyou-mocks.mjs <mockDir>
*/
import { chromium } from "playwright";
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const SRC = process.argv[2];
if (!SRC) throw new Error("pass the directory holding mock-invite.html / mock-join.html");
const OUT = "public/thank-you";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const jobs = [
  { file: "mock-invite.html", out: "invite-accept", h: 740 },
  { file: "mock-join.html", out: "join-hq", h: 860 },
];
for (const { file, out, h } of jobs) {
  const page = await browser.newPage({
    viewport: { width: 1200, height: h },
    deviceScaleFactor: 2,
  });
  await page.goto("file://" + join(SRC, file));
  await page.waitForTimeout(200);
  const png = await page.screenshot();
  await sharp(png).webp({ quality: 90 }).toFile(`${OUT}/${out}.webp`);
  await page.close();
}
await browser.close();
console.log("MOCKS_WRITTEN");
