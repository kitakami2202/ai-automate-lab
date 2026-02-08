---
title: "n8nセルフホスティングガイド - オープンソース自動化ツール"
description: "オープンソースの自動化ツールn8nをセルフホスティングする方法を解説。Dockerを使った構築からワークフロー作成まで詳しく紹介します。"
category: "no-code"
tags: ["n8n", "セルフホスティング", "Docker", "自動化", "オープンソース"]
publishedAt: 2025-03-15
updatedAt: 2025-03-15
author: "れん"
difficulty: "intermediate"
timeToRead: 20
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  totalTime: "PT60M"
relatedArticles: ["no-code/zapier-vs-make", "reviews/automation-tools-matrix", "frameworks/where-to-automate-first"]
draft: false
faq:
  - question: "n8nのセルフホスティングにはどのくらいのサーバースペックが必要ですか？"
    answer: "最低でもCPU 1コア、RAM 1GB程度あれば動作します。ワークフローの複雑さに応じてスペックを増やすことを推奨します。"
  - question: "n8nとZapierの違いは何ですか？"
    answer: "n8nはオープンソースでセルフホスティング可能なため、データを自社サーバーに保持できます。Zapierはクラウドサービスで手軽に使えますが、月額料金がかかります。"
  - question: "n8nのアップデートはどうすればいいですか？"
    answer: "Dockerを使っている場合は、docker pull n8nio/n8nで最新イメージを取得し、コンテナを再起動するだけです。データはボリュームに保存されるため維持されます。"
---

## n8nとは

n8nはオープンソースのワークフロー自動化ツールです。セルフホスティングすれば、無料で無制限に利用できます。

## Dockerでの構築

```yaml
# docker-compose.yml
version: '3'
services:
  n8n:
    image: n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=your-password
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
```

## 起動

```bash
docker-compose up -d
```

ブラウザで`http://localhost:5678`にアクセスすると、n8nのエディタが開きます。

## 基本的なワークフロー例

1. **トリガー**: Webhookでリクエストを受信
2. **処理**: データを変換・フィルタリング
3. **アクション**: Slackに通知を送信

## ZapierやMakeとの比較

| 項目 | n8n | Zapier | Make |
|------|-----|--------|------|
| 料金 | 無料（セルフホスト） | 有料 | 有料 |
| カスタマイズ | 高い | 低い | 中 |
| 運用コスト | サーバー代 | 不要 | 不要 |
| 技術レベル | 中〜高 | 低 | 低〜中 |

## まとめ

n8nはセルフホスティングによりコストを抑えつつ、高度な自動化を実現できます。技術力に自信があるなら、最もコスパの良い選択肢です。
