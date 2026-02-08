---
title: "GASからSlackに通知を送る方法 - Webhook連携ガイド"
description: "Google Apps ScriptからSlackに自動通知を送る方法を解説。Incoming Webhookの設定からメッセージのカスタマイズまで詳しく紹介します。"
category: "gas"
tags: ["GAS", "Slack", "Webhook", "通知自動化"]
publishedAt: 2025-03-01
updatedAt: 2025-03-01
author: "れん"
difficulty: "intermediate"
timeToRead: 10
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  totalTime: "PT30M"
  estimatedCost: "0"
relatedArticles: ["gas/gas-basics", "gas/gas-spreadsheet-automation", "discord-bot/discord-bot-gas"]
draft: false
faq:
  - question: "Slack Webhookは無料で使えますか？"
    answer: "はい。SlackのIncoming Webhookは無料プランでも利用可能です。ただし、無料プランではアプリ数が10個までに制限されています。"
  - question: "GASからSlackにファイルを送信できますか？"
    answer: "Incoming Webhookではファイル送信はできません。ファイル送信が必要な場合はSlack APIのfiles.uploadエンドポイントを使用します。"
  - question: "Webhook URLが漏洩した場合のリスクは？"
    answer: "Webhook URLを知っている人なら誰でもそのチャンネルにメッセージを送信できます。URLはスクリプトプロパティなど安全な場所に保管してください。"
---

## Slack通知の自動化

GASとSlackのIncoming Webhookを組み合わせれば、スプレッドシートの更新やスケジュールに応じた自動通知が実現できます。

## Incoming Webhookの設定

1. Slack APIのWebサイトでアプリを作成
2. Incoming Webhooksを有効化
3. 通知先チャンネルを選択してWebhook URLを取得

## GASからSlackに通知を送る

```javascript
const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL';

function sendSlackNotification(message) {
  const payload = {
    text: message,
    username: 'GAS Bot',
    icon_emoji: ':robot_face:',
  };

  UrlFetchApp.fetch(SLACK_WEBHOOK_URL, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
  });
}
```

## リッチメッセージの送信

Block Kitを使えば、より見やすいメッセージを送信できます。

```javascript
function sendRichNotification() {
  const payload = {
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '日次レポート' },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: '*売上:*\n¥1,234,567' },
          { type: 'mrkdwn', text: '*前日比:*\n+5.2%' },
        ],
      },
    ],
  };

  UrlFetchApp.fetch(SLACK_WEBHOOK_URL, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
  });
}
```

## まとめ

GASとSlackの連携により、チームへの情報共有を自動化できます。定期レポートやアラート通知に活用しましょう。
