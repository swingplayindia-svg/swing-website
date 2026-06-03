import fs from 'fs';
import path from 'path';
import https from 'https';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const imagesDir = path.join(root, 'images');

const SPORTS = [
  { label: 'Basketball', url: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=2400' },
  { label: 'Tennis', url: 'https://images.pexels.com/photos/573911/pexels-photo-573911.jpeg?auto=compress&cs=tinysrgb&w=2400' },
  { label: 'Padel', url: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=2400' },
  { label: 'Pickleball', url: 'https://images.pexels.com/photos/3621162/pexels-photo-3621162.jpeg?auto=compress&cs=tinysrgb&w=2400' },
  { label: 'Cricket', url: 'https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=2400' },
  { label: 'Soccer', url: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=2400' },
  { label: 'Running', url: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=2400' },
  { label: 'Volleyball', url: 'https://images.pexels.com/photos/358382/pexels-photo-358382.jpeg?auto=compress&cs=tinysrgb&w=2400' },
  { label: 'Golf', url: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=2400' },
  { label: 'Swimming', url: 'https://images.pexels.com/photos/128756/pexels-photo-128756.jpeg?auto=compress&cs=tinysrgb&w=2400' },
  { label: 'Football', url: 'https://images.pexels.com/photos/3621163/pexels-photo-3621163.jpeg?auto=compress&cs=tinysrgb&w=2400' },
  { label: 'Team Sports', url: 'https://images.pexels.com/photos/3621105/pexels-photo-3621105.jpeg?auto=compress&cs=tinysrgb&w=2400' },
];

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
  if (/appicon|favicon|icon/i.test(filename)) return 512;
  if (/iphone/i.test(filename)) return 1200;
  return 2000;
}

function isIcon(filename) {
  return /appicon|favicon|icon|\.png$|\.jpeg$/i.test(filename) && !/iphone/i.test(filename);
}

async function main() {
  fs.mkdirSync(imagesDir, { recursive: true });

  const htmlFiles = fs.readdirSync(root).filter((f) => f.endsWith('.html'));
  const allRefs = new Set();
  for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(root, file), 'utf8');
    for (const match of content.matchAll(/images\/[^"'\s<>]+/g)) {
      allRefs.add(match[0].replace('images/', ''));
    }
  }

  const bases = [...new Set([...allRefs].map(getBaseName))].filter(
    (f) => !f.endsWith('.svg')
  );

  console.log(`Generating ${allRefs.size} files from ${bases.length} base images...`);

  const sourceBuffers = [];
  for (const sport of SPORTS) {
    process.stdout.write(`Downloading ${sport.label}... `);
    sourceBuffers.push(await fetchBuffer(sport.url));
    console.log('ok');
  }

  const baseAssignments = new Map();
  bases.forEach((base, i) => {
    baseAssignments.set(base, sourceBuffers[i % sourceBuffers.length]);
  });

  for (const ref of [...allRefs].sort()) {
    if (ref.endsWith('.svg')) continue;

    const base = getBaseName(ref);
    const width = getWidth(ref);
    const dest = path.join(imagesDir, ref);
    const source = baseAssignments.get(base);
    if (!source) continue;

    if (isIcon(ref)) {
      const size = Math.min(width, 512);
      const pipeline = sharp(source)
        .resize(size, size, { fit: 'cover', position: 'centre' });

      if (ref.endsWith('.png')) {
        await pipeline.png({ quality: 90 }).toFile(dest);
      } else if (/jpe?g$/i.test(ref)) {
        await pipeline.jpeg({ quality: 85 }).toFile(dest);
      } else {
        await pipeline.webp({ quality: 85 }).toFile(dest);
      }
    } else {
      await sharp(source)
        .resize(width, null, { fit: 'cover', withoutEnlargement: false })
        .webp({ quality: 82 })
        .toFile(dest);
    }
  }

  // Branded favicon & app icon
  const brandSvg = Buffer.from(`
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" rx="96" fill="#016B04"/>
      <circle cx="256" cy="256" r="120" fill="none" stroke="#ffffff" stroke-width="24"/>
      <path d="M256 136 L256 376 M136 256 L376 256" stroke="#ffffff" stroke-width="20" stroke-linecap="round"/>
    </svg>
  `);

  await sharp(brandSvg).png().toFile(path.join(imagesDir, 'favicon.png'));
  await sharp(brandSvg).png().toFile(path.join(imagesDir, 'app-icon.png'));

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
