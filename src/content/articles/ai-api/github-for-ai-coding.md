---
title: "AIコーディングで必要なGitHub操作｜pushからpullまで"
description: "Claude CodeやCursorでつまずくGitHub操作を初心者向けに解説。VS Codeからのpush・pull・.gitignore設定まで約30分で習得。「pushしてください」と言われて困った方のための実践ガイドです。"
category: "ai-api"
tags: ["GitHub", "VS Code", "Claude Code", "push", "初心者"]
publishedAt: 2026-02-13
updatedAt: 2026-02-13
author: "れん"
difficulty: "beginner"
timeToRead: 12
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "0円"
  totalTime: "PT30M"
faq:
  - question: "pushとpullの違いは何ですか？"
    answer: "pushはローカルPC上のコードをGitHubにアップロードする操作です。pullはGitHubから最新のコードをローカルPCにダウンロードする操作です。push=『送る』、pull=『受け取る』と覚えてください。"
  - question: "VS Codeだけでpush・pullできますか？コマンドは不要ですか？"
    answer: "はい、VS CodeのGUI（画面操作）だけでpush・pullが完結します。サイドバーの「ソース管理」アイコンから、変更のステージング・コミット・push・pullがすべてボタン操作で可能です。"
  - question: ".gitignoreとは何ですか？なぜ必要ですか？"
    answer: ".gitignoreはGitHubにアップロードしないファイルを指定するリストです。APIキーや認証情報を含むファイル（.envなど）をうっかりアップロードしてしまうと、不正利用や高額請求のリスクがあります。.gitignoreに記載することで自動的に除外されます。"
  - question: "GitHub Copilot Freeを使うにはGitHubアカウントが必要ですか？"
    answer: "はい、GitHub Copilot FreeはGitHubアカウントに紐づくサービスです。本記事のステップ1でGitHubアカウントを作成すれば、そのままCopilot Freeも有効化できます。"
  - question: "リポジトリをPublic（公開）にしても大丈夫ですか？"
    answer: "学習用のサンプルコードならPublicでも問題ありません。ただし、業務で使うコード・APIキー・顧客データを含むものは必ずPrivate（非公開）にしてください。Freeプランでもプライベートリポジトリは無制限に作成できます。"
relatedArticles:
  - "ai-api/claude-code-automation"
  - "ai-api/api-key-management"
  - "frameworks/code-management-guide"
draft: false
---

> この記事は[中小企業のコード管理入門](/articles/frameworks/code-management-guide)の実装編です。
> 「なぜコード管理が必要か」から知りたい方は、先にそちらをご覧ください。

AIコーディングツールを使い始めると、「pushしてください」「PRを作ってください」「.gitignoreを設定してください」といったGitHub関連の操作を求められる場面が出てきます。
この記事では、VS CodeからGitHubにコードをpush・pullできる環境を約30分で構築する手順を解説します。
コマンドが苦手な方でも、VS CodeのGUI（ボタン操作）で完結できる方法を紹介します。

### この記事の前提

| 項目 | 内容 |
|------|------|
| 必要なアカウント | GitHubアカウント（[github.com](https://github.com)で無料作成） |
| 必要な知識 | VS Codeの基本操作（ファイルの開閉ができればOK） |
| 所要時間 | 約30分 |
| 完成物 | VS Code/Claude CodeからGitHubにコードをpush・pullできる状態 |

## この記事で作るもの

この記事を完了すると、以下の操作ができるようになります。

| 操作 | 内容 | 使う場面 |
|------|------|---------|
| push | ローカルのコードをGitHubにアップロード | コードを保存・共有したいとき |
| pull | GitHubから最新のコードをダウンロード | 別のPCや共同作業者の変更を取り込むとき |
| clone | GitHubのリポジトリをローカルに複製 | 新しいPCで作業を始めるとき |
| .gitignore設定 | 機密情報をGitHubから除外 | APIキーの漏洩を防ぐとき |

## AIコーディングでGitHubが必要になる場面

AIコーディングツールを使っていると、以下のような場面でGitHub操作が求められます。

| ツールが出す指示 | 意味 | この記事の該当セクション |
|---------------|------|---------------------|
| 「pushしてください」 | コードをGitHubにアップロードして | ステップ3 |
| 「PRを作ってください」 | 変更の提案をGitHub上で作成して | 応用セクション |
| 「.gitignoreを設定して」 | 機密ファイルをGitHubから除外して | ステップ4 |
| 「cloneしてください」 | リポジトリをPCにダウンロードして | ステップ2 |
| 「pullしてください」 | 最新の変更をPCに取り込んで | ステップ5 |

英語の用語に不安がある方は[GitHub用語リファレンス](/articles/frameworks/github-glossary)をブックマークしておくと安心です。

## 実装手順

### ステップ1: GitHubアカウント作成とVS Code連携

**GitHubアカウントの作成（すでにお持ちの方はスキップ）:**

1. [github.com](https://github.com)にアクセスします
2. 「Sign up」をクリックします
3. メールアドレス、パスワード、ユーザー名を入力します
4. メール認証を完了します

**VS CodeでGitHubにサインイン:**

1. VS Codeを開きます
2. 左下のアカウントアイコンをクリックします
3. 「GitHubでサインイン」を選択します
4. ブラウザが開くので、GitHubアカウントで認証します

**GitHub Copilot Freeの有効化（任意）:**

VS CodeでGitHubにサインインすると、GitHub Copilot Freeが自動的に利用可能になります。コード補完やチャット機能が無料で使えます。詳しくは[GitHub Copilot Business活用ガイド](/articles/reviews/github-copilot-business)をご覧ください。

### ステップ2: リポジトリの作成とclone

リポジトリとは、コードを保管するフォルダのようなものです。GitHub上に作成します。

**ブラウザでリポジトリを作成:**

1. GitHubにログインし、右上の「+」→「New repository」をクリックします
2. 以下のように設定します

| 設定項目 | 入力内容 | 説明 |
|---------|---------|------|
| Repository name | `my-automation` | プロジェクト名を入力 |
| Visibility | **Private** | 業務コードは非公開に |
| Add a README file | チェックを入れる | |
| Add .gitignore | Node を選択 | |

3. 「Create repository」をクリックします

**VS Codeでclone:**

1. VS Codeで `Ctrl+Shift+P`（Mac: `Cmd+Shift+P`）を押します
2. `Git: Clone` と入力して選択します
3. 「Clone from GitHub」を選択します
4. 作成したリポジトリ名を検索して選択します
5. 保存先フォルダを選択します

VS Codeが自動的にリポジトリを開きます。

### ステップ3: 編集→add→commit→pushの流れ

コードを編集してGitHubにアップロードする流れを実践します。

**VS CodeのGUI操作で行う場合:**

1. **ファイルを編集して保存**します（`Ctrl+S`）
2. 左サイドバーの**ソース管理アイコン**（分岐マーク）をクリックします
3. 変更されたファイルの横にある「**+**」ボタンをクリックします（ステージング = `git add`）
4. 上部のメッセージ欄に変更内容を入力します（例: 「CSV集計機能を追加」）
5. 「**コミット**」ボタンをクリックします（`git commit`）
6. 「**変更の同期**」ボタンをクリックします（`git push`）

**コマンドで行う場合（ターミナル操作に慣れている方）:**

```bash
# 1. ファイルを編集して保存

# 2. 変更をステージング（アップロード対象として選択）
git add .

# 3. 変更を記録（メッセージつき）
git commit -m "CSV集計機能を追加"

# 4. GitHubにアップロード
git push
```

| 操作 | GUI操作 | コマンド | 意味 |
|------|---------|---------|------|
| ステージング | 「+」ボタン | `git add .` | 変更をアップロード対象に選択 |
| コミット | 「コミット」ボタン | `git commit -m "メッセージ"` | 変更を記録する |
| プッシュ | 「変更の同期」 | `git push` | GitHubにアップロード |

### ステップ4: .gitignore設定（APIキー保護）

.gitignoreとは、GitHubにアップロードしないファイルを指定するリストです。APIキーやパスワードを含むファイルは必ずここに記載してください。

リポジトリのルートにある`.gitignore`ファイルを開き、以下を追記します。

```
# 環境変数ファイル（APIキーを記載するファイル）
.env
.env.local
.env.production

# 認証情報
credentials.json
token.json

# OS生成ファイル
.DS_Store
Thumbs.db
```

**重要:** `.gitignore`に追記する前にすでにcommitしてしまったファイルは、`.gitignore`に追加しても履歴から自動では消えません。APIキーを含むファイルを誤ってcommitした場合の対処法は[APIキー管理ガイド](/articles/ai-api/api-key-management)をご確認ください。

### ステップ5: pull操作

pullとは、GitHubにある最新のコードをローカルPCにダウンロードする操作です。

**VS CodeのGUI操作:**

1. 左サイドバーのソース管理アイコンをクリックします
2. 「...」メニュー → 「プル」をクリックします

**コマンドで行う場合:**

```bash
git pull
```

別のPCで作業した変更や、チームメンバーの変更を取り込む際に使います。

## 動作確認・トラブルシューティング

| エラーメッセージ | 日本語の意味 | 対処法 |
|----------------|------------|--------|
| `Permission denied (publickey)` | SSH認証に失敗しました | VS CodeからHTTPS接続でcloneし直す、またはGitHub認証を再設定 |
| `rejected (non-fast-forward)` | リモートに新しい変更があります | 先に `git pull` を実行してから `git push` する |
| `nothing to commit` | コミットする変更がありません | ファイルを保存したか確認する |
| `fatal: not a git repository` | Gitリポジトリではありません | cloneしたフォルダ内にいるか確認する |
| `error: failed to push` | プッシュに失敗しました | `git pull --rebase` を実行してから再度 `git push` |

## 応用

- **GitHub Copilotの活用** — GitHubアカウントがあれば、VS Code上でAIによるコード補完が無料で使えます。詳しくは[GitHub Copilot Business活用ガイド](/articles/reviews/github-copilot-business)をご覧ください
- **ブランチ運用** — 慣れてきたら、ブランチ（作業用の分岐）を使って機能ごとに開発を分ける方法を学ぶと、チーム開発がスムーズになります
- **Claude Code × GitHub** — Claude Codeで生成したスクリプトをGitHubで管理すれば、変更履歴の追跡とバックアップが自動化されます。Claude Codeの使い方は[Claude Codeで業務自動化スクリプトを作る方法](/articles/ai-api/claude-code-automation)をご覧ください

GitHub用語が英語でわからない場合は[GitHub用語リファレンス](/articles/frameworks/github-glossary)で逆引きできます。
