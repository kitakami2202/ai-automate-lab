---
title: "AI × 請求書処理の自動化｜OCR+仕分けの実装"
description: "AIによる請求書処理の自動化方法を解説。PDF請求書をOCRで読み取り、取引先名・金額・日付を自動抽出してスプレッドシートに記録するまで、GAS＋Claude APIのコピペで動くコード付き。中小企業の経理業務を月5〜10時間削減できます。"
category: "frameworks"
tags: ["AI自動化", "請求書", "OCR", "経理", "Claude API"]
publishedAt: 2026-02-12
updatedAt: 2026-02-12
author: "れん"
difficulty: "beginner"
timeToRead: 12
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "月約500円〜（2026年2月時点）"
  totalTime: "PT45M"
faq:
  - question: "紙の請求書も処理できますか？"
    answer: "スキャンしてPDFまたは画像ファイルにすれば処理可能です。Claude APIのVision機能で画像から直接テキストを読み取れるため、別途OCRツールを導入する必要はありません。"
  - question: "読み取り精度はどのくらいですか？"
    answer: "定型フォーマットの請求書であれば90%以上の精度で取引先名・金額・日付を抽出できます。ただし手書きや特殊フォーマットでは精度が下がるため、目視確認のステップを残すことを推奨します。"
  - question: "月額コストはいくらですか？"
    answer: "Claude Haiku 4.5で月100枚の請求書を処理する場合、API費用は月約500円です。GASは無料のため、合計月約500円で運用できます（2026年2月時点）。"
  - question: "請求書データのセキュリティは大丈夫ですか？"
    answer: "Claude APIへの通信はHTTPSで暗号化されています。AnthropicはAPI経由のデータをモデル学習に使用しない方針です。APIキーはGASのスクリプトプロパティで管理し、コード内にハードコードしないことでセキュリティを確保できます。"
  - question: "ChatGPT APIでも同じことができますか？"
    answer: "はい、OpenAI APIのVision機能でも同様の請求書読み取り処理が可能です。エンドポイントURLとリクエスト形式を変更すれば対応できます。"
relatedArticles:
  - "frameworks/ai-business-overview"
  - "frameworks/ai-introduction-5steps"
  - "gas/gas-claude-api"
draft: false
---

> この記事は[AIで自動化できる業務一覧](/articles/frameworks/ai-business-overview)の実装編です。
> PDF生成の基本は[GAS × PDF自動生成](/articles/gas/gas-pdf-generation)をご覧ください。

この記事では、AIを使って請求書PDFから取引先・金額・日付を自動抽出し、スプレッドシートに記録する仕組みを約45分で構築する手順を解説します。
中小企業の経理担当者が毎月の請求書処理に費やす時間を大幅に削減できます。

**この記事の前提**

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Google、Anthropic |
| 必要な知識 | [GAS × Claude API連携](/articles/gas/gas-claude-api)を読了済み |
| 所要時間 | 約45分 |
| 費用 | GAS: 0円 / Claude API: 月約500円（[Anthropic API料金ページ](https://platform.claude.com/docs/en/about-claude/pricing)参照、2026年2月時点） |
| 完成物 | 請求書PDF→AI解析→スプレッドシート記録の自動化 |

## この記事で作るもの

AI請求書処理とは、PDF請求書をAIのOCR（光学文字認識）機能で読み取り、取引先名・請求金額・支払期日などを自動抽出してスプレッドシートに記録する仕組みです。

| 処理ステップ | 内容 | 担当 |
|------------|------|------|
| PDF取得 | Google Driveから請求書PDFを取得 | GAS |
| AI解析 | PDFの内容をAI OCRで読み取り・構造化 | Claude API |
| データ記録 | 抽出結果をスプレッドシートに記録 | GAS |
| 確認通知 | 処理結果を担当者に通知 | GAS + Slack/Discord |

## 準備

準備とは、Google DriveのフォルダとAPIキーを設定し、請求書処理の環境を整える作業です。

### スプレッドシートの準備（請求書台帳シート）

| A列 | B列 | C列 | D列 | E列 | F列 |
|-----|-----|-----|-----|-----|-----|
| ファイル名 | 取引先 | 請求金額 | 請求日 | 支払期日 | 処理日時 |

### Google Driveフォルダの準備

1. Google Driveに「請求書_未処理」フォルダを作成します
2. 処理済みファイルを移動する「請求書_処理済」フォルダも作成します
3. 各フォルダIDをスクリプトプロパティに設定します

## 実装手順

実装手順とは、Google Driveの請求書PDFをClaude APIで解析し、スプレッドシートへ自動記録するまでの構築作業です。
PDFのAI OCR読み取りから通知までを2つのステップで実装します。

### ステップ1: PDFをBase64に変換してAIに送信

Base64とは、PDFなどのバイナリデータをテキスト形式に変換するエンコード方式です。APIでファイルを送信する際に使います。

以下のコードでは、Google DriveのPDFをBase64に変換してClaude APIに送信します。
レスポンスはJSON（JavaScript Object Notation）形式で受け取り、請求書情報を構造化データとして抽出します。

```javascript
/**
 * Google DriveのPDFをClaude APIで解析
 */
function processInvoices() {
  var inputFolderId = PropertiesService.getScriptProperties().getProperty("INPUT_FOLDER_ID");
  var outputFolderId = PropertiesService.getScriptProperties().getProperty("OUTPUT_FOLDER_ID");
  var folder = DriveApp.getFolderById(inputFolderId);
  var files = folder.getFilesByType(MimeType.PDF);

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("請求書台帳");
  var count = 0;
  var errors = 0;

  while (files.hasNext()) {
    var file = files.next();

    try {
      var result = analyzeInvoice(file);

      // スプレッドシートに記録
      sheet.appendRow([
        file.getName(),
        result.vendor,
        result.amount,
        result.invoiceDate,
        result.dueDate,
        new Date()
      ]);

      // 処理済みフォルダに移動
      var outputFolder = DriveApp.getFolderById(outputFolderId);
      file.moveTo(outputFolder);
      count++;

      Utilities.sleep(1000);
    } catch (e) {
      sheet.appendRow([file.getName(), "エラー: " + e.message, "", "", "", new Date()]);
      errors++;
    }
  }

  // 処理結果を通知
  notifyProcessResult(count, errors);
}

/**
 * Claude APIで請求書PDFを解析
 */
function analyzeInvoice(file) {
  var apiKey = PropertiesService.getScriptProperties().getProperty("ANTHROPIC_API_KEY");
  var blob = file.getBlob();
  var base64 = Utilities.base64Encode(blob.getBytes());

  var payload = {
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: "あなたは経理アシスタントAIです。請求書の内容を正確に読み取ってください。",
    messages: [{
      role: "user",
      content: [
        {
          type: "document",
          source: { type: "base64", media_type: "application/pdf", data: base64 }
        },
        {
          type: "text",
          text: "この請求書から以下をJSON形式で抽出してください。" +
            "JSONのみを出力し、他のテキストは含めないでください：\n" +
            '{"vendor":"取引先名","amount":請求金額(数値),' +
            '"invoiceDate":"請求日(yyyy/MM/dd)","dueDate":"支払期日(yyyy/MM/dd)"}'
        }
      ]
    }]
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
    throw new Error(result.error.message);
  }

  // Claude応答からJSONを抽出（コードブロックで囲まれる場合に対応）
  var text = result.content[0].text;
  var jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  var jsonStr = jsonMatch ? jsonMatch[1].trim() : text.trim();

  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    throw new Error("AI応答のJSON解析に失敗しました: " + text);
  }
}
```

**このコードのポイント:**

- **PDF→Base64変換**: Claude APIにファイルを送信するには、PDFをBase64エンコードしてテキスト化する必要があります。`Utilities.base64Encode()`がこの変換を行います
- **documentタイプ**: Claude APIの`document`タイプを使うことで、PDFを直接AIに渡せます。AIがOCR的にPDF内のテキストや表を読み取り、構造化データとして返します
- **JSON抽出プロンプト**: 「JSONのみを出力」と明示することで、余計な説明文なしに構造化データを取得します。出力形式を具体例で指定することで抽出精度が上がります
- **JSON解析のtry-catch**: AIの応答がMarkdownコードブロック（` ```json...``` `）で囲まれるケースに対応し、正規表現でJSONを抽出しています
- **エラーカウント**: 処理の成功・失敗を個別にカウントし、通知関数に渡すことで運用時の状況把握が容易になります

### ステップ2: 処理結果の通知

処理完了後にDiscordやSlackに通知するスクリプトです。ステップ1の`processInvoices()`から自動的に呼び出されます。

```javascript
/**
 * 処理結果をDiscordに通知
 */
function notifyProcessResult(count, errors) {
  var webhookUrl = PropertiesService.getScriptProperties().getProperty("DISCORD_WEBHOOK_URL");
  if (!webhookUrl) return;

  var payload = {
    embeds: [{
      title: "📄 請求書処理完了",
      color: errors > 0 ? 15158332 : 3066993,
      fields: [
        { name: "処理件数", value: count + "件", inline: true },
        { name: "エラー", value: errors + "件", inline: true }
      ],
      footer: { text: "請求書自動処理Bot" }
    }]
  };

  UrlFetchApp.fetch(webhookUrl, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  });
}
```

## 動作確認・トラブルシューティング

動作確認とは、構築した請求書処理スクリプトが正しく動作するかテスト実行で検証する作業です。

### 正常動作の確認手順

1. **テスト用PDF配置** — テスト用の請求書PDF（1枚）を「請求書_未処理」フォルダにアップロードします
2. **手動実行** — GASエディタで`processInvoices()`を選択し、「実行」ボタンをクリックします
3. **結果確認** — 「請求書台帳」シートに取引先名・金額・日付が正しく記録されていることを確認します。PDFが「請求書_処理済」フォルダに移動されていれば成功です

### よくあるエラーと対処法

| エラー | 原因 | 解決策 |
|--------|------|--------|
| PDF読み取りエラー | ファイルサイズが大きすぎる | 10MB以下に圧縮、またはページを分割 |
| 金額が正しく取得できない | 書式が特殊 | プロンプトに「カンマ区切りの金額を数値に変換」を追加 |
| 取引先名が空 | 請求書のレイアウトが非定型 | プロンプトに請求書の一般的な構造を説明として追加 |
| APIタイムアウト | ページ数が多い | 最初の1〜2ページのみ送信するよう制限 |

## 応用・カスタマイズ例

基本の請求書処理が動いたら、以下のカスタマイズで実務に合わせて拡張できます。

- **請求書の仕分け自動化** — 取引先名や金額帯をもとに、経費カテゴリ（交通費・消耗品費・外注費など）へ自動で仕分けします。取引先マスタに勘定科目を紐付けておけば、手作業の工数を削減できます
- **金額チェック** — 抽出金額と発注データを照合し、差異がある場合にアラートを通知します
- **仕訳自動生成** — 取引先マスタと連携し、勘定科目を自動で提案します
- **月次レポート** — 月末に台帳データを集計し、PDFレポートを[自動生成](/articles/gas/gas-pdf-generation)できます

AI自動化の全体像は[AIで自動化できる業務一覧](/articles/frameworks/ai-business-overview)、Claude APIの基礎は[Claude API入門](/articles/ai-api/claude-api-intro)をご覧ください。
