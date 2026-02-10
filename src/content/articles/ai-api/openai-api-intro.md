---
title: "OpenAI API入門 - 業務自動化を始める実践ガイド"
description: "OpenAI APIの使い方を初心者向けに解説。Python環境構築からChat Completions・Responses APIの実装、問い合わせメール自動分類の実践コードまで、コピペで動くサンプル付きで紹介します。中小企業の業務自動化を始めましょう。"
category: "ai-api"
tags: ["OpenAI API", "ChatGPT API", "Python", "業務自動化", "GAS"]
publishedAt: 2025-02-05
updatedAt: 2026-02-09
author: "れん"
difficulty: "beginner"
timeToRead: 15
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "月100件処理で約15円"
  totalTime: "PT60M"
faq:
  - question: "OpenAI APIの料金体系はどうなっていますか？"
    answer: "従量課金制で、モデルごとに入力・出力トークンの単価が異なります。たとえばgpt-4o-miniは入力$0.15/100万トークン・出力$0.60/100万トークンで、月1,000件の短文メール分類なら約15円です。使用量の月額上限はダッシュボードのBilling画面から設定できます。料金は2026年2月時点の情報で、最新は公式料金ページをご確認ください。"
  - question: "OpenAI APIとChatGPTの違いは何ですか？"
    answer: "ChatGPTはブラウザやアプリで使うチャットサービスで、OpenAI APIはプログラムからAIを呼び出すためのインターフェースです。APIを使えば自社のシステムやスクリプトにAI機能を組み込めるため、業務自動化にはAPIが必要になります。ChatGPTの月額プラン（Plus/Team等）とAPIの料金体系は別です。"
  - question: "APIキーが漏洩した場合どうすればよいですか？"
    answer: "まずOpenAIダッシュボードから該当のAPIキーを即座に無効化し、新しいキーを発行してください。APIキーは環境変数で管理し、ソースコードにハードコードしないことが鉄則です。Gitリポジトリで管理する場合は.gitignoreに.envを追加し、誤ってコミットしないようにしましょう。プロジェクト単位でキーを発行すれば、万一の漏洩時に影響範囲を限定できます。"
  - question: "Chat Completions APIとResponses APIのどちらを使うべきですか？"
    answer: "2026年2月時点では、新規プロジェクトにはResponses APIが推奨されています。組み込みツール（Web検索・ファイル検索等）が使え、会話管理もサーバー側で自動化できるためです。一方、既存システムの保守やシンプルな単発テキスト処理にはChat Completions APIが安定しており、情報も豊富です。本記事では両方のコード例を掲載していますので、用途に合わせて選んでください。"
  - question: "OpenAI APIをGoogle Apps Script（GAS）から使えますか？"
    answer: "はい、GASのUrlFetchApp関数でHTTPリクエストを送信すれば利用可能です。APIキーはPropertiesService.getScriptProperties()で安全に管理します。スプレッドシートとの連携で問い合わせメールの一括分類なども実現できます。具体的な手順はGASでできること完全ガイドもあわせてご覧ください。"
relatedArticles:
  - "ai-api/ai-api-overview"
  - "ai-api/claude-api-intro"
  - "ai-api/gemini-api-intro"
draft: false
---

この記事では、OpenAI APIを使った問い合わせメール自動分類スクリプトを約60分で構築する手順を解説します。
Pythonの基本文法がわかれば、コードをコピペするだけで動くように全コードを掲載しています。
AIを業務に導入する全体像から知りたい方は、先に[中小企業向けAI導入5ステップ](/articles/frameworks/ai-introduction-5steps)をご覧ください。

## この記事で作るもの（完成イメージ）

OpenAI APIとは、OpenAIが提供するGPTシリーズのAIモデルをプログラムから呼び出すためのインターフェースです。ChatGPT API（OpenAI API）を使えば、チャットボットだけでなく、メール分類・文書要約・データ抽出といった業務処理をプログラムで自動化できます。

この記事では、GPT APIの使い方を業務自動化の観点から解説し、「問い合わせメールの自動分類スクリプト」を完成させます。メール本文を入力すると、カテゴリ・要約・緊急度をJSON形式で返すPythonスクリプトです。

### 前提条件

| 項目 | 内容 |
|------|------|
| 必要なアカウント | OpenAIアカウント（無料登録 + クレジットカード） |
| 必要な知識 | Pythonの基本文法（変数・関数がわかればOK） |
| 所要時間 | 約60分（アカウント作成〜動作確認まで） |
| 完成物 | メール文面を分類・要約するPythonスクリプト |
| 費用目安 | 月100件の処理で約10〜30円（gpt-4o-mini使用時、2026年2月時点） |

## 準備・環境構築

環境構築とは、OpenAI APIをプログラムから呼び出すために必要なアカウント・ライブラリ・設定ファイルを整える作業です。

### OpenAIアカウント作成とAPIキー取得

APIキーの取得は以下の3ステップで完了します。

1. [OpenAI Platform](https://platform.openai.com/)にアクセスし、アカウントを登録します（Googleアカウントでも可）
2. ダッシュボードの「API keys」から「Create new secret key」をクリックし、プロジェクト用のAPIキーを発行します
3. 「Settings」→「Billing」でクレジットカードを登録し、月額の使用量上限（例: $5）を設定します

APIキーは発行時に一度だけ表示されます。必ずコピーして安全な場所に保管してください。

### Python環境のセットアップ

ターミナルで以下のコマンドを実行し、必要なライブラリをインストールします。

```bash
pip install openai python-dotenv
```

次に、プロジェクトフォルダに`.env`ファイルを作成し、APIキーを記述します。

```text
OPENAI_API_KEY=sk-proj-xxxxx（ここに自分のAPIキーを貼り付け）
```

**セキュリティ上の注意**: `.env`ファイルをGitで管理しないように、`.gitignore`に必ず追加してください。APIキーをソースコードにハードコードすると、リポジトリの公開時に漏洩するリスクがあります。

```text
# .gitignore に追加
.env
```

Pythonコードから環境変数を読み込む基本コードは以下のとおりです。

```python
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()  # OPENAI_API_KEY環境変数を自動認識
```

`OpenAI()`はデフォルトで環境変数`OPENAI_API_KEY`を参照するため、明示的に`api_key=`を渡す必要はありません。

### 準備物チェック表

| 項目 | 取得方法 | 備考 |
|------|---------|------|
| OpenAIアカウント | [platform.openai.com](https://platform.openai.com/)で登録 | Googleアカウントで可 |
| APIキー | ダッシュボード → API keys → Create new secret key | プロジェクト単位で発行推奨 |
| クレジットカード | Settings → Billing | 使用量上限（月$5等）の設定を推奨 |
| Python 3.9以上 | [python.org](https://python.org/) | 3.9〜3.12推奨 |
| openaiライブラリ | `pip install openai` | バージョン1.0以上必須 |
| python-dotenv | `pip install python-dotenv` | 環境変数管理用 |

## 実装手順

Chat Completions APIとは、メッセージのやり取り（チャット形式）でAIの応答を得るOpenAIの主要APIです。ここでは基本コードから業務自動化の実践コードまで、3ステップで実装します。

### ステップ1: 基本のChat Completions API

まずは最小限のコードでAPIの動作を確認します。

```python
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "あなたは業務アシスタントです。"},
        {"role": "user", "content": "請求書と見積書の違いを1文で説明してください。"},
    ],
)

print(response.choices[0].message.content)
```

**このコードのポイント:**

- `model`にはコスト重視なら`gpt-4o-mini`、品質重視なら`gpt-4o`を指定します
- `messages`配列の`system`ロールでAIの役割を定義し、`user`ロールでユーザーの入力を渡します
- レスポンスの`choices[0].message.content`にAIの応答テキストが格納されます

用途に応じたモデルの選び方は以下のとおりです。料金は2026年2月時点の情報です。最新は[OpenAI公式料金ページ](https://openai.com/api/pricing/)をご確認ください。

| モデル | 特徴 | 入力料金（/100万トークン） | 出力料金（/100万トークン） | 用途の目安 |
|--------|------|----------------------|----------------------|------------|
| gpt-4o-mini | 高速・低コスト | $0.15 | $0.60 | 分類・要約・定型処理（コスト重視の業務に最適） |
| gpt-4o | 高性能・バランス | $2.50 | $10.00 | 複雑な判断・文章生成（品質重視の業務向け） |
| o3 | 推論特化 | $2.00 | $8.00 | 複雑な分析・多段階の推論が必要な処理 |
| o4-mini | 推論（軽量） | $1.10 | $4.40 | 推論が必要だがコストを抑えたい場合 |

中小企業の定型業務（メール分類・要約など）にはgpt-4o-miniが最もコストパフォーマンスに優れています。入力500トークン・出力200トークンの処理を月1,000件実行しても約$0.10（約15円）で済みます。

### ステップ2: 業務自動化の実践コード（問い合わせメール分類）

実際の業務で使える「問い合わせメール自動分類スクリプト」を実装します。systemプロンプトで分類AIの役割を定義し、`response_format`でJSON出力を強制します。

```python
import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()


def classify_inquiry(email_body: str) -> dict:
    """問い合わせメールを分類・要約する"""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "あなたは中小企業の問い合わせ対応AIです。"
                    "メール本文を分析し、以下のJSON形式で返してください：\n"
                    '{"category": "見積依頼|製品問い合わせ|クレーム|その他",'
                    ' "summary": "50文字以内の要約",'
                    ' "urgency": "高|中|低",'
                    ' "suggested_action": "推奨対応"}'
                ),
            },
            {"role": "user", "content": email_body},
        ],
        response_format={"type": "json_object"},
        temperature=0.2,
    )
    return json.loads(response.choices[0].message.content)


# 使用例
sample_email = """
お世話になっております。
先日ご提案いただいた業務システムについて、
正式に見積もりをお願いしたく、ご連絡いたしました。
納期は来月末を希望しております。
"""

result = classify_inquiry(sample_email)
print(json.dumps(result, ensure_ascii=False, indent=2))
```

**実行結果の例:**

```json
{
  "category": "見積依頼",
  "summary": "業務システムの正式見積もり依頼。納期は来月末希望。",
  "urgency": "中",
  "suggested_action": "見積書を作成し、納期の実現可能性を確認のうえ回答する"
}
```

**このコードのポイント:**

- `response_format={"type": "json_object"}`を指定することで、AIの応答を確実にJSON形式に制約できます
- `temperature=0.2`で出力のばらつきを抑え、分類結果の安定性を高めています
- systemプロンプトで出力のフォーマットを具体的に指示することが、業務自動化の精度を左右します

### ステップ3: Responses API（新API）での実装

Responses APIは2025年3月に発表されたOpenAIの新しいAPIです。Chat Completions APIとの主な違いを表にまとめます。

| 観点 | Chat Completions API | Responses API |
|------|---------------------|---------------|
| 安定性 | 安定（長期サポート） | 新しい（2025年3月〜） |
| 会話管理 | 自分でmessages配列を管理 | サーバー側で自動管理可能 |
| ツール連携 | Function Calling | 組み込みツール（Web検索、ファイル検索等） |
| コスト | 標準 | キャッシュ効率が高く低コストになりやすい |
| 推奨ケース | シンプルな単発処理、既存システムの保守 | 新規プロジェクト、エージェント構築 |

同じメール分類処理をResponses APIで書くと、以下のようになります。

```python
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()

sample_email = """
お世話になっております。
先日ご提案いただいた業務システムについて、
正式に見積もりをお願いしたく、ご連絡いたしました。
納期は来月末を希望しております。
"""

response = client.responses.create(
    model="gpt-4o-mini",
    instructions=(
        "あなたは中小企業の問い合わせ対応AIです。"
        "メール本文を分析し、カテゴリ・要約・緊急度・推奨対応をJSON形式で返してください。"
    ),
    input=sample_email,
)
print(response.output_text)
```

2026年2月時点では、既存の定型処理にはChat Completions APIが安定しています。新規プロジェクトやエージェント型のシステム構築にはResponses APIが適しています。

### ステップ4: GAS（Google Apps Script）からOpenAI APIを呼ぶ

Pythonを使わない場合でも、GAS（Google Apps Script）からOpenAI APIを呼び出せます。スプレッドシートの問い合わせ一覧を一括分類するなど、Googleサービスとの連携に適しています。

```javascript
// GAS（Google Apps Script）からOpenAI APIを呼ぶ例
function callOpenAI(prompt) {
  var apiKey = PropertiesService.getScriptProperties().getProperty("OPENAI_API_KEY");
  var url = "https://api.openai.com/v1/chat/completions";

  var payload = {
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "あなたは業務アシスタントです。" },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
  };

  var options = {
    method: "post",
    headers: {
      Authorization: "Bearer " + apiKey,
      "Content-Type": "application/json",
    },
    payload: JSON.stringify(payload),
  };

  var response = UrlFetchApp.fetch(url, options);
  var json = JSON.parse(response.getContentText());
  return json.choices[0].message.content;
}
```

**このコードのポイント:**

- APIキーは`PropertiesService.getScriptProperties()`で管理し、コードに直書きしません
- GASの`UrlFetchApp.fetch()`でOpenAI APIのエンドポイントにPOSTリクエストを送信します
- 戻り値をスプレッドシートのセルに書き込めば、一括処理の仕組みが構築できます

GASの基本から学びたい方は、[GASでできること完全ガイド](/articles/gas/gas-basics)もあわせてご覧ください。

## 動作確認・トラブルシューティング

トラブルシューティングとは、APIの実行中に発生するエラーの原因を特定し、解決する手順です。ここではテスト方法とよくあるエラーへの対処法を整理します。

### テスト手順

ターミナルで以下のコマンドを実行し、APIが正常に動作するか確認します。

```bash
python classify_inquiry.py
```

JSON形式の分類結果が表示されれば成功です。エラーが出た場合は、以下の表を参照してください。

### よくあるエラーと対処法

| エラー | 原因 | 解決策 |
|--------|------|--------|
| `AuthenticationError` | APIキーが未設定または無効 | `.env`の`OPENAI_API_KEY`を確認し、ダッシュボードでキーを再発行する |
| `RateLimitError` | リクエスト頻度が上限を超過 | `time.sleep(1)`で間隔を空ける。利用実績が増えるとTierが自動昇格する |
| `InsufficientQuotaError` | クレジット残高不足 | Billing画面でクレジットを追加する |
| `BadRequestError`（model not found） | モデル名のタイプミスまたは非対応モデル | [公式ドキュメント](https://platform.openai.com/docs/models)でモデル名を確認する |
| `JSONDecodeError` | AIの応答がJSON形式でない | `response_format={"type": "json_object"}`を指定し、temperatureを下げる |
| `timeout` | ネットワーク障害または長文処理 | `timeout`パラメータを延長する。入力テキストを短くする |

### コスト試算表

中小企業が実際にOpenAI APIを業務で使った場合の月額コスト目安です。料金は2026年2月時点の情報で、最新は[OpenAI公式料金ページ](https://openai.com/api/pricing/)をご確認ください。

| 処理内容 | モデル | 月間件数 | 概算コスト（月額） |
|---------|--------|---------|-----------------|
| メール分類（短文） | gpt-4o-mini | 1,000件 | 約$0.10（約15円） |
| 議事録要約（長文） | gpt-4o-mini | 100件 | 約$0.50（約75円） |
| 複雑な文書分析 | gpt-4o | 100件 | 約$5.00（約750円） |

1件あたり入力500トークン・出力200トークンで試算しています。使用量の上限はダッシュボードの「Settings」→「Limits」から設定できるため、想定外の課金を防げます。

## 応用・カスタマイズ例

OpenAI APIは単体のテキスト処理だけでなく、他のツールやAPIと組み合わせることで業務全体の自動化が実現できます。

### 議事録の自動要約スクリプト

テキストファイルから議事録を読み込み、要約とアクションアイテムを抽出する例です。

```python
import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()


def summarize_minutes(minutes_text: str) -> dict:
    """議事録を要約し、アクションアイテムを抽出する"""
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "あなたは議事録の要約AIです。以下のJSON形式で返してください：\n"
                    '{"summary": "200文字以内の要約",'
                    ' "decisions": ["決定事項1", "決定事項2"],'
                    ' "action_items": [{"task": "タスク名", "owner": "担当者", "deadline": "期限"}]}'
                ),
            },
            {"role": "user", "content": minutes_text},
        ],
        response_format={"type": "json_object"},
        temperature=0.2,
    )
    return json.loads(response.choices[0].message.content)


# 使用例: テキストファイルから議事録を読み込む
with open("meeting_minutes.txt", "r", encoding="utf-8") as f:
    minutes = f.read()

result = summarize_minutes(minutes)
print(json.dumps(result, ensure_ascii=False, indent=2))
```

### 他のAI APIとの比較

OpenAI API以外にも、業務自動化に使えるAI APIがあります。用途に応じて使い分けることで、コストと品質のバランスを最適化できます。

| API | 特徴 | 用途の目安 | 記事リンク |
|-----|------|------------|-----------|
| OpenAI API | モデル種類が豊富でエコシステムが充実 | 汎用テキスト処理・分類 | 本記事 |
| Claude API | 長文処理に強く指示追従性が高い | 長文要約・文書分析 | [Claude API入門](/articles/ai-api/claude-api-intro) |
| Gemini API | Google連携に強く無料枠が大きい | Googleサービス連携 | [Gemini API入門](/articles/ai-api/gemini-api-intro) |

各APIの料金体系・機能・性能をより詳しく比較したい方は、[AI開発ツール比較](/articles/reviews/ai-dev-tools-comparison)をご覧ください。

この記事では、OpenAI APIを使って問い合わせメールの自動分類スクリプトを構築する手順を解説しました。gpt-4o-miniを使えば月1,000件のメール分類が約15円で実現でき、中小企業の業務自動化の第一歩として導入しやすいコスト感です。まずは本記事のコードを動かし、自社の業務に合わせてsystemプロンプトをカスタマイズしてみてください。
