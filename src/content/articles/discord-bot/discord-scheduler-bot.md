---
title: "Discord定時通知Botの作り方｜GAS×Webhook連携"
description: "GASとDiscord Webhookで朝会リマインダーや日次売上レポートの定時通知Botを約30分で構築する手順を解説。固定メッセージ通知からスプレッドシート連動の日次レポートまで、コピペで動くコード付きでトリガー設定・土日除外ロジックも紹介します。"
category: "discord-bot"
tags: ["Discord", "Bot", "GAS", "定時通知", "Webhook", "自動通知"]
publishedAt: 2026-02-12
updatedAt: 2026-02-12
author: "れん"
difficulty: "beginner"
timeToRead: 12
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "0円（2026年2月時点）"
  totalTime: "PT30M"
faq:
  - question: "定時通知の時刻は自由に設定できますか？"
    answer: "はい、GASのトリガー機能で1時間単位、または特定の時間帯（例: 午前9時〜10時）で設定できます。分単位の厳密な指定には時間主導型トリガー＋スクリプト内での時刻チェックを組み合わせます。"
  - question: "土日を除外して平日だけ通知できますか？"
    answer: "可能です。スクリプト内でgetDay()を使って曜日を判定し、土曜（6）・日曜（0）の場合は処理をスキップするコードを追加するだけで対応できます。本記事の応用セクションで解説しています。"
  - question: "複数のチャンネルに異なる内容を送れますか？"
    answer: "はい、チャンネルごとにWebhook URLを作成し、スクリプト内で送信先を切り替えれば実現できます。スプレッドシートにチャンネル名とWebhook URLを管理すると拡張しやすくなります。"
  - question: "通知内容にスプレッドシートのデータを含められますか？"
    answer: "もちろん可能です。本記事のメインスクリプトがまさにその実装です。スプレッドシートの売上データやタスク情報を取得し、Embed形式で整形してDiscordに送信します。"
relatedArticles:
  - "discord-bot-overview"
  - "discord-bot-gas"
  - "gas-spreadsheet-automation"
draft: false
---

> この記事は[Discord Bot業務活用ガイド](/articles/discord-bot/discord-bot-overview)の実装編です。
> Discord Botの全体像から知りたい方は、先にそちらをご覧ください。

この記事では、GASとDiscord Webhookで毎日決まった時刻にDiscordへの自動通知を送る定時通知Botを約30分で構築する手順を解説します。
コードをコピペするだけで動くように、全コードを掲載しています。

### この記事でわかること

- Discord Webhookを使った定時通知の仕組み
- GASで朝会リマインダーを自動送信する方法
- スプレッドシートのデータをDiscordに自動通知する実装手順
- トリガー設定による平日・土日の自動判定ロジック

## この記事の前提

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Google、Discord（サーバー管理権限） |
| 必要な知識 | [Discord Bot×GAS連携](/articles/discord-bot/discord-bot-gas)を読了済み |
| 所要時間 | 約30分 |
| 費用 | 0円（GAS・Discord無料枠内、2026年2月時点）<br>[GAS利用制限](https://developers.google.com/apps-script/guides/services/quotas) / [Discord API](https://discord.com/developers/docs/intro) |
| 完成物 | 毎朝の朝会リマインダー / スプレッドシート連携の日次レポート通知 |

## この記事で作るもの

Discord定時通知Botとは、GASのトリガー機能を使い、毎日決まった時刻にDiscordチャンネルへメッセージを自動送信する仕組みです。

| 通知パターン | 内容 | 業務活用例 |
|------------|------|-----------|
| 固定メッセージ | 毎朝同じ内容をリマインド | 朝会の開始通知、日次タスク確認 |
| データ連動 | スプレッドシートの最新データを通知 | 売上日報、在庫アラート |
| 条件付き | 特定の条件を満たした場合のみ通知 | タスク期限の前日アラート |

## 準備・Webhook URLの取得

準備とは、Discord側でWebhook URLを発行し、GASから通知を送れる状態にする作業のことです。
Webhook URLとは、外部サービスにHTTPリクエストで通知を送る仕組みの送信先アドレスです。

1. Discordで通知先のチャンネルの「設定」（歯車アイコン）を開きます
2. 「連携サービス」→「ウェブフック」→「新しいウェブフック」を作成します
3. 名前（例: 「朝会リマインダー」）を設定し、「ウェブフックURLをコピー」をクリックします
4. GASのスクリプトプロパティに保管します（「プロジェクトの設定」→「スクリプトプロパティ」→ キー: `DISCORD_WEBHOOK_URL`）

スクリプトプロパティとは、GASプロジェクト内に安全に値を保存する仕組みです。

**重要:** Webhook URLはコードにハードコードせず、必ずスクリプトプロパティに保管してください。

## 実装手順

### ステップ1: 固定メッセージの定時通知

毎朝決まったメッセージを送信するシンプルなスクリプトです。

```javascript
/**
 * 朝会リマインダーを送信
 */
function sendMorningReminder() {
  // 土日は送信しない
  const dayOfWeek = new Date().getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) return;

  const webhookUrl = PropertiesService.getScriptProperties().getProperty("DISCORD_WEBHOOK_URL");

  const today = Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy/MM/dd（E）");

  const payload = {
    embeds: [{
      title: "📋 " + today + " の朝会リマインダー",
      color: 3447003,
      fields: [
        { name: "⏰ 時間", value: "9:30〜9:45", inline: true },
        { name: "📍 場所", value: "#general ボイスチャンネル", inline: true },
        { name: "📝 アジェンダ", value: "1. 昨日の進捗共有\n2. 今日のタスク確認\n3. 困りごと共有" }
      ],
      footer: { text: "GAS定時通知Bot" }
    }]
  };

  UrlFetchApp.fetch(webhookUrl, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  });
}
```

**このコードのポイント:**

- **土日のスキップロジック**: `getDay()`で曜日を取得し、0（日曜）または6（土曜）の場合は`return`で処理を終了します
- **Embed形式**: Discordの`embeds`配列にオブジェクトを渡すと、タイトル・色・フィールドなどを持つリッチなメッセージ表示が実現できます
- **color値の意味**: `3447003`は青色（16進数`#3498DB`）を10進数で表現したものです。
  [色コード変換サイト](https://www.spycolor.com/)で任意の色に変更できます

### ステップ2: スプレッドシート連動の日次レポート

スプレッドシートの売上データを取得してDiscordに自動通知するスクリプトです。

スプレッドシート操作の詳細は[GAS×スプレッドシート自動化の完全ガイド](/articles/gas/gas-spreadsheet-automation)をご覧ください。

```javascript
/**
 * 売上日報をDiscordに送信
 */
function sendDailySalesReport() {
  const dayOfWeek = new Date().getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) return;

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("売上データ");
  const data = sheet.getDataRange().getValues();

  // 当日のデータを集計
  const today = Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy-MM-dd");
  let totalSales = 0;
  let itemCount = 0;

  for (let i = 1; i < data.length; i++) {
    const rowDate = Utilities.formatDate(new Date(data[i][0]), "Asia/Tokyo", "yyyy-MM-dd");
    if (rowDate === today) {
      totalSales += Number(data[i][2]) || 0;
      itemCount++;
    }
  }

  const webhookUrl = PropertiesService.getScriptProperties().getProperty("DISCORD_WEBHOOK_URL");

  const payload = {
    embeds: [{
      title: "📊 売上日報 " + today,
      color: totalSales >= 100000 ? 3066993 : 15158332,
      fields: [
        { name: "💰 本日の売上合計", value: totalSales.toLocaleString() + " 円", inline: true },
        { name: "📦 取引件数", value: itemCount + " 件", inline: true },
        { name: "📈 目標達成率", value: Math.round(totalSales / 200000 * 100) + "%", inline: true }
      ],
      footer: { text: "データ元: 売上データシート" }
    }]
  };

  UrlFetchApp.fetch(webhookUrl, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  });
}
```

**このコードのポイント:**

- 売上合計が10万円以上なら緑色（`3066993`）、未満なら赤色（`15158332`）でEmbed表示します
- 目標金額（20万円）に対する達成率も自動計算して通知します
- スプレッドシートの1行目は見出し行と想定し、`i = 1`から集計を開始しています

### ステップ3: トリガーの設定

トリガーとは、指定した時間や条件でスクリプトを自動実行するGASの機能のことです。

スクリプトエディタの左メニュー「トリガー」（時計アイコン）から定時実行を設定します。

1. GASエディタの左メニューで「トリガー」をクリックします
2. 右下の「トリガーを追加」をクリックします
3. 以下の表に従ってトリガーを2つ作成します
4. 「保存」をクリックして、Googleアカウントの認証を完了します

| 関数 | トリガー種類 | 設定 |
|------|------------|------|
| `sendMorningReminder` | 時間主導型 → 日付ベースのタイマー | 午前9時〜10時 |
| `sendDailySalesReport` | 時間主導型 → 日付ベースのタイマー | 午後6時〜7時 |

**補足:** 「午前9時〜10時」の設定では、GASがその時間帯のランダムなタイミングで実行します。

厳密な時刻制御が必要な場合は、スクリプト内で`getHours()`と`getMinutes()`を使って時刻チェックを追加してください。

## 動作確認・トラブルシューティング

### 動作確認の手順

1. **手動実行でテスト**: GASエディタの関数リストから`sendMorningReminder`を選択し、「実行」をクリックします
2. **実行ログの確認**: 「表示」→「ログ」（または「実行数」）で実行結果を確認します
3. **Discord側の確認**: 設定したチャンネルにメッセージが届いているかを確認します
4. **トリガーの確認**: 「トリガー」メニューで次回実行予定時刻が正しく表示されているかを確認します

### よくあるトラブルと解決策

| エラー | 原因 | 解決策 |
|--------|------|--------|
| 通知が届かない | Webhook URLの設定ミス | スクリプトプロパティの値を確認 |
| Embedが表示されない | JSONの構文エラー | `embeds` が配列（`[{...}]`）になっているか確認 |
| 土日にも通知される | 曜日チェックの不備 | `getDay()` の戻り値を確認（0=日, 6=土） |
| スプレッドシートのデータが0になる | 日付フォーマットの不一致 | `Utilities.formatDate` で統一したフォーマットを使用 |

## 応用・カスタマイズ例

### タスク期限アラート

スプレッドシートの「期限」列を毎朝チェックし、期限が翌日のタスクをメンション付きで通知します。

`data[i][4]`（期限列）を取得して日付比較をおこない、該当するタスクがあれば`<@ユーザーID>`形式でメンションを含めたpayloadを送信します。

### 週次レポート

月曜朝に前週の集計を自動通知する場合、`getDay() === 1`で条件分岐し、`new Date()`から7日前の日付範囲でスプレッドシートを集計します。

週単位の売上推移をグラフ化したい場合は、Google ChartsでグラフURLを生成してEmbed内に埋め込む方法もあります。

### Slack同時通知

同じデータを[GAS × Slack通知](/articles/gas/gas-slack-notification)でSlackにも送信すれば、DiscordとSlackの両方で同じ情報を共有できます。

UrlFetchAppの送信先URLをSlack WebhookとDiscord Webhookの両方に変えるだけで対応可能です。

## まとめ

この記事では、GASとDiscord Webhookで定時通知Botを構築する手順を解説しました。

朝会リマインダーやスプレッドシート連動の日次レポート通知を約30分で実装できます。

次のステップとして、ユーザーからのメッセージに応答する[Discordスラッシュコマンド実装ガイド](/articles/discord-bot/discord-slash-commands)や、スプレッドシートをDBとして使う[Discord Bot×スプレッドシートDB連携](/articles/discord-bot/discord-spreadsheet-db)にも挑戦してみてください。

Discord Botの全体設計は[Discord Bot業務活用ガイド](/articles/discord-bot/discord-bot-overview)をご覧ください。
