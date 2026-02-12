---
title: "OpenAI Codex入門｜クラウドでコード生成・実行"
description: "OpenAI Codex（コーデックス）の使い方を中小企業の業務自動化の観点で解説。Codexの特徴・料金・Claude Codeとの違いを比較し、GASスクリプトやPythonの自動生成を実際に試す手順をコード例付きで紹介します。初心者でも30分で始められます。"
category: "ai-api"
tags: ["OpenAI Codex", "AIコーディング", "コード生成", "自動化", "CLI"]
publishedAt: 2026-02-12
updatedAt: 2026-02-12
author: "れん"
difficulty: "beginner"
timeToRead: 10
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "月約20ドル〜"
  totalTime: "PT30M"
faq:
  - question: "OpenAI CodexとChatGPTの違いは何ですか？"
    answer: "ChatGPTは対話型のAIアシスタントで、Codexはコード生成・実行に特化したAIエージェントです。Codexはクラウドのサンドボックス環境でコードを自動実行し、結果を確認しながら処理を進められる点が特徴です。"
  - question: "Codexの料金はいくらですか？"
    answer: "OpenAI CodexはChatGPT Plus（月20ドル、制限付き）やPro（月200ドル）、Business/Enterpriseプランで利用できます。API経由での利用はcodex-mini-latest等のモデルで従量課金です（2026年2月時点）。最新料金はOpenAI公式サイトをご確認ください。"
  - question: "Claude Codeとどちらが良いですか？"
    answer: "Codexはクラウド実行環境が統合されている点、Claude Codeはローカル環境でのファイル操作やターミナル操作に強い点がそれぞれの強みです。業務自動化スクリプトの生成にはどちらも有効で、料金と使い勝手で選ぶのがおすすめです。詳しくはAIコーディングツール比較記事をご覧ください。"
relatedArticles:
  - "ai-api/ai-coding-overview"
  - "ai-api/claude-code-automation"
  - "reviews/ai-coding-tools-comparison"
draft: false
---

> この記事は[AIコーディングツールで業務自動化を内製する方法](/articles/ai-api/ai-coding-overview)の実践編です。
> AI APIの全体像は[AI API比較・入門ガイド](/articles/ai-api/ai-api-overview)をご覧ください。
> AIコーディングツールの比較は[AIコーディングツール比較](/articles/reviews/ai-coding-tools-comparison)をご覧ください。

この記事では、OpenAI Codexを使って業務自動化スクリプトを生成・実行する方法を解説します。
Codexの特徴と料金を整理し、Claude Codeとの違いを比較した上で、実際にコードを生成する手順を紹介します。

| 項目 | 内容 |
|------|------|
| 必要なアカウント | OpenAI（ChatGPT Plus以上） |
| 必要な知識 | ターミナルの基本操作 |
| 所要時間 | 約30分 |
| 費用 | ChatGPT Plus 月20ドル〜 or API（Application Programming Interface、プログラムからサービスを呼び出す仕組み）従量課金 |
| 完成物 | Codexで生成した業務自動化スクリプト |

## OpenAI Codexとは

OpenAI Codexとは、OpenAIが提供するコード生成・実行に特化したAIエージェントです。自然言語の指示からコードを生成し、クラウドのサンドボックス環境（外部に影響を与えない隔離された実行環境）で自動実行できます。
最大の特徴は、クラウドでコード生成から実行までを完結できる点です。

| 特徴 | 説明 |
|------|------|
| クラウド実行 | サンドボックス環境でコードを安全に実行 |
| マルチファイル | 複数ファイルにまたがるプロジェクトを一括生成 |
| 自動修正 | エラーが発生したら自動で修正して再実行 |
| Git連携 | GitHubリポジトリと直接連携可能 |

### 料金プラン

| プラン | 月額 | Codex利用 |
|--------|------|----------|
| ChatGPT Plus | $20 | 30〜150メッセージ/5時間 |
| ChatGPT Pro | $200 | フル利用可 |
| Business | $25/ユーザー | チーム利用可 |
| API（codex-mini-latest） | 従量課金 | codex-mini-latest（Codexのコンパクトモデル、API経由で利用） |

※2026年2月時点。最新料金は[OpenAI公式料金ページ](https://openai.com/pricing)をご確認ください。

## Claude Codeとの比較

Claude Codeとの比較とは、それぞれの得意分野を把握して用途に応じた使い分けを判断するための整理です。

| 比較項目 | OpenAI Codex | Claude Code |
|---------|-------------|-------------|
| 実行環境 | クラウドサンドボックス | ローカル環境 |
| ファイル操作 | クラウド上で操作 | ローカルファイルを直接操作 |
| Git連携 | GitHub連携あり | ローカルGitを操作 |
| 月額料金 | $20〜$200 | $20（Claude Pro） |
| 得意分野 | クラウド完結のプロジェクト | ローカルの業務自動化 |
| 日本語対応 | 対応 | 対応 |

業務自動化スクリプト（Google Apps Script（GAS、Googleサービスを自動化するスクリプト言語）・Python）の生成には、ローカルで直接ファイルを操作できるClaude Codeが手軽です。
一方、複数ファイルのプロジェクト生成やクラウド完結の開発にはCodexが適しています。

詳細な比較は[AIコーディングツール比較](/articles/reviews/ai-coding-tools-comparison)をご覧ください。

## Codexの使い方

Codexの使い方とは、ChatGPTのUI経由で利用する方法と、API経由でプログラムから呼び出す方法の2通りがあります。

### ChatGPTからの利用

1. [chatgpt.com](https://chatgpt.com) にアクセスし、ChatGPT画面左上のモデル選択メニューから「Codex」を選択します
2. タスク入力欄に自然言語でタスクを記述します

```text
Google Apps Scriptで、スプレッドシートの「売上データ」シートから
月別売上合計を集計し、「月別集計」シートに出力するスクリプトを作成してください。

入力:
- A列: 日付（yyyy/MM/dd）
- B列: 商品名
- C列: 金額

出力:
- A列: 年月
- B列: 合計金額
- C列: 件数
```

3. Codexがコードを生成し、サンドボックスで実行結果を確認できます
4. 問題があれば追加の指示で修正を依頼します

Codexが上記のプロンプトから生成するコードの例を以下に示します。

```javascript
/**
 * 「売上データ」シートから月別売上合計を集計し、
 * 「月別集計」シートに出力するGASスクリプト
 */
function aggregateMonthlySales() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const srcSheet = ss.getSheetByName("売上データ");
  const dstSheet = ss.getSheetByName("月別集計")
    || ss.insertSheet("月別集計");

  // 売上データを取得（2行目以降、ヘッダー除外）
  const data = srcSheet.getDataRange().getValues();
  const rows = data.slice(1); // ヘッダーを除外

  // 年月ごとに集計するオブジェクト
  const summary = {};

  rows.forEach(function(row) {
    const date = new Date(row[0]);       // A列: 日付
    // const itemName = row[1];           // B列: 商品名（集計では未使用）
    const amount = Number(row[2]);        // C列: 金額

    // yyyy/MM 形式の年月キーを生成
    const yearMonth = Utilities.formatDate(date, "Asia/Tokyo", "yyyy/MM");

    if (!summary[yearMonth]) {
      summary[yearMonth] = { total: 0, count: 0 };
    }
    summary[yearMonth].total += amount;
    summary[yearMonth].count += 1;
  });

  // 月別集計シートをクリアしてヘッダーを書き込み
  dstSheet.clearContents();
  dstSheet.getRange(1, 1, 1, 3).setValues([["年月", "合計金額", "件数"]]);

  // 集計結果を年月順にソートして書き込み
  const sortedKeys = Object.keys(summary).sort();
  const output = sortedKeys.map(function(key) {
    return [key, summary[key].total, summary[key].count];
  });

  if (output.length > 0) {
    dstSheet.getRange(2, 1, output.length, 3).setValues(output);
  }
}
```

このコードをGASのスクリプトエディタに貼り付けて `aggregateMonthlySales` を実行すれば、「月別集計」シートに結果が出力されます。
Codexはこのようなコードを自動生成し、サンドボックス上でテストまでおこなってくれます。

### API経由での利用

OpenAI APIを使えば、プログラムからCodexのコード生成機能を呼び出せます。
まず環境を準備します。

```bash
pip install openai
```

APIキーは環境変数に設定します。コード中にAPIキーを直接書かないでください。

```bash
# Linux / macOS
export OPENAI_API_KEY="ここに取得したAPIキーを設定"

# Windows（PowerShell）
$env:OPENAI_API_KEY="ここに取得したAPIキーを設定"
```

環境変数を設定したら、以下のPythonコードでCodexを呼び出せます。

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="codex-mini-latest",
    instructions="GASの業務自動化エキスパートとして回答してください。",
    input="スプレッドシートの売上データを月別に集計するGASスクリプトを書いてください。"
)

print(response.output_text)
```

## 業務自動化での活用パターン

業務自動化での活用パターンとは、Codexに指示を出す際によく使われるタスクの類型です。パターンを知っておくと指示の精度が上がります。以下に代表的な4パターンをまとめました。

| パターン | 指示例 | 生成されるコード |
|---------|--------|---------------|
| データ集計 | 「売上データを月別集計して」 | GASスクリプト |
| メール自動化 | 「顧客リストにメール一斉送信して」 | GAS + GmailApp |
| API連携 | 「Claude APIでテキスト分類して」 | Python / GAS |
| ファイル整理 | 「フォルダ内のCSVを結合して」 | Pythonスクリプト |

プロンプトの書き方を工夫すると、生成コードの精度がさらに上がります。
具体的なパターンは[AIコーディングプロンプトパターン集](/articles/ai-api/ai-coding-prompt-patterns)をご覧ください。

## トラブルシューティングと応用例

トラブルシューティングとは、Codexを使い始める際に発生しやすいエラーの原因と解決策をまとめたものです。

| エラー | 原因 | 解決策 |
|--------|------|--------|
| Codexが利用できない | プランの制限 | Plus以上のプランにアップグレード |
| 生成コードにエラー | 指示が曖昧 | 入出力の形式と制約条件を具体的に記述 |
| GASコードが動かない | GAS固有のAPIを誤認 | GAS公式ドキュメントのリンクをプロンプトに含める |
| API利用上限 | レート制限 | リクエスト間隔を空ける |

### 応用・カスタマイズ例

- **Codexでプロトタイプを生成し、ローカルで仕上げる** — Codexでコードの雛形を作り、[Claude Code](/articles/ai-api/claude-code-automation)でローカル環境に組み込むと効率的です
- **チーム開発** — BusinessプランでGitHub連携を設定し、コードレビューの効率化に活用できます

AIコーディングのコスト比較は[AI開発コスト削減](/articles/frameworks/ai-coding-cost-reduction)をご覧ください。
