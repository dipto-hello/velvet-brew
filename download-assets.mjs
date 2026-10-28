import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(__dirname, 'assets', 'images');

if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

const IMAGES_TO_DOWNLOAD = [
  { id: 'coffee-01', url: 'https://images.unsplash.com/photo-1519532059956-a63a37af5deb?q=80&w=800&h=500&auto=format&fit=crop' },
  { id: 'coffee-02', url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=700&auto=format&fit=crop' },
  { id: 'coffee-03', url: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?q=80&w=700&auto=format&fit=crop' },
  { id: 'bakery-01', url: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?q=80&w=700&auto=format&fit=crop' },
  { id: 'bakery-02', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=700&auto=format&fit=crop' },
  { id: 'bakery-03', url: 'https://images.unsplash.com/photo-1619452357216-e88ca8119eeb?q=80&w=700&auto=format&fit=crop' },
  { id: 'bistro-01', url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=700&auto=format&fit=crop' },
  { id: 'bistro-02', url: 'https://images.unsplash.com/photo-1631637214648-2c6fd7f947ae?q=80&w=700&auto=format&fit=crop' },
  { id: 'bistro-03', url: 'https://images.unsplash.com/photo-1649400454485-b8ad827f929d?q=80&w=700&auto=format&fit=crop' },
  { id: 'dessert-01', url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=700&auto=format&fit=crop' },
  { id: 'dessert-02', url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=700&auto=format&fit=crop' },
  { id: 'dessert-03', url: 'https://images.unsplash.com/photo-1717603545758-88cc454db69b?q=80&w=700&auto=format&fit=crop' },
  // Hero, Story, Visit images
  { id: 'hero-showcase', url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop' },
  { id: 'story-brew', url: 'https://images.unsplash.com/photo-1550249825-672da2a75487?q=80&w=900&auto=format&fit=crop' },
  { id: 'visit-interior', url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop' }
];

async function downloadAll() {
  console.log('Downloading high-quality culinary assets locally...');
  for (const item of IMAGES_TO_DOWNLOAD) {
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
  console.log('All images downloaded successfully into assets/images/!');
}

downloadAll();
