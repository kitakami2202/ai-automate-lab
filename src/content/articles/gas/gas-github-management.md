---
title: "GASスクリプト管理の最適解｜GitHub連携で安全にバックアップ"
description: "増えすぎたGASスクリプトをGitHubで一元管理する方法を解説。claspの導入からGitHub連携、日常の編集→commit→pushフローまで約40分で構築。変更履歴の管理とバックアップで「元に戻せない」問題を解決します。"
category: "gas"
tags: ["GAS", "GitHub", "clasp", "バックアップ", "コード管理"]
publishedAt: 2026-02-13
updatedAt: 2026-02-13
author: "れん"
difficulty: "beginner"
timeToRead: 15
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "0円"
  totalTime: "PT40M"
faq:
  - question: "claspとは何ですか？"
    answer: "claspはGoogleが提供するGASのコマンドラインツールです。GASスクリプトをローカルPC上で編集し、スクリプトエディタと同期できます。VS Codeなどの高機能エディタで編集できるようになるため、GitHubとの連携が可能になります。"
  - question: "claspを使うと既存のGASプロジェクトに影響はありますか？"
    answer: "claspはGASプロジェクトのファイルをダウンロード・アップロードするだけなので、既存の設定やトリガーには影響しません。push操作をしなければスクリプトエディタ上のコードは変わりません。"
  - question: "clasp pushとgit pushの違いは何ですか？"
    answer: "clasp pushはローカルのコードをGASスクリプトエディタに反映する操作です。git pushはローカルのコードをGitHubにアップロードする操作です。両者は別の操作で、clasp pushでGASに反映し、git pushでGitHubにバックアップするのが基本の流れです。"
  - question: "GASスクリプトのバージョン管理は内蔵機能で十分ではないですか？"
    answer: "GASの内蔵バージョン管理は手動でスナップショットを作成する仕組みで、変更差分の確認やメッセージの記録には対応していません。GitHubなら変更箇所の差分表示、変更理由の記録、任意の時点への巻き戻しがすべて自動で管理されます。"
  - question: "複数のGASプロジェクトをまとめて管理できますか？"
    answer: "はい、1つのGitHubリポジトリ内にフォルダを分けて複数のGASプロジェクトを管理できます（monorepo構成）。各フォルダに.clasp.jsonを配置し、プロジェクトごとにclasp push/pullを実行します。"
relatedArticles:
  - "gas/gas-basics"
  - "gas/gas-spreadsheet-automation"
  - "frameworks/code-management-guide"
draft: false
---

> この記事は[中小企業のコード管理入門](/articles/frameworks/code-management-guide)の実装編です。
> 「コード管理とは何か」「GitHubを導入するメリット」から知りたい方は、先にそちらをご覧ください。

GASスクリプトをGitHubで管理すれば、変更履歴の自動記録・クラウドバックアップ・チーム共有がまとめて実現できます。
この記事では、claspの導入からGitHubとの連携、日常の運用フローまでを約40分で構築する手順を解説します。
「スクリプトが増えすぎて整理できない」「変更前に戻せない」という悩みを解決します。

### この記事の前提

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Googleアカウント、GitHubアカウント（[github.com](https://github.com)で無料作成） |
| 必要な知識 | GASスクリプトエディタの基本操作（[GASでできること完全ガイド](/articles/gas/gas-basics)を読了済み推奨） |
| 所要時間 | 約40分 |
| 完成物 | GASスクリプトがGitHubで管理され、ローカル編集→pushで反映される環境 |

## この記事で作るもの

この記事の手順を完了すると、以下の環境が整います。

| 環境 | 説明 |
|------|------|
| clasp連携環境 | ローカルPCでGASスクリプトを編集し、スクリプトエディタに反映できる |
| GitHubバックアップ | スクリプトの全変更履歴がGitHubに自動保存される |
| VS Code編集 | シンタックスハイライト・補完つきの快適な編集環境 |

### 日常の運用フロー（完成イメージ）

```
VS Codeで編集 → git add → git commit → git push（GitHub保存）→ clasp push（GAS反映）
```

この一連の流れを、コマンド数行で実行できるようになります。

## GASスクリプト管理の課題

GASスクリプト管理の課題とは、スクリプトが増えるにつれて発生する「見つからない」「戻せない」「共有できない」の3つの問題です。

| 課題 | 具体的な状況 | GitHubでの解決策 |
|------|------------|----------------|
| スプレッドシートに埋もれる | どのスプレッドシートにどのスクリプトがあるかわからない | リポジトリに一覧化して管理 |
| 変更履歴が追えない | 「昨日まで動いていたのに…」の原因がわからない | コミット履歴で変更差分を確認 |
| 元に戻せない | GAS内蔵のバージョン管理では差分が見えない | 任意のコミットに巻き戻し |
| チーム共有が困難 | スクリプトをコピペでメール送信している | リポジトリを共有し、変更を自動マージ |

## 実装手順

### ステップ1: Node.jsとclaspのインストール

claspとは、GASスクリプトをローカルPCで管理するためのGoogleが提供するコマンドラインツール（CLI）です。

まずNode.jsをインストールします。すでにインストール済みの方はスキップしてください。

1. [Node.js公式サイト](https://nodejs.org/)にアクセスします
2. LTS版（推奨版）をダウンロードしてインストールします
3. ターミナルでバージョンを確認します

```bash
node --version
# v22.x.x と表示されればOK
```

次にclaspをインストールします。

```bash
npm install -g @google/clasp
```

インストール後、Googleアカウントでログインします。

```bash
clasp login
```

ブラウザが開くので、GASプロジェクトを管理しているGoogleアカウントでログインして権限を許可してください。

### ステップ2: GitHubリポジトリの作成

GitHubにスクリプトの保存先となるリポジトリを作成します。

1. [github.com](https://github.com)にログインします
2. 右上の「+」ボタン → 「New repository」をクリックします
3. 以下のように設定します

| 設定項目 | 入力内容 | 説明 |
|---------|---------|------|
| Repository name | `gas-scripts` | 任意の名前でOK |
| Description | GASスクリプト管理用 | 省略可 |
| Visibility | **Private** | 社内コードは非公開に |
| Add a README file | チェックを入れる | 最初のファイルを作成 |
| Add .gitignore | Node を選択 | 不要ファイルを除外 |

4. 「Create repository」をクリックします

作成したリポジトリをローカルにクローン（ダウンロード）します。

```bash
git clone https://github.com/あなたのユーザー名/gas-scripts.git
cd gas-scripts
```

### ステップ3: 既存GASプロジェクトのダウンロード

GASスクリプトエディタのURLからスクリプトIDを確認します。

1. GASスクリプトエディタを開きます
2. URLの `https://script.google.com/home/projects/` のあとに続く文字列がスクリプトIDです

リポジトリ内にプロジェクト用フォルダを作成し、claspでダウンロードします。

```bash
mkdir daily-report
cd daily-report
clasp clone あなたのスクリプトID
```

ダウンロードされるファイルを確認します。

```bash
ls
# .clasp.json  appsscript.json  コード.js  (その他のスクリプトファイル)
```

| ファイル | 役割 |
|---------|------|
| `.clasp.json` | スクリプトIDを記録した設定ファイル |
| `appsscript.json` | GASプロジェクトの設定（スコープ等） |
| `コード.js` | GASスクリプトの本体 |

### ステップ4: .gitignoreの設定

APIキーやアクセストークンが含まれるファイルをGitHubにアップロードしないよう、`.gitignore`に追記します。

リポジトリのルートにある`.gitignore`を開いて、以下を追加します。

```
# clasp認証情報
.clasprc.json

# 環境変数ファイル
.env
.env.local

# OS生成ファイル
.DS_Store
Thumbs.db
```

`.gitignore`（ドット始まりの設定ファイル）とは、Gitで管理しないファイルを指定するリストです。ここに記載したファイルはGitHubにアップロードされません。APIキーの安全な管理方法については[APIキー管理ガイド](/articles/ai-api/api-key-management)で詳しく解説しています。

### ステップ5: 日常の運用フロー

環境構築が完了したら、以下のフローでGASスクリプトを管理します。

**ローカルで編集してGASとGitHubの両方に反映する手順:**

```bash
# 1. VS Codeでスクリプトを編集（ファイルを保存）

# 2. 変更をGitに記録する
git add .
git commit -m "日報メール送信先を追加"

# 3. GitHubにバックアップ
git push

# 4. GASスクリプトエディタに反映
cd daily-report
clasp push
```

**GASスクリプトエディタで直接編集した場合の同期手順:**

```bash
# GASエディタの変更をローカルにダウンロード
cd daily-report
clasp pull

# 変更をGitHubにも反映
cd ..
git add .
git commit -m "GASエディタでトリガー設定を変更"
git push
```

| 操作 | コマンド | 方向 |
|------|---------|------|
| GASからダウンロード | `clasp pull` | GAS → ローカル |
| GASにアップロード | `clasp push` | ローカル → GAS |
| GitHubにバックアップ | `git push` | ローカル → GitHub |
| GitHubからダウンロード | `git pull` | GitHub → ローカル |

## 動作確認・トラブルシューティング

| エラー | 原因 | 解決策 |
|--------|------|--------|
| `clasp: command not found` | claspが未インストール | `npm install -g @google/clasp` を実行 |
| `Error: Not logged in.` | clasp認証が未完了 | `clasp login` を実行してブラウザで認証 |
| `Script API is not enabled` | GAS APIが無効 | [GAS設定画面](https://script.google.com/home/usersettings)でGoogle Apps Script APIを有効化 |
| `Permission denied` | リポジトリへのアクセス権がない | GitHubのリポジトリ設定で権限を確認 |
| `clasp push` でエラー | `.clasp.json`のスクリプトIDが不正 | `clasp clone`をやり直すか、スクリプトIDを確認 |

## 応用・カスタマイズ例

- **複数プロジェクトのmonorepo管理** — 1つのリポジトリ内にフォルダを分けて複数のGASプロジェクトを管理できます。`gas-scripts/daily-report/`、`gas-scripts/invoice/`のようにフォルダを切って、それぞれに`.clasp.json`を配置します
- **GitHub Actionsで自動デプロイ** — pushすると自動でclasp pushが実行される仕組みも構築できます。詳しくは[GitHub Actionsで自動公開](/articles/frameworks/github-actions-auto-publish)をご覧ください
- **VS CodeのGAS拡張機能** — VS Code上でGASの補完やシンタックスハイライトを有効にすると、スクリプトエディタよりも快適に編集できます

GASの基礎文法を確認したい場合は[GAS基礎文法リファレンス](/articles/gas/gas-syntax-reference)をご覧ください。
スプレッドシート自動化の実装例は[GASでスプレッドシート自動化](/articles/gas/gas-spreadsheet-automation)で詳しく解説しています。
