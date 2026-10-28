import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, 'assets', 'images');

const AMBIENT_SLIDES = [
  // 1. Dark roasted aromatic coffee beans
  { id: 'ambient-beans', url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=1600&auto=format&fit=crop' },
  // 2. Steaming barista pour-over with warm ambient lighting
  { id: 'ambient-brew', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1600&auto=format&fit=crop' },
  // 3. Cozy, warm glowing European bistro/cafe atmosphere
  { id: 'ambient-cafe', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1600&auto=format&fit=crop' }
];

async function downloadSlides() {
  console.log('Downloading ambient cinematic slides...');
  for (const item of AMBIENT_SLIDES) {
    const filePath = path.join(imgDir, `${item.id}.jpg`);
    try {
      const res = await fetch(item.url);
      if (!res.ok) {
        console.error(`Failed ${item.id}: status ${res.status}`);
        continue;
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      console.log(`Saved: ${item.id}.jpg (${(buffer.length / 1024).toFixed(1)} KB)`);
    } catch (e) {
      console.error(`Error ${item.id}:`, e.message);
    }
  }
  console.log('Ambient slides downloaded successfully!');
}

downloadSlides();
