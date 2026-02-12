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
  estimatedCost: "月20ドル（Claude Pro、2026年2月時点）"
  totalTime: "PT60M"
faq:
  - question: "MCPとは何ですか？"
    answer: "MCP（Model Context Protocol）はAnthropicが策定したオープンプロトコルで、AIアプリケーションと外部ツール・データソースを標準的な方法で接続する仕組みです。USBのように「つなぐだけで使える」AIとツールの接続規格です。詳しくはMCP入門記事をご覧ください。"
  - question: "Google WorkspaceのAPIキーは必要ですか？"
    answer: "はい、Google Cloud ConsoleでOAuth認証情報を作成する必要があります。MCPサーバーがGoogle APIにアクセスするための認証設定です。本記事で手順を解説しています。"
  - question: "Claude Pro（月20ドル）で使えますか？"
    answer: "はい、Claude DesktopはClaude Pro以上のプランで利用でき、MCP連携も追加費用なしで使えます（2026年2月時点）。Google API側の無料枠も中小企業の一般的な利用量であれば十分です。"
  - question: "MCPでGoogle Workspaceのデータを扱う際のセキュリティは大丈夫ですか？"
    answer: "MCPサーバーはローカル環境で動作し、データはAIとの通信経路上のみを流れます。Google API側ではOAuthスコープで権限を必要最小限に制限でき、読み取り専用モードでの運用も可能です。ただし社外秘データを扱う場合は、社内のセキュリティポリシーに照らして事前に確認してください。"
  - question: "MCPサーバーを複数同時に使えますか？"
    answer: "はい、claude_desktop_config.jsonに複数のMCPサーバーを登録すれば、Google Workspace・Slack・GitHub等を同時に接続できます。AIがタスクに応じて必要なサーバーを自動的に選択して呼び出します。"
relatedArticles:
  - "ai-api/mcp-intro"
  - "ai-api/ai-api-overview"
  - "gas/gas-basics"
draft: false
---

> この記事は[MCP入門](/articles/ai-api/mcp-intro)の実践編です。
> MCPの基本概念から知りたい方は先にそちらをご覧ください。

この記事の手順を実行すると、Claude Desktopから自然言語でスプレッドシートの分析・メール下書きの生成・スケジュール管理ができるようになります。
AIとGoogleサービスの連携により、手作業でおこなっていたデータ集計やメール対応を大幅に効率化できます。
この実践ガイドでは、MCPサーバーの導入から実務での活用パターンまでをステップ形式で解説します。

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Anthropic（Claude Pro以上）、Google |
| 必要な知識 | [MCP入門](/articles/ai-api/mcp-intro)を読了済み |
| 所要時間 | 約60分 |
| 費用 | Claude Pro 月20ドル / Google API 無料枠内（2026年2月時点） |
| 完成物 | Claude Desktop × Google Workspace連携環境 |
| 動作環境 | Node.js v20 LTS以上 / Python 3.10以上（サーバーによる） |

## この記事で作るもの

MCP × Google Workspace連携とは、MCPサーバーを通じてClaude DesktopからGoogleサービスのデータを読み書きし、AI分析やコンテンツ生成をおこなう仕組みです。

| 連携先 | できること | 業務活用例 |
|--------|----------|---------|
| スプレッドシート | データ読み取り・書き込み | 売上データのAI分析 |
| Gmail | メール検索・下書き作成 | 問い合わせメールの返信下書き |
| カレンダー | 予定の取得・作成 | スケジュール確認と調整 |
| Google Drive | ファイル検索・読み取り | 社内文書の横断検索と要約 |

## 準備・Google API認証の設定

準備とは、MCPサーバーがGoogle Workspaceにアクセスするための認証情報を整える作業のことです。ここではOAuth（オーオース）という認可の仕組みを使います。パスワードを直接共有せずに、アプリケーション間のアクセス権限を安全に管理できます。

### Google Cloud Consoleの設定

1. [Google Cloud Console](https://console.cloud.google.com) でプロジェクトを作成します
2. 「APIとサービス」→「ライブラリ」で以下のAPIを有効化します

| API | 用途 |
|-----|------|
| Google Sheets API | スプレッドシートの読み書き |
| Gmail API | メールの検索・下書き作成 |
| Google Calendar API | 予定の取得・作成 |
| Google Drive API | ファイルの検索・読み取り |

3. 「認証情報」→「認証情報を作成」→「OAuthクライアントID」を作成します
4. アプリケーションの種類: 「デスクトップアプリ」を選択します
5. クライアントIDとクライアントシークレットを控えておきます（次のステップで使用します）

### MCPサーバーの選択とインストール

Google Workspace用のMCPサーバーは複数公開されています。用途に合わせて選択してください。

| MCPサーバー | 対応サービス | インストール方法 | 特徴 |
|------------|------------|----------------|------|
| [@modelcontextprotocol/server-gdrive](https://github.com/modelcontextprotocol/servers-archived/tree/main/src/gdrive) | Google Drive・Sheets（読み取り） | `npx -y @modelcontextprotocol/server-gdrive` | MCP公式。Sheetsは自動CSV変換で読み取り |
| [workspace-mcp](https://github.com/taylorwilsdon/google_workspace_mcp) | Gmail・Calendar・Drive・Sheets・Docs等12サービス | `uvx workspace-mcp` | コミュニティ製。Google Workspace全機能対応 |

この記事では、Google Workspaceの主要サービス（Gmail・カレンダー・スプレッドシート）を一括連携できる **workspace-mcp** を使った手順を紹介します。

**workspace-mcpのインストール:**

Python環境が必要です。`uv`（Pythonパッケージマネージャー）がインストールされていない場合は、先にインストールしてください。

```bash
# uvのインストール（未インストールの場合）
# macOS / Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows（PowerShell）
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# workspace-mcpの動作確認
uvx workspace-mcp --help
```

### Claude Desktopの設定

Claude Desktopの設定ファイル（`claude_desktop_config.json`）にMCPサーバーを追加します。

**設定ファイルの場所:**

| OS | パス |
|----|------|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |

**workspace-mcpを使う場合:**

```json
{
  "mcpServers": {
    "google_workspace": {
      "command": "uvx",
      "args": ["workspace-mcp"],
      "env": {
        "GOOGLE_OAUTH_CLIENT_ID": "あなたのクライアントID.apps.googleusercontent.com",
        "GOOGLE_OAUTH_CLIENT_SECRET": "あなたのクライアントシークレット"
      }
    }
  }
}
```

**@modelcontextprotocol/server-gdriveを使う場合（DriveとSheetsの読み取りのみ）:**

```json
{
  "mcpServers": {
    "gdrive": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-gdrive"],
      "env": {
        "GDRIVE_CREDENTIALS_PATH": "/path/to/.gdrive-server-credentials.json"
      }
    }
  }
}
```

設定ファイル内のクライアントIDやシークレットは、Google Cloud Consoleで取得した値に置き換えてください。
設定後、Claude Desktopを再起動するとAIとGoogleサービスの連携が有効になります。

初回起動時にブラウザーが開き、Googleアカウントの認可画面が表示されます。「許可」をクリックして認証を完了してください。

## 活用パターン

活用パターンとは、MCP × Google Workspace連携で実務に使える代表的な操作の型のことです。AIとGoogle Workspaceの連携が完了したら、自然言語で業務を指示できます。ここでは代表的な3つのパターンと応用例を紹介します。

### パターン1: スプレッドシートのAI分析

Claude Desktopに以下のように指示するだけで、スプレッドシートのデータをAIが分析します。

```text
「売上管理」スプレッドシートの2026年1月のデータを読み取り、
以下を分析してください：
1. 商品別の売上ランキング（上位5つ）
2. 前月比の増減率
3. 今後の売上予測と改善提案
```

**期待される出力例:**

```text
「売上管理」スプレッドシートの2026年1月データを分析しました。

■ 商品別売上ランキング（上位5つ）
| 順位 | 商品名 | 売上額 | 前月比 |
|------|--------|--------|--------|
| 1 | 商品A | ¥1,250,000 | +12.3% |
| 2 | 商品B | ¥980,000 | -3.1% |
| 3 | 商品C | ¥750,000 | +25.0% |
| 4 | 商品D | ¥620,000 | +5.8% |
| 5 | 商品E | ¥410,000 | -8.2% |

■ 改善提案
- 商品Cは前月比+25%と急成長中です。在庫の積み増しを検討してください。
- 商品Eは2ヶ月連続で下落傾向です。価格戦略の見直しを検討してください。
```

GAS（Google Apps Script）でこの分析を実現するには、スクリプトの記述・集計ロジックの実装が必要です。MCP連携なら自然言語の指示だけで同等の分析が完了するため、プログラミング不要で即座に結果を得られます。

### パターン2: メール返信の下書き生成

```text
Gmailの受信トレイから「見積依頼」に関するメールを検索し、
それぞれに返信の下書きを作成してください。
丁寧な敬語で、見積書は3営業日以内に送付する旨を伝えてください。
```

**期待される出力例:**

```text
「見積依頼」に関するメールが3件見つかりました。
それぞれに下書きを作成しました。

1. 株式会社〇〇 田中様 → 下書き作成済み
2. △△商事 佐藤様 → 下書き作成済み
3. □□工業 鈴木様 → 下書き作成済み

各下書きの内容はGmailの「下書き」フォルダでご確認・編集いただけます。
```

AIが文面を生成しますが、下書きとして保存されるため送信前に内容を確認できます。顧客対応の品質を保ちながら、下書き作成の時間を大幅に短縮できるのがポイントです。

### パターン3: カレンダーとスプレッドシートの連携

```text
来週の予定をGoogleカレンダーから取得し、
「週間スケジュール」スプレッドシートに一覧として書き出してください。
```

**期待される出力例:**

```text
来週（2/16〜2/20）の予定を取得し、スプレッドシートに書き出しました。

書き出し先: 「週間スケジュール」シート1
件数: 8件の予定を転記
列構成: 日付 / 時間 / タイトル / 場所 / 参加者

スプレッドシートのリンク: [自動生成されたURL]
```

このように複数のGoogleサービスを横断する操作も、1つの自然言語指示でAIが自動処理します。従来はGASでカレンダーAPIとスプレッドシートAPIを組み合わせるコードが必要でしたが、MCP連携ならコード不要です。

### 応用: 複数サービスの横断連携

MCP × Google Workspace連携の本領は、複数のサービスを組み合わせた横断的な業務にあります。

- **複数MCPサーバーの同時接続** — `claude_desktop_config.json`にGoogle Workspace・Slack・GitHubなど複数のMCPサーバーを登録できます。AIが1つの指示で複数サービスを横断して処理します。たとえば「スプレッドシートの週次データを集計してSlackチャンネルに投稿」のような操作が自然言語で可能です
- **社内ナレッジベースの構築** — Google Driveの大量のドキュメントをAIに読み取らせ、内容をスプレッドシートに索引化できます。手動でファイルを1つずつ開いて整理する手間がなくなります
- **レポートの自動生成** — スプレッドシートの売上データをAIが分析し、Google Docsにレポートとして出力できます。月次報告書の作成時間を削減できます

## 動作確認・トラブルシューティング

動作確認とは、MCPサーバーがClaude Desktopに正しく接続され、Googleサービスと通信できる状態かを検証する作業のことです。Claude Desktopのチャット画面で入力欄の下にMCPツールのアイコン（ハンマーマーク）が表示されていれば接続成功です。

| エラー | 原因 | 解決策 |
|--------|------|--------|
| MCPサーバーが接続できない | 設定ファイルのパス誤り・JSON構文エラー | `claude_desktop_config.json`のJSON構文（カンマ・括弧の対応）を確認 |
| Google認証エラー | クライアントID/シークレットの不備 | Google Cloud Consoleで認証情報を再確認 |
| スプレッドシートが読めない | APIが未有効 | Google Cloud ConsoleでSheets APIが有効か確認 |
| 権限エラー | OAuthスコープの不足 | 認証情報のスコープを確認し、再認証を実行 |
| `uvx`コマンドが見つからない | `uv`未インストール | [uv公式サイト](https://docs.astral.sh/uv/)からインストール |

### GASとの使い分け

AIとGoogleサービスの連携方法として、MCPとGAS（Google Apps Script）はそれぞれ得意分野が異なります。

| 用途 | MCP連携 | GAS |
|------|---------|-----|
| 単発のデータ分析 | 最適（自然言語で指示） | 不要 |
| 定期実行の自動化 | 不向き | 最適（トリガー設定） |
| 複雑な加工・集計 | AI判断が必要な処理 | ルールベースの処理 |
| バッチ処理 | 不向き | 最適 |
| プログラミング不要 | はい（自然言語のみ） | いいえ（スクリプト記述が必要） |

定期実行が必要な業務は[GASスプレッドシート自動化](/articles/gas/gas-spreadsheet-automation)、AIの組み込みは[GAS × Claude API連携](/articles/gas/gas-claude-api)をご覧ください。

## まとめ・次のステップ

MCP × Google Workspace連携とは、MCPサーバーを介してClaude DesktopからGoogleサービスを自然言語で操作する仕組みです。この連携を導入すると、自然言語だけでスプレッドシート分析・メール下書き・スケジュール管理が可能になります。プログラミング不要で、中小企業の日常業務を効率化する実践的なAI活用法です。

あなたの状況に合わせて、次の記事に進んでください。

- **MCPの基本概念から学びたい** → [MCP入門｜AIと業務ツールをつなぐModel Context Protocol](/articles/ai-api/mcp-intro)
- **AI APIの全体像を把握したい** → [AI APIを業務に組み込む方法](/articles/ai-api/ai-api-overview)
- **GASで定期実行の自動化を始めたい** → [GAS入門ガイド](/articles/gas/gas-basics)
