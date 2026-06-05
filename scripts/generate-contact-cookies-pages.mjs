import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const EMAIL = 'swingplay.india@gmail.com';
const INSTAGRAM = 'https://www.instagram.com/swing.play/';

function mainSection(title, bodyHtml) {
  return `<main class="page_main"><section data-wf--section--variant="inherit" class="u-section"><div class="u-background-slot"></div><div data-wf--spacer--variant="page-top" class="u-section-spacer w-variant-e359d2da-de19-6775-b122-3e06f925f39e u-ignore-trim"></div><div class="u-container u-container-small"><div data-wf--layout--variant="stack" class="u-layout-wrapper u-width-auto u-align-self-center"><div class="u-layout"><div class="u-layout-column-1"><div data-wf--typography-heading--variant="h2" class="u-heading w-variant-433d40c6-c261-f13f-c899-61d2cadf150f w-richtext u-width-auto u-alignment-center"><h2>${title}</h2></div></div><div class="u-layout-column-2"><div data-wf--typography-paragraph--variant="inherit" class="u-text u-rich-text w-richtext">${bodyHtml}</div></div></div></div></div><div data-wf--spacer--variant="main" class="u-section-spacer w-variant-60a7ad7d-02b0-6682-95a5-2218e6fd1490 u-ignore-trim"></div></section>${footerHtml()}</main>`;
}

function footerHtml() {
  return `<div data-footer-parallax="" class="footer_wrap"><footer data-footer-parallax-inner="" class="u-footer"><div data-wf--spacer--variant="large" class="u-section-spacer w-variant-8cc18b30-4618-8767-0111-f6abfe45aaa3 u-ignore-trim"></div><div class="footer_contain u-container"><div class="footer_layout u-grid-custom"><div class="footer_link_main_wrap"><section class="footer_group_wrap"><div role="list" class="footer_group_list"><div data-wf--footer-link--variant="large" role="listitem" class="footer_group_item"><a href="/" class="footer_link_wrap w-inline-block"><div class="footer_link_text">Home</div></a></div><div data-wf--footer-link--variant="large" role="listitem" class="footer_group_item"><a href="/privacy-policy" class="footer_link_wrap w-inline-block"><div class="footer_link_text">Privacy Policy</div></a></div></div></section></div><div class="footer_link_secondary_wrap"><section class="footer_group_wrap"><div role="list" class="footer_group_list"><div data-wf--footer-link--variant="small" role="listitem" class="footer_group_item w-variant-dc12ad8b-a3fd-b6f4-7870-56071789e1f4"><a href="/contact" class="footer_link_wrap w-inline-block"><div class="footer_link_text">Contact</div></a></div><div data-wf--footer-link--variant="small" role="listitem" class="footer_group_item w-variant-dc12ad8b-a3fd-b6f4-7870-56071789e1f4"><a href="/cookies" class="footer_link_wrap w-inline-block"><div class="footer_link_text">Cookies</div></a></div></div></section></div><div class="footer_text_wrap"><div class="u-text u-rich-text w-richtext"><p>SWING connects players for padel, cricket, football, pickleball, basketball, and more — find partners, schedule matches, and track scores in one app.</p></div><div class="footer_social_wrap"><h3 class="footer_social_title u-text-style-h6">Follow us</h3><div role="list" class="footer_social_list"><div role="listitem" class="footer_social_item"><a aria-label="Instagram" href="${INSTAGRAM}" target="_blank" rel="noopener noreferrer" class="footer_social_link w-inline-block"><div class="icon_wrap"><svg width="100%" viewBox="0 0 24 24" aria-hidden="true" class="u-svg" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></div></a></div></div></div></div></div></div><div data-wf--spacer--variant="small" class="u-section-spacer w-variant-d422cbd0-f212-c815-68df-63414354c21d u-ignore-trim"></div></footer><div data-footer-parallax-dark="" class="footer-wrap__dark"></div></div>`;
}

const contactBody = `
<h2>Get in touch</h2>
<p>Questions about SWING, the app, or partnerships? Reach out anytime.</p>
<h3>Email</h3>
<p><a href="mailto:${EMAIL}">${EMAIL}</a></p>
<h3>Instagram</h3>
<p><a href="${INSTAGRAM}" target="_blank" rel="noopener noreferrer">@swing.play</a></p>
<h3>Early access</h3>
<p>Tap <strong>Join us</strong> in the menu to share your email for updates and launch news.</p>
`.trim();

const cookiesBody = `
<h2>Cookie Policy</h2>
<p>This policy explains how SWING uses cookies and similar technologies on this website.</p>
<h3>What are cookies?</h3>
<p>Cookies are small files stored on your device. They help the site function, stay secure, and remember your preferences.</p>
<h3>Types of cookies we use</h3>
<ul role="list">
<li><strong>Essential</strong> — required for core functionality and security.</li>
<li><strong>Analytics</strong> — help us understand how visitors use the site.</li>
<li><strong>Preferences</strong> — remember choices such as consent settings.</li>
</ul>
<h3>Manage preferences</h3>
<p>You can change your cookie choices at any time:</p>
<p><a href="#" fs-consent-element="open-preferences">Open cookie preferences</a></p>
<h3>Contact</h3>
<p>Questions about cookies? Email <a href="mailto:${EMAIL}">${EMAIL}</a>.</p>
<p><strong>Effective date:</strong> 3 June 2026</p>
`.trim();

function buildPage({ slug, title, description, bodyHtml, activeNav }) {
  const base = fs.readFileSync(path.join(root, 'privacy-policy.html'), 'utf8');
  let html = base;

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = html.replace(
    /<meta content="[^"]*" name="description"\/>/,
    `<meta content="${description}" name="description"/>`
  );

  html = html.replace(/<main class="page_main">[\s\S]*?<\/main>/, mainSection(title, bodyHtml));

  const navItems = [
    { key: 'home', href: '/', label: 'Home' },
    { key: 'privacy-policy', href: '/privacy-policy', label: 'Privacy Policy' },
    { key: 'contact', href: '/contact', label: 'Contact' },
    { key: 'cookies', href: '/cookies', label: 'Cookies' },
  ];

  const navUl = navItems
    .map(({ key, href, label }) => {
      const current = key === activeNav ? ' aria-current="page" class="twostep-nav__link w-inline-block w--current"' : ' class="twostep-nav__link w-inline-block"';
      return `<li class="twostep-nav__li"><a data-nav-link="${key}" data-draw-line="" href="${href}"${current}><span class="u-text-style-h3">${label}</span><div data-draw-line-box="" class="text-draw__box"></div></a></li>`;
    })
    .join('');

  html = html.replace(
    /<ul class="twostep-nav__ul">[\s\S]*?<\/ul>\s*<ul class="twostep-nav__ul">/,
    `<ul class="twostep-nav__ul">${navUl}</ul><ul class="twostep-nav__ul">`
  );

  html = html.replace(/href="\/" class="twostep-nav__logo[^"]*"/, 'href="/" class="twostep-nav__logo w-inline-block"');
  html = html.replace(/w--current/g, '');
  if (activeNav !== 'home') {
    html = html.replace(
      new RegExp(`data-nav-link="${activeNav}"[^>]*class="([^"]*)"`),
      `data-nav-link="${activeNav}" data-draw-line="" href="/${slug}" aria-current="page" class="$1 w--current"`
    );
  } else {
    html = html.replace(
      'href="/" class="twostep-nav__logo w-inline-block"',
      'href="/" class="twostep-nav__logo w-inline-block w--current"'
    );
  }

  return html;
}

fs.writeFileSync(
  path.join(root, 'contact.html'),
  buildPage({
    slug: 'contact',
    title: 'Contact | SWING',
    description: 'Contact SWING for app support, partnerships, and general inquiries.',
    bodyHtml: contactBody,
    activeNav: 'contact',
  })
);

fs.writeFileSync(
  path.join(root, 'cookies.html'),
  buildPage({
    slug: 'cookies',
    title: 'Cookie Policy | SWING',
    description: 'Learn how SWING uses cookies and how to manage your preferences.',
    bodyHtml: cookiesBody,
    activeNav: 'cookies',
  })
);

console.log('Created contact.html and cookies.html');
