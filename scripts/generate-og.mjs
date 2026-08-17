/*
  Composes the static OG card (1200x630) once, committed to public/og.png.
  Dark panel look: mono chrome line, display headline, the arrow mark.
  Run on macOS (uses system Helvetica via SVG text). Deterministic output
  for a given logo + copy.
*/
import sharp from "sharp";

const W = 1200;
const H = 630;

const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#0A0A0A"/>
  <text x="64" y="84" font-family="Menlo, monospace" font-size="20" letter-spacing="4" fill="#A3A3A3">&#9654; AICEO_V1.0 &#183; COHORT 1 &#183; 10 SEATS</text>
  <rect x="64" y="104" width="380" height="3" fill="#1557E0"/>
  <text x="60" y="300" font-family="Helvetica Neue, Helvetica, Arial" font-size="84" font-weight="700" letter-spacing="-2" fill="#FFFFFF">Run your business</text>
  <text x="60" y="398" font-family="Helvetica Neue, Helvetica, Arial" font-size="84" font-weight="700" letter-spacing="-2" fill="#1557E0">like an AI CEO.</text>
  <text x="64" y="560" font-family="Menlo, monospace" font-size="22" letter-spacing="2" fill="#525252">Doors open August 20 &#183; Free second brain &#183; theaiceo</text>
</svg>`;

const mark = await sharp("public/brand/mark-crop.png")
  .resize({ height: 300 })
  .png()
  .toBuffer();
const markMeta = await sharp(mark).metadata();

await sharp(Buffer.from(svg))
  .composite([
    {
      input: mark,
      left: W - markMeta.width - 70,
      top: 150,
    },
  ])
  .png()
  .toFile("public/og.png");

console.log("public/og.png written");
