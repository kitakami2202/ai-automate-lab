---
title: "OpenAI Codex入門｜クラウドでコード生成・実行"
description: "OpenAI Codex（コーデックス）の使い方を中小企業の業務自動化の観点で解説。Codexの特徴・料金・Claude Codeとの違いを比較し、GASスクリプトやPythonの自動生成を実際に試す手順をコード例付きで紹介します。"
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
    answer: "OpenAI CodexはChatGPT Pro（月200ドル）またはTeam/Enterpriseプランで利用可能です。API経由での利用はCodex-mini等のモデルで従量課金です（2026年2月時点）。最新料金はOpenAI公式サイトをご確認ください。"
  - question: "Claude Codeとどちらが良いですか？"
    answer: "Codexはクラウド実行環境が統合されている点、Claude Codeはローカル環境でのファイル操作やターミナル操作に強い点がそれぞれの強みです。業務自動化スクリプトの生成にはどちらも有効で、料金と使い勝手で選ぶのがおすすめです。詳しくはAIコーディングツール比較記事をご覧ください。"
relatedArticles:
  - "ai-api/ai-api-overview"
  - "ai-api/claude-code-automation"
  - "reviews/ai-coding-tools-comparison"
draft: false
---

> この記事は[AI API比較・入門ガイド](/articles/ai-api/ai-api-overview)の実装編です。
> AIコーディングツールの全体比較は[AIコーディングツール比較](/articles/reviews/ai-coding-tools-comparison)をご覧ください。

この記事では、OpenAI Codexを使って業務自動化スクリプトを生成・実行する方法を解説します。
Codexの特徴と料金を整理し、Claude Codeとの違いを比較した上で、実際にコードを生成する手順を紹介します。

### この記事の前提

| 項目 | 内容 |
|------|------|
| 必要なアカウント | OpenAI（ChatGPT Pro or Team） |
| 必要な知識 | ターミナルの基本操作 |
| 所要時間 | 約30分 |
| 費用 | ChatGPT Pro 月200ドル or API従量課金 |
| 完成物 | Codexで生成した業務自動化スクリプト |

## OpenAI Codexとは

OpenAI Codexとは、OpenAIが提供するコード生成・実行に特化したAIエージェントです。自然言語の指示からコードを生成し、クラウドのサンドボックス環境で自動実行できます。

| 特徴 | 説明 |
|------|------|
| クラウド実行 | サンドボックス環境でコードを安全に実行 |
| マルチファイル | 複数ファイルにまたがるプロジェクトを一括生成 |
| 自動修正 | エラーが発生したら自動で修正して再実行 |
| Git連携 | GitHubリポジトリと直接連携可能 |

### 料金プラン

| プラン | 月額 | Codex利用 |
|--------|------|----------|
| ChatGPT Plus | $20 | 制限付き |
| ChatGPT Pro | $200 | フル利用可 |
| Team | $25/ユーザー | チーム利用可 |
| API（codex-mini） | 従量課金 | API経由 |

※2026年2月時点。最新料金は[OpenAI公式料金ページ](https://openai.com/pricing)をご確認ください。

## Claude Codeとの比較

| 比較項目 | OpenAI Codex | Claude Code |
|---------|-------------|-------------|
| 実行環境 | クラウドサンドボックス | ローカル環境 |
| ファイル操作 | クラウド上で操作 | ローカルファイルを直接操作 |
| Git連携 | GitHub連携あり | ローカルGitを操作 |
| 月額料金 | $20〜$200 | $20（Claude Pro） |
| 得意分野 | クラウド完結のプロジェクト | ローカルの業務自動化 |
| 日本語対応 | 対応 | 対応 |

業務自動化スクリプト（GAS・Python）の生成には、ローカルで直接ファイルを操作できるClaude Codeが手軽です。一方、複数ファイルのプロジェクト生成やクラウド完結の開発にはCodexが適しています。

詳細な比較は[AIコーディングツール比較](/articles/reviews/ai-coding-tools-comparison)をご覧ください。

## Codexの使い方

### ChatGPTからの利用

1. [chat.openai.com](https://chat.openai.com) にアクセスし、Codexを選択します
2. 自然言語でタスクを記述します

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

### API経由での利用

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

| パターン | 指示例 | 生成されるコード |
|---------|--------|---------------|
| データ集計 | 「売上データを月別集計して」 | GASスクリプト |
| メール自動化 | 「顧客リストにメール一斉送信して」 | GAS + GmailApp |
| API連携 | 「Claude APIでテキスト分類して」 | Python / GAS |
| ファイル整理 | 「フォルダ内のCSVを結合して」 | Pythonスクリプト |

## 動作確認・トラブルシューティング

| エラー | 原因 | 解決策 |
|--------|------|--------|
| Codexが利用できない | プランの制限 | Pro or Teamプランにアップグレード |
| 生成コードにエラー | 指示が曖昧 | 入出力の形式と制約条件を具体的に記述 |
| GASコードが動かない | GAS固有のAPIを誤認 | GAS公式ドキュメントのリンクをプロンプトに含める |
| API利用上限 | レート制限 | リクエスト間隔を空ける |

## 応用・カスタマイズ例

- **プロンプトパターンの活用** — [AIコーディングプロンプトパターン集](/articles/ai-api/ai-coding-prompt-patterns)のテンプレートをCodexに入力して精度を向上
- **Claude Codeとの併用** — Codexでプロトタイプを生成し、[Claude Code](/articles/ai-api/claude-code-automation)でローカル環境に組み込む
- **チーム開発** — TeamプランでGitHub連携を設定し、コードレビューの効率化

AI APIの全体像は[AI API比較・入門ガイド](/articles/ai-api/ai-api-overview)、AIコーディングのコスト比較は[AI開発コスト削減](/articles/frameworks/ai-coding-cost-reduction)をご覧ください。
