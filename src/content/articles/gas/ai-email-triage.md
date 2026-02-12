---
title: "AI × メール自動振り分け・下書き生成"
description: "GASとClaude APIでGmailの受信メールをAIで自動振り分けし、返信下書きを生成する方法をコード付きで解説。問い合わせメールのAI分類→ラベル付与→緊急通知→返信ドラフト自動生成までを一気通貫で自動化。1日30分のメール振り分け作業を削減でき、初心者でも約40分で導入できます。"
category: "gas"
tags: ["GAS", "AI", "メール", "自動振り分け", "下書き生成", "メール分類"]
publishedAt: 2026-02-12
updatedAt: 2026-02-12
author: "れん"
difficulty: "beginner"
timeToRead: 12
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "月約200円〜（2026年2月時点）"
  totalTime: "PT40M"
faq:
  - question: "すべてのメールが自動処理されますか？"
    answer: "いいえ、Gmail検索条件で対象を絞り込みます。例えば「件名に問い合わせを含む未読メール」だけを処理対象にできます。重要なメールを誤処理しないよう、最初は特定のラベルのメールだけを対象にすることを推奨します。"
  - question: "下書き生成後に自動送信されますか？"
    answer: "いいえ、下書きとして保存されるだけです。担当者が内容を確認してから手動で送信します。自動送信にすることも可能ですが、誤送信リスクを考慮して下書き保存を推奨しています。"
  - question: "振り分けの精度はどのくらいですか？"
    answer: "定型的な問い合わせであれば90%以上の精度で分類できます。精度を上げるには、systemプロンプトに分類基準の具体例を記載し、過去の分類結果をフィードバックとして活用してください。"
relatedArticles:
  - "gas/gas-mail-automation"
  - "gas/gas-claude-api"
  - "frameworks/ai-business-overview"
draft: false
---

> この記事は[GASでできること完全ガイド](/articles/gas/gas-basics)の応用編です。
> メール自動化の基本は[GASメール自動化](/articles/gas/gas-mail-automation)、AI連携は[GAS × Claude API連携](/articles/gas/gas-claude-api)を先にご覧ください。

1日30分かかっていたメール振り分けと返信下書き作業を、GAS（Google Apps Script）とClaude APIの組み合わせで自動化できます。
この記事では、受信メールのAI分類からラベル付与、緊急通知、返信下書き生成までを約40分で構築する手順をコード付きで解説します。

## この記事で作るもの

AIメール自動振り分けとは、受信メールをAIで分析し、カテゴリ分類・担当者への転送・返信下書き生成までを自動で行う仕組みです。

| ステップ | 内容 | 効果 |
|---------|------|------|
| AI分類 | メール内容からカテゴリ・緊急度を判定 | 振り分け作業の省力化 |
| ラベル付与 | 分類結果に応じたGmailラベルを自動付与 | メールの整理 |
| 担当者通知 | 緊急メールを即時通知 | 対応速度の向上 |
| 下書き生成 | AIが返信ドラフトを自動作成 | 返信作成時間の削減 |

### この記事の前提

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Google、Anthropic |
| 必要な知識 | [GASメール自動化](/articles/gas/gas-mail-automation)と[GAS × Claude API](/articles/gas/gas-claude-api)を読了済み |
| 所要時間 | 約40分 |
| 費用 | GAS: 0円 / AI API: 月約200円〜（2026年2月時点、[Anthropic公式料金ページ](https://www.anthropic.com/pricing)） |
| 完成物 | メール自動振り分け＋返信下書き生成スクリプト |

## 実装手順

実装手順とは、メール取得からAI分類、ラベル付与、返信下書き生成までをGASで構築する工程です。

### ステップ1: メール分類＋ラベル付与

未読メールを取得してAIに分類を依頼し、結果に応じたGmailラベルを自動で付与します。
AIがメール内容を読み取り、JSON（データ交換形式）で分類結果を返す仕組みです。

```javascript
/**
 * 未読メールをAIで分類しラベルを付与
 */
function triageEmails() {
  var threads = GmailApp.search("is:unread label:inbox newer_than:1h -label:AI処理済");
  var apiKey = PropertiesService.getScriptProperties().getProperty("ANTHROPIC_API_KEY");

  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages();
    var lastMessage = messages[messages.length - 1];
    var from = lastMessage.getFrom();

    // 自分が送ったメールは対象外
    if (from.indexOf(Session.getActiveUser().getEmail()) !== -1) continue;

    var subject = lastMessage.getSubject();
    var body = lastMessage.getPlainBody().substring(0, 500);

    try {
      // AIで分類
      var classification = classifyEmail(apiKey, subject, body);

      // ラベルを付与
      applyLabel(threads[i], classification.category);

      // 処理済みラベルを付与
      var processedLabel = getOrCreateLabel("AI処理済");
      threads[i].addLabel(processedLabel);

      // 緊急度が高い場合は通知
      if (classification.urgency === "高") {
        notifyUrgent(subject, from, classification);
      }

      // 返信下書きを生成
      createReplyDraft(lastMessage, classification, apiKey);

      Utilities.sleep(1000);
    } catch (e) {
      console.log("Error processing: " + subject + " - " + e.message);
    }
  }
}

/**
 * メールをAIで分類
 */
function classifyEmail(apiKey, subject, body) {
  var payload = {
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    system: "メール分類AIです。以下のJSON形式で返してください：\n" +
      '{"category":"見積依頼|製品問い合わせ|クレーム|パートナー|営業|その他",' +
      '"urgency":"高|中|低","summary":"20文字の要約"}',
    messages: [{
      role: "user",
      content: "件名: " + subject + "\n本文: " + body
    }]
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

  var response = UrlFetchApp.fetch("https://api.anthropic.com/v1/messages", options);
  var result = JSON.parse(response.getContentText());
  return JSON.parse(result.content[0].text);
}
```

**ポイント:**

- `system`プロパティがsystemプロンプト（AIに役割や出力形式を指示する設定文）です。分類カテゴリは自社の業務に合わせて変更してください
- `newer_than:1h`で直近1時間のメールだけを対象にし、過去メールの誤処理を防ぎます
- `muteHttpExceptions: true`を指定すると、APIエラー時にスクリプトが停止せずレスポンス内容を確認できます

### ステップ2: ラベル管理と通知

AI分類の結果に応じてGmailラベルを付与する関数と、緊急メールをDiscord（テキストチャットサービス）に通知する関数を実装します。

```javascript
/**
 * ラベルを取得または作成
 */
function getOrCreateLabel(labelName) {
  var label = GmailApp.getUserLabelByName(labelName);
  if (!label) label = GmailApp.createLabel(labelName);
  return label;
}

/**
 * 分類結果に応じたラベルを付与
 */
function applyLabel(thread, category) {
  var label = getOrCreateLabel("AI分類/" + category);
  thread.addLabel(label);
}

/**
 * 緊急メールをDiscordに通知
 */
function notifyUrgent(subject, from, classification) {
  var webhookUrl = PropertiesService.getScriptProperties().getProperty("DISCORD_WEBHOOK_URL");
  if (!webhookUrl) return;

  var payload = {
    embeds: [{
      title: "🚨 緊急メール受信",
      color: 15158332,
      fields: [
        { name: "件名", value: subject },
        { name: "送信元", value: from },
        { name: "分類", value: classification.category },
        { name: "要約", value: classification.summary }
      ]
    }]
  };

  UrlFetchApp.fetch(webhookUrl, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  });
}
```

**ポイント:**

- `getOrCreateLabel`はラベルが存在しなければ自動作成するため、事前にGmailでラベルを手動作成する必要はありません
- Webhook（外部サービスに通知を送る仕組み）のURLはDiscordのチャンネル設定から取得できます
- 通知先をSlackに変えたい場合は[GAS × Slack通知](/articles/gas/gas-slack-notification)をご覧ください

### ステップ3: 返信下書きの自動生成

AIがメール内容と分類結果をもとに返信文を生成し、Gmailの下書きとして保存します。

```javascript
/**
 * AIで返信下書きを生成
 */
function createReplyDraft(message, classification, apiKey) {
  var body = message.getPlainBody().substring(0, 500);

  var payload = {
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: "カスタマーサポート担当として返信を作成してください。敬語で200文字以内。不明点は「確認の上ご連絡します」と記載。",
    messages: [{
      role: "user",
      content: "分類: " + classification.category + "\n問い合わせ内容: " + body
    }]
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

  var response = UrlFetchApp.fetch("https://api.anthropic.com/v1/messages", options);
  var result = JSON.parse(response.getContentText());
  var draft = result.content[0].text;

  // 下書きとして保存
  message.createDraftReply(draft);
}
```

**ポイント:**

- `createDraftReply`は下書きとして保存するだけで、自動送信はされません。担当者が内容を確認してから手動で送信できます
- `system`プロンプトの「200文字以内」や返信トーンは、自社のサポート方針に合わせて調整してください

**トリガー設定:**

| 関数 | トリガー | 設定 |
|------|---------|------|
| `triageEmails` | 時間主導型 → 分ベースのタイマー | 5分おき |

## 動作確認・トラブルシューティング

動作確認とは、スクリプトが正しく動作するかをテストメールで検証し、問題があれば原因を特定して修正する作業のことです。

### テスト手順

以下の手順で正常系の動作を確認してください。

1. 自分宛にテスト用メールを送信します（件名に「問い合わせ」等を含め、未読のまま受信トレイに残します）
2. GASエディタで `triageEmails` 関数を選択し、「実行」ボタンをクリックします（初回実行時はGmail権限の承認が求められます）
3. Gmailを開き、テストメールに「AI分類/○○」ラベルと「AI処理済」ラベルが付与されていることを確認します
4. Gmailの「下書き」フォルダを開き、AIが生成した返信下書きが保存されていることを確認します

### よくあるエラーと解決策

| エラー | 原因 | 解決策 |
|--------|------|--------|
| ラベルが作成されない | Gmail権限の未承認 | 手動実行で権限を承認 |
| 分類が不正確 | プロンプトの指示不足 | 各カテゴリの定義と具体例を`system`プロンプトに追加 |
| 下書きが生成されない | APIエラー | `muteHttpExceptions`のレスポンスを確認 |
| 処理済みメールが再処理される | ラベルの不備 | 「AI処理済」ラベルの付与を確認 |

## 応用・カスタマイズ例

基本のメール自動振り分けスクリプトをベースに、業務に合わせて機能を拡張できます。

- **担当者別自動転送** — カテゴリに応じて担当者のメールアドレスに自動転送
- **スプレッドシート記録** — 分類結果を[スプレッドシート](/articles/gas/gas-spreadsheet-automation)に蓄積して対応状況を管理
- **FAQ連動** — よくある質問は[FAQ Bot](/articles/no-code/dify-intro)と連携して即時回答

GASの全体像は[GASでできること完全ガイド](/articles/gas/gas-basics)をご覧ください。
AI分類の基礎は[GAS × Claude API連携](/articles/gas/gas-claude-api)で解説しています。
