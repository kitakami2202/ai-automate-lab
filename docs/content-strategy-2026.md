# コンテンツ戦略 2026 — 大衆評価獲得のための拡張計画

> 作成日: 2026-02-13
> 最終更新: 2026-02-13
> ステータス: Phase 1 アウトライン完了 / Phase 2・3 計画段階

## 戦略概要

### 目的
AI Automate Lab を「中小企業のAI業務自動化」日本語ナレッジベースのトップサイトに押し上げる。
既存67記事の資産を活かしつつ、2026年のトレンドキーワードを捕捉して新規流入を大幅に拡大する。

### 3フェーズ構成

| Phase | テーマ | 記事数 | 目的 | 期間目安 |
|-------|--------|--------|------|----------|
| Phase 1 | トレンド捕捉 | 8記事 | 2026年のホットキーワードで新規流入獲得 | 即時着手 |
| Phase 2 | クラスター強化 | 12記事 | 既存クラスターの内部リンク密度を上げトピック権威性を確立 | Phase 1完了後 |
| Phase 3 | 権威構築 | 10記事 | 独自データ・職種特化でリファレンスサイト化 | Phase 2完了後 |

### 競合分析サマリ

| 競合サイト | 強み | 弱み（当サイトの機会） |
|-----------|------|----------------------|
| Ledge.ai | ニュース速報、企業取材 | ハンズオンなし、コード例なし |
| WEEL | 網羅的ツールレビュー | 中小企業特化なし |
| AIsmiley | AIツールDB | 実装手順なし |
| Zenn/Qiita | エンジニア向け技術記事 | 非エンジニア向けでない |

**当サイトの差別化軸**: 「中小企業 × 実装ハンズオン × ノーコード/ローコード」

---

## Phase 1: トレンド捕捉（8記事）— アウトライン完了

全記事のアウトラインは `scripts/outlines/{slug}.md` に保存済み。
keyword-map.csv のステータスは `outlined`。
`pipeline.sh new <cat> <slug>` でT3（ライター）から実行可能。

| # | slug | タイトル | KW | cluster | 優先度 |
|---|------|---------|-----|---------|--------|
| T1 | ai-agent-intro | AIエージェントとは？中小企業が知るべき基礎と活用事例 | AIエージェント とは | frameworks | S |
| T2 | dify-intro | Difyで社内AIチャットボットを30分で作る方法 | Dify 入門 | no-code | B→S強化 |
| T3 | llm-japanese-comparison | ChatGPT vs Claude vs Gemini 日本語ライティング実力対決 | ChatGPT Claude 比較 2026 | reviews | S |
| T4 | ai-subsidy-2026 | デジタル化・AI導入補助金 2026 完全ガイド | AI導入補助金 2026 | frameworks | S |
| T5 | n8n-ai-workflow | n8n × AI連携で業務フローを自動化する方法 | n8n AI連携 | no-code | B→S強化 |
| T6 | deepseek-review | DeepSeekは業務で使えるか？実力検証レポート | DeepSeek 使い方 日本語 | reviews | S |
| T7 | ai-agent-diy | AIエージェントを自分で作る方法【Dify × n8n 実践ガイド】 | AIエージェント 作り方 | ai-api | S |
| T8 | free-ai-tools-2026 | 無料で使えるAIツール完全まとめ【2026年版・用途別】 | AIツール 無料 2026 | reviews | S |

### Phase 1 実行順序（依存関係）
```
T1（ai-agent-intro）    ← 後続 T7, C12, A1 をブロック
T2（dify-intro）         ← 後続 T7 をブロック
T3（llm-japanese-comparison） ← 独立
T4（ai-subsidy-2026）    ← 後続 A1 をブロック
T5（n8n-ai-workflow）    ← 後続 T7 をブロック
T6（deepseek-review）    ← 独立
T7（ai-agent-diy）       ← T1, T2, T5 完了後
T8（free-ai-tools-2026） ← 独立
```

推奨実行順: T1 → T2/T3/T4/T5/T6/T8（並行可） → T7

---

## Phase 2: クラスター強化（12記事）

### 新規記事（アウトライン未作成 — 要T2実行）

#### C1: dify-n8n-make-comparison
- **slug**: dify-n8n-make-comparison
- **KW**: Dify n8n Make 比較 / ワークフロー自動化 ツール比較
- **cluster**: no-code | **Layer**: entry | **type**: comparison
- **概要**: 3大ノーコードAI自動化ツールの徹底比較。「Dify = AI-first」「n8n = automation-first」「Make = integration-first」の軸で整理
- **見出し構成案**:
  - H2-1: 結論 — 用途別おすすめと3ツール基本比較表
  - H2-2: AI機能の比較（AI Agent / RAG / LLM連携）
  - H2-3: 自動化機能の比較（ノード数 / 外部連携 / トリガー）
  - H2-4: コスト・運用の比較（無料枠 / セルフホスト / 学習曲線）
  - H2-5: 用途別おすすめ判定マトリクス
- **活用リソース**:
  - Medium: Dify vs n8n比較 — https://medium.com/generative-ai-revolution-ai-native-transformation/dify-vs-n8n-which-platform-should-power-your-ai-automation-stack-in-2025-e6d971f313a5
  - API2O: Dify vs n8n vs Flowise — https://www.api2o.com/en/blog/lowcode-platform-compare-dify-n8n-flowise
  - n8n公式: AI機能一覧 — https://n8n.io/workflows/categories/ai/
  - Dify Marketplace — https://marketplace.dify.ai/
- **依存**: T2（dify-intro）, T5（n8n-ai-workflow）完了後
- **内部リンク**: no-code/dify-intro, no-code/n8n-ai-workflow, no-code/zapier-vs-make

#### C3: ai-freelance-recipes
- **slug**: ai-freelance-recipes
- **KW**: AI フリーランス 効率化 / 個人事業主 AI活用
- **cluster**: frameworks | **Layer**: entry | **type**: framework
- **概要**: フリーランス・個人事業主向けAI業務効率化レシピ10選。請求書、スケジュール管理、営業メール等の実践的自動化を紹介
- **見出し構成案**:
  - H2-1: フリーランスがAIで自動化すべき業務TOP5
  - H2-2: レシピ1-3（事務系: 請求書・経費・スケジュール管理）
  - H2-3: レシピ4-6（営業系: 提案書・メール・リサーチ）
  - H2-4: レシピ7-10（制作系: ライティング・デザイン・コード・翻訳）
  - H2-5: 月額コストシミュレーション
- **活用リソース**:
  - Upwork統計: AIスキルのあるフリーランスは収入30%増
  - Zapier: Best AI Productivity Tools 2026 — https://zapier.com/blog/best-ai-productivity-tools/
  - colorwhistle: SMB AI統計（月20時間節約） — https://colorwhistle.com/artificial-intelligence-statistics-for-small-business/
- **内部リンク**: frameworks/where-to-automate-first, frameworks/automation-roi-template

#### C4: ai-side-hustle
- **slug**: ai-side-hustle
- **KW**: AI副業 月5万 / AI 副業 始め方 2026
- **cluster**: frameworks | **Layer**: entry | **type**: framework
- **概要**: AIツールを活用した副業で月5万円を目指す実践ガイド。収益化までのロードマップと実データ
- **見出し構成案**:
  - H2-1: AI副業の5つの稼ぎ方（2026年版）
  - H2-2: 即収益化しやすいAI副業TOP3（ライティング/画像生成/コーディング）
  - H2-3: 月5万円達成のロードマップ（Week 1-4）
  - H2-4: 必要なツールとコスト
  - H2-5: 注意点とリスク管理
- **活用リソース**:
  - AI Money Hunter / HustleGPT 事例
  - GitHub: awesome-ai-tools（無料ツールリスト） — https://github.com/mahseema/awesome-ai-tools
- **内部リンク**: reviews/free-ai-tools-2026, reviews/ai-coding-tools-comparison

#### C12: multi-agent-intro
- **slug**: multi-agent-intro
- **KW**: マルチエージェント とは / AIエージェント 連携
- **cluster**: ai-api | **Layer**: execution | **type**: howto
- **概要**: 複数のAIエージェントが協調してタスクを処理するマルチエージェントシステムの入門。CrewAI/LangGraphの概要とDify/n8nでの実装ヒント
- **見出し構成案**:
  - H2-1: マルチエージェントとは（シングル vs マルチの違い）
  - H2-2: 主要フレームワーク比較（CrewAI / LangGraph / AutoGen）
  - H2-3: n8nでマルチエージェント的ワークフローを構築
  - H2-4: 実務での活用シーン（レポート生成・カスタマーサポート・コードレビュー）
  - H2-5: コストと制御の注意点
- **活用リソース**:
  - Google Cloud: Agentic AI Design Patterns — https://cloud.google.com/architecture/agentic-ai-overview
  - Microsoft: AI Agent Orchestration Patterns — https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns
  - FareedKhan-dev/all-agentic-architectures（17種の図解） — https://github.com/FareedKhan-dev/all-agentic-architectures
  - Product Compass: AI Agent Architectures — https://www.productcompass.pm/p/ai-agent-architectures
  - LangChain: Plan-and-Execute Agents — https://blog.langchain.com/planning-agents/
- **依存**: T1（ai-agent-intro）, T7（ai-agent-diy）完了後
- **内部リンク**: frameworks/ai-agent-intro, ai-api/ai-agent-diy

### 既存記事の強化・リライト（8記事）

以下の記事は既にreviewedステータスだが、Phase 2でクラスター内部リンクを強化するためにリライト対象とする。
`pipeline.sh refine <cat> <slug>` で TR1→TR2 リファインパイプラインを実行。

| # | slug | 強化ポイント |
|---|------|------------|
| C2 | ai-meeting-minutes | AI議事録自動化の最新ツール（Otter.ai/Fireflies）追加、n8n連携例 |
| C5 | ai-email-triage | GAS+Claude APIによるメール自動分類の実装コード更新 |
| C6 | ai-invoice | AI-OCR最新精度データ追加、補助金情報（T4）へのリンク |
| C7 | prompt-engineering-business | 2026年のプロンプト設計トレンド追加、エージェント向けプロンプト |
| C8 | mcp-intro | MCP最新仕様・対応ツール更新、エージェント連携への導線 |
| C9 | claude-code-automation | Claude Opus 4/Sonnet 4対応、新機能（hooks等）追加 |
| C10 | ai-customer-support | Difyチャットボット構築へのリンク強化、最新比較データ |
| C11 | ai-coding-non-engineer | 2026年のAIコーディングツール最新情報、Codex/Claude Code追加 |

---

## Phase 3: 権威構築（10記事）

### 新規記事（アウトライン未作成 — 要T2実行）

#### A1: ai-adoption-roadmap-2026
- **slug**: ai-adoption-roadmap-2026
- **KW**: 中小企業 AI導入 2026 / AI DX 中小企業 2026
- **cluster**: frameworks | **Layer**: entry | **type**: pillar
- **概要**: 2026年版の中小企業AI導入完全ロードマップ。McKinsey/Deloitte/OECDの最新データに基づく戦略的ガイド
- **見出し構成案**:
  - H2-1: 2026年AI導入の全体像（最新統計と市場動向）
  - H2-2: 導入ロードマップ（3ヶ月/6ヶ月/12ヶ月プラン）
  - H2-3: フェーズ別おすすめツールと予算
  - H2-4: 成功企業と失敗企業の違い（データ付き）
  - H2-5: 補助金・支援制度の活用
- **活用リソース**:
  - McKinsey State of AI 2025 — https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai
  - Deloitte State of AI 2026 — https://www.deloitte.com/us/en/what-we-do/capabilities/applied-artificial-intelligence/content/state-of-ai-in-the-enterprise.html
  - OECD AI adoption by SMEs — https://www.oecd.org/en/publications/2025/12/ai-adoption-by-small-and-medium-sized-enterprises_9c48eae6.html
  - Gartner: 40%のエンタープライズアプリにAIエージェント搭載予測 — https://www.gartner.com/en/newsroom/press-releases/2025-08-26-gartner-predicts-40-percent-of-enterprise-apps-will-feature-task-specific-ai-agents-by-2026-up-from-less-than-5-percent-in-2025
- **依存**: T1（ai-agent-intro）, T4（ai-subsidy-2026）完了後
- **内部リンク**: frameworks/ai-agent-intro, frameworks/ai-subsidy-2026, frameworks/ai-introduction-5steps

#### A3: ai-for-professionals
- **slug**: ai-for-professionals
- **KW**: 税理士 AI 効率化 / 士業 AI活用
- **cluster**: frameworks | **Layer**: entry | **type**: framework
- **概要**: 税理士・弁護士・社労士等の士業向けAI業務効率化ガイド。大手メディア未カバーのニッチ領域
- **見出し構成案**:
  - H2-1: 士業とAIの現状（導入率データ）
  - H2-2: 税理士向けAI活用3選（仕訳分類・申告書チェック・クライアント対応）
  - H2-3: 弁護士向けAI活用3選（判例検索・契約書レビュー・リサーチ）
  - H2-4: 社労士・行政書士向けAI活用
  - H2-5: 士業のAI導入注意点（守秘義務・精度検証）
- **活用リソース**:
  - Aalpha: AI Agents for Small Businesses — https://www.aalpha.net/blog/ai-agents-for-small-businesses/
  - Harvard Business School: AIユーザーはタスク25.1%速く完了、品質40%以上向上
- **内部リンク**: frameworks/ai-introduction-5steps, ai-api/ai-coding-non-engineer

#### A4: ai-for-ecommerce
- **slug**: ai-for-ecommerce
- **KW**: EC AI 自動化 / ネットショップ AI活用
- **cluster**: frameworks | **Layer**: entry | **type**: framework
- **概要**: ECサイト運営者向けAI自動化ガイド。商品登録・価格最適化・カスタマーサポート・在庫管理の自動化
- **見出し構成案**:
  - H2-1: EC業務でAI自動化すべき5領域
  - H2-2: 商品登録の自動化（説明文生成・画像処理）
  - H2-3: カスタマーサポートの自動化（Difyチャットボット）
  - H2-4: マーケティングの自動化（メール・SNS・広告最適化）
  - H2-5: 導入ステップとコスト試算
- **活用リソース**:
  - EC小売業者事例: カート単価15%増、顧客維持率12%改善、45日でROI回収 — https://doneforyou.com/case-study-small-businesses-winning-ai-tools-2025/
  - colorwhistle: 中小企業AI統計 — https://colorwhistle.com/artificial-intelligence-statistics-for-small-business/
- **内部リンク**: no-code/dify-intro, frameworks/automation-roi-template

#### A5: ai-business-email
- **slug**: ai-business-email
- **KW**: AI ビジネスメール 日本語 / AI 敬語 チェック
- **cluster**: ai-api | **Layer**: execution | **type**: howto
- **概要**: AIを使った日本語ビジネスメール作成・敬語チェック・テンプレート生成の実践ガイド。日本語特化の差別化記事
- **見出し構成案**:
  - H2-1: AIビジネスメール作成の基本（プロンプト設計）
  - H2-2: 敬語チェック・修正の実践（ChatGPT/Claude比較）
  - H2-3: テンプレート10選（お詫び/依頼/催促/お礼等）
  - H2-4: GASで自動化する方法
  - H2-5: 注意点（AIの敬語ミスパターン）
- **活用リソース**:
  - Polilingua: DeepSeekは日本語ビジネスの丁寧・間接トーンをよく反映 — https://www.polilingua.com/blog/post/deepseek-ai-translation-vs-chatgpt.htm
  - Type.ai: Claude vs ChatGPT ライティング比較 — https://blog.type.ai/post/claude-vs-gpt
- **内部リンク**: reviews/llm-japanese-comparison, gas/gas-mail-automation

#### A6: power-automate-intro
- **slug**: power-automate-intro
- **KW**: Power Automate 入門 / Microsoft 365 自動化
- **cluster**: no-code | **Layer**: execution | **type**: howto
- **概要**: Microsoft 365ユーザー向けPower Automate入門。既存M365環境を活かしたAI自動化
- **見出し構成案**:
  - H2-1: Power Automateとは？M365ユーザーの強い味方
  - H2-2: 環境準備（ライセンス確認・初期設定）
  - H2-3: 実践 — メール添付ファイルの自動整理フロー
  - H2-4: AI Builder連携（文書分類・テキスト抽出）
  - H2-5: n8n/Makeとの使い分け
- **内部リンク**: no-code/no-code-overview, no-code/zapier-vs-make

#### A7: rag-intro
- **slug**: rag-intro
- **KW**: RAG とは / 社内文書 AI 検索
- **cluster**: ai-api | **Layer**: entry | **type**: howto
- **概要**: RAG（Retrieval-Augmented Generation）の仕組みと、Difyを使った社内文書AI検索の構築方法
- **見出し構成案**:
  - H2-1: RAGとは？社内文書をAIに活用する仕組み
  - H2-2: RAGのアーキテクチャ（ベクトルDB/Embeddings/LLM）
  - H2-3: Difyでナレッジベースを構築する手順
  - H2-4: 精度を上げるチューニング（チャンク分割・メタデータ）
  - H2-5: 運用コストと注意点
- **活用リソース**:
  - Dify Blog: Knowledge Pipeline — https://dify.ai/blog/introducing-knowledge-pipeline
  - Dify Blog: Agentic RAG — https://dify.ai/blog/agentic-rag-smarter-retrieval-with-autonomous-reasoning
  - Milvus: 10分RAGアシスタント — https://milvus.io/blog/hands-on-tutorial-build-rag-power-document-assistant-in-10-minutes-with-dify-and-milvus.md
- **内部リンク**: no-code/dify-intro, ai-api/ai-agent-diy

#### A8: ai-roi-visualization
- **slug**: ai-roi-visualization
- **KW**: AI 費用対効果 / AI ROI 計算
- **cluster**: frameworks | **Layer**: entry | **type**: framework
- **概要**: AI導入の費用対効果を経営者に説明するための可視化ガイド。OSSのROI計算ツールを紹介
- **見出し構成案**:
  - H2-1: なぜAI導入のROI可視化が重要か
  - H2-2: ROI計算の4つの軸（時間削減/コスト削減/品質向上/売上増）
  - H2-3: AI ROI Calculator（GitHub OSS）の使い方
  - H2-4: 経営層向けレポートの作り方
  - H2-5: 業種別ROI目安データ
- **活用リソース**:
  - AI ROI Calculator（OSS） — https://github.com/denisatlan/ai-roi-calculator
  - DX ROI Calculator — https://getdx.com/blog/ai-roi-calculator/
  - AI投資1ドルあたり$3.50-$4.00リターン（業界調査）
  - Harvard: 25.1%速くタスク完了、品質40%以上向上
  - GitHub Copilot: 55%速くコーディング
- **内部リンク**: frameworks/automation-roi-template, frameworks/ai-subsidy-2026

#### A9: agentic-automation-intro
- **slug**: agentic-automation-intro
- **KW**: エージェンティックオートメーション / agentic automation とは
- **cluster**: frameworks | **Layer**: entry | **type**: framework
- **概要**: 2026年のバズワード「エージェンティックオートメーション」の解説。従来RPAとの違い、Gartner/UiPathのビジョン
- **見出し構成案**:
  - H2-1: エージェンティックオートメーションとは（定義と背景）
  - H2-2: 従来のRPA/自動化との違い（比較表）
  - H2-3: 3つの構成要素（AI Agent + Workflow + 判断力）
  - H2-4: 中小企業での活用シナリオ
  - H2-5: 導入のタイムライン（2026-2028年予測）
- **活用リソース**:
  - Gartner: 40%エンタープライズアプリ予測 — https://www.gartner.com/en/newsroom/press-releases/2025-08-26-gartner-predicts-40-percent-of-enterprise-apps-will-feature-task-specific-ai-agents-by-2026-up-from-less-than-5-percent-in-2025
  - Gartner: 40%以上のプロジェクト中止予測 — https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027
  - Arcade: 平均ROI 171% — https://blog.arcade.dev/agentic-framework-adoption-trends
  - Multimodal: 85%の組織がAIエージェント統合 — https://www.multimodal.dev/post/agentic-ai-statistics
  - UiPath: エージェンティックオートメーションのビジョン（公式サイト参照）
  - ML Mastery: エージェンティックAI入門（参照）
- **依存**: T1（ai-agent-intro）完了後
- **内部リンク**: frameworks/ai-agent-intro, ai-api/ai-agent-diy

#### A10: generative-ai-divide
- **slug**: generative-ai-divide
- **KW**: 生成AI 導入 効果 / AI格差 2026
- **cluster**: frameworks | **Layer**: entry | **type**: framework
- **概要**: 生成AI導入企業と未導入企業の格差データを提示し、経営者の危機感を喚起するデータドリブン記事
- **見出し構成案**:
  - H2-1: 2026年の生成AI市場 — 二極化の実態
  - H2-2: データで見る「AI格差」（導入企業 vs 未導入企業）
  - H2-3: 中小企業のAI導入率（日本 vs 海外比較）
  - H2-4: 今から始める3つの最小アクション
  - H2-5: 活用できる支援制度
- **活用リソース**:
  - OECD: 大企業52% vs 小企業17.4%のAI導入格差 — https://www.oecd.org/en/publications/2025/12/ai-adoption-by-small-and-medium-sized-enterprises_9c48eae6.html
  - McKinsey State of AI: AI採用企業の収益成長率が非採用企業の2.5倍 — https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai
  - JBPress/日経: 日本のAI導入遅れデータ
  - Warmly: AIエージェント市場$10.9B — https://www.warmly.ai/p/blog/ai-agents-statistics
- **依存**: A1（ai-adoption-roadmap-2026）完了後
- **内部リンク**: frameworks/ai-adoption-roadmap-2026, frameworks/ai-subsidy-2026

### 既存記事の強化（1記事）

| # | slug | 強化ポイント |
|---|------|------------|
| A2 | ai-business-overview | AI自動化業務一覧を2026年版に更新。エージェント活用事例追加、30選→40選に拡充 |

---

## Phase 2/3 実行順序（依存関係）

```
Phase 2:
  C1（dify-n8n-make-comparison）← T2, T5 完了後
  C2（ai-meeting-minutes）     ← 独立（リファイン）
  C3（ai-freelance-recipes）   ← 独立
  C4（ai-side-hustle）         ← 独立
  C5〜C11                      ← 独立（リファイン）
  C12（multi-agent-intro）     ← T1, T7 完了後

Phase 3:
  A1（ai-adoption-roadmap-2026）← T1, T4 完了後
  A2（ai-business-overview）   ← 独立（リファイン）
  A3（ai-for-professionals）   ← 独立
  A4（ai-for-ecommerce）       ← 独立
  A5（ai-business-email）      ← T3 完了後（比較データ参照）
  A6（power-automate-intro）   ← 独立
  A7（rag-intro）              ← T2 完了後（Dify前提知識）
  A8（ai-roi-visualization）   ← 独立
  A9（agentic-automation-intro）← T1 完了後
  A10（generative-ai-divide）  ← A1 完了後
```

---

## 英語リソース・統計データ リポジトリ

### 統計データ（全フェーズ共通）

| カテゴリ | データ | 出典 |
|---------|--------|------|
| 市場規模 | AIエージェント市場: 2026年$10.9B（前年$7.6Bから急成長） | https://www.warmly.ai/p/blog/ai-agents-statistics |
| 普及予測 | エンタープライズアプリの40%がAIエージェント搭載（2025年は5%未満） | Gartner 2025-08 |
| ROI | AIエージェント平均ROI 171%（従来自動化の3倍） | https://blog.arcade.dev/agentic-framework-adoption-trends |
| 失敗率 | 40%以上のエージェンティックAIプロジェクトが2027年末までに中止 | Gartner 2025-06 |
| 普及率 | 85%の組織が少なくとも1つのワークフローにAIエージェントを統合 | https://www.multimodal.dev/post/agentic-ai-statistics |
| AI格差 | 大企業52% vs 小企業17.4%のAI導入率（OECD） | OECD 2025-12 |
| 生産性 | AIユーザーはタスク25.1%速く完了、品質40%以上向上 | Harvard Business School |
| コーディング | GitHub Copilot利用者は55%速くコーディング | https://getdx.com/blog/ai-roi-calculator/ |
| SMBコスト | 中小企業: 月20時間以上節約、月$500-$2,000コスト削減 | https://colorwhistle.com/artificial-intelligence-statistics-for-small-business/ |
| ROI倍率 | AI投資1ドルあたり$3.50-$4.00リターン | 業界調査 |
| 日本市場 | ChatGPT 64.5%, Gemini 21.5%, DeepSeek 3.7%, Claude 2.0% | MiraLabAI 2026-01 |
| EC事例 | カート単価15%増、顧客維持率12%改善、45日でROI回収 | https://doneforyou.com/case-study-small-businesses-winning-ai-tools-2025/ |
| DeepSeek | API価格: o1の$60/M vs R1の$2.19/M（約27倍差） | https://intuitionlabs.ai/articles/deepseek-inference-cost-explained |
| DeepSeekセキュリティ | 50有害プロンプトに対し100%攻撃成功率 | 複数セキュリティ調査 |
| 補助金（日本） | AI基本計画: 5年間で約1兆円の公的支援 | Japan Times 2025-12 |
| 補助金（SG） | AI税制優遇・S$10億R&D | CNBC 2026-02 |
| 補助金（EU） | Digital Europe: 81億EUR | EU Digital Strategy |
| 補助金（UK） | AI PoC Grants: £50,000-120,000 | UK Government |
| 補助金（US） | AI for Main Street Act: 395対14可決 | SBA |

### GitHub リポジトリ

| リポジトリ | Stars | 用途 | URL |
|-----------|-------|------|-----|
| langgenius/dify | 119K+ | Dify本体 | https://github.com/langgenius/dify |
| n8n-io/self-hosted-ai-starter-kit | — | Docker一発セットアップ | https://github.com/n8n-io/self-hosted-ai-starter-kit |
| oxbshw/ultimate-n8n-ai-workflows | 3,400+ | n8nワークフロー例 | https://github.com/oxbshw/ultimate-n8n-ai-workflows |
| PowerBootWS/n8n-automation-templates | 5,000+ | n8nテンプレート | https://github.com/PowerBootWS/n8n-automation-templates |
| e2b-dev/awesome-ai-agents | — | AIエージェントリスト | https://github.com/e2b-dev/awesome-ai-agents |
| ashishpatel26/500-AI-Agents-Projects | — | 業界別500事例 | https://github.com/ashishpatel26/500-AI-Agents-Projects |
| FareedKhan-dev/all-agentic-architectures | — | 17種のエージェント図解 | https://github.com/FareedKhan-dev/all-agentic-architectures |
| steven2358/awesome-generative-ai | — | 生成AIリスト | https://github.com/steven2358/awesome-generative-ai |
| mahseema/awesome-ai-tools | — | AIツールリスト | https://github.com/mahseema/awesome-ai-tools |
| coleam00/local-ai-packaged | — | Ollama+Supabase+n8n | https://github.com/coleam00/local-ai-packaged |
| yahoojapan/JGLUE | — | 日本語NLUベンチマーク | https://github.com/yahoojapan/JGLUE |
| denisatlan/ai-roi-calculator | — | ROI計算ツール | https://github.com/denisatlan/ai-roi-calculator |

### 日本語LLMベンチマーク

| リソース | URL |
|---------|-----|
| Artificial Analysis - Japanese | https://artificialanalysis.ai/models/multilingual/japanese |
| Swallow LLM Leaderboard v2（東工大） | https://swallow-llm.github.io/swallow-leaderboard-v2.en.html |
| HF Open Leaderboard for Japanese LLMs | https://huggingface.co/blog/leaderboard-japanese |
| LMSYS日本語ランキング | https://news.aibase.com/news/9522 |
| Rakuda（独立ランキング） | https://www.passaglia.jp/llm-ranking/ |
| arXiv: 35の日本語・多言語LLM分析 | https://arxiv.org/abs/2412.14471 |

### 公式ドキュメント・ブログ

| リソース | URL |
|---------|-----|
| n8n公式: AI Intro Tutorial | https://docs.n8n.io/advanced-ai/intro-tutorial/ |
| n8n公式: AI Workflow Builder | https://docs.n8n.io/advanced-ai/ai-workflow-builder/ |
| n8n Blog: Build First AI Agent | https://blog.n8n.io/how-to-build-ai-agent/ |
| n8n Blog: 15 AI Agent Examples | https://blog.n8n.io/ai-agents-examples/ |
| n8n Blog: Local LLM Guide | https://blog.n8n.io/local-llm/ |
| Dify公式: チャットボット作成 | https://docs.dify.ai/en/learn-more/use-cases/create-an-ai-chatbot-with-business-data-in-minutes |
| Dify Blog: Workflow | https://dify.ai/blog/dify-ai-workflow |
| Dify Blog: Knowledge Pipeline | https://dify.ai/blog/introducing-knowledge-pipeline |
| Dify Blog: Agent Node | https://dify.ai/blog/dify-agent-node-introduction-when-workflows-learn-autonomous-reasoning |
| Dify Blog: v1.0.0 Plugin Ecosystem | https://dify.ai/blog/dify-v1-0-building-a-vibrant-plugin-ecosystem |
| IBM: Guide to AI Agents | https://www.ibm.com/think/ai-agents |
| Google Cloud: Agentic AI Patterns | https://cloud.google.com/architecture/agentic-ai-overview |
| Microsoft: Agent Orchestration | https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns |
| AWS: DeepSeek R1 on Bedrock | https://aws.amazon.com/blogs/aws/deepseek-r1-models-now-available-on-aws/ |
| DataCamp: Local AI with Docker | https://www.datacamp.com/tutorial/local-ai |

### 価格比較ツール

| リソース | URL |
|---------|-----|
| API価格比較（全モデル） | https://intuitionlabs.ai/articles/ai-api-pricing-comparison-grok-gemini-openai-claude |
| LLM Pricing Calculator | https://llmpricingcalculator.com/ |
| Price Per Token（300+モデル） | https://pricepertoken.com/ |

---

## パイプライン実行手順

### Phase 1 新規記事の実行
```bash
# T3（ライター）から開始（T2アウトラインは完了済み）
./scripts/pipeline.sh new frameworks ai-agent-intro
./scripts/pipeline.sh new no-code dify-intro        # 既存記事の場合は refine を使用
./scripts/pipeline.sh new reviews llm-japanese-comparison
./scripts/pipeline.sh new frameworks ai-subsidy-2026
./scripts/pipeline.sh new no-code n8n-ai-workflow    # 既存記事の場合は refine を使用
./scripts/pipeline.sh new reviews deepseek-review
./scripts/pipeline.sh new ai-api ai-agent-diy
./scripts/pipeline.sh new reviews free-ai-tools-2026
```

### Phase 2/3 新規記事の実行
```bash
# まずT2（アウトライン）から開始
# Phase 2
./scripts/pipeline.sh new no-code dify-n8n-make-comparison
./scripts/pipeline.sh new frameworks ai-freelance-recipes
./scripts/pipeline.sh new frameworks ai-side-hustle
./scripts/pipeline.sh new ai-api multi-agent-intro

# Phase 3
./scripts/pipeline.sh new frameworks ai-adoption-roadmap-2026
./scripts/pipeline.sh new frameworks ai-for-professionals
./scripts/pipeline.sh new frameworks ai-for-ecommerce
./scripts/pipeline.sh new ai-api ai-business-email
./scripts/pipeline.sh new no-code power-automate-intro
./scripts/pipeline.sh new ai-api rag-intro
./scripts/pipeline.sh new frameworks ai-roi-visualization
./scripts/pipeline.sh new frameworks agentic-automation-intro
./scripts/pipeline.sh new frameworks generative-ai-divide
```

### Phase 2 既存記事のリファイン
```bash
./scripts/pipeline.sh refine frameworks ai-meeting-minutes
./scripts/pipeline.sh refine gas ai-email-triage
./scripts/pipeline.sh refine frameworks ai-invoice
./scripts/pipeline.sh refine frameworks prompt-engineering-business
./scripts/pipeline.sh refine ai-api mcp-intro
./scripts/pipeline.sh refine ai-api claude-code-automation
./scripts/pipeline.sh refine frameworks ai-customer-support
./scripts/pipeline.sh refine ai-api ai-coding-non-engineer
```

---

## 備考

- 本ドキュメントは2026年2月13日時点の調査データに基づく
- 統計データのURLは定期的に有効性を確認すること
- 補助金・価格情報は変更が頻繁なため、記事執筆時に最新データを再確認すること
- Phase 1のアウトラインファイルは `scripts/outlines/` に保存済み。Phase 2/3は本ドキュメントの情報を基にT2（outline-agent）が生成する
