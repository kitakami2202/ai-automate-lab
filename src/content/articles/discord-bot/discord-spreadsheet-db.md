---
title: "スプレッドシートをデータベースとして使うDiscord Bot"
description: "Googleスプレッドシートをデータベース代わりに使うDiscord Botの構築方法を解説。データの読み書きからBot連携まで実践的に紹介します。"
category: "discord-bot"
tags: ["Discord", "Bot", "スプレッドシート", "データベース"]
publishedAt: 2025-03-05
updatedAt: 2025-03-05
author: "れん"
difficulty: "intermediate"
timeToRead: 15
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  totalTime: "PT45M"
  estimatedCost: "0"
relatedArticles: ["discord-bot/discord-bot-gas", "discord-bot/discord-slash-commands", "gas/gas-spreadsheet-automation"]
draft: false
faq:
  - question: "スプレッドシートをデータベースとして使うのは安全ですか？"
    answer: "小規模なデータ管理には十分安全です。ただし、機密情報を扱う場合はアクセス権限を適切に設定し、共有範囲に注意してください。"
  - question: "スプレッドシートDBの同時書き込みは大丈夫ですか？"
    answer: "GASのLockServiceを使うことで排他制御が可能です。高頻度の同時アクセスが予想される場合は専用のデータベースを検討してください。"
  - question: "データ量が増えた場合の対処法は？"
    answer: "スプレッドシートは約500万セルが上限です。データが増えたらシートを分割するか、Cloud FirestoreなどのNoSQLデータベースへの移行を検討しましょう。"
---

## スプレッドシートをDBとして使う

専用のデータベースを用意せずとも、Googleスプレッドシートをデータストアとして活用できます。

## メリットとデメリット

| 項目 | メリット | デメリット |
|------|---------|-----------|
| コスト | 無料 | 大量データに不向き |
| 管理 | GUI操作可能 | 同時書き込み制限 |
| 連携 | GAS親和性高い | パフォーマンス限界あり |

## データの読み書き

```javascript
function readData() {
  const sheet = SpreadsheetApp.openById('SPREADSHEET_ID').getSheetByName('users');
  const data = sheet.getDataRange().getValues();
  return data;
}

function writeData(userId, username, score) {
  const sheet = SpreadsheetApp.openById('SPREADSHEET_ID').getSheetByName('users');
  sheet.appendRow([userId, username, score, new Date()]);
}
```

## Discord Botとの連携

ユーザーのコマンドに応じて、スプレッドシートからデータを読み書きするBotを構築します。

```javascript
function doPost(e) {
  const data = JSON.parse(e.postData.contents);

  if (data.type === 2) {
    const command = data.data.name;

    if (command === 'score') {
      const scores = readData();
      const response = scores
        .slice(1)
        .sort((a, b) => b[2] - a[2])
        .slice(0, 10)
        .map((row, i) => `${i + 1}. ${row[1]}: ${row[2]}pt`)
        .join('\n');

      return ContentService.createTextOutput(
        JSON.stringify({
          type: 4,
          data: { content: `**スコアランキング**\n${response}` },
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }
  }
}
```

## まとめ

小〜中規模のデータ管理であれば、スプレッドシートは優秀なデータベース代替になります。GASと組み合わせて、コスト0でBotを運用しましょう。
