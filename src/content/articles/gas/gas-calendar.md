---
title: "GAS × Googleカレンダー連携｜予定の自動登録・通知"
description: "GAS（Google Apps Script）でGoogleカレンダーの予定を自動登録・通知する方法をステップバイステップで解説。スプレッドシートからカレンダーへの一括登録、翌日の予定をSlack・Discordに自動通知するスクリプトをコピペで動くコード付きで紹介します。"
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
  - "frameworks/where-to-automate-first"
draft: false
---

> この記事は[GASでできること完全ガイド](/articles/gas/gas-basics)の実装編です。

この記事では、GASでスプレッドシートの予定をGoogleカレンダーに一括登録し、翌日の予定を自動通知する仕組みを構築します。
所要時間は約30分です。コピペで動く全コードを掲載しています。

## この記事で作るもの

GAS × Googleカレンダー連携とは、Google Apps ScriptのCalendarAppを使ってカレンダーの予定を読み書きし、業務スケジュール管理を自動化する仕組みです。

| 機能 | 内容 | 業務活用例 |
|------|------|---------|
| 予定の一括登録 | スプレッドシートからカレンダーに自動登録 | 研修スケジュール、面談予定 |
| 翌日予定の通知 | 翌日の予定をSlack/Discordに自動通知 | 朝会リマインダー、訪問予定確認 |
| 予定の集計 | カレンダーの予定をスプレッドシートに出力 | 月間稼働時間の集計 |

## 準備・カレンダーの確認

準備とは、GASからGoogleカレンダーにアクセスするために必要な設定を整える工程です。

GASはGoogleカレンダーとネイティブに連携しているため、追加のAPI設定は不要です。スプレッドシートの「拡張機能」→「Apps Script」でエディタを開くだけで始められます。

### この記事の前提

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Google（Gmail）アカウント |
| 必要な知識 | [GAS入門ガイド](/articles/gas/gas-basics)を読了済み |
| 所要時間 | 約30分 |
| 費用 | 0円（GAS・Googleカレンダー無料枠内） |
| 完成物 | 予定の一括登録スクリプト / 翌日予定の自動通知 |

### スプレッドシートの準備（予定一覧シート）

| A列 | B列 | C列 | D列 | E列 |
|-----|-----|-----|-----|-----|
| タイトル | 開始日時 | 終了日時 | 場所 | 登録済み |

### カレンダーIDの確認方法

デフォルトカレンダー以外（共有カレンダーなど）に予定を登録する場合は、カレンダーIDが必要です。以下の手順で確認できます。

1. [Googleカレンダー](https://calendar.google.com/)を開く
2. 左サイドバーの対象カレンダーにカーソルを合わせ、「︙」→「設定と共有」をクリック
3. 「カレンダーの統合」セクションにある「カレンダーID」をコピー

共有カレンダーに予定を登録する場合は、そのカレンダーの「予定の変更」権限が付与されている必要があります。権限は「特定のユーザーとの共有」セクションから確認・変更できます。

## 実装手順

実装手順とは、GASでカレンダーへの自動登録と予定通知のスクリプトを順番に構築していく工程です。
ここからは3つのステップに分けて実装を進めます。

### ステップ1: スプレッドシートからカレンダーに一括登録

```javascript
/**
 * スプレッドシートの予定をGoogleカレンダーに一括登録
 */
function registerEventsToCalendar() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("予定一覧");
  const data = sheet.getDataRange().getValues();
  const calendar = CalendarApp.getDefaultCalendar();
  let count = 0;

  for (let i = 1; i < data.length; i++) {
    try {
      const title = data[i][0];
      const startTime = new Date(data[i][1]);
      const endTime = new Date(data[i][2]);
      const location = data[i][3] || "";
      const registered = data[i][4];

      // 空行・登録済みはスキップ
      if (!title || registered === "済") continue;

      // 日時のバリデーション
      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        console.warn(`${i + 1}行目: 日時のフォーマットが不正です`);
        continue;
      }

      // カレンダーに予定を作成
      const event = calendar.createEvent(title, startTime, endTime, {
        location: location
      });

      // 登録済みフラグとイベントIDを記入
      sheet.getRange(i + 1, 5).setValue("済");
      sheet.getRange(i + 1, 6).setValue(event.getId());
      count++;
    } catch (error) {
      console.error(`${i + 1}行目の登録でエラー: ${error.message}`);
    }
  }

  SpreadsheetApp.getUi().alert(`${count}件の予定をカレンダーに登録しました。`);
}
```

**このコードのポイント:**

- `CalendarApp.getDefaultCalendar()` でデフォルトカレンダーを取得します
- E列に「済」フラグを記録し、重複登録を防止します
- F列にイベントIDを保存し、後から予定の更新・削除に使えます
- try-catchで行単位のエラーを捕捉し、1行のエラーで全体が止まるのを防ぎます
- 日時フォーマットが不正な行はスキップし、コンソールに警告を出力します

### ステップ2: 翌日の予定をDiscordに自動通知

翌日のカレンダー予定を取得し、Discord Webhookで通知するスクリプトです。GASで予定通知を自動化すれば、毎日のスケジュール確認を手作業から解放できます。

```javascript
/**
 * 翌日の予定をDiscordに通知
 */
function notifyTomorrowEventsDiscord() {
  // 土曜は送信しない（翌日が日曜のため）
  const dayOfWeek = new Date().getDay();
  if (dayOfWeek === 6) return;

  const calendar = CalendarApp.getDefaultCalendar();

  // 翌日の0:00〜23:59の予定を取得
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const start = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 0, 0, 0);
  const end = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 23, 59, 59);

  const events = calendar.getEvents(start, end);

  if (events.length === 0) return;

  // 予定一覧を整形
  let eventList = "";
  for (let i = 0; i < events.length; i++) {
    const e = events[i];
    const startStr = Utilities.formatDate(e.getStartTime(), "Asia/Tokyo", "HH:mm");
    const endStr = Utilities.formatDate(e.getEndTime(), "Asia/Tokyo", "HH:mm");
    const loc = e.getLocation() ? "（" + e.getLocation() + "）" : "";
    eventList += startStr + "〜" + endStr + " " + e.getTitle() + loc + "\n";
  }

  const dateStr = Utilities.formatDate(tomorrow, "Asia/Tokyo", "yyyy/MM/dd（E）");

  // Discord Webhookで通知
  const webhookUrl = PropertiesService.getScriptProperties().getProperty("DISCORD_WEBHOOK_URL");

  if (!webhookUrl) {
    console.error("DISCORD_WEBHOOK_URLがスクリプトプロパティに設定されていません");
    return;
  }

  const payload = {
    embeds: [{
      title: "📅 " + dateStr + " の予定（" + events.length + "件）",
      description: eventList,
      color: 3447003,
      footer: { text: "Googleカレンダー自動通知" }
    }]
  };

  try {
    UrlFetchApp.fetch(webhookUrl, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload)
    });
  } catch (error) {
    console.error(`Discord通知の送信に失敗しました: ${error.message}`);
  }
}
```

**トリガー設定:**

| 関数 | トリガー種類 | 設定 |
|------|------------|------|
| `notifyTomorrowEventsDiscord` | 時間主導型 → 日付ベースのタイマー | 午後5時〜6時 |

### ステップ3: 翌日の予定をSlackに自動通知

Slack Webhookで通知する場合は、以下のスクリプトを使います。詳しいSlack連携の設定は[GAS × Slack通知の完全ガイド](/articles/gas/gas-slack-notification)をご覧ください。

```javascript
/**
 * 翌日の予定をSlackに通知
 */
function notifyTomorrowEventsSlack() {
  const dayOfWeek = new Date().getDay();
  if (dayOfWeek === 6) return;

  const calendar = CalendarApp.getDefaultCalendar();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const start = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 0, 0, 0);
  const end = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 23, 59, 59);

  const events = calendar.getEvents(start, end);

  if (events.length === 0) return;

  // Slack用にmrkdwn形式で整形
  let eventList = "";
  for (let i = 0; i < events.length; i++) {
    const e = events[i];
    const startStr = Utilities.formatDate(e.getStartTime(), "Asia/Tokyo", "HH:mm");
    const endStr = Utilities.formatDate(e.getEndTime(), "Asia/Tokyo", "HH:mm");
    const loc = e.getLocation() ? ` (_${e.getLocation()}_)` : "";
    eventList += `• ${startStr}〜${endStr} *${e.getTitle()}*${loc}\n`;
  }

  const dateStr = Utilities.formatDate(tomorrow, "Asia/Tokyo", "yyyy/MM/dd（E）");

  const webhookUrl = PropertiesService.getScriptProperties().getProperty("SLACK_WEBHOOK_URL");

  if (!webhookUrl) {
    console.error("SLACK_WEBHOOK_URLがスクリプトプロパティに設定されていません");
    return;
  }

  const payload = {
    text: `📅 *${dateStr} の予定（${events.length}件）*\n${eventList}`
  };

  try {
    UrlFetchApp.fetch(webhookUrl, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload)
    });
  } catch (error) {
    console.error(`Slack通知の送信に失敗しました: ${error.message}`);
  }
}
```

| 関数 | トリガー種類 | 設定 |
|------|------------|------|
| `notifyTomorrowEventsSlack` | 時間主導型 → 日付ベースのタイマー | 午後5時〜6時 |

## 動作確認・トラブルシューティング

動作確認とは、少量のテストデータでスクリプトを手動実行し、カレンダーに予定が正しく反映されるかを検証する工程です。

まずスプレッドシートに2〜3行のテストデータを入力し、`registerEventsToCalendar` を手動実行してカレンダーに予定が表示されるか確認してください。通知スクリプトも同様に手動実行し、メッセージが届くことを確認します。

### よくあるエラーと対策

| エラー | 原因 | 解決策 |
|--------|------|--------|
| 予定が登録されない | 日時のフォーマット不正 | スプレッドシートのセル書式を「日付 時刻」に設定 |
| 権限エラー | CalendarAppへのアクセス未承認 | スクリプトを手動実行して権限を承認 |
| 通知が届かない | Webhook URLの設定ミス | スクリプトプロパティの値を確認 |
| 終日予定が含まれない | getEvents()の仕様 | `calendar.getEventsForDay()` を併用 |

### GASの制限値（2026年2月時点）

GASには利用上の制限があります。大量の予定を扱う場合は以下を意識してください。公式の最新情報は[Google Apps Scriptの割り当てと制限](https://developers.google.com/apps-script/guides/services/quotas)で確認できます。

| 制約事項 | 内容 | 対策 |
|---------|------|------|
| カレンダーイベント作成上限 | 1日あたり数千件程度（[公式の割り当てページ](https://developers.google.com/apps-script/guides/services/quotas)で最新値を確認、2026年2月時点） | 大量登録はバッチ分割を検討 |
| 実行時間制限 | 1回の実行は最大6分（個人アカウント） | 処理が重い場合はトリガーで分割 |
| トリガー数上限 | 1プロジェクトあたり最大20個 | 通知先を統合して節約 |

CalendarAppの全メソッドについては[CalendarAppリファレンス（公式）](https://developers.google.com/apps-script/reference/calendar/calendar-app)をご覧ください。

## まとめ・応用と次のステップ

この記事では、GASとGoogleカレンダーを連携して以下の自動化を構築しました。

- **スプレッドシートからカレンダーへの一括登録**: 重複防止フラグとエラーハンドリング付き
- **翌日の予定をDiscord/Slackに自動通知**: Webhook連携で毎日のスケジュール確認を自動化
- **トラブルシューティングとGAS制限値**: エラー対策と運用上の注意点を把握

本記事の基本スクリプトを拡張すれば、さらに実務に合わせた機能を追加できます。

- **共有カレンダーへの登録** --- `CalendarApp.getCalendarById("calendar-id")` で共有カレンダーを指定
- **予定の更新・削除** --- 保存したイベントIDで `calendar.getEventById(id)` から予定を操作
- **月間稼働集計** --- 1ヶ月分のカレンダー予定を取得してスプレッドシートに出力し、工数を集計
- **フォーム回答からの自動登録** --- Googleフォームの回答をトリガーにカレンダーへ予定登録（詳しくは[GAS × Googleフォーム自動化](/articles/gas/gas-form-automation)をご覧ください）

どの業務から自動化すべきか迷っている方は、[自動化すべき業務の見つけ方](/articles/frameworks/where-to-automate-first)で優先順位の考え方を確認できます。

### 次のステップ

- Slack通知をさらに深掘りしたい方は[GAS × Slack通知の完全ガイド](/articles/gas/gas-slack-notification)へ
- フォーム回答からカレンダーに自動登録する連携は[GAS × Googleフォーム自動化](/articles/gas/gas-form-automation)へ
- GASの全体像は[GASでできること完全ガイド](/articles/gas/gas-basics)、スプレッドシート操作の基本は[GASスプレッドシート自動化](/articles/gas/gas-spreadsheet-automation)をご覧ください
