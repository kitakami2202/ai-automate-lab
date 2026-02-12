# リファインメントブリーフ: ai-dev-tools-comparison

## 基本情報
- 対象ファイル: src/content/articles/reviews/ai-dev-tools-comparison.md
- 監査日: 2026-02-13
- 総合スコア: 78/100
- 判定: REFINE

## スコアサマリ
| カテゴリ | スコア | 主な減点理由 |
|---------|--------|-------------|
| コンテンツ品質 | 16/20 | H2-2〜H2-5に「〇〇とは、△△です。」形式の定義文なし |
| SEO/AEO品質 | 16/20 | 副KW「GitHub Copilot 比較」の自然な配置がやや弱い |
| 内部リンク・導線 | 15/20 | relatedArticlesが同カテ1+別カテ2でルール違反 |
| 可読性・文体 | 16/20 | IP補償、プレミアムリクエスト等の専門用語が初出時未定義 |
| 鮮度・正確性 | 15/20 | CLAUDE.md準拠で定義文・relatedArticlesルール違反 |

## セクション別判定
| セクション | 判定 | 理由 |
|-----------|------|------|
| frontmatter | IMPROVE | relatedArticlesが同カテ1+別カテ2。ogImage空文字列 |
| 導入部 | KEEP | 結論ファーストで3行要約。まとめ表あり |
| H2-1: AI開発ツールとは | KEEP | 「AI開発ツールとは、」形式の定義文あり。3タイプの比較表 |
| H2-2: 主要5ツール料金・機能 | IMPROVE | 定義文なし。各ツール紹介は充実しているが冒頭の定義がない |
| H2-3: 業務自動化の用途別 | IMPROVE | 定義文なし。筆者の実務経験に基づく記述（KEEP対象）あり |
| H2-4: コスト試算 | IMPROVE | 定義文なし |
| H2-5: まとめ | IMPROVE | 定義文なし |

## 改善指示一覧（優先度順）

### 指示1: relatedArticlesを「同カテ2+別カテ1」に修正
- 対象: frontmatter relatedArticles
- 現状: reviews/automation-tools-matrix(同), ai-api/claude-api-intro(別), ai-api/openai-api-intro(別)
- 方向性: ai-api/openai-api-introをreviews/ai-coding-tools-comparison(同カテ)に差し替え

### 指示2: H2-2〜H2-5に定義文を追加
- 対象: 4つのH2セクション
- 何を: 各H2冒頭に「〇〇とは、△△です。」形式の1文を追加
- なぜ: CLAUDE.mdルール準拠

### 指示3: 専門用語の初出時説明を追加
- 対象: IP補償、プレミアムリクエスト
- 方向性: かっこ書きで補足

### 指示4: ogImage空文字列の削除
- 対象: frontmatter ogImage: ""
- 方向性: ogImageフィールド自体を削除（optional）

## 保持すべき良い点
- 冒頭のまとめ比較表（5ツール横断）
- 筆者の実務経験に基づく「併用パターン」の記述
- フローチャート形式のまとめ
- 各ツールの公式料金ページへのリンク
- Layer 2記事（claude-api-intro、openai-api-intro）へのCTA

## frontmatter修正指示
- updatedAt: 2026-02-13
- relatedArticles: reviews/automation-tools-matrix, reviews/ai-coding-tools-comparison, ai-api/claude-api-intro
- ogImage: フィールド削除
