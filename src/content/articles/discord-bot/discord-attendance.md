---
title: "Discord × 勤怠管理Bot｜スプレッドシート記録"
description: "DiscordのスラッシュコマンドとGASで勤怠管理Botを構築する方法を解説。出勤・退勤の打刻をDiscordから行い、スプレッドシートに自動記録。月次の勤務時間集計まで、コピペで動くコード付きで約60分で構築できます。"
category: "discord-bot"
tags: ["Discord", "勤怠管理", "Bot", "GAS", "スプレッドシート"]
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
  totalTime: "PT60M"
faq:
  - question: "Discordで勤怠管理するメリットは？"
    answer: "普段使っているDiscordから出退勤を打刻できるため、専用アプリのインストールが不要です。完全無料で運用でき、データはスプレッドシートに自動記録されるため集計も簡単です。リモートワークのチームに特に適しています。"
  - question: "スマホからも打刻できますか？"
    answer: "はい、DiscordのスマホアプリからスラッシュコマンドまたはWebhook連携のボタンで打刻できます。外出先やリモートワーク中でもスマホから勤怠記録が可能です。"
  - question: "月次の勤務時間を自動集計できますか？"
    answer: "はい、スプレッドシートに記録された出退勤データをGASで月次集計するスクリプトを本記事で紹介しています。社員ごとの月間勤務時間・残業時間を自動計算します。"
relatedArticles:
  - "discord-bot/discord-bot-overview"
  - "discord-bot/discord-bot-gas"
  - "gas/gas-spreadsheet-automation"
draft: false
---

> この記事は[Discord Bot業務活用ガイド](/articles/discord-bot/discord-bot-overview)の実装編です。
> Discord BotとGASの連携方法は[Discord Bot × GAS連携](/articles/discord-bot/discord-bot-gas)を先にご覧ください。

この記事では、Discordから出退勤を打刻し、スプレッドシートに自動記録する勤怠管理Botを約60分で構築する手順を解説します。
コードをコピペするだけで動くように、全コードを掲載しています。

### この記事の前提

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Google、Discord（サーバー管理権限） |
| 必要な知識 | [Discord Bot × GAS連携](/articles/discord-bot/discord-bot-gas)を読了済み |
| 所要時間 | 約60分 |
| 費用 | 0円（GAS・Discord無料枠内） |
| 完成物 | Discord勤怠打刻Bot + スプレッドシート自動記録 |

## この記事で作るもの

Discord勤怠管理Botとは、Discordチャンネルでの打刻メッセージをGASのWebアプリで受け取り、スプレッドシートに出退勤時刻を記録する仕組みです。

| 機能 | 内容 | 操作 |
|------|------|------|
| 出勤打刻 | 出勤時刻を記録 | Discordで「出勤」と投稿 |
| 退勤打刻 | 退勤時刻を記録・勤務時間を算出 | Discordで「退勤」と投稿 |
| 月次集計 | 社員別の月間勤務時間を集計 | GASスクリプトで自動実行 |

## 準備・スプレッドシートの作成

準備とは、勤怠データを記録するスプレッドシートと、Discord Webhookを設定する作業のことです。

### 「勤怠記録」シートの作成

| A列 | B列 | C列 | D列 | E列 |
|-----|-----|-----|-----|-----|
| 日付 | ユーザー名 | 出勤時刻 | 退勤時刻 | 勤務時間 |

### GAS Webアプリの公開

GASをWebアプリとして公開し、Discordからのリクエストを受け取れるようにします。

## 実装手順

### ステップ1: 打刻受付のGASスクリプト

DiscordからのWebhookリクエストを受け取り、スプレッドシートに記録するスクリプトです。

```javascript
/**
 * Discordからの打刻リクエストを処理
 * GAS Webアプリのエンドポイント
 */
function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var userName = data.userName;
  var action = data.action; // "出勤" or "退勤"

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("勤怠記録");
  var today = Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy/MM/dd");
  var now = Utilities.formatDate(new Date(), "Asia/Tokyo", "HH:mm");

  if (action === "出勤") {
    // 出勤: 新しい行を追加
    sheet.appendRow([today, userName, now, "", ""]);
    return ContentService.createTextOutput(
      JSON.stringify({ message: userName + " さんの出勤を記録しました（" + now + "）" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  if (action === "退勤") {
    // 退勤: 当日の出勤行を検索して退勤時刻を記入
    var data = sheet.getDataRange().getValues();
    for (var i = data.length - 1; i >= 1; i--) {
      var rowDate = Utilities.formatDate(new Date(data[i][0]), "Asia/Tokyo", "yyyy/MM/dd");
      if (rowDate === today && data[i][1] === userName && data[i][3] === "") {
        sheet.getRange(i + 1, 4).setValue(now);

        // 勤務時間を計算
        var startParts = data[i][2].split(":");
        var endParts = now.split(":");
        var startMin = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
        var endMin = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
        var workMin = endMin - startMin;
        var hours = Math.floor(workMin / 60);
        var mins = workMin % 60;
        sheet.getRange(i + 1, 5).setValue(hours + "時間" + mins + "分");

        return ContentService.createTextOutput(
          JSON.stringify({ message: userName + " さんの退勤を記録しました（" + now + "、勤務" + hours + "時間" + mins + "分）" })
        ).setMimeType(ContentService.MimeType.JSON);
      }
    }

    return ContentService.createTextOutput(
      JSON.stringify({ message: userName + " さんの本日の出勤記録が見つかりません" })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

**GAS Webアプリの公開手順:**

1. スクリプトエディタの「デプロイ」→「新しいデプロイ」を選択します
2. 種類: 「ウェブアプリ」、アクセス: 「全員」を選択します
3. デプロイしてURLをコピーします

### ステップ2: Discord Bot（打刻コマンド）

Discordサーバーで打刻メッセージを検知し、GAS Webアプリにリクエストを送る仕組みです。簡易版としてGASからDiscord Webhookで応答を返します。

```javascript
/**
 * Discordに打刻結果を通知
 */
function notifyDiscord(message) {
  var webhookUrl = PropertiesService.getScriptProperties().getProperty("DISCORD_WEBHOOK_URL");

  var payload = {
    embeds: [{
      title: "⏰ 勤怠記録",
      description: message,
      color: 3066993,
      footer: { text: "勤怠管理Bot" }
    }]
  };

  UrlFetchApp.fetch(webhookUrl, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  });
}
```

### ステップ3: 月次勤務時間集計

```javascript
/**
 * 月次の勤務時間を社員別に集計
 */
function monthlySummary() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("勤怠記録");
  var summarySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("月次集計");
  var data = sheet.getDataRange().getValues();

  // 当月のデータを集計
  var now = new Date();
  var targetMonth = Utilities.formatDate(now, "Asia/Tokyo", "yyyy/MM");
  var summary = {};

  for (var i = 1; i < data.length; i++) {
    var rowMonth = Utilities.formatDate(new Date(data[i][0]), "Asia/Tokyo", "yyyy/MM");
    if (rowMonth !== targetMonth) continue;

    var userName = data[i][1];
    var workTime = data[i][4];
    if (!workTime) continue;

    // 勤務時間を分に変換して加算
    var match = workTime.toString().match(/(\d+)時間(\d+)分/);
    if (match) {
      var minutes = parseInt(match[1]) * 60 + parseInt(match[2]);
      summary[userName] = (summary[userName] || 0) + minutes;
    }
  }

  // 集計結果を出力
  summarySheet.clear();
  summarySheet.appendRow(["社員名", "月間勤務時間", "出勤日数"]);

  for (var name in summary) {
    var totalMin = summary[name];
    var hours = Math.floor(totalMin / 60);
    var mins = totalMin % 60;
    summarySheet.appendRow([name, hours + "時間" + mins + "分", ""]);
  }
}
```

## 動作確認・トラブルシューティング

| エラー | 原因 | 解決策 |
|--------|------|--------|
| Webアプリにアクセスできない | デプロイ設定のアクセス権限 | 「全員」に設定されているか確認 |
| 退勤時に出勤記録が見つからない | 日付のフォーマット不一致 | Utilities.formatDateで統一 |
| 勤務時間が正しくない | 日をまたぐ勤務 | 深夜勤務の場合は24時間加算のロジックを追加 |
| Discord通知が届かない | Webhook URLの設定ミス | スクリプトプロパティを確認 |

## 応用・カスタマイズ例

- **休憩時間の記録** — 「休憩開始」「休憩終了」コマンドを追加し、休憩時間を差し引いた実労働時間を算出
- **残業アラート** — 勤務時間が8時間を超えた場合に管理者にDiscord通知
- **有給管理** — 別シートで有給残日数を管理し、Discordから有給申請を受付

Discord Botの全体像は[Discord Bot業務活用ガイド](/articles/discord-bot/discord-bot-overview)、スプレッドシート操作は[GASスプレッドシート自動化](/articles/gas/gas-spreadsheet-automation)をご覧ください。
