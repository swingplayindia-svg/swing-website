import fs from 'fs';
import path from 'path';
import https from 'https';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const imagesDir = path.join(root, 'images');

/** Each file gets its own sport photo — no shared sources across carousel slots */
const SPORT_SOURCES = {
  padel: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=2400',
  pickleball: 'https://images.pexels.com/photos/3621162/pexels-photo-3621162.jpeg?auto=compress&cs=tinysrgb&w=2400',
  basketball: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=2400',
  cricket: 'https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=2400',
  tennis: 'https://images.pexels.com/photos/573911/pexels-photo-573911.jpeg?auto=compress&cs=tinysrgb&w=2400',
  soccer: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=2400',
  volleyball: 'https://images.pexels.com/photos/358382/pexels-photo-358382.jpeg?auto=compress&cs=tinysrgb&w=2400',
  running: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=2400',
  golf: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=2400',
};

/** Base filename -> sport key */
const FILE_TO_SPORT = {
  // Intro hero word carousel
  'ag_p9a1920.webp': 'padel',
  'ag_p9a2024.webp': 'pickleball',
  'ag__p9a1685.webp': 'basketball',
  'ag__p9a1666.webp': 'cricket',
  'ag_p9a1590.webp': 'tennis',

  // Radial hero carousel (careers faces -> sports action)
  'growthspecialist.webp': 'padel',
  'productspecialist.webp': 'basketball',
  'hero-marquee-soccer.webp': 'soccer',
  'game-developer.webp': 'cricket',
  '2dartist.webp': 'pickleball',

  // Games / sport showcase
  'padel-appicon.png': 'padel',
  'padel-appicon.webp': 'padel',
  'pickleball-appicon.png': 'pickleball',
  'pickleball-appicon.webp': 'pickleball',
  'basketball-appicon.png': 'basketball',
  'basketball-appicon.webp': 'basketball',
  'cricket-appicon.jpeg': 'cricket',
  'cricket-action-1.webp': 'cricket',
  'cricket-action-2.webp': 'basketball',
  'iphone13pro.webp': 'tennis',

  // Life-at / gallery carousels
  'ag_p9a2324.webp': 'volleyball',
  'ag_p9a1933.webp': 'running',
  'ag_p9a2225.webp': 'golf',
  'ag_p9a2283.webp': 'soccer',
  'ag_p9a1432.webp': 'tennis',
  'ag_p9a1865.webp': 'basketball',
  'ag__p9a1702.webp': 'cricket',
  'ag_p9a2102.webp': 'padel',
  'ag__p9a1620.webp': 'pickleball',
  'ag_p9a1813.webp': 'volleyball',
  'ag_p9a2256.webp': 'running',
  'ag_gym.webp': 'basketball',
  'ch9a0723.webp': 'padel',
  'ch9a0793.webp': 'pickleball',
  'ch9a0815.webp': 'cricket',
  'ch9a0873.webp': 'basketball',
  'zorlu_cover.webp': 'soccer',
};

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchBuffer(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`${url} -> ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

function getBaseName(filename) {
  return filename.replace(/-p-\d+\.(webp|png|jpe?g)$/i, (_, ext) => `.${ext}`);
}

function getWidth(filename) {
  const match = filename.match(/-p-(\d+)\./);
  if (match) return Number(match[1]);
  if (/appicon|favicon/i.test(filename)) return 512;
  if (/iphone/i.test(filename)) return 1200;
  return 2000;
}

function isIcon(filename) {
  return /appicon|favicon/i.test(filename) && !/iphone/i.test(filename);
}

async function main() {
  const sportBuffers = {};
  for (const [key, url] of Object.entries(SPORT_SOURCES)) {
    process.stdout.write(`Download ${key}... `);
    sportBuffers[key] = await fetchBuffer(url);
    console.log('ok');
  }

  const htmlFiles = fs.readdirSync(root).filter((f) => f.endsWith('.html'));
  const allRefs = new Set();
  for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(root, file), 'utf8');
    for (const match of content.matchAll(/images\/[^"'\s<>]+/g)) {
      allRefs.add(match[0].replace('images/', ''));
    }
  }

  const toGenerate = [...allRefs].filter((ref) => {
    const base = getBaseName(ref);
    return FILE_TO_SPORT[base];
  });

  console.log(`Regenerating ${toGenerate.length} carousel-related files...`);

  for (const ref of toGenerate.sort()) {
    const base = getBaseName(ref);
    const sport = FILE_TO_SPORT[base];
    const source = sportBuffers[sport];
    const dest = path.join(imagesDir, ref);
    const width = getWidth(ref);

    if (isIcon(ref)) {
      const size = Math.min(width, 512);
      const pipeline = sharp(source).resize(size, size, { fit: 'cover', position: 'centre' });
      if (ref.endsWith('.png')) await pipeline.png({ quality: 90 }).toFile(dest);
      else if (/jpe?g$/i.test(ref)) await pipeline.jpeg({ quality: 85 }).toFile(dest);
      else await pipeline.webp({ quality: 85 }).toFile(dest);
    } else {
      await sharp(source)
        .resize(width, null, { fit: 'cover', position: 'centre' })
        .webp({ quality: 82 })
        .toFile(dest);
    }
  }

  console.log('Carousel images updated.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
