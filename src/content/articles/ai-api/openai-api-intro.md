---
title: "OpenAI API入門 - ChatGPTの力をアプリに組み込む"
description: "OpenAI APIの基本的な使い方を初心者向けに解説。GPTモデルを使ったテキスト生成やチャット機能の実装方法を紹介します。"
category: "ai-api"
tags: ["OpenAI", "ChatGPT", "GPT", "AI API"]
publishedAt: 2025-02-05
updatedAt: 2025-02-05
author: "れん"
difficulty: "beginner"
timeToRead: 15
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  totalTime: "PT30M"
relatedArticles: ["ai-api/claude-api-intro", "ai-api/gemini-api-intro", "reviews/ai-dev-tools-comparison"]
draft: false
faq:
  - question: "OpenAI APIの料金体系はどうなっていますか？"
    answer: "従量課金制で、モデルごとに入力・出力トークンの単価が異なります。GPT-4oは比較的安価で、GPT-4はより高価です。"
  - question: "OpenAI APIのレート制限はありますか？"
    answer: "はい。アカウントのティア（利用実績）によってリクエスト数やトークン数の制限が異なります。利用が増えると自動的にティアが上がります。"
  - question: "OpenAI APIでストリーミング応答は可能ですか？"
    answer: "はい。stream=Trueパラメータを指定することで、リアルタイムにトークンが生成される様子を受け取れます。チャットUIに最適です。"
---

## OpenAI APIとは

OpenAI APIは、GPTシリーズのモデルをプログラムから利用できるAPIです。

## セットアップ

```bash
pip install openai
```

## 基本的なチャット

```python
from openai import OpenAI

client = OpenAI(api_key="your-api-key")

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "あなたは親切なアシスタントです。"},
        {"role": "user", "content": "Pythonの良いところを3つ教えて"}
    ]
)

print(response.choices[0].message.content)
```

## Function Calling

外部ツールとの連携も可能です。

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "指定した都市の天気を取得する",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {"type": "string", "description": "都市名"}
                },
                "required": ["city"]
            }
        }
    }
]

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "東京の天気は？"}],
    tools=tools
)
```

## まとめ

OpenAI APIは幅広いAI機能を手軽にアプリに統合できます。Function Callingを活用すれば、さらに実用的なアプリケーションを構築できます。
