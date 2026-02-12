#!/bin/bash
# AI Automate Lab 量産パイプライン オーケストレーター
# 使い方:
#   新規記事:   ./scripts/pipeline.sh new gas gas-calendar
#   リファイン: ./scripts/pipeline.sh refine gas gas-calendar
#   リライト:   ./scripts/pipeline.sh rewrite gas gas-calendar
#   分析のみ:   ./scripts/pipeline.sh analyze

set -euo pipefail

MODE=${1:-}
CATEGORY=${2:-}
SLUG=${3:-}

# --- ヘルパー関数 ---

show_usage() {
  echo "使い方:"
  echo "  ./scripts/pipeline.sh new <category> <slug>      新規記事作成"
  echo "  ./scripts/pipeline.sh refine <category> <slug>    公開済み記事の部分改善"
  echo "  ./scripts/pipeline.sh rewrite <category> <slug>   記事の全面再構築"
  echo "  ./scripts/pipeline.sh analyze                     パフォーマンス分析（月次）"
  exit 1
}

get_status() {
  awk 'BEGIN{FPAT="[^,]*|\"[^\"]*\""} /'"$SLUG"'/{print $8}' scripts/keyword-map.csv
}

require_category_slug() {
  if [ -z "$CATEGORY" ] || [ -z "$SLUG" ]; then
    echo "❌ category と slug を指定してください"
    show_usage
  fi
}

update_registry() {
  echo ""
  echo "📊 レジストリ更新..."
  node scripts/build-registry.cjs
  echo "✅ article-registry.csv / changelog.csv を再生成しました"
}

run_quality_checks() {
  local file=$1
  echo ""
  echo "🔍 品質チェック（機械チェック）..."
  ./scripts/check-article.sh "$file" || exit 1
  echo ""
  echo "以下を別ターミナルで並列実行してください:"
  echo "  T5: claude --append-system-prompt-file scripts/agents/quality-agent.md \"$file をチェックして\""
  echo "  T6: claude --append-system-prompt-file scripts/agents/security-agent.md \"$file をチェックして\""
  echo ""
  read -p "全チェック PASS 後、Enterを押してください..."
  update_registry
  echo ""
  echo "git add && git commit && git push でデプロイしてください"
}

# --- 入力バリデーション ---

[ -z "$MODE" ] && show_usage

FILE="src/content/articles/$CATEGORY/$SLUG.md"
OUTLINE="scripts/outlines/$SLUG.md"
REFINE_BRIEF="scripts/refine-briefs/$SLUG.md"

echo "========================================="
echo "  パイプライン（$MODE）: $CATEGORY/$SLUG"
echo "========================================="

case $MODE in
  new)
    require_category_slug
    STATUS=$(get_status)
    [ "$STATUS" != "approved" ] && echo "❌ KWが未承認です（status: $STATUS）" && exit 1

    echo "📋 Phase 2: 構成案作成..."
    echo "  claude --append-system-prompt-file scripts/agents/outline-agent.md \"$SLUG の構成案を作成して\""
    read -p "構成案作成完了後、Enterを押してください..."
    [ ! -f "$OUTLINE" ] && echo "❌ $OUTLINE が存在しません" && exit 1

    echo "✍️ Phase 3: 記事生成..."
    echo "  claude --append-system-prompt-file scripts/agents/writer-agent.md \"$OUTLINE のブリーフに基づいて記事を生成して\""
    read -p "記事生成完了後、Enterを押してください..."
    [ ! -f "$FILE" ] && echo "❌ $FILE が存在しません" && exit 1

    echo "📝 Phase 4: 編集・校閲..."
    echo "  claude --append-system-prompt-file scripts/agents/editor-agent.md \"$FILE を編集・校閲して\""
    read -p "編集完了後、Enterを押してください..."

    echo "🔍 Phase 5-6: 品質チェック + セキュリティチェック..."
    run_quality_checks "$FILE"
    ;;

  refine)
    require_category_slug
    [ ! -f "$FILE" ] && echo "❌ $FILE が存在しません" && exit 1

    STATUS=$(get_status)
    [ "$STATUS" != "published" ] && echo "❌ status が published ではありません（status: $STATUS）" && exit 1

    echo "🔍 Refine Phase 1: 監査..."
    echo "  claude --append-system-prompt-file scripts/agents/refine-audit-agent.md \"$FILE を監査してリファインメントブリーフを生成して\""
    read -p "監査完了後、Enterを押してください..."
    [ ! -f "$REFINE_BRIEF" ] && echo "❌ $REFINE_BRIEF が存在しません" && exit 1

    echo ""
    echo "監査結果を確認してください:"
    echo "  85-100点 → SKIP（改善不要。Ctrl+C で中断）"
    echo "  60-84点  → REFINE（Enter で続行）"
    echo "  59点以下 → REBUILD（Ctrl+C で中断し rewrite モードへ）"
    read -p "REFINE で続行する場合は Enter..."

    echo "✍️ Refine Phase 2: リファインメントライティング..."
    echo "  claude --append-system-prompt-file scripts/agents/refine-writer-agent.md \"$FILE を $REFINE_BRIEF に基づいてリファインして\""
    read -p "リファイン完了後、Enterを押してください..."

    echo "📝 Refine Phase 3: 編集・校閲..."
    echo "  claude --append-system-prompt-file scripts/agents/editor-agent.md \"$FILE を編集・校閲して\""
    read -p "編集完了後、Enterを押してください..."

    echo "🔍 Refine Phase 4: 品質チェック + セキュリティチェック..."
    run_quality_checks "$FILE"
    ;;

  rewrite)
    require_category_slug
    [ ! -f "$FILE" ] && echo "❌ $FILE が存在しません" && exit 1

    echo "🔄 リライトモード: Phase 2（企画）から全面再構築"
    echo ""
    echo "📋 Phase 2: リライト構成案作成..."
    echo "  claude --append-system-prompt-file scripts/agents/outline-agent.md \"$SLUG のリライト構成案を作成して（既存記事: $FILE）\""
    read -p "構成案作成完了後、Enterを押してください..."
    [ ! -f "$OUTLINE" ] && echo "❌ $OUTLINE が存在しません" && exit 1

    echo "✍️ Phase 3: 記事再生成..."
    echo "  claude --append-system-prompt-file scripts/agents/writer-agent.md \"$OUTLINE のブリーフに基づいて記事を生成して\""
    read -p "記事生成完了後、Enterを押してください..."
    [ ! -f "$FILE" ] && echo "❌ $FILE が存在しません" && exit 1

    echo "📝 Phase 4: 編集・校閲..."
    echo "  claude --append-system-prompt-file scripts/agents/editor-agent.md \"$FILE を編集・校閲して\""
    read -p "編集完了後、Enterを押してください..."

    echo "🔍 Phase 5-6: 品質チェック + セキュリティチェック..."
    run_quality_checks "$FILE"
    ;;

  analyze)
    echo "📈 Phase 7: パフォーマンス分析..."
    if [ ! -d "scripts/data" ]; then
      echo "⚠️ scripts/data/ ディレクトリが存在しません。GA4/GSCデータをエクスポートしてください。"
      exit 1
    fi
    echo "  claude --append-system-prompt-file scripts/agents/analytics-agent.md \"scripts/data/ 内のデータを分析して\""
    echo ""
    echo "分析後のアクション:"
    echo "  スコア 85-100 → 改善不要"
    echo "  スコア 60-84  → ./scripts/pipeline.sh refine <category> <slug>"
    echo "  スコア 59以下  → ./scripts/pipeline.sh rewrite <category> <slug>"
    ;;

  *)
    show_usage
    ;;
esac
