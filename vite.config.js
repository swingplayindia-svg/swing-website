import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs, { cpSync, existsSync } from 'fs';

const staticDirs = ['images', 'js', 'css'];

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
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
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
      name: 'copy-static-assets',
      closeBundle() {
        const outDir = resolve(__dirname, 'dist');
        for (const dir of staticDirs) {
          const src = resolve(__dirname, dir);
          if (!existsSync(src)) continue;
          cpSync(src, resolve(outDir, dir), { recursive: true });
        }
      },
    },
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
