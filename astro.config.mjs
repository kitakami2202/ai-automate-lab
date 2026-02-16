import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import { globSync } from 'glob';
import matter from 'gray-matter';
import fs from 'fs';

// ビルド時に記事メタデータを読み取り、sitemap用マップを構築
const articleFiles = globSync('src/content/articles/**/*.md');
const articleMeta = {};
for (const file of articleFiles) {
  const { data } = matter(fs.readFileSync(file, 'utf-8'));
  if (data.draft) continue;
  const slug = file.replace(/\\/g, '/').replace('src/content/articles/', '').replace('.md', '');
  const url = `https://ai-automate-lab.tech/articles/${slug}/`;
  articleMeta[url] = {
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(data.publishedAt),
    articleType: data.articleType,
  };
}

export default defineConfig({
  site: 'https://ai-automate-lab.tech',
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/draft/'),
      serialize: (item) => {
        item.changefreq = 'weekly';
        item.priority = 0.7;
        // 記事ページ: frontmatterから lastmod と pillar 判定
        const meta = articleMeta[item.url];
        if (meta) {
          item.lastmod = meta.updatedAt;
          if (meta.articleType === 'pillar') {
            item.priority = 0.9;
          }
        }
        // カテゴリページ
        if (item.url.includes('/category/')) {
          item.priority = 0.8;
          item.changefreq = 'weekly';
        }
        // 用語集ページ
        if (item.url.includes('/glossary/')) {
          item.priority = item.url === 'https://ai-automate-lab.tech/glossary/' ? 0.6 : 0.5;
          item.changefreq = 'monthly';
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
