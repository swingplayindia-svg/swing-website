import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

const htmlPages = [
  'index',
  'contact',
  'cookies',
  'privacy-policy',
  'terms-and-conditions',
  'kvkk-statement',
  'kvkk-aydinlatma-metni',
  'search',
];

const routeMap = Object.fromEntries(
  htmlPages.map((page) => [`/${page === 'index' ? '' : page}`, `${page}.html`])
);

export default defineConfig({
  appType: 'mpa',
  server: {
    open: true,
  },
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        htmlPages.map((page) => [page, resolve(__dirname, `${page}.html`)])
      ),
    },
  },
  plugins: [
    {
      name: 'clean-urls',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url?.split('?')[0] ?? '/';
          if (url.includes('.') && !url.endsWith('.html')) {
            return next();
          }

          const normalized = url.endsWith('/') && url.length > 1 ? url.slice(0, -1) : url;
          const htmlFile = routeMap[normalized] ?? routeMap[`${normalized}/`];

          if (htmlFile && fs.existsSync(resolve(__dirname, htmlFile))) {
            req.url = `/${htmlFile}`;
          }

          next();
        });
      },
    },
  ],
});
