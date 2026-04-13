const fs   = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, 'images');
const QUALITY    = 85;

function findPngs(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findPngs(full));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.png')) {
      results.push(full);
    }
  }
  return results;
}

async function main() {
  const pngs = findPngs(IMAGES_DIR);
  console.log(`Found ${pngs.length} PNG file(s). Converting…\n`);

  for (const src of pngs) {
    const dest = src.replace(/\.png$/i, '.webp');
    await sharp(src).webp({ quality: QUALITY }).toFile(dest);
    console.log(`  ✓  ${path.relative(__dirname, src)}  →  ${path.relative(__dirname, dest)}`);
  }

  console.log(`\nDone. ${pngs.length} file(s) converted.`);
}

main().catch(err => { console.error(err); process.exit(1); });
