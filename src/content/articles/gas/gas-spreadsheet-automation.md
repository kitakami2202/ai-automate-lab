---
title: "GASでスプレッドシート業務を自動化する実践テクニック"
description: "Google Apps Scriptを使ってスプレッドシートの日常業務を自動化する方法を解説。データ集計、レポート生成、メール送信まで実践的なテクニックを紹介します。"
category: "gas"
tags: ["GAS", "スプレッドシート", "自動化", "業務効率化"]
publishedAt: 2025-02-15
updatedAt: 2025-02-15
author: "れん"
difficulty: "beginner"
timeToRead: 15
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  totalTime: "PT45M"
  estimatedCost: "0"
relatedArticles: ["gas/gas-basics", "gas/gas-slack-notification", "frameworks/automation-roi-template"]
draft: false
faq:
  - question: "GASでスプレッドシートの自動化はどのくらい時間短縮できますか？"
    answer: "業務内容によりますが、定型的なデータ集計やレポート作成であれば、月あたり数時間〜数十時間の削減が期待できます。"
  - question: "GASのトリガー機能とは何ですか？"
    answer: "トリガーは、特定の条件（時間、イベント）でスクリプトを自動実行する機能です。毎日決まった時間にレポートを生成するなどの定期実行に利用できます。"
  - question: "スプレッドシートの大量データでGASは遅くなりますか？"
    answer: "はい。数万行を超えるデータの場合、処理速度が低下することがあります。バッチ処理やキャッシュの活用で最適化できます。"
---

## スプレッドシート自動化の基本

スプレッドシートの繰り返し作業をGASで自動化すると、大幅な時間削減が可能です。

## データの自動集計

```javascript
function aggregateData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('売上データ');
  const data = sheet.getDataRange().getValues();

  let total = 0;
  for (let i = 1; i < data.length; i++) {
    total += data[i][2]; // 3列目が金額
  }

  const summarySheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('サマリー');
  summarySheet.getRange('B2').setValue(total);
  summarySheet.getRange('B3').setValue(new Date());
}
```

## 日次レポートの自動生成

毎日決まった時間にレポートを生成し、メールで送信する仕組みを構築できます。

```javascript
function sendDailyReport() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('サマリー');
  const total = sheet.getRange('B2').getValue();
  const date = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd');

  GmailApp.sendEmail(
    'team@example.com',
    `【日次レポート】${date}`,
    `本日の売上合計: ¥${total.toLocaleString()}`
  );
}
```

## まとめ

GASによるスプレッドシート自動化は、業務効率化の第一歩として最適です。小さな自動化から始めて、徐々に範囲を広げていきましょう。
