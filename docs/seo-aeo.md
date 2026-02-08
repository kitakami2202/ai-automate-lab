# SEO × AEO 設計書

> 元設計書 §5, 6, 12 に対応

---

## 1. 記事フォーマット（Markdown frontmatter）

Claude Codeが生成するMarkdownの統一フォーマット：

```markdown
---
title: "GASでLINE Botを作る方法【2026年版】"
description: "Google Apps Scriptを使ってLINE Botを構築する手順を、コード付きで解説。初心者でも30分で動くBotが作れます。"
category: "gas"
tags: ["GAS", "LINE Bot", "自動化", "チャットボット"]
publishedAt: 2026-02-07
updatedAt: 2026-02-07
author: "れん"
difficulty: "beginner"      # beginner / intermediate / advanced
timeToRead: 15              # 分
layer: "execution"          # entry（Layer 1）/ execution（Layer 2）
articleType: "howto"        # pillar / howto / comparison / framework / reference
schema:
  type: "HowTo"             # HowTo / FAQPage / Article / ItemList
  estimatedCost: "0円"
  totalTime: "PT30M"
faq:
  - question: "GASでLINE Botを作るのに費用はかかる？"
    answer: "GASもLINE Messaging APIも無料枠で利用可能です。"
  - question: "プログラミング経験がなくても作れる？"
    answer: "本記事のコードをコピペすれば動きます。基礎的な解説も含めています。"
relatedArticles:
  - "gas-basics"
  - "gas-spreadsheet-automation"
  - "where-to-automate-first"
---
```

### 記事本文テンプレート

```markdown
## はじめに

<!-- Layer 2記事の場合: Layer 1への導線 -->
> この記事はGASの具体的な実装手順です。
> 「そもそもGASで何ができるの？」という方は
> [GASでできること完全ガイド](/articles/gas/gas-basics)をご覧ください。

<!-- 結論ファースト: 3行以内で要約 -->
GASとLINE Messaging APIを組み合わせれば、無料でLINE Botが作れます。
この記事では、実際に動くコード付きで30分で構築する手順を解説します。

## この記事でわかること
- GASプロジェクトの作成方法
- LINE Messaging APIのチャネル設定
- Webhook連携の仕組み
- 実用的な応答Botのコード

## 手順
### ステップ1: ...
### ステップ2: ...

## よくある質問
<!-- frontmatterのfaqから自動生成 -->

## まとめ
## 次のステップ
→ [GAS × スプレッドシート自動化の手順はこちら](/articles/gas/gas-spreadsheet-automation)
```

---

## 2. SEOHead.astro（全ページ共通）

自動生成される要素：
```
<head>
  ├── <title> + <meta name="description">
  ├── <link rel="canonical">
  ├── OGP（og:title, og:description, og:image, og:type）
  ├── Twitter Card
  ├── JSON-LD（記事タイプに応じて自動切替）
  └── <link rel="alternate" hreflang="ja">
</head>
```

---

## 3. JSON-LD 自動生成

frontmatterの`schema.type`に応じて自動で構造化データを生成：

| schema.type | 出力されるJSON-LD | 用途 |
|-------------|------------------|------|
| `HowTo` | HowToスキーマ（ステップ自動抽出） | 手順記事 |
| `FAQPage` | FAQPageスキーマ（frontmatterのfaqから生成） | Q&A含む記事 |
| `Article` | BlogPostingスキーマ | 一般記事 |
| `ItemList` | ItemListスキーマ | 比較・一覧記事 |

**全記事共通で追加されるスキーマ:**
- `BreadcrumbList`（パンくずリスト）
- `WebSite`（サイト情報 + 検索ボックス）
- `Organization` / `Person`（著者情報）

---

## 4. 自動生成されるSEOファイル

| ファイル | 生成方法 | 内容 |
|----------|----------|------|
| `sitemap.xml` | `@astrojs/sitemap` | 全ページのURL + 更新日 + 優先度 |
| `robots.txt` | 静的ファイル | サイトマップURL指定 |
| `rss.xml` | `@astrojs/rss` | 記事フィード |
| `llms.txt` | カスタムスクリプト | AI向けサイト説明（AEO） |

---

## 5. AEO具体施策

| 施策 | 具体的な実装 |
|------|-------------|
| **結論ファースト** | 各記事の冒頭3行で「〇〇とは△△です」と明確に定義 |
| **FAQ構造化** | frontmatterのfaqを3-5個必須化、FAQPage JSON-LD出力 |
| **表形式の比較** | 比較記事は必ずMarkdownテーブルで整理（AIが構造認識しやすい） |
| **llms.txt** | サイトルートに配置、記事追加のたびに更新 |
| **引用しやすい文体** | 「〇〇は△△です。理由は3つあります。」のような断定＋構造化 |
| **ソース明記** | 公式ドキュメントや料金ページへの外部リンクで信頼性を担保 |

---

## 6. コンテンツ品質ルール

### 記事品質ルール
1. **結論ファースト**: 冒頭3行で答えを出す
2. **定義文を含む**: 「〇〇とは、△△である」を各セクション冒頭に
3. **H2は5つ以内**: 深くなりすぎない（H3で補足）
4. **表を1つ以上含む**: 比較・一覧はAIが構造認識しやすい
5. **FAQ 3-5個**: 記事末尾に必ず配置
6. **コード例は実行可能なもの**: コピペで動く状態にする
7. **内部リンク3本以上**: 同カテゴリ2本 + 別カテゴリ1本
8. **Layer間導線**: Layer 2記事は冒頭にLayer 1リンク、Layer 1記事は末尾にLayer 2 CTA

### AI引用されやすい記事パターン

| パターン | 例 | frontmatter設定 | AIが引用する理由 |
|----------|-----|-----------------|------------------|
| 定義型 | 「GASとは？」 | schema: Article | 明確な答えがある |
| 比較型 | 「Zapier vs Make」 | schema: ItemList | 表形式で整理されている |
| 手順型 | 「〇〇の作り方」 | schema: HowTo | ステップが構造化されている |
| 一覧型 | 「自動化ツール10選」 | schema: ItemList | リスト形式で網羅的 |
| FW型 | 「自動化判断マトリクス」 | schema: Article + FAQ | 独自の体系化 |

---

## 7. コンテンツ更新ポリシー

### リライト判断基準

| トリガー | 条件 | アクション |
|----------|------|------------|
| **順位下落** | 掲載順位が10位以上下落し2週間戻らない | 内容の加筆・最新情報への更新 |
| **CTR低下** | 表示回数はあるのにCTRが2%未満 | title / descriptionの改善 |
| **情報の陳腐化** | API仕様変更、ツールのUI変更、料金改定 | 該当箇所を修正し`updatedAt`を更新 |
| **定期見直し** | 公開から6ヶ月経過 | 内容の正確性を確認 |

### 年版記事の扱い
- タイトルに年号を入れる記事は**比較系・一覧系のみ**に限定
- URLには年号を**含めない**（SEO評価リセット回避）
- `updatedAt`のfrontmatter更新で対応
