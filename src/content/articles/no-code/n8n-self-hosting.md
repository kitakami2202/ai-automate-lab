---
title: "n8nセルフホスティング完全ガイド - Docker Composeで構築"
description: "n8nをDocker Composeでセルフホスティングする構築手順を解説。PostgreSQL・Caddy（HTTPS）対応の本番構成をコピペで構築できます。Zapier・Makeとのコスト比較表やVPS選定ガイドも掲載。中小企業のサーバー代を月額500円〜に抑えて自動化基盤を整えましょう。"
category: "no-code"
tags: ["n8n", "セルフホスティング", "Docker Compose", "自動化", "ノーコード"]
publishedAt: 2025-03-15
updatedAt: 2026-02-12
author: "れん"
difficulty: "intermediate"
timeToRead: 20
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "月額500〜1,500円（VPS）"
  totalTime: "PT60M"
faq:
  - question: "n8nのセルフホスティングにはどのくらいのサーバースペックが必要ですか？"
    answer: "最低CPU 1コア・RAM 1GBで動作しますが、PostgreSQLを併用する本番構成ではRAM 2GB以上を推奨します。ワークフローが50個を超える規模になったらCPU 2コア・RAM 4GBへのスケールアップを検討してください。VPS月額500〜1,500円帯のプランで十分対応できます。"
  - question: "n8nの旧BASIC_AUTH認証はまだ使えますか？"
    answer: "n8n v1.0以降、N8N_BASIC_AUTH_ACTIVE・N8N_BASIC_AUTH_USER・N8N_BASIC_AUTH_PASSWORDの環境変数は廃止されました。現在はビルトインユーザー管理に移行しており、初回アクセス時にオーナーアカウントを作成する方式です。旧環境変数を設定しても無視されるため、本記事の手順に従って移行してください。"
  - question: "n8nセルフホストとZapier/Makeのコスト差はどのくらいですか？"
    answer: "2026年2月時点で、Zapier Professionalは月額$29.99（750タスク）、Make Coreは月額$10.59（10,000オペレーション）です。n8nセルフホストはVPS月額500〜1,500円で実行回数が無制限になります。年間で数万円〜十数万円の差額が生まれるため、ワークフローを頻繁に実行する中小企業ほどコスト削減効果が大きくなります。"
  - question: "n8nのデータバックアップはどうすればいいですか？"
    answer: "PostgreSQLの定期ダンプ（pg_dump）とN8N_ENCRYPTION_KEYの安全な保管が必須です。ENCRYPTION_KEYを紛失すると、保存済みのAPI認証情報が復号できなくなります。キーは.envファイルとは別に、パスワードマネージャーや暗号化されたクラウドストレージに保管することを強く推奨します。"
  - question: "ローカルPCでもn8nをセルフホストできますか？"
    answer: "Docker環境があればWindows・Mac・Linuxいずれのローカル環境でも構築可能です。ただし、Webhookトリガーなど常時稼働が必要なワークフローにはVPSを推奨します。ローカル環境はワークフローの開発・検証用途に適しています。"
relatedArticles:
  - "no-code/no-code-overview"
  - "no-code/zapier-vs-make"
  - "reviews/automation-tools-matrix"
draft: false
---

この記事では、Docker Composeでn8nをセルフホスティングする環境を約30分で構築します。
Docker環境があれば、コピペだけで動く設定ファイルを全文掲載しています。
この記事は[ノーコード自動化ツール比較](/articles/no-code/no-code-overview)の実装編です。ツール選定の基準は[Zapier vs Make 徹底比較](/articles/no-code/zapier-vs-make)をご覧ください。

### この記事の前提

| 項目 | 内容 |
|------|------|
| 必要な環境 | Docker Engine 20.10+ / Docker Compose v2 |
| 必要な知識 | ターミナル操作の基礎 |
| 所要時間 | 約30分（ローカル）/ 約60分（VPS + HTTPS） |
| 完成物 | HTTPS対応のn8nセルフホスト環境 |
| 想定コスト | VPS月額500〜1,500円（ローカルなら0円） |

## この記事で作るもの

セルフホスティング（自己ホスティング）とは、クラウドサービスに頼らず自分で管理するサーバー上にソフトウェアを構築・運用することです。

本記事では、Docker Compose（複数のコンテナをまとめて管理するツール）を使い、以下の3コンテナ構成を作ります。

```
[ブラウザ] → [Caddy (HTTPS/リバースプロキシ)] → [n8n (自動化エンジン)] → [PostgreSQL (データベース)]
```

**このコードのポイント:**
- Caddy（外部からのアクセスを内部サービスに中継するリバースプロキシ兼Webサーバー）がHTTPSを処理します。HTTPS証明書の取得・更新も自動でおこないます
- n8nがワークフローの実行を担当します
- PostgreSQL（高信頼性のリレーショナルデータベース）がデータを永続化します

### なぜセルフホストなのか

中小企業がn8nをセルフホストする最大の理由はコスト削減とデータの自社管理です。以下の比較表をご覧ください。

| サービス | 月額料金（2026年2月時点） | 実行回数制限 | データ管理 |
|---------|------------------------|------------|-----------|
| [Zapier Professional](https://zapier.com/pricing) | $29.99〜（約4,500円〜） | 750タスク/月 | Zapierのクラウド |
| [Make Core](https://www.make.com/en/pricing) | $10.59〜（約1,600円〜） | 10,000オペレーション/月 | Makeのクラウド |
| [n8n Cloud Starter](https://n8n.io/pricing/) | EUR 24〜（約3,900円〜） | 2,500実行/月 | n8nのクラウド |
| **n8n セルフホスト** | **VPS 500〜1,500円** | **無制限** | **自社サーバー** |

Zapierで月3,000円かかっていた業務自動化が、VPS月額500〜1,500円で実行回数無制限になります。年間で約1.8万〜3万円のコスト削減が見込めます。料金は2026年2月時点の情報です。

各ツールの特徴をさらに詳しく比較したい方は、[自動化ツール比較表](/articles/reviews/automation-tools-matrix)もあわせてご確認ください。また、[どこから自動化すべきか](/articles/frameworks/where-to-automate-first)を先に整理しておくと、n8n導入後の活用がスムーズです。

n8n v1.0以降、認証方式はビルトインユーザー管理に移行しています。旧方式のBASIC_AUTH環境変数は廃止されており、初回アクセス時にオーナーアカウントを作成する仕組みです。本記事ではこの最新の認証方式で構築を進めます。

## 準備・環境構築

環境構築とは、n8nを動かすために必要なサーバー・ソフトウェア・設定ファイルを整えるプロセスです。n8nの構築にはDocker環境とVPS（またはローカルPC）が必要です。

### VPSの選定

常時稼働のワークフローを運用するにはVPS（仮想専用サーバー）が必要です。中小企業向けに月額500〜1,500円帯の国内VPSを比較しました。

| VPS | 月額（2026年2月時点） | CPU | RAM | ストレージ |
|-----|---------------------|-----|-----|-----------|
| [ConoHa VPS](https://vps.conoha.jp/pricing/) | 751円〜 | 1コア | 1GB | 100GB SSD |
| [Xserver VPS](https://vps.xserver.ne.jp/) | 830円〜 | 3コア | 2GB | 50GB NVMe |
| [さくらVPS](https://vps.sakura.ad.jp/) | 590円〜 | 2コア | 512MB | 25GB SSD |

n8n + PostgreSQL構成では**RAM 2GB以上**のプランを推奨します。料金は2026年2月時点の情報です。

### Docker環境の確認

VPSまたはローカルPCにDockerがインストール済みか確認します。

```bash
docker --version
# Docker version 20.10以上であること

docker compose version
# Docker Compose version v2.x.x であること
```

**このコードのポイント:**
- `docker compose`（ハイフンなし）がDocker Compose v2のコマンドです
- 旧形式の`docker-compose`（ハイフンあり）は非推奨です

### プロジェクトディレクトリの作成

```bash
mkdir -p ~/n8n-selfhost && cd ~/n8n-selfhost
```

このディレクトリに設定ファイルをまとめて配置します。

## 実装手順

実装手順では、Docker Composeの設定ファイル作成・環境変数の設定・コンテナ起動・初期セットアップの4ステップでn8n環境を構築します。

### ステップ1: docker-compose.ymlを作成する

以下のファイルを`~/n8n-selfhost/docker-compose.yml`として保存してください。

```yaml
services:
  n8n:
    image: n8nio/n8n:latest
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=${POSTGRES_DB}
      - DB_POSTGRESDB_USER=${POSTGRES_USER}
      - DB_POSTGRESDB_PASSWORD=${POSTGRES_PASSWORD}
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
      - N8N_HOST=${N8N_HOST}
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://${N8N_HOST}/
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      postgres:
        condition: service_healthy

  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5

  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    environment:
      - N8N_HOST=${N8N_HOST}
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config

volumes:
  n8n_data:
  postgres_data:
  caddy_data:
  caddy_config:
```

**このコードのポイント:**
- Docker Compose v2形式のため`version:`フィールドは記載しません
- n8nはPostgreSQLの起動完了を`healthcheck`で待ってから起動します
- すべてのパスワード・キーは環境変数（`${...}`）で参照し、ハードコードしません
- `WEBHOOK_URL`を設定することで、外部サービスからのWebhookを正しく受信できます
- 本番環境では`n8nio/n8n:1.76.1`のようにバージョンを固定すると、予期しない破壊的変更を防げます。最新バージョンは[Docker Hubのn8nページ](https://hub.docker.com/r/n8nio/n8n/tags)で確認してください
- caddyサービスの`environment`で`N8N_HOST`をコンテナに渡しています。Caddyfileの`{$N8N_HOST}`はコンテナ内の環境変数を参照するため、この設定が必要です

続いて、Caddyfile（リバースプロキシの設定ファイル）を`~/n8n-selfhost/Caddyfile`として作成します。

```text
{$N8N_HOST} {
    reverse_proxy n8n:5678
}
```

**このコードのポイント:**
- Caddyは指定ドメインのHTTPS証明書を自動で取得・更新します
- `reverse_proxy`で、外部からのHTTPSリクエストをn8nコンテナに転送します
- ローカル環境の場合は`:80`に変更し、`http://localhost`でアクセスできます

### ステップ2: .envファイルを設定する

環境変数を管理する`.env`ファイルを`~/n8n-selfhost/.env`として作成します。

```bash
# n8nの暗号化キー（必ず生成して設定）
N8N_ENCRYPTION_KEY=ここに生成した値を貼り付け

# n8nのホスト名（自分のドメインに変更）
N8N_HOST=n8n.example.com

# PostgreSQL設定
POSTGRES_DB=n8n
POSTGRES_USER=n8n
POSTGRES_PASSWORD=ここに強力なパスワードを設定
```

**このコードのポイント:**
- `.env`ファイルは必ず`.gitignore`に追加してください
- `N8N_ENCRYPTION_KEY`はAPI認証情報の暗号化に使われる最重要項目です

N8N_ENCRYPTION_KEYは以下のコマンドで生成します。

```bash
openssl rand -hex 32
```

POSTGRES_PASSWORDも同様に生成できます。

```bash
openssl rand -hex 16
```

各環境変数の役割を以下の表にまとめます。

| 環境変数 | 役割 | 設定例 |
|---------|------|-------|
| `N8N_ENCRYPTION_KEY` | 認証情報の暗号化キー。紛失するとクレデンシャルが復号不可 | `openssl rand -hex 32`で生成 |
| `N8N_HOST` | n8nにアクセスするドメイン名 | `n8n.example.com` |
| `POSTGRES_DB` | PostgreSQLのデータベース名 | `n8n` |
| `POSTGRES_USER` | PostgreSQLのユーザー名 | `n8n` |
| `POSTGRES_PASSWORD` | PostgreSQLのパスワード | `openssl rand -hex 16`で生成 |

**重要:** `N8N_ENCRYPTION_KEY`を紛失すると、n8nに保存したすべてのAPI認証情報（OAuthトークン、APIキーなど）が復号できなくなります。`.env`ファイルとは別に、パスワードマネージャーなど安全な場所にバックアップしてください。

### ステップ3: コンテナを起動する

すべての設定ファイルが揃ったら、コンテナを起動します。

```bash
docker compose up -d
```

**このコードのポイント:**
- `-d`オプションでバックグラウンド起動します
- 初回はDockerイメージのダウンロードに数分かかります

起動状態を確認します。

```bash
docker compose ps
```

3つのコンテナすべてが`running`と表示されれば成功です。問題がある場合はログを確認します。

```bash
docker compose logs -f
```

### ステップ4: 初期セットアップ（オーナーアカウント作成）

ブラウザで`https://n8n.example.com`（ローカルの場合は`http://localhost:5678`）にアクセスします。

初回アクセス時に、ビルトインユーザー管理のセットアップ画面が表示されます。以下の情報を入力してオーナーアカウントを作成してください。

1. **メールアドレス**: 管理者のメールアドレスを入力
2. **名前**: 表示名を入力
3. **パスワード**: 8文字以上の強力なパスワードを設定

**このステップのポイント:**
- n8n v1.0以降、旧方式の`N8N_BASIC_AUTH_ACTIVE`や`N8N_BASIC_AUTH_USER`などの環境変数は廃止されています
- オーナーアカウントはn8nの管理者権限を持ち、他のユーザーを招待できます
- パスワードはn8n内部で安全にハッシュ化されて保存されます

## 動作確認・トラブルシューティング

動作確認とは、構築した環境が正しく機能しているかを検証するプロセスです。

### 動作確認チェックリスト

以下の項目をすべて確認してください。

- `https://n8n.example.com`にHTTPSでアクセスできるか
- ログイン画面が表示され、オーナーアカウントでログインできるか
- ワークフローエディタが開き、新規ワークフローを作成できるか
- テスト実行（Manual Triggerノード → Set Dataノード）が成功するか

### よくあるエラーと解決策

| エラー | 原因 | 解決策 |
|--------|------|--------|
| `port 5678 already in use` | 他のプロセスがポートを使用中 | `lsof -i :5678`で確認し、該当プロセスを停止またはポートを変更 |
| `ECONNREFUSED`（PostgreSQL接続失敗） | DBコンテナが未起動または接続情報の不一致 | `docker compose logs postgres`で確認し、`.env`の設定を見直す |
| HTTPS証明書エラー | DNSが未反映またはCaddyfileのドメイン名ミス | DNS伝播を待つ（最大48時間）、Caddyfileのドメイン名を確認 |
| `No encryption key found` | N8N_ENCRYPTION_KEYが未設定 | `.env`にキーを追加し`docker compose restart n8n`を実行 |
| ログイン画面が表示されない | n8nコンテナのヘルスチェック失敗 | `docker compose logs n8n`でエラーを確認。メモリ不足の可能性あり |

### アップデート手順

n8nの新バージョンがリリースされたら、以下のコマンドでアップデートできます。

```bash
docker compose pull
docker compose up -d
```

**このコードのポイント:**
- `pull`で最新イメージを取得し、`up -d`で再作成します
- データはDockerボリュームに保存されるため、アップデートで消えることはありません
- メジャーバージョンアップ時は[n8n公式のリリースノート](https://docs.n8n.io/release-notes/)を事前に確認してください

### バックアップ手順

定期的なバックアップを設定しておくことで、障害時にデータを復旧できます。

```bash
# PostgreSQLのデータベースダンプ
docker compose exec postgres pg_dump -U n8n n8n > backup_$(date +%Y%m%d).sql
```

**このコードのポイント:**
- バックアップファイルは外部ストレージ（S3やGoogle Cloud Storageなど）にも保管してください
- `N8N_ENCRYPTION_KEY`はデータベースのバックアップとは別に安全に保管する必要があります
- cronなどで日次バックアップを自動化しておくと、障害発生時の復旧が迅速になります

## 応用・カスタマイズ例

応用・カスタマイズとは、基本構成をベースに運用規模や要件に合わせて機能を拡張することです。

### ワーカーモード

ワークフローの実行数が増えてきたら、ワーカーモードで処理を分散できます。メインプロセスがワークフローの管理を担当し、ワーカープロセスが実行を担当する構成です。大量のWebhookを受信する場合や、重い処理を並列実行したい場合に有効です。詳しくは[n8n公式ドキュメントのスケーリングガイド](https://docs.n8n.io/hosting/scaling/)をご覧ください。

### LDAP/SAML連携

社内にActive DirectoryやGoogle Workspaceなどの認証基盤がある場合、LDAP（ディレクトリサービスのプロトコル）やSAML（シングルサインオンの規格）で連携できます。
従業員のアカウント管理を一元化し、退職時のアクセス権削除も自動化できます。

### 中小企業向けワークフロー例

n8nの構築が完了したら、たとえば以下のような業務自動化ワークフローを作成できます。

- **受注通知の自動化**: Googleフォームの受注データをSlackに自動通知し、スプレッドシートに記録
- **日報集約**: 各担当者がフォームで入力した日報を自動で1つのシートにまとめる
- **請求書リマインド**: 支払期限が近づいた請求書を自動でメール通知

自動化の費用対効果を試算したい方は[自動化ROI計算テンプレート](/articles/frameworks/automation-roi-template)をご活用ください。n8nの構築が完了したら、[n8n × AI連携ワークフロー](/articles/no-code/n8n-ai-workflow)でAIを組み込んだ業務自動化にも挑戦してみてください。
