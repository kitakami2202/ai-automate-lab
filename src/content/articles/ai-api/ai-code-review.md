---
title: "AIコードレビューで品質と速度を両立する方法"
description: "AIを活用したコードレビュー手法を中小企業の業務自動化の観点で解説。Claude Code・GitHub Copilot・Cursorでのレビュー手順と、GASスクリプトのバグ・セキュリティ・パフォーマンスを自動チェックするプロンプトテンプレート付きで紹介します。"
category: "ai-api"
tags: ["AIコードレビュー", "コード品質", "業務自動化", "Claude Code", "セキュリティ"]
publishedAt: 2026-02-12
updatedAt: 2026-02-12
author: "れん"
difficulty: "beginner"
timeToRead: 10
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "月0〜2,000円（2026年2月時点）"
  totalTime: "PT20M"
faq:
  - question: "AIのコードレビューは人間のレビューの代わりになりますか？"
    answer: "定型的なチェック（バグ、セキュリティ、パフォーマンス）はAIが得意ですが、ビジネスロジックの妥当性やUXの判断は人間が行うべきです。AIレビューで基本的な問題を事前に検出し、人間のレビュー時間を重要な判断に集中させる併用が効果的です。"
  - question: "GASスクリプトもAIでレビューできますか？"
    answer: "はい、GASスクリプトのレビューは特に効果的です。getValue()のループ内呼び出し、API呼び出し回数の最適化、エラーハンドリングの漏れなどをAIが検出してくれます。本記事で紹介するレビュープロンプトをそのまま使えます。"
  - question: "AIコードレビューの費用はいくらですか？"
    answer: "Claude Codeの場合、1回のレビューで数円〜数十円の従量課金です。GitHub Copilot Freeの月50回Chatを使えば無料でもレビューできます。月に数十回のレビューであれば月1,000円以下に収まります（いずれも2026年2月時点）。"
  - question: "AIコードレビューはどのプログラミング言語に対応していますか？"
    answer: "Claude Code・GitHub Copilot・CursorいずれもPython、JavaScript、TypeScript、GAS、Go、Java、Ruby、PHPなど主要な言語に対応しています。本記事ではGASとPythonを例に解説していますが、同じプロンプトを他言語のコードにも応用できます。"
  - question: "無料で使えるAIコードレビューツールはありますか？"
    answer: "GitHub Copilot Freeプラン（2026年2月時点）では月50回のChat利用が可能で、コードレビューにも使えます。また、CursorにもFreeプランがあります。完全無料で始めたい場合はGitHub Copilot Freeがおすすめです。"
relatedArticles:
  - "ai-api/ai-coding-overview"
  - "ai-api/claude-code-automation"
  - "frameworks/ai-coding-cost-reduction"
draft: false
---

> AIコーディングの全体像は[AIコーディングツールで業務自動化を内製する方法](/articles/ai-api/ai-coding-overview)をご覧ください。

この記事では、AIを活用してコードレビューの品質と速度を両立する方法を解説します。
業務自動化スクリプト（GAS・Python）のレビューに特化したプロンプトと、ツール別の手順を紹介します。

### この記事の前提

| 項目 | 内容 |
|------|------|
| 対象 | AIで生成した業務自動化スクリプトの品質を確認したい人 |
| 必要な知識 | [Claude Code](/articles/ai-api/claude-code-automation)または[Cursor](/articles/ai-api/cursor-business)の基本操作 |
| 所要時間 | 約20分 |
| 費用 | 月0〜2,000円（2026年2月時点。最新料金は[Claude Code公式](https://www.anthropic.com/pricing)・[GitHub Copilot公式](https://github.com/features/copilot)をご確認ください） |
| 完成物 | AIコードレビューのワークフロー |

## AIコードレビューとは

AIコードレビューとは、AIがソースコードを分析してバグ・セキュリティリスク・パフォーマンス問題を自動で検出する仕組みです。
少人数の中小企業でも、AIを活用すれば品質の高いスクリプトを維持できます。

| 項目 | 人間レビュー | AIレビュー |
|------|------------|-----------|
| 速度 | 30分〜数時間 | 数秒〜1分 |
| 得意分野 | ビジネスロジック・設計判断 | 定型チェック・パターン検出 |
| 見落とし | 疲労で増加 | 一定の品質を維持 |
| 費用 | 人件費 | 数円〜数十円/回 |

**効果的な使い方:** AIで定型的なチェックを自動化し、人間は設計やビジネスロジックの判断に集中します。
AIがコード品質を底上げすることで、レビュー全体の効率が向上します。

### レビューの観点

業務自動化スクリプト（GAS・Python）で確認すべき5つの観点です。

| 観点 | チェック内容 | よくある問題例 |
|------|------------|--------------|
| バグ | ロジックエラー・型不一致 | 日付比較でタイムゾーン未考慮 |
| パフォーマンス | API呼び出し回数・ループ最適化 | getValue()をループ内で呼び出し |
| セキュリティ | APIキー露出・入力値検証 | スクリプト内にAPIキーをハードコード |
| エラー処理 | try-catch（エラーを検知して処理を分岐する構文）・リトライ | API呼び出しのエラー処理なし |
| 保守性 | 命名・構造・コメント | マジックナンバー（意味が不明な固定値。例: `if (status === 5)` の `5`）の使用 |

## ツール別レビュー手順

### Claude Codeでのレビュー

ターミナルからClaude Codeを起動して、ファイルを指定してレビューを依頼します。

```text
以下のGASスクリプトをレビューしてください。

確認観点:
1. バグ（ロジックエラー、型不一致、境界値）
2. パフォーマンス（API呼び出し回数、ループ内処理）
3. セキュリティ（APIキー、入力値）
4. エラー処理（try-catch、リトライ）
5. GAS固有の制限（実行時間6分制限、トリガー制限）

各問題には「重要度（高/中/低）」と「修正コード例」を付けてください。
```

Claude Codeはファイルの中身を自動で読み取り、問題箇所と修正案を提示します。

### GitHub Copilot Chatでのレビュー

VS CodeでCopilot Chat（Ctrl+Alt+I）を開きます。

```text
@workspace このファイルのコードをレビューしてください。
バグ、パフォーマンス、セキュリティの問題を重要度付きでリストアップしてください。
```

`@workspace`を付けると、プロジェクト全体のコンテキストを考慮したレビューが行われます。
`@workspace`はプロジェクト内のファイルをまとめて参照するCopilotのコマンドです。

### Cursorでのレビュー

コードを選択してChat（Ctrl+L）に送信します。

```text
選択したコードをレビューしてください。
GASのベストプラクティスに反している箇所と修正方法を教えてください。
```

### GASスクリプト向けレビュープロンプト

GASスクリプトに特化したレビュープロンプトのテンプレートです。そのままコピーして使えます。

```text
以下のGoogle Apps Scriptをレビューし、問題点を重要度順にリストアップしてください。

【チェック項目】
□ getValue()/setValue()がループ内にないか（getValues()/setValues()に変更）
□ 6分実行制限に対する対策があるか
□ API呼び出しにtry-catchがあるか
□ APIキーがPropertiesService（GASの設定値を安全に保存するサービス）で管理されているか
□ スプレッドシートのシート名がハードコードでないか
□ 日付処理にタイムゾーン指定があるか
□ Utilities.sleep()（処理を一定時間停止するGAS関数）で適切な待機を入れているか

【出力形式】
| # | 重要度 | 行番号 | 問題 | 修正案 |
```

### レビュー前後のGASコード例（Before / After）

AIレビューでどのように問題が検出・修正されるかを、実行可能なGASコードで示します。

**Before（問題のあるコード）:**

```javascript
function sendReportEmails() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("顧客リスト");
  var lastRow = sheet.getLastRow();
  var API_KEY = "sk-abc123xyz"; // NG: APIキーがハードコードされている

  for (var i = 2; i <= lastRow; i++) {
    var name = sheet.getRange(i, 1).getValue();   // ループ内でgetValue()
    var email = sheet.getRange(i, 2).getValue();   // 毎回スプレッドシートにアクセス
    var status = sheet.getRange(i, 3).getValue();

    if (status == 5) { // マジックナンバー: 5が何を意味するか不明
      UrlFetchApp.fetch("https://api.example.com/send", {
        method: "post",
        headers: { "Authorization": "Bearer " + API_KEY },
        payload: JSON.stringify({ to: email, name: name })
      });
      // エラー処理がない・待機もない
    }
  }
}
```

**After（AIレビュー後の修正コード）:**

```javascript
var STATUS_SENT = 5; // ステータス「送信済み」を定数で定義

function sendReportEmails() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("顧客リスト");
  var lastRow = sheet.getLastRow();
  var data = sheet.getRange(2, 1, lastRow - 1, 3).getValues(); // 一括取得に変更

  // PropertiesServiceでAPIキーを安全に取得
  var apiKey = PropertiesService.getScriptProperties().getProperty("API_KEY");

  for (var i = 0; i < data.length; i++) {
    var name = data[i][0];
    var email = data[i][1];
    var status = data[i][2];

    if (status == STATUS_SENT) { // 定数を使用して意味を明確化
      try {
        UrlFetchApp.fetch("https://api.example.com/send", {
          method: "post",
          headers: { "Authorization": "Bearer " + apiKey },
          payload: JSON.stringify({ to: email, name: name })
        });
        Utilities.sleep(1000); // API連続呼び出しのレート制限対策
      } catch (e) {
        Logger.log("送信エラー（行" + (i + 2) + "）: " + e.message);
      }
    }
  }
}
```

**改善ポイントまとめ:**

| # | 重要度 | 問題 | 修正内容 |
|---|--------|------|----------|
| 1 | 高 | ループ内でgetValue()を呼び出し | getValues()で一括取得に変更 |
| 2 | 高 | APIキーがスクリプト内にハードコード | PropertiesService.getScriptProperties()に移行 |
| 3 | 中 | API呼び出しにtry-catchなし | try-catchとログ出力を追加 |
| 4 | 中 | API連続呼び出しに待機なし | Utilities.sleep(1000)を追加 |
| 5 | 低 | マジックナンバー「5」 | 定数 `STATUS_SENT` に定義して意味を明記 |

### レビューの自動化

定期的に実行するスクリプトには、レビューワークフローを組み込むと品質を維持できます。

```text
開発 → AIレビュー → 修正 → テスト → 本番運用
  │                              │
  └── AIが問題を検出 ──────────── 修正後に再レビュー
```

### Claude Codeでの一括レビュー

プロジェクト内の複数ファイルをまとめてレビューする場合のプロンプト例です。

```text
このプロジェクトの全GASファイル(.gs)をレビューしてください。
ファイルごとに重要度「高」の問題のみリストアップしてください。
```

## 動作確認・トラブルシューティング

AIコードレビューで期待した結果が得られない場合の対処方法をまとめます。
プロンプトの調整やツールの設定変更で解決できるケースがほとんどです。

| 問題 | 原因 | 解決策 |
|------|------|--------|
| AIが問題を見逃す | コンテキスト不足 | チェック観点をプロンプトに明示 |
| 過剰な指摘が多い | レビュー範囲が広すぎる | 重要度「高」のみに絞るよう指示 |
| GAS固有の問題を検出しない | モデルの知識限界 | GASのベストプラクティスをプロンプトに含める |
| レビュー結果が長すぎる | 出力形式が未指定 | 表形式・箇条書きで出力を指定 |

## 応用・カスタマイズ例

ここでは、本記事のレビュー手法を開発ワークフローに組み込み、チーム全体でコード品質を継続的に高める方法を紹介します。

### GitHub Actionsでのレビュー自動化

プルリクエスト（PR）作成時にAIレビューを自動実行する仕組みを構築できます。
手順の概要は以下のとおりです。

1. GitHubリポジトリに `.github/workflows/ai-review.yml` を作成します
2. PRの `opened` / `synchronize` イベントをトリガーに設定します
3. ワークフロー内でClaude Code CLIを呼び出し、変更差分をレビューします
4. レビュー結果をPRコメントとして自動投稿します

コードをプッシュするだけでAIレビューが走るため、チェック漏れを防げます。

### セキュリティ特化レビュープロンプト

[APIキー管理](/articles/ai-api/api-key-management)の観点を強化したセキュリティ特化プロンプトの例です。

```text
以下のコードをセキュリティ観点でレビューしてください。

【重点チェック項目】
□ APIキー・トークンがソースコードに含まれていないか
□ 外部入力値のバリデーション（サニタイズ）が行われているか
□ HTTPリクエストのタイムアウト設定があるか
□ ログ出力に機密情報が含まれていないか
□ 権限の最小化（必要最小限のスコープ）が守られているか

問題が見つかった場合は、修正コード例を付けてください。
```

- **チーム標準化** — レビュープロンプトをチームで共有し、コード品質の基準を統一

AIコーディングの全体像は[AIコーディングツールで業務自動化を内製する方法](/articles/ai-api/ai-coding-overview)をご覧ください。
プロンプトの書き方は[プロンプトパターン集](/articles/ai-api/ai-coding-prompt-patterns)で詳しく解説しています。
