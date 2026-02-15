# 記事ブリーフ: n8n-ai-workflow（Phase 1 強化版）

## 基本情報

| 項目 | 内容 |
|------|------|
| slug | n8n-ai-workflow |
| primary_kw | n8n AI連携 |
| secondary_kw | n8n LLMノード, n8n 業務フロー 自動化, n8n AI ワークフロー |
| Layer | execution（Layer 2） |
| 記事タイプ | howto |
| クラスター | no-code |
| 想定文字数 | 4,000〜5,000文字 |
| ターゲット読者 | n8nの基本を知っている or セルフホスト環境がある中小企業のIT担当者 |
| difficulty | intermediate |
| timeToRead | 20 |

## 差別化ポイント

| パターン | 採用 | 根拠 |
|---------|------|------|
| 実装コード差別化 | **採用** | 日本語のn8n×AI実践チュートリアルがほぼ存在しない |
| 最新版差別化 | **採用** | self-hosted-ai-starter-kit（Docker一発セットアップ）を紹介 |
| データ差別化 | **採用** | 5,593 AIワークフロー、70 AI専用ノードの数字で信頼性 |

## 活用すべき英語リソース

| リソース | 活用方法 | URL |
|---------|---------|-----|
| **n8n-io/self-hosted-ai-starter-kit** | Docker Composeでn8n+Ollama+Qdrant+PostgreSQL一括セットアップ。H2-2の環境構築に直接活用 | https://github.com/n8n-io/self-hosted-ai-starter-kit |
| ultimate-n8n-ai-workflows（3,400+） | 業務別ワークフロー例のピックアップ | https://github.com/oxbshw/ultimate-n8n-ai-workflows |
| PowerBootWS/n8n-automation-templates（5,000+） | CRM/財務/EC/マーケティング別テンプレート | https://github.com/PowerBootWS/n8n-automation-templates |
| n8n公式: AI Intro Tutorial | 手順の正確性裏付け | https://docs.n8n.io/advanced-ai/intro-tutorial/ |
| n8n公式: AI Workflow Builder | AIワークフロービルダーの解説 | https://docs.n8n.io/advanced-ai/ai-workflow-builder/ |
| n8n Blog: Build First AI Agent | チュートリアル+テンプレート | https://blog.n8n.io/how-to-build-ai-agent/ |
| n8n Blog: 15 AI Agent Examples | 15の実践例 | https://blog.n8n.io/ai-agents-examples/ |
| n8n Blog: Local LLM Guide | Ollama連携ガイド | https://blog.n8n.io/local-llm/ |
| Product Compass: AI Agent Architectures | n8n 5種のエージェント構成 | https://www.productcompass.pm/p/ai-agent-architectures |
| coleam00/local-ai-packaged | Ollama+Supabase+n8nオールインワン | https://github.com/coleam00/local-ai-packaged |
| DataCamp: Local AI with Docker | Docker+n8n+Qdrant+Ollamaチュートリアル | https://www.datacamp.com/tutorial/local-ai |
| n8n Community: 5,593 AI Workflows | エコシステム規模の根拠 | https://n8n.io/workflows/categories/ai/ |

### コスト効率データ
- n8nはZapier/Makeと比較して最大1000倍コスト効率が良い（ノード単位ではなく実行単位課金）
- セルフホスト版は完全無料
- 70のAI専用ノード（3ツール中最多）

## 見出し構成案

### H2-1: n8nのAI機能とは？70のAI専用ノードでできること（800文字）
- **定義文**: 「n8nのAI機能とは、70のAI専用ノードを使って業務ワークフローにLLMを組み込む仕組みです。」
- n8nのAI機能概要（LLMチェーン、AIエージェント、RAG）
- **表: n8n AI機能一覧**（LLM Chain/AI Agent/Vector Store/Embeddings等）
- 5,593 AIワークフロー、3,400+コミュニティテンプレートの数字

### H2-2: 環境構築 — Docker Composeで一発セットアップ（1,000文字）
- self-hosted-ai-starter-kitの紹介と手順
- Docker Compose実行コマンド
- 含まれるもの: n8n + Ollama + Qdrant + PostgreSQL
- ローカルLLM（Ollama）のメリット: API費用ゼロ・データ外部送信なし
- Cloud版の選択肢も併記

### H2-3: 実践 — LLMノードで問い合わせ自動分類ワークフロー（1,200文字）
- 完成イメージ: メール受信→LLMで分類→スプレッドシート記録→Slack通知
- Step 1: トリガー設定（Email or Webhook）
- Step 2: Basic LLM Chainノードの設定（モデル選択・プロンプト）
- Step 3: 条件分岐（Switch Node）
- Step 4: 出力先の接続（Google Sheets + Slack）
- Step 5: テスト実行

### H2-4: 応用 — AIエージェントワークフローの構築（600文字）
- AI Agentノードの紹介（ツール使用・自律的タスク実行）
- Product Compassの5構成パターンから代表例を紹介
- → ai-agent-diy記事へのリンク

### H2-5: 運用Tips — コスト管理とローカルLLM活用（400文字）
- **表: コスト比較**（n8n Cloud vs セルフホスト vs Zapier vs Make）
- 最大1000倍のコスト効率データ
- Ollama活用でAPI費用ゼロ運用
- → n8n-self-hosting記事へのリンク

## FAQ案（4問）

| # | 質問 | 回答の方向性 |
|---|------|------------|
| 1 | n8nは無料で使えますか？ | セルフホスト版は完全無料。Cloud版はStarter $20/月〜 |
| 2 | プログラミング知識は必要ですか？ | ビジュアルエディタで基本操作は可能。より高度な処理にはJavaScript知識が有利 |
| 3 | ローカルLLMとAPIどちらがいいですか？ | プライバシー重視→ローカル、品質重視→API。用途で使い分け |
| 4 | ZapierやMakeとの違いは？ | AI機能の充実度とコスト効率。詳細は→dify-n8n-make-comparison記事 |

## 内部リンク候補

| リンク先 | 種別 | 配置場所 |
|---------|------|---------|
| no-code/no-code-overview | 同カテゴリ（pillar） | 冒頭リンク |
| no-code/n8n-self-hosting | 同カテゴリ | H2-2, H2-5 |
| ai-api/ai-agent-diy | 別カテゴリ | H2-4 |
| no-code/zapier-vs-make | 同カテゴリ | FAQ4 |

## ライターへの指示

1. **self-hosted-ai-starter-kitが目玉**: Docker一発でローカルAI環境構築できることを強調。日本語チュートリアルがほぼ存在しない差別化ポイント
2. **実行可能なワークフロー**: H2-3のワークフローは読者がそのまま再現できるレベルの詳細さ
3. **コスト効率データを活用**: 「Zapier比最大1000倍安い」「セルフホストなら無料」を具体的に
4. **howto記事テンプレートに従う**: 完成イメージ→準備→実装→トラブルシューティング→応用
5. **GitHub公式リソースへのリンクを豊富に**: 読者が深掘りできるように
