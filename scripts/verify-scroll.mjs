/*
  Continuous-scroll verification (matches real user behaviour, unlike
  teleport jumps, which fight ScrollTrigger pinning). Scrolls the page
  in steps, samples the HUD label, checks the full exec sequence
  appears in order, and captures the pinned curriculum mid-sequence.
  page.evaluate runs fixed author-written code on our own local page.
*/
import { chromium } from "playwright";

const BASE = process.env.VERIFY_URL ?? "http://localhost:3000";
const OUT = process.argv[2] ?? "verify-out";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 850 } });
await page.goto(BASE, { waitUntil: "networkidle" });

const expected = await page.$$eval("[data-exec]", (els) =>
  els.map((e) => e.dataset.exec)
);

const seen = [];
const curriculumStates = new Set();
let shots = 0;
const total = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < total + 2000; y += 260) {
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
  await page.waitForTimeout(90);
  const label = await page.evaluate(
    () =>
      document.querySelector(".hud-cursor")?.parentElement?.textContent?.trim() ?? ""
  );
  const exec = label.replace("▶exec ", "").replace(".render", "");
  if (exec && seen[seen.length - 1] !== exec) seen.push(exec);
  const cur = await page.evaluate(
    () => document.querySelector("#curriculum p.font-mono.mt-2\\.5, #curriculum .mt-2\\.5")?.textContent ?? ""
  );
  if (cur.includes("SESSION")) {
    curriculumStates.add(cur.trim());
    if ((cur.includes("SESSION 3") || cur.includes("SESSION 6")) && shots < 2) {
      shots++;
      await page.screenshot({ path: `${OUT}/curriculum-step-${shots}.png` });
    }
  }
}

// order check: every expected exec appears, in document order
let cursor = 0;
const missing = [];
for (const exec of expected) {
  const at = seen.indexOf(exec, cursor);
  if (at === -1) missing.push(exec);
  else cursor = at;
}

console.log(JSON.stringify({
  expectedCount: expected.length,
  seenSequence: seen,
  missingOrOutOfOrder: missing,
  curriculumStates: [...curriculumStates].slice(0, 10),
}, null, 1));
await browser.close();
