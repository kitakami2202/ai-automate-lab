---
title: "Discordスラッシュコマンド×GAS実装ガイド"
description: "GASでDiscordスラッシュコマンドを実装する手順を解説。コマンド登録からインタラクション処理・スプレッドシート売上照会まで、コピペで動く完全コード付き。エラー対策表とカスタマイズ例も掲載。約60分・無料でDiscord Botコマンド機能を構築できます。"
category: "discord-bot"
tags: ["Discord", "スラッシュコマンド", "GAS", "Bot", "インタラクション"]
publishedAt: 2025-02-10
updatedAt: 2026-02-12
author: "れん"
difficulty: "intermediate"
timeToRead: 15
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  totalTime: "PT60M"
  estimatedCost: "0円"
faq:
  - question: "スラッシュコマンドとWebhookの違いは何ですか？"
    answer: "Webhookは一方向のメッセージ送信専用で、GASからDiscordにテキストやEmbedを送る場合に使います。スラッシュコマンドはユーザーがDiscord上で「/」を入力してBotに指示を出し、Botが応答する双方向の仕組みです。Webhook方式は送信専用なのでGAS側で受信処理が不要ですが、スラッシュコマンドはdoPostでインタラクションを受信する必要があります。"
  - question: "スラッシュコマンドの登録数に制限はありますか？"
    answer: "グローバルコマンドは1アプリあたり100個まで、サーバー固有のコマンドもサーバーごとに100個まで登録できます。中小企業の業務用途であれば十分な数です。グローバルコマンドの反映には最大1時間かかりますが、サーバー固有コマンドは即時反映されます。"
  - question: "コマンド応答の3秒制限はどう対処しますか？"
    answer: "DiscordはInteraction受信後3秒以内の応答を求めます。GASのdoPostで処理が3秒を超える場合は、type 5のDeferred Responseで即座にACKを返し、後からフォローアップメッセージをWebhookで送信します。GASの処理自体は6分以内に完了すれば問題ありません。"
  - question: "GASでDiscordスラッシュコマンドBotを作るのに費用はかかりますか？"
    answer: "GASもDiscord Botの作成・運用も完全無料です。Discord Developer Portalでのアプリ作成に費用はかかりません。サーバー費用ゼロで、スラッシュコマンドに応答するBotを運用できます。"
  - question: "スラッシュコマンドで画像やファイルを送信できますか？"
    answer: "テキストメッセージやEmbed内の画像URLであれば送信可能です。ファイルの直接添付にはmultipart/form-dataリクエストが必要ですが、GASのUrlFetchAppでも対応できます。テキスト応答が最もシンプルなため、まずテキストで基本を押さえてからEmbed形式に拡張するのが効率的です。"
relatedArticles: ["discord-bot/discord-bot-overview", "discord-bot/discord-bot-gas", "gas/gas-basics"]
draft: false
---

> この記事は[Discord Bot業務活用ガイド](/articles/discord-bot/discord-bot-overview)のスラッシュコマンド実装編です。
> GASの基礎知識は[GASでできること完全ガイド](/articles/gas/gas-basics)をご覧ください。

この記事では、Google Apps Script（GAS）でDiscordスラッシュコマンドに応答するBotを約60分で構築する手順を解説します。
GASの基本知識とDiscordサーバーの管理権限があれば、コードをコピペするだけで動くように全コードを掲載しています。

**この記事の前提**

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Google、Discord（サーバー管理権限） |
| 必要な知識 | [GAS入門ガイド](/articles/gas/gas-basics)を読了済み |
| 所要時間 | 約60分 |
| 費用 | 0円（GAS・Discord無料、2026年2月時点） |
| 完成物 | スラッシュコマンドで売上データを照会するDiscord Bot |

## この記事で作るもの

Discordスラッシュコマンドとは、ユーザーがDiscord上で「/」を入力してBotに指示を出す機能です。Botが応答を返す双方向のDiscordインタラクション（ユーザーの操作とBotの反応を組み合わせた対話機能）として動作します。今回は以下の処理を構築します。

```text
ユーザーがDiscordで「/sales」と入力
  → DiscordがGAS（Webアプリ）にインタラクションを送信
    → GASがスプレッドシートから売上データを取得
      → Discordに応答メッセージを返す
```

### Webhookとスラッシュコマンドの違い

| 項目 | Webhook方式 | スラッシュコマンド方式 |
|------|-----------|-------------------|
| 通信方向 | GAS → Discord（一方向） | Discord ↔ GAS（双方向） |
| ユーザー操作 | 不要（自動通知） | 「/」コマンドで指示 |
| 必要な認証 | Webhook URL | Bot Token + Application ID |
| GASのデプロイ | 不要 | Webアプリとしてデプロイ必須 |
| 主な用途 | 定期通知・アラート | データ照会・操作 |
| 関連記事 | [Webhook通知の自動化](/articles/discord-bot/discord-bot-gas) | この記事 |

完成すると、次の3つができるようになります。

1. **スラッシュコマンドの登録**: GASからDiscord APIを呼び出して「/hello」「/sales」などのDiscord Botコマンドを登録します
2. **インタラクションの受信**: ユーザーのコマンド入力をGASのdoPostで受信し、応答を返します
3. **スプレッドシート連携コマンド**: 「/sales」でスプレッドシートの売上データをDiscord上で照会できます

## 準備・環境構築

環境構築とは、Discord Developer Portal（Discordアプリの管理画面）でBotを作成し、GASプロジェクトを準備する作業です。

| 準備項目 | 取得方法 | 備考 |
|---------|---------|------|
| Discordアプリケーション | [Developer Portal](https://discord.com/developers/applications)で作成 | 「New Application」から作成 |
| Bot Token | アプリ設定 → Bot → Reset Token | 一度しか表示されないため必ず控える |
| Application ID | アプリ設定 → General Information | コマンド登録APIに使用 |
| Googleアカウント | [Google](https://accounts.google.com/)で作成 | GAS実行に必要 |

### Discord Developer Portalでの設定

1. [Discord Developer Portal](https://discord.com/developers/applications)を開き、「New Application」をクリックします
2. アプリ名（例: GAS業務Bot）を入力して作成します
3. 左メニュー「Bot」を開き、「Reset Token」でBot Tokenを取得します（一度しか表示されないため必ず控えてください）
4. 左メニュー「General Information」でApplication IDを控えます

### Botをサーバーに招待

1. 左メニュー「OAuth2」を開きます
2. 「SCOPES」で `bot` と `applications.commands` にチェックを入れます
3. 「BOT PERMISSIONS」で `Send Messages` にチェックを入れます
4. 生成されたURLをブラウザで開き、対象サーバーを選択して招待します

### GASプロジェクトの作成

1. Google Driveで「新規」→「その他」→「Google Apps Script」を選択します
2. GASエディタの「プロジェクトの設定」→「スクリプトプロパティ」に以下を追加します

| プロパティ名 | 値 |
|------------|---|
| `DISCORD_BOT_TOKEN` | 取得したBot Token |
| `DISCORD_APPLICATION_ID` | 取得したApplication ID |
| `SPREADSHEET_ID` | 売上管理スプレッドシートのID（URLの `/d/` と `/edit` の間の文字列） |

スクリプトプロパティ（GASが提供する安全な設定値の保存機能）を使うことで、Bot Tokenをコードにハードコードせずに管理できます。

## 実装手順

実装手順とは、コマンド登録・Discordインタラクション受信・スプレッドシート連携の3ステップでBotを完成させる作業です。
すべてのコードを1つのスクリプトファイルに貼り付けてください。

### ステップ1 — スラッシュコマンドの登録

Discord API（Discordが提供するプログラムからの操作インターフェース）を使って、スラッシュコマンドを登録します。この関数は最初に1回だけ手動実行してください。

```javascript
function registerCommands() {
  try {
    const props = PropertiesService.getScriptProperties();
    const botToken = props.getProperty('DISCORD_BOT_TOKEN');
    const appId = props.getProperty('DISCORD_APPLICATION_ID');

    const commands = [
      { name: 'hello', description: '挨拶を返します', type: 1 },
      { name: 'sales', description: '売上データを表示します', type: 1 },
    ];

    const url = 'https://discord.com/api/v10/applications/' + appId + '/commands';

    for (const command of commands) {
      const options = {
        method: 'post',
        contentType: 'application/json',
        headers: { 'Authorization': 'Bot ' + botToken },
        payload: JSON.stringify(command),
        muteHttpExceptions: true,
      };

      const response = UrlFetchApp.fetch(url, options);
      const code = response.getResponseCode();

      if (code === 200 || code === 201) {
        Logger.log('登録成功: /' + command.name);
      } else {
        Logger.log('登録エラー: /' + command.name + ' ' + code + ' ' + response.getContentText());
      }
    }
  } catch (error) {
    Logger.log('コマンド登録エラー: ' + error.message);
  }
}
```

**このコードのポイント:**
- `commands`配列に複数のコマンドをまとめて登録しています
- `type: 1`はチャット入力コマンド（CHAT_INPUT）を意味します
- Discord APIは成功時に200（更新）または201（新規作成）を返します
- グローバルコマンドの反映には最大1時間かかります

### ステップ2 — インタラクションの受信

doPostとは、GASをWebアプリとしてデプロイした際にPOSTリクエストを受信する関数です。Discordからのインタラクション（ユーザーのコマンド操作）を受け取り、応答を返します。

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // PING → PONG（Interactions Endpoint URL検証用）
    if (data.type === 1) {
      return ContentService.createTextOutput(
        JSON.stringify({ type: 1 })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // APPLICATION_COMMAND（スラッシュコマンド実行）
    if (data.type === 2) {
      const commandName = data.data.name;
      const userName = data.member.user.username;

      if (commandName === 'hello') {
        return createResponse('こんにちは、' + userName + 'さん！');
      }

      if (commandName === 'sales') {
        return handleSalesCommand();
      }

      return createResponse('不明なコマンドです: /' + commandName);
    }

    return createResponse('処理できないリクエストです');
  } catch (error) {
    Logger.log('doPostエラー: ' + error.message);
    return createResponse('エラーが発生しました。管理者に連絡してください。');
  }
}

function createResponse(message) {
  return ContentService.createTextOutput(
    JSON.stringify({
      type: 4,
      data: { content: message },
    })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

**このコードのポイント:**
- `data.type === 1`はPINGリクエストです。Endpoint URL登録時にDiscordが送信する検証に応答します
- `data.type === 2`はスラッシュコマンドの実行です。コマンド名で処理を分岐します
- `type: 4`は即時応答（CHANNEL_MESSAGE_WITH_SOURCE）を意味します
- `createResponse()`ヘルパー関数でJSON形式のレスポンスを統一しています

### ステップ3 — スプレッドシート連携コマンド

スプレッドシート連携とは、「/sales」コマンドでスプレッドシートの売上データを照会し、Discordに結果を返す機能です。

```javascript
function handleSalesCommand() {
  try {
    const sheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
    const ss = SpreadsheetApp.openById(sheetId);
    const sheet = ss.getSheetByName('売上管理');

    if (!sheet) {
      return createResponse('売上管理シートが見つかりません');
    }

    const values = sheet.getDataRange().getValues();
    const lines = [];
    let total = 0;

    for (let i = 1; i < values.length; i++) {
      const storeName = values[i][0];
      const sales = Number(values[i][1]);
      if (!isNaN(sales)) {
        total += sales;
        lines.push(storeName + ': ¥' + sales.toLocaleString());
      }
    }

    const message = '**📊 売上データ**\n'
      + lines.join('\n')
      + '\n\n合計: ¥' + total.toLocaleString();

    return createResponse(message);
  } catch (error) {
    Logger.log('売上照会エラー: ' + error.message);
    return createResponse('売上データの取得中にエラーが発生しました');
  }
}
```

**このコードのポイント:**
- `SpreadsheetApp.openById()`でスプレッドシートIDを指定して開きます（Webアプリでは`getActiveSpreadsheet()`が使えないため）
- 店舗名（A列）と売上（B列）を一覧表示し、合計も算出します
- シートが見つからない場合やデータ取得エラー時にもユーザーにメッセージを返します

スプレッドシートをデータベースとして活用する方法は[スプレッドシートDBでDiscord Bot](/articles/discord-bot/discord-spreadsheet-db)で詳しく解説しています。

### ステップ4 — WebアプリのデプロイとEndpoint URL登録

Webアプリとしてデプロイとは、GASのコードをインターネット上に公開し、外部（Discord）からHTTPリクエストを受け取れる状態にすることです。

1. GASエディタの右上「デプロイ」→「新しいデプロイ」をクリックします
2. 「種類の選択」で「ウェブアプリ」を選びます
3. 「アクセスできるユーザー」を「全員」に設定します
4. 「デプロイ」をクリックし、表示されたURLを控えます
5. Discord Developer Portalの「General Information」→「INTERACTIONS ENDPOINT URL」に貼り付けて保存します

Discordが保存時にPINGリクエストを送信し、doPostのPONG応答を確認します。保存に成功すれば設定完了です。

### ステップ5 — 動作確認とトラブルシューティング

動作確認とは、登録したスラッシュコマンドが正しく動作するかテストする作業です。

まず`registerCommands()`をGASエディタで手動実行し、ログに「登録成功」が表示されることを確認します。
グローバルコマンドの反映には最大1時間かかるため、Discordで「/hello」が表示されるまで待ちます。
コマンドが表示されたら実行し、Botから応答が返ることを確認してください。

#### よくあるエラーと解決策

| エラー・症状 | 原因 | 解決策 |
|------------|------|--------|
| コマンド登録で401エラー | Bot Tokenが無効 | Developer PortalでTokenを再発行し、スクリプトプロパティを更新 |
| コマンド登録で400エラー | コマンド定義のJSON形式エラー | `name`は英小文字のみ、`description`は100文字以内で指定 |
| スラッシュコマンドが表示されない | 反映待ち or 権限不足 | グローバルコマンドは最大1時間待つ。`applications.commands`スコープを確認 |
| 「インタラクションに失敗しました」 | doPostが3秒以内に応答していない | Webアプリが正常にデプロイされているか確認。「実行数」タブでエラーログを確認 |
| Endpoint URL保存で失敗 | PING/PONG処理が未実装 | doPost内の`data.type === 1`で`{ type: 1 }`を返しているか確認 |
| 「売上管理シートが見つかりません」 | シート名の不一致 | スプレッドシートのシート名が正確に「売上管理」か確認 |

GASエディタの「実行数」タブ（左メニュー）で過去の実行履歴とエラー内容を確認できます。

## 応用・カスタマイズ

応用・カスタマイズとは、基本のスラッシュコマンドをベースに業務シナリオを追加していくことです。

### 中小企業向けコマンドシナリオ

| コマンド | 機能 | 活用場面 |
|---------|------|---------|
| `/sales` | スプレッドシートの売上データを表示 | 朝会での売上確認、外出先からの数値チェック |
| `/stock 商品名` | 指定商品の在庫数を照会 | 在庫確認の即時化、発注判断の迅速化 |
| `/report` | 当日の業務サマリをEmbed形式で表示 | 日次レポートの自動生成、チーム共有 |

定期通知やEmbed形式のメッセージ送信は[Discord Bot×GAS連携](/articles/discord-bot/discord-bot-gas)で解説しています。
Slack通知との使い分けは[GAS×Slack通知](/articles/gas/gas-slack-notification)を参考にしてください。

### GASの制限事項

| 制限事項 | 上限（無料アカウント） | スラッシュコマンドへの影響 |
|---------|---------------------|----------------------|
| スクリプト実行時間 | 6分/回 | doPost内の処理は6分以内に完了が必要 |
| UrlFetch回数 | 20,000回/日 | コマンド登録・API呼び出し回数の合計 |
| トリガー合計実行時間 | 90分/日 | 定期的なコマンド更新を行う場合に影響 |
| Discordの応答制限 | 3秒以内 | 重い処理はDeferred Response（type 5）で対処 |

## まとめ

GASとDiscord APIを組み合わせれば、約60分・無料（2026年2月時点）でスラッシュコマンドに応答するBotを構築できます。スクリプトプロパティによるBot Token管理とエラーハンドリングにより、安全で安定した運用が可能です。

GASの基礎から学びたい方は[GAS入門ガイド](/articles/gas/gas-basics)をご覧ください。
Webhook通知から始めたい方は[Discord Bot×GAS連携](/articles/discord-bot/discord-bot-gas)をご確認ください。
データ管理を強化したい方は[スプレッドシートDB](/articles/discord-bot/discord-spreadsheet-db)で解説しています。
