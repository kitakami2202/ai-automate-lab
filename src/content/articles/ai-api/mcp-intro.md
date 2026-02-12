---
title: "MCP入門｜AIと業務ツールをつなぐModel Context Protocol"
description: "MCP（Model Context Protocol）の基本概念と業務活用を初心者向けに解説。AIと業務ツール（Google Drive・Slack・DB等）を標準規格で接続する仕組みと導入手順を紹介。中小企業のAI業務自動化を加速する最新プロトコルの全体像がわかります。"
category: "ai-api"
tags: ["MCP", "Model Context Protocol", "AI連携", "業務自動化", "Claude"]
publishedAt: 2026-02-11
updatedAt: 2026-02-11
author: "れん"
difficulty: "beginner"
timeToRead: 12
layer: "entry"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "0円"
  totalTime: "PT30M"
faq:
  - question: "MCPとは何ですか？簡単に教えてください"
    answer: "MCP（Model Context Protocol）は、AIアプリケーションと外部ツール（ファイル、データベース、Slack等）を接続するための標準規格です。Anthropicが策定したオープンプロトコルで、USBのようにどのAIツールからでも同じ規格で業務ツールに接続できます。"
  - question: "MCPを使うのにプログラミング経験は必要ですか？"
    answer: "基本的な設定（JSONファイルの編集）ができれば利用可能です。既存のMCPサーバーを使うだけなら、コードを書く必要はありません。Claude DesktopやClaude Codeの設定ファイルにMCPサーバーの情報を追加するだけで使い始められます。"
  - question: "MCPとAPIの違いは何ですか？"
    answer: "APIは個々のサービスが独自に提供するインターフェースで、サービスごとに使い方が異なります。MCPはそれらのAPIを統一された規格でAIに提供する「中間層」です。Slack APIとGoogle Drive APIは使い方が全く違いますが、MCPサーバーを通せばAIからは同じ方法でアクセスできます。"
  - question: "どのAIツールがMCPに対応していますか？"
    answer: "Claude Desktop、Claude Code、Cursor、Windsurf、VS Code（GitHub Copilot Agent Mode）など主要なAIツールが対応しています（2026年2月時点）。MCPはオープンプロトコルのため、対応ツールは急速に拡大しています。"
relatedArticles:
  - "ai-api/ai-api-overview"
  - "ai-api/claude-api-intro"
  - "frameworks/ai-introduction-5steps"
draft: false
---

| 項目 | 内容 |
|------|------|
| 対象読者 | AIと業務ツールの連携に興味があるが、MCPが何かわからない方 |
| 前提知識 | 不要（AI APIの基礎は[AI APIを業務に組み込む方法](/articles/ai-api/ai-api-overview)を参照） |
| この記事でわかること | MCPの全体像 / 仕組み / 接続できるツール / 導入手順 |
| 所要時間（セットアップ含む） | 約30分 |

MCP（Model Context Protocol）とは、AIアプリケーションと外部の業務ツールを標準規格で接続するためのオープンプロトコルです。
Anthropicが2024年に策定し、2025〜2026年にかけてClaude・Cursor・VS Codeなど主要AIツールが対応しました。
この記事では、MCPの仕組み・接続できるツール・導入手順を初心者向けに解説します。

## MCPとは — AIと業務ツールの「共通コネクタ」

MCP（Model Context Protocol）とは、AIが外部のデータやツールにアクセスするための標準プロトコル（通信規格）です。Anthropicが策定し、オープンソースで公開されています。

### USBに例えると理解しやすい

MCPの役割は、パソコンにおけるUSBポートと似ています。

| USBの世界 | MCPの世界 |
|----------|----------|
| USBポート | MCPクライアント（AI側の接続口） |
| USBケーブル | MCPプロトコル（通信規格） |
| USB機器（マウス、キーボード等） | MCPサーバー（Google Drive、Slack等） |
| どのメーカーのPCでも同じUSB規格で接続 | どのAIツールでも同じMCP規格で業務ツールに接続 |

USBが登場する前は、機器ごとに異なるコネクタが必要でした。MCPが登場する前のAIも同じ状況で、ツールごとにカスタムのAPI連携コードを書く必要がありました。MCPはこの「コネクタの乱立」を解決する標準規格です。

### MCPが解決する問題

従来のAI×業務ツール連携と、MCP導入後の違いを比較します。

| 項目 | 従来（個別API連携） | MCP導入後 |
|------|-------------------|----------|
| 連携方法 | ツールごとにAPIコードを書く | MCPサーバーを設定ファイルに追加するだけ |
| 開発コスト | サービスごとに数時間〜数日 | 既存のMCPサーバーを使えば数分 |
| AIツールの切り替え | 連携コードを全部書き直し | MCPサーバーはそのまま使える |
| メンテナンス | API仕様変更のたびに修正 | MCPサーバーの更新で対応 |

中小企業にとっては「開発コストの大幅な削減」と「AIツール乗り換え時の移行コストゼロ」が最大のメリットです。

AI APIの基礎から知りたい方は[AI APIを業務に組み込む方法](/articles/ai-api/ai-api-overview)をご覧ください。

## MCPの仕組み — ホスト・クライアント・サーバーの3要素

MCPの仕組みとは、ホスト・クライアント・サーバーの3要素が連携してAIと外部ツールを接続するアーキテクチャ（設計構造）のことです。

```text
┌─────────────────────────────────────────────┐
│  MCPホスト（Claude Desktop等）                 │
│  ┌──────────────┐                           │
│  │ MCPクライアント │ ←→ MCPサーバーA（Google Drive） │
│  │              │ ←→ MCPサーバーB（Slack）        │
│  │              │ ←→ MCPサーバーC（データベース）    │
│  └──────────────┘                           │
└─────────────────────────────────────────────┘
```

| 要素 | 役割 | 具体例 |
|------|------|--------|
| MCPホスト | ユーザーが操作するAIアプリケーション | Claude Desktop、Claude Code、Cursor |
| MCPクライアント | ホスト内でMCPサーバーとの通信を管理する部品 | ホストに内蔵（ユーザーが意識する必要なし） |
| MCPサーバー | 外部ツールの機能をAIに提供するプログラム | Google Drive用、Slack用、ファイルシステム用 |

ユーザーが意識するのは**MCPホスト**（どのAIアプリを使うか）と**MCPサーバー**（どの業務ツールを接続するか）の2つだけです。

### MCPサーバーが提供する3つの機能

各MCPサーバーは、以下の3種類の機能をAIに提供します。

| 機能 | 説明 | 例 |
|------|------|-----|
| ツール（Tools） | AIが実行できるアクション | ファイル作成、メッセージ送信、データ検索 |
| リソース（Resources） | AIが読み取れるデータ | ファイル一覧、データベースのテーブル情報 |
| プロンプト（Prompts） | 事前定義されたテンプレート | コードレビュー用、要約用のプロンプト |

たとえばSlack用MCPサーバーは、「チャンネル一覧の取得」（リソース）と「メッセージの送信」（ツール）をAIに提供します。AIは必要に応じてこれらを呼び出し、ユーザーの指示を実行します。

## MCPで接続できる業務ツール

MCPで接続できる業務ツールとは、公開されているMCPサーバーを通じてAIからアクセスできる外部サービスやデータソースのことです。

### 中小企業の業務に役立つMCPサーバー

2026年2月時点で、業務自動化に役立つ主要なMCPサーバーを紹介します。

| MCPサーバー | 接続先 | できること | 業務活用例 |
|------------|--------|----------|-----------|
| filesystem | ローカルファイル | ファイルの読み書き・検索 | フォルダ内のファイル整理・CSV集計 |
| google-drive | Google Drive | ファイル検索・読み取り | 社内文書の検索・要約 |
| slack | Slack | メッセージ送受信・チャンネル管理 | 日報の自動投稿・問い合わせ対応 |
| github | GitHub | リポジトリ操作・Issue管理 | 開発タスクの管理・コードレビュー |
| postgres / sqlite | データベース | SQL実行・データ取得 | 売上データの集計・レポート生成 |
| brave-search | Web検索 | 検索結果の取得 | 市場調査・競合分析 |

公式のMCPサーバー一覧は[MCP Servers リポジトリ](https://github.com/modelcontextprotocol/servers)で確認できます。コミュニティ製を含めると数百種類のサーバーが公開されています。

### MCPに対応しているAIツール

| AIツール | MCP対応 | 特徴 |
|---------|--------|------|
| Claude Desktop | 対応 | 最も安定したMCPサポート |
| Claude Code | 対応 | ターミナルからMCPサーバーを利用可能 |
| Cursor | 対応 | IDE内でMCPサーバーのツールを利用 |
| Windsurf | 対応 | IDE統合型のMCPサポート |
| VS Code（Copilot Agent Mode） | 対応 | GitHub Copilotのエージェントモードで利用 |

MCPはオープンプロトコルのため、対応ツールは今後も増え続ける見込みです。AIコーディングツールの比較は[AIコーディングツール比較](/articles/reviews/ai-coding-tools-comparison)で詳しく解説しています。

## MCPを試してみる — Claude Desktopで始める手順

MCPを試す最も簡単な方法は、Claude Desktopにファイルシステム用MCPサーバーを接続することです。ローカルのファイルをAIに読み書きさせる体験ができます。

### ステップ1: Claude Desktopをインストール

[Claude公式サイト](https://claude.ai/download)からClaude Desktopをダウンロードしてインストールします。Anthropicアカウントでログインしてください。

### ステップ2: Node.jsを準備

MCPサーバーの実行にはNode.jsが必要です。未インストールの場合は[Node.js公式サイト](https://nodejs.org/)からLTS版をインストールしてください。

```bash
node --version
# v22.x.x と表示されればOK
```

### ステップ3: 設定ファイルを編集

Claude Desktopの設定ファイルにMCPサーバーの情報を追加します。

**Macの場合:**

設定ファイルの場所: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windowsの場合:**

設定ファイルの場所: `%APPDATA%\Claude\claude_desktop_config.json`

設定ファイルに以下のJSON（データの記述形式）を記載します。

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/Documents"
      ]
    }
  }
}
```

`/Users/yourname/Documents` の部分は、AIにアクセスを許可したいフォルダのパスに置き換えてください。Windowsの場合は `C:\\Users\\yourname\\Documents` のようにバックスラッシュを2つ重ねます。

**重要:** 指定したフォルダ内のファイルをAIが読み書きできるようになります。機密情報を含むフォルダは指定しないでください。

### ステップ4: 再起動して動作確認

Claude Desktopを再起動すると、チャット入力欄の下にMCPツールのアイコン（ハンマーマーク）が表示されます。これで接続完了です。

以下のように指示を出してみましょう。

```
Documentsフォルダにあるファイルの一覧を表示してください。
```

```
Documentsフォルダ内のCSVファイルを読み込んで、内容を要約してください。
```

AIがローカルファイルに直接アクセスし、内容を読み取って回答してくれます。従来はファイル内容をコピペしてチャットに貼り付けていた作業が、MCPによって不要になります。

### トラブルシューティング

| 問題 | 原因 | 解決策 |
|------|------|--------|
| MCPツールのアイコンが表示されない | 設定ファイルのJSON記法エラー | JSONの構文（カンマ、括弧の対応）を確認 |
| 「サーバーに接続できません」 | Node.jsまたはnpxが見つからない | Node.jsをインストールし、ターミナルで `npx --version` を確認 |
| ファイルにアクセスできない | パスの指定ミス | 設定ファイルのフォルダパスが正しいか確認 |
| 設定ファイルが見つからない | Claude Desktopの初回起動前 | Claude Desktopを一度起動してから設定ファイルを作成 |

## まとめ：次のステップ

MCPは、AIと業務ツールを標準規格で接続するオープンプロトコルです。既存のMCPサーバーを使えば、コードを書かずにAIからGoogle Drive・Slack・データベースなどにアクセスできます。中小企業がAI業務自動化を進めるうえで、今後欠かせない技術です。

あなたの状況に合わせて、次の記事に進んでください。

- **AIで自動化スクリプトを作りたい** → [Claude Codeで業務自動化スクリプトを爆速で作る方法](/articles/ai-api/claude-code-automation)
- **AI APIの基礎から学びたい** → [AI APIを業務に組み込む方法](/articles/ai-api/ai-api-overview)
- **Claude APIを実装してみたい** → [Claude API入門](/articles/ai-api/claude-api-intro)
- **AI導入の全体像を知りたい** → [中小企業向けAI導入5ステップ](/articles/frameworks/ai-introduction-5steps)
