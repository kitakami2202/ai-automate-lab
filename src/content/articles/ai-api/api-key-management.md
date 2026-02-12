---
title: "APIキーの管理と安全な運用｜漏洩防止チェック"
description: "AI APIキー（OpenAI・Claude・Gemini）のセキュリティ対策を解説。GASスクリプトプロパティ・環境変数・.gitignoreの設定から、漏洩時の緊急対応まで。中小企業がAPIキーを安全に運用するためのチェックリスト付き。"
category: "ai-api"
tags: ["APIキー", "セキュリティ", "GAS", "環境変数", "漏洩防止"]
publishedAt: 2026-02-12
updatedAt: 2026-02-12
author: "れん"
difficulty: "beginner"
timeToRead: 8
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "0円"
  totalTime: "PT15M"
faq:
  - question: "APIキーが漏洩するとどうなりますか？"
    answer: "第三者に不正利用され、高額なAPI利用料金が発生する可能性があります。OpenAI APIで数十万円の不正利用被害が報告された事例もあります。漏洩に気づいたら直ちにAPIキーを無効化し、新しいキーを再発行してください。"
  - question: "GASでAPIキーを安全に管理する方法は？"
    answer: "スクリプトプロパティに保管するのが基本です。「プロジェクトの設定」→「スクリプトプロパティ」にキー名と値を設定し、コード内ではPropertiesService.getScriptProperties().getProperty()で取得します。"
  - question: "環境変数と.envファイルの違いは？"
    answer: "環境変数はOSレベルで設定する値で、.envファイルはプロジェクトごとに環境変数を定義するファイルです。.envファイルはdotenvライブラリで読み込みます。どちらもコード内にAPIキーをハードコードしない目的で使用します。"
  - question: "GitHubにAPIキーをプッシュしてしまったら？"
    answer: "即座にそのAPIキーを無効化し、新しいキーを再発行してください。GitHubの履歴からも削除が必要です（git filter-branch等）。GitHubのSecret Scanning機能が有効なら、プッシュ時に自動検知されることもあります。"
relatedArticles:
  - "ai-api/ai-api-overview"
  - "ai-api/ai-api-cost-management"
  - "gas/gas-claude-api"
draft: false
---

> この記事は[AI API比較・入門ガイド](/articles/ai-api/ai-api-overview)の補足記事です。

APIキーは「パスワードと同じ」です。漏洩すると不正利用で高額請求が発生するリスクがあります。
この記事では、中小企業がAI APIキーを安全に管理するための具体的な手順とチェックリストを解説します。

| 項目 | 内容 |
|------|------|
| 対象 | AI APIを利用する中小企業の開発担当者 |
| 対象APIキー | OpenAI、Anthropic（Claude）、Google（Gemini）など |
| 所要時間 | 約15分 |
| 費用 | 0円 |
| 完成物 | 安全なAPIキー管理体制 |

## APIキー管理が重要な理由

APIキー管理とは、AI APIの認証情報（APIキー）を安全に保管し、不正アクセスを防止するための運用のことです。

| リスク | 影響 | 発生原因 |
|--------|------|---------|
| 不正利用 | 高額なAPI料金の発生 | コード内にハードコード → GitHub公開 |
| データ漏洩 | APIを通じた社内データへのアクセス | APIキーの共有管理ミス |
| サービス停止 | API利用上限の超過 | 不正利用による大量リクエスト |

## GASでのAPIキー管理

GASでのAPIキー管理とは、Google Apps Scriptのスクリプトプロパティ機能を使ってAPIキーを安全に保管する方法のことです。GASの基礎については[GASでできること完全ガイド](/articles/gas/gas-basics)をご覧ください。

### スクリプトプロパティに保管する手順

1. GASエディタの左メニューから「プロジェクトの設定」を開きます
2. 「スクリプトプロパティ」セクションで「スクリプトプロパティを追加」をクリックします
3. プロパティ名とAPIキーの値を設定します

| プロパティ名 | 値の例 |
|------------|--------|
| `ANTHROPIC_API_KEY` | `sk-ant-xxxxx` |
| `OPENAI_API_KEY` | `sk-xxxxx` |
| `DISCORD_WEBHOOK_URL` | `https://discord.com/api/webhooks/...` |

### コードからの取得方法

```javascript
// スクリプトプロパティからAPIキーを取得（推奨）
function getApiKey(keyName) {
  var key = PropertiesService.getScriptProperties().getProperty(keyName);
  if (!key) {
    throw new Error(keyName + " がスクリプトプロパティに設定されていません");
  }
  return key;
}

// 使用例
function callApi() {
  var apiKey = getApiKey("ANTHROPIC_API_KEY");

  var options = {
    method: "post",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    payload: JSON.stringify({ /* ... */ }),
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch("https://api.anthropic.com/v1/messages", options);
  return JSON.parse(response.getContentText());
}
```

**やってはいけない例:**

```javascript
// NG: コード内にAPIキーをハードコード
var API_KEY = "sk-ant-abc123xyz";  // 絶対にやらない
```

## Python / Node.jsでのAPIキー管理

ローカル開発やサーバー環境でのAPIキー管理方法です。

### .envファイル + dotenv

```text
# .env（このファイルをGitにコミットしない）
ANTHROPIC_API_KEY=sk-ant-your-api-key
OPENAI_API_KEY=sk-your-api-key
```

```python
# Python
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("ANTHROPIC_API_KEY")
```

```javascript
// Node.js
require("dotenv").config();
const apiKey = process.env.ANTHROPIC_API_KEY;
```

**Node.js 20.6以降の場合:**

Node.js 20.6以降では、dotenv（.envファイルの内容を環境変数として読み込むライブラリ）なしで.envファイルを読み込むことができます。

```bash
# dotenvライブラリ不要
node --env-file=.env app.js
```

### .gitignoreの設定

```text
# .gitignore に必ず追加
.env
.env.local
.env.production
```

`.gitignore` を設定する前に `.env` をコミットしてしまうと、Git履歴に残ります。
必ずプロジェクト作成時に `.gitignore` を先に設定してください。

## 漏洩防止セキュリティチェックリスト

APIキーを扱うすべてのプロジェクトで、以下を確認してください。

| チェック項目 | GAS | Python/Node.js |
|------------|-----|---------------|
| コード内にAPIキーがハードコードされていない | スクリプトプロパティを使用 | .envファイルを使用 |
| .envファイルが.gitignoreに含まれている | − | .gitignoreを確認 |
| APIキーにアクセスできる人を把握している | GASの共有設定を確認 | .envファイルの共有範囲を確認 |
| APIの月額利用上限を設定している | − | 各API管理画面で設定 |
| 不要なAPIキーを無効化している | − | 定期的に棚卸し |
| GitHubのpush protectionが有効になっている | − | リポジトリのSettings → Securityで確認 |

### API別の利用上限設定

| API | 設定場所 | 推奨設定 |
|-----|---------|---------|
| OpenAI | [platform.openai.com](https://platform.openai.com) → Billing → Usage limits | 月額上限を設定 |
| Anthropic | [console.anthropic.com](https://console.anthropic.com) → Plans & Billing | 月額上限を設定 |
| Google (Gemini) | [Google Cloud Console](https://console.cloud.google.com) → Quotas | 日次クォータを設定 |

※2026年2月時点の設定画面です。最新の操作方法は各公式サイトをご確認ください。

各APIの詳しい使い方は[OpenAI API入門](/articles/ai-api/openai-api-intro)・[Claude API入門](/articles/ai-api/claude-api-intro)・[Gemini API入門](/articles/ai-api/gemini-api-intro)をご覧ください。

## 漏洩時の緊急対応

万が一APIキーが漏洩した場合は、以下の手順で即座に対応してください。

1. **APIキーを即座に無効化** — 各API管理画面で該当キーを削除・無効化します
2. **新しいAPIキーを発行** — 新しいキーを生成し、スクリプトプロパティ / .env を更新します
3. **利用履歴を確認** — 不正利用がないか、APIの使用状況ダッシュボードを確認します
4. **Git履歴から削除**（該当する場合） — git-filter-repo（Gitリポジトリの履歴を安全に書き換えるツール）でコミット履歴から機密情報を除去します（`git filter-branch` は非推奨）
5. **Secret Scanning Alertsの確認** — GitHubのSecurity → Secret scanning alertsで他に漏洩がないか確認します

## まとめと次のステップ

この記事では、APIキーの安全な管理方法として、GASのスクリプトプロパティ・環境変数・.gitignoreの設定、漏洩防止チェックリスト、緊急対応手順を解説しました。
APIキーは「パスワードと同じ」です。漏洩リスクを最小化するために、今すぐチェックリストを確認してください。

### 発展的な運用

- **チーム開発** — APIキーを個人のものではなくプロジェクト共通のものにし、アクセス権限を管理
- **本番/開発環境の分離** — `.env.development` と `.env.production` でAPIキーを分離し、開発時のコスト制御と本番の安定性を両立
- **キーローテーション** — 3ヶ月ごとにAPIキーを再発行し、万が一の漏洩リスクを低減

### 関連ガイド

GASでClaude APIを呼び出す具体的な手順は[GAS × Claude API連携](/articles/gas/gas-claude-api)をご覧ください。
AI導入全体の進め方は[AI導入5ステップ](/articles/frameworks/ai-introduction-5steps)で解説しています。
APIの料金管理については[AI API料金管理ガイド](/articles/ai-api/ai-api-cost-management)も参考にしてください。
