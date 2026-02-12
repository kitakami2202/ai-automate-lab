---
title: "Claude API入門｜業務自動化を60分で実装する方法"
description: "Claude API（Anthropic API）の使い方を初心者向けに解説。APIキー取得から環境構築、問い合わせメール自動分類スクリプトの実装まで、コピペで動くPythonコード付きで約60分で完成します。月100円から始められる中小企業の業務自動化に最適な入門ガイドです。"
category: "ai-api"
tags: ["Claude API", "Anthropic", "Python", "業務自動化", "AI API"]
publishedAt: 2025-01-25
updatedAt: 2026-02-12
author: "れん"
difficulty: "beginner"
timeToRead: 15
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  totalTime: "PT60M"
faq:
  - question: "Claude APIの料金はどのくらいですか？"
    answer: "Claude APIは従量課金制です。Haiku 4.5は入力$1／出力$5（100万トークンあたり）、Sonnet 4.5は入力$3／出力$15、Opus 4.6は入力$5／出力$25です。新規登録で5ドル分の無料クレジットが付与されるため、月500件の問い合わせ分類なら月額約100円で運用できます（2026年2月時点。最新料金は公式サイトをご確認ください）。"
  - question: "Claude APIとOpenAI API（ChatGPT API）の違いは何ですか？"
    answer: "Claude APIはAnthropic社が提供しており、最大100万トークンの長文処理と指示追従性の高さが特徴です。OpenAI APIはエコシステムの幅広さとFunction Callingの充実が強みです。中小企業の文書処理・要約・分類タスクにはClaudeが適している場合が多いです。詳しくは当サイトの「OpenAI API入門」記事もあわせてご覧ください。"
  - question: "Claude APIに無料枠はありますか？"
    answer: "新規アカウント登録時に5ドル分の無料クレジットが付与されます（2026年2月時点）。APIキーの取得自体は無料で、クレジットを使い切るまでは課金なしで利用可能です。クレジット消費後は従量課金に移行しますが、コンソールで月間予算の上限設定もできます。"
  - question: "プログラミング初心者でもClaude APIを使えますか？"
    answer: "Pythonの基本（変数や関数の書き方）がわかれば、本記事のコードをコピペして動かせます。Anthropic公式SDKが複雑な処理を内部で処理してくれるため、わずか10行程度のコードでテキスト生成が可能です。まずは本記事のステップ1のサンプルコードをそのまま実行してみてください。"
  - question: "APIキーの安全な管理方法は？"
    answer: "環境変数（ANTHROPIC_API_KEY）で管理するのが基本です。.envファイルにAPIキーを記載し、python-dotenvで読み込みます。.gitignoreに.envを追加してGitリポジトリにコミットされないようにしてください。Anthropic公式SDKは環境変数を自動認識するため、コード内にAPIキーを直接書く必要はありません。"
relatedArticles:
  - "ai-api/openai-api-intro"
  - "ai-api/gemini-api-intro"
  - "frameworks/ai-introduction-5steps"
draft: false
---

この記事では、Claude APIを使った問い合わせメール自動分類スクリプトを約60分で構築する手順を解説します。Pythonの基本がわかれば、コードをコピペするだけで動くように全コードを掲載しています。

AI APIの全体像や3大API比較は[AI APIを業務に組み込む方法](/articles/ai-api/ai-api-overview)をご覧ください。

## この記事で作るもの（完成イメージ）

Claude API（Anthropic API）とは、Anthropic社が提供するLLM（大規模言語モデル）をプログラムから利用するためのインターフェースです。テキスト生成・要約・分類・画像認識など、幅広い業務タスクに対応しています。

この記事では、Claude APIを使って**問い合わせメールを自動分類するPythonスクリプト**を作成します。メール本文を入力すると、カテゴリ・要約・緊急度・推奨対応をJSON形式で返します。

### 前提条件

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Anthropicアカウント（無料で作成可能） |
| 必要な知識 | Pythonの基本（変数、関数がわかればOK） |
| 所要時間 | 約60分 |
| 完成物 | 問い合わせメールを「見積依頼」「製品問い合わせ」「クレーム」等に自動分類するスクリプト |

## 準備・環境構築

環境構築とは、Claude APIを利用するために必要なアカウント・ライブラリ・設定ファイルを整える作業のことです。ここではClaude APIの使い方をステップごとに解説します。

### Anthropicアカウント作成とAPIキー取得

以下の3ステップでAPIキーを取得できます。

1. [console.anthropic.com](https://console.anthropic.com)にアクセスし、アカウントを作成します
2. ダッシュボードの「API Keys」メニューを開きます
3. 「Create Key」をクリックしてAPIキーを生成します（`sk-ant-`で始まる文字列）

新規登録時に**5ドル分の無料クレジット**が付与されます（2026年2月時点）。まずは無料枠で試せるので、気軽に始められます。

### Python環境のセットアップ

必要なライブラリをインストールします。

```bash
pip install anthropic python-dotenv
```

プロジェクトのルートディレクトリに`.env`ファイルを作成し、APIキーを記載します。

```text
ANTHROPIC_API_KEY=sk-ant-your-api-key-here
```

**重要**: `.gitignore`に`.env`を追加して、APIキーがGitリポジトリにコミットされないようにしてください。

```text
# .gitignore
.env
```

Anthropic公式SDKは、環境変数`ANTHROPIC_API_KEY`を**自動認識**します。環境変数をセットしておけば、コード内で`anthropic.Anthropic()`と引数なしで初期化するだけでAPIキーが読み込まれます。

### モデル一覧と料金

Claude APIでは用途に応じてモデルを選べます。

| モデル | モデルID | 入力料金(/100万トークン) | 出力料金(/100万トークン) | 推奨用途 |
|--------|---------|---------|---------|---------|
| Haiku 4.5 | claude-haiku-4-5-20251001 | $1 | $5 | 大量処理・分類・チャット |
| Sonnet 4.5 | claude-sonnet-4-5-20250929 | $3 | $15 | 汎用・コード生成・要約 |
| Opus 4.6 | claude-opus-4-6 | $5 | $25 | 高精度な分析・複雑推論 |

※2026年2月時点の料金です。最新情報は[Anthropic公式料金ページ](https://www.anthropic.com/pricing)をご確認ください。

### 準備物チェックリスト

| 準備物 | 状態 | 備考 |
|--------|------|------|
| Anthropicアカウント | 作成済み | [console.anthropic.com](https://console.anthropic.com) |
| APIキー | 取得済み | `sk-ant-` で始まる文字列 |
| Python 3.8以上 | インストール済み | `python --version` で確認 |
| anthropicライブラリ | インストール済み | `pip install anthropic` |
| .envファイル | 作成済み | ANTHROPIC_API_KEYを記載 |
| .gitignore | 更新済み | `.env` を追加 |

## 実装手順

実装手順とは、環境構築が完了した状態から、実際にClaude APIを呼び出してメール分類スクリプトを完成させるまでの一連の作業のことです。

### ステップ1: 基本的なテキスト生成

まずは`messages.create()`の最小構成でClaude APIを呼び出してみます。

```python
import anthropic
from dotenv import load_dotenv

load_dotenv()  # .envファイルから環境変数を読み込み

client = anthropic.Anthropic()  # ANTHROPIC_API_KEY環境変数を自動認識

message = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    max_tokens=1024,
    system="あなたは中小企業の業務アシスタントです。簡潔に回答してください。",
    messages=[
        {"role": "user", "content": "この問い合わせメールを分類してください: 御社の製品Aについて、50個の見積もりをお願いしたいのですが、納期はいつ頃になりますか？"}
    ]
)

print(message.content[0].text)
```

**このコードのポイント**:

- `load_dotenv()`で`.env`ファイルの環境変数を読み込みます
- `anthropic.Anthropic()`は引数なしで初期化するだけで、環境変数`ANTHROPIC_API_KEY`を自動認識します
- `system`パラメータで、AIの役割や回答ルールを事前に指示できます
- `model`にはモデルIDを指定します。コストを抑えたい場合は`claude-haiku-4-5-20251001`に変更してください

### ステップ2: 業務自動化の実装例（問い合わせ分類）

本記事のメインとなる、問い合わせメールを自動分類するスクリプトです。
systemプロンプトで分類ルールを定義し、JSON形式で結果を返すように実装します。

```python
import anthropic
import json
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic()

def classify_inquiry(email_body: str) -> dict:
    """問い合わせメールを分類・要約する"""
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=512,
        system=(
            "あなたは中小企業の問い合わせ対応AIです。"
            "メール本文を分析し、以下のJSON形式のみで返してください：\n"
            '{"category": "見積依頼|製品問い合わせ|クレーム|その他",'
            ' "summary": "50文字以内の要約",'
            ' "urgency": "高|中|低",'
            ' "suggested_action": "推奨対応"}'
        ),
        messages=[
            {"role": "user", "content": email_body}
        ]
    )
    return json.loads(message.content[0].text)

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

**実行結果の例**:

```json
{
  "category": "見積依頼",
  "summary": "業務システムの正式見積もり依頼。納期は来月末希望。",
  "urgency": "中",
  "suggested_action": "見積書を作成し、納期の可否を確認して回答する"
}
```

**このコードのポイント**:

- 大量の問い合わせを処理するため、コストの低い**Haiku 4.5**を使用しています
- systemプロンプトでJSON形式の出力ルールを厳密に定義しています
- `json.loads()`でレスポンスを辞書型に変換し、後続の処理（メール振り分け、通知など）に活用できます

他のAI APIとの違いが気になる方は、[OpenAI API入門](/articles/ai-api/openai-api-intro)や[Gemini API入門](/articles/ai-api/gemini-api-intro)もあわせてご覧ください。

### ステップ3: ストリーミングレスポンス（長文マニュアル要約用）

長い文書を要約する場合、ストリーミングを使うとリアルタイムに結果を表示できます。
社内マニュアルの要約など、出力が長くなるタスクに適しています。

```python
import anthropic
from dotenv import load_dotenv

load_dotenv()

client = anthropic.Anthropic()

manual_text = """
（ここに社内マニュアルの本文を貼り付けてください。
例: 就業規則、業務手順書、製品マニュアルなど）
"""

with client.messages.stream(
    model="claude-sonnet-4-5-20250929",
    max_tokens=2048,
    system="あなたは社内マニュアルの要約担当です。要点を箇条書きで抽出してください。",
    messages=[{"role": "user", "content": manual_text}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

**このコードのポイント**:

- `messages.stream()`を使うと、レスポンスが生成されるたびにリアルタイムで出力されます
- ユーザーが待ち時間を感じにくくなるため、長文の要約やレポート生成に適しています
- `max_tokens=2048`で十分な長さの要約を生成できます

## 動作確認・トラブルシューティング

トラブルシューティングとは、コードを実行した際に発生するエラーや問題を特定し、解決する作業のことです。

### テスト手順

1. ターミナル（コマンドプロンプト）を開きます
2. プロジェクトのディレクトリに移動します
3. `python ファイル名.py`で実行します
4. JSON形式の分類結果が表示されれば成功です

### よくあるエラーと解決策

| エラー | 原因 | 解決策 |
|--------|------|--------|
| `AuthenticationError` | APIキーが未設定または無効 | `.env`に正しいAPIキーが記載されているか確認。`load_dotenv()`の呼び出しを確認 |
| `RateLimitError (429)` | リクエスト頻度の超過 | `time.sleep(1)`でリトライ間隔を設定。Tier昇格を検討 |
| `BadRequestError (400)` | max_tokens超過や不正なパラメータ | モデルのコンテキスト長を確認し、パラメータを見直す |
| `ModuleNotFoundError` | anthropicライブラリ未インストール | `pip install anthropic python-dotenv`を実行 |
| `APIConnectionError` | ネットワーク接続の問題 | インターネット接続を確認。企業プロキシがある場合は設定を確認 |
| `json.JSONDecodeError` | AIの出力がJSON形式でない | systemプロンプトでJSON出力を再度明示。リトライ処理を追加 |

### コスト試算（中小企業向け月額目安）

| 業務 | モデル | 月間件数 | 月額目安 |
|------|--------|---------|---------|
| 問い合わせ分類（短文） | Haiku 4.5 | 500件 | 約100円 |
| 議事録要約（長文） | Sonnet 4.5 | 50件 | 約200円 |
| マニュアル検索Bot | Sonnet 4.5 | 200件 | 約500円 |

※2026年2月時点の概算です。実際の料金はトークン量により変動します。
最新料金は[Anthropic公式料金ページ](https://www.anthropic.com/pricing)をご確認ください。

## 応用・カスタマイズ例

応用・カスタマイズとは、本記事で作成した基本のスクリプトをベースに、より高度な業務自動化へ発展させることです。

### Claude独自機能の紹介

Claude APIには、他のAI APIにはない独自機能があります。

- **Extended Thinking**: 複雑な推論タスクで思考プロセスを拡張し、精度を高める機能です。契約書のリスク分析や複雑な計算を伴う業務に活用できます
- **Vision（画像入力）**: 画像をAPIに直接送信して解析できます。名刺や領収書の画像からテキストを抽出する業務に適しています
- **PDF読み取り**: PDFファイルを直接読み込んで内容を分析できます。社内マニュアルや契約書の要約に便利です
- **Tool Use**: 外部APIやデータベースと連携し、AIが必要な情報を取得しながら回答できます。在庫データを参照した顧客対応などに活用できます

### 中小企業での活用アイデア

本記事のメール分類スクリプトを応用して、さまざまな業務を自動化できます。

- **日報の自動要約**: 社員が入力した日報をClaude APIで要約し、経営者向けのダイジェストを自動生成
- **顧客対応テンプレート生成**: 問い合わせ分類の結果に応じて、返信テンプレートを自動作成
- **GASとの連携**: Google Apps Scriptと組み合わせて、Gmailの受信メールを自動分類。詳しくは[GASでできること完全ガイド](/articles/gas/gas-basics)をご覧ください
- **複数AI APIの使い分け**: タスクに応じてClaude API・OpenAI API・Gemini APIを使い分ける戦略も有効です

AI開発ツールの選び方については[AI開発ツール比較](/articles/reviews/ai-dev-tools-comparison)で詳しくまとめています。AIを業務に組み込む全体像を知りたい方は、[中小企業向けAI導入5ステップ](/articles/frameworks/ai-introduction-5steps)をぜひご覧ください。
