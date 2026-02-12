---
title: "n8n × AI連携｜LLMノードで業務フローを自動化"
description: "n8nのAI機能（LLMノード・AI Agentノード）を使って業務フローにAIを組み込む方法を解説。問い合わせ自動分類・ドキュメント要約・チャットBot構築の3パターンを、プロンプト例とノード設定付きで紹介。ノーコードで約45分で構築できます。"
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
  estimatedCost: "月約2,000円〜（VPS代）+ AI API従量課金"
  totalTime: "PT45M"
faq:
  - question: "n8nのAIノードは無料で使えますか？"
    answer: "n8nのCommunity Edition（セルフホスト版）は無料で利用できます。ただし、接続するAI API（OpenAI、Anthropic等）は別途従量課金が発生します。セルフホストのVPS代は月約2,000〜5,000円（4GB RAM推奨）が目安です（2026年2月時点）。"
  - question: "ChatGPTとClaudeどちらを使えますか？"
    answer: "どちらも使えます。n8nのLLMノードはOpenAI、Anthropic（Claude）、Google（Gemini）など主要なAIプロバイダーに対応しています。APIキーを設定するだけで切り替えられます。"
  - question: "プログラミングなしでAI連携できますか？"
    answer: "はい、n8nのノードをGUI上で接続するだけでAI連携ワークフローを構築できます。プロンプトの設定やデータの受け渡しもすべてノードの設定画面からおこなえます。"
  - question: "n8nのAIノードではどのLLMモデルが使えますか？"
    answer: "OpenAI（GPT-4o、GPT-4o mini等）、Anthropic（Claude Sonnet、Claude Haiku等）、Google（Gemini）など主要なLLMに対応しています。Credentialsに各プロバイダーのAPIキーを登録することでモデルを切り替えられます（2026年2月時点）。"
  - question: "n8nのAIワークフローの処理速度はどのくらいですか？"
    answer: "AIモデルの応答時間に依存しますが、GPT-4o miniで1リクエストあたり1〜3秒、GPT-4oで3〜10秒が目安です。バッチ処理の場合はn8nのワーカーモードの導入も検討してください。"
relatedArticles:
  - "no-code/n8n-self-hosting"
  - "no-code/no-code-overview"
  - "ai-api/claude-api-intro"
draft: false
---

> この記事は[ノーコード自動化ツール比較](/articles/no-code/no-code-overview)の実装編です。
> n8nの構築方法は[n8nセルフホスティングガイド](/articles/no-code/n8n-self-hosting)を先にご覧ください。

この記事では、n8nのAI機能を使って業務フローにAIを組み込む方法を、3つの実践パターンで解説します。
n8nのLLMノードを活用すれば、問い合わせの自動分類・ドキュメント要約・チャットBot構築といった知的作業もノーコードで自動化できます。
プログラミング不要で、ノードの接続とプロンプト設定だけで構築できます。

### この記事の前提

| 項目 | 内容 |
|------|------|
| 必要な環境 | n8n（クラウド版 or セルフホスト） |
| 必要なAPIキー | OpenAI or Anthropic（AI利用時） |
| 所要時間 | 約45分 |
| 費用 | n8n: 無料（Community Edition） / VPS代: 月約2,000〜5,000円 / AI API: 従量課金（2026年2月時点） |
| 完成物 | AI組み込みワークフロー（分類・要約・チャット） |

※費用は2026年2月時点の情報です。最新料金は[n8n公式料金ページ](https://n8n.io/pricing/)をご確認ください。
ツール選定に迷っている方は[ノーコードツール選定マトリクス](/articles/no-code/no-code-tool-matrix)もあわせて参照してください。

## n8nのAI機能の全体像

n8nのAI機能とは、ワークフロー内でLLM（大規模言語モデル）を呼び出し、テキストの分類・要約・生成などのAI処理を組み込む機能のことです。

LLMノードを使えば、業務フローの自動化にAI処理をノーコードで組み合わせられます。

| ノード | 機能 | 用途 |
|--------|------|------|
| AI Agent | 自律的にツールを使って回答を生成 | チャットBot、質問応答 |
| Basic LLM Chain | シンプルなプロンプト→回答の処理 | テキスト分類、要約 |
| Summarization Chain | 長文を自動要約 | ドキュメント要約 |

## パターン1: 問い合わせ自動分類

問い合わせ自動分類とは、AIがメールやフォームの内容をカテゴリに振り分け、適切な担当者に自動通知する仕組みです。
n8nのLLMノードとSwitch（条件に応じて処理を分岐させるノード）を組み合わせて実現します。

### ワークフロー構成

```text
[Webhook（受信）] → [Basic LLM Chain（分類）] → [Switch（振り分け）] → [Slack（通知）]
```

### 設定手順

1. **Webhook（外部サービスからHTTPリクエストでデータを受け取る仕組み）ノード** — HTTPリクエストで問い合わせデータを受信します
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

### Webhookのテスト

ワークフローを有効化したら、以下のcurlコマンドでWebhookにテストデータを送信して動作確認します。

```bash
curl -X POST https://your-n8n.example.com/webhook/inquiry \
  -H "Content-Type: application/json" \
  -d '{"inquiry": "来月納品予定の製品Aについて、50個分の見積書をお送りいただけますか？"}'
```

正常に動作すれば、AIが問い合わせ内容を「見積依頼」に分類し、Slackの該当チャンネルに通知が届きます。

### AI Credentials の設定

Credentials（n8nに登録するAPIキーなどの認証情報）メニューからAIプロバイダーの認証情報を登録します。

| プロバイダー | Credential Type | 必要な値 |
|------------|----------------|---------|
| OpenAI | OpenAI API | APIキー |
| Anthropic | Anthropic API | APIキー |
| Google | Google AI (Gemini) | APIキー |

## パターン2: ドキュメント自動要約

ドキュメント自動要約とは、AIが長文のファイルを読み取り、要点を箇条書きで抽出する処理です。
n8nのSummarization Chainノードを使えば、Google Drive上のドキュメントを定期的に要約し、スプレッドシートに記録できます。

### ワークフロー構成

```text
[Schedule Trigger] → [Google Drive（ファイル取得）] → [Summarization Chain] → [Google Sheets（記録）]
```

### 推奨モデル設定

| 設定項目 | 推奨値 | 説明 |
|---------|--------|------|
| モデル | GPT-4o mini | コストと速度のバランスが良い |
| Temperature（生成のランダム性を制御するパラメータ） | 0.3 | 要約の安定性を重視 |
| Max Tokens | 1024 | 300文字程度の要約に十分 |
| チャンクサイズ | 4000 | 長文を分割して処理する際の1ブロックの文字数 |

### 設定手順

1. **Schedule Trigger** — 毎日指定時刻にワークフローを開始します
2. **Google Driveノード** — 指定フォルダ内の新規ドキュメントを取得します
3. **Summarization Chainノード** — ドキュメント内容を要約します

```text
以下のドキュメントを日本語で300文字以内に要約してください。
箇条書きで重要ポイントを3つ抽出してください。
```

4. **Google Sheetsノード** — ファイル名・要約・処理日時をスプレッドシートに記録します

[Make（旧Integromat）でも同様のAI連携が可能です](/articles/no-code/make-ai-scenarios)。ツールの使い分けが気になる方はあわせてご確認ください。

## パターン3: 社内チャットBot

社内チャットBotとは、AIが社員からの質問にリアルタイムで回答するチャットインターフェースです。
n8nのAI Agentノードを使えば、システムプロンプトとツール接続だけで簡易的なサポートBotを構築できます。
チャットBot構築には[Dify](/articles/no-code/dify-intro)も有力な選択肢ですので、用途に応じて使い分けてください。

### ワークフロー構成

```text
[Chat Trigger] → [AI Agent] → [Respond to Chat]
```

### AI Agentノードの設定

| 設定項目 | 設定値 | 説明 |
|---------|--------|------|
| System Prompt | 下記参照 | AIの振る舞いを定義 |
| モデル | GPT-4o mini | 応答速度とコストを重視 |
| Memory | Simple Memory（旧Window Buffer Memory） | 直近の会話履歴を保持 |
| Memory Window | 10 | 保持するやり取りの往復数 |
| ツール接続 | Google Sheets（任意） | FAQデータの参照用 |

### 設定手順

1. **Chat Triggerノード** — n8nのチャットウィジェットからメッセージを受信します
2. **AI Agentノード** — 以下のシステムプロンプトを設定します

```text
あなたは社内サポートAIです。
社員からの質問に簡潔に回答してください。
回答は200文字以内で、敬語を使ってください。
わからない質問は「担当者に確認します」と回答してください。
```

3. **AI Agentにツールを追加**（オプション） — Google SheetsやHTTP Requestノードをツールとして接続します。AIがFAQデータを参照して回答を生成できるようになります

## 動作確認・トラブルシューティング

動作確認とは、構築したワークフローが正しく機能しているかを検証するプロセスです。
n8nではワークフローエディタ上の「Test workflow」ボタンから手動実行し、各ノードの入出力データを確認できます。

| エラー | 原因 | 解決策 |
|--------|------|--------|
| LLMノードでエラー | APIキーの未設定 | Credentialsを確認し、APIキーを再設定 |
| 応答が遅い | モデルの選択 | GPT-4oからGPT-4o miniに変更してコストと速度を改善 |
| 日本語が文字化け | エンコーディング | HTTP Requestノードのレスポンスエンコーディングを確認 |
| ワークフローが停止 | n8nのメモリ不足 | セルフホスト環境のRAMを増設（4GB以上推奨） |

### 応用・カスタマイズ例

n8nのLLMノードを活用した業務フロー自動化は、上記3パターン以外にもさまざまな業務に応用できます。

- **メール→AI分類→担当者通知** — IMAP（メールサーバーからメールを取得するプロトコル）ノードでメールを受信し、AIで分類してSlackの適切なチャンネルに通知
- **フォーム→AI回答→自動返信** — Webhookでフォーム回答を受信し、AIが回答を生成してGmailで自動返信
- **定期レポート** — Schedule Triggerで毎週月曜にデータを集計し、AIで分析コメントを生成

n8nの構築方法は[n8nセルフホスティングガイド](/articles/no-code/n8n-self-hosting)、AI APIの基礎は[Claude API入門](/articles/ai-api/claude-api-intro)をご覧ください。
