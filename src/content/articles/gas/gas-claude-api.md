---
title: "GAS × Claude API連携｜AIで入力データを自動分類"
description: "GAS（Google Apps Script）からClaude APIを呼び出し、スプレッドシートの入力データをAIで自動分類する方法を解説。問い合わせ内容の振り分け・議事録要約・感情分析まで、コピペで動くコード付きで約40分で構築できます。"
category: "gas"
tags: ["GAS", "Claude API", "AI連携", "自動分類", "スプレッドシート"]
publishedAt: 2026-02-12
updatedAt: 2026-02-13
author: "れん"
difficulty: "beginner"
timeToRead: 12
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "月約100円〜"
  totalTime: "PT40M"
faq:
  - question: "GASからClaude APIを無料で使えますか？"
    answer: "GAS自体は無料ですが、Claude APIは従量課金制です。新規登録で5ドル分の無料クレジットが付与されるため、月500件程度の分類処理なら無料枠内で試せます（2026年2月時点）。"
  - question: "Claude APIの代わりにChatGPT APIも使えますか？"
    answer: "はい、UrlFetchAppで呼び出す仕組みは同じです。エンドポイントURLとリクエスト形式を変更すれば対応できます。ChatGPT APIとの連携は「GAS × ChatGPT API連携」記事で解説しています。"
  - question: "APIキーをGASで安全に管理する方法は？"
    answer: "スクリプトプロパティに保管するのが基本です。スクリプトエディタの「プロジェクトの設定」→「スクリプトプロパティ」にキー名ANTHROPIC_API_KEY、値にAPIキーを設定します。コード内にハードコードしないでください。"
  - question: "1回のAPI呼び出しにかかる時間は？"
    answer: "短文の分類処理なら通常1〜3秒程度です。GASの実行時間制限（無料アカウント6分）があるため、大量処理の場合はバッチ処理とトリガーの組み合わせが有効です。"
relatedArticles:
  - "gas/gas-basics"
  - "gas/gas-spreadsheet-automation"
  - "ai-api/claude-api-intro"
draft: false
---

> この記事は[GASでできること完全ガイド](/articles/gas/gas-basics)の実装編です。
> Claude APIの基礎から知りたい方は[Claude API入門](/articles/ai-api/claude-api-intro)を先にご覧ください。

この記事では、GASからClaude APIを呼び出してスプレッドシートの入力データをAIで自動分類する仕組みを約40分で構築する手順を解説します。
コードをコピペするだけで動くように、全コードを掲載しています。

### この記事の前提

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Google、Anthropic（[console.anthropic.com](https://console.anthropic.com)） |
| 必要な知識 | [GAS入門ガイド](/articles/gas/gas-basics)を読了済み |
| 所要時間 | 約40分 |
| 費用 | GAS: 0円 / Claude API: 従量課金（無料クレジット5ドル付与） |
| 完成物 | スプレッドシートの問い合わせデータをAIで自動分類するスクリプト |

## この記事で作るもの

GAS × Claude API連携とは、Google Apps ScriptのUrlFetchAppを使ってClaude API（Anthropic API）にHTTPリクエスト（Webサーバーへの通信要求）を送り、AIの分析結果をスプレッドシートに書き戻す仕組みです。

| 機能 | 内容 | 業務活用例 |
|------|------|---------|
| テキスト分類 | 入力テキストをカテゴリに自動振り分け | 問い合わせの種別判定 |
| 要約生成 | 長文を指定文字数に要約 | 議事録・レポートの要約 |
| 感情分析 | テキストのポジネガを判定 | 顧客アンケートの傾向把握 |

## 準備・APIキーの設定

準備とは、Claude APIを呼び出すためのAPIキーを取得し、GASのスクリプトプロパティに安全に保管する作業のことです。

### APIキーの取得

1. [console.anthropic.com](https://console.anthropic.com) でアカウントを作成します（新規登録で5ドル分の無料クレジット付与）
2. 「API Keys」→「Create Key」でAPIキーを発行します（`sk-ant-` で始まる文字列）

### GASへのAPIキー設定

1. スプレッドシートの「拡張機能」→「Apps Script」でエディタを開きます
2. 「プロジェクトの設定」→「スクリプトプロパティ」を開きます
3. プロパティ名: `ANTHROPIC_API_KEY`、値: 取得したAPIキーを設定します

**重要:** APIキーはコードにハードコードせず、必ずスクリプトプロパティに保管してください。APIキーの管理方法の詳細は[APIキー管理ガイド](/articles/ai-api/api-key-management)をご覧ください。

## 実装手順

実装手順とは、GASからAnthropic APIを実際に呼び出してデータ分類を行うコードを構築する一連の流れです。基本の呼び出し関数、スプレッドシート連携、定期実行の3ステップで進めます。

### ステップ1: Claude APIの基本呼び出し

GASからClaude APIにリクエストを送る基本関数です。

```javascript
/**
 * Claude APIにリクエストを送信する共通関数
 * @param {string} systemPrompt - AIへの役割指示
 * @param {string} userMessage - 分析対象のテキスト
 * @return {string} AIの応答テキスト
 */
function callClaudeApi(systemPrompt, userMessage) {
  var apiKey = PropertiesService.getScriptProperties().getProperty("ANTHROPIC_API_KEY");
  var url = "https://api.anthropic.com/v1/messages";

  var payload = {
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: systemPrompt,
    messages: [
      { role: "user", content: userMessage }
    ]
  };

  var options = {
    method: "post",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(url, options);
  var result = JSON.parse(response.getContentText());

  if (result.error) {
    throw new Error("Claude API Error: " + result.error.message);
  }

  return result.content[0].text;
}
```

**このコードのポイント:**

- コストを抑えるため **Haiku 4.5**（最安モデル）を使用しています
- `muteHttpExceptions: true` でHTTPエラー時もレスポンスを取得し、エラー内容を確認できます
- `anthropic-version` ヘッダーでAPIバージョンを明示しています

### ステップ2: スプレッドシートデータの自動分類

スプレッドシートの問い合わせデータを1行ずつClaude APIで分類し、結果をJSON（データ交換用のテキスト形式）で受け取ってスプレッドシートに書き戻すスクリプトです。

```javascript
/**
 * スプレッドシートの問い合わせをAIで自動分類
 * A列: 問い合わせ内容、B列: 分類結果、C列: 要約、D列: 緊急度
 */
function classifyInquiries() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("問い合わせ");
  var data = sheet.getDataRange().getValues();

  var systemPrompt =
    "あなたは問い合わせ分類AIです。" +
    "入力テキストを分析し、以下のJSON形式のみで返してください：\n" +
    '{"category":"見積依頼|製品問い合わせ|クレーム|サポート|その他",' +
    '"summary":"30文字以内の要約",' +
    '"urgency":"高|中|低"}';

  var count = 0;

  for (var i = 1; i < data.length; i++) {
    var inquiry = data[i][0];
    var alreadyClassified = data[i][1];

    // 空行・分類済みはスキップ
    if (!inquiry || alreadyClassified) continue;

    try {
      var response = callClaudeApi(systemPrompt, inquiry);
      var result = JSON.parse(response);

      sheet.getRange(i + 1, 2).setValue(result.category);
      sheet.getRange(i + 1, 3).setValue(result.summary);
      sheet.getRange(i + 1, 4).setValue(result.urgency);
      count++;

      // API制限対策（1秒間隔）
      Utilities.sleep(1000);
    } catch (e) {
      sheet.getRange(i + 1, 2).setValue("エラー: " + e.message);
    }
  }

  SpreadsheetApp.getUi().alert(count + "件の問い合わせを分類しました。");
}
```

**スプレッドシートの構成:**

| A列（問い合わせ内容） | B列（分類） | C列（要約） | D列（緊急度） |
|---------------------|-----------|-----------|-------------|
| 製品Aの見積もりをお願いします... | 見積依頼 | 製品Aの見積依頼 | 中 |
| 納品された商品に不具合が... | クレーム | 商品不具合の報告 | 高 |

### ステップ3: トリガーで定期実行

新しい問い合わせが追加されるたびに自動分類するには、トリガーを設定します。

| 関数 | トリガー種類 | 設定 |
|------|------------|------|
| `classifyInquiries` | 時間主導型 → 分ベースのタイマー | 5分おき |

フォーム送信をトリガーにする場合は、[GAS × Googleフォーム連携](/articles/gas/gas-form-automation)の `onFormSubmit` トリガーと組み合わせてください。

## 動作確認・トラブルシューティング

動作確認とは、構築したGAS × Anthropic API連携スクリプトが正しく動作するかテストし、問題があれば原因を特定して解決する工程です。

| エラー | 原因 | 解決策 |
|--------|------|--------|
| `Claude API Error: invalid x-api-key` | APIキーの設定ミス | スクリプトプロパティの値を確認 |
| `Exception: Request failed` | ネットワークエラー | URLとヘッダーを確認。企業プロキシ環境では制限の可能性あり |
| `SyntaxError: Unexpected token` | AIの応答がJSON形式でない | systemプロンプトで「JSON形式のみで返す」を再度明示 |
| 6分のタイムアウト | 処理件数が多すぎる | 1回の実行を50件に制限し、トリガーで分割実行 |

### コスト目安

| 処理内容 | モデル | 月間件数 | 月額目安 |
|---------|--------|---------|---------|
| 問い合わせ分類（短文） | Haiku 4.5 | 500件 | 約100円 |
| 議事録要約（長文） | Sonnet 4.5 | 50件 | 約200円 |
| アンケート感情分析 | Haiku 4.5 | 1,000件 | 約200円 |

※2026年2月時点の概算です。最新料金は[Anthropic公式料金ページ](https://www.anthropic.com/pricing)をご確認ください。

## 応用・カスタマイズ例

応用・カスタマイズ例とは、基本の分類処理を習得した後に取り組める、GAS × Claude APIの発展的な活用パターンです。

- **フォーム連携** — [Googleフォーム連携](/articles/gas/gas-form-automation)と組み合わせ、回答受信→AI分類→担当者通知を一気通貫で実現
- **Slack通知** — 緊急度「高」の問い合わせだけ[Slack通知](/articles/gas/gas-slack-notification)で即時アラート
- **モデル切り替え** — 高精度が必要な場合は `claude-sonnet-4-5-20250929` に変更（コストは約3倍）

Claude APIの基礎知識は[Claude API入門](/articles/ai-api/claude-api-intro)、GASの全体像は[GASでできること完全ガイド](/articles/gas/gas-basics)をご覧ください。
