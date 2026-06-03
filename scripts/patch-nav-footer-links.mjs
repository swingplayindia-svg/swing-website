import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const NAV_EXTRA = `<li class="twostep-nav__li"><a data-nav-link="contact" data-draw-line="" href="/contact" class="twostep-nav__link w-inline-block"><span class="u-text-style-h3">Contact</span><div data-draw-line-box="" class="text-draw__box"></div></a></li><li class="twostep-nav__li"><a data-nav-link="cookies" data-draw-line="" href="/cookies" class="twostep-nav__link w-inline-block"><span class="u-text-style-h3">Cookies</span><div data-draw-line-box="" class="text-draw__box"></div></a></li>`;

const NAV_INSERT_AFTER =
  /<span class="u-text-style-h3">Privacy Policy<\/span><div data-draw-line-box="" class="text-draw__box"><\/div><\/a><\/li>(?=<div class="u-embed-css w-embed">)/;

const FOOTER_CONTACT =
  /href="mailto:swingplay\.india@gmail\.com\?subject=Website%20Contact" class="footer_link_wrap/g;

const FOOTER_COOKIES =
  /(<div data-wf--footer-link--variant="small"[^>]*role="listitem"[^>]*)(?:\s*fs-consent-element="open-preferences")?([^>]*>\s*<a )href="#"(\s+class="footer_link_wrap[^"]*"[^>]*>\s*<div class="footer_link_text">Cookies<\/div>)/g;

const pages = fs
  .readdirSync(root)
  .filter((f) => f.endsWith('.html'))
  .map((f) => path.join(root, f));

let updated = 0;

for (const file of pages) {
  let html = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (!html.includes('data-nav-link="contact"') && NAV_INSERT_AFTER.test(html)) {
    html = html.replace(NAV_INSERT_AFTER, `$&${NAV_EXTRA}`);
    changed = true;
  }

  if (FOOTER_CONTACT.test(html)) {
    html = html.replace(FOOTER_CONTACT, 'href="/contact" class="footer_link_wrap');
    changed = true;
  }

  if (FOOTER_COOKIES.test(html)) {
    html = html.replace(
      FOOTER_COOKIES,
      '$1$2href="/cookies"$3'
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, html);
    updated += 1;
    console.log('Patched', path.basename(file));
  }
}

console.log(updated ? `Done (${updated} files)` : 'No files needed patching');
