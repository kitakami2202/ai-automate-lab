# トピッククラスター・記事戦略設計書

> 元設計書 §2, 7, 8, 9, 10, 11, 13, 15 に対応

---

## 1. ターゲット読者のレイヤー定義

| レイヤー | 読者像 | 求めている情報 | 対応する記事タイプ |
|----------|--------|----------------|-------------------|
| **Layer 1（入口）** | 非エンジニア経営者・事務担当 | 「何ができるか」「費用対効果」「どこから始めるか」 | フレームワーク系、比較系、概要系 |
| **Layer 2（実行）** | エンジニア初学者・やる気のある事務担当 | 「具体的な作り方」「コード」「手順」 | HowTo系、チュートリアル系 |

### 導線設計
```
Layer 1 記事（経営者が検索）→ 内部リンク・CTAで誘導 →
Layer 2 記事（実行者向け）→ 前提知識リンクで補完 →
Layer 1 記事（概要に戻れる導線）
```

---

## 2. トピッククラスター設計

### クラスター構造図

```
【クラスター1: GAS自動化】★最優先（実務経験◎ × 検索需要◎）
  ├── ピラー: 「GASでできること完全ガイド【業務自動化編】」(Layer 1)
  ├── クラスター:
  │   ├── GAS × スプレッドシート自動化（Layer 2・HowTo）
  │   ├── GAS × LINE Bot構築（Layer 2・HowTo）
  │   ├── GAS × Slack通知（Layer 2・HowTo）
  │   ├── GAS × メール自動化（Layer 2・HowTo）
  │   ├── GAS × Googleフォーム連携（Layer 2・HowTo）
  │   └── GAS 基礎文法まとめ（Layer 2・リファレンス）
  └── 相互リンク: 全クラスター記事 ↔ ピラー記事

【クラスター2: Discord Bot】★優先（実務経験◎ × ニッチで勝ちやすい）
  ├── ピラー: 「Discord Bot 業務活用ガイド【非エンジニア向け】」(Layer 1)
  ├── クラスター:
  │   ├── Discord Bot × GAS構築（Layer 2・HowTo）
  │   ├── スラッシュコマンド実装（Layer 2・HowTo）
  │   ├── スプレッドシートDB連携（Layer 2・HowTo）
  │   ├── 定時通知Bot構築（Layer 2・HowTo）
  │   └── Discord Bot vs LINE Bot 比較（Layer 1・比較）
  └── カテゴリ横断リンク → GASクラスターへ

【クラスター3: 導入フレームワーク】★初期に必須（Layer 1の入口になる）
  ├── ピラー: 「中小企業のAI業務自動化 完全ロードマップ」(Layer 1)
  ├── クラスター:
  │   ├── 自動化ROI計算テンプレート（Layer 1・FW）
  │   ├── どこから自動化すべきか判断マトリクス（Layer 1・FW）
  │   ├── AI導入5ステップ（Layer 1・FW）
  │   ├── ツール選定ガイド（Layer 1・比較）
  │   └── 自動化失敗パターンと対策（Layer 1・ケーススタディ）
  └── カテゴリ横断リンク → GAS・Discord・ノーコード各クラスターへ

【クラスター4: ノーコード/ローコード】（優先度中）
  ├── ピラー: 「ノーコード自動化ツール徹底比較【2026年版】」(Layer 1)
  └── クラスター: Zapier vs Make / n8n自己ホスティング / 選定マトリクス

【クラスター5: AI API連携】（優先度低 - 実務経験の補強後に）
  ├── ピラー: 「AI APIを業務に組み込む方法【入門編】」(Layer 1)
  └── ※実務で使い込んでから書く方が一次情報の質が上がる

【クラスター6: レビュー/比較】（横断的・随時追加）
```

### カテゴリ横断リンクマップ
```
フレームワーク（入口）→ GAS自動化 / Discord Bot / ノーコード / AI API
GAS自動化 ←→ Discord Bot（GAS共通の技術）
ノーコード ←→ フレームワーク（ツール選定の文脈）
AI API ←→ GAS自動化（GAS × AI API連携記事）
```

---

## 3. サイト構造（URL設計）

```
/articles/gas/gas-basics           GASとは？★ピラー
/articles/gas/gas-spreadsheet      GAS × スプレッドシート自動化
/articles/gas/gas-line-bot         GAS × LINE Bot構築
/articles/gas/gas-slack            GAS × Slack通知
/articles/gas/gas-mail             GAS × メール自動化
/articles/gas/gas-form             GAS × Googleフォーム連携
/articles/gas/gas-syntax           GAS 基礎文法まとめ

/articles/discord-bot/overview     Discord Bot業務活用ガイド ★ピラー
/articles/discord-bot/gas          Discord Botの作り方（GAS編）
/articles/discord-bot/slash-cmd    スラッシュコマンド実装ガイド
/articles/discord-bot/spreadsheet  スプレッドシートをDBとして使う
/articles/discord-bot/scheduler    定時通知Botの構築
/articles/discord-bot/vs-line-bot  Discord Bot vs LINE Bot 比較

/articles/frameworks/roadmap       AI業務自動化 完全ロードマップ ★ピラー
/articles/frameworks/roi           業務自動化のROI計算テンプレート
/articles/frameworks/where-first   どこから自動化すべきか判断FW
/articles/frameworks/5steps        中小企業向けAI導入5ステップ
/articles/frameworks/tool-select   ツール選定ガイド
/articles/frameworks/failure       自動化失敗パターンと対策

/articles/no-code/overview         ノーコード自動化ツール徹底比較 ★ピラー
/articles/no-code/zapier-vs-make   Zapier vs Make 比較
/articles/no-code/n8n              n8n 自己ホスティングガイド
/articles/no-code/tool-matrix      ノーコードツール選定マトリクス

/articles/ai-api/overview          AI APIを業務に組み込む方法 ★ピラー
/articles/ai-api/claude            Claude API入門
/articles/ai-api/openai            OpenAI API入門
/articles/ai-api/gemini            Gemini API入門
/articles/ai-api/key-management    APIキーの管理と安全な運用

/articles/reviews/dev-tools        AI開発ツール比較
/articles/reviews/automation-tools 自動化ツール比較表

/category/[category]               カテゴリ一覧ページ
/glossary                          用語集
/about                             About・問い合わせ
```

---

## 4. 内部リンク戦略

### リンク本数のルール

| リンク種別 | 本数 | 配置場所 |
|-----------|------|----------|
| ピラー → クラスター | クラスター記事全件 | 各セクション末尾 |
| クラスター → ピラー | 必ず1本 | 冒頭「はじめに」or 末尾「まとめ」 |
| クラスター ↔ クラスター（同カテゴリ） | 2-3本 | 本文中の関連箇所に自然に埋め込み |
| カテゴリ横断リンク | 1-2本 | 本文中 or 「関連記事」セクション |
| Layer 1 → Layer 2 誘導 | 1-2本 | 記事末尾のCTA |
| Layer 2 → Layer 1 誘導 | 1本 | 冒頭の「前提知識」リンク |

### frontmatter `relatedArticles` 運用ルール
- **同カテゴリから2本 + 別カテゴリから1本**を基本
- ピラー記事は必ず含める

---

## 5. 記事優先順位

### 初期10記事の執筆順

| # | slug | title（案） | Layer | Type | cluster |
|---|------|------------|-------|------|---------|
| 1 | automation-roadmap | 中小企業のAI業務自動化 完全ロードマップ | entry | pillar | frameworks |
| 2 | automation-roi | 自動化ROI計算テンプレート | entry | framework | frameworks |
| 3 | automation-where-to-start | どこから自動化すべきか？判断マトリクス | entry | framework | frameworks |
| 4 | gas-guide | GASでできること完全ガイド | entry | pillar | gas |
| 5 | gas-spreadsheet | GAS × スプレッドシート自動化 | execution | howto | gas |
| 6 | gas-line-bot | GAS × LINE Bot 作り方 | execution | howto | gas |
| 7 | discord-bot-guide | Discord Bot 業務活用ガイド | entry | pillar | discord-bot |
| 8 | discord-bot-gas | Discord Bot × GAS連携 | execution | howto | discord-bot |
| 9 | ai-adoption-5steps | AI導入5ステップ | entry | framework | frameworks |
| 10 | gas-slack-notify | GAS × Slack通知 | execution | howto | gas |

### 内部リンク設計図（初期10記事）
```
[#1 ロードマップ]（FWピラー）
  ├─→ [#2 ROI計算]
  ├─→ [#3 判断マトリクス]
  ├─→ [#4 GASガイド]（GASピラー）
  │     ├─→ [#5 スプシ自動化]
  │     ├─→ [#6 LINE Bot]
  │     └─→ [#10 Slack通知]
  ├─→ [#7 Discord活用]（Discordピラー）
  │     └─→ [#8 Discord×GAS]
  └─→ [#9 AI導入5ステップ]
```

### keyword-map.csv 初期データ

```csv
slug,primary_kw,secondary_kw,layer,article_type,cluster,priority,status,notes
automation-roadmap,中小企業 AI 業務自動化,"業務効率化 AI,自動化 始め方",entry,pillar,frameworks,S,approved,全記事の入口ピラー
automation-roi,自動化 ROI 計算,"費用対効果 自動化,ROI テンプレート",entry,framework,frameworks,S,approved,#1から誘導
automation-where-to-start,業務自動化 何から,"自動化 優先順位,どこから 自動化",entry,framework,frameworks,S,approved,#1から誘導
gas-guide,GAS できること,"Google Apps Script 入門,GAS 業務自動化",entry,pillar,gas,S,approved,GASクラスターのピラー
gas-spreadsheet,GAS スプレッドシート 自動化,"GAS 日報 自動化,GAS 集計",execution,howto,gas,S,approved,#4のクラスター
gas-line-bot,GAS LINE Bot 作り方,"GAS LINE 通知,LINE Bot 自動化",execution,howto,gas,S,approved,#4のクラスター
discord-bot-guide,Discord Bot 業務活用,"Discord Bot 作り方,Discord 自動化",entry,pillar,discord-bot,S,approved,Discordクラスターのピラー
discord-bot-gas,Discord Bot GAS 連携,"Discord 通知 自動化,Discord スプレッドシート",execution,howto,discord-bot,S,approved,#7のクラスター
ai-adoption-5steps,AI導入 ステップ,"AI導入 中小企業,AI 失敗しない",entry,framework,frameworks,S,approved,#1のクラスター
gas-slack-notify,GAS Slack 通知,"Slack 自動通知,スプレッドシート Slack",execution,howto,gas,S,approved,#4のクラスター
```

---

## 6. 集客チャネル別コンテンツ展開

### SEO（Google検索）

| フェーズ | キーワード戦略 |
|---------|--------------|
| 初期（〜30記事） | ロングテールKW: 「GAS LINE Bot 作り方」「業務自動化 どこから始める」 |
| 中期（30-50記事） | ミドルKW（ピラー記事で狙う）: 「GAS 自動化」「業務自動化 フレームワーク」 |
| 後期（50記事〜） | ビッグKW: 「業務自動化」「AI 導入」（ドメインパワーが育ってから） |

---

## 7. 量産戦略（ADHDフレンドリー）

### Phase 1（Month 1）: 基盤構築
- Astroプロジェクト初期構築 + デプロイ連携
- 最初のS優先度5記事を公開

### Phase 2（Month 2-3）: コンテンツ蓄積
- Claude Codeで週3記事ペース → 30記事達成

### Phase 3（Month 4-6）: 成長・最適化
- リライト・分析サイクル開始

### ADHD対策
- 1記事を1日で完成させなくてOK（git commitで途中保存）
- 「今日はfrontmatterだけ書く」みたいな小さいゴール
- 似たカテゴリをバッチで書く（コンテキストスイッチ減）
- 飽きたら別カテゴリに切り替えてOK

---

## 8. マネタイズ（将来的に）

| 方法 | 相性 | 開始目安 |
|------|------|----------|
| Google AdSense | ◯ | 30記事達成後 |
| アフィリエイト（ツール紹介） | ◎ | 初期から仕込み可能 |
| 有料テンプレ販売（GASスクリプト等） | ◎ | 50記事以降 |
| 自動化導入コンサル | ◎ | サイト経由で問い合わせ |
