---
title: "Cursor × 業務自動化開発｜AIエディタ活用術"
description: "AIエディタCursorのAI機能（Chat・Agent・Tab補完）を活用して業務自動化スクリプトを効率的に開発する方法を解説。GASでの月別売上集計やPythonでのCSV処理など、コピペで動く完成コードとプロンプト例付き。Cursorの料金プランやClaude Codeとの使い分けも紹介します。"
category: "ai-api"
tags: ["Cursor", "AIエディタ", "コード生成", "業務自動化", "開発効率化"]
publishedAt: 2026-02-12
updatedAt: 2026-02-12
author: "れん"
difficulty: "beginner"
timeToRead: 12
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "無料〜月20ドル"
  totalTime: "PT30M"
faq:
  - question: "CursorとVS Codeの違いは？"
    answer: "CursorはVS Code（Visual Studio Code）をベースにしたエディタで、AI機能が標準搭載されています。VS Codeの拡張機能やキーバインドがそのまま使えるため、VS Codeユーザーは違和感なく移行できます。AI Chat、Agent、Tab補完などのAI機能がエディタ内で統合されている点が最大の違いです。"
  - question: "Cursorは無料で使えますか？"
    answer: "Hobbyプラン（無料）でTab補完とAgentリクエストを少量利用できます。Proプラン（月20ドル）では無制限のTab補完と拡張Agentリクエストが使えます（2026年2月時点）。最新料金はCursor公式サイトをご確認ください。"
  - question: "Claude CodeとCursorどちらが良いですか？"
    answer: "Cursorはエディタ内でコードを書きながらAIの補助を受けるスタイルで、既存コードの修正やリファクタリング（コードの動作を変えずに構造を改善する作業）に強みがあります。Claude Codeはターミナルから自然言語で指示してコード全体を生成するスタイルで、ゼロからのスクリプト生成に適しています。両方を併用するのが最も効率的です。"
relatedArticles:
  - "ai-api/ai-coding-overview"
  - "ai-api/claude-code-automation"
  - "reviews/ai-coding-tools-comparison"
draft: false
---

> この記事は[AIコーディングツールで業務自動化を内製する方法](/articles/ai-api/ai-coding-overview)の実践編です。
> AIコーディングツールの全体比較は[AIコーディングツール比較](/articles/reviews/ai-coding-tools-comparison)をご覧ください。

この記事では、CursorエディタのAI機能を活用して業務自動化スクリプトを効率的に開発する方法を解説します。
Chat・Agent・Tab補完の使い分けと、実践的なプロンプト例を紹介します。

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Cursor（[cursor.com](https://cursor.com)で無料登録） |
| 必要な知識 | エディタの基本操作 |
| 所要時間 | 約30分 |
| 費用 | 無料〜月20ドル（Proプラン、2026年2月時点） |
| 完成物 | CursorのAI機能を活用した開発ワークフロー |

## CursorのAI機能の全体像

Cursorとは、VS Code（Visual Studio Code、Microsoftの無料コードエディタ）をベースにした、AI機能が標準搭載されたコードエディタです。CursorはAIエディタとして、VS Codeの使い勝手を維持しながらAI機能を統合しています。

Cursorには以下の4つのAI機能があります。Chat（AIに質問する機能）、Agent（AIにコード生成・編集を依頼する機能、旧Composer）、Tab補完、@メンション（既存ファイルやドキュメントをAIの参照対象に指定する機能）です。

| 機能 | 操作 | 用途 |
|------|------|------|
| Tab補完 | コードを書くとAIが続きを提案 | 定型コードの高速入力 |
| Chat | Ctrl+L でAIに質問 | コードの説明・エラー解決 |
| Agent | Ctrl+I でAIにコード生成を依頼 | 新規スクリプトの生成・修正 |
| @ メンション | @file @docs でコンテキスト指定 | 既存コードやドキュメントを参照 |

CursorはClaude 4.5 Sonnet、GPT-5、Gemini 2.5 Pro等の複数モデルを選択して利用できます（2026年2月時点）。設定画面からモデルを切り替えられるため、タスクに応じて最適なモデルを選べます。

### 料金プラン

| プラン | 月額 | 主な内容 |
|--------|------|----------|
| Hobby | 無料 | Tab補完・Agentリクエスト（少量） |
| Pro | $20 | 無制限のTab補完・拡張Agentリクエスト |
| Pro+ | $60 | Proの3倍のAgentリクエスト |
| Ultra | $200 | Proの20倍のAgentリクエスト・新機能の優先利用 |
| Teams | $40/ユーザー | プライバシーモード・SSO対応 |

※2026年2月時点。最新料金は[Cursor公式](https://cursor.com/pricing)をご確認ください。

## 業務自動化での活用パターン

業務自動化での活用パターンとは、Cursorの各AI機能を業務シーンに応じて使い分ける実践手法です。ここからはCursorの具体的な活用術として、5つの利用パターンを紹介します。

### パターン1: GASスクリプトの生成（Agent）

Agentを使って、GAS（Google Apps Script、Googleが提供する無料のスクリプト実行環境）スクリプトをゼロから生成します。

**Ctrl+I を押して以下を入力:**

```text
GASでスプレッドシートの「売上データ」シートから月別売上を集計するスクリプトを作成。
A列: 日付(yyyy/MM/dd)、B列: 商品名、C列: 金額。
結果は「月別集計」シートにA列: 年月、B列: 合計金額、C列: 件数で出力。
getValues()で一括取得、setValues()で一括書き込みすること。
```

Agentがファイル全体を生成し、差分プレビューで確認してから適用できます。以下はAgentが生成するコード例です。

```javascript
function aggregateMonthlySales() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sourceSheet = ss.getSheetByName('売上データ');
  var targetSheet = ss.getSheetByName('月別集計');

  // 売上データを一括取得
  var lastRow = sourceSheet.getLastRow();
  if (lastRow < 2) return;
  var data = sourceSheet.getRange(2, 1, lastRow - 1, 3).getValues();

  // 月別に集計
  var monthly = {};
  for (var i = 0; i < data.length; i++) {
    var date = new Date(data[i][0]);
    var yearMonth = Utilities.formatDate(date, 'Asia/Tokyo', 'yyyy/MM');
    var amount = Number(data[i][2]);

    if (!monthly[yearMonth]) {
      monthly[yearMonth] = { total: 0, count: 0 };
    }
    monthly[yearMonth].total += amount;
    monthly[yearMonth].count += 1;
  }

  // 結果を配列に変換
  var result = [];
  var keys = Object.keys(monthly).sort();
  for (var j = 0; j < keys.length; j++) {
    result.push([keys[j], monthly[keys[j]].total, monthly[keys[j]].count]);
  }

  // 月別集計シートに一括書き込み
  targetSheet.getRange(1, 1, 1, 3).setValues([['年月', '合計金額', '件数']]);
  if (result.length > 0) {
    targetSheet.getRange(2, 1, result.length, 3).setValues(result);
  }
}
```

このコードをGASエディタにコピペすれば、そのまま実行できます。効果的なプロンプトの書き方は[AIにコードを書かせるプロンプトパターン集](/articles/ai-api/ai-coding-prompt-patterns)も参考にしてください。

### パターン2: 既存コードの改善（Chat）

既存のGASスクリプトを選択してChatに質問します。

**コードを選択してCtrl+L:**

```text
このスクリプトのパフォーマンスを改善してください。
特にgetValue()をループ内で呼んでいる箇所をgetValues()の一括取得に変更してください。
```

### パターン3: エラー修正（Chat）

エラーメッセージをChatに貼り付けて解決策を聞きます。

```text
以下のGASスクリプトで「TypeError: Cannot read properties of undefined」エラーが
出ます。原因と修正方法を教えてください。

@file gas-script.gs
```

`@file` でファイル全体をコンテキストとして渡せるため、AIが全体を理解した上で修正を提案します。

### パターン4: Tab補完で高速コーディング

GASファイルの中でコードを書き始めると、Tab補完がコンテキストに基づいた候補を提案します。

```javascript
// スプレッドシートから売上データを取得する関数
function getSalesData() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('売上データ');
  var lastRow = sheet.getLastRow();
  var data = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
  return data;
}
```

既存のコードパターンを学習して補完するため、同じプロジェクト内の記述スタイルに合ったコードが生成されます。上のコードは、関数名とコメントを入力した後にTab補完を活用して生成した例です。

### パターン5: PythonでCSV売上集計（Agent）

GASだけでなく、PythonスクリプトもAgentで生成できます。

**Ctrl+I を押して以下を入力:**

```text
Pythonで売上CSVファイルを読み込み、月別に売上金額と件数を集計してCSVに出力するスクリプトを作成。
入力CSV: date(yyyy-mm-dd), product, amount の3列。ヘッダー付き。
出力CSV: year_month, total_amount, count の3列。
標準ライブラリのcsvモジュールのみ使用すること。
```

以下はAgentが生成するコード例です。

```python
import csv
from collections import defaultdict

def aggregate_monthly_sales(input_path, output_path):
    """月別売上集計: CSVを読み込み、年月ごとに合計金額と件数を集計して出力する"""
    monthly = defaultdict(lambda: {"total": 0, "count": 0})

    with open(input_path, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            year_month = row["date"][:7]  # yyyy-mm
            amount = int(row["amount"])
            monthly[year_month]["total"] += amount
            monthly[year_month]["count"] += 1

    with open(output_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["year_month", "total_amount", "count"])
        for ym in sorted(monthly.keys()):
            writer.writerow([ym, monthly[ym]["total"], monthly[ym]["count"]])

if __name__ == "__main__":
    aggregate_monthly_sales("sales.csv", "monthly_sales.csv")
    print("集計完了: monthly_sales.csv に出力しました")
```

このスクリプトは標準ライブラリのみで動作するため、追加のインストールは不要です。`python aggregate_sales.py` で実行できます。

## Claude Codeとの使い分け

CursorとClaude Codeの使い分けとは、開発スタイルやタスクの性質に応じて最適なツールを選ぶことです。

| 用途 | Cursor | Claude Code |
|------|--------|-------------|
| ゼロからスクリプト生成 | Agent（UI内で操作） | 自然言語指示（ターミナル） |
| 既存コードの修正 | Chat + @file（得意） | ファイル操作（得意） |
| リアルタイム補完 | Tab補完（高速） | なし |
| 複数ファイルの一括変更 | Agent（対応） | 得意 |
| ターミナル操作 | 内蔵ターミナル | ネイティブ |

**併用パターンの例:**

- **Cursor** — エディタ内でコードを書きながらTab補完とChatでサポートを受けられます
- **Claude Code** — ゼロから新規プロジェクトを生成し、ファイル構成ごと作成できます

詳しい比較は[AIコーディングツール比較](/articles/reviews/ai-coding-tools-comparison)をご覧ください。Windsurfとの比較は[Windsurf入門｜AI IDEで業務ツールを開発](/articles/ai-api/windsurf-intro)をご覧ください。

## 動作確認・トラブルシューティング

Cursorを使い始める際に発生しやすいトラブルと、その解決策を整理します。

| 問題 | 原因 | 解決策 |
|------|------|--------|
| AI補完が表示されない | プランの上限到達 | Proプランへのアップグレードまたは翌月のリセットを待つ |
| Agentの生成コードにエラー | コンテキスト不足 | @file で関連ファイルを追加指定 |
| 日本語プロンプトの精度が低い | モデルの言語対応 | 重要な指示は英語で補足 |
| VS Code拡張機能が動かない | 互換性の問題 | Cursor公式の互換性リストを確認 |

## 応用・カスタマイズ例

Cursorの基本操作に慣れたら、プロジェクトルールやドキュメント参照で活用範囲を広げられます。

- **Rules for AI** — `.cursor/rules/`ディレクトリ（プロジェクトルートに配置するAI動作ルール設定フォルダ）に`.mdc`ファイルでプロジェクト固有のルール（GASのコーディング規約等）を記載して、AI生成の品質を向上できます
- **ドキュメント参照** — `@docs` でGAS公式リファレンスを参照させると、API使用法の正確性が高まります
- **チーム共有** — Teamsプランを利用すると、チーム全体のAI利用状況を管理できます

AIコーディングツールの全体像は[AIコーディングツールで業務自動化を内製する方法](/articles/ai-api/ai-coding-overview)、コスト比較は[AI開発コスト削減](/articles/frameworks/ai-coding-cost-reduction)をご覧ください。
