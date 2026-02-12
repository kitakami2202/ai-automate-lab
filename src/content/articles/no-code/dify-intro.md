---
title: "Dify入門｜ノーコードでAIチャットボットを作る"
description: "Dify（ディファイ）を使い、ノーコードでAIチャットボットを構築する方法をステップ形式で解説。社内FAQ Bot・問い合わせBot・ドキュメント検索Botの3パターンを設定手順・API連携コード付きで紹介します。プログラミング不要で約30分でAI Botを公開できます。"
category: "no-code"
tags: ["Dify", "AIチャットボット", "ノーコード", "RAG", "LLM"]
publishedAt: 2026-02-12
updatedAt: 2026-02-12
author: "れん"
difficulty: "beginner"
timeToRead: 12
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "0円〜"
  totalTime: "PT30M"
faq:
  - question: "Difyは無料で使えますか？"
    answer: "はい、Difyのクラウド版（Sandbox）は無料で利用開始できます。月200回のメッセージ送信が無料枠に含まれます。セルフホスト版はオープンソースで完全無料です（2026年2月時点）。AI APIの利用料金は別途発生します。"
  - question: "DifyとChatGPTの違いは何ですか？"
    answer: "ChatGPTは汎用的なAIチャットです。Difyは自社のデータ（社内マニュアル、FAQ等）をAIに読み込ませ、自社専用のAIチャットボットを構築するためのプラットフォームです。社内の業務知識に基づいた回答を生成できる点が大きな違いです。"
  - question: "プログラミングは必要ですか？"
    answer: "不要です。Difyはすべての設定をGUI（画面操作）で行えます。AIモデルの選択、プロンプトの設定、ドキュメントのアップロード、Botの公開まで、コードを一切書かずに完結します。"
  - question: "Difyで作ったBotを社内サイトに埋め込めますか？"
    answer: "はい、可能です。Difyでは公開したBotをiframeで社内ポータルやWebサイトに埋め込めます。また、APIとして外部サービスから呼び出すこともできるため、SlackやDiscordなど既存ツールとの連携も実現できます。"
  - question: "Difyのセルフホスト版とクラウド版の違いは何ですか？"
    answer: "クラウド版はDify公式がホスティングし、無料のSandboxプランから利用できます。セルフホスト版はDocker Composeで自社サーバーに構築し、データを完全に自社管理できます。セキュリティ要件が厳しい場合はセルフホスト版が適しています。"
relatedArticles:
  - "no-code/no-code-overview"
  - "no-code/n8n-ai-workflow"
  - "ai-api/claude-api-intro"
draft: false
---

> この記事は[ノーコード自動化ツール比較](/articles/no-code/no-code-overview)の実装編です。

この記事では、Difyを使ってノーコードでAIチャットボットを約30分で構築する手順を解説します。
社内FAQデータやマニュアルを読み込ませ、業務知識に基づいた回答を自動生成するDifyチャットボットを作成できます。

### この記事の前提

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Dify（[dify.ai](https://dify.ai)で無料登録） |
| Difyバージョン | v1.12.1（2026年2月時点） |
| 必要なAPIキー | OpenAI or Anthropic（AI利用時） |
| 所要時間 | 約30分 |
| 費用 | Dify: 無料〜（[料金プラン](https://dify.ai/pricing)）/ AI API: 従量課金（2026年2月時点） |
| 完成物 | 社内FAQ Bot / 問い合わせ対応Bot |

## Difyとは

Difyとは、LLM（大規模言語モデル）を活用したAIアプリケーションをノーコードで構築できるオープンソースのプラットフォームです。

| 特徴 | 説明 |
|------|------|
| ノーコード | GUI操作だけでAIアプリを構築 |
| RAG対応 | 社内ドキュメントをAIに読み込ませて回答生成 |
| マルチモデル | OpenAI、Claude、Geminiなど複数のAIを利用可能 |
| オープンソース | セルフホストで完全に自社管理も可能 |
| API公開 | 構築したBotをAPIとして外部サービスから呼び出し可能 |

### RAG（検索拡張生成）とは

RAGとは、AIが回答を生成する前に、アップロードしたドキュメントから関連情報を検索し、その情報に基づいて回答する仕組みです。
これにより、AIが自社の業務知識に基づいた正確な回答を生成できます。

## 準備・アカウント設定

準備とは、Difyのアカウントを作成し、AIモデルのAPIキーを設定する作業です。

1. [dify.ai](https://dify.ai) でアカウントを作成します
2. ダッシュボードの「設定」→「モデルプロバイダー」を開きます
3. 使用するAIモデルのAPIキーを登録します

| プロバイダー | 設定値 |
|------------|--------|
| OpenAI | APIキー（`sk-` で始まる） |
| Anthropic | APIキー（`sk-ant-` で始まる） |

APIキーの取得方法は[Claude API入門](/articles/ai-api/claude-api-intro)・[OpenAI API入門](/articles/ai-api/openai-api-intro)をご覧ください。

## 実装手順

実装手順とは、Difyのダッシュボードでアプリ作成からBot公開までをおこなう一連の操作です。

### ステップ1: 社内FAQ Botの構築

1. ダッシュボードの「アプリを作成」→「チャットボット」を選択します
2. アプリ名を入力します（例: 「社内FAQ Bot」）

### ステップ2: ナレッジ（社内データ）のアップロード

1. 「ナレッジ」→「ナレッジを作成」をクリックします
2. FAQ文書やマニュアルをアップロードします

| 対応形式 | 用途 |
|---------|------|
| PDF | 社内マニュアル、就業規則 |
| TXT/Markdown | FAQリスト、手順書 |
| CSV | Q&Aデータベース |
| Webページ | 社内Wiki、ヘルプページ |

3. チャンク（分割）設定で「自動」を選択します
4. インデックスが作成されるまで待ちます

### ステップ3: プロンプトとモデルの設定

「オーケストレーション」画面で以下を設定します。

**システムプロンプト例:**

```text
あなたは当社の社内サポートAIです。
アップロードされたFAQデータとマニュアルに基づいて回答してください。
以下のルールを守ってください：
- 敬語で回答する
- 200文字以内で簡潔に答える
- ドキュメントに記載がない質問は「担当者にお問い合わせください」と回答
- 回答の根拠となるドキュメント名を末尾に記載
```

**モデル設定:**

| 設定項目 | 推奨値 |
|---------|--------|
| モデル | GPT-4o mini or Claude Haiku 4.5 |
| Temperature | 0.3（安定した回答） |
| Max Tokens | 512 |

### ステップ4: 公開と共有

1. 「公開」ボタンをクリックしてBotを公開します
2. 共有方法を選択します

| 共有方法 | 用途 |
|---------|------|
| Webアプリ | ブラウザーからアクセス |
| iframe埋め込み | 社内ポータルに埋め込み |
| API | 外部サービスから呼び出し |

### ステップ5: 動作確認

Botを公開したら、テスト画面で以下の手順で正常動作を確認します。

1. Difyダッシュボードの「プレビュー」をクリックします
2. テスト用の質問を送信します（例: 「有給休暇の申請方法を教えてください」）
3. ナレッジに登録した内容に基づいた回答が返ることを確認します
4. ドキュメントに記載がない質問を送信し、「担当者にお問い合わせください」と返ることを確認します

**トラブルシューティング:**

| エラー | 原因 | 解決策 |
|--------|------|--------|
| Botが回答しない | APIキーの設定不備 | モデルプロバイダーの設定を確認 |
| 的外れな回答が返る | ナレッジデータの不足 | FAQデータを追加・チャンク設定を調整 |
| 「情報が見つかりません」 | 検索精度の問題 | 類似度しきい値を下げる / データの表現を統一 |
| レスポンスが遅い | モデルの選択 | GPT-4oからGPT-4o miniに変更 |

## APIからの呼び出し

APIからの呼び出しとは、Difyで構築したAI Botを外部のプログラムやサービスから利用するための連携方法です。
公開したBotのAPIキーは、Difyダッシュボードの「APIアクセス」画面から取得できます。

### curlでの呼び出し

```bash
# Dify Chat APIの呼び出し
curl -X POST 'https://api.dify.ai/v1/chat-messages' \
  -H "Authorization: Bearer ${DIFY_API_KEY}" \
  -H 'Content-Type: application/json' \
  -d '{
    "inputs": {},
    "query": "有給休暇の申請方法を教えてください",
    "response_mode": "blocking",
    "user": "user-001"
  }'
```

### Pythonでの呼び出し

```python
import os
import requests

DIFY_API_KEY = os.environ["DIFY_API_KEY"]

response = requests.post(
    "https://api.dify.ai/v1/chat-messages",
    headers={
        "Authorization": f"Bearer {DIFY_API_KEY}",
        "Content-Type": "application/json",
    },
    json={
        "inputs": {},
        "query": "有給休暇の申請方法を教えてください",
        "response_mode": "blocking",
        "user": "user-001",
    },
)
print(response.json()["answer"])
```

### iframe埋め込み

社内ポータルにBotを埋め込む場合は、以下のHTMLコードを使用します。
Difyダッシュボードの「公開」→「Webサイトに埋め込む」から埋め込みコードを取得できます。

```html
<iframe
  src="https://udify.app/chatbot/あなたのBotID"
  style="width: 100%; height: 600px; border: none;"
  allow="microphone"
></iframe>
```

## 活用パターンと応用

活用パターンとは、Difyで構築したAI Botを業務に適用する具体的な利用形態です。
以下の3パターンを基本に、自社の業務に合わせてカスタマイズできます。

| パターン | アップロードデータ | 用途 |
|---------|-----------------|------|
| 社内FAQ Bot | FAQ文書、就業規則 | 社員からのよくある質問に自動回答 |
| 問い合わせ対応 | 製品マニュアル、料金表 | 顧客からの問い合わせに回答 |
| 新人教育Bot | 研修資料、業務手順書 | 新入社員の質問にAIが回答 |

### 応用・カスタマイズ

- **ワークフロー機能** --- Difyのワークフロー機能で条件分岐やHTTPリクエストを組み込み、より高度な業務フローを構築できます
- **Discord/Slack連携** --- DifyのAPIを使って[Discord AI Bot](/articles/discord-bot/discord-ai-bot)や[Slack通知](/articles/gas/gas-slack-notification)と連携できます
- **セルフホスト** --- Docker Composeでオンプレミスに構築し、データを完全に自社管理できます

ノーコードツールの全体像は[ノーコード自動化ツール比較](/articles/no-code/no-code-overview)、n8nとのAI連携は[n8n × AI連携](/articles/no-code/n8n-ai-workflow)をご覧ください。
