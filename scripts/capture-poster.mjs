/*
  Captures a still of the running office build as the facade poster.
  Needs the Next dev (or start) server running so /office/index.html serves.

  Safety note: page.evaluate below runs a fixed author-written snippet
  against our own local page; nothing untrusted is evaluated.

  Usage: node scripts/capture-poster.mjs
*/
import { chromium } from "playwright";
import sharp from "sharp";

const URL = process.env.POSTER_URL ?? "http://localhost:3000/office/index.html?embed=1&zoom=0";
const OUT = "public/office/poster.webp";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1600, height: 1000 },
  deviceScaleFactor: 1,
});
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForSelector("canvas");
await page.waitForTimeout(6000); // let auto-rotate + bloom + pulses settle

// preserveDrawingBuffer is on, so toDataURL returns the live frame
const dataUrl = await page.evaluate(() =>
  document.querySelector("canvas")?.toDataURL("image/png")
);

let png;
if (dataUrl && dataUrl.length > 20000) {
  png = Buffer.from(dataUrl.split(",")[1], "base64");
} else {
  console.warn("toDataURL thin, falling back to page screenshot");
  png = await page.screenshot({ type: "png" });
}
await browser.close();

const image = sharp(png).resize(1600, 1000, { fit: "cover" });
const stats = await sharp(await image.clone().png().toBuffer()).stats();
const mean =
  stats.channels.slice(0, 3).reduce((a, c) => a + c.mean, 0) / 3;
await image.webp({ quality: 80 }).toFile(OUT);
console.log(`poster written to ${OUT}, mean luminance ${mean.toFixed(1)} (should be > 2, pitch black would be ~0)`);
