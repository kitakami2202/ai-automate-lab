---
title: "GASでDiscord Botを作る完全ガイド"
description: "Google Apps Scriptを使ってDiscord Botを構築する方法を徹底解説。Webhookの設定から実用的なBot開発まで、初心者にもわかりやすく紹介します。"
category: "discord-bot"
tags: ["Discord", "Bot", "GAS", "Webhook"]
publishedAt: 2025-01-20
updatedAt: 2025-01-20
author: "れん"
difficulty: "beginner"
timeToRead: 15
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  totalTime: "PT45M"
  estimatedCost: "0"
relatedArticles: ["gas/gas-basics", "discord-bot/discord-slash-commands", "discord-bot/discord-spreadsheet-db"]
draft: false
faq:
  - question: "GASでDiscord Botを作るのに費用はかかりますか？"
    answer: "いいえ。GASは無料で利用でき、Discord Webhookも無料です。サーバー費用なしでBotを運用できます。"
  - question: "GAS製のDiscord Botはどのくらいの規模に対応できますか？"
    answer: "GASの実行時間制限（6分/回）があるため、小〜中規模のコミュニティ向けです。大規模な場合はNode.jsなど専用のBot環境を検討してください。"
  - question: "Discord WebhookとBot Tokenの違いは何ですか？"
    answer: "Webhookはメッセージ送信専用の簡易的な仕組みです。Bot Tokenはメッセージの受信やリアクション検知など双方向のやり取りが可能です。"
---

## Discord BotをGASで作るメリット

GASを使ったDiscord Bot開発には、以下のメリットがあります：

- **無料**で運用可能
- **サーバー管理不要**
- **Googleサービス連携**が簡単

## Discord Webhookの設定

1. Discordサーバーの設定を開く
2. 「連携サービス」→「ウェブフック」を選択
3. 新しいWebhookを作成してURLをコピー

## GASからメッセージを送信

```javascript
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/YOUR_WEBHOOK_URL';

function sendDiscordMessage(content) {
  const payload = {
    content: content,
    username: 'GAS Bot',
  };

  UrlFetchApp.fetch(DISCORD_WEBHOOK_URL, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
  });
}
```

## Embedメッセージの送信

リッチなメッセージを送信することもできます。

```javascript
function sendEmbed() {
  const payload = {
    embeds: [{
      title: '日次レポート',
      description: '本日の実績をお知らせします',
      color: 3447003,
      fields: [
        { name: '売上', value: '¥1,234,567', inline: true },
        { name: '訪問者数', value: '5,432', inline: true },
      ],
      timestamp: new Date().toISOString(),
    }],
  };

  UrlFetchApp.fetch(DISCORD_WEBHOOK_URL, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
  });
}
```

## まとめ

GASとDiscord Webhookの組み合わせで、手軽に通知Botを構築できます。定期実行と組み合わせて、チーム運用に役立てましょう。
