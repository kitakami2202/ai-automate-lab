---
title: "GAS × ChatGPT API連携｜問い合わせ自動回答"
description: "GAS（Google Apps Script）でChatGPT API（OpenAI API）を呼び出し、問い合わせへの回答ドラフトを自動生成する仕組みを構築する方法を解説。スプレッドシート連携・FAQ知識ベース活用まで、コピペで動くコード付きで約40分で完成します。"
category: "gas"
tags: ["GAS", "ChatGPT API", "OpenAI", "自動回答", "AI連携"]
publishedAt: 2026-02-12
updatedAt: 2026-02-12
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
  - question: "ChatGPT APIの無料枠はありますか？"
    answer: "OpenAI APIは新規登録時に5ドル分の無料クレジットが付与されます（2026年2月時点）。GPT-4o miniなら月1,000件程度の短文処理が無料枠内で可能です。最新情報はOpenAI公式サイトをご確認ください。"
  - question: "Claude APIとの違いは何ですか？"
    answer: "基本的な使い方はほぼ同じです。ChatGPT APIはFunction Calling機能が充実しており外部ツール連携に強みがあります。Claude APIは長文処理と指示追従性に優れています。GASからの呼び出し方法はどちらもUrlFetchAppで同様です。"
  - question: "APIキーの管理方法は？"
    answer: "GASのスクリプトプロパティに保管するのが基本です。「プロジェクトの設定」→「スクリプトプロパティ」にキー名OPENAI_API_KEY、値にAPIキーを設定します。コード内にハードコードしないでください。"
  - question: "回答の品質を上げるコツは？"
    answer: "systemプロンプトに具体的な役割・回答ルール・禁止事項を記載することが重要です。本記事では業務知識をプロンプトに組み込む方法を解説しています。プロンプト設計の詳細は「業務プロンプト設計入門」記事もご覧ください。"
relatedArticles:
  - "gas/gas-basics"
  - "gas/gas-claude-api"
  - "ai-api/openai-api-intro"
draft: false
---

> この記事は[GASでできること完全ガイド](/articles/gas/gas-basics)の実装編です。
> OpenAI APIの基礎から知りたい方は[OpenAI API入門](/articles/ai-api/openai-api-intro)を先にご覧ください。

この記事では、GASからChatGPT API（OpenAI API）を呼び出して問い合わせへの回答ドラフトを自動生成する仕組みを約40分で構築する手順を解説します。コードをコピペするだけで動くように、全コードを掲載しています。

### この記事の前提

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Google、OpenAI（[platform.openai.com](https://platform.openai.com)） |
| 必要な知識 | [GAS入門ガイド](/articles/gas/gas-basics)を読了済み |
| 所要時間 | 約40分 |
| 費用 | GAS: 0円 / ChatGPT API: 従量課金（無料クレジット5ドル付与） |
| 完成物 | 問い合わせ内容から回答ドラフトを自動生成するスクリプト |

## この記事で作るもの

GAS × ChatGPT API連携とは、Google Apps ScriptからOpenAI APIを呼び出し、AIが生成した回答をスプレッドシートに書き戻す仕組みです。GASのUrlFetchAppを使ってHTTPリクエストを送信します。

GASで問い合わせの自動回答を実現することで、カスタマーサポートの初動対応を大幅に効率化できます。

| 機能 | 内容 | 業務活用例 |
|------|------|---------|
| 回答ドラフト生成 | 問い合わせ内容から返信文を自動作成 | カスタマーサポート |
| FAQ自動応答 | よくある質問に対して定型回答を生成 | 社内ヘルプデスク |
| 文面校正 | 送信前のメール文面を自動チェック | 営業メールの品質向上 |

## 準備・APIキーの設定

準備とは、ChatGPT APIを呼び出すためのAPIキーを取得し、GASのスクリプトプロパティに安全に保管する作業のことです。

### APIキーの取得

1. [platform.openai.com](https://platform.openai.com) でアカウントを作成します
2. 「API Keys」→「Create new secret key」でAPIキーを発行します（`sk-` で始まる文字列）

※2026年2月時点で新規登録時に5ドル分の無料クレジットが付与されます。最新情報は[OpenAI公式](https://openai.com/pricing)をご確認ください。

### GASへのAPIキー設定

1. スプレッドシートの「拡張機能」→「Apps Script」でエディタを開きます
2. 「プロジェクトの設定」→「スクリプトプロパティ」を開きます
3. プロパティ名: `OPENAI_API_KEY`、値: 取得したAPIキーを設定します

**重要:** APIキーはコードにハードコードせず、必ずスクリプトプロパティに保管してください。APIキー管理のベストプラクティスは[APIキー管理・環境変数の使い方](/articles/ai-api/api-key-management)をご覧ください。

## 実装手順

※本記事ではChat Completions API（`/v1/chat/completions`）を使用しています。

### ステップ1: ChatGPT APIの基本呼び出し

GASからChatGPT APIにリクエストを送る基本関数です。

```javascript
/**
 * ChatGPT APIにリクエストを送信する共通関数
 * @param {string} systemPrompt - systemプロンプト（AIの役割や回答ルールを指定する指示文）
 * @param {string} userMessage - 処理対象のテキスト
 * @return {string} AIの応答テキスト
 */
function callChatGptApi(systemPrompt, userMessage) {
  var apiKey = PropertiesService.getScriptProperties().getProperty("OPENAI_API_KEY");
  var url = "https://api.openai.com/v1/chat/completions";

  var payload = {
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage }
    ],
    max_tokens: 1024,  // 最大トークン数
    temperature: 0.3   // 0に近いほど安定した回答
  };

  var options = {
    method: "post",
    headers: {
      "Authorization": "Bearer " + apiKey,
      "Content-Type": "application/json"
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(url, options);
  var result = JSON.parse(response.getContentText());

  if (result.error) {
    throw new Error("ChatGPT API Error: " + result.error.message);
  }

  return result.choices[0].message.content;
}
```

**このコードのポイント:**

- コストを抑えるため **GPT-4o mini**（最安モデル）を使用しています
- `temperature: 0.3` で回答のばらつきを抑え、業務利用に適した安定した出力にしています
- Claude APIとの違いはエンドポイントURL、認証ヘッダー、レスポンス構造の3点です

### ステップ2: 問い合わせ回答ドラフトの自動生成

スプレッドシートの問い合わせデータから回答ドラフトを自動生成するスクリプトです。

```javascript
/**
 * 問い合わせに対する回答ドラフトを自動生成
 * A列: 問い合わせ内容、B列: 回答ドラフト、C列: 処理日時
 */
function generateReplyDrafts() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("問い合わせ");
  var data = sheet.getDataRange().getValues();

  var systemPrompt =
    "あなたは中小企業のカスタマーサポート担当です。\n" +
    "以下のルールに従って回答ドラフトを作成してください：\n" +
    "- 敬語を使い、丁寧で簡潔な文面にする\n" +
    "- 1文目で結論を述べる\n" +
    "- 不明点がある場合は「確認の上、改めてご連絡いたします」と記載\n" +
    "- 200文字以内で回答する\n" +
    "- 署名は不要";

  var count = 0;

  for (var i = 1; i < data.length; i++) {
    var inquiry = data[i][0];
    var reply = data[i][1];

    // 空行・回答済みはスキップ
    if (!inquiry || reply) continue;

    try {
      var draft = callChatGptApi(systemPrompt, "以下の問い合わせに回答してください：\n\n" + inquiry);

      sheet.getRange(i + 1, 2).setValue(draft);
      sheet.getRange(i + 1, 3).setValue(new Date());
      count++;

      // API制限対策（1秒間隔）
      Utilities.sleep(1000);
    } catch (e) {
      sheet.getRange(i + 1, 2).setValue("エラー: " + e.message);
    }
  }

  SpreadsheetApp.getUi().alert(count + "件の回答ドラフトを生成しました。");
}
```

**スプレッドシートの構成:**

| A列（問い合わせ内容） | B列（回答ドラフト） | C列（処理日時） |
|---------------------|-------------------|--------------|
| 製品Aの納期を教えてください | 製品Aの納期についてお問い合わせいただき... | 2026/02/12 10:30 |

### ステップ3: 業務知識を組み込んだ高精度な回答

ステップ2では固定のsystemプロンプト（AIの役割や回答ルールを指定する指示文）で回答を生成しましたが、ステップ3ではFAQシートの内容を動的にプロンプトに組み込むことで、自社の業務知識に基づいた高精度な回答を実現します。

```javascript
/**
 * FAQデータを組み込んだ高精度な回答生成
 */
function generateSmartReply() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var faqSheet = ss.getSheetByName("FAQ");
  var inquirySheet = ss.getSheetByName("問い合わせ");

  // ステップ2との違い: FAQデータをsystemPromptに動的に組み込み
  var faqData = faqSheet.getDataRange().getValues();
  var faqText = "";
  for (var j = 1; j < faqData.length; j++) {
    faqText += "Q: " + faqData[j][0] + "\nA: " + faqData[j][1] + "\n\n";
  }

  var systemPrompt =
    "あなたは中小企業のカスタマーサポート担当です。\n" +
    "以下のFAQを参考に回答してください。FAQにない質問は" +
    "「確認の上、改めてご連絡いたします」と回答してください。\n\n" +
    "【FAQ一覧】\n" + faqText;

  var data = inquirySheet.getDataRange().getValues();
  var count = 0;

  for (var i = 1; i < data.length; i++) {
    var inquiry = data[i][0];
    var reply = data[i][1];

    if (!inquiry || reply) continue;

    try {
      var draft = callChatGptApi(systemPrompt, inquiry);
      inquirySheet.getRange(i + 1, 2).setValue(draft);
      inquirySheet.getRange(i + 1, 3).setValue(new Date());
      count++;
      Utilities.sleep(1000);
    } catch (e) {
      inquirySheet.getRange(i + 1, 2).setValue("エラー: " + e.message);
    }
  }

  SpreadsheetApp.getUi().alert(count + "件の回答ドラフトを生成しました。");
}
```

**このコードのポイント:**

- FAQシートの内容をsystemプロンプトに動的に組み込むことで、自社の業務知識に基づいた回答が生成されます
- FAQシートを更新するだけで回答品質が向上し、プログラムの修正は不要です

## 動作確認・トラブルシューティング

| エラー | 原因 | 解決策 |
|--------|------|--------|
| `ChatGPT API Error: Incorrect API key` | APIキーの設定ミス | スクリプトプロパティの値を確認 |
| `ChatGPT API Error: Rate limit reached` | リクエスト頻度の超過 | `Utilities.sleep(2000)` で間隔を広げる |
| 回答が的外れ | systemプロンプトの指示不足 | 回答ルールをより具体的に記載。FAQ連携（ステップ3）を導入 |
| 6分のタイムアウト | 処理件数が多すぎる | 1回の実行を50件に制限し、トリガーで分割実行（詳しくは[GAS入門ガイド](/articles/gas/gas-basics)参照） |

### コスト目安

| 処理内容 | モデル | 月間件数 | 月額目安 |
|---------|--------|---------|---------|
| 問い合わせ回答（短文） | GPT-4o mini | 500件 | 約50円 |
| メール文面生成（中文） | GPT-4o mini | 200件 | 約100円 |
| レポート要約（長文） | GPT-4o | 50件 | 約500円 |

※2026年2月時点の概算です。最新料金は[OpenAI公式料金ページ](https://openai.com/pricing)をご確認ください。

## 応用・カスタマイズ例

応用・カスタマイズ例とは、基本の回答ドラフト生成をベースに、他のGASスクリプトやAPIと組み合わせて業務フローを拡張するパターンです。

- **Claude APIとの使い分け** — 短文分類は[GAS × Claude API連携](/articles/gas/gas-claude-api)、回答生成はChatGPTと使い分けも効果的
- **Slack通知** — 回答ドラフト生成後に[GAS Slack通知](/articles/gas/gas-slack-notification)で担当者にレビュー依頼
- **メール自動送信** — ドラフトの確認後に[GAS メール自動化](/articles/gas/gas-mail-automation)で送信する一連の業務フロー
- **Googleフォーム連携** — [GAS フォーム自動化](/articles/gas/gas-form-automation)で受付フォームと自動回答を連携し、リアルタイム対応を実現
- **APIキーの安全な管理** — [APIキー管理・環境変数の使い方](/articles/ai-api/api-key-management)でセキュリティを強化

プロンプト設計のコツは[プロンプト設計 業務自動化](/articles/frameworks/prompt-engineering-business)、GASの全体像は[GASでできること完全ガイド](/articles/gas/gas-basics)をご覧ください。

## まとめ：次のステップ

この記事では、GASからChatGPT APIを呼び出して問い合わせへの回答ドラフトを自動生成する仕組みを構築しました。基本のcallChatGptApi関数で問い合わせ対応を効率化し、FAQ連携で自社の業務知識に基づいた高精度な回答を実現できます。

### 次に読むべき記事
- 長文処理や指示追従性を重視するなら[GAS × Claude API連携](/articles/gas/gas-claude-api)も試してみてください
- プロンプト設計の詳細は[プロンプト設計 業務自動化](/articles/frameworks/prompt-engineering-business)で解説しています
- Googleフォームと連携してリアルタイム自動回答を実現したい方は[GAS フォーム自動化](/articles/gas/gas-form-automation)をご覧ください

### 推奨する実践手順
1. まず基本のcallChatGptApi関数を動かし、ChatGPT APIの動作を確認する
2. 次にFAQ連携（ステップ3）を導入し、回答精度を上げる
3. トラブルシューティング表を参考に、エラー対応とコスト最適化を進める
