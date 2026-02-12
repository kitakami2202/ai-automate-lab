# コンテンツ拡張予定リスト

> 優先度順に整理した記事拡張計画。3チェック（中小企業の業務？ / 実務一次情報？ / 具体的アクション？）を満たすもののみ掲載。

---

## 凡例

| 記号 | 意味 |
|------|------|
| 📌 既存計画 | topic-clusters.md で計画済み・未執筆 |
| 🆕 新規 | 今回新たに追加した企画 |
| ✅ 済 | 執筆・公開済み |

### ステータス管理

各記事の `status` を以下で管理する：

| status | 意味 |
|--------|------|
| `planned` | 企画確定・未着手 |
| `writing` | 執筆中 |
| `review` | レビュー・校閲中 |
| `published` | 公開済み |

---

## Tier S — 最優先（実務経験あり × 検索需要高）

既存クラスターの穴埋め + サイトの差別化になる記事。

| # | slug | タイトル案 | cluster | Layer | Type | 状態 | 備考 |
|---|------|-----------|---------|-------|------|------|------|
| S1 | claude-code-automation | Claude Codeで業務自動化スクリプトを爆速で作る方法 | ai-api | execution | howto | 🆕 planned | サイト構築の実体験が一次情報。全GAS/Discord記事からリンク可 |
| S2 | ai-coding-tools-comparison | AIコーディングツール比較【Claude Code vs Codex vs Copilot】 | reviews | entry | comparison | 🆕 planned | Layer 1入口。表形式でAEO向き。検索需要◎ |
| S3 | mcp-intro | MCP（Model Context Protocol）入門【AIと業務ツールをつなぐ】 | ai-api | entry | howto | 🆕 planned | 2025-2026年最大トレンド。サイトの軸と完全一致 |
| S4 | gas-pdf-generation | GAS × PDF自動生成【請求書・報告書テンプレ】 | gas | execution | howto | 🆕 planned | 中小企業の請求書業務に直結。検索需要高 |
| S5 | prompt-engineering-business | 業務自動化のためのプロンプト設計入門 | frameworks | entry | framework | 🆕 planned | 全AI系記事のハブ。サイト全体の内部リンク強化 |
| S6 | ai-coding-non-engineer | 非エンジニアがAIコーディングツールで自動化する手順 | ai-api | execution | howto | 🆕 planned | メインターゲット（事務担当）に直球 |

---

## Tier A — 優先（実務経験あり × 検索需要中）

既存クラスターの充実 + AI連携記事で差別化。

| # | slug | タイトル案 | cluster | Layer | Type | 状態 | 備考 |
|---|------|-----------|---------|-------|------|------|------|
| A1 | gas-mail-automation | GAS × メール自動化【一斉送信・自動返信】 | gas | execution | howto | 📌 planned | topic-clusters既存計画 |
| A2 | gas-form-automation | GAS × Googleフォーム連携【回答を自動処理】 | gas | execution | howto | 📌 planned | topic-clusters既存計画 |
| A3 | gas-syntax-reference | GAS基礎文法まとめ【コピペで使えるリファレンス】 | gas | execution | reference | 📌 planned | topic-clusters既存計画 |
| A4 | discord-scheduler-bot | Discord定時通知Botの作り方【GAS×Webhook】 | discord-bot | execution | howto | 📌 planned | topic-clusters既存計画 |
| A5 | discord-vs-line-bot | Discord Bot vs LINE Bot比較【中小企業はどっち？】 | discord-bot | entry | comparison | 📌 planned | topic-clusters既存計画 |
| A6 | gas-claude-api | GAS × Claude API連携【AIで入力データを自動分類】 | gas | execution | howto | 🆕 planned | ai-apiクラスターと横断リンク |
| A7 | gas-chatgpt-api | GAS × ChatGPT API連携【問い合わせ自動回答】 | gas | execution | howto | 🆕 planned | ai-apiクラスターと横断リンク |
| A8 | gas-ai-coding | Claude Codeで書くGASスクリプト【プロンプト実例集】 | gas | execution | howto | 🆕 planned | S1記事のGAS特化版 |
| A9 | discord-ai-bot | Discord × ChatGPT/Claude Bot【社内AI質問窓口】 | discord-bot | execution | howto | 🆕 planned | 社内AIアシスタント需要 |
| A10 | ai-coding-cost-reduction | AIコーディングツールで自動化開発コストを下げる方法 | frameworks | entry | framework | 🆕 planned | 外注 vs 内製 vs AI活用のROI比較 |
| A11 | api-key-management | APIキーの管理と安全な運用【漏洩防止チェック】 | ai-api | execution | howto | 📌 planned | topic-clusters既存計画 |
| A12 | ai-coding-prompt-patterns | AIにコードを書かせるプロンプトパターン集【業務自動化編】 | ai-api | execution | reference | 🆕 planned | S1/S5と三角リンク |

---

## Tier B — 次フェーズ（需要先行・使い込んでから書く）

実務で使い込んでから一次情報として書く。二次情報にならないよう注意。

| # | slug | タイトル案 | cluster | Layer | Type | 状態 | 備考 |
|---|------|-----------|---------|-------|------|------|------|
| B1 | tool-selection-guide | 自動化ツール選定ガイド【規模別おすすめ】 | frameworks | entry | framework | 📌 planned | topic-clusters既存計画 |
| B2 | automation-failure | 自動化が失敗する5つのパターンと対策 | frameworks | entry | framework | 📌 planned | topic-clusters既存計画 |
| B3 | no-code-tool-matrix | ノーコードツール選定マトリクス【用途×規模で選ぶ】 | no-code | entry | framework | 📌 planned | topic-clusters既存計画 |
| B4 | gas-calendar | GAS × Googleカレンダー連携【予定の自動登録・通知】 | gas | execution | howto | 🆕 planned | Google Workspace連携シリーズ |
| B5 | n8n-ai-workflow | n8n × AI連携【LLMノードで業務フローを自動化】 | no-code | execution | howto | 🆕 planned | n8n記事からの自然な拡張 |
| B6 | make-ai-scenarios | Make × AI連携シナリオ集【実務で使えるテンプレ5選】 | no-code | execution | howto | 🆕 planned | zapier-vs-make記事から誘導 |
| B7 | codex-intro | OpenAI Codex入門【クラウドでコード生成・実行】 | ai-api | execution | howto | 🆕 planned | R1比較記事のクラスター |
| B8 | mcp-google-workspace | MCP × Google Workspace連携【実践ガイド】 | ai-api | execution | howto | 🆕 planned | S3 MCP入門のクラスター |
| B9 | discord-attendance | Discord × 勤怠管理Bot【スプレッドシート記録】 | discord-bot | execution | howto | 🆕 planned | 中小企業の勤怠管理に直結 |
| B10 | ai-api-cost-management | AI API利用料金の管理方法【中小企業の予算管理】 | ai-api | entry | framework | 🆕 planned | コスト懸念を持つ経営者向け |
| B11 | dify-intro | Dify入門【ノーコードでAIチャットボットを作る】 | no-code | execution | howto | 🆕 planned | ノーコード×AIの交差点 |
| B12 | cursor-business | Cursor × 業務自動化開発【AIエディタ活用術】 | ai-api | execution | howto | 🆕 planned | 使い込んでから書く |

---

## Tier C — 将来構想（新規クラスター候補）

記事が5本以上溜まったタイミングでクラスター独立を検討。それまでは既存カテゴリに仮置き。

### C-1. AI × 業務プロセス特化（仮カテゴリ: `ai-business`）

「ツール軸」ではなく「業務軸」で記事を書くクラスター。

| # | slug | タイトル案 | 仮cluster | Layer | Type | 備考 |
|---|------|-----------|-----------|-------|------|------|
| C1 | ai-business-overview | AIで自動化できる業務一覧【中小企業の実例集】 | frameworks | entry | pillar | 独立時にピラーへ昇格 |
| C2 | ai-invoice | AI × 請求書処理の自動化【OCR+仕分け】 | frameworks | execution | howto | G5 PDF生成の上位互換 |
| C3 | ai-customer-support | AI × カスタマーサポート自動化【チャットBot構築】 | frameworks | execution | howto | Dify/Discord Bot記事と連携 |
| C4 | ai-meeting-minutes | AI × 議事録自動化【録音→要約→共有まで】 | frameworks | execution | howto | AI議事録ツール比較(R2)と対 |
| C5 | ai-data-report | AI × 定型レポート自動生成【スプシ→PDF】 | gas | execution | howto | GAS×AI APIの実践応用 |
| C6 | ai-email-triage | AI × メール自動振り分け・下書き生成 | gas | execution | howto | GASメール記事(A1)の発展形 |
| C7 | ai-recruitment-screening | AI × 採用書類スクリーニング自動化 | frameworks | execution | howto | 人事系業務は中小企業の需要◎ |

### C-2. AIコーディングツール専用クラスター（仮カテゴリ: `ai-coding`）

Tier S/A/Bの記事が5本以上公開された時点で独立を検討。

| # | slug | タイトル案 | 仮cluster | Layer | Type | 備考 |
|---|------|-----------|-----------|-------|------|------|
| C8 | ai-coding-overview | AIコーディングツールで業務自動化を内製する方法 | ai-api | entry | pillar | 独立時にピラーへ昇格 |
| C9 | github-copilot-business | GitHub Copilot Business活用ガイド | reviews | execution | howto | エンタープライズ寄りに注意 |
| C10 | windsurf-intro | Windsurf入門【AI IDEで業務ツールを開発】 | ai-api | execution | howto | 使い込んでから |
| C11 | ai-code-review | AIコードレビューで品質と速度を両立する方法 | ai-api | execution | howto | 開発プロセス改善 |

### C-3. reviews クラスター拡充

| # | slug | タイトル案 | cluster | Layer | Type | 備考 |
|---|------|-----------|---------|-------|------|------|
| C12 | ai-meeting-tools | AI議事録ツール比較【中小企業向け5選】 | reviews | entry | comparison | C4 howto記事と対 |
| C13 | ai-chatbot-services | AIチャットボットサービス比較【顧客対応自動化】 | reviews | entry | comparison | C3 howto記事と対 |
| C14 | ai-document-tools | AI文書作成ツール比較【契約書・報告書・メール】 | reviews | entry | comparison | 検索需要「AI 文書作成」 |
| C15 | ai-data-analysis-tools | AIデータ分析ツール比較【Excel代替を探す】 | reviews | entry | comparison | 事務担当向け |
| C16 | power-automate-intro | Power Automate入門【Microsoft 365ユーザー向け】 | no-code | execution | howto | MS環境の中小企業向け |
| C17 | rag-intro | RAG入門【社内文書をAIに検索させる仕組み】 | ai-api | execution | howto | 技術的に深い。実務経験の補強後 |

---

## カテゴリ追加ロードマップ

config.ts の `category` enum 変更は慎重に行う。

```
Phase 1（現在）: gas | discord-bot | ai-api | no-code | frameworks | reviews
  → Tier S/A の記事は既存カテゴリに収める

Phase 2（ai-api内の記事が10本超）: + ai-coding を追加検討
  → Claude Code / Codex / Cursor 系を分離

Phase 3（frameworks内の業務プロセス記事が5本超）: + ai-business を追加検討
  → 請求書 / 議事録 / サポート系を分離
```

---

## 内部リンク設計（拡張後）

```
[frameworks ロードマップ]（全体入口）
  ├─→ [S5 プロンプト設計入門] ─→ AI系記事すべて
  ├─→ [A10 AI開発コスト削減] ─→ S1, S2, S6
  ├─→ [GASクラスター]
  │     ├─→ A6 GAS×Claude API ←→ S1 Claude Code
  │     ├─→ A7 GAS×ChatGPT API
  │     └─→ A8 Claude Codeで書くGAS ←→ S1, S6
  ├─→ [Discord Botクラスター]
  │     └─→ A9 Discord AI Bot ←→ ai-apiクラスター
  ├─→ [no-codeクラスター]
  │     ├─→ B5 n8n×AI
  │     └─→ B11 Dify
  └─→ [ai-apiクラスター]
        ├─→ S1 Claude Code自動化（ハブ記事）
        ├─→ S3 MCP入門 → B8 MCP×Google Workspace
        └─→ S6 非エンジニア向け

[S2 AIコーディングツール比較]（reviews入口）
  ├─→ S1 Claude Code
  ├─→ B7 Codex
  └─→ B12 Cursor
```

---

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2026-02-11 | 初版作成。Tier S〜C計44記事を優先度順に整理 |
