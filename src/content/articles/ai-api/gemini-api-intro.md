---
title: "Gemini API入門|PythonとGASで始めるAI活用"
description: "Gemini APIの使い方をPythonとGAS（Google Apps Script）の2パターンで解説。新SDK（google-genai）対応のコード例付きで、無料枠を活用した請求書読み取りや画像分析など中小企業の業務自動化を始める手順を紹介します。"
category: "ai-api"
tags: ["Gemini API", "Google AI", "Python", "GAS", "マルチモーダル"]
publishedAt: 2025-03-10
updatedAt: 2026-02-13
author: "れん"
difficulty: "beginner"
timeToRead: 15
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  totalTime: "PT60M"
  estimatedCost: "0円（無料枠内）"
faq:
  - question: "Gemini APIは無料で使えますか？"
    answer: "はい、Google AI StudioでAPIキーを取得すれば無料枠で利用可能です。gemini-2.5-flashなら1日250リクエスト、gemini-2.5-flash-liteなら1日1,000リクエストまで無料で使えます。中小企業の業務自動化テストには十分な枠ですが、本番運用では従量課金への移行を検討してください。"
  - question: "google-generativeaiとgoogle-genaiの違いは？どちらを使うべきですか？"
    answer: "google-generativeaiは旧SDKで、2025年11月に非推奨化されました。google-genaiが現在の公式SDK（GA版）で、Gemini APIとVertex AIの両方に対応しています。新規開発では必ずgoogle-genaiを使用してください。"
  - question: "GAS（Google Apps Script）からGemini APIを使えますか？"
    answer: "はい、UrlFetchAppでREST APIを直接呼び出せます。SDKのインストールが不要で、Googleアカウントだけで始められるのが強みです。APIキーはスクリプトプロパティで安全に管理できます。本記事のステップ3で実装例を掲載しています。"
  - question: "Gemini APIのマルチモーダル機能でどんな業務を自動化できますか？"
    answer: "請求書PDFの読み取り・データ抽出、商品画像からの説明文自動生成、名刺のデジタル化などが代表的です。テキスト・画像・PDF・音声・動画を入力できるため、中小企業では特に紙書類のデジタル化で大きな効果が期待できます。"
  - question: "GeminiとChatGPT（OpenAI）、Claude（Anthropic）のAPIはどう使い分けますか？"
    answer: "Geminiの強みは無料枠の大きさとGASとの相性です。OpenAI APIはエコシステムの広さとツール連携、Claude APIは長文処理と指示追従性が優れています。中小企業でまず試すなら、無料で始められるGemini APIが導入しやすいです。詳しくは当サイトのAI開発ツール比較記事を参照してください。"
relatedArticles:
  - "ai-api/ai-api-overview"
  - "ai-api/openai-api-intro"
  - "gas/gas-basics"
draft: false
---

この記事では、Gemini APIを使ったテキスト生成と画像分析のスクリプトを約60分で構築する手順を解説します。PythonとGAS（Google Apps Script）の2パターンでコードを掲載しており、コピペで動くようになっています。

AI APIの全体像を知りたい方は[AI APIを業務に組み込む方法](/articles/ai-api/ai-api-overview)を、AIを業務に導入する全体像から知りたい方は[中小企業向けAI導入5ステップ](/articles/frameworks/ai-introduction-5steps)をご覧ください。

## この記事で作るもの（完成イメージ）

Gemini APIとは、Googleが提供するAI API（Google AI API、プログラムからAIの機能を呼び出すための仕組み）です。テキストだけでなく画像・PDF・音声・動画も入力できるマルチモーダル対応が特徴です。Google AI Studioから無料で始められます。

この記事では、Gemini APIの使い方をPythonとGASの2パターンで解説し、テキスト生成と画像分析ができるスクリプトを構築します。

Gemini APIが他のAI APIと比べて中小企業に向いている理由は次の3つです。

- **無料枠が大きい** --- gemini-2.5-flashは1日250リクエストまで無料で、業務テストに十分な量です
- **GASから直接呼べる** --- Googleアカウントだけで環境構築なしに始められます
- **マルチモーダル対応** --- 画像・PDF・音声を1つのAPIで処理でき、請求書読み取りや商品画像分析に使えます

読者のスキルに応じて2つのルートを用意しました。

- **ルートA: Python + google-genai SDK（SDK: Software Development Kit、開発ツールキット）** --- ローカルPCまたはGoogle Colabで実行。本格的な業務自動化向け
- **ルートB: GAS + UrlFetchApp** --- Googleアカウントだけで完結。スプレッドシート連携などすぐ試したい方向け

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Googleアカウント |
| 必要な知識 | Pythonの基礎（ルートAの場合）/ GASの基礎（ルートBの場合） |
| 所要時間 | 約60分（両ルート実施時） |
| 費用 | 0円（無料枠内） |
| 完成物 | テキスト生成 + 画像分析ができるスクリプト |

## 準備・環境構築

環境構築とは、Gemini APIを呼び出すために必要なAPIキーの取得とライブラリの導入を行う工程です。APIキーの取得方法、Pythonルートの環境構築、GASルートの設定方法を順に説明します。

### APIキーの取得手順

Gemini APIを使うには、Google AI StudioでAPIキーを発行します。

1. [Google AI Studio](https://aistudio.google.com)にGoogleアカウントでログインします
2. 左メニューまたは画面上部の「Get API Key」をクリックします
3. 「Create API Key」からプロジェクトを選択（または新規作成）し、APIキーを発行します
4. 発行されたAPIキーを安全な場所に控えておきます

**APIキーの設定方法（Pythonルート）:**

環境変数（OS上でプログラムに値を渡す仕組み）にAPIキーを設定します。

```bash
# Windows（PowerShell）
$env:GOOGLE_API_KEY="取得したAPIキー"

# Mac / Linux
export GOOGLE_API_KEY="取得したAPIキー"
```

**APIキーの設定方法（GASルート）:**

GASでは、スクリプトプロパティにAPIキーを保存します。

1. GASエディタで「プロジェクトの設定」（歯車アイコン）を開きます
2. 「スクリプト プロパティ」セクションで「スクリプト プロパティを追加」をクリックします
3. プロパティ名に `GEMINI_API_KEY`、値に取得したAPIキーを入力して保存します

### Pythonルートの環境構築

Pythonでは新SDK（google-genai）をインストールします。旧SDK（google-generativeai）は2025年11月に非推奨化されたため、必ず新SDKを使ってください。

```bash
pip install google-genai
```

新SDKの基本的な使い方は次のとおりです。

```python
from google import genai

# 環境変数 GOOGLE_API_KEY を自動認識するため、APIキーの指定は不要
client = genai.Client()
```

旧SDKと新SDKの違いを表にまとめました。ネット上の記事には旧SDKのコードが多く残っているため、混乱しないよう確認してください。

| 項目 | 旧SDK（google-generativeai） | 新SDK（google-genai） |
|------|---------------------------|---------------------|
| パッケージ名 | google-generativeai | google-genai |
| ステータス | 2025年11月非推奨化 | GA（推奨） |
| 初期化方法 | `genai.configure(api_key=...)` | `client = genai.Client()` |
| モデル指定 | `genai.GenerativeModel("...")` | `client.models.generate_content(model="...")` |
| Vertex AI対応 | 別SDK必要 | 同一SDKで対応 |

### 利用可能なモデルと料金

Google AI APIであるGemini APIで利用できる主要モデルの比較表です（2026年2月時点。最新情報は[公式料金ページ](https://ai.google.dev/gemini-api/docs/pricing)を確認してください）。

| モデル | 特徴 | 無料枠 | 有料入力単価（/100万トークン） | 推奨用途 |
|--------|------|--------|------|------|
| gemini-2.5-flash | 高速・低コスト・思考予算制御可 | 10 RPM / 250 RPD | $0.15 | 日常的なテキスト処理・分類 |
| gemini-2.5-flash-lite | 最軽量・大量処理向け | 15 RPM / 1,000 RPD | $0.075 | 大量バッチ処理 |
| gemini-2.5-pro | 高精度・複雑な推論 | 5 RPM / 50 RPD | $1.25 | 高度な分析・コード生成 |
| gemini-2.0-flash | バランス型（**2026/3/31廃止予定**） | 15 RPM / 200 RPD | $0.10 | ※gemini-2.5-flash-liteへの移行推奨 |

※ RPM = 1分あたりのリクエスト数、RPD = 1日あたりのリクエスト数

この記事では、無料枠が大きくコストパフォーマンスに優れた**gemini-2.5-flash**を使用します。

## 実装手順

実装手順とは、Gemini APIを実際にコードから呼び出してテキスト生成・画像分析を行う一連の流れです。PythonとGASに分けて、コピペで動くコードを掲載します。

### ステップ1: テキスト生成（Python）

まずは最もシンプルなテキスト生成から始めます。新SDK（google-genai）では、環境変数`GOOGLE_API_KEY`を設定しておけば、コード内でAPIキーを指定する必要はありません。

```python
from google import genai

client = genai.Client()  # GOOGLE_API_KEY環境変数を自動認識

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="日本の中小企業で活用できるAI自動化の事例を3つ教えてください"
)
print(response.text)
```

**このコードのポイント:**

- `genai.Client()` は環境変数 `GOOGLE_API_KEY` を自動的に読み込みます。コードにAPIキーを直接書く必要はありません
- `model="gemini-2.5-flash"` で使用するモデルを指定しています。用途に応じてモデルを切り替えられます
- `contents` にはテキストの文字列を渡すだけで、Geminiが応答を生成します

### ステップ2: 画像分析・マルチモーダル（Python）

Gemini APIのマルチモーダル機能を使うと、画像を送信してAIに分析させることができます。中小企業では、商品画像から説明文を自動生成したり、請求書の内容を読み取ったりする業務に活用できます。

**URLから画像を読み込む場合:**

```python
from google import genai
from google.genai import types

client = genai.Client()

image = types.Part.from_uri(
    file_uri="https://example.com/invoice.jpg",
    mime_type="image/jpeg"
)

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=["この請求書の金額と日付を読み取ってください", image]
)
print(response.text)
```

**ローカルの画像ファイルを読み込む場合:**

```python
from google import genai
from google.genai import types

client = genai.Client()

with open("invoice.jpg", "rb") as f:
    image = types.Part.from_bytes(data=f.read(), mime_type="image/jpeg")

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=["この請求書の合計金額、発行日、宛名を抽出してJSON形式で返してください", image]
)
print(response.text)
```

**このコードのポイント:**

- `contents` にはテキストと画像を配列で渡します。テキストで「何を分析してほしいか」を指示し、画像データを添えます
- `types.Part.from_uri()` はURLから画像を読み込む場合、`types.Part.from_bytes()` はローカルファイルを読み込む場合に使います
- `mime_type` には画像の形式を指定します（JPEG: `image/jpeg`、PNG: `image/png`、WebP: `image/webp`）
- 「JSON形式で返してください」のように出力形式を指示すると、後続の処理で扱いやすい形式で結果を得られます

### ステップ3: GASからREST APIを呼ぶ

GAS（Google Apps Script）からはREST API（HTTPリクエストでデータを送受信する仕組み）を直接呼び出します。SDKのインストールは不要で、Googleアカウントだけで始められるのが強みです。GASの基本については[GASでできること完全ガイド](/articles/gas/gas-basics)で詳しく解説しています。

```javascript
function callGeminiAPI(prompt) {
  var apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey;

  var payload = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(url, options);
  var result = JSON.parse(response.getContentText());

  if (response.getResponseCode() !== 200) {
    Logger.log('エラー: ' + response.getContentText());
    return 'エラーが発生しました';
  }

  return result.candidates[0].content.parts[0].text;
}
```

**使用例 --- スプレッドシートのデータをAIで要約する:**

```javascript
function summarizeSheetData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var text = data.map(function(row) { return row.join(', '); }).join('\n');

  var prompt = '以下のスプレッドシートのデータを3行で要約してください:\n\n' + text;
  var summary = callGeminiAPI(prompt);

  Logger.log(summary);
}
```

**このコードのポイント:**

- APIキーは `PropertiesService.getScriptProperties()` から取得しています。コードにAPIキーを直接書かないことでセキュリティを確保します
- REST APIのエンドポイントは `v1beta` を使用しています。モデル名はURLに直接含めます
- `muteHttpExceptions: true` を指定すると、エラーレスポンスも受け取れるため、エラーハンドリングが可能になります
- GASからはスプレッドシート、Gmail、Googleカレンダーなど他のGoogleサービスとも簡単に連携できます

## 動作確認・トラブルシューティング

動作確認とは、構築したスクリプトが正しく動作するかテストし、問題があれば原因を特定して解決する工程です。

### テスト手順

**Python（ステップ1のテスト）:**

```bash
python -c "from google import genai; client = genai.Client(); print(client.models.generate_content(model='gemini-2.5-flash', contents='こんにちは').text)"
```

正常に動作すれば、Geminiからの応答テキストが表示されます。

**GAS（ステップ3のテスト）:**

GASエディタで以下の関数を作成し、実行ボタンを押してください。

```javascript
function testGemini() {
  var result = callGeminiAPI('こんにちは。簡単な自己紹介をしてください。');
  Logger.log(result);
}
```

「実行ログ」にGeminiの応答が表示されれば成功です。

### よくあるエラーと解決策

| エラー | 原因 | 解決策 |
|--------|------|--------|
| `API_KEY_INVALID` | APIキーが無効または未設定 | Google AI Studioで再発行し、環境変数（Python）またはスクリプトプロパティ（GAS）を再設定してください |
| `RESOURCE_EXHAUSTED` | 無料枠のレート制限超過 | RPM/RPDの上限を確認し、リクエスト間隔を空けてください。翌日にリセットされます |
| `MODEL_NOT_FOUND` | 廃止済みモデル名を指定 | `gemini-pro`等は廃止済みです。`gemini-2.5-flash`に変更してください |
| `INVALID_ARGUMENT` | 画像形式が未対応またはサイズ超過 | JPEG/PNG/WebP形式で20MB以内の画像に変換してください |
| `ModuleNotFoundError` | 旧SDK名でimportしている | `pip install google-genai` を実行し、`from google import genai` でインポートしてください |
| GAS: `Exception: Request failed` | APIエンドポイントのURL誤り | URLの `v1beta` とモデル名（`gemini-2.5-flash`）を確認してください |

### 無料枠の上限まとめ

無料枠を超えるとリクエストが拒否されます。業務テストで利用する場合は、以下の制限を意識してください。

| モデル | RPM（1分あたり） | RPD（1日あたり） |
|--------|:---:|:---:|
| gemini-2.5-flash | 10 | 250 |
| gemini-2.5-flash-lite | 15 | 1,000 |
| gemini-2.5-pro | 5 | 50 |

## 応用・業務活用アイデア

応用・業務活用アイデアとは、Gemini APIの基本操作を習得した後に取り組める、中小企業での具体的な自動化シナリオです。

### 中小企業での活用シナリオ

| 業務シナリオ | 使用機能 | 実装方法 | 想定される効果 |
|-------------|---------|---------|------|
| 請求書PDF読み取り → スプレッドシート転記 | マルチモーダル（PDF） | GAS + Gemini API | 手入力の大幅削減 |
| 商品画像から説明文を自動生成 | マルチモーダル（画像） | Python / GAS | 1商品あたりの出品作業時間を短縮 |
| 問い合わせメールの自動分類 | テキスト分類 | GAS + Gmail | 手動振り分け作業の自動化 |
| 会議議事録の要約 | テキスト要約 | Python | 要約文の下書き自動生成 |
| 社内文書の検索・QA | テキスト生成 | Python | 社内ナレッジへのアクセス迅速化 |

業務のどこから自動化すべきか迷ったら、[どこから自動化すべきか判断マトリクス](/articles/frameworks/where-to-automate-first)を参考にしてください。

### 他のAI APIとの使い分け

Gemini API以外にも、業務自動化に使える主要なAI APIがあります。それぞれ得意分野が異なるため、用途に応じて使い分けるのが効果的です。

- **OpenAI API** --- エコシステムが広く、Function Calling（AIに外部ツールや関数を実行させる機能）によるツール連携が強みです。詳しくは[OpenAI API入門](/articles/ai-api/openai-api-intro)で解説しています
- **Claude API** --- 長文処理と指示追従性に優れ、複雑な文書の分析に向いています。詳しくは[Claude API入門](/articles/ai-api/claude-api-intro)で解説しています
- **Gemini API（Google AI API）** --- 無料枠の大きさとGAS連携が強み。Googleサービスとの組み合わせで中小企業の業務自動化に適しています

各AI APIの詳しい比較は[AI開発ツール比較](/articles/reviews/ai-dev-tools-comparison)をご覧ください。

AI導入の全体像を把握したい方は、[中小企業向けAI導入5ステップ](/articles/frameworks/ai-introduction-5steps)を参考にしてください。
