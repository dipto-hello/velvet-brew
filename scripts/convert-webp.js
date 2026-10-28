const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, '..', 'assets', 'images');
const files = fs.readdirSync(imgDir).filter(f => f.endsWith('.jpg'));

console.log(`Found ${files.length} JPG files to convert.`);

for (const file of files) {
  const base = path.parse(file).name;
  const inPath = path.join(imgDir, file);
  const outPath = path.join(imgDir, `${base}.webp`);
  try {
    execSync(`ffmpeg -loglevel error -i "${inPath}" -c:v libwebp -quality 80 "${outPath}" -y`);
    const inSize = fs.statSync(inPath).size;
    const outSize = fs.statSync(outPath).size;
    const savings = Math.round((1 - outSize / inSize) * 100);
    console.log(`Converted: ${file} (${Math.round(inSize/1024)}KB) -> ${base}.webp (${Math.round(outSize/1024)}KB) [${savings}% saved]`);
  } catch (err) {
    console.error(`Error converting ${file}:`, err.message);
  }
}

console.log('All conversions complete!');
