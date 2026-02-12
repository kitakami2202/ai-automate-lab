---
title: "GAS × Googleカレンダー連携｜予定の自動登録・通知"
description: "GAS（Google Apps Script）でGoogleカレンダーの予定を自動登録・通知する方法を解説。スプレッドシートの予定一覧からカレンダーに一括登録、翌日の予定をSlack/Discordに通知するスクリプトをコピペで動くコード付きで紹介します。"
category: "gas"
tags: ["GAS", "Googleカレンダー", "自動化", "予定登録", "通知"]
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
  - question: "スプレッドシートからカレンダーに一括登録できますか？"
    answer: "はい、本記事のスクリプトでスプレッドシートの予定一覧からGoogleカレンダーに一括登録できます。登録済みフラグで重複登録を防止する仕組みも含まれています。"
  - question: "他のメンバーのカレンダーにも予定を追加できますか？"
    answer: "はい、CalendarApp.getCalendarById()で対象カレンダーのIDを指定すれば、共有カレンダーや他メンバーのカレンダーにも予定を追加できます。ただし、対象カレンダーの編集権限が必要です。"
  - question: "翌日の予定を自動通知する方法は？"
    answer: "GASで翌日のカレンダー予定を取得し、Slack WebhookやDiscord Webhookで通知するスクリプトを作成できます。トリガーを毎日夕方に設定すれば、翌日の予定を自動で通知できます。"
relatedArticles:
  - "gas/gas-basics"
  - "gas/gas-spreadsheet-automation"
  - "gas/gas-slack-notification"
draft: false
---

> この記事は[GASでできること完全ガイド](/articles/gas/gas-basics)の実装編です。

この記事では、GASでスプレッドシートの予定をGoogleカレンダーに一括登録し、翌日の予定を自動通知する仕組みを約30分で構築する手順を解説します。
コードをコピペするだけで動くように、全コードを掲載しています。

### この記事の前提

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Google（Gmail）アカウント |
| 必要な知識 | [GAS入門ガイド](/articles/gas/gas-basics)を読了済み |
| 所要時間 | 約30分 |
| 費用 | 0円（GAS・Googleカレンダー無料枠内） |
| 完成物 | 予定の一括登録スクリプト / 翌日予定の自動通知 |

## この記事で作るもの

GAS × Googleカレンダー連携とは、Google Apps ScriptのCalendarAppを使ってカレンダーの予定を読み書きし、業務スケジュール管理を自動化する仕組みです。

| 機能 | 内容 | 業務活用例 |
|------|------|---------|
| 予定の一括登録 | スプレッドシートからカレンダーに自動登録 | 研修スケジュール、面談予定 |
| 翌日予定の通知 | 翌日の予定をSlack/Discordに自動通知 | 朝会リマインダー、訪問予定確認 |
| 予定の集計 | カレンダーの予定をスプレッドシートに出力 | 月間稼働時間の集計 |

## 準備・カレンダーの確認

準備とは、GASからGoogleカレンダーにアクセスするための設定を整える作業のことです。

GASはGoogleカレンダーとネイティブに連携しているため、追加のAPI設定は不要です。スプレッドシートの「拡張機能」→「Apps Script」でエディタを開くだけで始められます。

### スプレッドシートの準備（予定一覧シート）

| A列 | B列 | C列 | D列 | E列 |
|-----|-----|-----|-----|-----|
| タイトル | 開始日時 | 終了日時 | 場所 | 登録済み |

## 実装手順

### ステップ1: スプレッドシートからカレンダーに一括登録

```javascript
/**
 * スプレッドシートの予定をGoogleカレンダーに一括登録
 */
function registerEventsToCalendar() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("予定一覧");
  var data = sheet.getDataRange().getValues();
  var calendar = CalendarApp.getDefaultCalendar();
  var count = 0;

  for (var i = 1; i < data.length; i++) {
    var title = data[i][0];
    var startTime = new Date(data[i][1]);
    var endTime = new Date(data[i][2]);
    var location = data[i][3] || "";
    var registered = data[i][4];

    // 空行・登録済みはスキップ
    if (!title || registered === "済") continue;

    // カレンダーに予定を作成
    var event = calendar.createEvent(title, startTime, endTime, {
      location: location
    });

    // 登録済みフラグとイベントIDを記入
    sheet.getRange(i + 1, 5).setValue("済");
    sheet.getRange(i + 1, 6).setValue(event.getId());
    count++;
  }

  SpreadsheetApp.getUi().alert(count + "件の予定をカレンダーに登録しました。");
}
```

**このコードのポイント:**

- `CalendarApp.getDefaultCalendar()` でデフォルトカレンダーを取得します
- E列に「済」フラグを記録し、重複登録を防止します
- F列にイベントIDを保存し、後から予定の更新・削除に使えます

### ステップ2: 翌日の予定を自動通知

翌日のカレンダー予定を取得し、Discord Webhookで通知するスクリプトです。

```javascript
/**
 * 翌日の予定をDiscordに通知
 */
function notifyTomorrowEvents() {
  // 土曜は送信しない（翌日が日曜のため）
  var dayOfWeek = new Date().getDay();
  if (dayOfWeek === 6) return;

  var calendar = CalendarApp.getDefaultCalendar();

  // 翌日の0:00〜23:59の予定を取得
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var start = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 0, 0, 0);
  var end = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 23, 59, 59);

  var events = calendar.getEvents(start, end);

  if (events.length === 0) return;

  // 予定一覧を整形
  var eventList = "";
  for (var i = 0; i < events.length; i++) {
    var e = events[i];
    var startStr = Utilities.formatDate(e.getStartTime(), "Asia/Tokyo", "HH:mm");
    var endStr = Utilities.formatDate(e.getEndTime(), "Asia/Tokyo", "HH:mm");
    var loc = e.getLocation() ? "（" + e.getLocation() + "）" : "";
    eventList += startStr + "〜" + endStr + " " + e.getTitle() + loc + "\n";
  }

  var dateStr = Utilities.formatDate(tomorrow, "Asia/Tokyo", "yyyy/MM/dd（E）");

  // Discord Webhookで通知
  var webhookUrl = PropertiesService.getScriptProperties().getProperty("DISCORD_WEBHOOK_URL");

  var payload = {
    embeds: [{
      title: "📅 " + dateStr + " の予定（" + events.length + "件）",
      description: eventList,
      color: 3447003,
      footer: { text: "Googleカレンダー自動通知" }
    }]
  };

  UrlFetchApp.fetch(webhookUrl, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  });
}
```

**トリガー設定:**

| 関数 | トリガー種類 | 設定 |
|------|------------|------|
| `notifyTomorrowEvents` | 時間主導型 → 日付ベースのタイマー | 午後5時〜6時 |

Slack通知に変更する場合は、Webhook部分を[GAS × Slack通知](/articles/gas/gas-slack-notification)のコードに置き換えてください。

## 動作確認・トラブルシューティング

| エラー | 原因 | 解決策 |
|--------|------|--------|
| 予定が登録されない | 日時のフォーマット不正 | スプレッドシートのセル書式を「日付 時刻」に設定 |
| 権限エラー | CalendarAppへのアクセス未承認 | スクリプトを手動実行して権限を承認 |
| 通知が届かない | Webhook URLの設定ミス | スクリプトプロパティの値を確認 |
| 終日予定が含まれない | getEvents()の仕様 | `calendar.getEventsForDay()` を併用 |

## 応用・カスタマイズ例

- **共有カレンダーへの登録** — `CalendarApp.getCalendarById("calendar-id")` で共有カレンダーを指定
- **予定の更新・削除** — 保存したイベントIDで `calendar.getEventById(id)` から予定を操作
- **月間稼働集計** — 1ヶ月分のカレンダー予定を取得してスプレッドシートに出力し、工数を集計

GASの全体像は[GASでできること完全ガイド](/articles/gas/gas-basics)、スプレッドシート操作の基本は[GASスプレッドシート自動化](/articles/gas/gas-spreadsheet-automation)をご覧ください。
