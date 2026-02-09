---
title: "GASでLINE Botの作り方｜60分で無料構築"
description: "GASを使ったLINE Botの作り方を初心者向けにステップバイステップで解説。コピペで動く完全コード・スクリプトプロパティによるトークン安全管理・スプレッドシートへのログ記録まで網羅。約60分で無料のLINE Bot自動化を実現できます。"
category: "gas"
tags: ["GAS", "LINE Bot", "Messaging API", "自動化", "チャットボット"]
publishedAt: 2025-02-01
updatedAt: 2026-02-09
author: "れん"
difficulty: "intermediate"
timeToRead: 20
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  totalTime: "PT60M"
  estimatedCost: "0"
faq:
  - question: "GASでLINE Botを作るのに費用はかかりますか？"
    answer: "GASもLINE Messaging APIも無料で利用できます。応答メッセージ（Reply）は無制限で送信可能です。プッシュメッセージは無料プランで月200通まで送信できます。有料プランの詳細はLINE公式サイト（https://www.linebiz.com/jp/service/line-official-account/plan/）をご確認ください（2026年2月時点）。"
  - question: "GASで作ったLINE Botが動かない・返信が来ないときは？"
    answer: "主な原因は4つあります。GASを「新しいデプロイ」で公開していない、コード修正後にバージョンを更新していない、LINE Developers側でWebhookの利用がOFFになっている、チャネルアクセストークンの設定ミスです。本記事のトラブルシューティング表で詳しく確認できます。"
  - question: "LINE Botの応答速度はどのくらいですか？"
    answer: "通常1〜3秒で応答します。GASにはコールドスタート（初回起動時の遅延）がありますが、実用上は問題ないレベルです。頻繁にアクセスがある場合はコールドスタートの影響はほとんどありません。"
  - question: "GASのLINE BotでChatGPTと連携できますか？"
    answer: "可能です。GASのUrlFetchAppを使ってOpenAI APIを呼び出すことで、ChatGPTによる自動応答Botを構築できます。ユーザーのメッセージをOpenAI APIに送信し、生成された回答をLINEで返す仕組みです。"
  - question: "GASのLINE Botでセキュリティは大丈夫ですか？"
    answer: "本記事ではスクリプトプロパティにトークンを保存する方法を採用しており、コードにトークンがハードコードされません。加えて、WebアプリURLの第三者への共有を避けること、定期的なチャネルアクセストークンの再発行を推奨します。"
relatedArticles: ["gas/gas-basics", "gas/gas-spreadsheet-automation", "discord-bot/discord-bot-gas"]
draft: false
---

> この記事は[GASでできること完全ガイド](/articles/gas/gas-basics)の実装編です。
> 「GASとは何か」から知りたい方は、先にそちらをご覧ください。

この記事では、GASとLINE Messaging APIを使って**無料でLINE Botを構築**する手順を解説します。
コードをコピペするだけで動くように、全コードを掲載しています。

### この記事の前提

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Google、LINE Developers |
| 必要な知識 | [GAS入門ガイド](/articles/gas/gas-basics)を読了済み |
| 所要時間 | 約60分 |
| 費用 | 0円（GAS・LINE Messaging API無料枠） |
| 完成物 | メッセージに自動応答するLINE Bot + スプレッドシートへのログ記録 |

## この記事で作るもの

LINE Bot自動化とは、ユーザーからのメッセージに対してプログラムが自動で応答する仕組みです。今回は以下の流れで動作するBotを構築します。

```
ユーザーがLINEでメッセージ送信
  → LINE PlatformがWebhookでGASに通知
    → GASがメッセージを処理
      → 応答メッセージをLINEに返信
      → スプレッドシートにログを記録
```

完成すると、次の3つができるようになります。

1. **テキストメッセージへの自動応答**: 受信したメッセージに対して即座に返信します
2. **受信メッセージのスプレッドシートへの自動記録**: 問い合わせ内容を蓄積し、傾向分析に活かせます
3. **業務活用への拡張**: FAQ Bot、問い合わせ記録、勤怠連絡など中小企業の実務に応用できます

GASもLINE Messaging APIの無料枠も費用がかからないため、中小企業でも気軽に導入できます。

## 準備・環境構築

環境構築とは、LINE BotをGASで動かすために必要なアカウントや設定を整える作業です。以下の4つを準備します。

| 準備項目 | 取得方法 | 備考 |
|---------|---------|------|
| LINE Developersアカウント | [LINE Developers](https://developers.line.biz/)で登録 | LINEアカウントが必要 |
| Messaging APIチャネル | LINE Developersコンソールで作成 | 「チャネルアクセストークン」を控える |
| Googleアカウント | [Google](https://accounts.google.com/)で作成 | GAS実行に必要 |
| GASプロジェクト | Google Drive → 新規 → Google Apps Script | スクリプトプロパティにトークンを保存 |

### LINE Developersの設定

1. [LINE Developers](https://developers.line.biz/)にログインします
2. 「プロバイダー」を新規作成します（任意の名前でOKです）
3. 「Messaging API」チャネルを作成します
4. 「Messaging API設定」タブでチャネルアクセストークン（APIを呼び出すための認証キー）を発行し、控えておきます

### GASプロジェクトの作成とトークン保存

1. Google Driveで「新規」→「その他」→「Google Apps Script」を選択します
2. GASエディタが開いたら、左メニューの「プロジェクトの設定」（歯車アイコン）をクリックします
3. 「スクリプトプロパティ」セクションで以下の2つを追加します

| プロパティ名 | 値 |
|------------|---|
| `LINE_ACCESS_TOKEN` | 発行したチャネルアクセストークン |
| `SHEET_ID` | ログ記録用スプレッドシートのID（URLの `/d/` と `/edit` の間の文字列） |

スクリプトプロパティ（GASが提供する安全な設定値の保存機能）を使うことで、コードにトークンをハードコードせずに管理できます。

## 実装手順

実装手順とは、Webhook受信・応答送信・ログ記録・デプロイの4ステップでBotを完成させる作業です。すべてのコードを1つのスクリプトファイルに貼り付けてください。

### ステップ1 — Webhook受信処理（doPost関数）

doPost関数とは、外部からHTTP POSTリクエストを受け取ったときにGASが自動実行する関数です。LINEのWebhook（イベント発生時に指定URLへ通知する仕組み）は、この関数を通じてメッセージデータを届けます。

```javascript
function doPost(e) {
  try {
    // LINEからのイベントデータを取得
    const events = JSON.parse(e.postData.contents).events;

    for (const event of events) {
      // テキストメッセージのみ処理
      if (event.type === 'message' && event.message.type === 'text') {
        const replyToken = event.replyToken;
        const userMessage = event.message.text;
        const userId = event.source.userId;

        // 応答メッセージを送信
        replyMessage(replyToken, `「${userMessage}」を受け取りました！`);

        // スプレッドシートにログを記録
        logToSheet(userId, userMessage);
      }
    }
  } catch (error) {
    // エラー内容をスプレッドシートに記録（デバッグ用）
    logToSheet('ERROR', error.message);
  }

  // LINEプラットフォームに200 OKを返す
  return ContentService.createTextOutput(
    JSON.stringify({ status: 'ok' })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

**このコードのポイント:**
- `try-catch`でエラー発生時もBotが停止しないようにしています
- 複数イベントに対応するため`for...of`でループ処理しています
- 最後に200 OKを返すことで、LINE側のタイムアウトエラーを防ぎます

> **本番運用時の注意:** 本記事では学習用に省略していますが、実際の運用では `x-line-signature` ヘッダーによるリクエスト署名検証を実装してください。これにより、LINE以外からの不正なリクエストを防げます。詳細は[LINE公式ドキュメントの署名検証](https://developers.line.biz/ja/docs/messaging-api/receiving-messages/#verifying-signatures)を参照してください。

### ステップ2 — 応答メッセージ送信（replyMessage関数）

replyMessage関数とは、LINE Messaging APIのReplyエンドポイント（応答用の送信先URL）にメッセージを送信する関数です。

```javascript
function replyMessage(replyToken, text) {
  // スクリプトプロパティからトークンを取得
  const token = PropertiesService.getScriptProperties().getProperty('LINE_ACCESS_TOKEN');

  const url = 'https://api.line.me/v2/bot/message/reply';
  const payload = {
    replyToken: replyToken,
    messages: [{ type: 'text', text: text }],
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(url, options);

  // エラー時はスプレッドシートにログを記録
  if (response.getResponseCode() !== 200) {
    logToSheet('API_ERROR', response.getContentText());
  }
}
```

**このコードのポイント:**
- `PropertiesService.getScriptProperties()`でトークンを安全に取得しています
- `muteHttpExceptions: true`により、HTTPエラー時にもスクリプトが中断しません
- レスポンスコードを確認し、エラー時はスプレッドシートにログを残します

### ステップ3 — スプレッドシートへのログ記録

GAS LINE通知の受信内容をスプレッドシートに記録することで、問い合わせの傾向分析や業務改善に活かせます。これが単なるオウム返しBotとの大きな違いです。

```javascript
function logToSheet(userId, message) {
  const sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  const spreadsheet = SpreadsheetApp.openById(sheetId);
  const sheet = spreadsheet.getSheetByName('ログ') || spreadsheet.insertSheet('ログ');

  // ヘッダー行がなければ追加
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['日時', 'ユーザーID', 'メッセージ内容']);
  }

  // ログを追記
  sheet.appendRow([
    new Date(),
    userId,
    message,
  ]);
}
```

**このコードのポイント:**
- 「ログ」シートが存在しない場合は自動作成します
- ヘッダー行も自動で追加されるため、手動設定は不要です
- 日時・ユーザーID・メッセージの3列でシンプルに管理します

### ステップ4 — デプロイとWebhook設定

デプロイ（公開設定）とは、GASのコードをWebアプリとしてインターネット上に公開する作業です。

1. GASエディタ右上の「デプロイ」→「新しいデプロイ」をクリックします
2. 種類で「ウェブアプリ」を選択します
3. 「アクセスできるユーザー」を「全員」に設定します（LINEからのリクエストを受け取るために必要です）
4. 「デプロイ」をクリックし、表示されたURLをコピーします
5. LINE Developersコンソールの「Messaging API設定」タブを開きます
6. 「Webhook URL」にコピーしたURLを貼り付けます
7. 「Webhookの利用」をONにします
8. 「検証」ボタンをクリックして「成功」と表示されれば接続完了です

「応答設定」も忘れずに変更します。LINE Official Account Managerで以下をOFFにしてください。

- **あいさつメッセージ** → OFF
- **応答メッセージ** → OFF（ONのままだとLINE公式の自動応答とBotの応答が二重に返ります）

## 動作確認・トラブルシューティング

動作確認とは、構築したBotが期待どおりに動くかテストする作業です。LINEアプリでBotを友だち追加し、テキストメッセージを送信してください。「〇〇を受け取りました！」と返信が来れば成功です。スプレッドシートの「ログ」シートにも記録が追加されているか確認しましょう。

### よくあるエラーと解決策

| エラー・症状 | 原因 | 解決策 |
|------------|------|--------|
| Botが無反応 | デプロイしていない / バージョン未更新 | 「新しいデプロイ」で再デプロイ。コード変更時は**必ず新バージョン**を作成 |
| 「Webhookの利用」がOFF | LINE Developers設定ミス | Messaging API設定 → Webhookの利用をONに変更 |
| 応答が二重に返る | LINE公式の自動応答が有効 | LINE Official Account Manager → 応答メッセージをOFF |
| 403エラー | チャネルアクセストークンが無効 | スクリプトプロパティの`LINE_ACCESS_TOKEN`を確認・再発行 |
| GAS実行タイムアウト | 処理が6分を超過 | 重い処理はトリガーで分離 |
| スプレッドシートに記録されない | シートIDの設定ミス | スクリプトプロパティの`SHEET_ID`とスプレッドシートURLのIDを照合 |

GASではWebhook経由の実行時に`console.log`の出力を直接確認できません。デバッグには本記事で実装したスプレッドシートへのログ書き出しが有効です。

## 応用・カスタマイズ例

応用・カスタマイズとは、基本のエコーBotをベースに業務向けの機能を追加していくことです。

### 中小企業向け業務活用シナリオ

| シナリオ | 概要 | 実現難易度 |
|---------|------|----------|
| FAQ自動応答Bot | スプレッドシートに登録したQ&Aデータとキーワードマッチで自動回答。社内・顧客向けどちらにも対応 | ★★☆ |
| 問い合わせ記録Bot | 顧客からの問い合わせをスプレッドシートに自動蓄積し、週次レポートを生成 | ★☆☆ |
| 日報・勤怠連絡Bot | 定型フォーマット（例: 「出勤 9:00」）で受け取った内容をスプレッドシートに自動記録 | ★☆☆ |

GASとスプレッドシートの連携について詳しくは[GAS×スプレッドシート自動化](/articles/gas/gas-spreadsheet-automation)をご覧ください。Slack通知との組み合わせは[GAS×Slack通知](/articles/gas/gas-slack-notification)で解説しています。

### GAS・LINEの制限事項

運用前に以下の制限を把握しておきましょう。

| 制限事項 | 上限 | 対策 |
|---------|------|------|
| GAS実行時間 | 6分/回 | 重い処理はトリガーで分離 |
| UrlFetch回数 | 20,000回/日（アカウント合計） | 複数Bot運用時は注意 |
| LINE無料メッセージ | 月200通（プッシュ） | Reply（応答）は無制限。プッシュ配信は計画的に |

LINE Messaging APIの料金プラン詳細は[LINE公式サイト](https://www.linebiz.com/jp/service/line-official-account/plan/)をご確認ください（2026年2月時点）。

## まとめ

GASとLINE Messaging APIを組み合わせれば、約60分・無料でLINE Botを構築できます。スプレッドシートへのログ記録を加えることで、単なるオウム返しBotではなく業務データの蓄積基盤として活用できます。

GASの基礎から学びたい方は[GAS入門ガイド](/articles/gas/gas-basics)をご覧ください。他のメッセージツールとの連携に興味がある方は[GAS×Slack通知](/articles/gas/gas-slack-notification)や[Discord Bot×GAS連携](/articles/discord-bot/discord-bot-gas)もあわせてご確認ください。
