# 記事ブリーフ: dify-intro（Phase 1 強化版）

## 基本情報

| 項目 | 内容 |
|------|------|
| slug | dify-intro |
| primary_kw | Dify 入門 |
| secondary_kw | Dify チャットボット, ノーコード AI Bot, Dify 使い方 日本語 |
| Layer | execution（Layer 2） |
| 記事タイプ | howto |
| クラスター | no-code |
| 想定文字数 | 3,000〜5,000文字 |
| ターゲット読者 | AIチャットボットを作りたい中小企業の担当者（プログラミング経験不要） |
| difficulty | beginner |
| timeToRead | 15 |

## 差別化ポイント

| パターン | 採用 | 根拠 |
|---------|------|------|
| 実装コード差別化 | **採用** | 日本語のステップバイステップDifyチュートリアルが圧倒的に不足 |
| 最新版差別化 | **採用** | Dify v1.0.0以降のプラグインアーキテクチャに対応 |
| 構造化差別化 | **採用** | 「30分で完成」の時間構成付きで再現可能 |

## 活用すべき英語リソース

| リソース | 活用方法 | URL |
|---------|---------|-----|
| Dify公式: ビジネスデータでチャットボット作成 | 手順の正確性裏付け | https://docs.dify.ai/en/learn-more/use-cases/create-an-ai-chatbot-with-business-data-in-minutes |
| Dify Blog: Introducing Workflow | ワークフロー機能の図解参考 | https://dify.ai/blog/dify-ai-workflow |
| Dify Blog: Knowledge Pipeline | RAG/ナレッジベース解説 | https://dify.ai/blog/introducing-knowledge-pipeline |
| Dify Blog: Agent Node | エージェントノード機能 | https://dify.ai/blog/dify-agent-node-introduction-when-workflows-learn-autonomous-reasoning |
| Dify Marketplace | 120+プラグインのエコシステム | https://marketplace.dify.ai/ |
| Dify 101 | 体系的学習リソース | https://dify101.com/ |
| Milvus: 10分RAGアシスタント | 上級者向けRAGチュートリアル | https://milvus.io/blog/hands-on-tutorial-build-rag-power-document-assistant-in-10-minutes-with-dify-and-milvus.md |
| Codecademy: Dify Tutorial | 権威ある教育サイトのチュートリアル | https://www.codecademy.com/article/dify-ai-tutorial |
| DataCamp: Dify Guide | デモプロジェクト付きガイド | https://www.datacamp.com/tutorial/dify |
| langgenius/dify (119K+ stars) | 信頼性の根拠 | https://github.com/langgenius/dify |
| Dify Blog: v1.0.0 Plugin Ecosystem | プラグインアーキテクチャ移行 | https://dify.ai/blog/dify-v1-0-building-a-vibrant-plugin-ecosystem |

## 見出し構成案

### H2-1: Difyとは？中小企業にとっての3つのメリット（600文字）
- **定義文**: 「Difyとは、ノーコードでAIアプリケーションを構築できるオープンソースプラットフォームです。」
- メリット: ①ノーコード ②オープンソース（119K+ stars） ③日本語対応
- **表: Dify vs ChatGPT GPTs vs n8n 簡易比較**

### H2-2: 環境準備（10分）
- Dify Cloud無料プラン登録手順
- AIモデル（OpenAI or Claude）のAPIキー設定
- スクリーンショット付きステップバイステップ

### H2-3: 社内FAQ Botを作る（15分）
- ワークフロー作成 → ナレッジベース登録 → プロンプト設定
- 実際の社内FAQ例を使ったデモ
- 回答精度を上げるチューニングのコツ
- Knowledge Pipeline機能の紹介

### H2-4: 社内展開と運用のポイント（5分）
- 共有URL / Webサイト埋め込み / API連携
- **表: 運用コスト試算**（Dify Cloud + LLM API費用の月額目安）
- → api-key-management記事へのリンク

### H2-5: 次のステップ
- 条件分岐・外部API連携の紹介
- Agent Nodeでエージェント化 → ai-agent-diy記事へ
- Dify Marketplace（120+プラグイン）の案内
- Dify 101の学習リソース紹介

## FAQ案（5問）

| # | 質問 | 回答の方向性 |
|---|------|------------|
| 1 | Difyは無料で使えますか？ | Cloud版は無料枠あり（200メッセージ/日）。セルフホストなら完全無料 |
| 2 | プログラミング知識は必要ですか？ | 不要。ドラッグ&ドロップでワークフロー構築可能 |
| 3 | ChatGPT GPTsとの違いは？ | Difyは独立アプリとして公開・API連携・複数モデル対応。GPTsはChatGPT内限定 |
| 4 | セキュリティは大丈夫ですか？ | Cloud版はSOC2準拠。機密性が高い場合はセルフホスト推奨 |
| 5 | どのAIモデルがおすすめですか？ | コスパならGPT-4o-mini、品質重視ならClaude Sonnet。用途で使い分け |

## 内部リンク候補

| リンク先 | 種別 | 配置場所 |
|---------|------|---------|
| no-code/no-code-overview | 同カテゴリ（pillar） | 冒頭リンク |
| ai-api/ai-agent-diy | 別カテゴリ | H2-5 |
| ai-api/api-key-management | 別カテゴリ | H2-4 |
| frameworks/ai-agent-intro | 別カテゴリ | H2-5 |

## ライターへの指示

1. **30分で完成を実証**: 各セクションに所要時間を明記し、読者が再現できるレベルの詳細さ
2. **スクリーンショット必須**: 各ステップの画面を添付（または設定値を具体的に記述）
3. **howto記事テンプレートに従う**: 完成イメージ→準備→実装→トラブルシューティング→応用
4. **コスト情報を含める**: Dify Cloud無料枠の制限 + LLM API費用の月額目安
5. **Dify v1.0.0以降のUI/機能に準拠**: プラグインアーキテクチャに対応した内容に
