# 記事ブリーフ: llm-japanese-comparison

## 基本情報

| 項目 | 内容 |
|------|------|
| slug | llm-japanese-comparison |
| primary_kw | ChatGPT Claude 比較 2026 |
| secondary_kw | 生成AI 比較 日本語, AI ライティング 比較, LLM 日本語 ベンチマーク |
| Layer | entry（Layer 1） |
| 記事タイプ | comparison |
| クラスター | reviews |
| 想定文字数 | 4,000〜6,000文字 |
| ターゲット読者 | どのAIを業務で使うべきか迷っている中小企業の担当者 |
| difficulty | beginner |
| timeToRead | 18 |

## 競合分析サマリ

### 差別化ポイント

| パターン | 採用 | 根拠 |
|---------|------|------|
| データ差別化 | **採用** | 日本語LLMベンチマーク（Swallow/Artificial Analysis/Rakuda）を活用。競合は主観的比較のみ |
| 実務経験差別化 | **採用** | 同一プロンプトで3モデルの出力を並列表示する「実検証」形式。競合は機能リスト型 |
| 最新版差別化 | **採用** | 2026年版の最新モデル・価格・市場シェアデータ |

## 活用すべき英語リソース・統計データ

### 日本語ベンチマーク（記事の核となるデータ）

| リソース | 活用方法 | URL |
|---------|---------|-----|
| Artificial Analysis - Japanese Language AI Models | 日本語特化ベンチマーク。品質・速度・価格を一覧比較 | https://artificialanalysis.ai/models/multilingual/japanese |
| Swallow LLM Leaderboard v2（東工大） | 6種の日本語タスクで評価。学術的権威 | https://swallow-llm.github.io/swallow-leaderboard-v2.en.html |
| HF Open Leaderboard for Japanese LLMs | LLM-jpによる日本語LLM公開ランキング | https://huggingface.co/blog/leaderboard-japanese |
| LMSYS: Gemini-1.5-Proが日本語で1位 | 人間投票ベースの日本語ランキング | https://news.aibase.com/news/9522 |
| Ranking Japanese LLMs with Rakuda | 独立した日本語LLMランキング | https://www.passaglia.jp/llm-ranking/ |
| JGLUE（Yahoo Japan + 早稲田大学） | 日本語NLU標準ベンチマーク | https://github.com/yahoojapan/JGLUE |
| arXiv: 35の日本語・多言語LLM分析 | 英語学習が日本語学術スコアを向上させるが、日本語特有知識は日本語訓練が必要 | https://arxiv.org/abs/2412.14471 |

### 市場シェア・価格データ

| データ | 出典URL |
|--------|---------|
| ChatGPT 64.5%, Gemini 21.5%, DeepSeek 3.7%, Grok 3.4%, Claude 2.0%（日本市場2026年1月） | MiraLabAI調査 |
| API価格比較表（全モデル） | https://intuitionlabs.ai/articles/ai-api-pricing-comparison-grok-gemini-openai-claude |
| LLM Pricing Calculator（読者向けツール） | https://llmpricingcalculator.com/ |
| Price Per Token（300+モデル） | https://pricepertoken.com/ |

### ベンチマークスコア

| モデル | SWE-bench | GPQA | MMLU |
|--------|-----------|------|------|
| Claude Opus 4 | 72.5% | — | — |
| Claude Sonnet 4 | 72.7% | 59.4% | — |
| GPT-4.1 | 54.6% | — | — |
| GPT-4o | — | 53.6% | ~87% |
| Gemini | 63.8% | — | — |

### ライティング比較参考

| リソース | URL |
|---------|-----|
| Type.ai: Claude vs ChatGPT vs Gemini ライティング比較 | https://blog.type.ai/post/claude-vs-gpt |
| Improvado: Claude vs ChatGPT vs Gemini vs DeepSeek | https://improvado.io/blog/claude-vs-chatgpt-vs-gemini-vs-deepseek |

## 見出し構成案

### H2-1: 結論 — 用途別おすすめと3大AIの基本スペック比較表（800文字）
- **結論ファースト**: 用途別おすすめを冒頭3行で提示
- **表: 3大AI基本スペック比較**
  - モデル名/最新バージョン/月額料金/API価格/日本語対応/最大トークン数/市場シェア
- 市場シェアデータ: ChatGPT 64.5%, Gemini 21.5%, Claude 2.0%

### H2-2: 検証1 — ビジネスメール作成（1,000文字）
- 同一プロンプトで3モデルの出力を並列表示（「取引先への納期遅延お詫びメール」等）
- **表: 評価マトリクス**（敬語の自然さ/構成力/指示忠実度 を5段階評価）
- LMSYS日本語ランキングデータを補足として引用
- Swallow Leaderboardの日本語スコアを根拠に

### H2-3: 検証2 — ブログ記事構成案の生成（1,000文字）
- SEOを意識した構成指示での出力比較
- **表: 評価マトリクス**（見出しの質/独自性/読者目線 を5段階評価）
- Artificial Analysisの品質スコアを補足データに

### H2-4: 検証3 — 長文の要約（1,000文字）
- 同一の議事録テキスト（2,000文字程度）を要約させて比較
- **表: 評価マトリクス**（正確性/簡潔さ/重要ポイント抽出 を5段階評価）
- Rakudaランキングの評価データを参照

### H2-5: 用途別おすすめと使い分けガイド（800文字）
- **表: 用途×おすすめAIマトリクス**
  - ビジネスメール→Claude / 長文分析→Gemini / 汎用→ChatGPT 等
- 中小企業の予算別プラン提案（無料枠活用/月額$20/API従量課金）
- LLM Pricing Calculator の紹介
- → 各AI API入門記事への内部リンク

## FAQ案（5問）

| # | 質問 | 回答の方向性 |
|---|------|------------|
| 1 | 日本語が一番自然なAIはどれですか？ | Geminiが日本語でLMSYS 1位。ただしタスクにより得意不得意あり |
| 2 | 無料で使うならどれがおすすめですか？ | ChatGPT無料枠が最も安定。Gemini Flash 2.0も強力。用途で使い分け |
| 3 | APIで使う場合のコストはどれくらいですか？ | 月1万文字程度なら月$1-3程度。価格比較表とCalculatorを案内 |
| 4 | 業務で使うならどれを選ぶべきですか？ | 用途別マトリクスを参照。迷ったらChatGPT Plusから始めるのが無難 |
| 5 | DeepSeekやGrokも選択肢に入りますか？ | コスト重視ならDeepSeek。ただしセキュリティリスクあり→T6記事案内 |

## 内部リンク候補

| リンク先 | 種別 | 配置場所 |
|---------|------|---------|
| ai-api/claude-api-intro | 別カテゴリ | H2-5 |
| ai-api/openai-api-intro | 別カテゴリ | H2-5 |
| ai-api/gemini-api-intro | 別カテゴリ | H2-5 |
| reviews/deepseek-review | 同カテゴリ | H2-5, FAQ5 |
| reviews/ai-coding-tools-comparison | 同カテゴリ | H2-5 |

## ライターへの指示

1. **検証データが命**: 必ず同一プロンプトで3モデルの実出力を取得し、並列表示すること。スクリーンショットまたは引用ブロックで
2. **日本語ベンチマークを積極引用**: Swallow/Artificial Analysis/LMSYSのデータを根拠として使用。「主観的」な比較にならないよう
3. **価格データは公式URLリンク必須**: 「2026年2月時点」を明記
4. **comparison記事テンプレートに従う**: H2-1で結論→H2-2〜4で検証→H2-5でまとめ
5. **表を3つ以上含める**: 基本スペック比較表 + 各検証の評価マトリクス + 用途別おすすめマトリクス
