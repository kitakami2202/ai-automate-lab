#!/bin/bash
# 記事品質チェックスクリプト
# 新スキーマに対応した frontmatter・構造チェック
# Usage: ./scripts/check-article.sh <file> or ./scripts/check-article.sh (全記事)

FILE=$1
ERRORS=0; WARNINGS=0

check_file() {
  local file=$1
  echo "===== 品質チェック: $(basename $file) ====="

  # 必須フィールドチェック
  for field in title description category tags publishedAt updatedAt layer articleType schema faq relatedArticles; do
    if ! grep -q "^${field}:" "$file" && ! grep -q "^  ${field}:" "$file"; then
      echo "❌ MISSING: $field"; ERRORS=$((ERRORS + 1))
    fi
  done

  # FAQ数チェック
  FAQ_COUNT=$(grep -c "  - question:" "$file")
  [ "$FAQ_COUNT" -lt 3 ] && echo "❌ FAQ: ${FAQ_COUNT}個（最低3）" && ERRORS=$((ERRORS + 1))

  # 内部リンクチェック
  INTERNAL_LINKS=$(grep -c "\](/articles/" "$file")
  [ "$INTERNAL_LINKS" -lt 3 ] && echo "⚠️ 内部リンク: ${INTERNAL_LINKS}本（3以上推奨）" && WARNINGS=$((WARNINGS + 1))

  # H2数チェック
  H2_COUNT=$(grep -c "^## " "$file")
  [ "$H2_COUNT" -gt 7 ] && echo "⚠️ H2: ${H2_COUNT}個（5以内推奨）" && WARNINGS=$((WARNINGS + 1))

  # description長さチェック
  DESC=$(grep "^description:" "$file" | sed 's/^description: *//' | tr -d '"')
  DESC_LEN=${#DESC}
  [ "$DESC_LEN" -gt 160 ] && echo "⚠️ description: ${DESC_LEN}文字（160以内推奨）" && WARNINGS=$((WARNINGS + 1))
  [ "$DESC_LEN" -lt 120 ] && echo "⚠️ description: ${DESC_LEN}文字（120以上推奨）" && WARNINGS=$((WARNINGS + 1))

  # relatedArticles数チェック
  RELATED_COUNT=$(grep -c "  - \"" "$file" 2>/dev/null || echo 0)

  # draft状態チェック
  grep -q "^draft: true" "$file" && echo "ℹ️ draft: true（下書き状態）"

  echo ""
}

if [ -n "$FILE" ]; then
  [ ! -f "$FILE" ] && echo "❌ ファイルが見つかりません: $FILE" && exit 1
  check_file "$FILE"
else
  echo "=== 全記事チェック ==="
  echo ""
  for file in src/content/articles/**/*.md; do
    [ -f "$file" ] && check_file "$file"
  done
fi

echo "===== 結果 ====="
[ "$ERRORS" -gt 0 ] && echo "❌ FAIL (E:$ERRORS W:$WARNINGS)" && exit 1
[ "$WARNINGS" -gt 0 ] && echo "⚠️ WARN (W:$WARNINGS)" && exit 0
echo "✅ PASS" && exit 0
