---
title: "AI × 採用書類スクリーニング自動化"
description: "AIを活用して採用書類（履歴書・職務経歴書）のスクリーニングを効率化する方法を解説。GAS+Claude APIで応募書類をAI要約し、求人要件とのスキルマッチ度を自動評価するスクリプトをコード付きで紹介。中小企業の採用担当者の書類確認時間を削減します。"
category: "frameworks"
tags: ["AI自動化", "採用", "スクリーニング", "人事", "中小企業"]
publishedAt: 2026-02-12
updatedAt: 2026-02-12
author: "れん"
difficulty: "beginner"
timeToRead: 10
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "月約300円〜（2026年2月時点）"
  totalTime: "PT30M"
faq:
  - question: "AIだけで採用の合否を決めてよいですか？"
    answer: "いいえ、AIは書類の要約とスキルマッチ度の目安を提示するツールとして活用してください。最終的な判断は必ず人間が行います。AIの評価結果を参考情報として使い、書類確認の優先順位付けに活用するのが適切です。"
  - question: "個人情報の取り扱いは大丈夫ですか？"
    answer: "AI APIに送信するデータには個人情報が含まれるため、利用するAIサービスのプライバシーポリシーを確認してください。Anthropic APIはデフォルトでデータをモデル学習に使用しません。応募者への個人情報の取り扱い説明も必要です。"
  - question: "どんな評価基準を設定できますか？"
    answer: "求人要件（必須スキル・歓迎スキル・経験年数等）をプロンプトに記載し、各項目の合致度をAIに判定させます。評価基準はスプレッドシートで管理し、求人ごとに柔軟に変更できます。"
relatedArticles:
  - "frameworks/ai-business-overview"
  - "frameworks/ai-introduction-5steps"
  - "gas/gas-claude-api"
draft: false
---

> この記事は[AIで自動化できる業務一覧](/articles/frameworks/ai-business-overview)の実装編です。

書類選考の効率化は、採用活動を行う中小企業にとって大きな課題です。
この記事では、GAS（Google Apps Script、Googleの無料プログラミング環境）とClaude API（Anthropic社が提供するAIの機能を外部から呼び出す仕組み）を組み合わせたAI採用自動化の仕組みを紹介します。
採用書類のスクリーニング（応募書類のふるい分け）を約30分で構築でき、書類の要約・スキルマッチ度の評価・優先順位付けをAIが支援します。
採用担当者の確認作業を大幅に削減できます。

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Google、Anthropic |
| 必要な知識 | [GAS × Claude API連携](/articles/gas/gas-claude-api)を読了済み |
| 所要時間 | 約30分 |
| 費用 | GAS: 0円 / Claude API: 月約300円（[料金詳細](https://platform.claude.com/docs/en/about-claude/pricing)、2026年2月時点） |
| 完成物 | 応募書類のAI要約・スキルマッチ度評価スクリプト |

## この記事で作るもの

AI採用スクリーニングとは、応募書類（履歴書・職務経歴書）の内容をAIが読み取り、求人要件とのマッチ度を評価して優先順位を付ける仕組みです。

| 機能 | 内容 | 効果 |
|------|------|------|
| 書類要約 | 経歴・スキルを3行にまとめ | 確認時間を大幅に短縮 |
| スキルマッチ | 求人要件との合致度を評価 | 優先度の高い応募者を即座に把握 |
| 一覧化 | スプレッドシートに評価結果を集約 | チーム内で共有しやすい |

**重要:** AIの評価はあくまで参考情報です。最終的な採用判断は必ず人間が行ってください。

## 実装手順

ここでは、スプレッドシートに求人要件を定義し、Google Driveの応募書類をClaude APIで自動評価するスクリプトを作成します。
GASやClaude APIの基本的なセットアップ方法は[GAS × Claude API連携ガイド](/articles/gas/gas-claude-api)で詳しく解説しています。

### ステップ1: スプレッドシートとGASプロジェクトの準備

まず、評価に使うスプレッドシートとGASプロジェクトを準備します。

1. Googleスプレッドシートを新規作成します
2. シートを2つ作成し、名前を「求人要件」「評価結果」に変更します
3. 「評価結果」シートの1行目に以下のヘッダーを入力します

| A列 | B列 | C列 | D列 | E列 | F列 | G列 |
|-----|-----|-----|-----|-----|-----|-----|
| ファイル名 | 要約 | マッチ度 | 強み | 懸念点 | 優先度 | 評価日時 |

4. メニューの「拡張機能」→「Apps Script」からGASエディタを開きます
5. GASエディタの「サービス」→「+」→「Drive API」を追加してDrive APIを有効化します（バージョンはv2を選択してください）
6. スクリプトプロパティに以下の2つを設定します

| プロパティ名 | 値 |
|-------------|---|
| `ANTHROPIC_API_KEY` | Anthropic APIキー |
| `APPLICATION_FOLDER_ID` | 応募書類を格納するGoogle DriveフォルダのID |

### ステップ2: 求人要件の定義

スプレッドシートの「求人要件」シートに評価基準を定義します。

| A列（項目） | B列（条件） | C列（重要度） |
|------------|-----------|-------------|
| 必須スキル | JavaScript, GAS | 高 |
| 歓迎スキル | Python, AI API | 中 |
| 経験年数 | 3年以上 | 高 |
| その他 | チーム開発経験 | 低 |

### ステップ3: 応募書類のAI評価

以下のコードをGASエディタに貼り付けてください。

```javascript
/**
 * Google Driveの応募書類をAIで評価
 */
function screenApplications() {
  var folderId = PropertiesService.getScriptProperties().getProperty("APPLICATION_FOLDER_ID");
  var folder = DriveApp.getFolderById(folderId);
  var files = folder.getFiles();

  var resultSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("評価結果");
  var requirements = getRequirements();
  var count = 0;

  while (files.hasNext()) {
    var file = files.next();
    var fileName = file.getName();

    // 処理済みチェック（既に評価結果シートにあるか）
    if (isAlreadyProcessed(resultSheet, fileName)) continue;

    try {
      var text = extractText(file);
      var evaluation = evaluateWithAi(text, requirements);

      resultSheet.appendRow([
        fileName,
        evaluation.summary,
        evaluation.matchScore,
        evaluation.strengths,
        evaluation.concerns,
        evaluation.priority,
        new Date()
      ]);
      count++;
      Utilities.sleep(1000);
    } catch (e) {
      resultSheet.appendRow([fileName, "エラー: " + e.message, "", "", "", "", new Date()]);
    }
  }

  if (count > 0) {
    SpreadsheetApp.getUi().alert(count + "件の応募書類を評価しました。");
  }
}

/**
 * 求人要件を取得
 */
function getRequirements() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("求人要件");
  var data = sheet.getDataRange().getValues();
  var text = "";
  for (var i = 1; i < data.length; i++) {
    text += data[i][0] + "（" + data[i][2] + "）: " + data[i][1] + "\n";
  }
  return text;
}

/**
 * ファイルからテキストを抽出
 */
function extractText(file) {
  var mimeType = file.getMimeType();
  if (mimeType === MimeType.PDF) {
    // PDFをGoogle Docsに変換してテキストを抽出
    // ※ Drive APIはv2を使用（「サービス追加」時にv2を選択すること）
    var resource = { title: file.getName(), mimeType: MimeType.GOOGLE_DOCS };
    var docFile = Drive.Files.copy(resource, file.getId(), { convert: true });
    var doc = DocumentApp.openById(docFile.id);
    var text = doc.getBody().getText();
    DriveApp.getFileById(docFile.id).setTrashed(true);
    return text;
  }
  return file.getBlob().getDataAsString();
}

/**
 * AIで応募書類を評価
 */
function evaluateWithAi(documentText, requirements) {
  var apiKey = PropertiesService.getScriptProperties().getProperty("ANTHROPIC_API_KEY");

  var payload = {
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: "あなたは採用アシスタントAIです。応募書類を求人要件と照合し、以下のJSON形式で評価してください：\n" +
      '{"summary":"経歴の3行要約","matchScore":"A/B/C","strengths":"強み(1文)","concerns":"懸念点(1文)","priority":"高/中/低"}',
    messages: [{
      role: "user",
      content: "【求人要件】\n" + requirements + "\n\n【応募書類】\n" + documentText.substring(0, 2000)
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

  // AIのレスポンスをJSONとしてパース（不正な形式への対応を含む）
  try {
    return JSON.parse(result.content[0].text);
  } catch (e) {
    return {
      summary: "JSON解析エラー: AIの応答を正しく解析できませんでした",
      matchScore: "N/A",
      strengths: "手動で確認してください",
      concerns: "手動で確認してください",
      priority: "中"
    };
  }
}

function isAlreadyProcessed(sheet, fileName) {
  var data = sheet.getDataRange().getValues();
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === fileName) return true;
  }
  return false;
}
```

## 動作確認・トラブルシューティング

動作確認とは、テスト用の応募書類を使ってスクリプトの動作を検証する工程です。以下の手順で確認してください。

1. Google Driveの指定フォルダにテスト用のPDFまたはテキストファイルを1〜2件アップロードします
2. GASエディタで `screenApplications` 関数を選択し、「実行」をクリックします
3. 初回実行時はGoogleアカウントの権限承認が求められるので、許可します
4. 「評価結果」シートにAIの評価結果が書き込まれていれば成功です

以下に、よくあるエラーと対処法をまとめます。

| エラー | 原因 | 解決策 |
|--------|------|--------|
| PDF読み取りエラー | Drive API未有効またはバージョン不一致 | GASエディタの「サービス」からDrive API（v2）を有効化します |
| 評価が偏る | 求人要件の記載不足 | 具体的なスキル名・経験年数を明記します |
| JSON解析エラー | AIのレスポンスが想定外の形式 | エラーハンドリング済みのため「評価結果」シートで手動確認してください |
| 個人情報の懸念 | API利用規約の確認不足 | [Anthropicのプライバシーポリシー](https://www.anthropic.com/privacy)を確認します |

## 応用・カスタマイズ例

基本のスクリーニングスクリプトをベースに、業務に合わせたカスタマイズが可能です。

- **フォーム連携** ―― [Googleフォーム](/articles/gas/gas-form-automation)で応募受付の仕組みを作り、添付ファイルをAIが自動評価する流れと連携できます。
- **面接質問の自動生成** ―― 書類の内容に基づいて、面接で確認すべき質問をAIが提案する機能を追加できます。
- **通知連携** ―― 優先度「高」の応募があった場合に、[Discord Bot](/articles/discord-bot/discord-ai-bot)と連携して即時通知する仕組みを構築できます。

AI自動化の全体像は[AIで自動化できる業務一覧](/articles/frameworks/ai-business-overview)をご覧ください。AI導入の進め方に迷ったら[AI導入5ステップ](/articles/frameworks/ai-introduction-5steps)も参考にしてください。
