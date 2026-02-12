---
title: "GAS × Googleフォーム連携｜回答を自動処理する方法"
description: "GAS（Google Apps Script）でGoogleフォームの回答を自動処理する方法を解説。フォーム送信時のメール通知・Slack通知・回答データの自動集計・条件分岐による振り分けまで、コピペで動くコード付き。問い合わせ対応や申込受付の自動化を約30分で構築できます。"
category: "gas"
tags: ["GAS", "Googleフォーム", "自動化", "フォーム連携", "通知"]
publishedAt: 2026-02-12
updatedAt: 2026-02-12
author: "れん"
difficulty: "beginner"
timeToRead: 12
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "0円"
  totalTime: "PT30M"
faq:
  - question: "Googleフォームの回答をリアルタイムで処理できますか？"
    answer: "はい、GASのonFormSubmitトリガーを設定すると、フォーム送信のたびにスクリプトが自動実行されます。送信から数秒以内に通知やデータ処理が完了します。"
  - question: "フォームの回答内容によって処理を変えられますか？"
    answer: "可能です。回答データをif文で条件分岐させることで、選択肢ごとに異なるメール送信先やSlackチャンネルを切り替えられます。本記事のステップ2で実装方法を解説しています。"
  - question: "既存のGoogleフォームにGASを追加できますか？"
    answer: "はい、既存のフォームのスプレッドシートからApps Scriptを開けば、そのフォームに対してGASを設定できます。フォームを作り直す必要はありません。"
  - question: "フォームの回答データはどこに保存されますか？"
    answer: "Googleフォームに紐づいたスプレッドシートに自動保存されます。GASはこのスプレッドシートのデータを読み取って処理します。フォームの設定画面からスプレッドシートを作成・連携できます。"
relatedArticles:
  - "gas/gas-basics"
  - "gas/gas-mail-automation"
  - "ai-api/claude-api-intro"
draft: false
---

> この記事は[GASでできること完全ガイド](/articles/gas/gas-basics)の実装編です。
> 「GASとは何か」から知りたい方は、先にそちらをご覧ください。

この記事では、Googleフォームの回答をGASで自動処理する仕組みを約30分で構築する手順を解説します。
コードをコピペするだけで動くように、全コードを掲載しています。

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Google（Gmail）アカウント |
| 必要な知識 | [GAS入門ガイド](/articles/gas/gas-basics)を読了済み |
| 所要時間 | 約30分 |
| 費用 | 0円（GAS・Googleフォーム無料枠内） |
| 完成物 | フォーム送信時の自動通知 / 回答データの条件分岐処理 |

## この記事で作るもの

GAS × Googleフォーム連携とは、フォームの回答が送信されたタイミングでGASスクリプトを自動実行し、通知やデータ処理をおこなう仕組みです。

| 機能 | 内容 | 業務活用例 |
|------|------|-----------|
| 送信時メール通知 | 回答内容を担当者にメールで即時通知 | 問い合わせ受付、申込通知 |
| 条件分岐処理 | 回答内容に応じて通知先やアクションを切り替え | カテゴリ別の担当振り分け |
| 自動返信 | 回答者に受付確認メールを自動送信 | 申込受付完了メール |
| データ集計 | 回答データをリアルタイムで集計 | アンケート結果の即時把握 |

## 準備・フォームの作成

準備とは、GAS連携に必要なGoogleフォームとスプレッドシートを整える作業のことです。

### Googleフォームの作成

1. [Google Forms](https://forms.google.com)で新しいフォームを作成します
2. 以下の項目を追加します（問い合わせフォームの例）

| 質問 | 回答形式 | 備考 |
|------|---------|------|
| お名前 | 記述式 | 必須 |
| メールアドレス | 記述式 | 必須 |
| お問い合わせ種別 | ラジオボタン（見積依頼 / 製品について / その他） | 必須 |
| お問い合わせ内容 | 段落 | 必須 |

3. フォームの「回答」タブ → スプレッドシートアイコンをクリックし、回答の保存先スプレッドシートを作成します

### スクリプトエディタを開く

回答保存先のスプレッドシートを開き、「拡張機能」→「Apps Script」でエディタを開きます。

## 実装手順

### ステップ1: フォーム送信時のメール通知

フォームが送信されるたびに、担当者にメールで通知するスクリプトです。

```javascript
/**
 * フォーム送信時に担当者へメール通知
 * onFormSubmitトリガーで自動実行
 */
function onFormSubmit(e) {
  try {
    const responses = e.namedValues;

    const name = responses["お名前"][0];
    const email = responses["メールアドレス"][0];
    const category = responses["お問い合わせ種別"][0];
    const content = responses["お問い合わせ内容"][0];
    const timestamp = new Date().toLocaleString("ja-JP");

    // 担当者への通知メール
    const notifyTo = "tantou@example.com"; // 通知先を変更してください
    const subject = "【問い合わせ】" + category + " - " + name + " 様";
    const body =
      "新しい問い合わせがありました。\n\n" +
      "受付日時: " + timestamp + "\n" +
      "お名前: " + name + "\n" +
      "メール: " + email + "\n" +
      "種別: " + category + "\n" +
      "内容:\n" + content;

    GmailApp.sendEmail(notifyTo, subject, body);
  } catch (error) {
    console.error("通知メール送信エラー: " + error.message);
  }
}
```

**このコードのポイント:**

- `e.namedValues` でフォームの質問名をキーとして回答データを取得しています。質問名とコード内の文字列は完全一致させる必要があります
- `try-catch` でエラーハンドリングを実装し、送信失敗時にログで原因を把握できるようにしています
- `const` を使用してGAS V8ランタイムに対応しています

**トリガーの設定:**

1. スクリプトエディタの左メニューから「トリガー」を選択
2. 「トリガーを追加」→ 関数: `onFormSubmit`、イベントソース: 「スプレッドシートから」、イベント: 「フォーム送信時」を選択

### ステップ2: 条件分岐による振り分け

問い合わせ種別に応じて通知先を切り替えるスクリプトです。

```javascript
/**
 * 問い合わせ種別に応じて通知先を振り分け
 */
function onFormSubmitWithRouting(e) {
  try {
    const responses = e.namedValues;

    const name = responses["お名前"][0];
    const email = responses["メールアドレス"][0];
    const category = responses["お問い合わせ種別"][0];
    const content = responses["お問い合わせ内容"][0];

    // 種別ごとの通知先マッピング
    const routingMap = {
      "見積依頼": "sales@example.com",
      "製品について": "support@example.com",
      "その他": "info@example.com"
    };

    const notifyTo = routingMap[category] || "info@example.com";
    const subject = "【" + category + "】" + name + " 様からの問い合わせ";
    const body =
      "■ 問い合わせ内容\n" +
      "お名前: " + name + "\n" +
      "メール: " + email + "\n" +
      "種別: " + category + "\n\n" +
      "内容:\n" + content;

    // 担当者へ通知
    GmailApp.sendEmail(notifyTo, subject, body);

    // 回答者へ受付確認メールを送信
    const replySubject = "【受付完了】お問い合わせありがとうございます";
    const replyBody =
      name + " 様\n\n" +
      "お問い合わせいただきありがとうございます。\n" +
      "以下の内容で受け付けました。\n\n" +
      "種別: " + category + "\n" +
      "内容: " + content.substring(0, 100) + "...\n\n" +
      "担当者より2営業日以内にご連絡いたします。";

    GmailApp.sendEmail(email, replySubject, replyBody);
  } catch (error) {
    console.error("フォーム送信処理エラー: " + error.message);
  }
}
```

**このコードのポイント:**

- `routingMap` オブジェクトでカテゴリと通知先の対応を管理しています。通知先の変更はこのマッピングを編集するだけで完了します
- 回答者にも受付確認メールを自動送信するため、手動で返信する必要がなくなります

### ステップ3: Slack通知との連携

メール通知に加えてSlackにも通知したい場合は、以下を追加します。

```javascript
/**
 * Slack Webhookで通知を送信
 */
function notifySlack(name, category, content) {
  try {
    const webhookUrl = PropertiesService.getScriptProperties().getProperty("SLACK_WEBHOOK_URL");

    if (!webhookUrl) {
      console.error("Slack Webhook URLが設定されていません");
      return;
    }

    const payload = {
      text: "📩 新しい問い合わせ",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*" + category + "* - " + name + " 様\n" + content.substring(0, 200)
          }
        }
      ]
    };

    UrlFetchApp.fetch(webhookUrl, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload)
    });
  } catch (error) {
    console.error("Slack通知送信エラー: " + error.message);
  }
}
```

Webhook URLはスクリプトプロパティに保管してください（コードにハードコードしない）。Slack通知の詳しい設定方法は[GAS × Slack通知](/articles/gas/gas-slack-notification)をご覧ください。

## 動作確認・トラブルシューティング

動作確認とは、設定したトリガーとスクリプトが期待通りに動くかテスト送信で検証する作業です。

### よくあるエラーと解決策

| エラー | 原因 | 解決策 |
|--------|------|--------|
| トリガーが実行されない | トリガーの設定漏れ | 「トリガー」画面で関数とイベントタイプを確認 |
| `TypeError: Cannot read properties of undefined` | `e.namedValues` の質問名不一致 | フォームの質問文とコード内の文字列を完全一致させる |
| メール通知が届かない | 送信先アドレスの誤り | `notifyTo` のメールアドレスを確認 |
| 権限エラー | Gmail・Driveへのアクセス未承認 | スクリプトを手動実行して権限を承認する |
| 回答者への返信が届かない | フォームでメールアドレスが未回答 | フォームの「メールアドレス」を必須項目に設定 |

### GASの制約事項

GASには以下の制限があります（[Google Apps Script の割り当てと制限](https://developers.google.com/apps-script/guides/services/quotas)、2026年2月時点）。

| 制約事項 | 内容 | 対策 |
|---------|------|------|
| メール送信上限 | 1日100通（無料Gmailアカウント）/ 1,500通（Workspace） | 大量送信はSendGridなどのメール配信サービスを検討 |
| 実行時間制限 | 1回の実行は最大6分 | 処理が重い場合はバッチ分割やキューを利用 |
| トリガー数上限 | 1プロジェクトあたり最大20個 | 必要なトリガーを厳選し、不要なものは削除 |

## 応用・カスタマイズ例

応用・カスタマイズ例とは、この記事で構築した基本機能をベースに業務要件に合わせて拡張する実装パターンです。

- **アンケート集計の自動化** — フォーム回答データを[スプレッドシート自動集計](/articles/gas/gas-spreadsheet-automation)で即時グラフ化
- **申込受付の自動化** — フォーム送信→受付番号採番→確認メール→担当者通知を一気通貫で実現
- **AI連携** — 自由記述の回答を[Claude API](/articles/ai-api/claude-api-intro)で自動分類し、カテゴリ別に通知先を振り分け

## まとめ

この記事では、GAS × Googleフォーム連携による自動処理の構築方法を解説しました。以下の3つの機能を実装しました。

- フォーム送信時のメール通知（onFormSubmitトリガー）
- 回答内容による条件分岐と担当振り分け
- Slack Webhookによるリアルタイム通知

これにより、問い合わせや申込の受付対応を完全自動化できます。

## 次のステップ

さらに業務自動化を進めたい方は、以下の記事もご覧ください。

- [GAS × メール自動化](/articles/gas/gas-mail-automation) — メール送信のカスタマイズと高度なテンプレート活用
- [Claude API入門](/articles/ai-api/claude-api-intro) — フォーム回答をAIで自動分類・要約する方法

GASの全体像は[GASでできること完全ガイド](/articles/gas/gas-basics)をご覧ください。
