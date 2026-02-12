---
title: "Discord Bot×GAS連携｜Webhook通知を自動化"
description: "GASとDiscord Webhookを使ったBot連携の手順をステップバイステップで解説。スプレッドシート連携・Embedメッセージ・トリガーによる定期通知まで、コピペで動く完全コードとトラブルシューティング表付き。約45分で無料のDiscord通知自動化を構築できます。"
category: "discord-bot"
tags: ["Discord", "Bot", "GAS", "Webhook", "通知自動化"]
publishedAt: 2025-01-20
updatedAt: 2026-02-09
author: "れん"
difficulty: "beginner"
timeToRead: 15
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  totalTime: "PT45M"
  estimatedCost: "0"
faq:
  - question: "GASでDiscord Botを作るのに費用はかかりますか？"
    answer: "GASもDiscord Webhookも無料で利用できます。サーバー費用なしでBotを運用可能です。Discordの無料プランでもWebhookは制限なく作成でき、通知送信にも費用はかかりません。"
  - question: "Discord WebhookとBot Tokenの違いは何ですか？"
    answer: "Webhookはメッセージ送信専用の簡易的な仕組みです。URLにPOSTするだけで通知を送れます。Bot Tokenはメッセージの受信やリアクション検知など双方向のやり取りが可能ですが、サーバーが必要です。この記事ではサーバー不要のWebhookを使います。"
  - question: "Webhook URLが漏洩した場合のリスクは？"
    answer: "Webhook URLを知っている人なら誰でもそのチャンネルにメッセージを送信できます。漏洩した場合はDiscordのサーバー設定からWebhookを削除して再作成し、GASのスクリプトプロパティを更新してください。"
  - question: "Discord通知が届かないときは？"
    answer: "主な原因は4つあります。Webhook URLの設定ミス、Webhookが削除されている、ペイロードのJSON形式エラー、GASのUrlFetch日次制限（20,000回）の到達です。本記事のトラブルシューティング表で詳しく確認できます。"
  - question: "GASからDiscordにファイルや画像を送信できますか？"
    answer: "Webhookでは直接ファイル送信はできません。画像はEmbed内のimage URLフィールドで表示可能です。ファイル送信にはBot TokenとmultipartリクエストによるDiscord APIの呼び出しが必要です。"
relatedArticles: ["discord-bot/discord-bot-overview", "discord-bot/discord-slash-commands", "gas/gas-basics"]
draft: false
---

> この記事は[GASでできること完全ガイド](/articles/gas/gas-basics)の実装編です。
> 「GASとは何か」から知りたい方は、先にそちらをご覧ください。

この記事では、GASとDiscord Webhookを使った**Discord通知自動化**を約45分で構築する手順を解説します。
コードをコピペするだけで動くように、全コードを掲載しています。

### この記事の前提

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Google、Discord（サーバー管理権限） |
| 必要な知識 | [GAS入門ガイド](/articles/gas/gas-basics)を読了済み |
| 所要時間 | 約45分 |
| 費用 | 0円（GAS・Discord無料、2026年2月時点） |
| 完成物 | スプレッドシートの値をDiscordに自動通知 + Embedメッセージ |

## この記事で作るもの

Discord Bot GAS連携とは、GASからDiscord Webhookを使ってチャンネルにメッセージを自動送信する仕組みです。今回は以下の流れで動作する通知を構築します。

```text
トリガーが定期実行 or スプレッドシートの値を検知
  → GASがスプレッドシートからデータを取得
    → Discord Webhook経由でチャンネルに通知
      → Embedメッセージでリッチに表示
```

完成すると、次の3つができるようになります。

1. **テキスト・Embedメッセージの送信**: 色分けやフィールド付きの見やすい通知をDiscordに送れます
2. **スプレッドシート連携通知**: スプレッドシートのデータを読み取り、条件に応じてDiscordに自動通知します
3. **トリガーによる定期実行**: 毎朝の売上レポートや在庫アラートなどDiscord通知自動化を完全自動で運用できます

GASもDiscordも無料で利用できるため、中小企業でもサーバー費用ゼロで導入できます。

## 準備・環境構築

環境構築とは、DiscordのWebhook（外部サービスからDiscordチャンネルにメッセージを送るための仕組み）とGASプロジェクトを準備する作業です。

| 準備項目 | 取得方法 | 備考 |
|---------|---------|------|
| Discordサーバー | [Discord](https://discord.com/)で作成 | サーバー管理権限が必要 |
| Webhook URL | サーバー設定 → 連携サービス → ウェブフック | 手順は下記参照 |
| Googleアカウント | [Google](https://accounts.google.com/)で作成 | GAS実行に必要 |
| GASプロジェクト | Google Drive → 新規 → Google Apps Script | Webhook URLをスクリプトプロパティに保存 |

### Discord Webhookの作成

1. Discordでサーバーを開き、通知先チャンネルの「チャンネルの編集」（歯車アイコン）をクリックします
2. 左メニューの「連携サービス」→「ウェブフックを作成」を選択します
3. Bot名（例: GAS通知Bot）とアイコンを設定します
4. 「ウェブフックURLをコピー」をクリックしてURLを控えます

### GASプロジェクトの作成とWebhook URL保存

1. Google Driveで「新規」→「その他」→「Google Apps Script」を選択します
2. GASエディタの左メニュー「プロジェクトの設定」（歯車アイコン）をクリックします
3. 「スクリプトプロパティ」に以下を追加します

| プロパティ名 | 値 |
|------------|---|
| `DISCORD_WEBHOOK_URL` | 取得したWebhook URL |

スクリプトプロパティ（GASが提供する安全な設定値の保存機能）を使うことで、コードにWebhook URLをハードコードせずに管理できます。

## 実装手順

実装手順とは、基本通知・スプレッドシート連携・Embedメッセージ・トリガー設定の4ステップで通知システムを完成させる作業です。すべてのコードを1つのスクリプトファイルに貼り付けてください。

### ステップ1 — 基本通知（テキストメッセージ送信）

`UrlFetchApp.fetch()`とは、GASから外部URLにHTTPリクエストを送信するメソッドです。これを使ってDiscordのWebhook URLにJSON形式のメッセージを送信します。

```javascript
function sendDiscordMessage(message) {
  try {
    const webhookUrl = PropertiesService.getScriptProperties().getProperty('DISCORD_WEBHOOK_URL');

    const payload = {
      content: message,
      username: 'GAS通知Bot',
    };

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    };

    const response = UrlFetchApp.fetch(webhookUrl, options);
    const responseCode = response.getResponseCode();

    if (responseCode !== 204) {
      Logger.log('Discord送信エラー: ' + responseCode + ' ' + response.getContentText());
    }
  } catch (error) {
    Logger.log('Discord通知エラー: ' + error.message);
  }
}
```

**このコードのポイント:**
- `PropertiesService.getScriptProperties()`でWebhook URLを安全に取得しています
- Discord Webhookは成功時に**204（No Content）**を返します（Slackの200とは異なります）
- `muteHttpExceptions: true`により、HTTPエラー時にもスクリプトが中断しません
- `try-catch`でネットワークエラーなど予期しない例外にも対応しています

### ステップ2 — スプレッドシート連携通知

Discordスプレッドシート連携とは、スプレッドシートのデータを読み取り、条件に応じてDiscordに通知する仕組みです。以下は売上データが目標を下回った場合にアラートを送る例です。

```javascript
function checkSalesAndNotify() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('売上管理');

    if (!sheet) {
      Logger.log('エラー: 売上管理シートが見つかりません');
      return;
    }

    const data = sheet.getDataRange().getValues();
    const alerts = [];

    // 1行目はヘッダーなのでスキップ
    for (let i = 1; i < data.length; i++) {
      const storeName = data[i][0];       // A列: 店舗名
      const sales = Number(data[i][1]);    // B列: 売上
      const target = Number(data[i][2]);   // C列: 目標

      if (!isNaN(sales) && !isNaN(target) && sales < target) {
        const ratio = Math.round((sales / target) * 100);
        alerts.push('⚠ ' + storeName + ': ¥' + sales.toLocaleString() + '（達成率 ' + ratio + '%）');
      }
    }

    if (alerts.length > 0) {
      const message = '**📊 売上アラート**\n以下の店舗が目標未達です。\n\n' + alerts.join('\n');
      sendDiscordMessage(message);
    }
  } catch (error) {
    Logger.log('売上チェックエラー: ' + error.message);
  }
}
```

**このコードのポイント:**
- 売上と目標を比較し、目標未達の店舗だけを通知します
- 達成率をパーセントで表示し、状況が一目でわかるようにしています
- ステップ1の`sendDiscordMessage()`を再利用しています

スプレッドシートの自動化について詳しくは[GAS×スプレッドシート自動化](/articles/gas/gas-spreadsheet-automation)をご覧ください。データの読み書きをさらに高度にする方法は[スプレッドシートをDBとして使うDiscord Bot](/articles/discord-bot/discord-spreadsheet-db)で解説しています。

### ステップ3 — Embedメッセージ（リッチな通知）

Embedとは、Discordが提供するリッチメッセージ形式で、色分け・タイトル・フィールド・タイムスタンプなど構造化された通知を作成できます。

```javascript
function sendEmbedNotification() {
  try {
    const webhookUrl = PropertiesService.getScriptProperties().getProperty('DISCORD_WEBHOOK_URL');

    const payload = {
      embeds: [{
        title: '📈 日次売上レポート',
        description: '本日の売上実績をお知らせします。',
        color: 3447003,
        fields: [
          { name: '売上合計', value: '¥1,234,567', inline: true },
          { name: '前日比', value: '+5.2%', inline: true },
          { name: '達成率', value: '98.3%', inline: true },
        ],
        footer: { text: 'GAS通知Bot | 自動送信' },
        timestamp: new Date().toISOString(),
      }],
    };

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    };

    const response = UrlFetchApp.fetch(webhookUrl, options);

    if (response.getResponseCode() !== 204) {
      Logger.log('Embed通知エラー: ' + response.getResponseCode() + ' ' + response.getContentText());
    }
  } catch (error) {
    Logger.log('Embed通知エラー: ' + error.message);
  }
}
```

**このコードのポイント:**
- `color: 3447003`は青色です。色は10進数で指定します（赤: 15158332、緑: 3066993、黄: 16776960）
- `inline: true`でフィールドを横並びに表示します（最大3列）
- `timestamp`で送信時刻が自動表示されます
- `footer`でBotの識別情報を表示しています

### ステップ4 — トリガーによる定期実行

トリガーとは、指定した条件でスクリプトを自動実行するGASの機能です。以下のコードで毎朝9時に売上チェック→Discord通知を自動実行できます。

```javascript
function createDiscordTrigger() {
  // 既存の同名トリガーを削除（重複防止）
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === 'checkSalesAndNotify') {
      ScriptApp.deleteTrigger(trigger);
    }
  }

  // 毎朝9時に実行するトリガーを作成
  ScriptApp.newTrigger('checkSalesAndNotify')
    .timeBased()
    .atHour(9)
    .everyDays(1)
    .inTimezone('Asia/Tokyo')
    .create();

  Logger.log('トリガーを設定しました: 毎日9:00（JST）');
}
```

**このコードのポイント:**
- `createDiscordTrigger()`は最初に1回だけ手動実行してください。以降は毎朝自動で動きます
- 既存トリガーを削除してから再作成するため、何度実行しても重複しません
- コードが苦手な方は、GASエディタ左メニューの「トリガー」（時計アイコン）からGUIでも設定できます

## 動作確認・トラブルシューティング

動作確認とは、構築した通知が期待どおりに動くかテストする作業です。

まず`sendDiscordMessage('テスト通知です')`を手動実行し、Discordチャンネルにメッセージが届くか確認します。次に`sendEmbedNotification`を実行してEmbed形式の通知を確認します。最後に`checkSalesAndNotify`でスプレッドシート連携が動くか確認しましょう。

### よくあるエラーと解決策

| エラー・症状 | 原因 | 解決策 |
|------------|------|--------|
| 「Exception: Invalid argument」 | Webhook URLが未設定 or 空 | スクリプトプロパティに`DISCORD_WEBHOOK_URL`が正しく設定されているか確認 |
| 404エラー | Webhook URLが無効（削除済み） | Discordサーバー設定でWebhookを再作成し、スクリプトプロパティを更新 |
| 400エラー | ペイロードのJSON形式エラー | `content`または`embeds`が空でないか確認。Embedの`color`は数値型で指定 |
| メッセージが届かない | Webhookのチャンネルが変更/削除 | Discord設定 → 連携サービス → ウェブフックでチャンネルを再設定 |
| Embedの色が表示されない | `color`が文字列になっている | `color: 3447003`のように数値で指定（16進数`#3498DB`→10進数`3447003`） |
| 「UrlFetch呼び出し回数の上限」 | 日次20,000回の制限到達 | 送信頻度を見直し、通知を集約する |

GASエディタの「実行数」タブ（左メニュー）で過去の実行履歴とエラー内容を確認できます。`Logger.log()`で変数の値を出力し、「実行数」→該当の実行を選択するとログを確認できます。

## 応用・カスタマイズ例

応用・カスタマイズとは、基本の通知機能をベースに業務に合わせた通知シナリオを追加していくことです。

### 中小企業向け通知シナリオ

| シナリオ | 概要 | 実現難易度 |
|---------|------|----------|
| 売上日報レポート | 毎朝の売上データをEmbedで整形してDiscordに配信。朝会の情報共有が即時完了 | ★☆☆ |
| 在庫アラート通知 | 在庫数が閾値を下回ったら自動通知。発注タイミングを見逃さない | ★☆☆ |
| フォーム回答通知 | Googleフォームの回答をDiscordに自動転送。問い合わせ対応を迅速化 | ★★☆ |

Botにスラッシュコマンドを追加してインタラクティブにする方法は[Discordスラッシュコマンド実装ガイド](/articles/discord-bot/discord-slash-commands)をご覧ください。Slack通知との使い分けは[GAS×Slack通知](/articles/gas/gas-slack-notification)を参考にしてください。

### GASの制限事項

運用前に以下の制限を把握しておきましょう（2026年2月時点）。

| 制限事項 | 上限（無料アカウント） | 対策 |
|---------|---------------------|------|
| スクリプト実行時間 | 6分/回 | 重い処理はトリガーで分離 |
| UrlFetch回数 | 20,000回/日 | 通知を集約、送信頻度を見直す |
| トリガー合計実行時間 | 90分/日 | 不要トリガーを削除、処理を最適化 |
| Discord Embed | 1メッセージにつき最大10個 | 10個を超える場合は複数メッセージに分割 |

GASとDiscord Webhookを組み合わせれば、約45分・無料でDiscord通知の自動化を構築できます。スクリプトプロパティによるWebhook URL管理とエラーハンドリングにより、安全で安定した運用が可能です。

GASの基礎から学びたい方は[GAS入門ガイド](/articles/gas/gas-basics)をご覧ください。Botの機能を拡張したい方は[Discordスラッシュコマンド実装ガイド](/articles/discord-bot/discord-slash-commands)や[スプレッドシートDBでDiscord Bot](/articles/discord-bot/discord-spreadsheet-db)をご確認ください。
