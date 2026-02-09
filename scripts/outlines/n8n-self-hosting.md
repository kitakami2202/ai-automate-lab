# 記事ブリーフ: n8n-self-hosting（リライト）

## 基本情報

| 項目 | 内容 |
|------|------|
| slug | n8n-self-hosting |
| primary_kw | n8n セルフホスティング |
| secondary_kw | n8n 自己ホスティング, n8n 構築 |
| Layer | execution（Layer 2） |
| 記事タイプ | howto |
| クラスター | no-code |
| 想定文字数 | 3,000〜5,000文字 |
| ターゲット読者 | 中小企業の経営者・事務担当者で、Zapier/Makeのコストに課題を感じ、n8nのセルフホストに関心がある人 |
| difficulty | intermediate |
| timeToRead | 20 |

## 現状記事の課題

| 課題 | 詳細 |
|------|------|
| 文字数不足 | 約500文字。目標3,000〜5,000文字に対して大幅に不足 |
| Docker Compose v1記法 | `version: '3'` を使用。v2形式（versionフィールドなし）に更新が必要 |
| 非推奨の認証方式 | `N8N_BASIC_AUTH_ACTIVE` / `N8N_BASIC_AUTH_USER` / `N8N_BASIC_AUTH_PASSWORD` を使用。n8n v1.0以降ビルトインユーザー管理に移行済みで、BASIC_AUTHは廃止 |
| PostgreSQL未使用 | デフォルトのSQLiteのみ。本番運用にはPostgreSQL推奨 |
| HTTPS設定なし | 本番環境で必須のHTTPS/リバースプロキシ設定が未記載 |
| バックアップ手順なし | `N8N_ENCRYPTION_KEY`やDB バックアップの説明がない |
| ワークフロー例が抽象的 | 「Webhookでリクエスト受信→Slack通知」の概念のみで、実際のJSON/手順なし |
| コスト比較が不十分 | 「有料/無料」の一言のみ。具体的な金額比較なし |
| Layer 2テンプレート未準拠 | 冒頭にピラーリンクなし、前提条件テーブルなし、ステップ形式でない |
| 表が1個のみ | 品質ルールは表1つ以上だが内容が薄い |
| 内部リンク0本 | 本文中に内部リンクが一切ない |
| description不足 | 91文字。120-160文字の範囲外 |
| titleにprimary_kwの最適化余地 | 「n8n セルフホスティング」をより明確に含める |
| FAQ内容が浅い | 回答が短く、実務的な深みがない |

## 競合分析サマリ

### 上位5記事

| # | 記事タイトル | URL | 推定文字数 | 強み | 弱み |
|---|------------|-----|-----------|------|------|
| 1 | n8nセルフホストの始め方ガイド！VPS・ローカル構築の手順とコスト比較 | https://taskhub.jp/useful/n8n-self-host/ | 5,000〜7,000 | VPS比較表あり、ローカル/VPSの両方カバー、コスト比較が具体的 | Docker Composeの設定が古い（BASIC_AUTH使用の可能性）、セキュリティ設定が薄い、業務自動化の具体例なし |
| 2 | n8nセルフホスティング完全ガイド | https://producewaves.com/knowledge08/ | 3,000〜5,000 | 網羅的な構成、初心者向けの丁寧な説明 | コード例が少ない、HTTPS設定の手順が不十分、中小企業視点の欠如 |
| 3 | n8nの初心者でもできる！セルフホストで運用コストを半分以下にする方法 | https://data-x.jp/blog/n8n_selfhosting/ | 4,000〜6,000 | コスト削減を前面に出した切り口、初心者フレンドリー | Docker Compose設定の深掘り不足、トラブルシューティング不足、バックアップ手順なし |
| 4 | AWS EC2でn8nを構築！Docker Compose + CaddyでHTTPS対応 | https://www.cloudbuilders.jp/articles/6935/ | 5,000〜8,000 | AWS EC2 + Caddy + HTTPS の本番構成、技術的に正確 | AWS前提でVPSコストが高い（中小企業向きでない）、認証方式の新旧説明なし、業務ワークフロー例なし |
| 5 | n8n docker 導入ガイド：インストールからアップデートまで徹底解説 | https://taskhub.jp/useful/n8n-docker/ | 4,000〜6,000 | アップデート手順を含む、Docker基礎からカバー | docker-compose.yml の設定が古い可能性、PostgreSQL本番構成の解説不足、セキュリティ対策が限定的 |

### 必須トピック（3記事以上でカバー）
- n8nの概要・特徴（オープンソース、セルフホスト可能）
- Docker / Docker Composeのインストール手順
- docker-compose.yml の基本設定
- n8nの起動・アクセス確認
- データの永続化（ボリュームマウント）
- アップデート手順

### 差別化チャンス（1-2記事のみカバー）
- HTTPS設定（CaddyまたはTraefik）: 1記事のみ本格的にカバー
- PostgreSQL本番構成: 一部記事が言及も手順不足
- VPSコスト比較表: 1記事が詳しい
- N8N_ENCRYPTION_KEYの管理: ほぼ未カバー

### 独自トピック候補（どの記事もカバーなし）
- 旧BASIC_AUTH → ビルトインユーザー管理への移行説明と最新設定
- Docker Compose v2形式（versionフィールド不要）の明示的な採用
- Zapier/Makeとの具体的月額コスト比較表（2026年2月時点の実額）
- 中小企業の業務自動化に特化したワークフロー例（受注通知、日報集約など）
- バックアップ戦略（ENCRYPTION_KEY + PostgreSQL dump）
- セキュリティチェックリスト（HTTPS必須、ファイアウォール、環境変数管理）

## 差別化ポイント

| パターン | 採用 | 根拠 |
|---------|------|------|
| 最新技術対応 | **採用** | 競合の大半がDocker Compose v1記法・旧BASIC_AUTHを使用。v2形式+ビルトインユーザー管理を採用した記事はほぼゼロ |
| コスト比較差別化 | **採用** | Zapier（月$19.99〜）/ Make（月$9〜）/ n8nクラウド（月EUR24〜）/ n8nセルフホスト（VPS月500〜1,500円）の具体的金額比較表を2026年2月時点で提示する記事がない |
| 中小企業実務差別化 | **採用** | 「受注フォーム→Slack通知→スプレッドシート記録」のような中小企業の具体的業務フローをn8nワークフローとして提示する記事がない。競合はHello World的な例のみ |
| セキュリティ・運用差別化 | **採用** | HTTPS設定、ENCRYPTION_KEY管理、バックアップ手順を一貫して解説する日本語記事がない |
| Layer連携差別化 | **採用** | ピラー記事（zapier-vs-make）との明確な導線。競合は単独記事で完結 |

## 想定読者
- 中小企業の経営者・事務担当者で、Zapier/Makeの月額コストに課題を感じている人
- 「n8nは無料で使えるらしいが、セルフホストのやり方がわからない」という段階の人
- Dockerの基本概念は知っているが、本番運用の構成には自信がない人
- 自社のデータを外部サービスに預けたくない（オンプレ志向の）中小企業

## 記事構成（howto テンプレート準拠）

### 導入部（3行）
- 1行目: 「この記事では、Docker Composeを使ってn8nを自社サーバーにセルフホスティングする環境を約30分で構築します」
- 2行目: 「Docker環境があれば、コピペだけで動くdocker-compose.ymlを全文掲載しています」
- 3行目: ピラーリンク「この記事は[Zapier vs Make 徹底比較](/articles/no-code/zapier-vs-make)の実装編です。ノーコードツールの全体像から知りたい方は先にそちらをご覧ください。」

### 前提条件テーブル
| 項目 | 内容 |
|------|------|
| 必要な環境 | Docker Engine 20.10以上 + Docker Compose v2 がインストール済みのLinuxサーバー（またはローカルPC） |
| 必要な知識 | [Zapier vs Make 徹底比較](/articles/no-code/zapier-vs-make)を読了済み、ターミナル操作の基礎 |
| 所要時間 | 約30分（ローカル）/ 約60分（VPS + HTTPS） |
| 完成物 | HTTPS対応のn8nセルフホスト環境（PostgreSQLバックエンド、自動バックアップ付き） |
| 想定コスト | VPS月額500〜1,500円（ローカルなら0円） |

### H2-1: この記事で作るもの
- 内容:
  - 完成構成図: Docker Compose で n8n + PostgreSQL + Caddy（リバースプロキシ）の3コンテナ構成
  - なぜセルフホスト？: Zapier月$19.99〜 / Make月$9〜 に対し、VPS月500〜1,500円で無制限実行。年間で数万円のコスト削減（2026年2月時点の料金で比較表を掲載）
  - データの自社管理: 顧客データ・業務データを外部に渡さない安心感
  - ビルトインユーザー管理: n8n v1.0以降、旧BASIC_AUTHは廃止。初回アクセス時にオーナーアカウントを作成する新方式の説明
  - コスト比較表（Zapier / Make / n8n Cloud / n8n セルフホスト）

### H2-2: 準備・環境構築
- 内容:
  - VPSの選び方（中小企業向け推奨: ConoHa VPS / Xserver VPS / さくらVPS → 月500〜1,500円帯）
  - 必要スペック表: CPU 1コア以上、RAM 2GB以上推奨、ストレージ 20GB以上
  - Docker + Docker Compose v2 のインストール確認コマンド
  - ドメイン取得とDNS設定（HTTPS化する場合）
  - プロジェクトディレクトリの作成
  - .envファイルの作成（N8N_ENCRYPTION_KEY、POSTGRES_PASSWORD、ドメイン設定など。APIキーをハードコードしない注意書き）

### H2-3: 実装手順
- 内容: docker-compose.yml の全文掲載と各セクションの解説
- ステップ構成:
  - ステップ1: docker-compose.yml を作成する
    - Docker Compose v2形式（versionフィールドなし）
    - 3サービス構成: n8n / postgres / caddy
    - n8nの環境変数: DB_TYPE=postgresdb、DB接続情報、N8N_ENCRYPTION_KEY、WEBHOOK_URL 等
    - PostgreSQLの永続化ボリューム
    - Caddyの自動HTTPS設定（Caddyfileも全文掲載）
    - 「このコードのポイント」解説
  - ステップ2: .env ファイルを設定する
    - 環境変数の一覧と説明テーブル
    - N8N_ENCRYPTION_KEYの生成方法（`openssl rand -hex 32`）
    - セキュリティ上の注意点
  - ステップ3: コンテナを起動する
    - `docker compose up -d` コマンド
    - 起動確認コマンド（`docker compose ps`, `docker compose logs`）
  - ステップ4: 初期セットアップ（オーナーアカウント作成）
    - ブラウザでアクセス → ビルトインユーザー管理のオーナー登録画面
    - メールアドレス + パスワードでアカウント作成
    - 旧BASIC_AUTHとの違いの補足説明

### H2-4: 動作確認・トラブルシューティング
- 内容:
  - 動作確認チェックリスト（HTTPS接続、ログイン、ワークフロー作成テスト）
  - 中小企業向け実用ワークフロー例: 「Googleフォーム受注 → Slack通知 → スプレッドシート記録」の概要（詳細は別記事へ誘導）
  - アップデート手順（`docker compose pull && docker compose up -d`）
  - バックアップ手順（PostgreSQL dump + ENCRYPTION_KEY保管）
- エラー表:

| エラー | 原因 | 解決策 |
|--------|------|--------|
| `port 5678 already in use` | 他プロセスがポート使用中 | `lsof -i :5678` で確認し、ポート変更または停止 |
| `ECONNREFUSED` (PostgreSQL) | DBコンテナ未起動 or 接続情報不一致 | `docker compose logs postgres` で確認、.env の設定を見直し |
| HTTPS証明書エラー | DNSが未反映 or Caddyの設定ミス | DNS伝播を待つ（最大48時間）、Caddyfileのドメイン名を確認 |
| `No encryption key found` | N8N_ENCRYPTION_KEY未設定 | .env にキーを追加し `docker compose restart n8n` |
| ログイン画面が表示されない | n8nコンテナのヘルスチェック失敗 | `docker compose logs n8n` でエラー確認、メモリ不足の可能性あり |

### H2-5: 応用・カスタマイズ例
- 内容:
  - ワーカーモード（大量実行時のスケールアウト）の概要紹介
  - LDAP/SAML連携（社内認証基盤との統合）の概要
  - 業務自動化ワークフロー例の紹介と関連記事への誘導
  - 「自動化の費用対効果を試算したい方は[自動化ROI計算テンプレート](/articles/frameworks/automation-roi-template)をご活用ください」

## FAQ案（5問）

| # | 質問 | 回答の方向性 |
|---|------|------------|
| 1 | n8nのセルフホスティングにはどのくらいのサーバースペックが必要ですか？ | 最低CPU 1コア・RAM 1GBで動作するが、PostgreSQL併用時はRAM 2GB以上推奨。ワークフロー数が増えたらCPU 2コア・RAM 4GBへ。VPS月額500〜1,500円帯で十分 |
| 2 | n8nの旧BASIC_AUTH認証はまだ使えますか？ | n8n v1.0以降、N8N_BASIC_AUTH系の環境変数は廃止。初回アクセス時にオーナーアカウントを作成するビルトインユーザー管理に移行。既存環境からの移行手順も簡潔に記載 |
| 3 | n8nセルフホストとZapier/Makeのコスト差はどのくらいですか？ | Zapier Professional月$19.99（750タスク）、Make Core月$9（10,000オペレーション）に対し、n8nセルフホストはVPS月500〜1,500円で実行回数無制限。年間で数万〜十数万円の差。2026年2月時点の料金 |
| 4 | n8nのデータバックアップはどうすればいいですか？ | PostgreSQLの定期ダンプ（`pg_dump`）+ N8N_ENCRYPTION_KEYの安全な保管が必須。ENCRYPTION_KEYを紛失するとクレデンシャルが復号不可になるため、別途安全に保存する |
| 5 | ローカルPCでもn8nをセルフホストできますか？ | Docker環境があればWindows/Mac/Linuxで構築可能。ただし常時稼働が必要なワークフローにはVPSを推奨。ローカルは検証・開発用途向き |

## 内部リンク計画（最低3本）

| リンク先 | 種別 | 配置場所 | アンカーテキスト例 |
|---------|------|---------|------------------|
| no-code/zapier-vs-make | 同カテゴリ（Layer 1 ピラー）必須 | 冒頭の導入部 + H2-1コスト比較 | 「Zapier vs Make 徹底比較」 |
| reviews/automation-tools-matrix | 同カテゴリ（reviews） | H2-1 or H2-5 | 「自動化ツール比較表」 |
| frameworks/automation-roi-template | 別カテゴリ（frameworks） | H2-5 応用セクション | 「自動化ROI計算テンプレート」 |
| frameworks/where-to-automate-first | 別カテゴリ（frameworks） | H2-1 導入部の補足 | 「どこから自動化すべきか」 |

## frontmatter更新計画

```yaml
title: "n8nセルフホスティング完全ガイド - Docker Composeで構築"  # 60文字以内、primary_kw含む
description: "n8nをDocker Composeでセルフホスティングする手順を解説。PostgreSQL・HTTPS対応の本番構成をコピペで構築でき、Zapier/Makeとのコスト比較も掲載しています。"  # 120-160文字
category: "no-code"
tags: ["n8n", "セルフホスティング", "Docker Compose", "自動化", "ノーコード", "オープンソース"]
publishedAt: 2025-03-15
updatedAt: 2026-02-XX  # リライト日
author: "れん"
difficulty: "intermediate"
timeToRead: 20
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "月額500〜1,500円（VPS）"
  totalTime: "PT60M"
relatedArticles:
  - "no-code/zapier-vs-make"           # 同カテゴリ（ピラー）
  - "reviews/automation-tools-matrix"   # 同カテゴリ
  - "frameworks/automation-roi-template" # 別カテゴリ
draft: false
faq:
  - question: "..."  # 上記FAQ案の5問を反映
    answer: "..."
```

## ライターへの指示

1. **Docker Compose v2形式を必ず使用**: `version:` フィールドは記載しない。`docker compose`（ハイフンなし）コマンドを使用
2. **旧BASIC_AUTHは絶対に使わない**: n8n v1.0以降のビルトインユーザー管理を前提に記述。初回アクセス時のオーナーアカウント作成手順を明記
3. **コスト比較は2026年2月時点と明記**: Zapier/Make/n8n Cloudの料金は公式URLをリンクし、時点を「2026年2月時点」と記載
4. **docker-compose.yml / Caddyfile / .env は全文掲載**: 省略禁止。コピペで動く状態にする
5. **APIキー・トークンをハードコードしない**: 環境変数で管理し、.envファイルの.gitignore追加を注記
6. **中小企業の実務視点を忘れない**: コスト意識、データ管理への安心感、「Zapierの月額を削減したい」という動機に応える
7. **Layer 2記事として冒頭にピラーリンク**: zapier-vs-makeへの導線を必ず配置
8. **PostgreSQL + Caddy構成を推奨**: SQLite（デフォルト）ではなくPostgreSQLを本番構成として採用。CaddyでHTTPS自動化

## 想定文字数
3,000-5,000文字
