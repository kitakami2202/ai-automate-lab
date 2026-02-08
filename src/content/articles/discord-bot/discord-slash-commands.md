---
title: "Discordスラッシュコマンドの実装ガイド"
description: "Discordのスラッシュコマンドを実装する方法を解説。コマンドの登録からインタラクション処理まで、実践的な手順を紹介します。"
category: "discord-bot"
tags: ["Discord", "スラッシュコマンド", "Bot", "API"]
publishedAt: 2025-02-10
updatedAt: 2025-02-10
author: "れん"
difficulty: "intermediate"
timeToRead: 15
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  totalTime: "PT45M"
relatedArticles: ["discord-bot/discord-bot-gas", "discord-bot/discord-spreadsheet-db", "gas/gas-basics"]
draft: false
faq:
  - question: "スラッシュコマンドとメッセージコマンドの違いは何ですか？"
    answer: "スラッシュコマンドは「/」で始まるDiscord公式のコマンド機能で、補完やバリデーションが利用できます。メッセージコマンドは「!」などの接頭辞を使う旧来の方式です。"
  - question: "スラッシュコマンドの登録数に制限はありますか？"
    answer: "グローバルコマンドは100個まで、サーバー固有のコマンドもサーバーごとに100個まで登録できます。"
  - question: "スラッシュコマンドの応答時間の制限はありますか？"
    answer: "3秒以内に応答する必要があります。時間がかかる処理の場合は、deferReply()で遅延応答を使うことで最大15分まで延長できます。"
---

## スラッシュコマンドとは

スラッシュコマンドは、Discordで「/」から始まるコマンドを入力してBotと対話する仕組みです。

## コマンドの登録

Discord APIを使ってスラッシュコマンドを登録します。

```javascript
async function registerCommand() {
  const command = {
    name: 'hello',
    description: '挨拶を返します',
    type: 1,
  };

  const response = await fetch(
    `https://discord.com/api/v10/applications/${APP_ID}/commands`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bot ${BOT_TOKEN}`,
      },
      body: JSON.stringify(command),
    }
  );
}
```

## インタラクションの処理

コマンドが実行されたときの処理を実装します。

```javascript
function handleInteraction(interaction) {
  if (interaction.data.name === 'hello') {
    return {
      type: 4,
      data: {
        content: `こんにちは、${interaction.member.user.username}さん！`,
      },
    };
  }
}
```

## まとめ

スラッシュコマンドを実装することで、ユーザーフレンドリーなBotを構築できます。さまざまなコマンドを追加して、Botの機能を拡張していきましょう。
