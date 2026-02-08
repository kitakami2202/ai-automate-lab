---
title: "Gemini API入門 - Googleの最新AI APIを使いこなす"
description: "GoogleのGemini APIの基本的な使い方を解説。マルチモーダル対応のAI機能をアプリケーションに組み込む方法を初心者向けに紹介します。"
category: "ai-api"
tags: ["Gemini", "Google AI", "マルチモーダル", "AI API"]
publishedAt: 2025-03-10
updatedAt: 2025-03-10
author: "れん"
difficulty: "beginner"
timeToRead: 15
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  totalTime: "PT30M"
relatedArticles: ["ai-api/claude-api-intro", "ai-api/openai-api-intro", "reviews/ai-dev-tools-comparison"]
draft: false
faq:
  - question: "Gemini APIは無料で使えますか？"
    answer: "はい。Google AI StudioでAPIキーを取得すれば、無料枠の範囲内で利用可能です。無料枠はモデルによって異なります。"
  - question: "Gemini APIのマルチモーダル機能とは？"
    answer: "テキストだけでなく、画像や動画も入力として受け付けられる機能です。画像の説明生成や、画像内のテキスト抽出などが可能です。"
  - question: "GeminiとGPT-4の違いは何ですか？"
    answer: "GeminiはGoogleが開発したモデルで、Google検索との連携やマルチモーダル対応が強みです。GPT-4はOpenAIのモデルで、エコシステムの広さが特徴です。"
---

## Gemini APIとは

Gemini APIは、Googleが提供するマルチモーダルAIモデルのAPIです。テキストだけでなく、画像や動画も処理できます。

## セットアップ

```bash
pip install google-generativeai
```

## テキスト生成

```python
import google.generativeai as genai

genai.configure(api_key="your-api-key")
model = genai.GenerativeModel("gemini-pro")

response = model.generate_content("日本の四季について教えてください")
print(response.text)
```

## 画像認識

Geminiのマルチモーダル機能で画像を分析できます。

```python
import PIL.Image

model = genai.GenerativeModel("gemini-pro-vision")
image = PIL.Image.open("photo.jpg")

response = model.generate_content(["この画像を説明してください", image])
print(response.text)
```

## GASとの連携

```javascript
function callGeminiAPI(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
  });

  const result = JSON.parse(response.getContentText());
  return result.candidates[0].content.parts[0].text;
}
```

## まとめ

Gemini APIはマルチモーダル対応という大きな強みがあります。テキスト・画像・動画を横断した処理に挑戦してみましょう。
