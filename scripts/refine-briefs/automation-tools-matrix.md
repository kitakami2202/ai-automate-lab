# リファインメントブリーフ: automation-tools-matrix

## 基本情報
- 対象ファイル: src/content/articles/reviews/automation-tools-matrix.md
- 監査日: 2026-02-13
- 総合スコア: 80/100
- 判定: REFINE

## スコアサマリ
| カテゴリ | スコア | 主な減点理由 |
|---------|--------|-------------|
| コンテンツ品質 | 17/20 | H2-5まとめの定義文が不完全。冒頭まとめ表がH3で始まりH2直下でない |
| SEO/AEO品質 | 16/20 | 副KW「RPA 比較」がH2-1に集中し他セクションで弱い |
| 内部リンク・導線 | 13/20 | relatedArticlesが同カテ1+別カテ2でルール違反。末尾フローチャート内のテキストにリンクなし |
| 可読性・文体 | 17/20 | OSS(n8n紹介時)の初出時説明が不足 |
| 鮮度・正確性 | 17/20 | CLAUDE.md準拠でrelatedArticlesルール違反、フローチャート内リンク不足 |

## セクション別判定
| セクション | 判定 | 理由 |
|-----------|------|------|
| frontmatter | IMPROVE | relatedArticlesが同カテ1+別カテ2 |
| 導入部 | IMPROVE | H3のまとめ表 → Layer 1記事は「冒頭にまとめ表」ルール。H3ではなくH2直下に配置が望ましい |
| H2-1: 5カテゴリの違い | KEEP | 定義文あり。RPA/iPaaS/ノーコード/ローコード/コーディングの解説が丁寧 |
| H2-2: 業務タイプ別おすすめ | KEEP | 定義文あり。7業務タイプの表が実用的 |
| H2-3: スキルレベル別ロードマップ | KEEP | 定義文あり。3層のロードマップが明確 |
| H2-4: 組み合わせパターン3選 | KEEP | 定義文あり。コスト・難易度・実行例の3軸が充実 |
| H2-5: まとめ | IMPROVE | 定義文の形式が不完全。末尾フローチャートのテキストにリンクなし |

## 改善指示一覧（優先度順）

### 指示1: relatedArticlesを「同カテ2+別カテ1」に修正
- 対象: frontmatter relatedArticles
- 現状: reviews/ai-dev-tools-comparison(同), no-code/zapier-vs-make(別), frameworks/where-to-automate-first(別)
- 方向性: no-code/zapier-vs-makeをreviews/ai-coding-tools-comparison(同カテ)に差し替え

### 指示2: H2-5まとめの定義文を補完
- 対象: H2-5「まとめ：ツール選定の3ステップ」
- 方向性: 冒頭を「〇〇とは、△△です。」形式に修正

### 指示3: 末尾フローチャート内にリンクを追加
- 対象: H2-5内のテキストツリー
- 方向性: 記事名にリンクを付与（GASでできること完全ガイド → [GASでできること完全ガイド](/articles/gas/gas-basics)等）

### 指示4: 冒頭まとめ表のH3見出しを削除しH2直下に配置
- 対象: 導入部「### スキルレベル別 自動化ツール選定マトリクス」
- 方向性: H3見出しを削除し、表の前に1文の導入文を配置

### 指示5: OSS初出時に説明を追加
- 対象: H2-1のn8n紹介時「iPaaS(OSS)」
- 方向性: 「OSS（オープンソースソフトウェア、無料で公開されたソフトウェア）」

## 保持すべき良い点
- H2-1〜H2-4の全てに「〇〇とは、△△です。」定義文あり
- 業務タイプ別早見表の7業務+詳細記事リンク
- 3つの組み合わせパターンにコスト・難易度・実行例を付与
- スキルレベル別テキストフローチャート
- 全料金に「2026年2月時点」表記
- 筆者の実務経験に基づく選定根拠

## frontmatter修正指示
- updatedAt: 2026-02-13
- relatedArticles: reviews/ai-dev-tools-comparison, reviews/ai-coding-tools-comparison, frameworks/where-to-automate-first
