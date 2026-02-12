---
title: "GAS基礎文法まとめ｜コピペで使えるリファレンス"
description: "Google Apps Script（GAS）の基礎文法をコピペで使えるリファレンス形式でまとめました。変数・関数・条件分岐・ループ・スプレッドシート操作・日付処理・外部API呼び出しまで、業務自動化で頻出するコードパターンを逆引きで参照できます。"
category: "gas"
tags: ["GAS", "Google Apps Script", "リファレンス", "基礎文法", "コード例"]
publishedAt: 2026-02-12
updatedAt: 2026-02-12
author: "れん"
difficulty: "beginner"
timeToRead: 10
layer: "execution"
articleType: "reference"
schema:
  type: "Article"
faq:
  - question: "GASはJavaScriptと同じ文法ですか？"
    answer: "はい、GASはJavaScriptベースの言語です。基本的な文法（変数、関数、条件分岐、ループ等）はJavaScriptと同じです。GAS独自の部分は、SpreadsheetAppやGmailAppなどGoogleサービスを操作するための組み込みオブジェクトです。"
  - question: "GASで使えるJavaScriptのバージョンは？"
    answer: "GASはV8ランタイムに対応しており、ES2020相当のモダンなJavaScript構文（const/let、アロー関数、テンプレートリテラル等）が使えます（2026年2月時点）。"
  - question: "このリファレンスの使い方は？"
    answer: "業務自動化スクリプトを書く際に「逆引き辞典」として使ってください。やりたいことから目次でセクションを探し、コード例をコピペして使えます。各コードは単体で動作するように記載しています。"
relatedArticles:
  - "gas/gas-basics"
  - "gas/gas-spreadsheet-automation"
  - "frameworks/prompt-engineering-business"
draft: false
---

> この記事は[GASでできること完全ガイド](/articles/gas/gas-basics)の補足リファレンスです。

Google Apps Script（GAS）の基礎文法と業務自動化で頻出するコードパターンを逆引き形式でまとめています。
変数宣言・スプレッドシート操作・Gmail送信・日付処理・外部API連携の5カテゴリ、約30のコードパターンを収録しています。
スクリプト作成時にコピペでお使いください。

| 前提 | 内容 |
|------|------|
| 対象読者 | GASで業務自動化を始めたい方 |
| 前提知識 | Googleアカウントがあること |
| 動作環境 | GASスクリプトエディタ（ブラウザ上で動作） |

## 基本文法

GASの基本文法とは、変数宣言・関数定義・条件分岐・ループなどプログラムの土台となる書き方のことです。

### 変数と定数

```javascript
// 変更しない値は const
const TAX_RATE = 0.1;

// 変更する値は let
let total = 0;

// 文字列の結合（テンプレートリテラル: 文字列中に変数を埋め込む書き方）
const name = "田中";
const message = `${name} 様、こんにちは。`;
```

### 関数の定義

```javascript
// 基本的な関数
function calculateTotal(price, quantity) {
  return price * quantity;
}

// アロー関数（`=>` を使った短い関数の書き方）
const double = (n) => n * 2;
```

### 条件分岐

```javascript
// if文
function checkStatus(value) {
  if (value >= 100) {
    return "達成";
  } else if (value >= 50) {
    return "進行中";
  } else {
    return "未着手";
  }
}

// 三項演算子（短い条件）
const label = score >= 80 ? "合格" : "不合格";
```

### ループ

```javascript
// for文（回数指定）
for (let i = 0; i < 10; i++) {
  console.log(i);
}

// 配列のループ（forEach）
const items = ["商品A", "商品B", "商品C"];
items.forEach(function(item, index) {
  console.log(index + ": " + item);
});
```

### 配列とオブジェクト

```javascript
// 配列
const fruits = ["りんご", "みかん", "ぶどう"];
fruits.push("いちご");           // 末尾に追加
const first = fruits[0];         // "りんご"
const count = fruits.length;     // 4

// オブジェクト（キーと値のペア）
const employee = {
  name: "田中太郎",
  department: "営業部",
  email: "tanaka@example.com"
};
const dept = employee.department; // "営業部"
```

## スプレッドシート操作

スプレッドシート操作とは、GASからスプレッドシートのデータを読み書きするためのメソッド群のことです。

| メソッド | 説明 | 戻り値 |
|---------|------|--------|
| `SpreadsheetApp.getActiveSpreadsheet()` | 現在のスプレッドシートを取得 | Spreadsheet |
| `ss.getSheetByName("シート名")` | 名前でシートを取得 | Sheet |
| `sheet.getRange("A1")` | セルを指定 | Range |
| `sheet.getDataRange()` | データがある範囲全体を取得 | Range |
| `range.getValue()` | セルの値を取得 | any |
| `range.getValues()` | 範囲の値を2次元配列で取得 | any[][] |
| `range.setValue(value)` | セルに値を設定 | void |
| `range.setValues(values)` | 範囲に2次元配列で一括設定 | void |
| `sheet.getLastRow()` | データがある最終行番号 | number |

### よく使うパターン

```javascript
// 全データを一括取得して処理（高速）
function processAllData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("データ");
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) { // 1行目はヘッダー
    const name = data[i][0];   // A列
    const amount = data[i][1]; // B列
    console.log(name + ": " + amount);
  }
}

// 最終行の次に行を追加
function appendRow() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow(["田中", 50000, new Date()]);
}

// セルの書式設定
function formatCells() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const range = sheet.getRange("A1:D1");
  range.setFontWeight("bold");
  range.setBackground("#4285f4");
  range.setFontColor("#ffffff");
}
```

**パフォーマンスのコツ:** ループ内で `getValue()` / `setValue()` を繰り返すと処理が遅くなります。
`getValues()` で一括取得し、配列を加工してから `setValues()` で一括書き込みするのが高速化の基本です。

## Gmail操作

Gmail操作とは、GASからメールの送信・検索・取得を行うためのメソッド群のことです。

| メソッド | 説明 | 備考 |
|---------|------|------|
| `GmailApp.sendEmail(to, subject, body)` | メール送信 | 無料100通/日（2026年2月時点、[公式ドキュメント](https://developers.google.com/apps-script/guides/services/quotas)参照） |
| `GmailApp.sendEmail(to, subject, body, options)` | オプション付き送信 | CC, BCC, 添付ファイル等 |
| `GmailApp.search(query)` | Gmail検索 | Gmail検索構文が使える |
| `thread.getMessages()` | スレッド内のメッセージ一覧 | |
| `message.getFrom()` | 送信元アドレス | |
| `message.getSubject()` | 件名 | |
| `message.getPlainBody()` | 本文（テキスト） | |

```javascript
// メール送信（CC・添付ファイル付き）
GmailApp.sendEmail("to@example.com", "件名", "本文", {
  cc: "cc@example.com",
  name: "送信者名",
  attachments: [file.getBlob()]
});

// メール検索（直近24時間の未読メール）
const threads = GmailApp.search("is:unread newer_than:1d");
```

詳しい実装例は[GASでメール自動化](/articles/gas/gas-mail-automation)をご覧ください。

## 日付・時刻処理

日付・時刻処理とは、日付の生成・フォーマット変換・差分計算などの操作のことです。

```javascript
// 現在日時
const now = new Date();

// GAS専用のフォーマット関数
const formatted = Utilities.formatDate(now, "Asia/Tokyo", "yyyy/MM/dd HH:mm:ss");
// → "2026/02/12 09:30:00"

// N日後・N日前の計算
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const lastWeek = new Date();
lastWeek.setDate(lastWeek.getDate() - 7);

// 月末日の取得（翌月の0日 = 当月末日）
const lastDay = new Date(2026, 2, 0); // 2026年2月の末日
```

**日付フォーマットのパターン**

| パターン | 意味 | 例 |
|---------|------|-----|
| yyyy | 年（4桁） | 2026 |
| MM | 月（2桁） | 02 |
| dd | 日（2桁） | 12 |
| HH | 時（24時間） | 09 |
| mm | 分 | 30 |
| ss | 秒 | 00 |

## 外部API呼び出し

外部API呼び出しとは、GASから外部のWebサービス（Slack、Discord、AI API等）にHTTPリクエストを送信する方法のことです。

```javascript
// GETリクエスト
function fetchData(url) {
  const response = UrlFetchApp.fetch(url);
  const data = JSON.parse(response.getContentText()); // JSON.parse: JSON文字列をオブジェクトに変換する関数
  return data;
}

// POSTリクエスト（JSON送信）
function postJson(url, payload) {
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload), // JSON.stringify: オブジェクトをJSON文字列に変換する関数
    muteHttpExceptions: true
  };
  const response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText());
}

// APIキーをスクリプトプロパティから取得（推奨）
function getApiKey() {
  // スクリプトプロパティ: GASプロジェクトに安全に値を保存できる仕組み
  return PropertiesService.getScriptProperties().getProperty("API_KEY");
}
```

**重要:** APIキーやWebhook URLはスクリプトプロパティに保管してください。
コードにハードコードすると漏洩リスクがあります。
設定方法: スクリプトエディタの「プロジェクトの設定」→「スクリプトプロパティ」。

各API連携の詳細は[Claude API入門](/articles/ai-api/claude-api-intro)・[OpenAI API入門](/articles/ai-api/openai-api-intro)・[GAS × Slack通知](/articles/gas/gas-slack-notification)をご覧ください。

## 外部連携・ユーティリティ

外部連携・ユーティリティとは、定期実行のトリガー設定や処理の待機・同期など、業務自動化の運用を支えるメソッド群のことです。

| メソッド | 説明 | 用途 |
|---------|------|------|
| `ScriptApp.newTrigger("func").timeBased()...create()` | 時間トリガーを作成 | 定期実行 |
| `Utilities.sleep(ms)` | ミリ秒単位で待機 | API制限対策 |
| `SpreadsheetApp.flush()` | 書き込みを即座に反映 | PDF生成前の同期 |
| `Browser.msgBox("メッセージ")` | ダイアログ表示 | ユーザー確認 |
| `console.log("ログ")` | 実行ログに出力 | デバッグ |

### トリガー設定のコード例

```javascript
// 毎日9時に実行するトリガーを作成
function createDailyTrigger() {
  ScriptApp.newTrigger("myFunction")
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .create();
}

// 毎時実行のトリガーを作成
function createHourlyTrigger() {
  ScriptApp.newTrigger("myFunction")
    .timeBased()
    .everyHours(1)
    .create();
}

// 設定済みトリガーを全削除
function deleteAllTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
}

// API呼び出しの間隔調整（1秒待機）
function callApiWithDelay() {
  const urls = ["https://api.example.com/1", "https://api.example.com/2"];
  urls.forEach(url => {
    UrlFetchApp.fetch(url);
    Utilities.sleep(1000); // 1秒 = 1000ミリ秒
  });
}
```

## 関連リソース

- 公式ドキュメント: [Google Apps Script リファレンス](https://developers.google.com/apps-script/reference)
- GAS入門: [GASでできること完全ガイド](/articles/gas/gas-basics)
- スプレッドシート活用: [GASでスプレッドシート自動化](/articles/gas/gas-spreadsheet-automation)
- PDF生成: [GAS × PDF自動生成](/articles/gas/gas-pdf-generation)
