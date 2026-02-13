import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ai-automate-lab.tech',
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/draft/'),
      serialize: (item) => {
        item.changefreq = 'weekly';
        item.priority = 0.7;
        // ピラー記事は高優先度
        if (item.url.includes('/gas/gas-basics') ||
            item.url.includes('/discord-bot/discord-bot-overview') ||
            item.url.includes('/frameworks/automation-roadmap') ||
            item.url.includes('/no-code/no-code-overview') ||
            item.url.includes('/ai-api/ai-api-overview') ||
            item.url.includes('/ai-api/ai-coding-overview') ||
            item.url.includes('/frameworks/ai-business-overview')) {
          item.priority = 0.9;
        }
        // カテゴリページ
        if (item.url.includes('/category/')) {
          item.priority = 0.8;
          item.changefreq = 'weekly';
        }
        // トップページ
        if (item.url === 'https://ai-automate-lab.tech/') {
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
