import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const INSTAGRAM = 'https://www.instagram.com/swing.play/';
const EMAIL = 'swingplay.india@gmail.com';

const instagramSvg = `<svg width="100%" viewBox="0 0 24 24" aria-hidden="true" class="u-svg" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`;

const mapNavBlock = /<div role="listitem" class="footer_social_item">\s*<a aria-label="Google Map"[\s\S]*?<\/a>\s*<\/div>\s*/g;

const findUsFooter = /<div data-wf--footer-link--variant="small"[^>]*>\s*<a href="https:\/\/www\.google\.com\/maps[^"]*"[^>]*>\s*<div class="footer_link_text">Find us<\/div>\s*<\/a>\s*<\/div>\s*/g;

for (const file of fs.readdirSync(root).filter((f) => f.endsWith('.html'))) {
  let html = fs.readFileSync(path.join(root, file), 'utf8');
  const before = html;

  html = html.replace(/contact@swingandall\.com/g, EMAIL);
  html = html.replace(/kvkk@swingandall\.com/g, EMAIL);

  html = html.replace(/https:\/\/www\.linkedin\.com\/company\/swingandall/g, INSTAGRAM);
  html = html.replace(/aria-label="Linked In"/g, 'aria-label="Instagram"');

  html = html.replace(mapNavBlock, '');
  html = html.replace(findUsFooter, '');

  html = html.replace(
    /"https:\/\/www\.google\.com\/maps[^"]*"/g,
    `"${INSTAGRAM}"`
  );

  html = html.replace(
    /"sameAs":\s*\[[^\]]*\]/,
    `"sameAs": [\n      "${INSTAGRAM}"\n    ]`
  );

  // Replace LinkedIn SVG inside Instagram links (icon_wrap blocks following Instagram label)
  html = html.replace(
    /(<a aria-label="Instagram"[^>]*>[\s\S]*?<div class="icon_wrap">\s*)<svg[\s\S]*?<\/svg>/g,
    `$1${instagramSvg}`
  );

  if (html !== before) {
    fs.writeFileSync(path.join(root, file), html);
    console.log('Updated', file);
  }
}
