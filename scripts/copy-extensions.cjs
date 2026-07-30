const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const src = path.resolve(__dirname, '..', 'dist', 'kaira.js');
const extDir = path.resolve(__dirname, '..', 'extensions');
const svgIcon = path.resolve(__dirname, '..', 'src', 'assets', 'kaira-k-light.svg');

const SIZES = [16, 48, 128];

for (const name of fs.readdirSync(extDir)) {
  const dir = path.join(extDir, name);
  if (!fs.statSync(dir).isDirectory()) continue;

  // Copy bundle
  const dest = path.join(dir, 'kaira.js');
  fs.copyFileSync(src, dest);
  console.log(`  ✓ ${name}/kaira.js`);

  // Generate multi-size icons from SVG
  for (const size of SIZES) {
    const iconDest = path.join(dir, `icon-${size}.png`);
    sharp(svgIcon).resize(size, size).png().toFile(iconDest);
  }
  console.log(`  ✓ ${name}/icon-*.png`);
}
