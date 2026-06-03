import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const POPUP_HTML = `
  <div id="join-popup" class="join-popup" hidden aria-hidden="true">
    <div class="join-popup__backdrop" data-join-popup-close></div>
    <div class="join-popup__dialog" role="dialog" aria-modal="true" aria-labelledby="join-popup-title">
      <button type="button" class="join-popup__close" data-join-popup-close aria-label="Close">&times;</button>
      <h2 id="join-popup-title" class="join-popup__title">Join SWING</h2>
      <p class="join-popup__text">Share your email and we&rsquo;ll reach out with updates.</p>
      <form id="join-popup-form" novalidate>
        <label class="join-popup__label" for="join-email">Email address</label>
        <input class="join-popup__input" type="email" id="join-email" name="email" autocomplete="email" placeholder="you@example.com" required />
        <p class="join-popup__error" hidden></p>
        <button type="submit" class="join-popup__submit">Submit</button>
      </form>
      <p class="join-popup__success" hidden>Thanks! We&rsquo;ll be in touch soon.</p>
    </div>
  </div>
`;

const files = fs
  .readdirSync(root)
  .filter((f) => f.endsWith('.html') && f !== 'index.html');

for (const file of files) {
  const filePath = path.join(root, file);
  let html = fs.readFileSync(filePath, 'utf8');

  html = html.replace(/<li class="twostep-nav__li"><a data-nav-link="life-at-swing-and-all"[\s\S]*?<\/a><\/li>/g, '');
  html = html.replace(/<li class="twostep-nav__li"><a data-nav-link="careers"[\s\S]*?<\/a><\/li>/g, '');

  if (!html.includes('data-nav-link="privacy-policy"')) {
    html = html.replace(
      /(<li class="twostep-nav__li"><a data-nav-link="home"[\s\S]*?<\/a><\/li>)/,
      `$1<li class="twostep-nav__li"><a data-nav-link="privacy-policy" data-draw-line="" href="/privacy-policy" class="twostep-nav__link w-inline-block"><span class="u-text-style-h3">Privacy Policy</span><div data-draw-line-box="" class="text-draw__box"></div></a></li>`
    );
  }

  html = html.replace(
    /<div data-wf--footer-link--variant="large"[^>]*><a href="\/life-at-swing-and-all"[\s\S]*?<\/a><\/div>/g,
    ''
  );
  html = html.replace(
    /<div data-wf--footer-link--variant="large"[^>]*><a href="\/careers"[\s\S]*?<\/a><\/div>/g,
    ''
  );

  if (!html.includes('footer_link_text">Privacy Policy</div></a></div></div></section></div><div id="w-node-_450acc61')) {
    html = html.replace(
      /(<div data-wf--footer-link--variant="large"[^>]*><a href="\/"[^>]*><div class="footer_link_text">Home<\/div><\/a><\/div>)/,
      `$1<div data-wf--footer-link--variant="large" data-trigger="hover-other focus-other" role="listitem" class="footer_group_item"><a href="/privacy-policy" class="footer_link_wrap w-inline-block"><div class="footer_link_text">Privacy Policy</div></a></div>`
    );
  }

  html = html.replace(/href="https:\/\/swingandall\.com\/privacy-policy[^"]*"/g, 'href="/privacy-policy"');
  html = html.replace(/href="\/careers"/g, 'href="#" data-join-popup');
  html = html.replace(/href="\/life-at-swing-and-all"/g, 'href="/"');

  html = html.replace(
    /<div data-wf--visual-image--variant="cover" class="u-image-wrapper[^"]*" data-nav-img="life-at-swing-and-all">[\s\S]*?<\/div>/g,
    ''
  );
  html = html.replace(
    /<div data-wf--visual-image--variant="cover" class="u-image-wrapper[^"]*" data-nav-img="careers">[\s\S]*?<\/div>/g,
    ''
  );

  if (!html.includes('id="join-popup"')) {
    html = html.replace('</body>', `${POPUP_HTML}\n<script src="js/join-popup.js" type="text/javascript"></script>\n</body>`);
  } else if (!html.includes('js/join-popup.js')) {
    html = html.replace('</body>', '<script src="js/join-popup.js" type="text/javascript"></script>\n</body>');
  }

  html = html.replace(
    /<title>Privacy Policy &amp; Terms of Service \| swing<\/title>/,
    '<title>Privacy Policy | SWING</title>'
  );

  fs.writeFileSync(filePath, html);
  console.log('Patched', file);
}
