# トピッククラスター・記事戦略設計書（有報×就活）

> AI Automate Lab の topic-clusters.md を転用

---

## 1. ターゲット読者のレイヤー定義

| レイヤー | 読者像 | 求めている情報 | 対応する記事タイプ |
|----------|--------|----------------|-------------------|
| **Layer 1（入口）** | 有報を初めて読む就活生 | 「有報って何？」「どこを見ればいい？」 | howto-guide |
| **Layer 2（実践）** | 有報で企業の未来を分析したい就活生 | 「この会社は何に賭けている？」「キャリアマッチするか？」 | company-analysis, theme-comparison, industry-overview |

### 導線設計
```
Layer 1 記事（有報の読み方ガイド）
  → 「実際に企業で見てみよう」で誘導 →
Layer 2 記事（企業別分析）
  → 「読み方がわからない方はこちら」で補完 →
Layer 1 記事（読み方ガイドに戻れる導線）
```

---

## 2. トピッククラスター設計

### クラスター構造図

```
【クラスター1: 有報の読み方】★最優先（入口ピラー）
  ├── ピラー:「就活生のための有価証券報告書完全ガイド」(Layer 1)
  ├── クラスター:
  │   ├── セグメント情報で「本当の稼ぎ頭」を見抜く方法（Layer 1・HowTo）
  │   ├── 設備投資・R&D費から「会社の未来の賭け」を読む方法（Layer 1・HowTo）
  │   ├── 「事業等のリスク」でPRでは見えない弱みを知る方法（Layer 1・HowTo）
  │   ├── 経営方針・中期計画から5年後の会社像を描く方法（Layer 1・HowTo）
  │   └── EDINETの使い方ガイド（Layer 1・HowTo）
  └── 全Layer 2記事からリンクされる知識基盤

【クラスター2: IT業界】★優先（検索需要◎）
  ├── ピラー:「IT業界の有報比較｜各社の賭け方の違いが見える」(Layer 2)
  ├── クラスター:
  │   ├── ソニーの有報分析（Layer 2・company-analysis）
  │   ├── 任天堂の有報分析（Layer 2・company-analysis）
  │   ├── NTTデータの有報分析（Layer 2・company-analysis）
  │   └── 追加: サイバーエージェント, KDDI 等
  └── カテゴリ横断リンク → テーマ比較クラスターへ

【クラスター3: 商社業界】★優先（検索需要◎ × 差別化◎）
  ├── ピラー:「五大商社の有報比較｜それぞれ何に未来を賭けているか」(Layer 2)
  ├── クラスター:
  │   ├── 三菱商事の有報分析（Layer 2・company-analysis）
  │   ├── 伊藤忠商事の有報分析（Layer 2・company-analysis）
  │   ├── 三井物産の有報分析（Layer 2・company-analysis）
  │   └── 追加: 住友商事, 丸紅
  └── カテゴリ横断リンク → 製造業クラスター（商社×メーカーの関連）

【クラスター4: 製造業界】
  ├── ピラー:「製造業の有報比較」(Layer 2)
  ├── クラスター:
  │   ├── トヨタの有報分析（Layer 2・company-analysis）
  │   ├── キーエンスの有報分析（Layer 2・company-analysis）
  │   └── デンソーの有報分析（Layer 2・company-analysis）
  └── カテゴリ横断リンク → IT（自動車×ソフトウェアの文脈）

【クラスター5: テーマ別比較】★差別化ポイント（横断的）
  ├── ピラー:「有報データで見る企業の未来力比較」(Layer 2)
  ├── クラスター:
  │   ├── R&D費ランキング（Layer 2・theme-comparison）
  │   ├── 設備投資ランキング（Layer 2・theme-comparison）
  │   ├── セグメント転換中の企業まとめ（Layer 2・theme-comparison）
  │   └── 「事業リスク」から読む業界別課題（Layer 2・theme-comparison）
  └── 各企業別分析記事への横断リンク

【クラスター6-9: 金融 / 食品 / コンサル / インフラ】（Phase 2以降で拡大）
```

### カテゴリ横断リンクマップ
```
有報の読み方（入口）→ IT / 商社 / 製造 / 金融 / 食品 / コンサル / インフラ
IT ←→ 製造（自動車×ソフトウェア、部品メーカー）
商社 ←→ 製造（サプライチェーンの文脈）
テーマ比較 ←→ 全業界（ランキング内の企業 → 企業別記事）
```

---

## 3. サイト構造（URL設計）

```
/                                           トップページ

/articles/guide/yuho-reading-guide          有報の読み方完全ガイド ★ピラー
/articles/guide/yuho-segment-reading        セグメント情報の見方
/articles/guide/yuho-investment-reading     設備投資・R&Dの読み方
/articles/guide/yuho-risk-reading           事業等のリスクの読み方
/articles/guide/yuho-strategy-reading       経営方針・中期計画の読み方
/articles/guide/edinet-usage                EDINETの使い方ガイド

/articles/it/it-overview                    IT業界の有報比較 ★ピラー
/articles/it/sony-yuho                      ソニーの有報分析
/articles/it/nintendo-yuho                  任天堂の有報分析
/articles/it/nttdata-yuho                   NTTデータの有報分析

/articles/trading/trading-overview          五大商社の有報比較 ★ピラー
/articles/trading/mitsubishi-corp-yuho      三菱商事の有報分析
/articles/trading/itochu-yuho              伊藤忠商事の有報分析
/articles/trading/mitsui-yuho              三井物産の有報分析

/articles/manufacturing/manufacturing-overview 製造業の有報比較 ★ピラー
/articles/manufacturing/toyota-yuho         トヨタの有報分析
/articles/manufacturing/keyence-yuho        キーエンスの有報分析
/articles/manufacturing/denso-yuho          デンソーの有報分析

/articles/compare/rnd-spending-ranking      R&D費で見る企業ランキング
/articles/compare/capex-growth-ranking      設備投資で見る成長企業
/articles/compare/segment-shift             セグメント転換中の企業まとめ
/articles/compare/risk-landscape            業界別・事業リスクの特徴

/category/it/                               IT業界一覧ページ
/category/trading/                          商社業界一覧ページ
/category/manufacturing/                    製造業界一覧ページ
/category/finance/                          金融業界一覧ページ
/category/food/                             食品業界一覧ページ
/category/consulting/                       コンサル/SIer一覧ページ
/category/infrastructure/                   インフラ一覧ページ

/glossary                                   用語集（セグメント、R&D、EBITDA等）
/about                                      サイトについて + 免責事項
/privacy                                    プライバシーポリシー
```

---

## 4. 内部リンク戦略

### リンク本数のルール

| リンク種別 | 本数 | 配置場所 |
|-----------|------|----------|
| ピラー → クラスター | クラスター記事全件 | 各セクション末尾 |
| クラスター → ピラー | 必ず1本 | 冒頭の「読み方ガイド」or 末尾「まとめ」 |
| クラスター ↔ クラスター（同業界） | 2-3本 | 本文中の関連箇所に自然に埋め込み |
| カテゴリ横断リンク | 1-2本 | 本文中 or 「関連記事」セクション |
| Layer 1 → Layer 2 誘導 | 1-2本 | 記事末尾のCTA「実際に企業で見てみよう」 |
| Layer 2 → Layer 1 誘導 | 1本 | 冒頭の「読み方がわからない方はこちら」 |

### frontmatter `relatedArticles` 運用ルール
- **同業界から2本 + 別クラスターから1本**を基本
- ピラー記事（業界概要 or 読み方ガイド）は必ず含める

---

## 5. 記事優先順位

### 初期20記事の執筆順

| # | slug | title（案） | Layer | Type | cluster | phase |
|---|------|------------|-------|------|---------|-------|
| 1 | yuho-reading-guide | 就活生のための有価証券報告書完全ガイド | entry | howto-guide | guide | 1 |
| 2 | yuho-segment-reading | セグメント情報で「本当の稼ぎ頭」を見抜く方法 | entry | howto-guide | guide | 1 |
| 3 | yuho-investment-reading | 設備投資・R&D費から「会社が何に賭けているか」を読む方法 | entry | howto-guide | guide | 1 |
| 4 | yuho-risk-reading | 「事業等のリスク」でPRでは見えない本音を知る方法 | entry | howto-guide | guide | 1 |
| 5 | yuho-strategy-reading | 経営方針・中期計画で5年後の会社像を描く方法 | entry | howto-guide | guide | 1 |
| 6 | toyota-yuho | トヨタの有報分析｜モビリティカンパニーへの転換は本気か？ | execution | company-analysis | manufacturing | 1 |
| 7 | sony-yuho | ソニーの有報分析｜エンタメ・半導体・金融─本当の稼ぎ頭はどこか | execution | company-analysis | it | 1 |
| 8 | mitsubishi-corp-yuho | 三菱商事の有報分析｜資源から非資源へ─次の10年の賭け | execution | company-analysis | trading | 1 |
| 9 | keyence-yuho | キーエンスの有報分析｜驚異の利益率を支える事業構造の正体 | execution | company-analysis | manufacturing | 1 |
| 10 | nintendo-yuho | 任天堂の有報分析｜IP戦略と「プラットフォームの次」 | execution | company-analysis | it | 1 |
| 11 | itochu-yuho | 伊藤忠商事の有報分析｜非資源No.1戦略のリアル | execution | company-analysis | trading | 1 |
| 12 | nttdata-yuho | NTTデータの有報分析｜グローバルIT企業への変革の行方 | execution | company-analysis | it | 1 |
| 13 | it-overview | IT業界の有報比較｜各社の「賭け方」の違いが見える | execution | industry-overview | it | 1 |
| 14 | trading-overview | 五大商社の有報比較｜それぞれ何に未来を賭けているか | execution | industry-overview | trading | 1 |
| 15 | rnd-spending-ranking | R&D費で読み解く「未来に賭けている企業」ランキング | execution | theme-comparison | compare | 2 |
| 16 | capex-growth-ranking | 設備投資の伸びで見る「攻めの経営」企業ランキング | execution | theme-comparison | compare | 2 |
| 17 | edinet-usage | EDINETで有価証券報告書を検索・ダウンロードする方法 | entry | howto-guide | guide | 1 |
| 18 | denso-yuho | デンソーの有報分析｜EV時代の部品メーカーの生存戦略 | execution | company-analysis | manufacturing | 2 |
| 19 | mitsui-yuho | 三井物産の有報分析｜資源商社は資源の「次」に何を見ているか | execution | company-analysis | trading | 2 |
| 20 | segment-shift | 有報で見つけた「事業構造が変わりつつある」注目企業まとめ | execution | theme-comparison | compare | 2 |

### 内部リンク設計図（初期20記事）
```
[#1 有報の読み方ガイド]（全記事のピラー）
  ├─→ [#2 セグメントの読み方] ─→ [#7 ソニー]（セグメント実例）
  ├─→ [#3 投資・R&Dの読み方] ─→ [#6 トヨタ]（投資実例）
  ├─→ [#4 リスクの読み方] ─→ [#8 三菱商事]（リスク実例）
  ├─→ [#5 中期計画の読み方] ─→ [#12 NTTデータ]（中計実例）
  ├─→ [#17 EDINETの使い方]
  │
  ├─→ [#13 IT業界概要]
  │     ├─→ [#7 ソニー] ←→ [#10 任天堂] ←→ [#12 NTTデータ]
  │
  ├─→ [#14 商社業界概要]
  │     ├─→ [#8 三菱商事] ←→ [#11 伊藤忠] ←→ [#19 三井物産]
  │
  └─→ [#6 トヨタ] ←→ [#9 キーエンス] ←→ [#18 デンソー]

[#15 R&Dランキング] ←→ [#16 設備投資ランキング] ←→ [#20 事業構造変化]
  └── 各ランキング内の企業 → 企業別分析記事へ
```

---

## 6. 集客チャネル別コンテンツ展開

### SEO（Google検索）

| フェーズ | キーワード戦略 |
|---------|--------------|
| Phase 1（〜20記事） | 競合弱いKW: 「企業名 有価証券報告書」「有報 読み方 就活」「EDINET 使い方」 |
| Phase 2（20-50記事） | ロングテール: 「企業名 研究開発費 有報」「企業名 将来性 有価証券報告書」 |
| Phase 3（50記事〜） | ビッグKW: 「商社 比較」「IT企業 将来性」（ドメインパワーが育ってから） |

---

## 7. 量産戦略

### Phase 1（Month 1）: 基盤構築
- Astroプロジェクト構築（AI Automate Labのフォーク）
- EDINET API連携スクリプト構築
- エージェント指示書の作成
- ガイド記事6本 + 企業分析7本 + 業界概要2本 = **15本公開**

### Phase 2（Month 2-3）: コンテンツ蓄積
- 企業分析記事を週5本ペースで量産
- テーマ別比較を週1本
- 30記事→50記事

### Phase 3（Month 4-6）: 成長・最適化
- リライト・分析サイクル開始
- 有報更新（決算期ごと）に合わせたデータリフレッシュ
- ドメインパワーがついてきたらPhase 3キーワードへ展開

### 就活カレンダー連動
| 時期 | 就活イベント | 記事戦略 |
|------|------------|---------|
| 10-12月 | インターン・業界研究 | 業界概要記事・有報の読み方ガイドを強化 |
| 1-2月 | ES対策・企業研究 | 企業別分析記事を量産 |
| 3-5月 | 面接本番 | 面接活用ポイントの充実・リライト |
| 6-8月 | 内定・夏インターン | テーマ別比較・穴場企業記事 |

---

## 8. keyword-map.csv 初期データ

```csv
slug,primary_kw,secondary_kw,layer,article_type,cluster,company_ticker,phase,priority,status,notes
yuho-reading-guide,有価証券報告書 読み方,"有報 就活,有報 見方",entry,howto-guide,guide,,1,S,approved,全記事の入口ピラー
yuho-segment-reading,有報 セグメント 見方,"セグメント情報 読み方,有報 稼ぎ頭",entry,howto-guide,guide,,1,S,approved,#1から誘導
yuho-investment-reading,有報 設備投資 読み方,"研究開発費 見方,有報 R&D",entry,howto-guide,guide,,1,S,approved,#1から誘導
yuho-risk-reading,有報 事業等のリスク 読み方,"有報 リスク,企業 弱み 有報",entry,howto-guide,guide,,1,S,approved,#1から誘導
yuho-strategy-reading,有報 経営方針 読み方,"中期経営計画 見方,有報 将来性",entry,howto-guide,guide,,1,S,approved,#1から誘導
toyota-yuho,トヨタ 有価証券報告書,"トヨタ 有報,トヨタ 将来性",execution,company-analysis,manufacturing,7203,1,S,approved,製造業クラスター
sony-yuho,ソニー 有価証券報告書,"ソニー 有報,ソニー セグメント",execution,company-analysis,it,6758,1,S,approved,ITクラスター
mitsubishi-corp-yuho,三菱商事 有価証券報告書,"三菱商事 有報,商社 比較",execution,company-analysis,trading,8058,1,S,approved,商社クラスター
keyence-yuho,キーエンス 有価証券報告書,"キーエンス 有報,キーエンス 利益率",execution,company-analysis,manufacturing,6861,1,S,approved,製造業クラスター
nintendo-yuho,任天堂 有価証券報告書,"任天堂 有報,任天堂 経営戦略",execution,company-analysis,it,7974,1,S,approved,ITクラスター
itochu-yuho,伊藤忠 有価証券報告書,"伊藤忠 有報,伊藤忠 非資源",execution,company-analysis,trading,8001,1,S,approved,商社クラスター
nttdata-yuho,NTTデータ 有価証券報告書,"NTTデータ 有報,NTTデータ グローバル",execution,company-analysis,it,9613,1,S,approved,ITクラスター
it-overview,IT業界 有報 比較,"IT企業 比較 有報,IT 将来性",execution,industry-overview,it,,1,S,approved,IT業界ピラー
trading-overview,五大商社 有報 比較,"商社 比較 有報,商社 将来性",execution,industry-overview,trading,,1,S,approved,商社業界ピラー
rnd-spending-ranking,研究開発費 ランキング 有報,"R&D費 企業 比較,将来性 企業",execution,theme-comparison,compare,,2,A,approved,テーマ比較クラスター
capex-growth-ranking,設備投資 ランキング 有報,"設備投資 成長企業,攻め 企業",execution,theme-comparison,compare,,2,A,approved,テーマ比較クラスター
edinet-usage,EDINET 使い方,"EDINET 検索,有価証券報告書 ダウンロード",entry,howto-guide,guide,,1,S,approved,#1のクラスター
denso-yuho,デンソー 有価証券報告書,"デンソー 有報,デンソー EV",execution,company-analysis,manufacturing,6902,2,A,approved,製造業クラスター
mitsui-yuho,三井物産 有価証券報告書,"三井物産 有報,三井物産 資源",execution,company-analysis,trading,8031,2,A,approved,商社クラスター
segment-shift,事業構造 変化 企業,"セグメント 転換,変革 企業 有報",execution,theme-comparison,compare,,2,A,approved,テーマ比較クラスター
```

---

## 9. マネタイズ（将来的に）

| 方法 | 相性 | 開始目安 |
|------|------|----------|
| Google AdSense | ○ | 30記事達成後 |
| 就活サービスアフィリエイト | ◎ | 初期から仕込み可能 |
| 有料テンプレ販売（企業分析シート等） | ◎ | 50記事以降 |
| 就活コンサル・添削 | ○ | サイト経由で問い合わせ |
