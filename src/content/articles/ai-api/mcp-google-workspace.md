---
title: "MCP × Google Workspace連携｜実践ガイド"
description: "MCP（Model Context Protocol）でClaude DesktopとGoogle Workspace（スプレッドシート・Gmail・カレンダー）を連携する方法を解説。MCPサーバーの設定からスプレッドシートのAI分析・メール下書き生成まで、実務で使える構成例を紹介します。"
category: "ai-api"
tags: ["MCP", "Google Workspace", "Claude Desktop", "AI連携", "スプレッドシート"]
publishedAt: 2026-02-12
updatedAt: 2026-02-12
author: "れん"
difficulty: "intermediate"
timeToRead: 15
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "月20ドル（Claude Pro）"
  totalTime: "PT60M"
faq:
  - question: "MCPとは何ですか？"
    answer: "MCP（Model Context Protocol）はAnthropicが策定したオープンプロトコルで、AIアプリケーションと外部ツール・データソースを標準的な方法で接続する仕組みです。USBのように「つなぐだけで使える」AIとツールの接続規格です。詳しくはMCP入門記事をご覧ください。"
  - question: "Google WorkspaceのAPIキーは必要ですか？"
    answer: "はい、Google Cloud ConsoleでOAuth認証情報を作成する必要があります。MCPサーバーがGoogle APIにアクセスするための認証設定です。本記事で手順を解説しています。"
  - question: "Claude Pro（月20ドル）で使えますか？"
    answer: "はい、Claude DesktopはClaude Pro以上のプランで利用でき、MCP連携も追加費用なしで使えます（2026年2月時点）。Google API側の無料枠も中小企業の一般的な利用量であれば十分です。"
relatedArticles:
  - "ai-api/mcp-intro"
  - "ai-api/ai-api-overview"
  - "gas/gas-basics"
draft: false
---

> この記事は[MCP入門](/articles/ai-api/mcp-intro)の実践編です。
> MCPの基本概念から知りたい方は先にそちらをご覧ください。

この記事では、MCPを使ってClaude DesktopとGoogle Workspace（スプレッドシート・Gmail・カレンダー）を連携する方法を解説します。
AIが直接スプレッドシートのデータを読み取り、分析結果を返したりメールの下書きを生成する実務的な活用法を紹介します。

### この記事の前提

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Anthropic（Claude Pro以上）、Google |
| 必要な知識 | [MCP入門](/articles/ai-api/mcp-intro)を読了済み |
| 所要時間 | 約60分 |
| 費用 | Claude Pro 月20ドル / Google API 無料枠内 |
| 完成物 | Claude Desktop × Google Workspace連携環境 |

## この記事で作るもの

MCP × Google Workspace連携とは、MCPサーバーを通じてClaude DesktopからGoogleサービスのデータを読み書きし、AI分析やコンテンツ生成を行う仕組みです。

| 連携先 | できること | 業務活用例 |
|--------|----------|---------|
| スプレッドシート | データ読み取り・書き込み | 売上データのAI分析 |
| Gmail | メール検索・下書き作成 | 問い合わせメールの返信下書き |
| カレンダー | 予定の取得・作成 | スケジュール確認と調整 |

## 準備・Google API認証の設定

準備とは、MCPサーバーがGoogle Workspaceにアクセスするための認証情報を整える作業のことです。

### Google Cloud Consoleの設定

1. [Google Cloud Console](https://console.cloud.google.com) でプロジェクトを作成します
2. 「APIとサービス」→「ライブラリ」で以下のAPIを有効化します

| API | 用途 |
|-----|------|
| Google Sheets API | スプレッドシートの読み書き |
| Gmail API | メールの検索・下書き作成 |
| Google Calendar API | 予定の取得・作成 |

3. 「認証情報」→「認証情報を作成」→「OAuthクライアントID」を作成します
4. アプリケーションの種類: 「デスクトップアプリ」を選択します
5. `credentials.json` をダウンロードして安全な場所に保管します

### MCPサーバーのインストール

Google Workspace用のMCPサーバーをインストールします。

```bash
npm install -g @anthropic/mcp-google-workspace
```

※パッケージ名は例示です。最新のMCPサーバー一覧は[MCP公式リポジトリ](https://github.com/modelcontextprotocol/servers)をご確認ください。

### Claude Desktopの設定

Claude Desktopの設定ファイル（`claude_desktop_config.json`）にMCPサーバーを追加します。

```json
{
  "mcpServers": {
    "google-workspace": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-google-workspace"],
      "env": {
        "GOOGLE_CREDENTIALS_PATH": "/path/to/credentials.json"
      }
    }
  }
}
```

設定後、Claude Desktopを再起動するとGoogle Workspace連携が有効になります。

## 活用パターン

### パターン1: スプレッドシートのAI分析

Claude Desktopに以下のように指示するだけで、スプレッドシートのデータをAIが分析します。

```text
「売上管理」スプレッドシートの2026年1月のデータを読み取り、
以下を分析してください：
1. 商品別の売上ランキング（上位5つ）
2. 前月比の増減率
3. 今後の売上予測と改善提案
```

AIがMCPを通じてスプレッドシートのデータを直接読み取り、分析結果を返します。GASスクリプトの記述なしに、自然言語だけでデータ分析が可能です。

### パターン2: メール返信の下書き生成

```text
Gmailの受信トレイから「見積依頼」に関するメールを検索し、
それぞれに返信の下書きを作成してください。
丁寧な敬語で、見積書は3営業日以内に送付する旨を伝えてください。
```

### パターン3: カレンダーとスプレッドシートの連携

```text
来週の予定をGoogleカレンダーから取得し、
「週間スケジュール」スプレッドシートに一覧として書き出してください。
```

## 動作確認・トラブルシューティング

| エラー | 原因 | 解決策 |
|--------|------|--------|
| MCPサーバーが接続できない | 設定ファイルのパス誤り | `claude_desktop_config.json` のパスを確認 |
| Google認証エラー | credentials.jsonの不備 | Google Cloud Consoleで再ダウンロード |
| スプレッドシートが読めない | APIが未有効 | Google Cloud ConsoleでSheets APIを有効化 |
| 権限エラー | OAuthスコープの不足 | 認証情報のスコープを確認・再認証 |

## GASとの使い分け

| 用途 | MCP連携 | GAS |
|------|---------|-----|
| 単発のデータ分析 | 最適（自然言語で指示） | 不要 |
| 定期実行の自動化 | 不向き | 最適（トリガー設定） |
| 複雑な加工・集計 | AI判断が必要な処理 | ルールベースの処理 |
| バッチ処理 | 不向き | 最適 |

定期実行が必要な業務は[GASスプレッドシート自動化](/articles/gas/gas-spreadsheet-automation)、AIの組み込みは[GAS × Claude API連携](/articles/gas/gas-claude-api)をご覧ください。

## 応用・カスタマイズ例

- **複数MCPサーバーの組み合わせ** — Google Workspace + Slack + GitHubを同時接続し、横断的な業務をAIに任せる
- **社内ナレッジベース** — Google Driveのドキュメントをまとめてスプレッドシートに索引化するタスクをAIに指示
- **レポート生成** — スプレッドシートのデータを分析し、Google Docsにレポートとして出力

MCPの基本概念は[MCP入門](/articles/ai-api/mcp-intro)、AI APIの全体像は[AI API比較・入門ガイド](/articles/ai-api/ai-api-overview)をご覧ください。
