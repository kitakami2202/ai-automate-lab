import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

function readFrontmatter(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const fm = match[1];
  const title = fm.match(/^title:\s*"(.*?)"/m) || fm.match(/^title:\s*'(.*?)'/m) || fm.match(/^title:\s*(.*)/m);
  const desc = fm.match(/^description:\s*"(.*?)"/m) || fm.match(/^description:\s*'(.*?)'/m) || fm.match(/^description:\s*(.*)/m);
  const category = fm.match(/^category:\s*"?(.*?)"?\s*$/m);
  const articleType = fm.match(/^articleType:\s*"?(.*?)"?\s*$/m);
  const layer = fm.match(/^layer:\s*"?(.*?)"?\s*$/m);
  const draft = fm.match(/^draft:\s*true/m);
  return {
    title: title ? title[1].trim() : '',
    description: desc ? desc[1].trim() : '',
    category: category ? category[1].trim() : '',
    articleType: articleType ? articleType[1].trim() : '',
    layer: layer ? layer[1].trim() : '',
    draft: !!draft,
  };
}

function walkDir(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walkDir(fullPath));
    } else if (entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

const articlesDir = path.join(root, 'src', 'content', 'articles');
const files = walkDir(articlesDir);
const articles = [];

for (const f of files) {
  const fm = readFrontmatter(f);
  if (!fm || fm.draft) continue;
  const rel = path.relative(articlesDir, f).replace(/\\/g, '/').replace(/\.md$/, '');
  articles.push({ ...fm, slug: rel });
}

const grouped = {};
for (const a of articles) {
  if (!grouped[a.category]) grouped[a.category] = [];
  grouped[a.category].push(a);
}

const catLabels = {
  gas: 'GAS自動化',
  'discord-bot': 'Discord Bot',
  'ai-api': 'AI API連携',
  'no-code': 'ノーコード',
  frameworks: 'フレームワーク',
  reviews: 'レビュー・比較',
};

// llms.txt
let llmsTxt = `# AI Automate Lab
> 中小企業のAI業務自動化を、フレームワークで再現可能にするナレッジベース

## サイト概要
中小企業向けにAI業務自動化の実践的なナレッジを提供する日本語サイト。
著者（れん）の実務経験に基づく一次情報を体系化。

## カテゴリと記事一覧
`;

// llms-full.txt
let llmsFullTxt = `# AI Automate Lab - 全記事一覧
> 中小企業のAI業務自動化を、フレームワークで再現可能にするナレッジベース
> URL: https://ai-automate-lab.tech

`;

for (const [cat, label] of Object.entries(catLabels)) {
  const catArticles = grouped[cat] || [];
  llmsTxt += `\n### ${label} (${cat})\n`;
  llmsFullTxt += `## ${label}\n\n`;

  for (const a of catArticles) {
    const url = `https://ai-automate-lab.tech/articles/${a.slug}/`;
    llmsTxt += `- [${a.title}](${url})\n`;
    llmsFullTxt += `### ${a.title}\n`;
    llmsFullTxt += `- URL: ${url}\n`;
    llmsFullTxt += `- ${a.description}\n`;
    llmsFullTxt += `- レイヤー: ${a.layer === 'entry' ? 'Layer 1（入門）' : 'Layer 2（実践）'}\n`;
    llmsFullTxt += `- 記事タイプ: ${a.articleType}\n\n`;
  }
}

llmsTxt += `
## 特徴
- FAQ構造化データ付き / コピペで動くコード / Layer 1/2の2層構造 / JSON-LD付与

## 引用
自由（出典URL記載）。コードはMITライセンス。

## 詳細版
全記事の要約付き一覧: https://ai-automate-lab.tech/llms-full.txt

## サイトマップ
https://ai-automate-lab.tech/sitemap-index.xml
`;

fs.writeFileSync(path.join(root, 'public', 'llms.txt'), llmsTxt, 'utf-8');
fs.writeFileSync(path.join(root, 'public', 'llms-full.txt'), llmsFullTxt, 'utf-8');
console.log(`llms.txt: ${articles.length} articles written`);
console.log('llms-full.txt generated');
