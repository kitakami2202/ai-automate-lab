---
title: "Claude API入門 - AnthropicのAI APIを使ってみよう"
description: "AnthropicのClaude APIの基本的な使い方を解説。APIキーの取得からプログラムへの組み込みまで、初心者向けにステップバイステップで紹介します。"
category: "ai-api"
tags: ["Claude", "Anthropic", "AI API", "LLM"]
publishedAt: 2025-01-25
updatedAt: 2025-01-25
author: "れん"
difficulty: "beginner"
timeToRead: 15
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  totalTime: "PT30M"
relatedArticles: ["ai-api/openai-api-intro", "ai-api/gemini-api-intro", "reviews/ai-dev-tools-comparison"]
draft: false
faq:
  - question: "Claude APIの料金はどのくらいですか？"
    answer: "Claude APIは従量課金制です。入力トークンと出力トークンそれぞれに料金が設定されており、モデルによって異なります。詳細はAnthropicの公式サイトで確認できます。"
  - question: "Claude APIとChatGPT APIの違いは何ですか？"
    answer: "Claude APIはAnthropicが提供するAI APIで、長文処理や指示追従性に優れています。一方、ChatGPT APIはOpenAIが提供しており、エコシステムの幅広さが特徴です。"
  - question: "Claude APIの無料枠はありますか？"
    answer: "Anthropicは新規アカウント登録時に一定額のクレジットを提供しています。詳細は公式サイトで最新情報をご確認ください。"
---

## Claude APIとは

Claude APIは、Anthropic社が提供するLLM（大規模言語モデル）のAPIです。テキスト生成、要約、分析など幅広いタスクに対応しています。

## APIキーの取得

1. Anthropicのコンソールにアクセス
2. アカウントを作成
3. APIキーを生成

## 基本的な使い方

```python
import anthropic

client = anthropic.Anthropic(api_key="your-api-key")

message = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Pythonでフィボナッチ数列を生成する関数を書いてください"}
    ]
)

print(message.content[0].text)
```

## ストリーミングレスポンス

リアルタイムでレスポンスを受け取ることもできます。

```python
with client.messages.stream(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    messages=[{"role": "user", "content": "AIの未来について教えてください"}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

## まとめ

Claude APIは高性能なAI機能をアプリケーションに組み込む強力なツールです。まずは簡単なテキスト生成から始めてみましょう。
