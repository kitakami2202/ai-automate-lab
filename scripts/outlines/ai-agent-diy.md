# 記事ブリーフ: ai-agent-diy

## 基本情報

| 項目 | 内容 |
|------|------|
| slug | ai-agent-diy |
| primary_kw | AIエージェント 作り方 |
| secondary_kw | AIエージェント 自作, Dify n8n エージェント, ノーコード AIエージェント |
| Layer | execution（Layer 2） |
| 記事タイプ | howto |
| クラスター | ai-api |
| 想定文字数 | 4,000〜5,000文字 |
| ターゲット読者 | ai-agent-intro（Layer 1）を読んで実際に作ってみたいと思った中小企業の担当者 |
| difficulty | intermediate |
| timeToRead | 20 |

## 前提記事
- ai-agent-intro（pillar）を読了している想定。冒頭にpillerへのリンクを配置

## 差別化ポイント

| パターン | 採用 | 根拠 |
|---------|------|------|
| 実装コード差別化 | **採用** | 日本語で「AIエージェントを実際に作る」ステップバイステップ記事がほぼ存在しない |
| 構造化差別化 | **採用** | Dify・n8nの2ツールで同じタスクを実装し比較。競合にない切り口 |
| Layer連携差別化 | **採用** | pillar(ai-agent-intro)からの自然な導線 |

## 活用すべき英語リソース

| リソース | 活用方法 | URL |
|---------|---------|-----|
| Dify Blog: Agent Node Introduction | Difyエージェントノードの解説・スクリーンショット参考 | https://dify.ai/blog/dify-agent-node-introduction-when-workflows-learn-autonomous-reasoning |
| Dify Blog: Agentic RAG | エージェントのRAG連携解説 | https://dify.ai/blog/agentic-rag-smarter-retrieval-with-autonomous-reasoning |
| n8n Blog: How To Build Your First AI Agent | 公式チュートリアル。手順の参考 | https://blog.n8n.io/how-to-build-ai-agent/ |
| n8n Build Your First AI Agent Template | テンプレートワークフロー | https://n8n.io/workflows/6270-build-your-first-ai-agent/ |
| Product Compass: AI Agent Architectures | n8n 5種のエージェント構成解説 | https://www.productcompass.pm/p/ai-agent-architectures |
| Medium: Dify vs n8n比較 | 「Dify=AI-first、n8n=automation-first」の軸 | https://medium.com/generative-ai-revolution-ai-native-transformation/dify-vs-n8n-which-platform-should-power-your-ai-automation-stack-in-2025-e6d971f313a5 |
| API2O: Dify vs n8n vs Flowise | 3ツール比較データ | https://www.api2o.com/en/blog/lowcode-platform-compare-dify-n8n-flowise |
| LangChain: Plan-and-Execute Agents | コスト効率テクニック（サブタスクに安いモデル使用） | https://blog.langchain.com/planning-agents/ |
| MindStudio: 95%のAIパイロットが失敗 | リスク注意喚起 | https://www.mindstudio.ai/blog/no-code-ai-agent-builders |

## 見出し構成案

### H2-1: AIエージェントの仕組みをおさらい（600文字）
- pillar記事(ai-agent-intro)へのリンク
- PRAループ（Perception-Reasoning-Action）の簡潔な図解
- 今回作るもの: 「社内FAQ対応エージェント」の完成イメージ

### H2-2: Difyでエージェントを作る（1,200文字）
- Step 1: Dify Cloudでアカウント作成・APIキー設定
- Step 2: Agent Nodeを使ったワークフロー構築
- Step 3: ナレッジベース（社内FAQ）の登録
- Step 4: ツール連携（Web検索、計算等）の設定
- Step 5: テスト実行と公開
- スクリーンショットまたは設定画面の説明付き

### H2-3: n8nでエージェントを作る（1,200文字）
- Step 1: n8nのセットアップ（Docker or Cloud）
- Step 2: AI Agent Nodeの設定
- Step 3: ツール接続（Google Sheets、Gmail等）
- Step 4: ワークフロートリガーの設定
- Step 5: テスト実行
- n8nのBuild Your First AI Agentテンプレートを活用

### H2-4: Dify × n8n — 得意領域と使い分け（600文字）
- **表: Dify vs n8n 比較**（AI機能/自動化機能/UI/セルフホスト/価格/おすすめ用途）
- 「Dify = AI-first（AI中心のアプリ構築）」「n8n = automation-first（既存ツールにAIを追加）」
- 組み合わせパターン: Difyでチャットbot → n8nで後続処理自動化

### H2-5: エージェントの精度を上げるTips（400文字）
- プロンプト設計のコツ3選（prompt-engineering-business記事へリンク）
- Plan-and-Executeパターン（LangChain Blog参考: サブタスクに安いモデル使用でコスト効率化）
- 95%のパイロットが失敗する原因と対策

## FAQ案（4問）

| # | 質問 | 回答の方向性 |
|---|------|------------|
| 1 | DifyとChatGPT GPTsの違いは？ | GPTsはChatGPT内で完結、Difyは独立アプリとして公開・API連携可能。自由度が違う |
| 2 | n8nは無料で使えますか？ | セルフホスト版は無料。Cloud版は月$20〜。Docker環境があれば無料で始められる |
| 3 | AIエージェントの運用コストは？ | LLM API費用が主。月数百円〜数千円程度。用途と利用量で変動 |
| 4 | もっと高度なエージェントを作るには？ | multi-agent-intro記事を案内。CrewAI/LangGraph等のフレームワーク紹介 |

## 内部リンク候補

| リンク先 | 種別 | 配置場所 |
|---------|------|---------|
| frameworks/ai-agent-intro | 別カテゴリ（pillar） | 冒頭リンク |
| no-code/dify-intro | 別カテゴリ | H2-2 |
| no-code/n8n-ai-workflow | 別カテゴリ | H2-3 |
| frameworks/prompt-engineering-business | 別カテゴリ | H2-5 |
| ai-api/multi-agent-intro | 同カテゴリ | FAQ4 |

## ライターへの指示

1. **Layer 2記事としてステップ形式**: 冒頭にpillar記事へのリンク。全体をStep形式で記述
2. **両ツールで同じタスクを実装**: 「社内FAQ対応エージェント」を題材にDify/n8n両方で作り、読者が比較できるように
3. **スクリーンショットまたは設定値の具体記述**: 読者が再現できるレベルの詳細さ
4. **コスト情報を含める**: 各ツールの無料枠・API費用の目安
5. **比較表を含める**: H2-4のDify vs n8n比較表は必須
