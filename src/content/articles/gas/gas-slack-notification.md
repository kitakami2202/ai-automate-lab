---
title: "GASでSlack通知を自動化｜Webhook連携ガイド"
description: "GASからSlackへ自動通知を送る方法をステップバイステップで解説。Incoming Webhookの設定からスプレッドシート連携・Block Kitによるリッチメッセージまで、コピペで動く完全コードとトラブルシューティング表付き。約30分で無料のSlack自動通知を構築できます。"
category: "gas"
tags: ["GAS", "Slack", "Webhook", "通知自動化", "スプレッドシート"]
publishedAt: 2025-03-01
updatedAt: 2026-02-09
author: "れん"
difficulty: "intermediate"
timeToRead: 15
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  totalTime: "PT30M"
  estimatedCost: "0"
faq:
  - question: "GASからSlack通知を送るのに費用はかかりますか？"
    answer: "GASもSlackのIncoming Webhookも無料で利用できます。Slackの無料プランではアプリ数が10個までに制限されていますが、通知送信自体に費用はかかりません。有料プランの詳細はSlack公式サイト（https://api.slack.com/pricing）をご確認ください（2026年2月時点）。"
  - question: "Webhook URLが漏洩した場合のリスクは？"
    answer: "Webhook URLを知っている人なら誰でもそのチャンネルにメッセージを送信できます。漏洩した場合はSlackのアプリ設定画面からURLを再発行し、GASのスクリプトプロパティを更新してください。スクリプトプロパティに保管することで、コード上にURLが露出しません。"
  - question: "GASからSlackにメンションを送れますか？"
    answer: "<@MemberID>形式で個人メンションが可能です。<!channel>で全員通知、<!here>でオンラインメンバーへの通知もできます。Member IDはSlackのプロフィール画面から「メンバーIDをコピー」で取得できます。"
  - question: "Slack通知が届かないときは？"
    answer: "主な原因は4つあります。Webhook URLの設定ミス、Slackアプリがチャンネルに未インストール、GASのUrlFetch日次制限（20,000回）の到達、ペイロードのJSON形式エラーです。本記事のトラブルシューティング表で詳しく確認できます。"
  - question: "GASからSlackにファイルを送信できますか？"
    answer: "Incoming Webhookではファイル送信はできません。ファイル送信にはSlack APIのfiles.uploadエンドポイントとOAuthトークンが必要です。テキストベースの通知であればIncoming Webhookで十分対応できます。"
relatedArticles: ["gas/gas-basics", "gas/gas-spreadsheet-automation", "discord-bot/discord-bot-gas"]
draft: false
---

> この記事は[GASでできること完全ガイド](/articles/gas/gas-basics)の実装編です。
> 「GASとは何か」から知りたい方は、先にそちらをご覧ください。

この記事では、Google Apps Script（GAS）からSlackへ**自動通知を送る仕組み**を約30分で構築する手順を解説します。
コードをコピペするだけで動くように、全コードを掲載しています。

### この記事の前提

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Google、Slack（ワークスペース管理権限） |
| 必要な知識 | [GAS入門ガイド](/articles/gas/gas-basics)を読了済み |
| 所要時間 | 約30分 |
| 費用 | 0円（GAS・Slack無料プラン） |
| 完成物 | スプレッドシートの値をSlackに自動通知 + リッチメッセージ + メンション |

## この記事で作るもの

GAS Slack通知とは、Google Apps ScriptからSlackのIncoming Webhookを使ってチャンネルにメッセージを自動送信する仕組みです。スプレッドシートとSlackを連携させることで、在庫アラートや日次レポートのSlack自動通知を実現できます。今回は以下の流れで動作する通知を構築します。

```text
トリガーが定期実行 or スプレッドシートの値を検知
  → GASがスプレッドシートからデータを取得
    → Incoming Webhook経由でSlackに通知
      → Block Kitでリッチメッセージ表示
```

完成すると、次の3つができるようになります。

1. **テキスト・リッチメッセージの送信**: Block Kitを使った見やすい通知をSlackに送れます
2. **スプレッドシート連携通知**: スプレッドシートのデータを読み取り、条件に応じてSlackに自動通知します
3. **トリガーによる定期実行**: 毎朝の在庫アラートや週次レポートなどをSlack自動通知で完全自動化できます

GASもSlackの無料プランも費用がかからないため、中小企業でも気軽に導入できます。

## 準備・環境構築

環境構築とは、SlackのIncoming Webhook（外部サービスからSlackにメッセージを送るための仕組み）とGASプロジェクトを準備する作業です。

| 準備項目 | 取得方法 | 備考 |
|---------|---------|------|
| Slackワークスペース | [Slack](https://slack.com/)で作成 | アプリ追加の権限が必要 |
| Incoming Webhook URL | Slack APIサイトでアプリを作成し取得 | 手順は下記参照 |
| Googleアカウント | [Google](https://accounts.google.com/)で作成 | GAS実行に必要 |
| GASプロジェクト | Google Drive → 新規 → Google Apps Script | Webhook URLをスクリプトプロパティに保存 |

### Slackアプリの作成とWebhook URL取得

1. [Slack API](https://api.slack.com/apps)にアクセスし、「Create New App」→「From scratch」を選択します
2. アプリ名（例: GAS通知Bot）を入力し、通知先のワークスペースを選択します
3. 左メニューの「Incoming Webhooks」をクリックし、「Activate Incoming Webhooks」をONにします
4. 「Add New Webhook to Workspace」をクリックし、通知先チャンネルを選択して「許可する」を押します
5. 生成されたWebhook URL（`https://hooks.slack.com/services/...`）をコピーします

### GASプロジェクトの作成とWebhook URL保存

1. Google Driveで「新規」→「その他」→「Google Apps Script」を選択します
2. GASエディタの左メニュー「プロジェクトの設定」（歯車アイコン）をクリックします
3. 「スクリプトプロパティ」に以下を追加します

| プロパティ名 | 値 |
|------------|---|
| `SLACK_WEBHOOK_URL` | 取得したWebhook URL |

スクリプトプロパティ（GASが提供する安全な設定値の保存機能）を使うことで、コードにWebhook URLをハードコードせずに管理できます。URLが漏洩した場合も、Slack側で再発行してプロパティを更新するだけで対応できます。

## 実装手順

実装手順とは、基本通知・スプレッドシート連携・リッチメッセージ・トリガー設定の4ステップで通知システムを完成させる作業です。すべてのコードを1つのスクリプトファイルに貼り付けてください。

### ステップ1 — 基本通知（テキストメッセージ送信）

`UrlFetchApp.fetch()`とは、GASから外部URLにHTTPリクエストを送信するメソッドです。これを使ってSlackのWebhook URLにJSON形式のメッセージを送信します。

```javascript
function sendSlackMessage(message) {
  try {
    const webhookUrl = PropertiesService.getScriptProperties().getProperty('SLACK_WEBHOOK_URL');

    const payload = {
      text: message,
      username: 'GAS通知Bot',
      icon_emoji: ':robot_face:',
    };

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    };

    const response = UrlFetchApp.fetch(webhookUrl, options);
    const responseCode = response.getResponseCode();

    if (responseCode !== 200) {
      Logger.log('Slack送信エラー: ' + responseCode + ' ' + response.getContentText());
    }
  } catch (error) {
    Logger.log('Slack通知エラー: ' + error.message);
  }
}
```

**このコードのポイント:**
- `PropertiesService.getScriptProperties()`でWebhook URLを安全に取得しています
- `muteHttpExceptions: true`により、HTTPエラー時にもスクリプトが中断しません
- レスポンスコードを確認し、200以外の場合はエラーログを出力します
- `try-catch`でネットワークエラーなど予期しない例外にも対応しています

### ステップ2 — スプレッドシート連携通知

スプレッドシートSlack連携とは、スプレッドシートのデータを読み取り、条件に応じてSlackに通知する仕組みです。以下は在庫数が閾値を下回った商品をSlackに通知する例です。

```javascript
function checkStockAndNotify() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('在庫管理');

    if (!sheet) {
      Logger.log('エラー: 在庫管理シートが見つかりません');
      return;
    }

    const data = sheet.getDataRange().getValues();
    const lowStockItems = [];

    // 1行目はヘッダーなのでスキップ
    for (let i = 1; i < data.length; i++) {
      const itemName = data[i][0];     // A列: 商品名
      const stock = Number(data[i][1]);     // B列: 在庫数
      const threshold = Number(data[i][2]); // C列: 閾値

      if (!isNaN(stock) && !isNaN(threshold) && stock <= threshold) {
        lowStockItems.push('• ' + itemName + ': 残り' + stock + '個（閾値: ' + threshold + '個）');
      }
    }

    if (lowStockItems.length > 0) {
      const message = ':warning: *在庫アラート*\n'
        + '以下の商品が閾値を下回りました。\n\n'
        + lowStockItems.join('\n');
      sendSlackMessage(message);
    }
  } catch (error) {
    Logger.log('在庫チェックエラー: ' + error.message);
  }
}
```

**このコードのポイント:**
- 在庫数と閾値を比較し、閾値以下の商品だけを通知します
- 対象がない場合は通知を送らないため、不要な通知を防げます
- ステップ1の`sendSlackMessage()`を再利用しています

スプレッドシートの自動化について詳しくは[GAS×スプレッドシート自動化](/articles/gas/gas-spreadsheet-automation)をご覧ください。

### ステップ3 — リッチメッセージ（Block Kit）+ メンション

Block Kitとは、Slackが提供するUIフレームワークで、ヘッダー・セクション・ボタンなど構造化されたメッセージを作成できます。メンション機能と組み合わせることで、担当者に確実に通知が届きます。

```javascript
function sendRichNotification() {
  try {
    const webhookUrl = PropertiesService.getScriptProperties().getProperty('SLACK_WEBHOOK_URL');

    const payload = {
      blocks: [
        {
          type: 'header',
          text: { type: 'plain_text', text: '日次売上レポート' },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: '*売上合計:*\n¥1,234,567' },
            { type: 'mrkdwn', text: '*前日比:*\n+5.2%' },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*担当者別トップ3:*\n1. 田中: ¥450,000\n2. 鈴木: ¥380,000\n3. 佐藤: ¥280,000',
          },
        },
        { type: 'divider' },
        {
          type: 'context',
          elements: [
            { type: 'mrkdwn', text: ':bell: <@U01ABCDEF> <!channel> 確認をお願いします' },
          ],
        },
      ],
    };

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    };

    const response = UrlFetchApp.fetch(webhookUrl, options);

    if (response.getResponseCode() !== 200) {
      Logger.log('リッチ通知エラー: ' + response.getResponseCode() + ' ' + response.getContentText());
    }
  } catch (error) {
    Logger.log('リッチ通知エラー: ' + error.message);
  }
}
```

**このコードのポイント:**
- `header`ブロックで通知のタイトルを目立たせています
- `section`の`fields`で2列レイアウトを実現しています
- `<@U01ABCDEF>`で個人メンション、`<!channel>`でチャンネル全員にメンションを送れます
- Member IDはSlackでユーザーのプロフィールを開き「メンバーIDをコピー」から取得してください

### ステップ4 — トリガーによる定期実行

トリガーとは、指定した条件でスクリプトを自動実行するGASの機能です。以下のコードで毎朝9時に在庫チェック→Slack通知を自動実行できます。

```javascript
function createSlackTrigger() {
  // 既存の同名トリガーを削除（重複防止）
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === 'checkStockAndNotify') {
      ScriptApp.deleteTrigger(trigger);
    }
  }

  // 毎朝9時に実行するトリガーを作成
  ScriptApp.newTrigger('checkStockAndNotify')
    .timeBased()
    .atHour(9)
    .everyDays(1)
    .inTimezone('Asia/Tokyo')
    .create();

  Logger.log('トリガーを設定しました: 毎日9:00（JST）');
}
```

**このコードのポイント:**
- `createSlackTrigger()`は最初に1回だけ手動実行してください。以降は毎朝自動で動きます
- 既存トリガーを削除してから再作成するため、何度実行しても重複しません
- コードが苦手な方は、GASエディタ左メニューの「トリガー」（時計アイコン）からGUIでも設定できます

## 動作確認・トラブルシューティング

動作確認とは、構築した通知が期待どおりに動くかテストする作業です。

まず`sendSlackMessage('テスト通知です')`を手動実行し、Slackチャンネルにメッセージが届くか確認します。次に`sendRichNotification`を実行してBlock Kit形式の通知を確認します。最後に`checkStockAndNotify`でスプレッドシート連携が動くか確認しましょう。

### よくあるエラーと解決策

| エラー・症状 | 原因 | 解決策 |
|------------|------|--------|
| 「Exception: Invalid argument」 | Webhook URLが未設定 or 空 | スクリプトプロパティに`SLACK_WEBHOOK_URL`が正しく設定されているか確認 |
| 404エラー | Webhook URLが無効 | Slack APIサイトでURLを再発行し、スクリプトプロパティを更新 |
| 「channel_not_found」 | アプリがチャンネルに未インストール | Slackアプリ設定 → Incoming Webhooks → チャンネルを再選択 |
| メッセージが届かない | ペイロードのJSON形式エラー | `JSON.stringify()`の引数が正しいオブジェクトか確認 |
| メンションが機能しない | Member IDの形式ミス | `<@U01ABCDEF>`のIDをSlackプロフィールから取得し直す |
| 「UrlFetch呼び出し回数の上限」 | 日次20,000回の制限到達 | 送信頻度を見直し、通知を集約する |

GASエディタの「実行数」タブ（左メニュー）で過去の実行履歴とエラー内容を確認できます。`Logger.log()`で変数の値を出力し、「実行数」→該当の実行を選択するとログを確認できます。

## 応用・カスタマイズ例

応用・カスタマイズとは、基本の通知機能をベースに業務に合わせた通知シナリオを追加していくことです。

### 中小企業向け通知シナリオ

| シナリオ | 概要 | 実現難易度 |
|---------|------|----------|
| 在庫アラート通知 | スプレッドシートの在庫数が閾値を下回ったらSlackに自動通知。発注漏れを防止 | ★☆☆ |
| 期日リマインダー | タスクシートの期日が近づいたら担当者にメンション付きで通知。対応漏れを防止 | ★★☆ |
| 日次売上レポート | 毎朝の売上データをBlock Kitで整形してSlackに配信。会議資料の準備が不要に | ★★☆ |

LINE通知で社外向けに展開する方法は[GAS×LINE Bot](/articles/gas/gas-line-bot)をご覧ください。Discord通知に興味がある方は[Discord Bot×GAS連携](/articles/discord-bot/discord-bot-gas)もあわせてご確認ください。

### GASの制限事項

運用前に以下の制限を把握しておきましょう（2026年2月時点）。

| 制限事項 | 上限（無料アカウント） | 対策 |
|---------|---------------------|------|
| スクリプト実行時間 | 6分/回 | 重い処理はトリガーで分離 |
| UrlFetch回数 | 20,000回/日 | 通知を集約、送信頻度を見直す |
| トリガー合計実行時間 | 90分/日 | 不要トリガーを削除、処理を最適化 |
| Slackアプリ数（無料プラン） | 10個/ワークスペース | 1アプリで複数チャンネルに送信可能 |

GASとSlackのIncoming Webhookを組み合わせれば、約30分・無料でSlack通知の自動化を構築できます。スクリプトプロパティによるWebhook URL管理とエラーハンドリングにより、安全で安定した運用が可能です。

GASの基礎から学びたい方は[GAS入門ガイド](/articles/gas/gas-basics)をご覧ください。スプレッドシートの自動化を深めたい方は[GAS×スプレッドシート自動化](/articles/gas/gas-spreadsheet-automation)、他のメッセージツールとの連携は[GAS×LINE Bot](/articles/gas/gas-line-bot)や[Discord Bot×GAS連携](/articles/discord-bot/discord-bot-gas)をご確認ください。
