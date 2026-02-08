#!/bin/bash
# AI Automate Lab 量産パイプライン オーケストレーター
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
REFINE_BRIEF="scripts/refine-briefs/$SLUG.md"

echo "========================================="
echo "  パイプライン（$MODE）: $CATEGORY/$SLUG"
echo "========================================="

case $MODE in
  new)
    STATUS=$(awk 'BEGIN{FPAT="[^,]*|\"[^\"]*\""} /'"$SLUG"'/{print $8}' scripts/keyword-map.csv)
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
    ./scripts/check-article.sh "$FILE" || exit 1
    echo ""
    echo "以下を別ターミナルで並列実行してください:"
    echo "  T5: claude --append-system-prompt-file scripts/agents/quality-agent.md \"$FILE をチェックして\""
    echo "  T6: claude --append-system-prompt-file scripts/agents/security-agent.md \"$FILE をチェックして\""
    echo ""
    echo "全チェック PASS 後: git add && git commit && git push"
    ;;
  refine)
    [ ! -f "$FILE" ] && echo "❌ $FILE が存在しません" && exit 1

    STATUS=$(awk 'BEGIN{FPAT="[^,]*|\"[^\"]*\""} /'"$SLUG"'/{print $8}' scripts/keyword-map.csv)
    [ "$STATUS" != "published" ] && echo "❌ status が published ではありません（status: $STATUS）" && exit 1

    echo "🔍 Refine Phase 1: 監査..."
    echo "  claude --append-system-prompt-file scripts/agents/refine-audit-agent.md \"$FILE を監査してリファインメントブリーフを生成して\""
    read -p "監査完了後、Enterを押してください..."
    [ ! -f "$REFINE_BRIEF" ] && echo "❌ $REFINE_BRIEF が存在しません" && exit 1

    read -p "監査結果を確認してください。REFINEの場合はEnter、SKIP/REBUILDの場合はCtrl+Cで中断..."

    echo "✍️ Refine Phase 2: リファインメントライティング..."
    echo "  claude --append-system-prompt-file scripts/agents/refine-writer-agent.md \"$FILE を $REFINE_BRIEF に基づいてリファインして\""
    read -p "リファイン完了後、Enterを押してください..."

    echo "📝 Refine Phase 3: 編集・校閲..."
    echo "  claude --append-system-prompt-file scripts/agents/editor-agent.md \"$FILE を編集・校閲して\""
    read -p "編集完了後、Enterを押してください..."

    echo "🔍 Refine Phase 4: 品質チェック + セキュリティチェック..."
    ./scripts/check-article.sh "$FILE" || exit 1
    echo ""
    echo "以下を別ターミナルで並列実行してください:"
    echo "  T5: claude --append-system-prompt-file scripts/agents/quality-agent.md \"$FILE をチェックして\""
    echo "  T6: claude --append-system-prompt-file scripts/agents/security-agent.md \"$FILE をチェックして\""
    echo ""
    echo "全チェック PASS 後: git add && git commit && git push"
    ;;
  rewrite)
    [ ! -f "$FILE" ] && echo "❌ $FILE が存在しません" && exit 1
    echo "🔄 リライトモード: Phase 2（企画）から開始"
    echo "  claude --append-system-prompt-file scripts/agents/outline-agent.md \"$SLUG のリライト構成案を作成して\""
    ;;
  analyze)
    echo "📈 Phase 7: パフォーマンス分析..."
    echo "  claude --append-system-prompt-file scripts/agents/analytics-agent.md \"scripts/data/ 内のデータを分析して\""
    ;;
  *)
    echo "使い方:"
    echo "  ./scripts/pipeline.sh new <category> <slug>"
    echo "  ./scripts/pipeline.sh refine <category> <slug>"
    echo "  ./scripts/pipeline.sh rewrite <category> <slug>"
    echo "  ./scripts/pipeline.sh analyze"
    exit 1
    ;;
esac
