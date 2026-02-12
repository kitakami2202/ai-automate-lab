---
title: "Cursor × 業務自動化開発｜AIエディタ活用術"
description: "CursorエディタのAI機能を活用して業務自動化スクリプトを効率的に開発する方法を解説。Chat・Composer・Tab補完の使い分けと、GAS・Python・Node.jsの自動生成を具体的なプロンプト例付きで紹介します。"
category: "ai-api"
tags: ["Cursor", "AIエディタ", "コード生成", "業務自動化", "開発効率化"]
publishedAt: 2026-02-12
updatedAt: 2026-02-12
author: "れん"
difficulty: "beginner"
timeToRead: 10
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "無料〜月20ドル"
  totalTime: "PT30M"
faq:
  - question: "CursorとVS Codeの違いは？"
    answer: "CursorはVS Codeをベースにしたエディタで、AI機能が標準搭載されています。VS Codeの拡張機能やキーバインドがそのまま使えるため、VS Codeユーザーは違和感なく移行できます。AI Chat、Composer、Tab補完などのAI機能がエディタ内で統合されている点が最大の違いです。"
  - question: "Cursorは無料で使えますか？"
    answer: "Hobbyプラン（無料）で月2,000回のAI補完と50回のチャットが利用できます。Proプラン（月20ドル）では無制限のAI補完と500回のチャットが使えます（2026年2月時点）。最新料金はCursor公式サイトをご確認ください。"
  - question: "Claude CodeとCursorどちらが良いですか？"
    answer: "Cursorはエディタ内でコードを書きながらAIに補助してもらうスタイルで、既存コードの修正やリファクタリングに強みがあります。Claude Codeはターミナルから自然言語で指示してコード全体を生成するスタイルで、ゼロからのスクリプト生成に適しています。両方を併用するのが最も効率的です。"
relatedArticles:
  - "ai-api/ai-api-overview"
  - "ai-api/claude-code-automation"
  - "reviews/ai-coding-tools-comparison"
draft: false
---

> この記事は[AI API比較・入門ガイド](/articles/ai-api/ai-api-overview)の実装編です。
> AIコーディングツールの全体比較は[AIコーディングツール比較](/articles/reviews/ai-coding-tools-comparison)をご覧ください。

この記事では、CursorエディタのAI機能を活用して業務自動化スクリプトを効率的に開発する方法を解説します。
Chat・Composer・Tab補完の使い分けと、実践的なプロンプト例を紹介します。

### この記事の前提

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Cursor（[cursor.com](https://cursor.com)で無料登録） |
| 必要な知識 | エディタの基本操作 |
| 所要時間 | 約30分 |
| 費用 | 無料〜月20ドル（Proプラン） |
| 完成物 | CursorのAI機能を活用した開発ワークフロー |

## CursorのAI機能の全体像

Cursorとは、VS Codeをベースにした、AI機能が標準搭載されたコードエディタです。

| 機能 | 操作 | 用途 |
|------|------|------|
| Tab補完 | コードを書くとAIが続きを提案 | 定型コードの高速入力 |
| Chat | Ctrl+L でAIに質問 | コードの説明・エラー解決 |
| Composer | Ctrl+I でAIにコード生成を依頼 | 新規スクリプトの生成・修正 |
| @ メンション | @file @docs でコンテキスト指定 | 既存コードやドキュメントを参照 |

### 料金プラン

| プラン | 月額 | AI補完 | チャット |
|--------|------|--------|---------|
| Hobby | 無料 | 月2,000回 | 月50回 |
| Pro | $20 | 無制限 | 月500回 |
| Business | $40 | 無制限 | 無制限 |

※2026年2月時点。最新料金は[Cursor公式](https://cursor.com/pricing)をご確認ください。

## 業務自動化での活用パターン

### パターン1: GASスクリプトの生成（Composer）

Composerを使って、GASスクリプトをゼロから生成します。

**Ctrl+I を押して以下を入力:**

```text
GASでスプレッドシートの「売上データ」シートから月別売上を集計するスクリプトを作成。
A列: 日付(yyyy/MM/dd)、B列: 商品名、C列: 金額。
結果は「月別集計」シートにA列: 年月、B列: 合計金額、C列: 件数で出力。
getValues()で一括取得、setValues()で一括書き込みすること。
```

Composerがファイル全体を生成し、差分プレビューで確認してから適用できます。

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
// スプレッドシートから売上データを取得
var sheet = // ← ここでTabを押すと補完候補が表示
```

既存のコードパターンを学習して補完するため、同じプロジェクト内の記述スタイルに合ったコードが生成されます。

## Claude Codeとの使い分け

| 用途 | Cursor | Claude Code |
|------|--------|-------------|
| ゼロからスクリプト生成 | Composer（UI内で操作） | 自然言語指示（ターミナル） |
| 既存コードの修正 | Chat + @file（得意） | ファイル操作（得意） |
| リアルタイム補完 | Tab補完（高速） | なし |
| 複数ファイルの一括変更 | Composer（対応） | 得意 |
| ターミナル操作 | 内蔵ターミナル | ネイティブ |

**おすすめの併用パターン:**

- **Cursor** — エディタ内でコードを書きながらTab補完とChatでサポート
- **Claude Code** — ゼロから新規プロジェクトを生成、ファイル構成ごと作成

詳しい比較は[AIコーディングツール比較](/articles/reviews/ai-coding-tools-comparison)をご覧ください。

## 動作確認・トラブルシューティング

| 問題 | 原因 | 解決策 |
|------|------|--------|
| AI補完が表示されない | プランの上限到達 | ProプランにアップグレードまたはHobby枠の回復を待つ |
| Composerの生成コードにエラー | コンテキスト不足 | @file で関連ファイルを追加指定 |
| 日本語プロンプトの精度が低い | モデルの言語対応 | 重要な指示は英語で補足 |
| VS Code拡張機能が動かない | 互換性の問題 | Cursor公式の互換性リストを確認 |

## 応用・カスタマイズ例

- **Rules for AI** — `.cursorrules` ファイルにプロジェクト固有のルール（GASのコーディング規約等）を記載してAI生成の品質を向上
- **ドキュメント参照** — `@docs` でGAS公式リファレンスを参照させ、API使用法の正確性を担保
- **チーム共有** — Businessプランでチーム全体のAI利用を管理

AI開発の全体像は[AI API比較・入門ガイド](/articles/ai-api/ai-api-overview)、コスト比較は[AI開発コスト削減](/articles/frameworks/ai-coding-cost-reduction)をご覧ください。
