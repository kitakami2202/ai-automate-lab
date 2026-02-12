---
title: "GitHub Copilot Business活用ガイド"
description: "GitHub Copilot（コパイロット）を業務自動化に活用する方法を解説。Free・Pro・Businessプランの違いと料金比較、GAS・Pythonの自動補完テクニック、Copilot Chatの使い方をコード例付きで紹介。チーム開発での導入手順も解説します。"
category: "reviews"
tags: ["GitHub Copilot", "AIコーディング", "コード補完", "業務自動化", "VS Code"]
publishedAt: 2026-02-12
updatedAt: 2026-02-12
author: "れん"
difficulty: "beginner"
timeToRead: 10
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "無料〜月19ドル"
  totalTime: "PT30M"
faq:
  - question: "GitHub Copilotは無料で使えますか？"
    answer: "はい、GitHub Copilot Freeプランがあります。月2,000回のコード補完と月50回のCopilot Chat（GPT-4o / Claude Sonnet 4.5選択可）が無料で利用できます（2026年2月時点）。業務自動化スクリプトの開発であれば無料枠で十分に始められます。"
  - question: "VS Code以外のエディタでも使えますか？"
    answer: "はい、VS Code・JetBrains IDE（IntelliJ・PyCharm等）・Neovimに対応しています。最もスムーズに動作するのはVS Codeで、拡張機能をインストールするだけで利用開始できます。"
  - question: "Claude CodeやCursorとの使い分けは？"
    answer: "Copilotは「エディタ内のリアルタイム補完」に強みがあり、コードを書く最中の候補提案が高速です。Claude Codeは「自然言語からゼロからスクリプト生成」、Cursorは「AIチャット＋Composer統合」に強みがあります。Copilot Freeでリアルタイム補完し、大きな生成はClaude Codeで行う併用がコスト効率に優れています。"
  - question: "Copilot Businessプランはチーム開発でどう活用できますか？"
    answer: "Copilot Businessは組織単位でのポリシー管理が可能で、チーム全員にCopilotを一括で有効化できます。コードスニペットがGitHubのAIモデル学習に使用されない保証があり、IP保護が必要な業務コードでも安心して利用できます。また管理者が利用状況を監査ログで確認できます（2026年2月時点）。"
  - question: "Copilot Businessの使い方で最初にすべき設定は？"
    answer: "まずGitHub Organization設定からCopilotを有効化し、対象メンバーにシートを割り当てます。次にリポジトリに.github/copilot-instructions.mdを配置して、プロジェクト固有のコーディングルール（例: GASのgetValues()一括取得を優先する等）を記載すると補完精度が向上します。"
relatedArticles:
  - "reviews/ai-coding-tools-comparison"
  - "reviews/ai-dev-tools-comparison"
  - "ai-api/claude-code-automation"
draft: false
---

> AIコーディングツールの全体比較は[AIコーディングツール比較](/articles/reviews/ai-coding-tools-comparison)をご覧ください。
> AIコーディングの全体像は[AIコーディングツールで業務自動化を内製する方法](/articles/ai-api/ai-coding-overview)で解説しています。

この記事では、GitHub Copilotを業務自動化スクリプトの開発に活用する方法を解説します。
Freeプランの始め方から、GAS・Pythonの補完テクニック、Copilot Chatの活用、Copilot Businessによるチーム開発まで紹介します。

| 項目 | 内容 |
|------|------|
| 必要なアカウント | GitHub |
| 必要な知識 | VS Codeの基本操作 |
| 所要時間 | 約30分 |
| 費用 | 無料（Free）〜 月19ドル（Business） |
| 完成物 | CopilotによるAI補完付き開発環境 |

## GitHub Copilotとは

GitHub Copilotとは、GitHubが提供するAIコード補完ツールです。
エディタ内でコードを書いている最中にAIが次の行を予測・提案してくれます。

| 機能 | 内容 |
|------|------|
| コード補完 | 入力途中のコードの続きをAIが提案 |
| Copilot Chat | エディタ内でAIに質問・コード生成を依頼 |
| インラインChat | コードを選択してその場で修正指示 |
| CLI連携 | ターミナルコマンドの提案 |

### 料金プラン

| プラン | 月額 | コード補完 | Chat |
|--------|------|----------|------|
| Free | 無料 | 月2,000回 | 月50回 |
| Pro | $10 | 無制限 | 無制限 |
| Business | $19/ユーザー | 無制限 | 無制限 |

※2026年2月時点。最新料金は[GitHub Copilot公式](https://github.com/features/copilot)をご確認ください。

**Freeプランの月2,000回補完は、業務自動化スクリプトの開発であれば十分な回数です。** まずはFreeプランから始めることを推奨します。

## セットアップ手順

セットアップ手順では、GitHub CopilotをVS Codeで使い始めるまでの設定を2ステップで解説します。

### ステップ1: GitHubアカウントでCopilotを有効化

1. [github.com/settings/copilot](https://github.com/settings/copilot) にアクセスします
2. 「Enable GitHub Copilot」をクリックします
3. Freeプランを選択します

### ステップ2: VS Code拡張機能のインストール

1. VS Codeを開きます
2. 拡張機能タブ（Ctrl+Shift+X）で「GitHub Copilot」を検索します
3. インストールしてGitHubアカウントでサインインします

インストール完了後、コードを書き始めるとグレーのテキストで補完候補が表示されます。
**Tab** キーで候補を適用します。

## 業務自動化での活用テクニック

業務自動化での活用テクニックとは、GASやPythonの業務スクリプト開発でCopilotを効果的に使う方法です。
コメント駆動の関数生成、Copilot Chatによるスクリプト作成、既存コードの改善の3つに分けて紹介します。

### テクニック1: コメントから関数を生成

GASファイルでコメントを書くと、Copilotが関数全体を提案します。

```javascript
// スプレッドシートの「売上データ」シートから今月の売上合計を計算する
// A列: 日付, B列: 商品名, C列: 金額
function calculateMonthlySales() {
  // ← ここでTabを押すとCopilotが関数の中身を補完
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("売上データ");
  var data = sheet.getDataRange().getValues();
  var today = new Date();
  var currentMonth = today.getMonth();
  var total = 0;

  for (var i = 1; i < data.length; i++) {
    var rowDate = new Date(data[i][0]);
    if (rowDate.getMonth() === currentMonth) {
      total += Number(data[i][2]) || 0;
    }
  }
  return total;
}
```

**ポイント:** コメントに「入力データの形式（列構成）」と「やりたいこと」を具体的に書くと、補完精度が向上します。

### テクニック2: Copilot Chatでスクリプト生成

Ctrl+L（Mac: Cmd+L）でCopilot Chatを開き、自然言語で指示します。

```text
GASで以下のスクリプトを作成してください:
- スプレッドシートの「顧客リスト」シートからメールアドレスを取得
- A列: 名前、B列: メールアドレス、C列: 送信済フラグ
- C列が空の行だけを対象にメールを送信
- 件名と本文はテンプレートから挿入
- 送信後にC列に「済」と記入
```

Copilot Chatが生成したコードは、エディタに直接挿入できます。

### テクニック3: 既存コードの改善

コードを選択してインラインChat（Ctrl+I）で改善を依頼します。

```text
このGASスクリプトでgetValue()をループ内で呼んでいる箇所を
getValues()の一括取得に変更してパフォーマンスを改善してください。
```

### Claude Codeとの使い分け

| 用途 | GitHub Copilot | Claude Code |
|------|---------------|-------------|
| リアルタイム補完 | Tab補完が高速（得意） | なし |
| ゼロからスクリプト生成 | Chat対応 | 自然言語指示（得意） |
| ファイル操作 | エディタ内 | ローカルファイル直接操作（得意） |
| 複数ファイル一括変更 | 対応 | 得意 |
| 費用 | 無料〜$19 | 従量課金（月数百円〜） |

**併用パターン（根拠: Copilot Freeは月2,000回の補完が無料、Claude Codeは従量課金のため大きな生成に集中利用するとコスト効率が良い）:**

- **Copilot Free** — エディタ内でコードを書く際のリアルタイム補完
- **Claude Code** — ゼロからスクリプト全体を生成する場合

Copilotのチーム活用を含む詳しい比較は[AIコーディングツール比較](/articles/reviews/ai-coding-tools-comparison)をご覧ください。

## 動作確認・トラブルシューティング

動作確認・トラブルシューティングでは、Copilot導入後によくある問題と解決策をまとめます。

| 問題 | 原因 | 解決策 |
|------|------|--------|
| 補完が表示されない | 拡張機能が無効 | VS Codeの右下でCopilotアイコンが有効か確認 |
| 補完の精度が低い | コンテキスト不足 | ファイル冒頭にコメントで用途・データ構造を記述 |
| Chat回数の上限に達した | Freeプランの月50回制限 | 翌月まで待つかProプランに変更 |
| GAS固有のAPIが補完されない | モデルの学習データの限界 | GAS公式ドキュメントのURLをChatに貼って補足 |

## 応用・カスタマイズ例

応用・カスタマイズ例として、Copilot Businessによるチーム活用やプロジェクト固有ルールの設定方法を紹介します。

### Businessプランの主なメリット

Copilot Businessプランは、個人向けプランにはない組織向け機能を備えています。チーム開発でCopilot Businessの導入を検討している方は、以下の機能を確認してください。

| 機能 | 内容 |
|------|------|
| IP補償 | Copilotが生成したコードに対する知的財産権の補償をGitHubが提供 |
| AIモデル学習への不使用保証 | 組織のコードスニペットがGitHubのAIモデル学習に使用されないことを保証 |
| 組織ポリシー設定 | 管理者がCopilotの利用範囲・機能を組織全体で一括管理 |
| コンテンツ除外設定 | 特定のファイルやリポジトリをCopilotの参照対象から除外 |
| 監査ログ | メンバーごとのCopilot利用状況を管理画面から確認 |

※2026年2月時点。最新の機能は[GitHub Copilot Businessプラン公式](https://github.com/features/copilot/plans)をご確認ください。

### copilot-instructions.mdでプロジェクト固有ルールを設定

リポジトリに `.github/copilot-instructions.md` を配置すると、Copilotがプロジェクト固有のコーディングルールを補完に反映します。
以下はGAS開発プロジェクト向けの設定例です。

```markdown
# Copilot Instructions

## コーディング規約
- Google Apps Script（GAS）で開発する
- `getValue()` / `setValue()` のループ利用は禁止。`getValues()` / `setValues()` で一括取得・書き込みすること
- 変数名は日本語コメントで用途を明記する
- エラーハンドリングは try-catch で囲み、ログを Logger.log() に出力する

## プロジェクト情報
- スプレッドシートは「売上管理」「顧客リスト」「在庫管理」の3シート構成
- A列は常にID、B列以降にデータを格納する
- 日付フォーマットは yyyy-MM-dd を使用する
```

この設定ファイルを配置するだけで、チームメンバー全員のCopilot補完がプロジェクトのルールに沿った提案に変わります。

### Claude Codeとの併用

[Claude Code](/articles/ai-api/claude-code-automation)でプロジェクト全体のスクリプトを生成し、Copilotで日常の細部を仕上げる併用が効果的です。
Claude Codeが生成したコードをCopilotが学習コンテキストとして参照するため、プロジェクト固有の関数名や変数名を補完候補に反映してくれます。

AIコーディングの全体像は[AIコーディングツールで業務自動化を内製する方法](/articles/ai-api/ai-coding-overview)をご覧ください。
コスト比較は[AI開発コスト削減](/articles/frameworks/ai-coding-cost-reduction)で解説しています。
