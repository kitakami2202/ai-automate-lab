#!/bin/bash
# SEOチェックスクリプト
# 記事のfrontmatterに必要な項目が揃っているかをチェック

echo "=== SEO Check ==="
echo ""

ERRORS=0
WARNINGS=0

for file in src/content/articles/**/*.md; do
  if [ ! -f "$file" ]; then
    continue
  fi

  filename=$(basename "$file")

  # Check title
  if ! grep -q "^title:" "$file"; then
    echo "[ERROR] $file: title is missing"
    ERRORS=$((ERRORS + 1))
  fi

  # Check description
  if ! grep -q "^description:" "$file"; then
    echo "[ERROR] $file: description is missing"
    ERRORS=$((ERRORS + 1))
  else
    desc=$(grep "^description:" "$file" | sed 's/^description: *//' | tr -d '"')
    desc_len=${#desc}
    if [ "$desc_len" -gt 160 ]; then
      echo "[WARNING] $file: description is too long (${desc_len} chars, recommended: <160)"
      WARNINGS=$((WARNINGS + 1))
    elif [ "$desc_len" -lt 50 ]; then
      echo "[WARNING] $file: description is too short (${desc_len} chars, recommended: >50)"
      WARNINGS=$((WARNINGS + 1))
    fi
  fi

  # Check category
  if ! grep -q "^category:" "$file"; then
    echo "[ERROR] $file: category is missing"
    ERRORS=$((ERRORS + 1))
  fi

  # Check publishedDate
  if ! grep -q "^publishedDate:" "$file"; then
    echo "[ERROR] $file: publishedDate is missing"
    ERRORS=$((ERRORS + 1))
  fi

  # Check tags
  if ! grep -q "^tags:" "$file"; then
    echo "[WARNING] $file: tags are missing (recommended for SEO)"
    WARNINGS=$((WARNINGS + 1))
  fi

  # Check draft status
  if grep -q "^draft: true" "$file"; then
    echo "[INFO] $file: draft mode is ON"
  fi

done

echo ""
echo "=== Results ==="
echo "Errors: $ERRORS"
echo "Warnings: $WARNINGS"

if [ "$ERRORS" -gt 0 ]; then
  echo "Please fix the errors above before publishing."
  exit 1
fi

echo "All checks passed!"
