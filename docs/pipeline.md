# 量産自動化パイプライン設計書

> 元設計書 §14, 22（概要部分）に対応
> 各エージェントの詳細指示書は `scripts/agents/*.md` を参照

---

## 1. SEO企業ロールマッピング

| フェーズ | SEO企業での役割 | 本システムでの担当 | ターミナル |
|----------|----------------|-------------------|-----------|
| 1. 調査 | マーケター / SEOアナリスト | research-agent | T1 |
| 2. 企画 | コンテンツディレクター | outline-agent | T2 |
| 3. 執筆 | SEOライター | writer-agent | T3 |
| 4. 編集 | 編集者 / 校閲担当 | editor-agent | T4 |
| 5. 品質チェック | QAチーム | quality-agent | T5 |
| 6. セキュリティ | 技術レビュアー | security-agent | T6 |
| 7. 分析 | アナリスト / PDCAチーム | analytics-agent | T7 |
| R1. 監査 | QA / 改善アナリスト | refine-audit-agent | TR1 |
| R2. 改善 | SEOライター（改善） | refine-writer-agent | TR2 |
| 最終承認 | 編集長 | 人間（れん） | - |

---

## 2. 全体フロー

```
Phase 1: 調査（T1: research-agent）
  入力: カテゴリ + 既存記事一覧
  出力: scripts/keyword-map.csv に候補追加（status: candidate）
    ↓ れんが確認し approved に変更

Phase 2: 企画（T2: outline-agent）
  入力: approved KW + 競合上位10記事
  出力: scripts/outlines/{slug}.md（記事ブリーフ）
    ↓

Phase 3: 執筆（T3: writer-agent）
  入力: 記事ブリーフ + テンプレート + CLAUDE.md
  出力: src/content/articles/{category}/{slug}.md
    ↓

Phase 4: 編集（T4: editor-agent）
  入力: 生成された記事 + 記事ブリーフ
  出力: 編集済み記事 + 編集レポート
    ↓

Phase 5-6: 品質保証（並列実行可能）
  T5: quality-agent → 品質レポート（PASS / CONDITIONAL / FAIL）
  T6: security-agent → セキュリティレポート（PASS / FAIL）
    ↓ 全チェック PASS

人間（れん）: 最終レビュー
  確認: 一次情報としての正確性 + 実務経験との整合性
    ↓ git push

GitHub Actions: 自動デプロイ
  ビルド → OGP生成 → Pagefind → SFTP → ConoHa WING
    ↓

Phase 7: 分析（T7: analytics-agent）※公開後・月次
  入力: Search Console/GA4 データ
  出力: 分析レポート + リライト候補
    ↓ リライト対象 → Phase 2 へ戻りサイクル
    ↓ リファイン対象 → Refine Phase 1 へ

--- リファインメントフロー（published記事の部分改善） ---

Refine Phase 1: 監査（TR1: refine-audit-agent）
  入力: published記事 + keyword-map.csv + CLAUDE.md
  出力: scripts/refine-briefs/{slug}.md（改善指示書）
  判定: SKIP(85+) / REFINE(60-84) / REBUILD(59-)
    ↓ REFINEの場合のみ続行

Refine Phase 2: 改善ライティング（TR2: refine-writer-agent）
  入力: 既存記事 + リファインメントブリーフ
  出力: 改善済み記事（上書き）
    ↓

Phase 4: 編集（T4: editor-agent）※既存を再利用
    ↓

Phase 5-6: 品質保証（T5 + T6）※既存を再利用
    ↓ 全チェック PASS

人間（れん）: 最終レビュー → git push
```

---

## 3. エージェント実行コマンド

```bash
# T1: 市場調査・KW選定
claude --prompt-file scripts/agents/research-agent.md \
  "カテゴリ: gas で新規記事のKW候補を5つ提案して"

# T2: 企画・構成案
claude --prompt-file scripts/agents/outline-agent.md \
  "keyword-map.csv の slug: gas-line-bot の構成案を作成して"

# T3: 記事生成
claude --prompt-file scripts/agents/writer-agent.md \
  "scripts/outlines/gas-line-bot.md のブリーフに基づいて記事を生成して"

# T4: 編集・校閲
claude --prompt-file scripts/agents/editor-agent.md \
  "src/content/articles/gas/gas-line-bot.md を編集・校閲して"

# T5: 品質チェック（機械チェック + AIチェック）
./scripts/check-article.sh src/content/articles/gas/gas-line-bot.md
claude --prompt-file scripts/agents/quality-agent.md \
  "src/content/articles/gas/gas-line-bot.md をチェックして"

# T6: セキュリティチェック
claude --prompt-file scripts/agents/security-agent.md \
  "src/content/articles/gas/gas-line-bot.md をチェックして"

# T7: 分析（月次）
claude --prompt-file scripts/agents/analytics-agent.md \
  "scripts/data/gsc-export.csv と scripts/data/ga4-export.csv を分析して"

# --- リファインメント ---

# TR1: 監査（リファインメントブリーフ生成）
claude --prompt-file scripts/agents/refine-audit-agent.md \
  "src/content/articles/gas/gas-line-bot.md を監査してリファインメントブリーフを生成して"

# TR2: 改善ライティング
claude --prompt-file scripts/agents/refine-writer-agent.md \
  "src/content/articles/gas/gas-line-bot.md を scripts/refine-briefs/gas-line-bot.md に基づいてリファインして"

# その後 T4（editor-agent）→ T5/T6（quality/security-agent）を再利用
```

---

## 4. 一括実行オーケストレーター（scripts/pipeline.sh）

```bash
#!/bin/bash
# 使い方:
#   新規記事:   ./scripts/pipeline.sh new gas gas-calendar
#   リファイン: ./scripts/pipeline.sh refine gas gas-calendar
#   リライト:   ./scripts/pipeline.sh rewrite gas gas-calendar
#   分析のみ:   ./scripts/pipeline.sh analyze

MODE=${1:-new}
CATEGORY=$2
SLUG=$3
FILE="src/content/articles/$CATEGORY/$SLUG.md"
OUTLINE="scripts/outlines/$SLUG.md"

echo "========================================="
echo "  パイプライン（$MODE）: $CATEGORY/$SLUG"
echo "========================================="

case $MODE in
  new)
    STATUS=$(grep "$SLUG" scripts/keyword-map.csv | cut -d',' -f8)
    [ "$STATUS" != "approved" ] && echo "❌ KWが未承認です" && exit 1

    echo "📋 Phase 2: 構成案作成..."
    echo "  claude --prompt-file scripts/agents/outline-agent.md \"$SLUG の構成案を作成して\""
    read -p "構成案作成完了後、Enterを押してください..."
    [ ! -f "$OUTLINE" ] && echo "❌ $OUTLINE が存在しません" && exit 1

    echo "✍️ Phase 3: 記事生成..."
    echo "  claude --prompt-file scripts/agents/writer-agent.md \"$OUTLINE のブリーフに基づいて記事を生成して\""
    read -p "記事生成完了後、Enterを押してください..."
    [ ! -f "$FILE" ] && echo "❌ $FILE が存在しません" && exit 1

    echo "📝 Phase 4: 編集・校閲..."
    echo "  claude --prompt-file scripts/agents/editor-agent.md \"$FILE を編集・校閲して\""
    read -p "編集完了後、Enterを押してください..."

    echo "🔍 Phase 5-6: 品質チェック + セキュリティチェック..."
    ./scripts/check-article.sh "$FILE" || exit 1
    echo "T5/T6を別ターミナルで並列実行後: git add && git commit && git push"
    ;;
  rewrite)
    [ ! -f "$FILE" ] && echo "❌ $FILE が存在しません" && exit 1
    echo "🔄 リライトモード: Phase 2（企画）から開始"
    ;;
  analyze)
    echo "📈 Phase 7: パフォーマンス分析..."
    echo "  claude --prompt-file scripts/agents/analytics-agent.md \"scripts/data/ 内のデータを分析して\""
    ;;
esac
```

---

## 5. keyword-map.csv ライフサイクル

```
candidate → approved → outlined → drafted → edited → reviewed → published
  (T1追加)  (れん承認)  (T2更新)   (T3更新)  (T4更新)  (T5-6更新)  (デプロイ後)
                                                                       │
                                                            ◄── rewrite (T7がフラグ / スコア59以下)
                                                                       │
                                  drafted → edited → reviewed ◄── refine (スコア60-84)
                                  (TR2更新)  (T4更新)  (T5-6更新)
                                     ↑
                                  refining
                                  (TR1更新)
```

### status値
- `candidate`: 候補（T1が追加）
- `approved`: 承認済み（れんが確認）
- `outlined`: 構成案作成済み（T2が更新）
- `drafted`: 記事生成済み（T3 or TR2が更新）
- `edited`: 編集済み（T4が更新）
- `reviewed`: チェック済み（T5-T6が更新）
- `published`: 公開済み
- `refining`: リファインメント監査中（TR1が更新）
- `rewrite`: リライト対象（T7がフラグ）

---

## 6. 機械チェックスクリプト（scripts/check-article.sh）

```bash
#!/bin/bash
FILE=$1
ERRORS=0; WARNINGS=0
echo "===== 品質チェック: $(basename $FILE) ====="

for field in title description category tags publishedAt updatedAt layer articleType schema faq relatedArticles; do
  if ! grep -q "^${field}:" "$FILE" && ! grep -q "^  ${field}:" "$FILE"; then
    echo "❌ MISSING: $field"; ERRORS=$((ERRORS + 1))
  fi
done

FAQ_COUNT=$(grep -c "  - question:" "$FILE")
[ "$FAQ_COUNT" -lt 3 ] && echo "❌ FAQ: ${FAQ_COUNT}個（最低3）" && ERRORS=$((ERRORS + 1))

INTERNAL_LINKS=$(grep -c "\](/articles/" "$FILE")
[ "$INTERNAL_LINKS" -lt 3 ] && echo "⚠️ 内部リンク: ${INTERNAL_LINKS}本（3以上推奨）" && WARNINGS=$((WARNINGS + 1))

H2_COUNT=$(grep -c "^## " "$FILE")
[ "$H2_COUNT" -gt 7 ] && echo "⚠️ H2: ${H2_COUNT}個（5以内推奨）" && WARNINGS=$((WARNINGS + 1))

[ "$ERRORS" -gt 0 ] && echo "❌ FAIL (E:$ERRORS W:$WARNINGS)" && exit 1
[ "$WARNINGS" -gt 0 ] && echo "⚠️ WARN (W:$WARNINGS)" && exit 0
echo "✅ PASS" && exit 0
```

---

## 7. 記事テンプレ生成スクリプト（scripts/new-article.sh）

```bash
#!/bin/bash
SLUG=$1
[ -z "$SLUG" ] && echo "使い方: ./scripts/new-article.sh <slug>" && exit 1

ROW=$(grep "^$SLUG," scripts/keyword-map.csv)
[ -z "$ROW" ] && echo "❌ keyword-map.csv に slug: $SLUG が見つかりません" && exit 1

ARTICLE_TYPE=$(echo "$ROW" | cut -d',' -f5)
TEMPLATE="scripts/templates/${ARTICLE_TYPE}.md"
[ ! -f "$TEMPLATE" ] && echo "❌ テンプレート $TEMPLATE が見つかりません" && exit 1

CATEGORY=$(echo "$ROW" | cut -d',' -f6)
OUTPUT_DIR="src/content/articles/$CATEGORY"
OUTPUT_FILE="$OUTPUT_DIR/$SLUG.md"
mkdir -p "$OUTPUT_DIR"

TODAY=$(date +%Y-%m-%d)
cp "$TEMPLATE" "$OUTPUT_FILE"
sed -i "s|category: \"\"|category: \"$CATEGORY\"|" "$OUTPUT_FILE"
sed -i "s|publishedAt: \"\"|publishedAt: \"$TODAY\"|" "$OUTPUT_FILE"
sed -i "s|updatedAt: \"\"|updatedAt: \"$TODAY\"|" "$OUTPUT_FILE"

echo "✅ 記事ファイル作成: $OUTPUT_FILE"
```

---

## 8. 運用サイクル（月次）

```
毎月1日: T7 analytics-agent 実行
  ↓ 分析レポート + リライト/リファイン候補
毎月1-3日: れんが候補を確認・判断
  ↓ スコア60-84 → pipeline.sh refine（部分改善）
  ↓ スコア59以下 → pipeline.sh rewrite（再構築）
毎月4日〜: リファイン/リライト対象を処理
月末: 新規記事の T1 research-agent 実行（翌月の企画準備）
```
