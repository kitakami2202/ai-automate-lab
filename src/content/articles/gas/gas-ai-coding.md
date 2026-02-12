---
title: "Claude Codeで書くGASスクリプト｜プロンプト実例集"
description: "Claude CodeでGAS（Google Apps Script）を効率的に書くためのプロンプト実例集。スプレッドシート集計・メール送信・API連携のプロンプトをそのまま使えるテンプレート形式で掲載。非エンジニアでもAIにコードを書かせて業務自動化を実現できます。"
category: "gas"
tags: ["GAS", "Claude Code", "AIコーディング", "プロンプト", "業務自動化"]
publishedAt: 2026-02-12
updatedAt: 2026-02-12
author: "れん"
difficulty: "beginner"
timeToRead: 10
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "0円〜月20ドル（2026年2月時点）"
  totalTime: "PT20M"
faq:
  - question: "プログラミング未経験でもGASをAIに書かせられますか？"
    answer: "はい、本記事のプロンプトテンプレートをそのまま使えば、プログラミング未経験でもGASスクリプトを生成できます。ポイントは「やりたいこと」「入出力の形式」「制約条件」を明確に伝えることです。"
  - question: "Claude Code以外のAIツールでも使えますか？"
    answer: "プロンプトの考え方は共通です。ChatGPT、GitHub Copilotなど他のAIコーディングツールでも同様のプロンプトが使えます。ツールごとの違いはAIコーディングツール比較記事をご覧ください。"
  - question: "AIが生成したコードはそのまま使って大丈夫ですか？"
    answer: "必ず動作確認をしてから本番利用してください。特にAPIキーのハードコード、無限ループ、大量メール送信の有無を確認します。本記事のプロンプトにはこれらの注意点を含めたチェック観点も記載しています。"
  - question: "Claude Codeの料金はいくらですか？"
    answer: "Claude Code自体はClaude Pro（月20ドル）またはMaxプランに含まれています。無料のAPIクレジットで試すことも可能です（2026年2月時点）。最新料金はAnthropic公式サイトをご確認ください。"
relatedArticles:
  - "gas/gas-basics"
  - "gas/gas-spreadsheet-automation"
  - "ai-api/claude-code-automation"
draft: false
---

> この記事は[GASでできること完全ガイド](/articles/gas/gas-basics)の実装編です。
> Claude Codeの基本操作は[Claude Codeで業務自動化](/articles/ai-api/claude-code-automation)を先にご覧ください。

この記事では、Claude Codeを使ったAIによるGASコード生成のプロンプト実例集を紹介します。
プロンプトをコピペして使うだけで、非エンジニアでもGASの業務自動化スクリプトを作成できます。

## プロンプト設計の基本

プロンプト設計とは、AIに意図通りのコードを生成させるための指示文の書き方のことです。

以下のプロンプトはClaude Codeのターミナルに直接入力するか、チャットウィンドウに貼り付けて使用します。
GASスクリプト生成で成果が出るプロンプトには、4つの要素があります。

### この記事の前提

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Google、Anthropic（Claude Pro / Max） |
| 必要な知識 | スプレッドシートの基本操作 |
| 所要時間 | 1プロンプトあたり約5分 |
| 費用 | Claude Pro [月20ドル](https://www.anthropic.com/pricing)（2026年2月時点、APIクレジットでも可） |
| 完成物 | 業務自動化GASスクリプト（プロンプトから生成） |

### プロンプトの4要素

| 要素 | 説明 | 例 |
|------|------|-----|
| 役割 | AIの専門性を指定 | 「GASの業務自動化エキスパートとして」 |
| タスク | やりたいことを具体的に | 「スプレッドシートの売上データを月別に集計」 |
| 入出力 | データの形式を明示 | 「A列: 日付、B列: 金額 → 月別合計を新シートに出力」 |
| 制約 | 守るべきルールを指定 | 「APIキーはスクリプトプロパティから取得」 |

この4要素を含むプロンプト設計の詳細は[業務プロンプト設計入門](/articles/frameworks/prompt-engineering-business)をご覧ください。

## プロンプト実例集

ここでは、業務で頻出する3カテゴリ（スプレッドシート操作・メール送信・AI API連携）のプロンプトテンプレートを掲載します。

### スプレッドシート操作のプロンプト

スプレッドシート操作とは、GASでGoogleスプレッドシートのデータを読み書きする処理のことです。
getValues()やsetValues()などのメソッドで一括処理することで、パフォーマンスが向上します。

#### 月別売上集計

```text
GASのエキスパートとして、以下のスクリプトを作成してください。

【タスク】
「売上データ」シートのデータを月別に集計し、「月別集計」シートに出力する

【入力データ（売上データシート）】
- A列: 日付（yyyy/MM/dd形式）
- B列: 商品名
- C列: 金額（数値）
- 1行目はヘッダー

【出力（月別集計シート）】
- A列: 年月（yyyy年MM月）
- B列: 合計金額
- C列: 件数

【制約】
- getValues()で一括取得し、setValues()で一括書き込みする（パフォーマンス重視）
- 月別集計シートが存在しない場合は新規作成する
- 既存データはクリアしてから書き込む
```

このプロンプトで生成されるコードは、[GASスプレッドシート自動化](/articles/gas/gas-spreadsheet-automation)で解説しているパターンに準拠します。

**生成されるコード例**

```javascript
function aggregateMonthlySales() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sourceSheet = ss.getSheetByName('売上データ');
  const data = sourceSheet.getDataRange().getValues().slice(1); // ヘッダー除外

  const monthlyMap = new Map();
  data.forEach(row => {
    const date = new Date(row[0]);
    const key = Utilities.formatDate(date, 'JST', 'yyyy年MM月');
    const amount = row[2];

    if (!monthlyMap.has(key)) {
      monthlyMap.set(key, { total: 0, count: 0 });
    }
    monthlyMap.get(key).total += amount;
    monthlyMap.get(key).count++;
  });

  const result = [['年月', '合計金額', '件数']];
  monthlyMap.forEach((v, k) => result.push([k, v.total, v.count]));

  let targetSheet = ss.getSheetByName('月別集計');
  if (!targetSheet) {
    targetSheet = ss.insertSheet('月別集計');
  }
  targetSheet.clear();
  targetSheet.getRange(1, 1, result.length, 3).setValues(result);
}
```

このコードは、getValues()でデータを一括取得し、Mapオブジェクトで集計後、setValues()で一括書き込みする効率的な構造になっています。

#### 条件付き行の抽出・転記

```text
GASのエキスパートとして、以下のスクリプトを作成してください。

【タスク】
「受注一覧」シートからステータスが「未対応」の行を抽出し、
「要対応」シートに転記する

【入力データ（受注一覧シート）】
- A列: 受注日、B列: 顧客名、C列: 商品名、D列: 金額、E列: ステータス
- 1行目はヘッダー
- ステータスの値: 「未対応」「対応中」「完了」

【出力（要対応シート）】
- 入力と同じ列構成でコピー
- 転記後、元シートのステータスを「対応中」に更新

【制約】
- 要対応シートの既存データは消さず、最終行の次に追記する
- 1件も該当がない場合はダイアログで通知する
```

### メール自動化のプロンプト

メール自動化とは、GASのGmailAppサービスを使って、スプレッドシートのデータをもとに自動でメールを送信する処理のことです。
大量送信時はUtilities.sleep()で送信間隔を空けて、Gmail送信制限に対応します。

#### テンプレートメールの一斉送信

```text
GASのエキスパートとして、以下のスクリプトを作成してください。

【タスク】
「送信リスト」シートの宛先にテンプレートメールを一斉送信する

【送信リストシート】
- A列: メールアドレス、B列: 会社名、C列: 担当者名、D列: 送信済み（「済」で送信スキップ）
- 1行目はヘッダー

【テンプレートシート】
- A1セルにメール件名
- A2セルにメール本文（{{会社名}}と{{担当者名}}をプレースホルダーとして使用）

【制約】
- 送信済み列が「済」の行はスキップ
- 送信後にD列に「済」、E列に送信日時を記入
- Utilities.sleep(1000)でGmail送信制限に対応
- 送信完了後にダイアログで件数を表示
- GmailApp.sendEmailを使用
```

詳しいメール自動化の仕組みは[GASメール自動化](/articles/gas/gas-mail-automation)で解説しています。

### AI API連携のプロンプト

AI API連携とは、GASのUrlFetchApp.fetch()メソッドを使って、Claude APIなどの外部AIサービスと通信し、データの分類・要約・生成を自動化する処理のことです。

APIキーはスクリプトプロパティ（GASのプロジェクトに紐づくキーバリュー型の安全な設定保存領域）から取得することで、コード内にハードコードせず安全に管理できます。

#### Claude API呼び出し（データ分類）

```text
GASのエキスパートとして、以下のスクリプトを作成してください。

【タスク】
スプレッドシートのテキストデータをClaude APIで自動分類する

【入力データ（問い合わせシート）】
- A列: 問い合わせ内容（テキスト）
- B列: 分類結果（空欄のものだけ処理）
- 1行目はヘッダー

【処理内容】
- A列のテキストをClaude API（Haiku 4.5）に送信
- 「見積依頼」「製品問い合わせ」「クレーム」「その他」に分類
- B列に分類結果、C列に要約（30文字以内）を書き込み

【制約】
- APIキーはスクリプトプロパティ「ANTHROPIC_API_KEY」から取得
- APIエンドポイント: https://api.anthropic.com/v1/messages
- ヘッダー: x-api-key, anthropic-version: 2023-06-01
- モデル: claude-haiku-4-5-20251001
- エラー時はB列に「エラー: 」+メッセージを記入
- Utilities.sleep(1000)でAPI制限に対応
- muteHttpExceptions: true を設定してエラー時もスクリプトを継続
```

[GAS × Claude API連携](/articles/gas/gas-claude-api)でこのパターンの詳細を解説しています。

## 生成コードのチェックリスト

チェックリストとは、AIが生成したコードを本番環境に適用する前に確認すべき安全性の項目一覧です。

AIが生成したコードを本番利用する前に、以下のポイントを必ず確認してください。

| チェック項目 | 確認内容 | リスク |
|------------|---------|--------|
| APIキーの扱い | スクリプトプロパティから取得しているか | キー漏洩 |
| ループの安全性 | 無限ループの可能性がないか | GAS実行時間超過 |
| メール送信 | 送信先と件数が正しいか | 誤送信・制限超過 |
| データ上書き | 意図しないデータ消去がないか | データ損失 |
| エラーハンドリング | try-catchでエラーを捕捉しているか | 処理の途中停止 |

## 応用・カスタマイズ例

基本のプロンプトパターンを組み合わせることで、より複雑な業務フローの自動化にも対応できます。

実務でよくある応用例を3つ紹介します。

### 複合プロンプトの活用

複数のステップをまたぐ処理（例: 「フォーム回答→AI分類→Slack通知」）を、1つのプロンプトでまとめて指示することで、統合的なワークフロー自動化が可能です。

プロンプトに「ステップ1: フォーム回答をスプレッドシートから取得、ステップ2: Claude APIで分類、ステップ3: Slack Webhook URLに通知」と段階を明示すると、AIが複数のサービスをつなぐコードを生成します。

### 既存コードの改善

手書きのGASコードをClaude Codeに貼り付け、「このコードをパフォーマンス改善してください」「エラーハンドリングを追加してください」と依頼することで、既存スクリプトのリファクタリングも可能です。

特に、セル単位のループ処理をgetValues()一括処理に書き換える際に有効です。

### テストコード・検証手順の生成

「このスクリプトの動作確認手順を書いてください」とプロンプトに追加すると、AIがスクリプトのテスト手順やサンプルデータを自動生成します。

非エンジニアが自分で検証する際のチェックリストとして活用できます。

## まとめ

本記事では、Claude Codeを使ってGASスクリプトを生成するためのプロンプト実例を3カテゴリ（スプレッドシート操作・メール自動化・AI API連携）で紹介しました。

ポイントは以下の3つです。

- プロンプトに「役割・タスク・入出力・制約」の4要素を含める
- 生成コードは必ずチェックリストで検証する
- まずは1つのプロンプトから試し、段階的に複合処理へ拡張する

GASの基本を押さえたい方は[GASでできること完全ガイド](/articles/gas/gas-basics)、プロンプト設計を体系的に学びたい方は[業務プロンプト設計入門](/articles/frameworks/prompt-engineering-business)をご覧ください。
