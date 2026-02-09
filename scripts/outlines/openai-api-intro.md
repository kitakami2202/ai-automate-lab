# 記事ブリーフ: openai-api-intro（リライト）

## 基本情報

| 項目 | 内容 |
|------|------|
| slug | openai-api-intro |
| primary_kw | OpenAI API 入門 |
| secondary_kw | ChatGPT API, GPT API 使い方 |
| Layer | execution（Layer 2） |
| 記事タイプ | howto |
| クラスター | ai-api |
| 想定文字数 | 3,000〜5,000文字 |
| ターゲット読者 | 中小企業の事務担当者・エンジニア初学者で、OpenAI APIを業務に導入したい人 |
| difficulty | beginner |
| timeToRead | 15 |
| totalTime | PT60M |
| ピラー記事 | ai-apiクラスターにピラー未作成のため、frameworks/ai-introduction-5steps を冒頭導線とする |

## 現状記事の課題

| 課題 | 詳細 |
|------|------|
| 文字数不足 | 約400文字。目標3,000〜5,000文字に対して10分の1以下 |
| APIキーがハードコード | `api_key="your-api-key"` が直書きされている。セキュリティ上の悪例 |
| 環境変数管理なし | os.environ / python-dotenv を使ったAPIキー管理の解説がゼロ |
| 表が0個 | 記事品質ルール違反（最低1個必須） |
| 内部リンク0本 | 本文中にリンクが一切ない。Layer 1への導線もなし |
| 定義文不足 | H2-1のみ定義文あり。他のH2セクション冒頭に定義文なし |
| description不足 | 約85文字。120-160文字の範囲外 |
| FAQ回答が薄い | 3問のみ、各回答が1-2文。5問に増やし回答も充実させる必要あり |
| 副KW未使用 | 「ChatGPT API」「GPT API 使い方」が本文に登場しない |
| 料金情報に時点表記なし | 料金はFAQで触れているが「2026年2月時点」等の時点表記がない |
| Function Callingが実務的でない | 天気取得の汎用例のみ。中小企業の業務自動化ユースケースがない |
| Responses API未対応 | 2025年3月に発表されたResponses APIへの言及なし |
| schema.totalTime不適切 | PT30Mだが、アカウント作成〜動作確認まで含めるとPT60Mが妥当 |

## 競合分析サマリ

### 上位5記事

| # | 記事 | 深さ | 鮮度 | 独自性 | 弱点 |
|---|------|------|------|--------|------|
| 1 | [PythonでChatGPT APIを使う方法入門（完全ガイド）](https://programming-mondai.com/python-chatgpt-api-beginner/) | コード量多。環境構築〜エラー対策まで網羅。Chat Completions / Responses API両対応 | 2025/11 | Python初心者向けの丁寧な環境構築解説。エラー対策まで完備 | 業務活用例が薄い。中小企業視点なし。GAS連携なし |
| 2 | [ChatGPT APIとは？使い方や料金、活用事例を解説（GPT-5/Responses API対応）](https://www.ai-souken.com/article/how-to-get-chatgpt-api-key) | コード量中。概要〜料金〜活用事例まで広範囲。GPT-5対応 | 2025/12 | 活用事例が豊富。料金体系の解説が詳しい。最新モデル対応 | コードがコピペで動く形式でない。環境変数管理の解説が薄い |
| 3 | [OpenAI APIを使ってPythonでChatGPT遊びするための最初の三歩くらい](https://dev.classmethod.jp/articles/openai-api-chat-python-first-step/) | コード量中。初心者向けのステップバイステップ形式 | 2024/12 | DevelopersIO執筆、技術的信頼性が高い。つまずきポイントの解説 | やや古い（Responses API未対応）。業務活用例なし。料金情報なし |
| 4 | [ChatGPT APIの使い方【Python編】](https://zenn.dev/umi_mori/books/chatbot-chatgpt/viewer/openai_chatgpt_api_python) | コード量多。書籍形式で体系的。チャットボット構築まで解説 | 2024/09 | 書籍として体系的な構成。会話履歴の管理方法が詳しい | 鮮度が低い（openai SDK 1.0以降だがResponses API未対応）。業務自動化観点なし |
| 5 | [ChatGPTでのAPIの使い方！料金設定やコード生成について詳しく解説](https://romptn.com/article/40768) | コード量中。料金比較表が充実。複数モデルの使い分け解説 | 2025/08 | 料金比較表が視覚的にわかりやすい。GPT-4o / GPT-4o-miniの使い分け | 環境変数管理なし。Function Calling/Responses APIなし。業務活用例なし |

### 必須トピック（3記事以上がカバー）

- OpenAI APIの基本概念（APIとは何か、ChatGPTとAPIの違い）
- OpenAIアカウント作成・APIキー取得手順
- Python環境構築（pip install openai）
- Chat Completions APIの基本コード（messages形式）
- モデル一覧と選び方（gpt-4o, gpt-4o-mini等）
- 料金体系（トークン課金の仕組み）
- エラーハンドリング（認証エラー、レート制限等）

### 差別化チャンス（1-2記事のみカバー）

- Responses API（新API）の実装コード（1記事のみ、2025/11）
- 環境変数（os.environ / python-dotenv）によるAPIキー管理（1記事のみ）
- ストリーミング応答の実装（2記事のみ）
- Function Calling / ツール連携の実装コード（1記事のみ）
- system promptの設計パターン（1記事のみ）

### 独自トピック候補（どの記事もカバーなし）

- 中小企業の業務自動化ユースケース別コード（問い合わせ自動応答、議事録要約）
- GAS（UrlFetchApp）からOpenAI APIを呼ぶ連携コード
- Chat Completions API と Responses API の使い分け判断表
- APIキーの権限管理（プロジェクトAPIキー、チーム運用）
- コスト試算表（「月1,000件の問い合わせ対応でいくらかかるか」）
- Claude API / Gemini API との比較表（同クラスター記事への導線）

## 差別化ポイント

| パターン | 採用 | 根拠 |
|---------|------|------|
| 業務自動化ユースケース差別化 | **採用** | 競合は全て「Pythonの良いところを教えて」等の汎用プロンプト例。中小企業の問い合わせ対応・議事録要約等の実務コードを掲載する記事がゼロ |
| GAS連携差別化 | **採用** | GAS（UrlFetchApp）からOpenAI APIを呼ぶコードを掲載する入門記事がない。サイト内のGASクラスターとの横断リンクも強化できる |
| Responses API + Chat Completions API 併記差別化 | **採用** | 両APIの使い分け判断表を設けた記事がない。2026年時点のベストプラクティスとして価値が高い |
| コスト試算差別化 | **採用** | 「月○件でいくら」の具体的コスト試算表を掲載する記事がない。中小企業の導入判断に直結する情報 |
| 環境変数管理の丁寧な解説 | **採用** | APIキーをハードコードしている競合記事が多い。セキュリティベストプラクティスを初心者向けに解説する差別化になる |

## 見出し構成案

### H2-1: この記事で作るもの（完成イメージ）

**目的**: 読者に完成物を先に見せ、モチベーションを高める

- 完成イメージ: Pythonから「問い合わせメール自動分類」を実行するスクリプト
- 動作の流れを図示（テキスト入力 → OpenAI API → 分類結果出力）
- 前提条件表（必要なアカウント・知識・所要時間）

| 項目 | 内容 |
|------|------|
| 必要なアカウント | OpenAIアカウント（無料登録+クレジットカード） |
| 必要な知識 | Pythonの基本文法（変数・関数がわかればOK） |
| 所要時間 | 約60分（アカウント作成〜動作確認まで） |
| 完成物 | メール文面を分類・要約するPythonスクリプト |
| 費用目安 | 月100件の処理で約10〜30円（gpt-4o-mini使用時） |

**冒頭導線**:
> この記事はAI APIの実装手順です。「そもそもAIを業務にどう導入するか」から知りたい方は、[中小企業向けAI導入5ステップ](/articles/frameworks/ai-introduction-5steps)をご覧ください。

**副KW配置**: 「ChatGPT API（OpenAI API）を使えば」「GPT APIの使い方を、業務自動化の観点から解説」

### H2-2: 準備・環境構築

**定義文**: 環境構築とは、OpenAI APIをプログラムから呼び出すために必要なアカウント・ツール・設定を整える作業です。

- H3: OpenAIアカウント作成とAPIキー取得
  - アカウント登録手順（ステップ形式、3ステップ）
  - プロジェクトAPIキーの発行方法
  - 支払い設定（使用量上限の設定を推奨）

- H3: Python環境のセットアップ
  - `pip install openai python-dotenv` のインストール
  - `.env` ファイルの作成と `OPENAI_API_KEY` の設定
  - **APIキーの環境変数管理コード（os.environ）** ← 差別化ポイント
  - `.gitignore` に `.env` を追加する注意喚起

```python
# .envファイル
OPENAI_API_KEY=sk-proj-xxxxx

# Pythonコード
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
```

- 準備物チェック表

| 項目 | 取得方法 | 備考 |
|------|---------|------|
| OpenAIアカウント | [platform.openai.com](https://platform.openai.com/) で登録 | Googleアカウントで可 |
| APIキー | ダッシュボード → API keys → Create new secret key | プロジェクト単位で発行推奨 |
| クレジットカード | Settings → Billing | 使用量上限（月$5等）の設定を推奨 |
| Python 3.9以上 | [python.org](https://python.org/) | 3.9〜3.12推奨 |
| openai ライブラリ | `pip install openai` | バージョン1.0以上必須 |

### H2-3: 実装手順

**定義文**: Chat Completions APIとは、メッセージのやり取り（チャット形式）でAIの応答を得るOpenAIの主要APIです。

- H3: ステップ1 - 基本のChat Completions API（Hello World）
  - 最小限のコード（system + user メッセージ）
  - response構造の解説
  - モデル選択ガイド表

| モデル | 特徴 | 入力料金（/1Mトークン） | 出力料金（/1Mトークン） | おすすめ用途 |
|--------|------|----------------------|----------------------|------------|
| gpt-4o-mini | 高速・低コスト | $0.15 | $0.60 | 分類・要約・定型処理（コスト重視） |
| gpt-4o | 高性能・バランス | $2.50 | $10.00 | 複雑な判断・文章生成（品質重視） |
| o3 | 推論特化 | $2.00 | $8.00 | 複雑な分析・多段階推論 |
| o4-mini | 推論（軽量） | $1.10 | $4.40 | 推論が必要だがコストを抑えたい場合 |

※料金は2026年2月時点。最新は[OpenAI公式料金ページ](https://openai.com/api/pricing/)を参照

- H3: ステップ2 - 業務自動化の実践コード（問い合わせメール分類）
  - system promptで「メール分類AI」を定義
  - 入力: メール本文 → 出力: カテゴリ+要約+緊急度
  - JSON形式での出力指定（response_format）
  - **中小企業の業務自動化ユースケース** ← 最大の差別化ポイント

```python
import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

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

- H3: ステップ3 - Responses API（新API）での実装
  - Chat Completions APIとの違いを表で整理
  - 同じ処理をResponses APIで書き直すコード
  - どちらを使うべきかの判断基準

| 観点 | Chat Completions API | Responses API |
|------|---------------------|---------------|
| 安定性 | 安定（長期サポート） | 新しい（2025年3月〜） |
| 会話管理 | 自分でmessages配列を管理 | サーバー側で自動管理可能 |
| ツール連携 | Function Calling | 組み込みツール（Web検索、ファイル検索等） |
| コスト | 標準 | キャッシュ効率が高く低コスト |
| 推奨ケース | シンプルな単発処理、既存システムの保守 | 新規プロジェクト、エージェント構築 |

```python
# Responses APIでの実装例
response = client.responses.create(
    model="gpt-4o-mini",
    instructions=(
        "あなたは中小企業の問い合わせ対応AIです。"
        "メール本文を分析し、カテゴリ・要約・緊急度を返してください。"
    ),
    input=sample_email,
)
print(response.output_text)
```

### H2-4: 動作確認・トラブルシューティング

**定義文**: トラブルシューティングとは、APIの実行中に発生するエラーの原因を特定し、解決する手順です。

- 動作確認の手順（ターミナルでの実行方法）
- よくあるエラーと対処法の表

| エラー | 原因 | 解決策 |
|--------|------|--------|
| `AuthenticationError` | APIキーが未設定 or 無効 | `.env`の`OPENAI_API_KEY`を確認。ダッシュボードで再発行 |
| `RateLimitError` | リクエスト頻度が上限超過 | `time.sleep(1)`で間隔を空ける。Tier昇格を待つ |
| `InsufficientQuotaError` | クレジット残高不足 | Billing画面でクレジットを追加 |
| `BadRequestError` (model not found) | モデル名のtypo or 非対応モデル | 公式ドキュメントでモデル名を確認 |
| `JSONDecodeError` | AI応答がJSON形式でない | `response_format={"type": "json_object"}`を指定。temperatureを下げる |
| `timeout` | ネットワーク or 長文処理 | `timeout`パラメータを延長。入力テキストを短くする |

- コスト管理のTips
  - Usage画面の見方
  - 月額上限の設定方法
  - 「月1,000件の問い合わせ分類でいくらかかるか」のコスト試算例

| 処理内容 | モデル | 月間件数 | 概算コスト（月額） |
|---------|--------|---------|-----------------|
| メール分類（短文） | gpt-4o-mini | 1,000件 | 約$0.10（約15円） |
| 議事録要約（長文） | gpt-4o-mini | 100件 | 約$0.50（約75円） |
| 複雑な文書分析 | gpt-4o | 100件 | 約$5.00（約750円） |

※1件あたり入力500トークン・出力200トークンで試算。2026年2月時点の料金。最新は[公式料金ページ](https://openai.com/api/pricing/)参照

### H2-5: 応用・カスタマイズ例

**定義文**: OpenAI APIは単体のテキスト処理だけでなく、他のツールやサービスと組み合わせることで業務全体の自動化が実現できます。

- H3: 応用例1 - 議事録の自動要約スクリプト
  - テキストファイルを読み込み → 要約・アクションアイテム抽出
  - 簡易コード例

- H3: 応用例2 - GAS（Google Apps Script）からOpenAI APIを呼ぶ
  - UrlFetchAppを使った連携コードのスニペット
  - スプレッドシートの問い合わせ一覧を一括分類する応用イメージ
  - 詳しくは[GASでできること完全ガイド](/articles/gas/gas-basics)で解説

```javascript
// GAS（Google Apps Script）からOpenAI APIを呼ぶ例
function callOpenAI(prompt) {
  const apiKey = PropertiesService.getScriptProperties().getProperty("OPENAI_API_KEY");
  const url = "https://api.openai.com/v1/chat/completions";

  const payload = {
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "あなたは業務アシスタントです。" },
      { role: "user", content: prompt }
    ],
    temperature: 0.3,
  };

  const options = {
    method: "post",
    headers: {
      "Authorization": "Bearer " + apiKey,
      "Content-Type": "application/json",
    },
    payload: JSON.stringify(payload),
  };

  const response = UrlFetchApp.fetch(url, options);
  const json = JSON.parse(response.getContentText());
  return json.choices[0].message.content;
}
```

- H3: 他のAI APIとの比較
  - Claude API / Gemini API との簡易比較表
  - 用途に応じた使い分けの指針
  - 詳しくは各記事へリンク

| API | 特徴 | おすすめ用途 | 記事リンク |
|-----|------|------------|-----------|
| OpenAI API | モデル種類が豊富、エコシステムが充実 | 汎用テキスト処理・分類 | 本記事 |
| Claude API | 長文処理に強い、指示追従性が高い | 長文要約・文書分析 | [Claude API入門](/articles/ai-api/claude-api-intro) |
| Gemini API | Google連携、無料枠が大きい | Googleサービス連携 | [Gemini API入門](/articles/ai-api/gemini-api-intro) |

## FAQ案（5問）

| # | 質問 | 回答の方向性 |
|---|------|------------|
| 1 | OpenAI APIの料金体系はどうなっていますか？ | 従量課金制（トークン単位）。gpt-4o-miniは入力$0.15/1Mトークン・出力$0.60/1Mトークンで、月1,000件のメール分類なら約15円。使用量上限の設定方法も案内。料金は2026年2月時点、公式ページへリンク |
| 2 | OpenAI APIとChatGPTの違いは何ですか？ | ChatGPTはブラウザで使うチャットサービス。OpenAI APIはプログラムからAIを呼び出すインターフェース。APIを使えば自社システムにAI機能を組み込める。業務自動化にはAPIが必須 |
| 3 | APIキーが漏洩した場合どうすればよいですか？ | 即座にダッシュボードからキーを無効化し、新しいキーを発行する。環境変数で管理し、ソースコードにハードコードしない。.gitignoreに.envを追加する。プロジェクト単位のキー発行で影響範囲を限定する |
| 4 | Chat Completions APIとResponses APIのどちらを使うべきですか？ | 2026年2月時点では、新規プロジェクトにはResponses APIを推奨。組み込みツール（Web検索等）が使え、会話管理も簡易。既存システムの保守や単発のテキスト処理にはChat Completions APIが安定 |
| 5 | OpenAI APIをGoogle Apps Script（GAS）から使えますか？ | UrlFetchAppでHTTPリクエストを送信すれば利用可能。APIキーはスクリプトプロパティで安全に管理する。スプレッドシートとの連携で一括処理も実現できる。詳しくはGAS記事を参照 |

## 内部リンク候補

| リンク先 | 種別 | 配置場所 | アンカーテキスト例 |
|---------|------|---------|-----------------|
| frameworks/ai-introduction-5steps | 別カテゴリ（Layer 1導線） | H2-1 冒頭 | 「中小企業向けAI導入5ステップ」 |
| ai-api/claude-api-intro | 同カテゴリ | H2-5 比較表 | 「Claude API入門」 |
| ai-api/gemini-api-intro | 同カテゴリ | H2-5 比較表 | 「Gemini API入門」 |
| gas/gas-basics | 別カテゴリ | H2-5 GAS連携 | 「GASでできること完全ガイド」 |
| reviews/ai-dev-tools-comparison | 別カテゴリ | H2-5 or まとめ | 「AI開発ツール比較」 |

## ライターへの指示

1. **APIキーは絶対にハードコードしない**: 全コード例で `os.environ.get("OPENAI_API_KEY")` または `python-dotenv` を使用すること。現状記事の `api_key="your-api-key"` は最大の課題
2. **業務自動化ユースケースを核にする**: 「Pythonの良いところを教えて」等の汎用例ではなく、「問い合わせメール分類」「議事録要約」等の中小企業実務コードを主軸にする。これが最大の差別化
3. **Chat Completions API と Responses API を両方掲載する**: 2026年2月時点ではChat Completionsが主流だが、Responses APIへの移行が進行中。判断表を設けて読者が選べるようにする
4. **コスト試算表を必ず含める**: 中小企業の導入判断に直結する情報。「月○件でいくら」の具体的な数字を示す。料金には必ず「2026年2月時点」と明記し、公式料金ページへリンクする
5. **GAS連携コードを含める**: UrlFetchAppからOpenAI APIを呼ぶスニペットを掲載し、GASクラスターへの横断リンクを設ける。APIキーはスクリプトプロパティで管理
6. **description は120-160文字にする**: 例: 「OpenAI APIの使い方を初心者向けに解説。Python環境構築からChatGPT API（Chat Completions / Responses API）の実装、業務自動化の実践コードまで、コピペで動くサンプル付きで紹介します。」（約95文字 → 120文字以上に調整）
7. **FAQ を5問に増やし回答を充実させる**: 各回答は3-4文で具体的な情報を含める。料金FAQ では具体的な金額を提示する
8. **副KW（ChatGPT API, GPT API 使い方）を本文に自然に配置する**: H2-1の冒頭やH2-3のステップ見出し付近に配置
9. **表を最低3個含める**: モデル比較表、エラー対処表、コスト試算表は必須。API比較表（Chat Completions vs Responses）も含める
10. **relatedArticles を更新する**: `["ai-api/claude-api-intro", "ai-api/gemini-api-intro", "reviews/ai-dev-tools-comparison"]` を維持しつつ、コンテンツ内でgas/gas-basicsやframeworks/ai-introduction-5stepsへもリンクする
