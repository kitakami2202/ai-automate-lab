# アーキテクチャ・技術設計書

> 元設計書 §3, 4, 18, 19 に対応

---

## 1. 技術スタック

| 項目 | 選定 | 理由 |
|------|------|------|
| フレームワーク | **Astro** | Markdown→静的HTML、最速、SEO完全制御 |
| コンテンツ管理 | **Astro Content Collections** | Markdownファイルをフォルダに置くだけ |
| スタイリング | **Tailwind CSS** | ユーティリティで素早くデザイン |
| デプロイ | **ConoHa WING** | 既存契約活用、追加コスト0、国内高速 |
| 自動デプロイ | **GitHub Actions** | git push → 自動ビルド → SFTPアップロード |
| リポジトリ | **GitHub** | Claude Codeから直接push |
| 記事量産 | **Claude Code** | Markdown生成→git push→自動デプロイ |
| 分析 | **GA4 + Search Console** | 必須 |
| 検索 | **Pagefind**（無料） | ビルド時に静的検索インデックス生成 |

### なぜAstroか
- **SEO最強**: 純粋な静的HTMLを出力。Core Web Vitals満点狙える
- **AEO完全制御**: JSON-LD、メタタグ、OGPを全てコードで自由に書ける
- **Claude Code最適**: Markdownを生成するだけ。CMS管理画面不要
- **学習コスト低**: HTMLに近い構文。React不要（必要なら部分的に使える）
- **コスト0円**: ConoHa WING既存契約をそのまま活用

---

## 2. プロジェクト構造（最終版）

```
ai-automate-lab/
├── CLAUDE.md                        # プロジェクト指示書
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
│
├── .github/
│   └── workflows/
│       └── deploy.yml               # 自動デプロイ
│
├── docs/                            # 設計ドキュメント
│   ├── architecture.md              # 本ファイル
│   ├── seo-aeo.md
│   ├── topic-clusters.md
│   ├── design.md
│   ├── pipeline.md
│   └── operations.md
│
├── scripts/
│   ├── agents/                      # エージェント指示書（7エージェント）
│   │   ├── research-agent.md        #   T1: 市場調査・KW選定
│   │   ├── outline-agent.md         #   T2: 企画・構成案
│   │   ├── writer-agent.md          #   T3: 記事生成
│   │   ├── editor-agent.md          #   T4: 編集・校閲
│   │   ├── quality-agent.md         #   T5: 品質チェック
│   │   ├── security-agent.md        #   T6: セキュリティチェック
│   │   └── analytics-agent.md       #   T7: 分析・改善
│   ├── outlines/                    # 記事ブリーフ（T2出力）
│   ├── reports/                     # 分析レポート（T7出力）
│   ├── data/                        # GSC/GA4エクスポートデータ
│   ├── templates/                   # 記事テンプレート
│   │   ├── pillar.md
│   │   ├── howto.md
│   │   ├── comparison.md
│   │   ├── framework.md
│   │   └── reference.md
│   ├── keyword-map.csv              # KWマッピング管理
│   ├── pipeline.sh                  # 一括オーケストレーター
│   ├── check-article.sh             # 機械チェック
│   ├── new-article.sh               # テンプレ生成
│   └── generate-og-images.ts        # OGP画像生成
│
├── src/
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── ArticleLayout.astro
│   ├── components/
│   │   ├── SEOHead.astro
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── TableOfContents.astro
│   │   ├── FAQ.astro
│   │   ├── Breadcrumb.astro
│   │   ├── RelatedArticles.astro
│   │   └── SearchBar.astro
│   ├── content/
│   │   ├── config.ts
│   │   └── articles/
│   │       ├── gas/
│   │       ├── discord-bot/
│   │       ├── ai-api/
│   │       ├── no-code/
│   │       ├── frameworks/
│   │       └── reviews/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── privacy.astro
│   │   ├── glossary.astro
│   │   ├── category/
│   │   │   └── [category].astro
│   │   └── articles/
│   │       └── [...slug].astro
│   ├── utils/
│   │   ├── seo.ts
│   │   ├── jsonld.ts
│   │   ├── og-image.ts
│   │   └── sitemap.ts
│   ├── assets/
│   │   └── fonts/
│   │       └── NotoSansJP-Bold.ttf
│   └── styles/
│       └── global.css
│
└── public/
    ├── robots.txt
    ├── llms.txt
    ├── favicon.svg
    ├── .htaccess
    └── og-images/
```

---

## 3. Content Collections スキーマ定義（`src/content/config.ts`）

```typescript
import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().max(60),
    description: z.string().max(160),
    category: z.enum([
      'gas', 'discord-bot', 'ai-api', 'no-code', 'frameworks', 'reviews'
    ]),
    tags: z.array(z.string()).min(1).max(8),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    author: z.string().default('れん'),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
    timeToRead: z.number().min(1).max(60),
    layer: z.enum(['entry', 'execution']),
    articleType: z.enum(['pillar', 'howto', 'comparison', 'framework', 'reference']),
    schema: z.object({
      type: z.enum(['HowTo', 'FAQPage', 'Article', 'ItemList']),
      estimatedCost: z.string().optional(),
      totalTime: z.string().optional(),
    }),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).min(1).max(10),
    relatedArticles: z.array(z.string()).min(1).max(5),
    ogImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
```

---

## 4. JSON-LD 生成ロジック（`src/utils/jsonld.ts`）

```typescript
import type { CollectionEntry } from 'astro:content';

const SITE_URL = 'https://ai-automate-lab.tech';
const SITE_NAME = 'AI Automate Lab';

const authorSchema = {
  '@type': 'Person',
  name: 'れん',
  url: `${SITE_URL}/about`,
};

const publisherSchema = {
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/favicon.svg`,
  },
};

export function generateJsonLd(
  article: CollectionEntry<'articles'>,
  url: string,
  headings: { depth: number; text: string }[]
) {
  const schemas: object[] = [];

  switch (article.data.schema.type) {
    case 'HowTo':
      schemas.push(generateHowTo(article, url, headings));
      break;
    case 'FAQPage':
      schemas.push(generateFAQPage(article, url));
      break;
    case 'ItemList':
      schemas.push(generateItemList(article, url, headings));
      break;
    case 'Article':
    default:
      schemas.push(generateArticle(article, url));
  }

  if (article.data.schema.type !== 'FAQPage' && article.data.faq.length > 0) {
    schemas.push(generateFAQPage(article, url));
  }

  schemas.push(generateBreadcrumb(article, url));

  return schemas.map(s => JSON.stringify(s));
}

function generateHowTo(
  article: CollectionEntry<'articles'>,
  url: string,
  headings: { depth: number; text: string }[]
) {
  const steps = headings
    .filter(h => h.depth === 3 && /ステップ\d+/.test(h.text))
    .map((h, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: h.text,
      url: `${url}#${encodeURIComponent(h.text)}`,
    }));

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: article.data.title,
    description: article.data.description,
    image: `${SITE_URL}${article.data.ogImage || `/og-images/${article.slug}.png`}`,
    totalTime: article.data.schema.totalTime,
    estimatedCost: article.data.schema.estimatedCost
      ? { '@type': 'MonetaryAmount', currency: 'JPY', value: article.data.schema.estimatedCost }
      : undefined,
    step: steps,
    author: authorSchema,
    datePublished: article.data.publishedAt.toISOString(),
    dateModified: article.data.updatedAt.toISOString(),
  };
}

function generateFAQPage(article: CollectionEntry<'articles'>, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.data.faq.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

function generateArticle(article: CollectionEntry<'articles'>, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.data.title,
    description: article.data.description,
    image: `${SITE_URL}${article.data.ogImage || `/og-images/${article.slug}.png`}`,
    author: authorSchema,
    publisher: publisherSchema,
    datePublished: article.data.publishedAt.toISOString(),
    dateModified: article.data.updatedAt.toISOString(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
  };
}

function generateItemList(
  article: CollectionEntry<'articles'>,
  url: string,
  headings: { depth: number; text: string }[]
) {
  const items = headings
    .filter(h => h.depth === 2 || h.depth === 3)
    .map((h, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: h.text,
      url: `${url}#${encodeURIComponent(h.text)}`,
    }));

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: article.data.title,
    description: article.data.description,
    numberOfItems: items.length,
    itemListElement: items,
  };
}

function generateBreadcrumb(article: CollectionEntry<'articles'>, url: string) {
  const categoryLabels: Record<string, string> = {
    gas: 'GAS自動化',
    'discord-bot': 'Discord Bot',
    'ai-api': 'AI API連携',
    'no-code': 'ノーコード',
    frameworks: '導入フレームワーク',
    reviews: 'レビュー・比較',
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: categoryLabels[article.data.category] || article.data.category, item: `${SITE_URL}/category/${article.data.category}` },
      { '@type': 'ListItem', position: 3, name: article.data.title, item: url },
    ],
  };
}

export function generateWebSite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: '中小企業のAI業務自動化を、フレームワークで再現可能にするナレッジベース',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}
```

---

## 5. Pagefind 日本語対応

```json
// package.json scripts
{
  "scripts": {
    "build": "npm run og && astro build",
    "postbuild": "pagefind --site dist --glob \"articles/**/*.html\""
  }
}
```

```astro
<!-- src/components/SearchBar.astro -->
<div id="search" class="relative">
  <div id="pagefind-search"></div>
</div>

<script>
  window.addEventListener('DOMContentLoaded', () => {
    new PagefindUI({
      element: '#pagefind-search',
      showSubResults: true,
      showImages: false,
      translations: {
        placeholder: '記事を検索...',
        zero_results: '「[SEARCH_TERM]」に一致する記事が見つかりません',
        many_results: '[COUNT]件の記事が見つかりました',
        filters_label: 'フィルター',
        clear_search: '検索をクリア',
      },
    });
  });
</script>

<link href="/pagefind/pagefind-ui.css" rel="stylesheet" />
<script src="/pagefind/pagefind-ui.js" type="text/javascript"></script>
```

検索対象の制御（ArticleLayout内）:
```astro
<header data-pagefind-ignore>...</header>
<main data-pagefind-body>
  <slot />
</main>
<footer data-pagefind-ignore>...</footer>
```

---

## 6. ConoHa WING 固有の設定

### SFTP接続情報の確認

```
ConoHa WING管理画面 → サーバー管理 → SSH → SSHアカウント
必要な情報:
  - ホスト名: xxx.conoha.ne.jp
  - ポート: 8022（ConoHa WING標準 ※22ではない）
  - ユーザー名: SSHアカウント名
  - パスワード: SSH設定時に決めたパスワード
```

### GitHub Secrets 設定

| Secret名 | 値 | 備考 |
|----------|-----|------|
| `CONOHA_HOST` | `xxx.conoha.ne.jp` | 管理画面で確認 |
| `CONOHA_PORT` | `8022` | ConoHa WING標準ポート |
| `CONOHA_USER` | SSHアカウント名 | |
| `CONOHA_PASS` | SSHパスワード | |

### SSL設定
- ConoHa WINGは無料SSL（Let's Encrypt）が管理画面から有効化可能
- 管理画面 → サイト管理 → サイトセキュリティ → 無料独自SSL → ON
- 強制HTTPS化もConoHa WING管理画面で設定可能

### .htaccess（`public/.htaccess`）

```apache
# gzip圧縮
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml
</IfModule>

# ブラウザキャッシュ
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 1 hour"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# セキュリティヘッダー
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

ErrorDocument 404 /404.html
```

---

## 7. OGP画像の自動生成（satori + sharp）

```typescript
// src/utils/og-image.ts
import satori from 'satori';
import sharp from 'sharp';
import fs from 'node:fs';

const fontData = fs.readFileSync('./src/assets/fonts/NotoSansJP-Bold.ttf');

const categoryColors: Record<string, string> = {
  gas: '#0F9D58',
  'discord-bot': '#5865F2',
  'ai-api': '#FF6B35',
  'no-code': '#7C3AED',
  frameworks: '#2563EB',
  reviews: '#DC2626',
};

export async function generateOgImage(title: string, category: string): Promise<Buffer> {
  const color = categoryColors[category] || '#2563EB';

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px', height: '630px', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '60px 80px',
          background: `linear-gradient(135deg, ${color} 0%, #1a1a2e 100%)`,
          color: '#ffffff', fontFamily: 'Noto Sans JP',
        },
        children: [
          { type: 'div', props: { style: { fontSize: '48px', fontWeight: 'bold', lineHeight: 1.4 }, children: title } },
          { type: 'div', props: { style: { marginTop: 'auto', fontSize: '24px', opacity: 0.8 }, children: 'AI Automate Lab' } },
        ],
      },
    },
    { width: 1200, height: 630, fonts: [{ name: 'Noto Sans JP', data: fontData, weight: 700, style: 'normal' }] }
  );

  return await sharp(Buffer.from(svg)).png().toBuffer();
}
```

```typescript
// scripts/generate-og-images.ts
import { generateOgImage } from '../src/utils/og-image';
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { glob } from 'glob';

async function main() {
  const files = await glob('src/content/articles/**/*.md');
  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    const { data } = matter(content);
    const slug = path.basename(file, '.md');
    const category = path.basename(path.dirname(file));
    const outputPath = path.join('public/og-images', category, `${slug}.png`);
    try { await fs.access(outputPath); continue; } catch {}
    const dir = path.dirname(outputPath);
    await fs.mkdir(dir, { recursive: true });
    const buffer = await generateOgImage(data.title, category);
    await fs.writeFile(outputPath, buffer);
    console.log(`Generated: ${outputPath}`);
  }
}
main();
```

---

## 8. Astro設定（`astro.config.mjs`）

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ai-automate-lab.tech',
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('/draft/'),
      changefreq: 'weekly',
      priority: 0.7,
      serialize: (item) => {
        if (item.url.includes('/gas/gas-basics') ||
            item.url.includes('/discord-bot/overview') ||
            item.url.includes('/frameworks/roadmap') ||
            item.url.includes('/no-code/overview') ||
            item.url.includes('/ai-api/overview')) {
          item.priority = 0.9;
        }
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
      rollupOptions: { output: { assetFileNames: '_assets/[name].[hash][extname]' } },
    },
  },
});
```

---

## 9. GitHub Actions 完全版（`.github/workflows/deploy.yml`）

```yaml
name: Deploy to ConoHa WING
on:
  push:
    branches: [main]

concurrency:
  group: deploy
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Generate OG images
        run: npm run og
      - name: Build
        run: npx astro build
      - name: Generate search index
        run: npx pagefind --site dist --glob "articles/**/*.html"
      - name: Verify build output
        run: |
          test -f dist/index.html || (echo "ERROR: index.html not found" && exit 1)
          test -f dist/sitemap-index.xml || (echo "ERROR: sitemap not found" && exit 1)
          test -f dist/robots.txt || (echo "ERROR: robots.txt not found" && exit 1)
          echo "Build verification passed"
      - name: Deploy via SFTP
        uses: wlixcc/SFTP-Deploy-Action@v1.2.4
        with:
          server: ${{ secrets.CONOHA_HOST }}
          port: ${{ secrets.CONOHA_PORT }}
          username: ${{ secrets.CONOHA_USER }}
          password: ${{ secrets.CONOHA_PASS }}
          local_path: ./dist/*
          remote_path: /home/${{ secrets.CONOHA_USER }}/public_html/ドメイン名/
      - name: Create issue on failure
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: `Deploy failed: ${context.sha.substring(0, 7)}`,
              body: `Deployment failed for commit ${context.sha}\nSee: ${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`,
              labels: ['deploy-failure']
            });
```

### ロールバック手順
```bash
git revert HEAD
git push origin main
```

---

## 10. ビルドパイプライン全体像

```
npm run build 実行時の処理フロー:

1. npm run og → OGP画像を public/og-images/ に生成（差分のみ）
2. astro build → Markdown → HTML変換 + JSON-LD + sitemap生成
3. pagefind --site dist → 検索インデックス生成

最終出力（dist/）:
  ├── index.html
  ├── articles/gas/gas-basics/index.html（他記事も同様）
  ├── category/gas/index.html（他カテゴリも同様）
  ├── sitemap-index.xml
  ├── rss.xml
  ├── robots.txt
  ├── llms.txt
  ├── og-images/
  ├── pagefind/
  ├── _assets/（CSS/JS、ハッシュ付き）
  └── .htaccess
```

### 必要なnpmパッケージ

```json
{
  "dependencies": {
    "astro": "^4.x",
    "@astrojs/tailwind": "^5.x",
    "@astrojs/sitemap": "^3.x",
    "@astrojs/rss": "^4.x",
    "tailwindcss": "^3.x"
  },
  "devDependencies": {
    "pagefind": "^1.x",
    "satori": "^0.10.x",
    "sharp": "^0.33.x",
    "gray-matter": "^4.x",
    "glob": "^10.x",
    "tsx": "^4.x",
    "@tailwindcss/typography": "^0.5.x"
  }
}
```
