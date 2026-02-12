---
title: "Discord × 勤怠管理Bot｜スプレッドシート記録"
description: "DiscordとGASで勤怠管理Botを構築する方法を解説。出勤・退勤の打刻をDiscordからおこないスプレッドシートに自動記録します。月次の勤務時間集計まで、コピペで動くコード付きで中小企業のリモートワーク勤怠管理を約60分で実現できます。"
category: "discord-bot"
tags: ["Discord", "勤怠管理", "Bot", "GAS", "スプレッドシート", "出退勤"]
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
    answer: "普段使っているDiscordから出退勤を打刻できるため、専用アプリのインストールが不要です。完全無料で運用でき、データはスプレッドシートに自動記録されるため集計も簡単です。リモートワークのチームにとくに適しています。"
  - question: "スマホからも打刻できますか？"
    answer: "はい、DiscordのスマホアプリからスラッシュコマンドまたはWebhook連携のボタンで打刻できます。外出先やリモートワーク中でもスマホから勤怠記録が可能です。"
  - question: "月次の勤務時間を自動集計できますか？"
    answer: "はい、スプレッドシートに記録された出退勤データをGASで月次集計するスクリプトを本記事で紹介しています。社員ごとの月間勤務時間・残業時間を自動計算します。"
  - question: "既存の勤怠管理システムとの違いは？"
    answer: "市販の勤怠管理SaaSは月額1人あたり数百円のコストが発生しますが、この方法は完全無料で運用できます。さらにGASで自由にカスタマイズできるため、自社の運用ルールに合わせた機能追加が容易です。Discord常用チームなら導入障壁がほぼありません。"
  - question: "日をまたぐ深夜勤務にも対応できますか？"
    answer: "標準のコードでは日をまたぐ勤務に対応していませんが、退勤時刻が出勤時刻より小さい場合に24時間を加算するロジックを追加することで対応可能です。本記事のトラブルシューティングで対処法を紹介しています。"
relatedArticles:
  - "discord-bot/discord-bot-overview"
  - "discord-bot/discord-bot-gas"
  - "gas/gas-spreadsheet-automation"
draft: false
---

> この記事は[Discord Bot業務活用ガイド](/articles/discord-bot/discord-bot-overview)の実装編です。
> Discord BotとGAS（Google Apps Script、Googleが提供する無料のスクリプト実行環境）の連携方法は[Discord Bot × GAS連携](/articles/discord-bot/discord-bot-gas)を先にご覧ください。

この記事では、Discordから出退勤を打刻し、スプレッドシートに自動記録する勤怠管理Botを約60分で構築する手順を解説します。
コードをコピペするだけで動くように、全コードを掲載しています。

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Google、Discord（サーバー管理権限） |
| 必要な知識 | [Discord Bot × GAS連携](/articles/discord-bot/discord-bot-gas)を読了済み |
| 所要時間 | 約60分 |
| 費用 | 0円（[GAS無料枠](https://developers.google.com/apps-script/guides/services/quotas)・[Discord無料プラン](https://discord.com/pricing)内、2026年2月時点） |
| 完成物 | Discord勤怠打刻Bot + スプレッドシート自動記録 |

## この記事で作るもの

Discord勤怠管理Botとは、Discordチャンネルでの打刻メッセージをGASのWebアプリで受け取り、スプレッドシートに出退勤時刻を記録する仕組みです。

| 機能 | 内容 | 操作 |
|------|------|------|
| 出勤打刻 | 出勤時刻を記録 | Discordで「出勤」と投稿 |
| 退勤打刻 | 退勤時刻を記録・勤務時間を算出 | Discordで「退勤」と投稿 |
| 月次集計 | 社員別の月間勤務時間を集計 | GASスクリプトで自動実行 |

## 準備・環境構築

準備とは、勤怠データを記録するスプレッドシートの作成、GAS Webアプリの公開、Discord Webhook（外部サービスへHTTPリクエストを自動送信する仕組み）の設定をおこなう作業のことです。

### スプレッドシートの作成

Google スプレッドシートを新規作成し、以下の2つのシートを用意します。

**「勤怠記録」シート（シート名を正確に入力してください）:**

| A列 | B列 | C列 | D列 | E列 |
|-----|-----|-----|-----|-----|
| 日付 | ユーザー名 | 出勤時刻 | 退勤時刻 | 勤務時間 |

**「月次集計」シート（シート名を正確に入力してください）:**

| A列 | B列 | C列 |
|-----|-----|-----|
| 社員名 | 月間勤務時間 | 出勤日数 |

1行目にそれぞれヘッダーを入力し、2行目以降はデータが記録される領域として空けておきます。

### GAS Webアプリの公開

GAS Webアプリとは、GASのスクリプトをURL経由で外部からアクセスできるようにする機能です。以下の手順で公開します。

1. スプレッドシートのメニューから「拡張機能」→「Apps Script」を開きます
2. エディタにステップ1のコード（次のセクションで解説）を貼り付けます
3. 上部メニューの「デプロイ」→「新しいデプロイ」を選択します
4. 左の歯車アイコンから「ウェブアプリ」を選択します
5. 「アクセスできるユーザー」を「全員」に設定します
6. 「デプロイ」をクリックし、表示されたURLをコピーして控えておきます

このURLが、Discordからの打刻リクエストを受け付けるエンドポイントになります。

### Discord Webhookの設定

Discord Webhookを使って、打刻結果をDiscordチャンネルに通知します。

1. Discordサーバーの「サーバー設定」を開きます
2. 「連携サービス」→「ウェブフック」を選択します
3. 「新しいウェブフック」をクリックし、名前を「勤怠管理Bot」に変更します
4. 通知を送信するチャンネルを選択します
5. 「ウェブフックURLをコピー」をクリックしてURLを控えます

コピーしたWebhook URLをGASのスクリプトプロパティ（GASでAPIキー等の秘密情報を安全に保管する仕組み）に登録します。

1. Apps Scriptエディタの左メニュー「プロジェクトの設定」（歯車アイコン）を開きます
2. 「スクリプト プロパティ」セクションで「スクリプト プロパティを追加」をクリックします
3. プロパティ名に `DISCORD_WEBHOOK_URL`、値にコピーしたWebhook URLを貼り付けて保存します

## 実装手順

実装手順とは、GASの打刻受付スクリプト・Discord通知・Bot側のリクエスト送信・月次集計の4ステップでシステム全体を構築する作業のことです。

### ステップ1: 打刻受付のGASスクリプト

doPost（GAS Webアプリが外部からのPOSTリクエストを受け取る関数）を使って、Discordからの打刻リクエストを処理します。

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
    var message = userName + " さんの出勤を記録しました（" + now + "）";
    notifyDiscord(message);
    return ContentService.createTextOutput(
      JSON.stringify({ message: message })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  if (action === "退勤") {
    // 退勤: 当日の出勤行を検索して退勤時刻を記入
    var rows = sheet.getDataRange().getValues();
    for (var i = rows.length - 1; i >= 1; i--) {
      var rowDate = Utilities.formatDate(new Date(rows[i][0]), "Asia/Tokyo", "yyyy/MM/dd");
      if (rowDate === today && rows[i][1] === userName && rows[i][3] === "") {
        sheet.getRange(i + 1, 4).setValue(now);

        // 勤務時間を計算
        var startParts = rows[i][2].split(":");
        var endParts = now.split(":");
        var startMin = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
        var endMin = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
        var workMin = endMin - startMin;
        var hours = Math.floor(workMin / 60);
        var mins = workMin % 60;
        sheet.getRange(i + 1, 5).setValue(hours + "時間" + mins + "分");

        var message = userName + " さんの退勤を記録しました（" + now + "、勤務" + hours + "時間" + mins + "分）";
        notifyDiscord(message);
        return ContentService.createTextOutput(
          JSON.stringify({ message: message })
        ).setMimeType(ContentService.MimeType.JSON);
      }
    }

    var message = userName + " さんの本日の出勤記録が見つかりません";
    notifyDiscord(message);
    return ContentService.createTextOutput(
      JSON.stringify({ message: message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

### ステップ2: Discord通知スクリプト

打刻結果をDiscordチャンネルにEmbed（タイトル・色・フィールドを持つDiscordのリッチメッセージ形式）で通知する関数です。ステップ1の `doPost` 内から自動的に呼び出されます。

```javascript
/**
 * Discordに打刻結果を通知
 * doPost内から呼び出される
 */
function notifyDiscord(message) {
  var webhookUrl = PropertiesService.getScriptProperties().getProperty("DISCORD_WEBHOOK_URL");

  var payload = {
    embeds: [{
      title: "勤怠記録",
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

### ステップ3: Discordからのリクエスト送信

Discordのメッセージ内容に応じてGAS WebアプリへPOSTリクエストを送信する方法を解説します。ここではDiscord Botのメッセージイベントを使います。[Discordスラッシュコマンド実装ガイド](/articles/discord-bot/discord-slash-commands)で解説しているスラッシュコマンド方式でも同様に実装できます。

以下のコードをDiscord Bot（Node.js）に追加します。`GAS_WEB_APP_URL` にはステップ1でデプロイしたGAS WebアプリのURLを設定してください。

```javascript
// Discord Bot側（Node.js）
// 環境変数 GAS_WEB_APP_URL にGAS WebアプリのURLを設定
const GAS_WEB_APP_URL = process.env.GAS_WEB_APP_URL;

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const content = message.content.trim();
  if (content !== "出勤" && content !== "退勤") return;

  try {
    const response = await fetch(GAS_WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: message.author.username,
        action: content,
      }),
    });
    const result = await response.json();
    // GAS側のnotifyDiscordでWebhook通知されるため、ここでの返信は不要
  } catch (error) {
    console.error("打刻リクエスト送信エラー:", error);
    message.reply("打刻処理中にエラーが発生しました。管理者にお問い合わせください。");
  }
});
```

Discord Botの基本的なセットアップ手順は[Discord Bot × GAS連携](/articles/discord-bot/discord-bot-gas)で詳しく解説しています。

### ステップ4: 月次勤務時間集計

月次集計とは、1か月分の出退勤データを社員別に集計し、勤務時間と出勤日数を自動算出する処理です。

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
  var dayCount = {};

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
      dayCount[userName] = (dayCount[userName] || 0) + 1;
    }
  }

  // 集計結果を出力
  summarySheet.clear();
  summarySheet.appendRow(["社員名", "月間勤務時間", "出勤日数"]);

  for (var name in summary) {
    var totalMin = summary[name];
    var hours = Math.floor(totalMin / 60);
    var mins = totalMin % 60;
    summarySheet.appendRow([name, hours + "時間" + mins + "分", dayCount[name] + "日"]);
  }
}
```

月次集計を毎月自動実行するには、GASのトリガー機能を使います。Apps Scriptエディタの左メニュー「トリガー」（時計アイコン）から、`monthlySummary` を月1回実行するトリガーを追加してください。

スプレッドシートでの勤怠データの活用方法は[GASスプレッドシート自動化](/articles/gas/gas-spreadsheet-automation)でも解説しています。

## 動作確認・トラブルシューティング

動作確認とは、構築した勤怠管理Botが正しく動作するかをテストする作業です。以下の手順でテスト打刻をおこない、動作を確認してください。

### テスト手順

1. Discordの対象チャンネルで「出勤」と投稿します
2. スプレッドシートの「勤怠記録」シートに、日付・ユーザー名・出勤時刻が記録されたことを確認します
3. Discord上にEmbed形式の出勤通知が表示されたことを確認します
4. 数分後に「退勤」と投稿します
5. スプレッドシートに退勤時刻と勤務時間が正しく記録されたことを確認します

### よくあるエラーと対処法

| エラー | 原因 | 解決策 |
|--------|------|--------|
| Webアプリにアクセスできない | デプロイ設定のアクセス権限 | 「アクセスできるユーザー」が「全員」に設定されているか確認 |
| 退勤時に出勤記録が見つからない | 日付のフォーマット不一致 | Utilities.formatDateで統一されているか確認 |
| 勤務時間が正しくない | 日をまたぐ勤務 | 深夜勤務の場合は退勤時刻に24時間（1440分）加算のロジックを追加 |
| Discord通知が届かない | Webhook URLの設定ミス | スクリプトプロパティの `DISCORD_WEBHOOK_URL` の値を確認 |
| 「権限が必要です」エラー | GASの初回認証が未完了 | エディタから手動で `doPost` を一度実行し、Googleアカウントへのアクセスを許可 |

## 応用・カスタマイズ例

応用・カスタマイズとは、基本の勤怠管理Botに機能を追加し、自社の運用ルールに合わせて拡張する作業のことです。以下のようなカスタマイズが可能です。

- **休憩時間の記録** -- 「休憩開始」「休憩終了」コマンドを追加し、休憩時間を差し引いた実労働時間を算出します。勤怠記録シートにF列（休憩開始）・G列（休憩終了）を追加し、`doPost` 内に分岐処理を追加してください
- **残業アラート** -- 勤務時間が8時間を超えた場合に管理者へDiscord通知を送ります。退勤処理の勤務時間計算後に `if (workMin > 480)` で判定し、管理者チャンネルのWebhookへ通知を追加してください
- **スラッシュコマンド化** -- テキスト入力ではなく `/出勤` `/退勤` のスラッシュコマンドで打刻する方式に変更できます。詳しくは[Discordスラッシュコマンド実装ガイド](/articles/discord-bot/discord-slash-commands)をご覧ください
- **勤怠データの高度な管理** -- 有給管理や勤務パターン分析など、スプレッドシートをデータベースとして本格活用する方法は[DiscordスプレッドシートDB連携](/articles/discord-bot/discord-spreadsheet-db)で解説しています

Discord Botの全体像や他の業務活用パターンについては[Discord Bot業務活用ガイド](/articles/discord-bot/discord-bot-overview)をご覧ください。
