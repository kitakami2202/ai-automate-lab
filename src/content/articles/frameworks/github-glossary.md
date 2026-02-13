---
title: "GitHub用語を日本語で理解する逆引きリファレンス"
description: "GitHubの英語UIや用語がわからない方向けの逆引きリファレンス。画面のボタン名・基本用語・頻出コマンドを日本語対訳付きで解説。Ctrl+Fで検索して使えます。pushとpullの違い、RepositoryやCommitの意味も一目でわかります。"
category: "frameworks"
tags: ["GitHub", "用語集", "初心者", "リファレンス", "英語"]
publishedAt: 2026-02-13
updatedAt: 2026-02-13
author: "れん"
difficulty: "beginner"
timeToRead: 8
layer: "execution"
articleType: "reference"
schema:
  type: "Article"
faq:
  - question: "GitHubの画面を日本語にできますか？"
    answer: "2026年2月時点で、GitHubのUI言語は英語が基本です。公式の日本語対応は限定的ですが、主要な操作は本記事の対訳表で確認すれば問題なく使えます。ブラウザの翻訳機能を併用する方法もあります。"
  - question: "GitとGitHubは何が違いますか？"
    answer: "Gitはファイルの変更履歴を管理するソフトウェアで、PCにインストールして使います。GitHubはGitの仕組みをクラウド上で利用できるWebサービスで、バックアップ・共有・自動化の機能が追加されています。"
  - question: "pushとpullの違いは何ですか？"
    answer: "pushはローカルPC上の変更をGitHubにアップロードする操作です。pullはGitHubから最新の変更をローカルPCにダウンロードする操作です。方向が逆なだけで、コードを同期するための操作である点は同じです。"
relatedArticles:
  - "frameworks/code-management-guide"
  - "frameworks/github-actions-auto-publish"
  - "ai-api/github-for-ai-coding"
draft: false
---

> この記事は[中小企業のコード管理入門](/articles/frameworks/code-management-guide)の補足リファレンスです。

GitHubの画面やチュートリアルに出てくる英語の用語・ボタン名・コマンドを日本語対訳付きでまとめています。
困ったときにブラウザの `Ctrl+F`（Mac: `Cmd+F`）で検索して逆引きとしてお使いください。
実際の操作手順は[AIコーディングで必要なGitHub操作](/articles/ai-api/github-for-ai-coding)をご覧ください。

| 前提 | 内容 |
|------|------|
| 対象読者 | GitHubの英語UIに困っている方 |
| この記事の使い方 | Ctrl+Fで知りたい用語を検索して逆引き |

## GitHub画面の英語→日本語対訳表

GitHubのWebページ上に表示されるメニュー・ボタンの日本語対訳です。

### ヘッダーメニュー

| 英語表記 | 読み方 | 日本語の意味 |
|---------|--------|------------|
| Dashboard | ダッシュボード | ホーム画面 |
| Repositories | リポジトリーズ | リポジトリ一覧 |
| Pull requests | プルリクエスト | 変更の提案一覧 |
| Issues | イシューズ | 課題・タスク一覧 |
| Notifications | ノーティフィケーションズ | 通知一覧 |
| New repository | ニューリポジトリ | 新しいリポジトリを作成 |

### リポジトリ内のタブメニュー

| 英語表記 | 読み方 | 日本語の意味 | 使う場面 |
|---------|--------|------------|---------|
| Code | コード | コード一覧（ファイルブラウザ） | ファイルを閲覧するとき |
| Issues | イシューズ | 課題・バグ報告 | タスクを管理するとき |
| Pull requests | プルリクエスト | 変更の提案（レビュー依頼） | コード変更を提案するとき |
| Actions | アクションズ | 自動処理（CI/CD） | 自動デプロイの状況を確認するとき |
| Settings | セッティングス | リポジトリの設定 | 公開/非公開の変更、権限設定 |
| Security | セキュリティ | セキュリティ設定 | 脆弱性の確認 |
| Insights | インサイツ | 統計情報 | コミット頻度の確認 |

### よく使うボタン

| 英語表記 | 日本語の意味 | 押すとどうなるか |
|---------|------------|---------------|
| Create repository | リポジトリを作成 | 新しいリポジトリが作られる |
| Fork | フォーク（複製） | 他人のリポジトリを自分のアカウントにコピー |
| Star | スター（お気に入り） | リポジトリをブックマーク |
| Clone | クローン（ダウンロード） | リポジトリをPCにコピー |
| Commit changes | 変更をコミット | ブラウザ上での編集を確定 |
| Create pull request | プルリクエストを作成 | 変更の提案を送信 |
| Merge pull request | マージ（統合） | 提案された変更を取り込む |
| Delete branch | ブランチを削除 | 不要な作業ブランチを削除 |

## 基本用語一覧

GitHubを使う上で知っておきたい基本用語を、業務自動化での使いどころと合わせて解説します。

| 英語 | 読み方 | 意味 | 業務自動化での使いどころ |
|------|--------|------|---------------------|
| Repository (repo) | リポジトリ | コードの保管場所（フォルダのようなもの） | プロジェクトごとにリポジトリを作成 |
| Clone | クローン | リポジトリをPCにダウンロードすること | 新しいPCで作業を始めるとき |
| Commit | コミット | 変更を記録すること（セーブポイント） | スクリプトを修正するたびに実行 |
| Push | プッシュ | ローカルの変更をGitHubにアップロード | コードをバックアップ・共有するとき |
| Pull | プル | GitHubの変更をローカルにダウンロード | チームメンバーの変更を取り込むとき |
| Branch | ブランチ | 作業用の分岐（本線に影響しない作業場所） | 新機能を試すとき |
| Merge | マージ | ブランチの変更を本線に統合すること | 新機能が完成したとき |
| Pull Request (PR) | プルリクエスト | 変更内容をレビューしてもらうための提案 | チーム開発で変更を提案するとき |
| Fork | フォーク | 他人のリポジトリを自分のアカウントにコピー | 公開リポジトリを改造したいとき |
| Issue | イシュー | 課題・バグ・要望の記録 | タスクやバグを記録するとき |
| README | リードミー | リポジトリの説明文書 | プロジェクトの概要を記載 |
| .gitignore | ギットイグノア | Gitで管理しないファイルのリスト | APIキー等を除外するとき |
| Diff | ディフ | ファイルの変更差分 | 何が変わったかを確認するとき |
| Conflict | コンフリクト | 同じ箇所の変更がぶつかった状態 | チーム作業で同じファイルを編集したとき |
| Release | リリース | 公開バージョン | アプリのバージョンを公開するとき |
| Actions | アクションズ | 自動処理の仕組み（CI/CD） | push時にサイトを自動更新するとき |
| Secret | シークレット | GitHub上で安全に保管する機密情報 | APIキーやサーバー情報を暗号化して保管 |

## 基本コマンドパターン

Git操作で頻出するコマンドをパターン別にまとめました。コピペしてターミナルで実行できます。VS CodeのGUI操作で完結する方は[AIコーディングで必要なGitHub操作](/articles/ai-api/github-for-ai-coding)のGUI手順を参照してください。

### 初回セットアップ

```bash
# GitHubからリポジトリをダウンロード
git clone https://github.com/ユーザー名/リポジトリ名.git

# ダウンロードしたフォルダに移動
cd リポジトリ名

# ユーザー名とメールアドレスを設定（初回のみ）
git config user.name "あなたの名前"
git config user.email "your@email.com"
```

### 日常の保存フロー

```bash
# 変更をすべてステージング（アップロード対象に選択）
git add .

# 変更を記録する（メッセージは日本語でOK）
git commit -m "日報集計の条件を修正"

# GitHubにアップロード
git push
```

### 変更の確認

```bash
# 現在の変更状況を確認
git status

# 変更内容の詳細を確認
git diff

# 変更履歴を確認
git log --oneline
```

### 修正・やり直し

```bash
# 直前のコミットメッセージを修正
git commit --amend -m "修正後のメッセージ"

# ステージングを取り消す（ファイルの変更は残る）
git restore --staged ファイル名

# ファイルの変更を元に戻す（未コミットの変更を破棄）
git restore ファイル名

# GitHubから最新を取得（他の人の変更を取り込む）
git pull
```

## 関連リソース

- 公式ドキュメント: [GitHub Docs（日本語）](https://docs.github.com/ja)
- Git入門: [Pro Git Book（日本語）](https://git-scm.com/book/ja/v2)
- コード管理入門: [中小企業のコード管理入門](/articles/frameworks/code-management-guide)
- 実践操作: [AIコーディングで必要なGitHub操作](/articles/ai-api/github-for-ai-coding)
- 自動化: [GitHub Actionsで自動公開](/articles/frameworks/github-actions-auto-publish)
