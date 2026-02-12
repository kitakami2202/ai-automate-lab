---
title: "n8n × AI連携｜LLMノードで業務フローを自動化"
description: "n8nのAI機能（LLMノード・AI Agentノード）を使って業務フローにAIを組み込む方法を解説。問い合わせ自動分類・ドキュメント要約・チャットBot構築の3パターンを、ノード設定のスクリーンショット付きで紹介します。"
category: "no-code"
tags: ["n8n", "AI連携", "LLM", "ノーコード", "ワークフロー"]
publishedAt: 2026-02-12
updatedAt: 2026-02-12
author: "れん"
difficulty: "beginner"
timeToRead: 12
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "月約500円〜"
  totalTime: "PT45M"
faq:
  - question: "n8nのAIノードは無料で使えますか？"
    answer: "n8nのAIノード自体は無料で利用できます。ただし、接続するAI API（OpenAI、Anthropic等）は別途従量課金が発生します。n8nをセルフホストすればn8n側の費用は月約500〜1,500円（VPS代）のみです（2026年2月時点）。"
  - question: "ChatGPTとClaudeどちらを使えますか？"
    answer: "どちらも使えます。n8nのLLMノードはOpenAI、Anthropic（Claude）、Google（Gemini）など主要なAIプロバイダーに対応しています。APIキーを設定するだけで切り替えられます。"
  - question: "プログラミングなしでAI連携できますか？"
    answer: "はい、n8nのノードをGUI上で接続するだけでAI連携ワークフローを構築できます。プロンプトの設定やデータの受け渡しもすべてノードの設定画面から行えます。"
relatedArticles:
  - "no-code/n8n-self-hosting"
  - "no-code/no-code-overview"
  - "ai-api/claude-api-intro"
draft: false
---

> この記事は[ノーコード自動化ツール比較](/articles/no-code/no-code-overview)の実装編です。
> n8nの構築方法は[n8nセルフホスティングガイド](/articles/no-code/n8n-self-hosting)を先にご覧ください。

この記事では、n8nのAI機能を使って業務フローにAIを組み込む方法を、3つの実践パターンで解説します。
プログラミング不要で、ノードの接続とプロンプト設定だけでAI連携ワークフローを構築できます。

### この記事の前提

| 項目 | 内容 |
|------|------|
| 必要な環境 | n8n（クラウド版 or セルフホスト） |
| 必要なAPIキー | OpenAI or Anthropic（AI利用時） |
| 所要時間 | 約45分 |
| 費用 | n8n: 月約500円〜 / AI API: 従量課金 |
| 完成物 | AI組み込みワークフロー（分類・要約・チャット） |

## n8nのAI機能の全体像

n8nのAI機能とは、ワークフロー内でLLM（大規模言語モデル）を呼び出し、テキストの分類・要約・生成などのAI処理を組み込む機能のことです。

| ノード | 機能 | 用途 |
|--------|------|------|
| AI Agent | 自律的にツールを使って回答を生成 | チャットBot、質問応答 |
| Basic LLM Chain | シンプルなプロンプト→回答の処理 | テキスト分類、要約 |
| Summarization Chain | 長文を自動要約 | ドキュメント要約 |

## パターン1: 問い合わせ自動分類

### ワークフロー構成

```text
[Webhook（受信）] → [Basic LLM Chain（分類）] → [Switch（振り分け）] → [Slack（通知）]
```

### 設定手順

1. **Webhookノード** — HTTPリクエストで問い合わせデータを受信します
2. **Basic LLM Chainノード** — 以下のプロンプトを設定します

```text
以下の問い合わせを分類してください。
カテゴリは「見積依頼」「製品問い合わせ」「クレーム」「その他」のいずれかです。
JSON形式で {"category": "カテゴリ名", "summary": "30文字以内の要約"} を返してください。

問い合わせ内容:
{{ $json.inquiry }}
```

3. **Switchノード** — `category` の値で通知先を振り分けます
4. **Slackノード** — カテゴリごとに異なるチャンネルに通知します

### AI Credentials の設定

n8nの「Credentials」メニューからAIプロバイダーの認証情報を登録します。

| プロバイダー | Credential Type | 必要な値 |
|------------|----------------|---------|
| OpenAI | OpenAI API | APIキー |
| Anthropic | Anthropic API | APIキー |
| Google | Google AI (Gemini) | APIキー |

## パターン2: ドキュメント自動要約

### ワークフロー構成

```text
[Schedule Trigger] → [Google Drive（ファイル取得）] → [Summarization Chain] → [Google Sheets（記録）]
```

### 設定手順

1. **Schedule Trigger** — 毎日指定時刻にワークフローを開始します
2. **Google Driveノード** — 指定フォルダ内の新規ドキュメントを取得します
3. **Summarization Chainノード** — ドキュメント内容を要約します

```text
以下のドキュメントを日本語で300文字以内に要約してください。
箇条書きで重要ポイントを3つ抽出してください。
```

4. **Google Sheetsノード** — ファイル名・要約・処理日時をスプレッドシートに記録します

## パターン3: 社内チャットBot

### ワークフロー構成

```text
[Chat Trigger] → [AI Agent] → [Chat Response]
```

### 設定手順

1. **Chat Triggerノード** — n8nのチャットウィジェットからメッセージを受信します
2. **AI Agentノード** — 以下のシステムプロンプトを設定します

```text
あなたは社内サポートAIです。
社員からの質問に簡潔に回答してください。
回答は200文字以内で、敬語を使ってください。
わからない質問は「担当者に確認します」と回答してください。
```

3. **AI Agentにツールを追加**（オプション） — Google SheetsやHTTPリクエストノードをツールとして接続すると、AIがFAQデータを参照して回答を生成できます

## 動作確認・トラブルシューティング

| エラー | 原因 | 解決策 |
|--------|------|--------|
| LLMノードでエラー | APIキーの未設定 | Credentialsを確認し、APIキーを再設定 |
| 応答が遅い | モデルの選択 | GPT-4oからGPT-4o miniに変更してコストと速度を改善 |
| 日本語が文字化け | エンコーディング | HTTP Requestノードのレスポンスエンコーディングを確認 |
| ワークフローが停止 | n8nのメモリ不足 | セルフホスト環境のRAMを増設（2GB以上推奨） |

## 応用・カスタマイズ例

- **メール→AI分類→担当者通知** — IMAPノードでメールを受信し、AIで分類してSlackの適切なチャンネルに通知
- **フォーム→AI回答→自動返信** — Webhookでフォーム回答を受信し、AIが回答を生成してGmailで自動返信
- **定期レポート** — Schedule Triggerで毎週月曜にデータを集計し、AIで分析コメントを生成

n8nの構築方法は[n8nセルフホスティングガイド](/articles/no-code/n8n-self-hosting)、AI APIの基礎は[Claude API入門](/articles/ai-api/claude-api-intro)をご覧ください。
