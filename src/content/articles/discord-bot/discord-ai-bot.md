---
title: "Discord × AI Bot構築｜社内AI質問窓口の作り方"
description: "DiscordとChatGPT/Claude APIを連携し、社内AI質問窓口Botを構築する方法を解説。GAS × Webhookで通知型、Node.jsで対話型の2パターンをコピペで動くコード付きで紹介。社内マニュアルを参照した回答生成も実装できます。"
category: "discord-bot"
tags: ["Discord", "AI Bot", "ChatGPT", "Claude", "社内ツール"]
publishedAt: 2026-02-12
updatedAt: 2026-02-12
author: "れん"
difficulty: "beginner"
timeToRead: 15
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "月約500円〜"
  totalTime: "PT60M"
faq:
  - question: "Discord AI Botの運用コストはいくらですか？"
    answer: "Discord自体は無料です。AIのAPI料金のみ発生します。GPT-4o miniやClaude Haiku 4.5を使えば、月200回程度の質問で月約100〜500円です（2026年2月時点）。GAS版ならサーバー費用も不要です。"
  - question: "ChatGPTとClaudeどちらのAPIを使うべきですか？"
    answer: "どちらでも構築可能です。長文の社内マニュアルを参照した回答にはClaudeが向いており、短い質問への応答にはChatGPT（GPT-4o mini）がコストパフォーマンスに優れます。本記事ではGAS版でClaude、Node.js版でChatGPTとClaudeの両方のコード例を掲載しています。"
  - question: "GAS版とNode.js版の違いは？"
    answer: "GAS版はWebhook方式でBotからの一方向通知が中心です。サーバー不要で手軽に始められます。Node.js版はBot Tokenを使った双方向対話型で、ユーザーの質問にリアルタイムで回答できます。まずGAS版で試し、対話が必要ならNode.js版に移行する流れがおすすめです。"
  - question: "社内マニュアルの内容を回答に反映できますか？"
    answer: "はい、systemプロンプトに社内マニュアルのテキストを含めることで、マニュアルに基づいた回答を生成できます。GAS版ならスプレッドシートにFAQを管理し、動的にプロンプトに組み込む方法が実用的です。"
relatedArticles:
  - "discord-bot/discord-bot-overview"
  - "discord-bot/discord-bot-gas"
  - "ai-api/claude-api-intro"
draft: false
---

> この記事は[Discord Bot業務活用ガイド](/articles/discord-bot/discord-bot-overview)の実装編です。
> Discord Botの基本から知りたい方は、先にそちらをご覧ください。

この記事では、DiscordとAI API（Application Programming Interface、ソフトウェア同士を連携させる窓口）を連携して社内AI質問窓口Botを構築する手順を解説します。
GAS（Google Apps Script、Googleが提供する無料のスクリプト実行環境）版（通知型・サーバー不要）とNode.js（サーバーサイドでJavaScriptを実行する環境）版（対話型）の2パターンを、コピペで動くコード付きで紹介します。

中小企業の社員からの質問に自動で回答できるDiscord ChatGPT Botや社内AI質問窓口を構築すれば、担当者の対応負荷を大幅に削減できます。

### この記事の前提

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Google、Discord（サーバー管理権限）、OpenAI or Anthropic |
| 必要な知識 | [Discord Bot × GAS連携](/articles/discord-bot/discord-bot-gas)を読了済み |
| 所要時間 | GAS版: 約30分 / Node.js版: 約60分 |
| 費用 | Discord: 0円 / AI API: 月約100〜500円（2026年2月時点） |
| 完成物 | 社内AI質問窓口Bot（質問→AI回答をDiscordに投稿） |

## この記事で作るもの

Discord AI Botとは、DiscordチャンネルとAI API（ChatGPT / Claude）を連携し、Discord ChatGPT Botや社内AI質問窓口として社内メンバーの質問にAIが回答する仕組みです。

| パターン | 方式 | 特徴 | 適したケース |
|---------|------|------|------------|
| GAS版 | Webhook + スプレッドシート | サーバー不要・無料 | FAQ回答の定期配信 |
| Node.js版 | Bot Token + discord.js | リアルタイム対話 | 質問→即時回答 |

## GAS版: スプレッドシートFAQ × AI回答Bot

GAS版は、スプレッドシートに蓄積したFAQデータをAI APIで強化し、回答をDiscord Webhook（外部サービスからの通知を自動受信する仕組み）で通知する方式です。
サーバー不要で無料から始められます。

### 準備

1. Discord通知チャンネルのWebhook URLの取得方法は[Discord Bot × GAS連携](/articles/discord-bot/discord-bot-gas)で解説しています
2. AI APIのAPIキーの取得方法は[Claude API入門](/articles/ai-api/claude-api-intro)または[OpenAI API入門](/articles/ai-api/openai-api-intro)で解説しています
3. GASのスクリプトプロパティに以下を設定します

| プロパティ名 | 値 |
|------------|-----|
| `DISCORD_WEBHOOK_URL` | Discord Webhook URL |
| `ANTHROPIC_API_KEY` | Claude APIキー（Claude使用の場合） |
| `OPENAI_API_KEY` | OpenAI APIキー（ChatGPT使用の場合） |

### 実装: FAQ回答生成 × Discord通知

処理の流れは以下の通りです。

1. 「質問一覧」シートから未回答の質問を取得
2. 「FAQ」シートの知識ベースをsystemプロンプト（AIの振る舞いを事前に指定する指示文）に組み込み
3. Claude APIで回答を生成
4. スプレッドシートに回答を記録
5. Discord Webhookで回答を投稿

```javascript
/**
 * スプレッドシートの未回答質問をAIで回答し、Discordに投稿
 */
function answerAndNotify() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var qaSheet = ss.getSheetByName("質問一覧");
  var faqSheet = ss.getSheetByName("FAQ");
  var data = qaSheet.getDataRange().getValues();

  // FAQ知識ベースを構築
  var faqData = faqSheet.getDataRange().getValues();
  var faqText = "";
  for (var j = 1; j < faqData.length; j++) {
    faqText += "Q: " + faqData[j][0] + "\nA: " + faqData[j][1] + "\n\n";
  }

  var webhookUrl = PropertiesService.getScriptProperties().getProperty("DISCORD_WEBHOOK_URL");

  for (var i = 1; i < data.length; i++) {
    var question = data[i][0];
    var answered = data[i][1];

    if (!question || answered) continue;

    try {
      var answer = callAiApi(faqText, question);

      // スプレッドシートに記録
      qaSheet.getRange(i + 1, 2).setValue(answer);
      qaSheet.getRange(i + 1, 3).setValue(new Date());

      // Discordに投稿
      sendToDiscord(webhookUrl, question, answer);

      Utilities.sleep(1000);
    } catch (e) {
      qaSheet.getRange(i + 1, 2).setValue("エラー: " + e.message);
    }
  }
}

/**
 * Claude APIで回答を生成
 */
function callAiApi(faqText, question) {
  var apiKey = PropertiesService.getScriptProperties().getProperty("ANTHROPIC_API_KEY");
  var url = "https://api.anthropic.com/v1/messages";

  var systemPrompt =
    "あなたは社内サポートAIです。以下のFAQを参考に回答してください。\n" +
    "FAQにない質問は「担当者に確認します」と回答してください。\n" +
    "回答は200文字以内で簡潔にしてください。\n\n" +
    "【FAQ】\n" + faqText;

  var payload = {
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: systemPrompt,
    messages: [{ role: "user", content: question }]
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

  var response = UrlFetchApp.fetch(url, options);
  var result = JSON.parse(response.getContentText());

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.content[0].text;
}

/**
 * Discord WebhookでEmbed形式の回答を投稿
 */
function sendToDiscord(webhookUrl, question, answer) {
  var payload = {
    embeds: [{
      title: "💡 AI回答",
      color: 3447003,
      fields: [
        { name: "❓ 質問", value: question },
        { name: "✅ 回答", value: answer }
      ],
      footer: { text: "社内AI質問窓口 | FAQ未掲載の場合は担当者に確認してください" }
    }]
  };

  UrlFetchApp.fetch(webhookUrl, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  });
}
```

**このコードのポイント:**

- スプレッドシート上の「FAQ」シートが知識ベースとして機能します
- Embed形式（タイトル・色・フィールドを持つDiscordのリッチメッセージ形式）で見やすい回答を投稿します
- 未回答のレコードのみを処理するため、既回答の質問に重複して回答することはありません

**トリガー設定:** `answerAndNotify` を5分おきの時間主導型トリガーで実行すれば、Googleフォームからの質問投稿に対して自動で回答がDiscordに投稿されます。

## Node.js版: リアルタイム対話型AI Bot

社内AI質問窓口をリアルタイム対話型で実現するのがNode.js版です。ユーザーの質問に即座に回答する対話型Botを構築できます。VPS（Virtual Private Server、仮想専用サーバー、月500〜2,000円）やCloud Run（Googleが提供するコンテナ実行サービス、従量課金で月数百円〜）など常時稼働環境が必要です（2026年2月時点）。

### 環境構築

```bash
npm init -y
npm install discord.js@14 openai @anthropic-ai/sdk dotenv
```

本記事のコードはCommonJS形式で記述しています。package.jsonに `"type": "module"` がある場合は削除するか、ファイル拡張子を `.cjs` にしてください。

`.env` ファイルを作成します。

```text
DISCORD_BOT_TOKEN=your-discord-bot-token
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

### 実装: 対話型AI Bot（ChatGPT版）

```javascript
require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const OpenAI = require("openai");

const discord = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT =
  "あなたは中小企業の社内サポートAIです。\n" +
  "社員からの質問に簡潔に回答してください。\n" +
  "回答は200文字以内で、敬語を使ってください。\n" +
  "わからない質問は「担当者に確認します」と回答してください。";

discord.on("messageCreate", async (message) => {
  // Bot自身のメッセージは無視
  if (message.author.bot) return;

  // メンションされた場合のみ応答
  if (!message.mentions.has(discord.user)) return;

  // メンション部分を除去して質問を抽出
  var question = message.content.replace(/<@!?\d+>/g, "").trim();
  if (!question) return;

  try {
    await message.channel.sendTyping();

    var response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: question }
      ],
      max_tokens: 512,
      temperature: 0.3
    });

    var answer = response.choices[0].message.content;
    await message.reply("💡 " + answer);
  } catch (error) {
    await message.reply("⚠️ エラーが発生しました。しばらく経ってからお試しください。");
    console.error(error);
  }
});

discord.login(process.env.DISCORD_BOT_TOKEN);
```

**このコードのポイント:**

- discord.js（Discord Bot構築用のNode.jsライブラリ）を使ってメッセージを受信します
- `GatewayIntentBits` でBotが受信するイベントを指定します。MessageContentを有効にしないとメッセージ本文を読み取れません
- Botがメンションされた場合のみ応答するため、通常の会話を邪魔しません
- `sendTyping()` で入力中の表示を出し、ユーザーに処理中であることを伝えます
- `temperature: 0.3` （AIの回答のランダム性を制御するパラメータ、0に近いほど安定した回答）で回答のばらつきを抑えています

### 実装: 対話型AI Bot（Claude版）

Claudeを使う場合は、以下のコードに差し替えます。

```javascript
require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const Anthropic = require("@anthropic-ai/sdk");

const discord = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT =
  "あなたは中小企業の社内サポートAIです。\n" +
  "社員からの質問に簡潔に回答してください。\n" +
  "回答は200文字以内で、敬語を使ってください。\n" +
  "わからない質問は「担当者に確認します」と回答してください。";

discord.on("messageCreate", async (message) => {
  // Bot自身のメッセージは無視
  if (message.author.bot) return;

  // メンションされた場合のみ応答
  if (!message.mentions.has(discord.user)) return;

  // メンション部分を除去して質問を抽出
  var question = message.content.replace(/<@!?\d+>/g, "").trim();
  if (!question) return;

  try {
    await message.channel.sendTyping();

    var response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: question }]
    });

    var answer = response.content[0].text;
    await message.reply("💡 " + answer);
  } catch (error) {
    await message.reply("⚠️ エラーが発生しました。しばらく経ってからお試しください。");
    console.error(error);
  }
});

discord.login(process.env.DISCORD_BOT_TOKEN);
```

**ChatGPT版とClaude版の切り替え:**

- 環境変数の切り替え: `.env` で使用するAPIキーを指定
- パッケージのimport部分を `require("openai")` または `require("@anthropic-ai/sdk")` に変更
- APIの呼び出しメソッドを変更（OpenAIは `chat.completions.create`、Anthropicは `messages.create`）

最新の料金は[OpenAI公式料金ページ](https://openai.com/api/pricing/)および[Anthropic公式料金ページ](https://www.anthropic.com/pricing)をご確認ください。

## 動作確認・トラブルシューティング

Discord AI Botの構築中に発生しがちなエラーと解決策をまとめます。

| エラー | 原因 | 解決策 |
|--------|------|--------|
| AI回答が空になる | APIキーの設定ミス | スクリプトプロパティ / .env の値を確認 |
| Discord通知が届かない | Webhook URLの誤り | URLが正しいか、チャンネルが存在するか確認 |
| 「担当者に確認します」ばかり | FAQ知識が不足 | FAQシートにデータを追加しsystemプロンプトを充実させる |
| Node.js版が応答しない | Intentsの設定不足 | Discord Developer PortalでMessage Content Intentを有効化 |
| API呼び出しが429エラー | レート制限超過 | リクエスト頻度を下げるか、有料プランへアップグレード |
| Discord投稿が2000文字超過エラー | 回答が長すぎる | max_tokensを減らすかsystemプロンプトで文字数制限を指示 |

## 応用・カスタマイズ例

社内AI質問窓口を拡張する方法をいくつか紹介します。

### マニュアル検索Bot

社内マニュアルPDFをテキスト化してsystemプロンプトに含めることで、マニュアルに基づいた回答を生成できます。数千文字程度のマニュアルであれば、そのままプロンプトに含めることが可能です。

### 多言語対応

systemプロンプトに「質問の言語に合わせて回答してください」を追加するだけで、日本語・英語・中国語などの多言語対応が可能です。外国人スタッフがいる企業の社内AI質問窓口に適しています。

### ログ収集とFAQ改善

質問と回答をスプレッドシートに記録し、どの質問が多いかを分析してFAQ改善に活用できます。[Discord スプレッドシートDB連携](/articles/discord-bot/discord-spreadsheet-db)で質問履歴の保存方法を解説しています。

### スラッシュコマンド対応

Botにスラッシュコマンドを追加して「/質問」「/マニュアル検索」などのコマンドで呼び出せるようにしたい場合は、[Discord スラッシュコマンド実装ガイド](/articles/discord-bot/discord-slash-commands)で手順を解説しています。

Discord Botの全体設計は[Discord Bot業務活用ガイド](/articles/discord-bot/discord-bot-overview)、AI APIの基礎は[Claude API入門](/articles/ai-api/claude-api-intro)をご覧ください。
