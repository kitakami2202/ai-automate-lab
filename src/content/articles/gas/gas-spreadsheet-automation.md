---
title: "GASでスプレッドシート自動化｜集計・日報・メール送信"
description: "GASを使ったスプレッドシート自動化の実践テクニックを初心者向けにステップバイステップで解説。売上データの自動集計・日次レポートのメール送信・トリガーによる定期実行まで、コピペで動く完全コードとトラブルシューティング表付きで約45分で構築できます。"
category: "gas"
tags: ["GAS", "スプレッドシート", "自動化", "業務効率化", "日報"]
publishedAt: 2025-02-15
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
  - question: "GASでスプレッドシートの自動化はどのくらい時間短縮できますか？"
    answer: "定型的なデータ集計やレポート作成であれば、月あたり数時間〜十数時間の削減が期待できます。たとえば毎日15分の集計作業を自動化すれば月5時間以上の削減になります。費用対効果の試算には自動化ROI計算テンプレートが便利です。"
  - question: "GASのトリガー機能とは何ですか？"
    answer: "トリガーとは、特定の条件でスクリプトを自動実行する機能です。時間主導型（毎朝9時に実行など）と編集トリガー（セル変更時に実行）の2種類があります。無料アカウントでは1日の合計実行時間が90分までに制限されています。"
  - question: "スプレッドシートの大量データでGASは遅くなりますか？"
    answer: "数万行を超えると処理速度が低下することがあります。対策としてgetValues()でデータを一括取得し、ループ内のAPI呼び出しを減らすことが有効です。6分の実行時間制限に達する場合は処理を分割してトリガーで連携させます。"
  - question: "GASで「このアプリはブロックされます」と表示されたときは？"
    answer: "Googleのセキュリティ警告です。「詳細」→「〇〇（安全ではないページ）に移動」をクリックすると承認できます。自分が作成したスクリプトであれば安全に承認して問題ありません。組織でブロックされている場合はWorkspace管理者に相談してください。"
  - question: "GASのスプレッドシート自動化でセキュリティは大丈夫ですか？"
    answer: "GASはGoogleのサーバー上で実行されるため、コード自体は安全に管理されます。注意すべきはスプレッドシートの共有設定（閲覧・編集権限の適切な管理）と、外部API連携時の認証情報管理です。トークン類はスクリプトプロパティに保管し、コードにハードコードしないようにしましょう。"
relatedArticles: ["gas/gas-basics", "gas/gas-slack-notification", "frameworks/automation-roi-template"]
draft: false
---

> この記事は[GASでできること完全ガイド](/articles/gas/gas-basics)の実装編です。
> 「GASとは何か」から知りたい方は、先にそちらをご覧ください。

この記事では、GASでスプレッドシートの**データ集計・日次レポート生成・メール送信**を自動化する手順を解説します。
コードをコピペするだけで動くように、全コードを掲載しています。

### この記事の前提

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Google（Gmail） |
| 必要な知識 | [GAS入門ガイド](/articles/gas/gas-basics)を読了済み |
| 所要時間 | 約45分 |
| 費用 | 0円（GAS無料枠内） |
| 完成物 | データ自動集計 + 日次レポートメール自動送信 |

## この記事で作るもの

スプレッドシート自動化とは、GASを使ってデータの集計・加工・通知などの繰り返し作業をプログラムに任せる仕組みです。今回は以下の流れで動作する自動化を構築します。

```text
トリガーが毎朝9時に発火
  → 売上データシートから全データを取得
    → 合計金額・担当者別集計をサマリーシートに反映
      → 集計結果を整形してメールで自動送信
```

完成すると、次の3つができるようになります。

1. **売上データの自動集計**: 複数行のデータを合計・担当者別に集計し、サマリーシートに反映します
2. **日次レポートのメール自動送信**: 集計結果をフォーマットして指定アドレスに送信します
3. **トリガーによる完全自動化**: 毎朝9時に集計→送信を人手なしで実行します

GASは無料で利用できるため、売上集計、在庫確認、日報自動化など中小企業の日常業務に気軽に導入できます。

## 準備・環境構築

環境構築とは、自動化スクリプトを動かすためにスプレッドシートとGASエディタを準備する作業です。

まず、スプレッドシートに以下の2シートを作成してください。

| シート名 | 列構成 | 役割 |
|---------|--------|------|
| 売上データ | A: 日付 / B: 商品名 / C: 金額 / D: 担当者 | 元データの入力先 |
| サマリー | A: 項目名 / B: 値 | 集計結果の出力先 |

「売上データ」シートにはヘッダー行（1行目）と数行のサンプルデータを入力しておきます。「サマリー」シートのA2に「売上合計」、A3に「最終更新」、A5に「【担当者別】」と入力しておくと、集計結果が見やすくなります。

次に、スプレッドシート上部の「拡張機能」→「Apps Script」をクリックしてGASエディタを開きます。既存のコードをすべて削除し、次のステップで記載するコードを貼り付けてください。

## 実装手順

実装手順とは、集計・メール送信・トリガー設定の3つの関数をGASに追加していく作業です。すべてのコードを1つのスクリプトファイルに貼り付けてください。

### ステップ1 — データ自動集計

`getValues()`とは、指定範囲のデータを二次元配列として一括取得するメソッドです。GAS集計の基本は、このメソッドでデータをまとめて取得し、JavaScriptのループで処理することです。セルを1つずつ読み書きするよりも大幅に高速です。

```javascript
function aggregateData() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const dataSheet = ss.getSheetByName('売上データ');
    const summarySheet = ss.getSheetByName('サマリー');

    if (!dataSheet || !summarySheet) {
      Logger.log('エラー: シートが見つかりません');
      return;
    }

    // データを一括取得（セル単位取得より高速）
    const data = dataSheet.getDataRange().getValues();

    let total = 0;
    const salesByPerson = {};

    // 1行目はヘッダーなのでスキップ
    for (let i = 1; i < data.length; i++) {
      const person = data[i][3]; // 担当者（D列）
      const amount = Number(data[i][2]); // 金額（C列）

      if (!isNaN(amount)) {
        total += amount;
        salesByPerson[person] = (salesByPerson[person] || 0) + amount;
      }
    }

    // サマリーシートに書き込み
    summarySheet.getRange('B2').setValue(total);
    summarySheet.getRange('B3').setValue(new Date());

    // 担当者別集計を書き込み（A6以降）
    const people = Object.entries(salesByPerson);
    if (people.length > 0) {
      summarySheet.getRange(6, 1, people.length, 2).setValues(people);
    }

    Logger.log('集計完了: 合計 ¥' + total);
  } catch (error) {
    Logger.log('集計エラー: ' + error.message);
  }
}
```

**このコードのポイント:**
- `getDataRange().getValues()`でシート全体を一括取得し、処理速度を確保しています
- `Number()`で型変換し、数値以外のデータが混在してもエラーになりません
- 担当者別の集計結果を`setValues()`で一括書き込みしています（セル単位書き込みより高速）

### ステップ2 — 日次レポートのメール自動送信

`GmailApp.sendEmail()`とは、GASからGmailを通じてメールを送信するメソッドです。集計結果をフォーマットして、上司やチームメンバーに自動配信します。

```javascript
function sendDailyReport() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const summarySheet = ss.getSheetByName('サマリー');
    const total = summarySheet.getRange('B2').getValue();
    const date = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd');

    const subject = '【日次レポート】' + date + ' 売上サマリー';
    const body = [
      date + ' の売上レポートです。',
      '',
      '■ 売上合計: ¥' + Number(total).toLocaleString(),
      '■ 最終更新: ' + summarySheet.getRange('B3').getDisplayValue(),
      '',
      'このメールはGASにより自動送信されています。',
    ].join('\n');

    // 送信先を変更してください
    GmailApp.sendEmail('your-email@example.com', subject, body);
    Logger.log('レポート送信完了: ' + subject);
  } catch (error) {
    Logger.log('メール送信エラー: ' + error.message);
  }
}
```

**このコードのポイント:**
- `Utilities.formatDate()`で日本時間のフォーマットを指定しています
- 送信先アドレスは必ず自分のアドレスに書き換えてください
- 無料Googleアカウントではメール送信が1日100通までに制限されています

### ステップ3 — トリガーによる定期実行

トリガーとは、指定した条件（時間やイベント）でスクリプトを自動実行するGASの機能です。以下のコードで毎朝9時に集計→メール送信を自動実行できます。

```javascript
function createDailyTrigger() {
  // 既存の同名トリガーを削除（重複防止）
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === 'dailyTask') {
      ScriptApp.deleteTrigger(trigger);
    }
  }

  // 毎朝9時に実行するトリガーを作成
  ScriptApp.newTrigger('dailyTask')
    .timeBased()
    .atHour(9)
    .everyDays(1)
    .inTimezone('Asia/Tokyo')
    .create();

  Logger.log('トリガーを設定しました: 毎日9:00（JST）');
}

// トリガーから呼ばれる関数
function dailyTask() {
  aggregateData();
  sendDailyReport();
}
```

**このコードのポイント:**
- `createDailyTrigger()`は最初に1回だけ手動実行してください。以降は毎朝自動で動きます
- 既存トリガーを削除してから再作成するため、何度実行しても重複しません
- コードが苦手な方は、GASエディタ左メニューの「トリガー」（時計アイコン）からGUIでも設定できます

## 動作確認・トラブルシューティング

動作確認とは、構築した自動化が期待どおりに動くかテストする作業です。

まず`aggregateData`を手動実行し、サマリーシートに集計結果が反映されるか確認します。次に`sendDailyReport`を実行してメールが届くか確認します。最後に`createDailyTrigger`を実行してトリガーを設定します。

### よくあるエラーと解決策

| エラー・症状 | 原因 | 解決策 |
|------------|------|--------|
| 「関数が見つかりませんでした」 | 関数名のタイポ or 保存していない | コード保存（Ctrl+S）後、関数名を確認 |
| 「このアプリはブロックされます」 | OAuth認証が未承認 | 「詳細」→「安全でないページに移動」で承認。GASがGmail送信・スプレッドシート編集の権限を要求します |
| メールが届かない | 送信先アドレスのミス | Logger.log()で送信先を出力して確認 |
| 集計結果が0になる | データ型の不一致（文字列の数字） | 金額列が「数値」形式になっているか確認 |
| トリガーが実行されない | 認証切れ or スクリプトエラー | 「トリガー」画面で「最後の実行」を確認。再認証 |
| 「実行時間の上限を超えました」 | 処理が6分を超過 | getValues()で一括取得、ループ内のAPI呼び出しを削減 |

GASエディタの「実行数」タブ（左メニュー）で過去の実行履歴とエラー内容を確認できます。`Logger.log()`で変数の値を出力し、「実行数」→該当の実行を選択するとログを確認できます。

## 応用・カスタマイズ例

応用・カスタマイズとは、基本の集計・メール送信をベースに業務に合わせた機能を追加していくことです。

### 中小企業向け業務活用シナリオ

| シナリオ | 概要 | 実現難易度 |
|---------|------|----------|
| GAS日報自動化 | カレンダーから予定を取得→スプレッドシートに転記→メールで上司に送信。日報作成が1日5分に短縮 | ★★☆ |
| 月次レポート自動生成 | 月末に売上データを自動集計→グラフ用データ整形→メールで関係者に配信 | ★★☆ |
| 在庫アラート通知 | 在庫数が閾値を下回ったらSlackやメールで自動通知。発注漏れを防止 | ★☆☆ |

Slack通知との組み合わせは[GAS×Slack通知](/articles/gas/gas-slack-notification)で解説しています。LINE通知で社外向けに展開する方法は[GAS×LINE Bot](/articles/gas/gas-line-bot)をご覧ください。

### GASの制限事項

運用前に以下の制限を把握しておきましょう（2026年2月時点）。

| 制限事項 | 上限（無料アカウント） | 対策 |
|---------|---------------------|------|
| スクリプト実行時間 | 6分/回 | getValues()一括取得、ループ最適化 |
| トリガー合計実行時間 | 90分/日 | 処理を分割、不要トリガーを削除 |
| メール送信数 | 100通/日 | 送信先をまとめる、重要度で絞る |
| UrlFetch回数 | 20,000回/日 | 外部API呼び出しを最小化 |

GASを使えば、スプレッドシートのデータ集計・日次レポート・メール送信を約45分で自動化できます。トリガーを設定すれば毎朝自動で集計→送信が完了し、手作業から完全に解放されます。

GASの基礎から学びたい方は[GAS入門ガイド](/articles/gas/gas-basics)をご覧ください。スプレッドシートの自動化データをLINEやSlackで通知する方法は[GAS×LINE Bot](/articles/gas/gas-line-bot)や[GAS×Slack通知](/articles/gas/gas-slack-notification)で解説しています。自動化の費用対効果を試算するには[自動化ROI計算テンプレート](/articles/frameworks/automation-roi-template)をご活用ください。
