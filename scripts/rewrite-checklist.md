# リライトチェックリスト


最終更新: 2026-02-09

## 進捗サマリ

- 完了: 14 / 17
- 進行中: 0 / 17
- 未着手: 3 / 17

## 記事一覧

### GAS クラスター

| # | slug | 記事タイトル | 監査 | 構成案 | 執筆 | 編集 | 品質/セキュリティ | 状態 |
|---|------|------------|:----:|:-----:|:----:|:----:|:----------------:|------|
| 1 | gas-basics | GAS できること（ピラー） | skip | done | done | done | done | **完了** |
| 2 | gas-spreadsheet-automation | GAS スプレッドシート 自動化 | done | done | done | done | done | **完了** |
| 3 | gas-line-bot | GAS LINE Bot 作り方 | done | done | done | done | done | **完了** |
| 4 | gas-slack-notification | GAS Slack 通知 | skip | done | done | done | done | **完了** |

### Discord Bot クラスター

| # | slug | 記事タイトル | 監査 | 構成案 | 執筆 | 編集 | 品質/セキュリティ | 状態 |
|---|------|------------|:----:|:-----:|:----:|:----:|:----------------:|------|
| 5 | discord-bot-gas | Discord Bot GAS 連携 | skip | done | done | done | done | **完了** |
| 6 | discord-slash-commands | Discord スラッシュコマンド | skip | done | done | done | done | **完了** |
| 7 | discord-spreadsheet-db | Discord スプレッドシートDB | skip | done | done | done | done | **完了** |

### AI API クラスター

| # | slug | 記事タイトル | 監査 | 構成案 | 執筆 | 編集 | 品質/セキュリティ | 状態 |
|---|------|------------|:----:|:-----:|:----:|:----:|:----------------:|------|
| 8 | openai-api-intro | OpenAI API 入門 | skip | done | done | done | done | **完了** |
| 9 | claude-api-intro | Claude API 入門 | skip | done | done | done | done | **完了** |
| 10 | gemini-api-intro | Gemini API 入門 | skip | done | done | done | done | **完了** |

### No-Code クラスター

| # | slug | 記事タイトル | 監査 | 構成案 | 執筆 | 編集 | 品質/セキュリティ | 状態 |
|---|------|------------|:----:|:-----:|:----:|:----:|:----------------:|------|
| 11 | zapier-vs-make | Zapier vs Make 比較 | skip | done | done | done | done | **完了** |
| 12 | n8n-self-hosting | n8n セルフホスティング | skip | done | done | done | done | **完了** |

### Frameworks クラスター

| # | slug | 記事タイトル | 監査 | 構成案 | 執筆 | 編集 | 品質/セキュリティ | 状態 |
|---|------|------------|:----:|:-----:|:----:|:----:|:----------------:|------|
| 13 | ai-introduction-5steps | AI導入 5ステップ | - | - | - | - | - | 未着手 |
| 14 | automation-roi-template | 自動化 ROI 計算 | - | - | - | - | - | 未着手 |
| 15 | where-to-automate-first | 業務自動化 何から | - | - | - | - | - | 未着手 |

### Reviews クラスター

| # | slug | 記事タイトル | 監査 | 構成案 | 執筆 | 編集 | 品質/セキュリティ | 状態 |
|---|------|------------|:----:|:-----:|:----:|:----:|:----------------:|------|
| 16 | ai-dev-tools-comparison | AI開発ツール 比較 | skip | done | done | done | done | **完了** |
| 17 | automation-tools-matrix | 自動化ツール 比較表 | skip | done | done | done | done | **完了** |

## フロー（各記事ごと）

```
1. 監査: refine-audit-agent で5軸100点監査
   → SKIP(85+): リライト不要 → チェックリストに「SKIP」記入
   → REFINE(60-84): refine-writer-agent で部分改善
   → REBUILD(59-): outline-agent から再構築（rewriteフロー）

2. 構成案: outline-agent（REBUILDの場合のみ）
3. 執筆: writer-agent or refine-writer-agent
4. 編集: editor-agent
5. 品質/セキュリティ: quality-agent + security-agent
6. 最終確認 → git push
```

## 実行コマンド早見表

```bash
# 監査（まずこれを実行）
claude --append-system-prompt-file scripts/agents/refine-audit-agent.md \
  "src/content/articles/{category}/{slug}.md を監査してリファインメントブリーフを生成して"

# REBUILD → rewriteフロー
claude --append-system-prompt-file scripts/agents/outline-agent.md "{slug} のリライト構成案を作成して"
claude --append-system-prompt-file scripts/agents/writer-agent.md "scripts/outlines/{slug}.md のブリーフに基づいて記事を生成して"

# REFINE → refineフロー
claude --append-system-prompt-file scripts/agents/refine-writer-agent.md \
  "src/content/articles/{category}/{slug}.md を scripts/refine-briefs/{slug}.md に基づいてリファインして"

# 共通（編集 → 品質チェック）
claude --append-system-prompt-file scripts/agents/editor-agent.md "src/content/articles/{category}/{slug}.md を編集・校閲して"
claude --append-system-prompt-file scripts/agents/quality-agent.md "src/content/articles/{category}/{slug}.md をチェックして"
claude --append-system-prompt-file scripts/agents/security-agent.md "src/content/articles/{category}/{slug}.md をチェックして"
```
