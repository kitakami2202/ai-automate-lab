# 記事ブリーフ: gemini-api-intro（リライト）

## 基本情報

| 項目 | 内容 |
|------|------|
| slug | gemini-api-intro |
| primary_kw | Gemini API 入門 |
| secondary_kw | Gemini API 使い方, Google AI API |
| Layer | execution（Layer 2） |
| 記事タイプ | howto |
| クラスター | ai-api |
| 想定文字数 | 3,000〜5,000文字 |
| ターゲット読者 | 中小企業の事務担当者・エンジニア初学者で、Gemini APIを業務に導入したい人 |
| difficulty | beginner |
| timeToRead | 15 |
| totalTime | PT60M |
| schema.type | HowTo |
| estimatedCost | 0円（無料枠内） |

## 現状記事の課題

| 課題 | 詳細 |
|------|------|
| 文字数不足 | 約400文字。目標3,000〜5,000文字に対して10分の1以下 |
| モデル名が廃止済み | `gemini-pro`は廃止済み。`gemini-2.5-flash`等に更新必要 |
| Vision専用モデルが廃止済み | `gemini-pro-vision`は廃止済み。現行モデルは全てマルチモーダル対応 |
| SDK が旧版 | `google-generativeai`（旧SDK）は2025年11月30日に非推奨化済み。`google-genai`（新SDK）に移行必要 |
| APIキーのハードコード | `api_key="your-api-key"` が直書き。環境変数 `GOOGLE_API_KEY` を使用すべき |
| `genai.configure()` は旧API | 新SDKでは `from google import genai` → `client = genai.Client()` に変更 |
| 表が0個 | 品質ルール違反（1つ以上必須） |
| 内部リンク0本 | 品質ルール違反（3本以上必須） |
| description不足 | 約90文字。120-160文字の範囲外 |
| FAQ回答が薄い | 3個で回答が1-2文。5個に増やし各回答を充実させる |
| 副KW未使用 | 「Gemini API 使い方」「Google AI API」が本文中に未登場 |
| 料金情報に時点表記なし | 「2026年2月時点」等の時点を明記すべき |
| GAS例のモデル名が古い | REST APIのURL内の `gemini-pro` も更新必要 |
| GAS例のAPIキー管理 | `API_KEY` が未定義でハードコード前提 |
| Layer 1導線なし | Layer 2記事に必須のピラーへのリンクが冒頭にない |
| relatedArticlesに別カテゴリなし | 同カテゴリのみで構成されている |
| totalTimeが短すぎ | PT30M → PT60M に更新（環境構築含む実際の所要時間） |

## 競合分析サマリ

### 上位5記事

| # | 記事タイトル・出典 | 深さ | 鮮度 | 独自性 | 弱点 |
|---|-------------------|------|------|--------|------|
| 1 | マネーフォワード「Gemini APIの使い始め方とは？料金、無料枠、Pythonでの使い方まで解説」 | 料金体系を詳述、コード例あり | 2025年後半 | 料金・無料枠の網羅的解説 | 業務自動化ユースケースなし、GAS連携なし |
| 2 | Qiita「GeminiをPythonで使うための完全ガイド」 | マルチモーダル含む豊富なコード例 | 2025年 | テキスト・画像・音声・動画を網羅 | 旧SDK（google-generativeai）ベース、業務活用の視点なし |
| 3 | Zenn「無料で始めるGemini API入門」 | 最小限のコードで入門 | 2025年11月 | 初心者に寄り添った軽い解説 | コード量少ない、マルチモーダルなし、GASなし |
| 4 | SP「無料で使える！Google Gemini APIを使って生成AIをPythonから動かす方法」 | 環境構築からコード実行まで | 2025年 | 環境構築の手順が丁寧 | 応用例が少ない、業務自動化の文脈なし |
| 5 | Okumura Lab「Gemini APIを使う」 | 技術的に正確なコード例 | 2025年 | 新SDK対応、学術的な信頼性 | 業務ユースケースなし、初心者向けの説明が薄い |

### 必須トピック（3記事以上がカバー）
- APIキーの取得方法（Google AI Studio）
- Pythonでのインストールとセットアップ
- テキスト生成の基本コード例
- 無料枠・料金体系の説明
- 利用可能なモデルの一覧

### 差別化チャンス（1-2記事のみカバー）
- マルチモーダル機能（画像入力）の実装例（1-2記事のみ）
- 新SDK（google-genai）への対応（1記事のみ）
- 環境変数によるAPIキー管理（1-2記事のみ）
- トラブルシューティング表（ほぼゼロ）

### 独自トピック候補（どの記事もカバーなし）
- **GAS（Google Apps Script）からのREST API呼び出し** — 中小企業がすぐ使える最短経路
- **中小企業の業務自動化ユースケース**（請求書OCR、商品画像分析、問い合わせ自動分類）
- **OpenAI API・Claude APIとの料金比較表**（同サイト内の横断比較）
- **Python + GAS の2パターン並列提示** — 読者のスキルに応じて選べる構成
- **Gemini 2.0 Flash廃止予告（2026年3月31日）への対応ガイド**

## 差別化ポイント

| パターン | 採用 | 根拠 |
|---------|------|------|
| GAS連携差別化 | **採用** | 競合記事でGAS（UrlFetchApp）からGemini APIを呼ぶ実装例を入門記事に含むものは皆無。中小企業にとってGASは最もアクセスしやすい実行環境であり、「Googleアカウントだけで始められる」導線は強力 |
| 業務ユースケース差別化 | **採用** | 競合はすべて「技術入門」止まり。中小企業の具体的業務（請求書読み取り、商品画像分析、問い合わせ仕分け）に紐づけた記事はゼロ |
| 新SDK完全対応差別化 | **採用** | 多くの競合記事が旧SDK（google-generativeai）ベース。新SDK（google-genai）で全コード例を書くことで鮮度と正確性で優位に立つ |
| 2パターン構成差別化 | **採用** | Python（本格実装向け）とGAS（すぐ試したい人向け）の2ルートを提示する記事がない。読者のスキルレベルに応じた選択肢を提供 |
| 料金比較差別化 | **採用** | 同サイト内のOpenAI API・Claude API記事と横断的に比較できるのは独自の強み。Geminiの無料枠の大きさを定量的に示す |

## 見出し構成案

### H2-1: この記事で作るもの（完成イメージ）
- 完成物の概要: PythonまたはGASで「Gemini APIにテキスト・画像を送り、応答を得る」仕組みを構築
- 2つのルート提示:
  - ルートA: Python + google-genai SDK（ローカルPC or Google Colab）
  - ルートB: GAS + UrlFetchApp（Googleアカウントだけで完結）
- 業務活用イメージ: 請求書PDFの読み取り、商品画像の自動説明生成、問い合わせメールの自動分類
- 前提条件の表:

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Googleアカウント |
| 必要な知識 | Pythonの基礎（ルートAの場合）/ GASの基礎（ルートBの場合） |
| 所要時間 | 約60分（両ルート実施時） |
| 費用 | 0円（無料枠内） |
| 完成物 | テキスト生成 + 画像分析ができるスクリプト |

### H2-2: 準備・環境構築
- **Gemini API**とは、Googleが提供するマルチモーダルAIモデル（Geminiシリーズ）をプログラムから利用できるAPI（Application Programming Interface）です。テキストだけでなく、画像・音声・動画・PDFも入力でき、Google AI Studioから無料で始められます。
- H3: APIキーの取得手順
  - Google AI Studio（https://aistudio.google.com）でのAPIキー取得をスクリーンショット付きで解説
  - 環境変数 `GOOGLE_API_KEY` への設定方法（Windows / Mac / Linux）
  - GASの場合: スクリプトプロパティへの保存方法
- H3: Pythonルートの環境構築
  - `pip install google-genai` のインストール
  - 新SDKの基本構造: `from google import genai` → `client = genai.Client()`
  - 旧SDKとの違いを表で整理:

| 項目 | 旧SDK（google-generativeai） | 新SDK（google-genai） |
|------|---------------------------|---------------------|
| パッケージ名 | google-generativeai | google-genai |
| ステータス | 2025年11月非推奨化 | GA（推奨） |
| 初期化方法 | `genai.configure(api_key=...)` | `client = genai.Client()` |
| モデル指定 | `genai.GenerativeModel("...")` | `client.models.generate_content(model="...")` |
| Vertex AI対応 | 別SDK必要 | 同一SDKで対応 |

- H3: 利用可能なモデルと料金
  - 主要モデルの比較表（2026年2月時点）:

| モデル | 特徴 | 無料枠 | 有料入力単価（/100万トークン） | 推奨用途 |
|--------|------|--------|------|------|
| gemini-2.5-flash | 高速・低コスト・思考予算制御可 | 10 RPM / 250 RPD | $0.15 | 日常的なテキスト処理・分類 |
| gemini-2.5-flash-lite | 最軽量・大量処理向け | 15 RPM / 1,000 RPD | $0.075 | 大量バッチ処理 |
| gemini-2.5-pro | 高精度・複雑な推論 | 5 RPM / 50 RPD | $1.25 | 高度な分析・コード生成 |
| gemini-2.0-flash | バランス型（**2026/3/31廃止予定**） | 15 RPM / 200 RPD | $0.10 | ※移行推奨 |

  - 「詳しくは[AI APIを業務に組み込む方法](/articles/ai-api/overview)（準備中）で各社APIの料金を比較しています」
  - 料金の公式URL（https://ai.google.dev/gemini-api/docs/pricing）をリンクし、「2026年2月時点」と時点を明記

### H2-3: 実装手順
- H3: ステップ1 — テキスト生成（Python）
  - 新SDK（google-genai）を使った最小限のコード例
  - `client.models.generate_content(model="gemini-2.5-flash", contents="...")` の実装
  - 環境変数 `GOOGLE_API_KEY` からの自動読み込み
  - **このコードのポイント** 解説
- H3: ステップ2 — 画像分析・マルチモーダル（Python）
  - 画像ファイルを読み込んでGeminiに送信するコード例
  - 業務ユースケース例: 「商品画像から説明文を自動生成」「請求書PDFの内容を読み取り」
  - `types.Part.from_image()` や `types.Part.from_uri()` の使い分け
  - **このコードのポイント** 解説
- H3: ステップ3 — GASからREST APIを呼ぶ（Google Apps Script）
  - UrlFetchApp を使った Gemini API 呼び出しの完全コード
  - APIキーはスクリプトプロパティから取得（`PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY')`）
  - REST APIエンドポイント: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
  - 業務ユースケース例: 「スプレッドシートのデータをAIで要約」「Googleフォームの自由記述を自動分類」
  - GASでの画像送信例（Base64エンコード）
  - **このコードのポイント** 解説
  - 「GASの基本については[GASでできること完全ガイド](/articles/gas/gas-basics)で詳しく解説しています」

### H2-4: 動作確認・トラブルシューティング
- 動作確認の手順（期待される出力例を提示）
- よくあるエラーと解決策の表:

| エラー | 原因 | 解決策 |
|--------|------|--------|
| `API_KEY_INVALID` | APIキーが無効または未設定 | Google AI Studioで再発行し、環境変数を再設定 |
| `RESOURCE_EXHAUSTED` | 無料枠のレート制限超過 | RPM/RPDの上限を確認し、リクエスト間隔を空ける |
| `MODEL_NOT_FOUND` | 廃止モデル名を指定 | `gemini-2.5-flash` 等の現行モデルに変更 |
| `INVALID_ARGUMENT` | 画像形式が未対応 / サイズ超過 | JPEG/PNG/WebP、20MB以内に変換 |
| `ModuleNotFoundError` | 旧SDK名でimport | `pip install google-genai` → `from google import genai` |
| GAS: `Exception: Request failed` | APIエンドポイントのURL誤り | `v1beta` を確認、モデル名を最新に更新 |

### H2-5: 応用・業務活用アイデア
- 中小企業での活用シナリオ表:

| 業務シナリオ | 使用機能 | 実装方法 | 効果 |
|-------------|---------|---------|------|
| 請求書PDF読み取り → スプレッドシート転記 | マルチモーダル（PDF） | GAS + Gemini API | 手入力を80%削減 |
| 商品画像から説明文を自動生成 | マルチモーダル（画像） | Python / GAS | EC出品作業を効率化 |
| 問い合わせメールの自動分類 | テキスト分類 | GAS + Gmail | 振り分け作業を自動化 |
| 会議議事録の要約 | テキスト要約 | Python | 議事録作成時間を短縮 |
| 社内文書の検索・QA | テキスト生成 | Python | ナレッジ検索を効率化 |

- 「業務のどこから自動化すべきか迷ったら、[どこから自動化すべきか判断マトリクス](/articles/frameworks/where-to-automate-first)を参考にしてください」
- 他のAI APIとの使い分け: 「OpenAI APIについては[OpenAI API入門](/articles/ai-api/openai-api-intro)、Claude APIについては[Claude API入門](/articles/ai-api/claude-api-intro)で解説しています」
- 「AI導入の全体像は[中小企業向けAI導入5ステップ](/articles/frameworks/ai-introduction-5steps)をご覧ください」

## FAQ案（5問）

| # | 質問 | 回答の方向性 |
|---|------|------------|
| 1 | Gemini APIは無料で使えますか？ | Google AI StudioでAPIキーを取得すれば無料枠で利用可能。gemini-2.5-flash-liteなら1日1,000リクエスト、gemini-2.5-flashなら250リクエスト/日が無料。本番運用には従量課金が必要だが、中小企業の業務自動化テストには十分な枠。料金ページ（公式URL）をリンクし「2026年2月時点」と明記 |
| 2 | google-generativeai と google-genai の違いは？どちらを使うべき？ | google-generativeai は旧SDKで2025年11月に非推奨化済み。google-genai が新しい公式SDK（GA）で、Gemini API・Vertex AIの両方に対応。新規開発は必ず google-genai を使用すべき。移行ガイド（公式URL）をリンク |
| 3 | GAS（Google Apps Script）からGemini APIを使えますか？ | UrlFetchApp でREST APIを直接呼び出せる。SDKのインストール不要でGoogleアカウントだけで始められるのが強み。APIキーはスクリプトプロパティで安全に管理。本記事のステップ3で実装例を掲載 |
| 4 | Gemini APIのマルチモーダル機能でどんな業務を自動化できますか？ | 請求書PDFの読み取り・データ抽出、商品画像からの説明文生成、名刺のデジタル化など。テキスト・画像・PDF・音声・動画を入力可能。中小企業では特に紙書類のデジタル化で効果が大きい |
| 5 | GeminiとChatGPT（OpenAI）、Claude（Anthropic）のAPIはどう使い分ける？ | Geminiの強みは無料枠の大きさとGAS連携。ChatGPTはエコシステムの広さ、Claudeは長文処理と指示追従性。中小企業でまず試すなら無料で始められるGeminiがおすすめ。詳しくは[AI開発ツール比較](/articles/reviews/ai-dev-tools-comparison)を参照 |

## 内部リンク候補

| リンク先 | 種別 | 配置場所 | リンクテキスト例 |
|---------|------|---------|----------------|
| frameworks/ai-introduction-5steps | 別カテゴリ（Layer 1導線） | 冒頭の導線ブロック + H2-5 | 「AI導入の全体像は[中小企業向けAI導入5ステップ]で解説しています」 |
| ai-api/openai-api-intro | 同カテゴリ | H2-5 応用セクション | 「OpenAI APIについては[OpenAI API入門]で解説しています」 |
| ai-api/claude-api-intro | 同カテゴリ | H2-5 応用セクション | 「Claude APIについては[Claude API入門]で解説しています」 |
| gas/gas-basics | 別カテゴリ | H2-3 ステップ3（GAS実装時） | 「GASの基本については[GASでできること完全ガイド]で詳しく解説しています」 |
| reviews/ai-dev-tools-comparison | 別カテゴリ | FAQ-5 | 「詳しくは[AI開発ツール比較]を参照してください」 |
| frameworks/where-to-automate-first | 別カテゴリ | H2-5 | 「業務のどこから自動化すべきか迷ったら[判断マトリクス]を参考に」 |

## ライターへの指示

1. **全コードを新SDK（google-genai）で統一**: `pip install google-genai` / `from google import genai` / `client = genai.Client()` を使用。旧SDK（google-generativeai）のコードは一切使わない。旧SDKとの違いは表で比較して読者の混乱を防ぐ
2. **モデル名は `gemini-2.5-flash` を基本使用**: 2026年2月時点で最もバランスが良く無料枠も大きい。`gemini-pro` / `gemini-pro-vision` / `gemini-2.0-flash` は廃止済みまたは廃止予定のため使用禁止。モデル比較表を必ず含める
3. **Python + GAS の2パターン必須**: 読者がスキルに応じて選べるように両方のコード例を掲載。GASのコード例は UrlFetchApp + REST API で実装し、APIキーは `PropertiesService.getScriptProperties()` で取得
4. **APIキーは絶対にハードコードしない**: Pythonでは環境変数 `GOOGLE_API_KEY`（SDKが自動読み込み）、GASではスクリプトプロパティを使用。コード例内に `"your-api-key"` のような文字列を書かない
5. **中小企業の業務自動化視点を貫く**: 単なる技術チュートリアルではなく「この技術で何の業務が楽になるか」を常に示す。請求書OCR、商品画像分析、問い合わせ自動分類など具体的なシナリオを挙げる
6. **冒頭にLayer 1導線を配置**: ai-apiクラスターにはピラー記事がまだないため、`frameworks/ai-introduction-5steps`（中小企業向けAI導入5ステップ）へのリンクを冒頭に配置。形式: 「この記事はGemini APIの具体的な実装手順です。AIを業務に導入する全体像から知りたい方は[中小企業向けAI導入5ステップ](/articles/frameworks/ai-introduction-5steps)をご覧ください。」
7. **料金情報には必ず時点と公式URLを明記**: 「2026年2月時点」の表記を料金表に付与。公式料金ページ（https://ai.google.dev/gemini-api/docs/pricing）へのリンクを含める
8. **表を3つ以上含める**: 前提条件表、旧SDK vs 新SDK比較表、モデル比較表、トラブルシューティング表、業務活用シナリオ表のうち最低3つ
9. **description は120-160文字**: 例: 「Gemini APIの使い方をPythonとGASの2パターンで解説。新SDK（google-genai）対応のコード例付き。無料枠で請求書OCRや画像分析など中小企業の業務自動化を始める手順を紹介します。」（約90文字 → 拡張必要）
10. **relatedArticles の構成**: 同カテゴリ2本（ai-api/openai-api-intro, ai-api/claude-api-intro）+ 別カテゴリ1本（gas/gas-basics）を設定。ルール通り同カテゴリ2本 + 別カテゴリ1本
11. **gemini-2.0-flash 廃止予告に言及**: 2026年3月31日に廃止予定であることをモデル比較表の注記に含め、`gemini-2.5-flash-lite` への移行を推奨
12. **Gemini 3シリーズはプレビューのため参考情報に留める**: Gemini 3 FlashやGemini 3 Proはプレビュー段階のため、モデル表に「プレビュー」と明記し、本文のコード例では使用しない
