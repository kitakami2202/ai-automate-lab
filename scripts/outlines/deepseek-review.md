# 記事ブリーフ: deepseek-review

## 基本情報

| 項目 | 内容 |
|------|------|
| slug | deepseek-review |
| primary_kw | DeepSeek 使い方 日本語 |
| secondary_kw | DeepSeek 業務, DeepSeek 安全性, DeepSeek vs ChatGPT |
| Layer | execution（Layer 2） |
| 記事タイプ | howto |
| クラスター | reviews |
| 想定文字数 | 4,000〜5,000文字 |
| ターゲット読者 | DeepSeekの話題を聞いて業務利用を検討しているが、安全性が気になる中小企業の担当者 |
| difficulty | intermediate |
| timeToRead | 15 |

## 競合分析サマリ

### 差別化ポイント

| パターン | 採用 | 根拠 |
|---------|------|------|
| データ差別化 | **採用** | セキュリティリスクの具体的データ（100%攻撃成功率、100万件流出等）を提示。競合は概要のみ |
| 実務経験差別化 | **採用** | 日本語タスク（メール・要約・コード生成）で実テストした結果を掲載 |
| 網羅性差別化 | **採用** | 性能+セキュリティ+安全な利用法の3軸で網羅。競合は性能のみ |

## 活用すべき英語リソース・統計データ

### 性能データ

| データ | 出典URL |
|--------|---------|
| V3.2-Speciale: 国際数学オリンピック金メダルレベル（35/42点）、AIME25: 97% | https://introl.com/blog/deepseek-v3-2-benchmark-dominance-china-ai-december-2025 |
| MMLU: ~88-89%（GPT-4の~87%とほぼ同等） | https://www.voiceflow.com/blog/deepseek-vs-chatgpt |
| 671Bパラメータ中37Bのみ活性化（MoEアーキテクチャ） | https://github.com/deepseek-ai/DeepSeek-V3 |
| API価格: o1の$60/M vs R1の$2.19/M（約27倍差）。Claude Opus比約100倍差 | https://intuitionlabs.ai/articles/deepseek-inference-cost-explained |
| Sebastian Raschka Technical Tour | https://magazine.sebastianraschka.com/p/technical-deepseek |
| DeepSeek-V3 Technical Report | https://arxiv.org/pdf/2412.19437 |

### セキュリティリスク（差別化の核）

| リスク | 出典URL |
|--------|---------|
| 50の有害プロンプトに対し100%攻撃成功率（全セーフティテスト不合格） | 複数セキュリティ調査 |
| 公開DBから100万件以上の機密記録流出（チャットログ・APIキー含む） | https://www.feroot.com/news/the-independent-feroot-security-uncovers-deepseeks-hidden-code-sending-user-data-to-china/ |
| イタリア・米海軍・NASAが利用禁止 | https://thehill.com/policy/technology/5126075-chinese-ai-model-raises-national-security-concerns/ |
| IAPP: データプライバシー分析 | https://iapp.org/news/a/deepseek-and-the-china-data-question-direct-collection-open-source-and-the-limits-of-extraterritorial-enforcement |
| Check Point: エンタープライズセキュリティ分析 | https://blog.checkpoint.com/artificial-intelligence/what-deepseeks-r1-model-means-for-ai-innovation-and-enterprise-security/ |

### 安全な利用方法

| リソース | URL |
|---------|-----|
| AWS Bedrock経由デプロイ | https://aws.amazon.com/blogs/aws/deepseek-r1-models-now-available-on-aws/ |
| DataRobot: Enterprise-Ready AI | https://www.datarobot.com/blog/deepseek-r1-generative-ai-applications/ |

### 日本語性能

| データ | 出典URL |
|--------|---------|
| 完全モデルは日本語OK、蒸留版(R1-7B)は大幅低下 | https://www.numberanalytics.com/blog/deekseek-multilingual-performance-comparison |
| フォーマルな日本語ビジネスの丁寧・間接トーンをよく反映 | https://www.polilingua.com/blog/post/deepseek-ai-translation-vs-chatgpt.htm |
| Artificial Analysis日本語ベンチマーク | https://artificialanalysis.ai/models/multilingual/japanese |

## 見出し構成案

### H2-1: DeepSeekとは？コスト100分の1の衝撃（800文字）
- **定義文**: 「DeepSeekとは、中国のAI企業が開発した大規模言語モデルで、GPT-4並みの性能をAPI費用約100分の1で提供します。」
- MoEアーキテクチャの簡潔な解説（671B中37B活性化）
- **表: DeepSeek vs 主要モデル 価格比較**（DeepSeek V3/R1 vs GPT-4o vs Claude Sonnet vs Gemini）
- 市場への影響（日本市場シェア3.7%）

### H2-2: 性能検証 — 日本語タスクでの実力（1,200文字）
- 検証1: ビジネスメール作成（敬語の自然さ）
- 検証2: 文章要約（正確性）
- 検証3: コード生成（GASスクリプト）
- **表: タスク別評価マトリクス**（DeepSeek vs ChatGPT vs Claude 5段階評価）
- 蒸留版(R1-7B)では日本語能力が大幅低下する注意点
- Polilingua: フォーマル日本語に強いという特性

### H2-3: セキュリティリスク — 業務利用前に知るべきこと（1,000文字）
- **表: セキュリティリスク一覧**
  - 100%攻撃成功率（セーフティテスト）
  - 100万件データ流出事故
  - イタリア・米海軍・NASA禁止
- データの送信先問題（中国サーバー）
- IAPP分析の要約
- 出典URL明記必須

### H2-4: 安全に業務利用する方法（800文字）
- **方法1**: AWS Bedrock / Azure 経由でデプロイ（データが中国に行かない）
- **方法2**: ローカルでOllama経由実行（完全オフライン）
- **方法3**: API利用時のデータ最小化（機密情報を含めない運用ルール）
- 各方法の比較表（セキュリティ/コスト/導入難易度）

### H2-5: 結論 — どんな業務なら使えるか（600文字）
- **表: 用途別判定マトリクス**
  - ◎ 社内検証・学習目的
  - ○ 非機密データの処理（要AWS/Azure経由）
  - △ 顧客データを含む業務（要厳格なガバナンス）
  - × 機密情報・個人情報の直接入力
- 最終推奨: コスト重視×非機密業務なら有力な選択肢

## FAQ案（4問）

| # | 質問 | 回答の方向性 |
|---|------|------------|
| 1 | DeepSeekは無料で使えますか？ | Web版は無料。API費用は極めて安価。具体的な料金表を提示 |
| 2 | 日本語はちゃんと使えますか？ | 完全モデルならビジネスレベルで使用可。蒸留版は品質低下する注意点 |
| 3 | ChatGPTの代わりになりますか？ | 性能はほぼ同等。セキュリティと安定性でChatGPTに軍配。コスト重視なら検討 |
| 4 | 会社で使っても大丈夫ですか？ | 直接利用はリスクあり。AWS/Azure経由なら企業セキュリティ適用可。H2-4参照 |

## 内部リンク候補

| リンク先 | 種別 | 配置場所 |
|---------|------|---------|
| reviews/llm-japanese-comparison | 同カテゴリ | H2-2 |
| ai-api/api-key-management | 別カテゴリ | H2-4 |
| ai-api/ai-api-cost-management | 別カテゴリ | H2-1 |

## ライターへの指示

1. **バランスが最重要**: 性能の高さとセキュリティリスクの両方を公平に扱う。「おすすめ」「最強」等の主観表現は根拠なしに使わない
2. **セキュリティデータは出典必須**: 攻撃成功率・流出事故・利用禁止国の情報には全てURLリンクを付ける
3. **実テスト結果を掲載**: 日本語タスク3種の実際の出力を並列表示
4. **安全な利用法を必ず提示**: リスクだけ書いて終わらず、具体的な対策を提示
5. **料金情報は公式URL + 時点明記**: 「2026年2月時点」
