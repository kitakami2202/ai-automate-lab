# 運用・展開設計書

> 元設計書 §24, 25, 27, 28, 29, 30 に対応

---

## 1. 法的ページ

| ページ | パス | タイミング | 内容 |
|--------|------|-----------|------|
| プライバシーポリシー | `/privacy` | 初期構築時 | Cookie、GA4、データ収集 |
| 免責事項 | フッター | 初期構築時 | コード例による損害免責 |
| コードライセンス | フッター | 初期構築時 | MITライセンス |
| 特商法表示 | `/tokushoho` | マネタイズ開始時 | アフィリエイト開始前 |

---

## 2. 静的ファイル

### robots.txt
```
User-agent: *
Allow: /
Sitemap: https://ai-automate-lab.tech/sitemap-index.xml
Disallow: /og-images/
Disallow: /pagefind/
Disallow: /_astro/
Crawl-delay: 1
```

### llms.txt
```
# AI Automate Lab
> 中小企業のAI業務自動化を、フレームワークで再現可能にするナレッジベース

## サイト概要
中小企業向けにAI業務自動化の実践的なナレッジを提供する日本語サイト。
著者（れん）の実務経験に基づく一次情報を体系化。

## カテゴリ
- gas / discord-bot / ai-api / no-code / frameworks / reviews

## 特徴
- FAQ構造化データ付き / コピペで動くコード / Layer 1/2の2層構造 / JSON-LD付与

## 引用
自由（出典URL記載）。コードはMITライセンス。

## サイトマップ
https://ai-automate-lab.tech/sitemap-index.xml
```

---

## 3. GA4設定

プロパティ名: `AI Automate Lab` / JST / JPY

BaseLayout.astro:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

カスタムイベント: `scroll_depth` / `code_copy` / `internal_link_click` / `cta_click`

---

## 4. Search Console

1. URL: `https://ai-automate-lab.tech`
2. サイトマップ送信
3. 記事公開後 → URL検査 → インデックス登録（1日最大10URL）

---

## 5. T7用データエクスポート

- GSC: クエリタブ+ページタブCSV → `scripts/data/gsc-*.csv`
- GA4: ページとスクリーンCSV → `scripts/data/ga4-export.csv`
- 将来: GAS + API で自動取得

---

## 6. SNS展開

| PF | 目的 | 優先度 | 開始 |
|----|------|--------|------|
| X | 告知+発信 | 高 | Week 3 |
| Zenn | 転載→被リンク | 高 | Month 2 |
| Qiita | 転載→被リンク | 中 | Month 2 |

X投稿: 記事告知(公開時) / Tips(週3-5) / Before/After(週1) / 質問(週1)
投稿時間: 平日 8-9時 / 12-13時 / 20-22時

---

## 7. Zenn/Qiita転載ルール

- Layer 2記事のみ / canonical自サイト / 公開7日後以降 / 月2-4本
- 変換: 内部リンク→絶対URL / frontmatter→各PF形式 / FAQ→本文末尾追記

---

## 8. 監視

| 項目 | ツール |
|------|--------|
| 死活監視 | UptimeRobot（5分間隔） |
| Core Web Vitals | Lighthouse CI |
| リンク切れ | check-article.sh |
| カニバリ防止 | keyword-map.csv + quality-agent |
| SEO分析 | analytics-agent（月次） |

---

## 9. 初動アクションリスト

### Week 1: 環境構築
- [ ] Astro + Tailwind/Pagefind/sitemap/rss
- [ ] GitHub + Actions + ConoHa WING SFTP
- [ ] テストデプロイ確認
- [ ] BaseLayout/ArticleLayout/SEOHead
- [ ] GA4 + Search Console

### Week 2: コンテンツ基盤
- [ ] config.ts / jsonld.ts / new-article.sh
- [ ] FAQ/Breadcrumb/TOC コンポーネント
- [ ] トップページ / robots.txt / llms.txt

### Week 3-4: 初期10記事公開

### 公開後チェック
- [ ] 内部リンク双方向 / インデックス登録 / Pagefind / JSON-LD / OGP / X告知 / GA4
