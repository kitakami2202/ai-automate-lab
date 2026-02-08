#!/bin/bash
# 新しい記事テンプレートを生成するスクリプト
# keyword-map.csv から情報を取得して適切なテンプレートを適用
# Usage: ./scripts/new-article.sh <slug>

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

if [ -f "$OUTPUT_FILE" ]; then
  echo "❌ ファイルが既に存在します: $OUTPUT_FILE"
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

TODAY=$(date +%Y-%m-%d)
cp "$TEMPLATE" "$OUTPUT_FILE"
sed -i "s|category: \"\"|category: \"$CATEGORY\"|" "$OUTPUT_FILE"
sed -i "s|publishedAt: \"\"|publishedAt: \"$TODAY\"|" "$OUTPUT_FILE"
sed -i "s|updatedAt: \"\"|updatedAt: \"$TODAY\"|" "$OUTPUT_FILE"

echo "✅ 記事ファイル作成: $OUTPUT_FILE"
echo "   テンプレート: $ARTICLE_TYPE"
echo "   カテゴリ: $CATEGORY"
echo "   draft: false で公開準備完了"
