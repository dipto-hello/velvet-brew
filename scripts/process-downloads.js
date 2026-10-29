const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetDir = path.join(__dirname, '..', 'assets', 'images');
const mapping = [
  { src: 'C:/Users/sarke/Downloads/1.jpg', base: 'visit-interior' },
  { src: 'C:/Users/sarke/Downloads/2.jpg', base: 'cinema-01-beans' },
  { src: 'C:/Users/sarke/Downloads/3.jpg', base: 'cinema-02-bloom' },
  { src: 'C:/Users/sarke/Downloads/4.jpg', base: 'cinema-03-hearth' },
  { src: 'C:/Users/sarke/Downloads/5.jpg', base: 'cinema-04-sanctuary' }
];

console.log('Processing 5 bespoke images from Downloads into assets/images...');

for (const m of mapping) {
  const destJpg = path.join(targetDir, m.base + '.jpg');
  const destWebp = path.join(targetDir, m.base + '.webp');

  // Scale to 2400 max width and compress with high quality
  execSync(`ffmpeg -loglevel error -i "${m.src}" -vf "scale='min(2400,iw)':-2" -q:v 2 "${destJpg}" -y`);
  execSync(`ffmpeg -loglevel error -i "${destJpg}" -c:v libwebp -quality 82 "${destWebp}" -y`);

  const jpgSize = Math.round(fs.statSync(destJpg).size / 1024);
  const webpSize = Math.round(fs.statSync(destWebp).size / 1024);
  console.log(`Processed ${m.base}: JPG = ${jpgSize}KB, WebP = ${webpSize}KB`);
}

console.log('All 5 bespoke assets successfully processed!');
