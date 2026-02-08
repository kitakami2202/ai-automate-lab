import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ai-automate-lab.com',
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/draft/'),
      serialize: (item) => {
        item.changefreq = 'weekly';
        item.priority = 0.7;
        if (item.url.includes('/gas/gas-basics') ||
            item.url.includes('/discord-bot/overview') ||
            item.url.includes('/frameworks/roadmap') ||
            item.url.includes('/no-code/overview') ||
            item.url.includes('/ai-api/overview')) {
          item.priority = 0.9;
        }
        if (item.url === 'https://ai-automate-lab.com/') {
          item.priority = 1.0;
          item.changefreq = 'daily';
        }
        return item;
      },
    }),
  ],
  output: 'static',
  build: { format: 'directory', assets: '_assets' },
  markdown: { shikiConfig: { theme: 'github-dark', wrap: true } },
  vite: {
    build: {
      rollupOptions: {
        output: { assetFileNames: '_assets/[name].[hash][extname]' },
      },
    },
  },
});
