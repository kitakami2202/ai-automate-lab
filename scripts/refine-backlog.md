# リファインパイプライン バックログ

> このファイルは未リファイン記事の管理用。
> 指示: 「バックログのリファインを実行して」で対応開始。

## ~~未リファイン記事（17本） — 全完了 2026-02-13~~

~~status=published のまま TR1→TR2→T4→T5/T6 未通過の記事。~~

### ~~S優先度（12本）— リファインパイプライン完了 2026-02-13~~

| slug | category | 備考 |
|------|----------|------|
| ~~gas-basics~~ | gas | ✅ TR1:92点SKIP v2.0 |
| ~~gas-spreadsheet-automation~~ | gas | ✅ TR1:88点SKIP v2.0 |
| ~~gas-line-bot~~ | gas | ✅ TR1:88点SKIP v2.0 |
| ~~gas-slack-notification~~ | gas | ✅ TR1:88点SKIP v2.0 |
| ~~gas-pdf-generation~~ | gas | ✅ TR1:86点SKIP v1.0 |
| ~~discord-bot-gas~~ | discord-bot | ✅ TR1:93点SKIP relatedArticles修正 v2.0 |
| ~~discord-bot-overview~~ | discord-bot | ✅ TR1:88点SKIP v1.0 |
| ~~ai-introduction-5steps~~ | frameworks | ✅ TR1:88点SKIP v2.0 |
| ~~automation-roadmap~~ | frameworks | ✅ TR1:92点SKIP v2.0 |
| ~~automation-roi-template~~ | frameworks | ✅ TR1:88点SKIP v2.0 |
| ~~where-to-automate-first~~ | frameworks | ✅ TR1:88点SKIP v2.0 |
| ~~prompt-engineering-business~~ | frameworks | ✅ TR1:88点SKIP v1.0 |

### ~~S優先度 — ai-api/reviews系（5本）— リファインパイプライン完了 2026-02-13~~

| slug | category | 備考 |
|------|----------|------|
| ~~ai-api-overview~~ | ai-api | ✅ TR1:88点SKIP v1.0 |
| ~~ai-coding-non-engineer~~ | ai-api | ✅ TR1:88点SKIP v1.0 |
| ~~mcp-intro~~ | ai-api | ✅ TR1:88点SKIP v1.0 |
| ~~no-code-overview~~ | no-code | ✅ TR1:88点SKIP v1.0 |
| ~~ai-coding-tools-comparison~~ | reviews | ✅ TR1:88点SKIP v1.0 |

### ~~A優先度（4本）— リファインパイプライン完了 2026-02-13~~

| slug | category | 備考 |
|------|----------|------|
| ~~gemini-api-intro~~ | ai-api | ✅ TR1:89点SKIP→任意改善適用 v1.1 |
| ~~gas-claude-api~~ | gas | ✅ TR1:85点REFINE→TR2完了 v1.1 |
| ~~ai-dev-tools-comparison~~ | reviews | ✅ TR1:78点REFINE→TR2完了 v1.1 |
| ~~automation-tools-matrix~~ | reviews | ✅ TR1:80点REFINE→TR2完了 v1.1 |

## 実行手順

```bash
# 1記事ずつ手動実行する場合
./scripts/pipeline.sh refine <category> <slug>

# Claude Codeに一括依頼する場合
# 「バックログのリファインを実行して」と指示
# → このファイルを参照して TR1→TR2→T4→T5/T6 を全記事に実行
# → 完了後 keyword-map.csv の status を reviewed に更新
# → build-registry.cjs を実行して CSV 再生成
# → git push
```

## 完了記録

- 2026-02-13: A優先度4本（gemini-api-intro, gas-claude-api, ai-dev-tools-comparison, automation-tools-matrix）リファイン完了
- 2026-02-13: S優先度17本 TR1監査完了 — 全記事85点以上でSKIP。discord-bot-gasのrelatedArticles修正のみ適用
