---
title: "GASでメール自動化｜一斉送信・自動返信の実装手順【コピペで動くコード付き】"
description: "GAS（Google Apps Script）でGmailのメール一斉送信・自動返信を実装する方法を解説。スプレッドシートの顧客リストから個別メールを一括送信し、受信メールに自動返信するスクリプトをコピペで動くコード付きで紹介。毎月のメール業務を数分に短縮できます。"
category: "gas"
tags: ["GAS", "Gmail", "メール自動化", "一斉送信", "自動返信"]
publishedAt: 2026-02-12
updatedAt: 2026-02-12
author: "れん"
difficulty: "beginner"
timeToRead: 15
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "0円"
  totalTime: "PT45M"
faq:
  - question: "GASで1日に何通までメールを送信できますか？"
    answer: "無料のGoogleアカウントでは1日100通、Google Workspaceアカウントでは1日1,500通が上限です（2026年2月時点）。上限はGmailApp.sendEmailとMailApp.sendEmailの合計でカウントされます。最新情報は[Google公式: Apps Script割り当て制限](https://developers.google.com/apps-script/guides/services/quotas)をご確認ください。"
  - question: "一斉送信でも宛先ごとに内容を変えられますか？"
    answer: "はい、本記事で解説するスクリプトはスプレッドシートの各行から宛先・名前・本文の変数を差し込むため、1通ずつ個別の内容で送信できます。BCC一斉送信と異なり、受信者には個別に送られたメールとして届きます。"
  - question: "添付ファイル付きで送信できますか？"
    answer: "可能です。GmailApp.sendEmailのoptionsにattachmentsパラメータを指定すれば、Google Drive上のファイルやBlob（バイナリデータを表すオブジェクト）を添付できます。本記事のステップ2でコード例を紹介しています。"
  - question: "自動返信を特定の条件でだけ動かすことはできますか？"
    answer: "はい、件名や送信元アドレスで条件分岐できます。GmailApp.search関数でフィルタ条件を指定し、該当するメールにだけ返信する仕組みです。本記事のステップ3で条件付き自動返信を実装します。"
relatedArticles:
  - "gas/gas-basics"
  - "gas/gas-spreadsheet-automation"
  - "frameworks/automation-roi-template"
draft: false
---

> この記事は[GASでできること完全ガイド](/articles/gas/gas-basics)の実装編です。
> 「GASとは何か」から知りたい方は、先にそちらをご覧ください。

この記事では、GASでスプレッドシートの顧客リストからメールを一斉送信し、受信メールに自動返信する仕組みを約45分で構築する手順を解説します。
コードをコピペするだけで動くように、全コードを掲載しています。

### この記事の前提

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Google（Gmail）アカウント |
| 必要な知識 | [GAS入門ガイド](/articles/gas/gas-basics)を読了済み |
| 所要時間 | 約45分 |
| 費用 | 0円（GAS・Gmail無料枠内） |
| 完成物 | 顧客リストからの一斉送信スクリプト / 条件付き自動返信スクリプト |

## この記事で作るもの

GASメール自動化とは、Google Apps ScriptからGmailの送信・検索・返信をプログラムで制御し、Gmail自動化を実現する仕組みです。
今回は以下の2つを構築します。

| 機能 | 内容 | 業務活用例 |
|------|------|-----------|
| 一斉送信 | スプレッドシートの顧客リストから個別メールを一括送信 | 新商品案内、請求書送付、月次報告 |
| 自動返信 | 特定条件のメールを検知して定型文で自動返信 | 問い合わせ受付確認、不在通知 |

### 手作業との比較

| 項目 | 手作業 | GAS自動化 |
|------|--------|----------|
| 50件のメール送信 | 1件5分 × 50 = 約4時間 | 実行ボタン1回で約2分 |
| 宛先・本文の差し替え | コピペ＋手修正（ミスのリスク） | スプレッドシートから自動差し込み |
| 自動返信 | 常にメールを監視する必要あり | トリガーで5分ごとに自動チェック |

## 準備・スプレッドシートの作成

準備とは、メール送信に必要なデータをスプレッドシートに整理する作業です。

### 「送信リスト」シートの作成

| A列 | B列 | C列 | D列 | E列 |
|-----|-----|-----|-----|-----|
| 宛先メール | 会社名 | 担当者名 | 件名 | 送信済み |

サンプルデータ例:

| 宛先メール | 会社名 | 担当者名 | 件名 | 送信済み |
|-----------|--------|---------|------|---------|
| sample@example.com | 株式会社サンプル | 田中太郎 | 新サービスのご案内 | |

### 「テンプレート」シートの作成

A1セルにメール本文のテンプレートを記載します。

```text
{{担当者名}} 様

いつもお世話になっております。

{{件名}}についてご連絡いたします。

（ここに本文を記載）

何かご不明な点がございましたら、お気軽にお問い合わせください。

よろしくお願いいたします。
```

`{{担当者名}}` や `{{件名}}` がスプレッドシートのデータで自動置換されます。

## 実装手順

実装手順とは、スプレッドシートの準備が完了した状態から、GASスクリプトを作成してメール自動化を完成させるまでの作業です。

### ステップ1: 一斉送信スクリプト

スプレッドシートの「拡張機能」→「Apps Script」からエディタを開き、以下のコードを貼り付けてください。

```javascript
/**
 * スプレッドシートの送信リストからメールを一斉送信
 * 各行のデータをテンプレートに差し込み、個別メールとして送信
 */
function sendBulkEmails() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var listSheet = ss.getSheetByName("送信リスト");
  var templateSheet = ss.getSheetByName("テンプレート");

  var data = listSheet.getDataRange().getValues();
  var template = templateSheet.getRange("A1").getValue();

  var count = 0;

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var email = row[0];
    var company = row[1];
    var name = row[2];
    var subject = row[3];
    var sent = row[4];

    // 送信済みまたは空行はスキップ
    if (sent === "済" || !email) continue;

    // テンプレートにデータを差し込む
    var body = template
      .replace(/\{\{担当者名\}\}/g, name)
      .replace(/\{\{会社名\}\}/g, company)
      .replace(/\{\{件名\}\}/g, subject);

    // メール送信
    GmailApp.sendEmail(email, subject, body, {
      name: "あなたの名前"  // 送信者名を変更してください
    });

    // 送信済みフラグを記入
    listSheet.getRange(i + 1, 5).setValue("済");
    listSheet.getRange(i + 1, 6).setValue(new Date());
    count++;

    // Gmail送信制限対策（1秒間隔）
    Utilities.sleep(1000);
  }

  SpreadsheetApp.getUi().alert(count + "件のメールを送信しました。");
}
```

**このコードのポイント:**

- `replace` でテンプレート内の `{{変数名}}` を実データに置換します
- E列に「済」フラグを記録し、同じメールを重複送信しません
- `Utilities.sleep(1000)` で1秒間隔を空け、Gmailの送信制限に対応しています

### ステップ2: 添付ファイル付き送信

Google Drive上のファイルを添付して送信する場合は、以下のように `attachments` を追加します。

```javascript
/**
 * 添付ファイル付きメール送信
 * Google DriveのファイルIDを指定して添付
 */
function sendEmailWithAttachment(email, subject, body, fileId) {
  var file = DriveApp.getFileById(fileId);

  GmailApp.sendEmail(email, subject, body, {
    name: "あなたの名前",
    attachments: [file.getAs(MimeType.PDF)]
  });
}
```

ファイルIDはGoogle DriveのファイルURLから取得できます（`/d/`と`/`の間の文字列）。

**一斉送信への組み込み方:**

一斉送信スクリプト（ステップ1）に添付ファイル機能を組み込む場合は、`GmailApp.sendEmail`のオプションに`attachments`を追加してください。スプレッドシートにファイルID列（F列など）を追加すれば、宛先ごとに異なるファイルを添付できます。

[GAS × PDF自動生成](/articles/gas/gas-pdf-generation)と組み合わせれば、請求書を生成してそのまま送付する一連の業務を自動化できます。

### ステップ3: 条件付き自動返信

特定の件名や送信元のメールに自動で返信するスクリプトです。

```javascript
/**
 * 未読の問い合わせメールに自動返信
 * 件名に「問い合わせ」を含むメールを検知して定型文で返信
 */
function autoReplyToInquiries() {
  // 過去1時間以内の未読メールを検索
  var threads = GmailApp.search('is:unread subject:問い合わせ newer_than:1h');

  var replyTemplate =
    "お問い合わせいただきありがとうございます。\n\n" +
    "内容を確認のうえ、2営業日以内にご回答いたします。\n" +
    "お急ぎの場合は下記までお電話ください。\n\n" +
    "TEL: 03-XXXX-XXXX\n" +
    "営業時間: 平日 9:00〜18:00";

  var count = 0;

  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages();
    var lastMessage = messages[messages.length - 1];

    // 自分が送ったメールには返信しない
    var from = lastMessage.getFrom();
    if (from.indexOf(Session.getActiveUser().getEmail()) !== -1) continue;

    // 返信を送信
    lastMessage.reply(replyTemplate);

    // 既読にする
    threads[i].markRead();

    // ラベルを付ける（整理用）
    var label = GmailApp.getUserLabelByName("自動返信済み");
    if (!label) label = GmailApp.createLabel("自動返信済み");
    threads[i].addLabel(label);

    count++;
  }

  if (count > 0) {
    console.log(count + "件の問い合わせに自動返信しました。");
  }
}
```

**このコードのポイント:**

- `GmailApp.search` でGmail検索と同じ構文が使えます
- `newer_than:1h` で直近1時間のメールだけを対象にし、過去メールへの誤返信を防ぎます
- 自分が送ったメールには返信しないガードを入れています

### トリガーの設定

自動返信を定期実行するには、トリガー（時間やイベントに応じてスクリプトを自動実行する仕組み）を設定します。

1. スクリプトエディタの左メニューから「トリガー」を選択
2. 「トリガーを追加」をクリック
3. 関数: `autoReplyToInquiries`、イベントソース: 「時間主導型」、頻度: 「5分おき」を選択

## 動作確認・トラブルシューティング

動作確認とは、作成したスクリプトが想定通りに動作するかテスト送信で確認する作業です。
まずは自分のメールアドレス宛に1件だけ送信してみましょう。
以下のエラーが発生した場合は、表の解決策を参考にしてください。

| エラー | 原因 | 解決策 |
|--------|------|--------|
| `Exception: Limit Exceeded: Email Total` | 1日の送信上限に到達 | 無料100通/Workspace 1,500通の上限を確認（[公式ドキュメント](https://developers.google.com/apps-script/guides/services/quotas)）。翌日に再実行 |
| 送信済みなのにフラグが付かない | スクリプトが途中でエラー停止 | 送信ログ（F列の日時）を確認し、未送信分を再実行 |
| テンプレートの変数が置換されない | 変数名の不一致 | `{{担当者名}}` の表記がテンプレートとコードで一致しているか確認 |
| 自動返信が二重送信される | 既読処理の前にスクリプトが再実行 | トリガー間隔を5分以上に設定。ラベルで処理済みを管理 |
| 「このアプリはブロックされます」 | Googleのセキュリティ警告 | 「詳細」→「安全ではないページに移動」で承認 |

## 応用・カスタマイズ例

応用・カスタマイズ例では、基本の一斉送信・自動返信スクリプトを業務に合わせて拡張するパターンを紹介します。

### HTMLメールの送信

`GmailApp.sendEmail` の `htmlBody` オプションを使うと、太字や色付きテキスト、画像を含むリッチなメールを送信できます。

```javascript
function sendHtmlEmail(to, subject) {
  var htmlBody =
    "<h2>新商品のお知らせ</h2>" +
    "<p><strong>期間限定キャンペーン</strong>を実施中です。</p>" +
    "<p><a href='https://example.com'>詳細はこちら</a></p>";

  GmailApp.sendEmail(to, subject, "", {
    htmlBody: htmlBody,
    name: "あなたの名前"
  });
}
```

3つ目のパラメータに空文字列を指定し、`htmlBody`でHTML形式のメール本文を渡します。
HTMLメールに対応していない受信環境のために、プレーンテキスト版も併記することを推奨します。

### Slack通知との連携

メール送信完了後にチームへ報告したい場合は、[GAS × Slack通知の実装手順](/articles/gas/gas-slack-notification)と組み合わせると便利です。
一斉送信完了時に「50件送信完了」とSlackに通知すれば、担当者全員が進捗を把握できます。

### AI連携

問い合わせメールの内容を自動で分類したい場合は、[Claude API入門ガイド](/articles/ai-api/claude-api-intro)と組み合わせることで、カテゴリ別の返信テンプレートを自動で切り替えることができます。

費用対効果の計算は[自動化ROI計算テンプレート](/articles/frameworks/automation-roi-template)をご活用ください。
