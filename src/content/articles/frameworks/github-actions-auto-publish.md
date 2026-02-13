---
title: "サイト更新を自動化｜GitHub Actionsで変更を即反映"
description: "コードを変更してpushするだけでサイトが自動更新される仕組みをGitHub Actionsで構築する手順を解説。当サイトの実稼働YAMLを全行コメント付きで公開。FTPでの手動アップロードから卒業し、約45分で自動公開環境を構築できます。"
category: "frameworks"
tags: ["GitHub Actions", "自動デプロイ", "CI/CD", "サイト運用", "業務自動化"]
publishedAt: 2026-02-13
updatedAt: 2026-02-13
author: "れん"
difficulty: "intermediate"
timeToRead: 15
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "0円"
  totalTime: "PT45M"
faq:
  - question: "GitHub Actionsは無料で使えますか？"
    answer: "はい、パブリックリポジトリは完全無料、プライベートリポジトリでもFreeプランで月2,000分の実行時間が無料です。個人サイトや中小企業のサイト更新であれば無料枠で十分収まります（2026年2月時点。最新は GitHub公式料金ページ をご確認ください）。"
  - question: "GitHub Actionsとは何ですか？わかりやすく教えてください"
    answer: "GitHub Actionsはコードをpushしたときなどに自動で処理を実行してくれるGitHubの機能です。たとえば『mainブランチにpushされたらサイトをビルドしてサーバーにアップロード』という処理を自動化できます。専門用語ではCI/CD（継続的インテグレーション/デリバリー）と呼ばれます。"
  - question: "YAMLファイルとは何ですか？"
    answer: "YAML（ヤムル）は設定内容を記述するためのテキスト形式です。インデント（字下げ）で構造を表現します。GitHub Actionsでは、自動処理の手順をYAMLファイルに記述します。JSONに似ていますが、人間が読みやすい形式になっています。"
  - question: "デプロイに失敗したらサイトが壊れますか？"
    answer: "いいえ。GitHub Actionsのデプロイが失敗しても、サーバー上の現在のサイトには影響しません。rsyncコマンドは転送先への書き込みが完了するまで古いファイルを保持するため、途中で失敗してもサイトは壊れません。Actions画面でエラーログを確認して修正すれば再実行できます。"
  - question: "FTPで手動アップロードしているサイトにも使えますか？"
    answer: "はい、FTPで手動アップロードしているサイトをGitHub Actionsに移行できます。rsync（SSHベースのファイル転送）を使う方法が推奨です。レンタルサーバーがSSH接続に対応していれば、本記事の手順で自動化できます。"
relatedArticles:
  - "frameworks/code-management-guide"
  - "ai-api/github-for-ai-coding"
  - "frameworks/github-glossary"
draft: false
---

> この記事は[中小企業のコード管理入門](/articles/frameworks/code-management-guide)の実装編です。
> GitHubの基本操作（push・pull）がまだの方は、先に[AIコーディングで必要なGitHub操作](/articles/ai-api/github-for-ai-coding)をご覧ください。

コードを変更してpushするだけでサイトが自動で更新される。この仕組みがあれば、毎回FTPでファイルをアップロードする手間がなくなります。
このサイト（AI Automate Lab）もまさにこの仕組みで運用しています。
この記事では、当サイトの実稼働ワークフローを全行コメント付きで公開し、約45分でサイト自動公開の環境を構築する手順を解説します。

### この記事の前提

| 項目 | 内容 |
|------|------|
| 必要なアカウント | GitHubアカウント、レンタルサーバー（SSH接続対応） |
| 必要な知識 | GitHubへのpush操作ができること（[push手順はこちら](/articles/ai-api/github-for-ai-coding)） |
| 所要時間 | 約45分 |
| 完成物 | pushしたらサイトが自動更新される仕組み |

## この記事で作るもの

この記事を完了すると、以下の自動化が実現します。

```
コードを修正 → git push → サイトが自動で更新される
（手動のFTPアップロードが不要に）
```

この「コードをpushしたら自動でサイトが更新される」仕組みを、専門用語では**デプロイの自動化**（または**CI/CD**）と呼びます。CIは「継続的インテグレーション」（コードの検証を自動化）、CDは「継続的デリバリー」（本番環境への反映を自動化）の略です。

| 手動運用 | 自動化後 |
|---------|---------|
| コードを修正する | コードを修正する |
| ビルドコマンドを実行する | `git push` する |
| FTPソフトを起動する | **（自動）** GitHub Actionsがビルド |
| サーバーにファイルをアップロードする | **（自動）** サーバーにファイルを転送 |
| アップロード漏れがないか確認する | **（自動）** 差分だけを転送するので漏れなし |

## 手動更新の何が問題か

サイトの手動更新とは、FTPソフトやファイルマネージャーを使って修正ファイルをサーバーに直接アップロードする作業のことです。

| 問題 | 具体的な状況 |
|------|------------|
| 手間がかかる | 毎回FTPソフトを起動してファイルを選択・転送する |
| アップロード漏れ | 修正したファイルの一部をアップし忘れてサイトが崩れる |
| 環境の差異 | ローカルでは動くのにサーバーでは動かない（ビルド手順の違い） |
| ロールバックできない | 問題が起きたとき「前の状態」に素早く戻せない |
| 属人化 | デプロイ手順を知っている人しかサイトを更新できない |

筆者もこのサイトの初期は手動でデプロイしていましたが、GitHub Actionsに移行してからは「pushするだけ」で更新が完了するようになりました。

## 実装手順

### ステップ1: ワークフローファイルの作成

GitHub Actionsの設定は、リポジトリ内の `.github/workflows/` フォルダにYAMLファイルを配置することで有効になります。

まずフォルダを作成します。

```bash
mkdir -p .github/workflows
```

### ステップ2: YAMLファイルの作成

以下は当サイト（AI Automate Lab）で実際に稼働しているワークフローです。全行に日本語コメントを付けて解説します。

`.github/workflows/deploy.yml` を作成し、以下の内容を記述してください。

```yaml
# ワークフローの名前（GitHub上の表示名）
name: Deploy to Server

# いつ実行するか（トリガー条件）
on:
  push:
    branches: [main]  # mainブランチにpushされたときに実行

# 同時実行の制御（同じデプロイが重複しないようにする）
concurrency:
  group: deploy       # 「deploy」グループは同時に1つだけ実行
  cancel-in-progress: true  # 新しいpushがあれば古い実行をキャンセル

# 実行するジョブ（処理のまとまり）
jobs:
  deploy:
    runs-on: ubuntu-latest  # Ubuntu（Linux）環境で実行
    timeout-minutes: 10     # 10分以内に完了しなければ失敗とする

    steps:
      # ステップ1: リポジトリのコードをダウンロード
      - uses: actions/checkout@v4

      # ステップ2: Node.js環境をセットアップ
      - uses: actions/setup-node@v4
        with:
          node-version: 20      # Node.js 20を使用
          cache: 'npm'          # npmパッケージをキャッシュして高速化

      # ステップ3: パッケージをインストール
      - name: Install dependencies
        run: npm ci  # package-lock.jsonに従って正確にインストール

      # ステップ4: サイトをビルド（HTMLファイルを生成）
      - name: Build
        run: npx astro build  # Astroの場合。お使いのフレームワークに合わせて変更

      # ステップ5: ビルド結果を検証（重要なファイルが生成されたか確認）
      - name: Verify build output
        run: |
          test -f dist/index.html || (echo "ERROR: index.html not found" && exit 1)
          echo "Build verification passed"

      # ステップ6: SSH鍵を設定（サーバーへの安全な接続準備）
      - name: Setup SSH key
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.SSH_KEY }}" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -p ${{ secrets.SSH_PORT }} ${{ secrets.SSH_HOST }} >> ~/.ssh/known_hosts 2>/dev/null

      # ステップ7: rsyncでファイルを転送（変更されたファイルだけ転送）
      - name: Deploy via rsync
        run: |
          rsync -avz --delete \
            -e "ssh -i ~/.ssh/deploy_key -p ${{ secrets.SSH_PORT }}" \
            ./dist/ ${{ secrets.SSH_USER }}@${{ secrets.SSH_HOST }}:${{ secrets.REMOTE_PATH }}

      # ステップ8: SSH鍵を削除（セキュリティ対策）
      - name: Cleanup
        if: always()  # 成功・失敗に関わらず必ず実行
        run: rm -f ~/.ssh/deploy_key
```

**このYAMLのポイント:**

| 設定 | 目的 |
|------|------|
| `concurrency` | 連続pushしても最新の1回だけデプロイされる |
| `timeout-minutes: 10` | 無限ループを防ぐ安全装置 |
| `cache: 'npm'` | パッケージのダウンロードを省略して高速化 |
| `--delete` オプション | サーバー上の不要ファイルも自動削除（常に最新状態） |
| `if: always()` | デプロイが失敗してもSSH鍵は必ず削除される |

### ステップ3: GitHub Secretsの設定

サーバーの接続情報はGitHub Secretsに保存します。Secretsとは、GitHub上で暗号化して安全に保管できる環境変数のことです。コードに直接書かないため、リポジトリが公開されても情報が漏れません。

1. GitHubのリポジトリページを開きます
2. 「Settings」→「Secrets and variables」→「Actions」を選択します
3. 「New repository secret」をクリックして、以下のSecretを1つずつ追加します

| Secret名 | 値の例 | 説明 |
|----------|-------|------|
| `SSH_KEY` | `-----BEGIN OPENSSH...` | SSH秘密鍵の全文 |
| `SSH_HOST` | `xxx.conoha.ne.jp` | サーバーのホスト名 |
| `SSH_PORT` | `8022` | SSH接続のポート番号 |
| `SSH_USER` | `username` | SSHのユーザー名 |
| `REMOTE_PATH` | `/home/user/public_html/` | アップロード先のパス |

**SSH鍵の作成方法:**

```bash
# SSH鍵を生成（まだ持っていない場合）
ssh-keygen -t ed25519 -C "deploy@github-actions"

# 公開鍵をサーバーに登録
# （レンタルサーバーの管理画面からSSH鍵を登録する方法が一般的です）
```

SSH鍵の作成と登録方法は、お使いのレンタルサーバーのマニュアルを参照してください。ConoHa WINGの場合は管理画面の「サーバー管理」→「SSH」から公開鍵を登録できます。

### ステップ4: pushして動作確認

設定が完了したら、実際にpushしてデプロイを確認します。

```bash
git add .
git commit -m "GitHub Actions自動デプロイを追加"
git push
```

**Actions画面でデプロイの状況を確認:**

1. GitHubのリポジトリページを開きます
2. 「Actions」タブをクリックします
3. 実行中のワークフローが表示されます
4. 緑色のチェックマーク（✓）が出れば成功です

各ステップをクリックすると実行ログが確認できます。エラーが出た場合は、ログを確認してトラブルシューティングの表を参照してください。

## 動作確認・トラブルシューティング

| エラー内容 | 原因 | 解決策 |
|-----------|------|--------|
| `Permission denied (publickey)` | SSH鍵が正しく設定されていない | Secretの `SSH_KEY` に秘密鍵の全文が正しくコピーされているか確認 |
| `Host key verification failed` | サーバーのホスト鍵が未登録 | `ssh-keyscan` のステップが正しく動作しているか確認 |
| `rsync: connection refused` | SSHポート番号が間違っている | レンタルサーバーのSSHポートを確認して `SSH_PORT` を修正 |
| `Build failed` | ビルドコマンドのエラー | ローカルで同じビルドコマンドを実行してエラーを確認 |
| YAMLの構文エラー | インデント（字下げ）が不正 | スペース2つでインデント。タブ文字は使えない |

英語のエラーメッセージの意味がわからない場合は[GitHub用語リファレンス](/articles/frameworks/github-glossary)をご確認ください。

## 応用・カスタマイズ例

- **定時で自動実行** — `on: schedule: - cron: '0 0 * * *'` を追加すると、毎日決まった時刻にビルド・デプロイを実行できます。データの自動更新に便利です
- **Slack通知連携** — デプロイの成功・失敗をSlackに通知する設定も追加できます。Slack通知の仕組みは[GAS × Slack通知](/articles/gas/gas-slack-notification)と同じ考え方です
- **ビルド前のテスト追加** — ビルドの前に自動テストを追加すれば、問題のあるコードがデプロイされるのを防げます

この「pushしたら自動で処理が走る」仕組みを、業界では**CI/CD**（シーアイ・シーディー）と呼びます。GitHub Actionsは中小企業でも無料で始められるCI/CDの代表的なツールです。

まずは本記事の設定をそのまま適用して、自動デプロイの便利さを体感してください。
