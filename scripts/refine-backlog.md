# リファインパイプライン バックログ

> このファイルは未リファイン記事の管理用。
> 指示: 「バックログのリファインを実行して」で対応開始。

## 未リファイン記事（21本） — 2026-02-12時点

status=published のまま TR1→TR2→T4→T5/T6 未通過の記事。

### S優先度（12本）— リライト済み or ピラー。内容は一定品質だがリファインパイプライン未通過

| slug | category | 備考 |
|------|----------|------|
| gas-basics | gas | リライト済み v2.0 |
| gas-spreadsheet-automation | gas | リライト済み v2.0 |
| gas-line-bot | gas | リライト済み v2.0 |
| gas-slack-notification | gas | リライト済み v2.0 |
| gas-pdf-generation | gas | 新規作成 v1.0 |
| discord-bot-gas | discord-bot | リライト済み v2.0 |
| discord-bot-overview | discord-bot | ピラー v1.0 |
| ai-introduction-5steps | frameworks | リライト済み v2.0 |
| automation-roadmap | frameworks | ピラー v2.0 |
| automation-roi-template | frameworks | リライト済み v2.0 |
| where-to-automate-first | frameworks | リライト済み v2.0 |
| prompt-engineering-business | frameworks | 新規作成 v1.0 |

### S優先度 — ai-api/reviews系（5本）

| slug | category | 備考 |
|------|----------|------|
| ai-api-overview | ai-api | ピラー v1.0 |
| ai-coding-non-engineer | ai-api | 新規作成 v1.0 |
| mcp-intro | ai-api | 新規作成 v1.0 |
| no-code-overview | no-code | ピラー v1.0 |
| ai-coding-tools-comparison | reviews | 新規作成 v1.0 |

### A優先度（4本）— リファインパイプライン未通過

| slug | category | 備考 |
|------|----------|------|
| gemini-api-intro | ai-api | 初版 v1.0 |
| gas-claude-api | gas | 新規作成 v1.0 |
| ai-dev-tools-comparison | reviews | 初版 v1.0 |
| automation-tools-matrix | reviews | 初版 v1.0 |

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

（リファイン完了時にここに記録）
