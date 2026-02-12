---
title: "GAS × PDF自動生成｜請求書テンプレートから一括作成・送付"
description: "GAS（Google Apps Script）でスプレッドシートのデータからPDF請求書を自動生成する方法を解説。テンプレートへのデータ差し込み・PDF変換・Google Driveへの保存・メール送信まで、コピペで動く完全コード付き。毎月の請求書作成業務を手作業から数分に短縮できます。"
category: "gas"
tags: ["GAS", "PDF", "請求書", "自動化", "Google Apps Script"]
publishedAt: 2026-02-11
updatedAt: 2026-02-11
author: "れん"
difficulty: "beginner"
timeToRead: 15
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "0円"
  totalTime: "PT45M"
faq:
  - question: "GASでPDFを生成するのに費用はかかりますか？"
    answer: "無料です。GASもGoogle DriveもGoogleアカウントがあれば無料で利用できます。PDFのエクスポートにもコストはかかりません。メール送信もGmailの送信上限（無料アカウントで1日100通）の範囲内であれば追加費用なしで利用可能です。"
  - question: "一度に何件の請求書を生成できますか？"
    answer: "GASの実行時間制限（無料アカウントで6分、Google Workspaceで30分）の範囲内であれば、1回の実行で数十件のPDFを生成できます。1件あたり約3〜5秒かかるため、6分制限の場合は約70〜100件が目安です。それ以上の場合はトリガーで分割実行します。"
  - question: "請求書のテンプレートはどうやって作りますか？"
    answer: "Googleスプレッドシートで自由にデザインできます。本記事で紹介するテンプレートのセル配置に従えば、コードをそのまま使えます。自社の既存テンプレートに合わせてコード内のセル番地を変更することも可能です。"
  - question: "生成したPDFをメールで自動送信できますか？"
    answer: "はい、本記事のステップ3で解説しています。GASのGmailApp.sendEmail関数を使い、PDFを添付ファイルとして送信できます。宛先メールアドレスをデータシートに入力しておけば、請求書の生成から送付まで完全に自動化できます。"
relatedArticles:
  - "gas/gas-basics"
  - "gas/gas-spreadsheet-automation"
  - "frameworks/automation-roi-template"
draft: false
---

> この記事は[GASでできること完全ガイド](/articles/gas/gas-basics)の実装編です。
> 「GASとは何か」から知りたい方は、先にそちらをご覧ください。

この記事では、GASでスプレッドシートのデータからPDF請求書を一括生成し、Google Driveへの保存とメール送信まで自動化する手順を解説します。
コードをコピペするだけで動くように、全コードを掲載しています。

### この記事の前提

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Google（Gmail）アカウント |
| 必要な知識 | [GAS入門ガイド](/articles/gas/gas-basics)を読了済み |
| 所要時間 | 約45分 |
| 費用 | 0円（GAS無料枠内） |
| 完成物 | データシートからPDF請求書を一括生成 + メール送信するスクリプト |

## この記事で作るもの

PDF自動生成とは、GASを使ってスプレッドシートのテンプレートにデータを差し込み、PDFファイルとしてエクスポートする仕組みです。今回は以下の流れで動作する自動化を構築します。

```text
「データ」シートの各行
  ↓ データ差し込み
「テンプレート」シート（請求書フォーマット）
  ↓ PDF変換
Google Drive の「請求書PDF」フォルダに保存
  ↓ オプション
メールで自動送付
```

### 手作業との比較

| 項目 | 手作業 | GAS自動化 |
|------|--------|----------|
| 1件あたりの作成時間 | 5〜10分 | 約3秒 |
| 月20件の請求書 | 2〜3時間 | 約1分（実行ボタンを押すだけ） |
| 入力ミスのリスク | あり（コピペミス等） | なし（データシートから自動転記） |
| 送付作業 | 1件ずつメール作成 | 一括自動送信 |

毎月の請求書作成に2〜3時間かけている場合、年間で約30時間の削減になります。費用対効果の計算方法は[自動化ROI計算テンプレート](/articles/frameworks/automation-roi-template)で解説しています。

## 準備・テンプレート作成

準備・テンプレート作成とは、PDF請求書を自動生成するために必要なスプレッドシートの構成を整える作業のことです。

### スプレッドシートの全体構成

1つのスプレッドシートに以下の2つのシートを作成します。

| シート名 | 役割 | 内容 |
|---------|------|------|
| テンプレート | 請求書のフォーマット | PDF出力用のレイアウト |
| データ | 請求書ごとの入力データ | 1行＝1件の請求書情報 |

### 「テンプレート」シートの作成

以下のレイアウトでスプレッドシートに請求書テンプレートを作成してください。セル番地がコードと対応しているため、配置を合わせることが重要です。

| セル | 内容 | 備考 |
|------|------|------|
| D2 | 請求書番号 | スクリプトが自動入力 |
| D3 | 請求日 | スクリプトが自動入力 |
| B5 | 顧客名 + 「御中」 | スクリプトが自動入力 |
| B8 | 「件名：」+ 件名 | スクリプトが自動入力 |
| A11 | 「品目」（ヘッダー） | 手動で入力しておく |
| B11 | 「数量」（ヘッダー） | 手動で入力しておく |
| C11 | 「単価」（ヘッダー） | 手動で入力しておく |
| D11 | 「金額」（ヘッダー） | 手動で入力しておく |
| A12〜A14 | 品目名（3行分） | スクリプトが自動入力 |
| B12〜B14 | 数量 | スクリプトが自動入力 |
| C12〜C14 | 単価 | スクリプトが自動入力 |
| D12〜D14 | 金額（数量×単価の数式） | `=B12*C12` を設定 |
| D16 | 小計 | `=SUM(D12:D14)` を設定 |
| D17 | 消費税（10%） | `=D16*0.1` を設定 |
| D18 | 合計金額 | `=D16+D17` を設定 |
| B20 | 振込期限 | スクリプトが自動入力 |
| B22 | 振込先情報 | 手動で入力しておく（自社の口座情報） |

A1セルに自社名、余白の調整、罫線の装飾は自由に設定してください。PDF出力時にそのまま反映されます。

### 「データ」シートの作成

1行目にヘッダー、2行目以降にデータを入力します。

| A列 | B列 | C列 | D列 | E列 | F列 | G列 | H列 | I列 | J列 | K列 | L列 | M列 |
|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| 請求番号 | 請求日 | 顧客名 | 件名 | 品目1 | 数量1 | 単価1 | 品目2 | 数量2 | 単価2 | 品目3 | 振込期限 | メール |

N列は「生成済み」フラグ列として使用します（スクリプトが自動で「済」と記入）。

サンプルデータ例:

| 請求番号 | 請求日 | 顧客名 | 件名 | 品目1 | 数量1 | 単価1 | 品目2 | 数量2 | 単価2 | 品目3 | 振込期限 | メール |
|---------|--------|--------|------|-------|-------|-------|-------|-------|-------|-------|---------|--------|
| INV-2026-001 | 2026/02/28 | 株式会社サンプル | Webサイト制作 | デザイン費 | 1 | 200000 | コーディング費 | 1 | 300000 | | 2026/03/31 | sample@example.com |

## 実装手順

実装手順とは、テンプレートの準備が完了した状態から、GASスクリプトを作成してPDF自動生成を完成させるまでの作業のことです。

### ステップ1: スクリプトエディタを開く

スプレッドシートのメニューから「拡張機能」→「Apps Script」を選択し、スクリプトエディタを開きます。

### ステップ2: PDF生成スクリプトを入力

エディタに表示されている `function myFunction() {}` をすべて削除し、以下のコードを貼り付けてください。

```javascript
/**
 * 請求書PDF一括生成スクリプト
 * 「データ」シートの各行から「テンプレート」シートにデータを差し込み、PDFを生成
 */

/** メイン実行：全未処理の請求書をPDF化 */
function generateAllInvoices() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dataSheet = ss.getSheetByName("データ");
  var templateSheet = ss.getSheetByName("テンプレート");

  var data = dataSheet.getDataRange().getValues();
  // data[0] = ヘッダー行、data[1]以降がデータ

  // PDF保存フォルダ（なければ作成）
  var folderName = "請求書PDF_" + Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyyMM");
  var folders = DriveApp.getFoldersByName(folderName);
  var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

  var count = 0;

  for (var i = 1; i < data.length; i++) {
    var row = data[i];

    // N列（14列目）が「済」なら処理をスキップ
    if (row[13] === "済") continue;

    // 空行をスキップ
    if (!row[0]) continue;

    // テンプレートにデータを差し込む
    fillTemplate(templateSheet, row);
    SpreadsheetApp.flush();
    Utilities.sleep(2000); // PDF生成を安定させるための待機

    // PDFを生成してフォルダに保存
    var fileName = "請求書_" + row[0] + "_" + row[2];
    var pdf = exportSheetAsPdf(ss.getId(), templateSheet.getSheetId(), fileName);
    folder.createFile(pdf);

    // N列に「済」を記入
    dataSheet.getRange(i + 1, 14).setValue("済");
    count++;
  }

  // テンプレートをクリア
  clearTemplate(templateSheet);

  SpreadsheetApp.getUi().alert(
    count + "件の請求書PDFを生成しました。\n保存先フォルダ: " + folderName
  );
}

/** テンプレートシートにデータを差し込む */
function fillTemplate(sheet, row) {
  sheet.getRange("D2").setValue(row[0]);   // 請求番号
  sheet.getRange("D3").setValue(row[1]);   // 請求日
  sheet.getRange("B5").setValue(row[2] + " 御中"); // 顧客名
  sheet.getRange("B8").setValue("件名：" + row[3]); // 件名

  // 品目1（A12〜C12）
  sheet.getRange("A12").setValue(row[4]);  // 品目名
  sheet.getRange("B12").setValue(row[5]);  // 数量
  sheet.getRange("C12").setValue(row[6]);  // 単価

  // 品目2（A13〜C13）
  sheet.getRange("A13").setValue(row[7] || "");
  sheet.getRange("B13").setValue(row[8] || "");
  sheet.getRange("C13").setValue(row[9] || "");

  // 品目3（A14〜C14）— 未入力の場合は空欄
  sheet.getRange("A14").setValue(row[10] || "");
  sheet.getRange("B14").setValue(row[10] ? 1 : "");
  sheet.getRange("C14").setValue("");

  // 振込期限
  sheet.getRange("B20").setValue(row[11]); // 振込期限
}

/** テンプレートシートをクリア */
function clearTemplate(sheet) {
  var rangesToClear = ["D2", "D3", "B5", "B8", "A12:C14", "B20"];
  rangesToClear.forEach(function(range) {
    sheet.getRange(range).clearContent();
  });
}

/** スプレッドシートの特定シートをPDFとしてエクスポート */
function exportSheetAsPdf(ssId, sheetId, fileName) {
  var url = "https://docs.google.com/spreadsheets/d/" + ssId + "/export?"
    + "format=pdf"
    + "&gid=" + sheetId
    + "&portrait=true"
    + "&size=A4"
    + "&fitw=true"
    + "&gridlines=false"
    + "&top_margin=0.50"
    + "&bottom_margin=0.50"
    + "&left_margin=0.60"
    + "&right_margin=0.60";

  var options = {
    headers: { Authorization: "Bearer " + ScriptApp.getOAuthToken() },
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(url, options);

  if (response.getResponseCode() !== 200) {
    throw new Error("PDF生成に失敗しました: " + response.getContentText());
  }

  return response.getBlob().setName(fileName + ".pdf");
}
```

**このコードのポイント:**

- `exportSheetAsPdf` 関数がスプレッドシートのエクスポートURLを使ってPDFを生成します。Google公式のエクスポート機能を利用するため、追加ライブラリは不要です
- `SpreadsheetApp.flush()` でテンプレートへの書き込みを確実に反映してからPDF化します
- `Utilities.sleep(2000)` で2秒の待機を入れることで、PDF生成の安定性を確保しています
- N列の「済」フラグにより、同じ請求書を重複生成しません

### ステップ3: メール送信機能を追加（オプション）

PDFをメールで自動送付したい場合は、以下のコードを追加してください。

```javascript
/** 請求書PDFをメールで送信 */
function sendInvoiceEmail(email, customerName, invoiceNo, pdf) {
  var subject = "【請求書送付】" + invoiceNo + " " + customerName + " 様";
  var body = customerName + " 様\n\n"
    + "いつもお世話になっております。\n"
    + "請求書を添付いたしますので、ご査収のほどよろしくお願いいたします。\n\n"
    + "ご不明な点がございましたら、お気軽にお問い合わせください。\n\n"
    + "よろしくお願いいたします。";

  GmailApp.sendEmail(email, subject, body, {
    attachments: [pdf],
    name: "あなたの会社名"  // 送信者名を自社名に変更してください
  });
}

/** メイン実行（PDF生成 + メール送信版） */
function generateAndSendInvoices() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dataSheet = ss.getSheetByName("データ");
  var templateSheet = ss.getSheetByName("テンプレート");

  var data = dataSheet.getDataRange().getValues();

  var folderName = "請求書PDF_" + Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyyMM");
  var folders = DriveApp.getFoldersByName(folderName);
  var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

  var count = 0;

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    if (row[13] === "済" || !row[0]) continue;

    fillTemplate(templateSheet, row);
    SpreadsheetApp.flush();
    Utilities.sleep(2000);

    var fileName = "請求書_" + row[0] + "_" + row[2];
    var pdf = exportSheetAsPdf(ss.getId(), templateSheet.getSheetId(), fileName);
    folder.createFile(pdf);

    // M列（13列目）にメールアドレスがあれば送信
    var email = row[12];
    if (email) {
      sendInvoiceEmail(email, row[2], row[0], pdf);
    }

    dataSheet.getRange(i + 1, 14).setValue("済");
    count++;
  }

  clearTemplate(templateSheet);

  SpreadsheetApp.getUi().alert(
    count + "件の請求書PDFを生成・送信しました。\n保存先フォルダ: " + folderName
  );
}
```

**このコードのポイント:**

- M列（メール列）にアドレスが入力されている場合のみメールを送信します
- `GmailApp.sendEmail` のオプションで送信者名を設定できます
- 無料アカウントのGmail送信上限は1日100通です（2026年2月時点）

### メニューへの追加（実行をさらに簡単に）

スプレッドシートにカスタムメニューを追加すると、ボタン一つで実行できます。

```javascript
/** スプレッドシート起動時にカスタムメニューを追加 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("請求書ツール")
    .addItem("PDF一括生成", "generateAllInvoices")
    .addItem("PDF生成 + メール送信", "generateAndSendInvoices")
    .addToUi();
}
```

スクリプトを保存してスプレッドシートを再読み込みすると、メニューバーに「請求書ツール」が表示されます。

## 動作確認・トラブルシューティング

トラブルシューティングとは、スクリプトの実行時に発生するエラーや問題を解決する作業のことです。

### テスト手順

1. 「データ」シートにサンプルデータを1行入力します
2. スクリプトエディタで `generateAllInvoices` を選択して実行します
3. 初回実行時に権限の承認を求められるので、「許可」をクリックします
4. Google Driveに「請求書PDF_202602」フォルダが作成され、PDFが保存されていれば成功です

### よくあるエラーと解決策

| エラー | 原因 | 解決策 |
|--------|------|--------|
| 「このアプリはブロックされます」 | Googleのセキュリティ警告 | 「詳細」→「安全ではないページに移動」で承認 |
| `TypeError: Cannot read properties of null` | シート名の不一致 | 「テンプレート」「データ」のシート名を正確に一致させる |
| PDFが真っ白 | `flush()` 前にPDF化されている | `Utilities.sleep()` の待機時間を3000以上に延長 |
| PDFにグリッド線が表示される | エクスポート設定の問題 | URLパラメータの `gridlines=false` を確認 |
| `Exception: Request failed` | スプレッドシートIDの取得失敗 | `ss.getId()` が正しいか確認。共有設定を見直す |
| 6分の実行時間制限に到達 | 大量の請求書を一度に処理 | 「済」フラグで途中再開が可能。件数を分けて実行 |
| メールが送信されない | Gmail送信上限の超過 | 1日100通の上限を確認。翌日に再実行 |

### PDF出力のカスタマイズパラメータ

`exportSheetAsPdf` 関数のURLパラメータで出力を調整できます。

| パラメータ | 値 | 説明 |
|-----------|-----|------|
| `portrait` | true / false | 縦向き / 横向き |
| `size` | A4 / letter / legal | 用紙サイズ |
| `fitw` | true / false | 幅を用紙に合わせる |
| `gridlines` | true / false | グリッド線の表示 |
| `top_margin` | 0.00〜1.00 | 上余白（インチ） |
| `scale` | 1 / 2 / 3 / 4 | 1:通常 / 2:幅に合わせる / 3:高さに合わせる / 4:ページに合わせる |

## 応用・カスタマイズ例

応用・カスタマイズとは、本記事の請求書PDF生成スクリプトをベースに、他の業務文書にも展開することです。

### 報告書・見積書への応用

同じ仕組みで、以下の業務文書もPDF自動生成できます。

- **見積書** — テンプレートのレイアウトを見積書形式に変更するだけで対応可能
- **月次報告書** — [スプレッドシート自動集計](/articles/gas/gas-spreadsheet-automation)で集計したデータをテンプレートに差し込んでPDF化
- **納品書・領収書** — 請求書テンプレートを複製してレイアウトを調整

### 定期実行の設定

毎月末に自動で請求書を生成したい場合は、トリガーを設定します。

1. スクリプトエディタの左メニューから「トリガー」（時計アイコン）を選択
2. 「トリガーを追加」をクリック
3. 関数: `generateAllInvoices`、イベントソース: 「時間主導型」、タイプ: 「月ベースのタイマー」を選択

トリガーの詳細は[GASでスプレッドシート自動化](/articles/gas/gas-spreadsheet-automation)で解説しています。

### Google Docsテンプレートを使う方法

表計算が不要な報告書や送付状には、Google Docsテンプレートとプレースホルダー置換を使う方法もあります。テンプレート内の `{{顧客名}}` `{{日付}}` などの文字列を `body.replaceText()` で一括置換し、PDFにエクスポートする流れです。

GASの全体像を知りたい方は[GASでできること完全ガイド](/articles/gas/gas-basics)を、AI APIとの連携で請求書の自動分類まで行いたい方は[Claude API入門](/articles/ai-api/claude-api-intro)をご覧ください。
