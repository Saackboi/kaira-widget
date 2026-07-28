const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const src = path.resolve(__dirname, '..', 'dist', 'kaira.js');
const extDir = path.resolve(__dirname, '..', 'extensions');
const svgIcon = path.resolve(__dirname, '..', 'src', 'assets', 'kaira-k-light.svg');

for (const name of fs.readdirSync(extDir)) {
  const dir = path.join(extDir, name);
  if (!fs.statSync(dir).isDirectory()) continue;

  // Copy bundle
  const dest = path.join(dir, 'kaira.js');
  fs.copyFileSync(src, dest);
  console.log(`  ✓ ${name}/kaira.js`);

  // Generate 48x48 icon from SVG
  const iconDest = path.join(dir, 'icon.png');
  sharp(svgIcon).resize(48, 48).png().toFile(iconDest);
  console.log(`  ✓ ${name}/icon.png`);
}
