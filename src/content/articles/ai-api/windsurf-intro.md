---
title: "Windsurf入門｜AI IDEで業務ツールを開発"
description: "Windsurf（ウィンドサーフ）の使い方を中小企業の業務自動化の観点で解説。CascadeフローとAIエージェント機能の特徴を整理し、GASスクリプト・Pythonの自動生成をプロンプト例付きで紹介。Claude CodeやCursorとの使い分けも解説します。"
category: "ai-api"
tags: ["Windsurf", "AI IDE", "コード生成", "業務自動化", "開発効率化"]
publishedAt: 2026-02-12
updatedAt: 2026-02-12
author: "れん"
difficulty: "beginner"
timeToRead: 10
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "無料〜月15ドル"
  totalTime: "PT30M"
faq:
  - question: "WindsurfとCursorの違いは何ですか？"
    answer: "WindsurfはCascadeと呼ばれるAIエージェント機能が特徴で、AIがファイル構造を理解して複数ファイルにまたがる変更を自動で行えます。CursorはComposer・Chat・Tab補完の3機能が中心です。どちらもVS Codeベースですが、エージェント型の自律操作はWindsurfが得意です。"
  - question: "Windsurfは無料で使えますか？"
    answer: "Freeプランがあり、AIクレジット付きで無料で始められます。Proプラン（月15ドル）ではAIクレジットが増え、より多くのコード生成が可能です（2026年2月時点）。最新料金はWindsurf公式サイトをご確認ください。"
  - question: "業務自動化にはどのAI IDEが良いですか？"
    answer: "GASやPythonの業務スクリプト生成にはClaude Code（CLI型）が最も手軽です。エディタ内で開発したい場合はCursorまたはWindsurfが適しています。Windsurfは複数ファイルの自動操作に強みがあるため、やや複雑なプロジェクトに向いています。"
relatedArticles:
  - "ai-api/ai-coding-overview"
  - "ai-api/cursor-business"
  - "reviews/ai-coding-tools-comparison"
draft: false
---

> AIコーディングの全体像は[AIコーディングツールで業務自動化を内製する方法](/articles/ai-api/ai-coding-overview)をご覧ください。
> 他ツールとの比較は[AIコーディングツール比較](/articles/reviews/ai-coding-tools-comparison)で解説しています。

この記事では、AI IDE「Windsurf」を業務自動化スクリプトの開発に活用する方法を解説します。
Cascadeフローの特徴と、GAS（Google Apps Script）・Pythonスクリプトの自動生成をプロンプト例付きで紹介します。

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Windsurf（[windsurf.com](https://windsurf.com)で無料登録） |
| 必要な知識 | エディタの基本操作 |
| 所要時間 | 約30分 |
| 費用 | 無料〜月15ドル（Proプラン） |
| 完成物 | WindsurfのAI機能を活用した開発ワークフロー |

## Windsurfとは

Windsurfとは、AIエージェント機能が統合されたコードエディタ（IDE）です。
VS Code（Visual Studio Code、Microsoftの無料コードエディタ）をベースにしており、Cascade（カスケード）と呼ばれるAIアシスタントが複数ファイルの操作を自律的に行えます。

| 機能 | 内容 |
|------|------|
| Cascade | AIエージェントがコードの生成・編集・実行を自律的に処理 |
| Autocomplete | コード入力中のAI補完 |
| インラインEdit | コードを選択してAIに修正を依頼 |
| ターミナル連携 | AIがターミナルコマンドを提案・実行 |

Cascadeでは、Claude 3.7 Sonnet・GPT-5.2・Gemini 3 Flashなど複数のAIモデルを利用できます。
プランや時期によって利用可能なモデルが異なるため、最新情報は[Windsurf公式ドキュメント](https://docs.windsurf.com/windsurf/models)をご確認ください（2026年2月時点）。

### 料金プラン

| プラン | 月額 | AIクレジット |
|--------|------|-------------|
| Free | 無料 | 25クレジット/月 |
| Pro | $15 | 500クレジット/月 |
| Team | $30/ユーザー | チーム管理+プール型クレジット |

※2026年2月時点。最新料金は[Windsurf公式](https://windsurf.com/pricing)をご確認ください。

## Cascadeフローの活用

Cascadeとは、Windsurfに搭載されたAIエージェント機能です。
単なるコード補完ではなく「タスク全体を理解して自律的にコードを生成・修正する」仕組みです。
WindsurfのCascadeを使えば、業務ツール開発に必要なコード生成を自然言語の指示だけで進められます。

### Cascadeの特徴

| 特徴 | 説明 |
|------|------|
| コンテキスト理解 | プロジェクト全体のファイル構造を自動で把握 |
| マルチファイル操作 | 複数ファイルの作成・編集を一度の指示で実行 |
| ターミナル実行 | コマンドの提案と実行まで自動で行う |
| エラー自動修正 | 実行エラーを検出して自動で修正を試行 |

### 業務自動化での使い方

Cascadeパネル（Ctrl+L）を開いて自然言語で指示します。

**例: GASスクリプトの生成**

```text
Google Apps Scriptで以下のスクリプトを作成してください。

目的: スプレッドシートの売上データを月別に集計する
入力: 「売上データ」シート（A列: 日付, B列: 商品名, C列: 金額）
出力: 「月別集計」シートにA列: 年月, B列: 合計金額, C列: 件数
制約: getValues()で一括取得、setValues()で一括書き込み
```

Cascadeが生成するコード例を示します。

```javascript
/**
 * 「売上データ」シートを月別に集計し「月別集計」シートへ出力する
 */
function aggregateSalesByMonth() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var srcSheet = ss.getSheetByName("売上データ");
  var srcData = srcSheet.getDataRange().getValues(); // ヘッダー含む全データを一括取得

  // 月別に金額・件数を集計（ヘッダー行をスキップ）
  var summary = {};
  for (var i = 1; i < srcData.length; i++) {
    var date = new Date(srcData[i][0]);
    var yearMonth =
      date.getFullYear() + "/" + ("0" + (date.getMonth() + 1)).slice(-2); // "2026/01" 形式
    var amount = Number(srcData[i][2]);

    if (!summary[yearMonth]) {
      summary[yearMonth] = { total: 0, count: 0 };
    }
    summary[yearMonth].total += amount;
    summary[yearMonth].count += 1;
  }

  // 出力用の二次元配列を作成
  var output = [["年月", "合計金額", "件数"]]; // ヘッダー行
  var keys = Object.keys(summary).sort();
  for (var j = 0; j < keys.length; j++) {
    output.push([keys[j], summary[keys[j]].total, summary[keys[j]].count]);
  }

  // 「月別集計」シートを取得（なければ新規作成）し一括書き込み
  var destSheet = ss.getSheetByName("月別集計");
  if (!destSheet) {
    destSheet = ss.insertSheet("月別集計");
  }
  destSheet.clear();
  destSheet
    .getRange(1, 1, output.length, output[0].length)
    .setValues(output); // 一括書き込みで高速化
}
```

**このコードのポイント:**

- `getValues()` で一括取得し、`setValues()` で一括書き込みすることでAPI呼び出し回数を最小化しています
- 月キーを `"2026/01"` 形式にしてソート可能にしています
- 「月別集計」シートがなければ自動作成するため、初回実行でも動作します

**例: Python + Claude APIの連携スクリプト**

```text
PythonでClaude APIを使ったテキスト分類スクリプトを作成してください。

目的: CSVファイルの問い合わせ文を5カテゴリに分類する
入力: input.csv（列: id, text）
出力: output.csv（列: id, text, category, confidence）
カテゴリ: 見積依頼 / 製品問い合わせ / クレーム / 営業 / その他
APIキーは環境変数 ANTHROPIC_API_KEY から取得
```

Cascadeが requirements.txt（Pythonライブラリの依存関係ファイル）とPythonスクリプトの両方を生成します。

## CursorやClaude Codeとの比較

AI IDEの使い分けとは、開発スタイルや業務の複雑さに応じて最適なツールを選ぶことです。
以下の表で主要な違いを比較します。

| 比較項目 | Windsurf | Cursor | Claude Code |
|---------|----------|--------|-------------|
| 操作方法 | エディタ内AI | エディタ内AI | ターミナルCLI |
| 自律操作 | Cascade（得意） | Composer | エージェント（得意） |
| コード補完 | Autocomplete | Tab補完 | なし |
| マルチファイル | 得意 | 対応 | 得意 |
| 月額費用 | 無料〜$15 | 無料〜$20 | 従量課金 |
| ベース | VS Code | VS Code | ターミナル |

**使い分けの目安:**

- **単一スクリプトの生成**には、[Claude Code](/articles/ai-api/claude-code-automation)が最も手軽です
- **エディタ内で書きながら補完**したい場合は、[Cursor](/articles/ai-api/cursor-business)またはWindsurfが適しています
- **複数ファイルのプロジェクト**では、WindsurfのCascadeが効率的に作業を進められます

## 動作確認・トラブルシューティング

Windsurfを使い始める際に発生しやすいトラブルと、その解決策を整理します。

| 問題 | 原因 | 解決策 |
|------|------|--------|
| Cascadeが応答しない | AIクレジット不足 | Proプランにアップグレードまたは翌月まで待つ |
| 生成コードにGAS固有のエラー | GAS APIの学習データ不足 | GAS公式ドキュメントのURLを指示に含める |
| ファイルが意図せず変更された | Cascadeの自律操作 | 変更前にGitコミットし、不要な変更はrevert（取り消し）する |
| VS Code拡張が動かない | 互換性の問題 | Windsurf公式の互換性情報を確認 |

## 応用・カスタマイズ例

Windsurfの基本操作に慣れたら、プロジェクトルールや[MCP（Model Context Protocol）](/articles/ai-api/mcp-intro)連携で活用範囲を広げられます。

- **プロジェクトルール** --- `.windsurfrules` ファイルにプロジェクト固有のルールを記載し、AIの出力を制御できます
- **MCP連携** --- MCP対応ツールを追加し、WindsurfからGoogle Workspaceを操作できます
- **チーム利用** --- Teamプランで組織全体のAI利用を管理し、コーディング規約を統一できます

AI開発の全体像は[AIコーディングツールで業務自動化を内製する方法](/articles/ai-api/ai-coding-overview)をご覧ください。
コスト比較は[AI開発コスト削減](/articles/frameworks/ai-coding-cost-reduction)で解説しています。
