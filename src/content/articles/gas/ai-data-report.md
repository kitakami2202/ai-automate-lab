---
title: "AI × 定型レポート自動生成｜スプシ→PDF"
description: "GASとClaude APIで定型レポート自動化を実現する方法を解説。売上データの月次集計→AI傾向分析コメント生成→PDF出力→メール送信を一気通貫で自動化するスクリプトをコード付きで紹介。毎月数時間の手作業を削減できます。"
category: "gas"
tags: ["GAS", "AI", "レポート自動生成", "PDF", "スプレッドシート"]
publishedAt: 2026-02-12
updatedAt: 2026-02-12
author: "れん"
difficulty: "beginner"
timeToRead: 12
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "月約200円〜（2026年2月時点）"
  totalTime: "PT45M"
faq:
  - question: "AIがデータ分析のコメントも自動生成してくれますか？"
    answer: "はい、スプレッドシートの数値データをAI APIに送信すると、前月比の増減分析や改善提案などのコメントを自動生成します。経営者向けのサマリーコメントを人手を介さず作成できます。"
  - question: "PDF以外の形式で出力できますか？"
    answer: "Google Docsにテンプレートを用意しておけば、GASからデータとAIコメントを差し込んでPDF・Googleドキュメント・メール本文など様々な形式で出力可能です。"
  - question: "定期実行は可能ですか？"
    answer: "はい、GASのトリガーで毎日・毎週・毎月の自動実行を設定できます。毎朝の売上日報、月初の月次報告を完全自動化できます。"
relatedArticles:
  - "gas/gas-pdf-generation"
  - "gas/gas-claude-api"
  - "frameworks/ai-business-overview"
draft: false
---

> この記事は[GASでできること完全ガイド](/articles/gas/gas-basics)の応用編です。
> PDF生成の基本は[GAS × PDF自動生成](/articles/gas/gas-pdf-generation)、AI API連携は[GAS × Claude API連携](/articles/gas/gas-claude-api)を先にご覧ください。

この記事では、定型レポート自動化の仕組みをGAS+Claude APIで約45分で構築する手順を解説します。
スプレッドシートの業務データをAIで分析し、コメント付きレポートを自動生成・配信すれば、毎月数時間の手作業を削減できます。

## この記事で作るもの

AI定型レポート自動生成とは、スプレッドシートの数値データをGASで集計し、AIで分析コメントを生成して、テンプレートに差し込みレポートを完成させる仕組みです。
定型レポートの自動化により、集計・文章作成・配信の手間をまとめて削減できます。

### この記事の前提

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Google、Anthropic |
| 必要な知識 | [GAS × PDF生成](/articles/gas/gas-pdf-generation)と[GAS × Claude API](/articles/gas/gas-claude-api)を読了済み |
| 所要時間 | 約45分 |
| 費用 | GAS: 0円 / Claude API: 月約200円（[公式料金](https://platform.claude.com/docs/en/about-claude/pricing)参照・2026年2月時点） |
| 完成物 | AI分析コメント付き定型レポートの自動生成 |

| ステップ | 内容 | 担当 |
|---------|------|------|
| 1. データ集計 | スプレッドシートの数値を集計 | GAS |
| 2. AI分析 | 集計結果の傾向分析・改善提案を生成 | Claude API |
| 3. シート準備 | レポート出力先のテンプレートを作成 | 手動 |
| 4. レポート生成・配信 | テンプレートにデータを差し込みPDF送信 | GAS |

## 実装手順

ここでは、データ集計・AI分析・シート準備・レポート生成の4ステップを順に実装します。

### ステップ1: データ集計

まず、「売上データ」シートを以下のカラム構成で準備してください。

| A列（日付） | B列（カテゴリ） | C列（金額） |
|------------|----------------|------------|
| 2026-02-01 | 商品A | 50000 |
| 2026-02-03 | 商品B | 32000 |
| 2026-02-10 | 商品A | 48000 |

1行目はヘッダー行です。2行目以降に実際の売上データを入力してください。

```javascript
/**
 * 売上データを集計
 */
function aggregateSalesData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("売上データ");
  var data = sheet.getDataRange().getValues();

  var today = new Date();
  var targetMonth = Utilities.formatDate(today, "Asia/Tokyo", "yyyy-MM");
  var totalSales = 0;
  var itemCount = 0;
  var categoryTotals = {};

  for (var i = 1; i < data.length; i++) {
    var rowDate = Utilities.formatDate(new Date(data[i][0]), "Asia/Tokyo", "yyyy-MM");
    if (rowDate !== targetMonth) continue;

    var category = data[i][1];
    var amount = Number(data[i][2]) || 0;
    totalSales += amount;
    itemCount++;
    categoryTotals[category] = (categoryTotals[category] || 0) + amount;
  }

  return {
    month: targetMonth,
    totalSales: totalSales,
    itemCount: itemCount,
    categoryTotals: categoryTotals
  };
}
```

### ステップ2: AI分析コメントの生成

AI分析コメント生成とは、集計済みの数値データをClaude APIに送信し、傾向分析や改善提案のコメントを自動で作成する処理です。

```javascript
/**
 * 集計データをAIで分析しコメントを生成
 */
function generateAnalysis(salesData) {
  var apiKey = PropertiesService.getScriptProperties().getProperty("ANTHROPIC_API_KEY");

  var dataText =
    "期間: " + salesData.month + "\n" +
    "売上合計: " + salesData.totalSales.toLocaleString() + "円\n" +
    "取引件数: " + salesData.itemCount + "件\n" +
    "カテゴリ別: " + JSON.stringify(salesData.categoryTotals);

  var payload = {
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: "あなたは経営コンサルタントです。売上データを分析し、以下の形式で200文字以内のコメントを作成してください：\n1. 全体の傾向（1文）\n2. 注目ポイント（1文）\n3. 改善提案（1文）",
    messages: [{ role: "user", content: dataText }]
  };

  var options = {
    method: "post",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch("https://api.anthropic.com/v1/messages", options);
  var result = JSON.parse(response.getContentText());

  if (result.error) {
    throw new Error("Claude API エラー: " + result.error.message);
  }

  return result.content[0].text;
}
```

### ステップ3: レポートシートの準備

ステップ3では、レポート出力先となる「レポート」シートをスプレッドシート内に作成します。
以下のセル配置でテンプレートを準備してください。

| セル | A列（ラベル） | B列（値） |
|------|-------------|----------|
| 2行目 | 対象月 | （スクリプトが自動入力） |
| 3行目 | 売上合計 | （スクリプトが自動入力） |
| 4行目 | 取引件数 | （スクリプトが自動入力） |
| 5行目 | （空行） | |
| 6行目 | AI分析コメント | （スクリプトが自動入力） |

1行目はタイトル行として「月次売上レポート」などの見出しを入れると、PDF出力時の見栄えが良くなります。
A列にラベルを手動で入力し、B列はスクリプトが自動で書き込みます。

### ステップ4: レポート生成と配信

```javascript
/**
 * 月次レポートを生成してメール送信
 */
function generateMonthlyReport() {
  var salesData = aggregateSalesData();
  var analysis = generateAnalysis(salesData);

  // レポート用スプレッドシートにデータを書き込み
  var reportSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("レポート");
  reportSheet.getRange("B2").setValue(salesData.month);
  reportSheet.getRange("B3").setValue(salesData.totalSales);
  reportSheet.getRange("B4").setValue(salesData.itemCount);
  reportSheet.getRange("B6").setValue(analysis);
  SpreadsheetApp.flush(); // flush()は書き込みを即座にスプレッドシートへ反映させるメソッドです

  // PDFとして出力
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var url = ss.getUrl().replace(/\/edit.*$/, "") +
    "/export?format=pdf&gid=" + reportSheet.getSheetId();
  var pdf = UrlFetchApp.fetch(url, {
    headers: { Authorization: "Bearer " + ScriptApp.getOAuthToken() }
  }).getBlob().setName("月次レポート_" + salesData.month + ".pdf");

  // メール送信
  GmailApp.sendEmail(
    "manager@example.com",
    "【月次レポート】" + salesData.month,
    "月次売上レポートを添付します。\n\n" + analysis,
    { attachments: [pdf] }
  );
}
```

**トリガー設定:**

GASのトリガー（指定した日時に自動でスクリプトを実行する機能）を設定すると、レポート生成を定期的に自動実行できます。

| 関数 | トリガー | 設定 |
|------|---------|------|
| `generateMonthlyReport` | 時間主導型 → 月ベースのタイマー | 毎月1日 |

## 動作確認・トラブルシューティング

動作確認とは、構築したレポート自動生成の仕組みが想定どおりに動くかテストする作業です。

### テスト手順

以下のステップで順に動作を確認してください。

1. **手動実行**: GASエディタで `generateMonthlyReport` を選択し、「実行」をクリックします。
   初回実行時はOAuth（外部サービスへの安全なアクセス認可の仕組み）の権限承認が求められます。
   画面の指示に従って承認してください。
2. **ログ確認**: GASエディタの「実行数」タブで実行が成功しているか確認します。エラーが出ている場合はメッセージを参照してください。
3. **出力確認**: 「レポート」シートにデータとAI分析コメントが書き込まれていること、指定アドレスにPDF付きメールが届いていることを確認します。

### よくあるエラーと解決策

| エラー | 原因 | 解決策 |
|--------|------|--------|
| PDF生成エラー | OAuth認証の不備 | スクリプトを手動実行して権限を承認 |
| AI分析が的外れ | データの説明不足 | プロンプトに前月データや目標値を追加 |
| メールが送信されない | 送信先アドレスの誤り | GmailApp.sendEmailの引数を確認 |

## 応用・カスタマイズ例

基本の月次レポートを軸に、KPIダッシュボードやグラフ付きレポートなど業務に合わせたカスタマイズが可能です。

- **KPIダッシュボード** — 複数KPIを集計し、目標達成率と併せてレポート化
- **グラフ付きレポート** — スプレッドシートのグラフを含むPDFを生成
- **Slack配信** — PDF添付ではなく[Slack通知](/articles/gas/gas-slack-notification)でサマリーを即時共有
- **日次売上日報の自動配信** — 毎朝の売上データを集計し、AIコメント付きで上司へ自動送信。日報作成の手間を1日5分に短縮可能
- **月次経費集計レポート** — 経費データをカテゴリ別に自動集計し、予算との差異をAIが分析。経理担当者の月末作業を大幅に効率化

GASの全体像は[GASでできること完全ガイド](/articles/gas/gas-basics)、PDF生成の詳細は[GAS × PDF自動生成](/articles/gas/gas-pdf-generation)をご覧ください。
