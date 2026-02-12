---
title: "AI × 議事録自動化｜録音→要約→共有まで"
description: "AIで議事録作成を自動化する方法を解説。Whisper APIで録音を文字起こしし、Claude APIで要約・構造化してSlack/Discordに自動共有するフローを、GASのコード付きで紹介。中小企業が会議後の議事録作成に費やす月5〜10時間を削減できます。"
category: "frameworks"
tags: ["AI自動化", "議事録", "文字起こし", "要約", "会議"]
publishedAt: 2026-02-12
updatedAt: 2026-02-12
author: "れん"
difficulty: "beginner"
timeToRead: 12
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "月0〜2,000円"
  totalTime: "PT30M"
faq:
  - question: "会議の録音はどうすればよいですか？"
    answer: "オンライン会議はZoom・Google Meet・Teamsの録音機能を使います。対面会議はスマートフォンのボイスメモやICレコーダーで録音します。録音ファイルは文字起こしツールが対応する形式（MP3・M4A・WAV等）で保存してください。"
  - question: "文字起こしの精度はどのくらいですか？"
    answer: "Whisper APIや専用ツールの日本語文字起こし精度は90〜95%程度です。複数人の会議や専門用語が多い場合は精度が下がることがあります。文字起こし後にAI要約を行うことで、多少の誤字があっても要点は正確に抽出できます。"
  - question: "無料で議事録自動化はできますか？"
    answer: "Google Meetの自動文字起こし機能（Google Workspace利用時）とClaude APIの無料クレジットを組み合わせれば、初期は無料で試せます。月4回程度の会議であればAPI費用は月200円程度です。"
  - question: "議事録自動化にプログラミング経験は必要ですか？"
    answer: "基本的なプログラミング経験がなくても始められます。この記事のGASコードはコピー&ペーストで動作します。カスタマイズが必要な場合はClaude Codeに修正を依頼すれば、コードを書かずに調整できます。"
  - question: "対面会議でも議事録自動化は使えますか？"
    answer: "はい、対面会議でも利用できます。スマートフォンのボイスメモやICレコーダーで録音し、音声ファイルをGoogle Driveにアップロードすれば、オンライン会議と同じフローで自動処理できます。"
relatedArticles:
  - "frameworks/ai-business-overview"
  - "frameworks/prompt-engineering-business"
  - "gas/gas-claude-api"
draft: false
---

> この記事は[AIで自動化できる業務一覧](/articles/frameworks/ai-business-overview)の実装編です。

AIを使えば、会議の議事録作成にかかる時間を月5〜10時間から10分以下に短縮できます。
この記事では、録音から文字起こし・AI要約・Slack/Discord共有までを一連のフローとしてGAS（Google Apps Script）のコード付きで構築する方法を解説します。

### この記事の前提

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Google、OpenAI API、Anthropic API |
| 所要時間 | 約30分（ツール設定） |
| 費用 | 月0〜2,000円 |
| 完成物 | 録音→文字起こし→AI要約→共有の自動化フロー |

## 議事録自動化の全体フロー

AI議事録自動化とは、会議の録音データをテキストに変換し、AIで要約・構造化して関係者へ自動共有する仕組みのことです。

| ステップ | 内容 | ツール例 |
|---------|------|---------|
| 1. 録音 | 会議の音声を録音 | Zoom / Google Meet / ボイスメモ |
| 2. 文字起こし | 音声をテキストに変換 | Whisper API / Google STT |
| 3. AI要約 | テキストを要約・構造化 | Claude API / ChatGPT API |
| 4. 共有 | 議事録を関係者に配信 | Slack / Discord / メール |

### 手作業との比較

| 項目 | 手作業 | AI自動化 |
|------|--------|---------|
| 議事録作成時間 | 会議時間の1.5〜2倍 | 5〜10分 |
| 記録漏れ | 発生しやすい | 録音ベースで漏れなし |
| 共有タイミング | 翌日以降 | 会議直後に自動配信 |

## 録音の文字起こしからAI要約・自動共有までの実装手順

実装手順とは、録音ファイルの文字起こしからAI要約、Slack/Discordへの自動共有までを1つのGASプロジェクトで構築するステップです。すべてのコードをGAS（Google Apps Script）で統一し、`UrlFetchApp`でWhisper API（OpenAIが提供する音声認識API）を呼び出すため、Pythonなど別の言語を使わずに完結します。

### ステップ1: 録音ファイルの文字起こし（Whisper API）

文字起こしとは、音声データをテキストに変換する処理のことです。ここではWhisper API（OpenAIが提供するSTT（Speech-to-Text: 音声をテキストに変換する技術）サービス）をGASから呼び出して文字起こしを行います。

まず、文字起こしに使える主なツールを比較します。

| ツール | 費用 | 日本語精度 | 特徴 |
|--------|------|----------|------|
| [Whisper API（OpenAI）](https://openai.com/api/pricing/) | $0.006/分 | 高 | API経由で自動処理可能 |
| [Google Speech-to-Text](https://cloud.google.com/speech-to-text/pricing) | 月60分無料 | 高 | GCPで利用 |
| [Google Meet文字起こし](https://workspace.google.com/pricing) | Workspace込み | 中〜高 | 会議中にリアルタイム生成 |

※2026年2月時点。最新料金は各公式サイトをご確認ください。

録音ファイルはGoogle Driveに保存し、GASからWhisper APIに送信します。

```javascript
/**
 * Google Drive上の録音ファイルをWhisper APIで文字起こし
 * @param {string} fileId - Google DriveのファイルID
 * @return {string} 文字起こしテキスト
 */
function transcribeAudio(fileId) {
  var apiKey = PropertiesService.getScriptProperties().getProperty("OPENAI_API_KEY");
  var file = DriveApp.getFileById(fileId);
  var blob = file.getBlob();

  var boundary = "----FormBoundary" + Utilities.getUuid();
  var requestBody =
    "--" + boundary + "\r\n" +
    'Content-Disposition: form-data; name="file"; filename="' + file.getName() + '"\r\n' +
    "Content-Type: " + blob.getContentType() + "\r\n\r\n";

  var payload = Utilities.newBlob(requestBody).getBytes()
    .concat(blob.getBytes())
    .concat(Utilities.newBlob(
      "\r\n--" + boundary + "\r\n" +
      'Content-Disposition: form-data; name="model"\r\n\r\n' +
      "whisper-1\r\n" +
      "--" + boundary + "\r\n" +
      'Content-Disposition: form-data; name="language"\r\n\r\n' +
      "ja\r\n" +
      "--" + boundary + "--\r\n"
    ).getBytes());

  var options = {
    method: "post",
    headers: {
      "Authorization": "Bearer " + apiKey,
      "Content-Type": "multipart/form-data; boundary=" + boundary
    },
    payload: payload,
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch("https://api.openai.com/v1/audio/transcriptions", options);
  var result = JSON.parse(response.getContentText());

  if (response.getResponseCode() !== 200) {
    throw new Error("Whisper API エラー: " + result.error.message);
  }

  return result.text;
}
```

**このコードのポイント:**

- Google DriveのファイルIDを指定するだけで文字起こしが実行されます
- `multipart/form-data`形式でWhisper APIに音声ファイルを送信します
- `language: "ja"`で日本語を指定し、文字起こし精度を高めています
- APIキーは`PropertiesService`に保存し、コードにハードコードしません

### ステップ2: AI要約で議事録を構造化（Claude API）

AI要約とは、文字起こしされた長文テキストをAIで構造化し、決定事項・アクションアイテム・議論のポイントを抽出する処理のことです。プロンプト設計の基本は[業務自動化プロンプト設計入門](/articles/frameworks/prompt-engineering-business)で詳しく解説しています。

```javascript
/**
 * 文字起こしテキストをClaude APIで議事録に要約
 * @param {string} transcriptText - 文字起こしテキスト
 * @return {string} 構造化された議事録
 */
function summarizeMeeting(transcriptText) {
  var apiKey = PropertiesService.getScriptProperties().getProperty("ANTHROPIC_API_KEY");

  var systemPrompt =
    "あなたは議事録作成のアシスタントです。" +
    "会議の文字起こしテキストを以下の形式で構造化してください：\n\n" +
    "## 会議概要\n（1〜2文で会議の目的と結論）\n\n" +
    "## 決定事項\n（箇条書き）\n\n" +
    "## アクションアイテム\n（担当者・期限付きの箇条書き）\n\n" +
    "## 議論のポイント\n（主要な議論を3つ以内で要約）";

  var payload = {
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: "user", content: transcriptText }]
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

  if (response.getResponseCode() !== 200) {
    throw new Error("Claude API エラー: " + JSON.stringify(result));
  }

  return result.content[0].text;
}
```

**このコードのポイント:**

- 長文の要約にはコストと精度のバランスに優れた **Claude Sonnet 4.5** を使用しています
- 出力形式をsystemプロンプトで厳密に指定し、毎回統一されたフォーマットの議事録を生成します
- Claude APIの詳しい使い方は[GAS × Claude API連携の基本](/articles/gas/gas-claude-api)をご覧ください

### ステップ3: Slack/Discordに議事録を自動共有

要約された議事録をSlackやDiscordにWebhook（外部サービスから特定のURLにデータを送信する仕組み）で自動投稿します。

```javascript
/**
 * 議事録をDiscordに投稿
 * @param {string} summary - 要約された議事録テキスト
 * @param {string} meetingTitle - 会議タイトル
 */
function shareMeetingNotes(summary, meetingTitle) {
  var webhookUrl = PropertiesService.getScriptProperties().getProperty("DISCORD_WEBHOOK_URL");

  var payload = {
    embeds: [{
      title: "📝 " + meetingTitle + " 議事録",
      description: summary.substring(0, 4000),
      color: 3447003,
      footer: { text: "AI議事録自動生成" }
    }]
  };

  UrlFetchApp.fetch(webhookUrl, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  });
}
```

Slack通知に変更する場合は[GAS × Slack通知の実装方法](/articles/gas/gas-slack-notification)のコードに置き換えてください。

### メイン関数とトリガー設定

3つのステップを繋ぐメイン関数を作成します。Google Driveの特定フォルダに録音ファイルをアップロードするだけで、文字起こしから共有までが自動実行されます。

```javascript
/**
 * 録音→文字起こし→AI要約→共有を一括実行するメイン関数
 * Google Driveの指定フォルダ内の未処理ファイルを自動処理
 */
function processNewRecordings() {
  var folderId = PropertiesService.getScriptProperties().getProperty("RECORDING_FOLDER_ID");
  var folder = DriveApp.getFolderById(folderId);
  var processedLabel = "processed_";

  var files = folder.getFiles();
  while (files.hasNext()) {
    var file = files.next();

    // 処理済みファイルはスキップ
    if (file.getName().indexOf(processedLabel) === 0) {
      continue;
    }

    try {
      // ステップ1: 文字起こし
      var transcript = transcribeAudio(file.getId());

      // ステップ2: AI要約
      var meetingTitle = file.getName().replace(/\.[^.]+$/, "");
      var summary = summarizeMeeting(transcript);

      // ステップ3: 自動共有
      shareMeetingNotes(summary, meetingTitle);

      // 処理済みマークをファイル名に付与
      file.setName(processedLabel + file.getName());

      Logger.log("処理完了: " + meetingTitle);
    } catch (e) {
      Logger.log("エラー: " + file.getName() + " - " + e.message);
    }
  }
}
```

**このコードのポイント:**

- Google Driveの指定フォルダ内の録音ファイルを自動検出します
- 処理済みファイルにはファイル名にプレフィックスを付けて重複処理を防ぎます
- エラーが発生しても他のファイルの処理は継続します

**GASトリガーの設定手順:**

1. GASエディタで「トリガー」（時計アイコン）を開く
2. 「トリガーを追加」をクリック
3. 関数: `processNewRecordings` / イベント: 「時間主導型」/ 間隔: 「1時間おき」を選択
4. 「保存」をクリック

この設定により、録音ファイルをGoogle Driveにアップロードするだけで、1時間以内に議事録が自動生成・共有されます。

## 動作確認・トラブルシューティング

トラブルシューティングとは、議事録自動化フローの各ステップで発生しうる問題を特定し、解決する手順のことです。初回実行時は以下の問題が起こりやすいため、事前に確認しておきましょう。

| 問題 | 原因 | 解決策 |
|------|------|--------|
| 文字起こしの精度が低い | 録音品質が悪い | マイクを近づける・ノイズを低減 |
| 要約が長すぎる | プロンプトの指示不足 | 「300文字以内」「箇条書き5つ以内」を追加 |
| アクションアイテムが抽出されない | 会議で明示されていない | プロンプトに「推測でもアクションを提案」を追加 |
| APIキーのエラーが出る | PropertiesServiceへの設定ミス | GASエディタで「プロジェクトの設定」→「スクリプトプロパティ」を開き、キー名と値を再確認 |
| GASが途中で止まる | 実行時間が6分の制限を超過 | 長時間の録音は分割してアップロードするか、25MB以下に圧縮 |
| Discord/Slackに投稿されない | Webhook URLの期限切れまたは設定ミス | Webhook URLを再発行し、スクリプトプロパティを更新 |

## まとめ

この記事では、録音の文字起こしからAI要約、自動共有までの一連フローをGASで構築しました。

| ステップ | 処理内容 | 使用API |
|---------|---------|---------|
| 1 | 録音ファイルの文字起こし | Whisper API |
| 2 | テキストの要約・構造化 | Claude API |
| 3 | Slack/Discordへの自動共有 | Webhook |
| 統合 | メイン関数 + GASトリガー | Google Apps Script |

手作業で会議時間の1.5〜2倍かかっていた議事録作成が、録音ファイルをGoogle Driveにアップロードするだけで自動化され、月5〜10時間の削減が見込めます。

次のステップとして、以下の応用もご検討ください。

- **Google Docs保存** -- 要約をGoogle Docsに自動保存し、議事録アーカイブを構築
- **カレンダー連携** -- [Googleカレンダー連携](/articles/gas/gas-calendar)で次回会議の予定にアクションアイテムを自動追加
- **多言語対応** -- 英語の会議を日本語で要約する翻訳要約

AI自動化の全体像は[AIで自動化できる業務一覧](/articles/frameworks/ai-business-overview)をご覧ください。
