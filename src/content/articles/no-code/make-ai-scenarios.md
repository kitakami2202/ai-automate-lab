---
title: "Make × AI連携シナリオ集｜実務で使えるテンプレ5選"
description: "Make（旧Integromat）でAI APIを活用した業務自動化シナリオ5選を紹介。問い合わせ分類・レビュー分析・議事録要約・メール下書き・SNS投稿生成を、シナリオ構成図とモジュール設定付きで解説します。ノーコードでAI業務自動化を実現できます。"
category: "no-code"
tags: ["Make", "AI連携", "シナリオ", "ノーコード", "ChatGPT"]
publishedAt: 2026-02-12
updatedAt: 2026-02-12
author: "れん"
difficulty: "beginner"
timeToRead: 12
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "月$9〜 + AI API従量課金"
  totalTime: "PT30M"
faq:
  - question: "MakeでAI APIを無料で試せますか？"
    answer: "Makeの無料プラン（月1,000オペレーション）でAI連携シナリオを試せます。AI API側も新規登録で無料クレジットが付与されるため（OpenAI: 5ドル、Anthropic: 5ドル）、初期費用0円で検証できます（2026年2月時点）。"
  - question: "MakeとZapierのAI機能の違いは？"
    answer: "Makeはシナリオ内でHTTPモジュールを使って任意のAI APIを呼び出せるため自由度が高いです。ZapierはAI by Zapier機能で簡単にAIを使えますが、カスタマイズの幅はMakeが上回ります。"
  - question: "シナリオのテンプレートはそのまま使えますか？"
    answer: "本記事のシナリオ構成をそのまま再現できます。APIキーの設定とプロンプトの自社業務への調整だけで動作します。Makeのテンプレートギャラリーにも類似のシナリオがあるので併用してください。"
relatedArticles:
  - "no-code/zapier-vs-make"
  - "no-code/no-code-overview"
  - "ai-api/openai-api-intro"
draft: false
---

> この記事は[ノーコード自動化ツール比較](/articles/no-code/no-code-overview)の実装編です。
> MakeとZapierの違いは[Zapier vs Make比較](/articles/no-code/zapier-vs-make)をご覧ください。

この記事では、Make（旧Integromat）にAI APIを組み込んだ実務向けシナリオ5選を紹介します。
ノーコードのGUI操作だけで、AIを活用した業務自動化を構築できます。

### この記事の前提

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Make、OpenAI or Anthropic |
| 必要な知識 | Makeの基本操作（モジュールの接続） |
| 所要時間 | 1シナリオあたり約15〜30分 |
| 費用 | Make: 無料〜月$9 / AI API: 従量課金 |
| 完成物 | AI組み込みの業務自動化シナリオ |

## MakeでAI APIを呼び出す基本

MakeでAI APIを呼び出すとは、HTTPモジュールまたはOpenAI公式モジュールを使ってAIにテキスト処理をリクエストする操作のことです。

### 接続方法

| 方法 | 対応API | 設定難易度 |
|------|--------|----------|
| OpenAI公式モジュール | OpenAI（ChatGPT） | 簡単（APIキーのみ） |
| HTTPモジュール | Claude、Gemini、任意のAPI | やや手間（ヘッダー設定が必要） |

### OpenAI公式モジュールの設定

1. シナリオに「OpenAI - Create a Completion」モジュールを追加します
2. ConnectionでOpenAI APIキーを登録します
3. モデル・プロンプト・max_tokensを設定します

## シナリオ1: 問い合わせ自動分類

```text
[Googleフォーム] → [OpenAI（分類）] → [Router] → [Gmail（通知）]
```

| モジュール | 設定内容 |
|----------|---------|
| Google Forms - Watch Responses | フォームIDを指定 |
| OpenAI - Create a Chat Completion | Model: gpt-4o-mini / System: 分類プロンプト |
| Router | AIの分類結果で通知先を振り分け |
| Gmail - Send an Email | カテゴリ別の担当者に通知 |

**分類プロンプト例:**

```text
問い合わせを「見積依頼」「製品問い合わせ」「クレーム」「その他」に分類し、
JSON形式 {"category":"カテゴリ","summary":"要約"} で返してください。
```

## シナリオ2: 顧客レビュー感情分析

```text
[Google Sheets（新規行）] → [OpenAI（感情分析）] → [Google Sheets（結果書き込み）]
```

| モジュール | 設定内容 |
|----------|---------|
| Google Sheets - Watch Rows | レビューデータシートを監視 |
| OpenAI - Create a Chat Completion | レビューの感情をポジティブ/ネガティブ/中立に分類 |
| Google Sheets - Update a Row | 分析結果を同じ行に書き込み |

## シナリオ3: 議事録の自動要約

```text
[Google Drive（新規ファイル）] → [Google Docs（読み取り）] → [OpenAI（要約）] → [Slack（通知）]
```

| モジュール | 設定内容 |
|----------|---------|
| Google Drive - Watch Files | 議事録フォルダを監視 |
| Google Docs - Get Content | ドキュメントの本文を取得 |
| OpenAI - Create a Chat Completion | 300文字以内で要約 + 決定事項を箇条書き |
| Slack - Create a Message | 要約結果をチャンネルに投稿 |

## シナリオ4: メール返信ドラフト自動生成

```text
[Gmail（新着メール）] → [Filter] → [OpenAI（返信生成）] → [Gmail（下書き保存）]
```

| モジュール | 設定内容 |
|----------|---------|
| Gmail - Watch Emails | 特定ラベルのメールを監視 |
| Filter | 件名に「問い合わせ」を含むメールのみ通過 |
| OpenAI - Create a Chat Completion | メール本文から返信ドラフトを生成 |
| Gmail - Create a Draft | 下書きとして保存（送信は手動確認） |

**ポイント:** 自動送信ではなく下書き保存にすることで、担当者が内容を確認してから送信できます。

## シナリオ5: SNS投稿文の自動生成

```text
[Schedule] → [Google Sheets（ネタ取得）] → [OpenAI（投稿文生成）] → [Google Sheets（結果記録）]
```

| モジュール | 設定内容 |
|----------|---------|
| Schedule | 毎週月曜に実行 |
| Google Sheets - Search Rows | 未生成のネタ行を取得 |
| OpenAI - Create a Chat Completion | ネタから140文字のSNS投稿文を3パターン生成 |
| Google Sheets - Update a Row | 生成結果を記録 |

## 動作確認・トラブルシューティング

| エラー | 原因 | 解決策 |
|--------|------|--------|
| OpenAIモジュールで401エラー | APIキーの設定ミス | ConnectionのAPIキーを再設定 |
| レスポンスが空 | max_tokensが小さすぎる | 512以上に設定 |
| 日本語が文字化け | エンコーディング設定 | HTTPモジュールのParse responseをJSON指定 |
| オペレーション上限超過 | 無料枠の消費 | シナリオの実行頻度を調整 or 有料プランに移行 |

## 応用・カスタマイズ例

- **複数AIの使い分け** — 分類はGPT-4o mini（安価）、要約はClaude Sonnet（高精度）とHTTPモジュールで切り替え
- **n8nとの併用** — 大量処理はコスト優位な[n8n × AI連携](/articles/no-code/n8n-ai-workflow)、簡易な連携はMakeと使い分け
- **GAS連携** — MakeのWebhookでGASスクリプトを呼び出し、Googleサービスの細かい操作をGASに任せる

ノーコードツールの全体像は[ノーコード自動化ツール比較](/articles/no-code/no-code-overview)、AI APIの基礎は[OpenAI API入門](/articles/ai-api/openai-api-intro)をご覧ください。
