# デザイン・UI仕様書（有報×就活）

> AI Automate Lab のデザイン設計を転用

---

## 1. デザイン方針

- **クリーン・ミニマル**: 白基調、余白多め、Stripe/Notion風の洗練さ（AI Automate Lab と同一）
- **信頼感**: 法定開示データを扱うサイトとしての誠実さ・信頼性
- **就活生にとっつきやすい**: 財務データを堅くしすぎない。フレンドリーなトーン
- **ダークモード**: 初期はライトモードのみ。後日追加対応

---

## 2. カラーパレット

```
■ ブランドカラー
  Primary:        #0F766E (Teal 700) ← 信頼感・知的さ・落ち着き
  Primary Hover:  #0D9488 (Teal 600)
  Primary Light:  #F0FDFA (Teal 50)

■ テキスト
  Heading:        #111827 (Gray 900)
  Body:           #374151 (Gray 700)
  Muted:          #6B7280 (Gray 500)

■ 背景
  Base:           #FFFFFF
  Secondary:      #F9FAFB (Gray 50)
  Border:         #E5E7EB (Gray 200)

■ カテゴリカラー（業界別）
  IT/通信:        #2563EB (Blue)
  商社:           #D97706 (Amber)
  製造:           #059669 (Emerald)
  金融:           #7C3AED (Purple)
  食品/消費財:     #DC2626 (Red)
  コンサル/SIer:   #0891B2 (Cyan)
  インフラ:        #4B5563 (Gray)
  ガイド:          #0F766E (Teal = Primary)
  テーマ比較:      #DB2777 (Pink)

■ セマンティック
  Success:        #059669 (Green 600)
  Warning:        #D97706 (Amber 600)
  Info:           #0F766E (Teal 700)
  Disclaimer BG:  #FEF3C7 (Amber 100)  ← 免責表示用
```

---

## 3. Tailwind設定（`tailwind.config.mjs`）

```javascript
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#0F766E', hover: '#0D9488', light: '#F0FDFA' },
        category: {
          it: '#2563EB', trading: '#D97706', manufacturing: '#059669',
          finance: '#7C3AED', food: '#DC2626', consulting: '#0891B2',
          infrastructure: '#4B5563', guide: '#0F766E', compare: '#DB2777',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '72ch', color: '#374151',
            h2: { color: '#111827', marginTop: '2em' },
            h3: { color: '#111827', marginTop: '1.5em' },
            a: { color: '#0F766E', textDecoration: 'underline' },
            'table th': { backgroundColor: '#F9FAFB' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
```

---

## 4. タイポグラフィ

| 要素 | フォント | サイズ | ウェイト |
|------|---------|--------|---------|
| H1（記事タイトル） | Noto Sans JP | 2rem (32px) | Bold 700 |
| H2 | Noto Sans JP | 1.5rem (24px) | Bold 700 |
| H3 | Noto Sans JP | 1.25rem (20px) | SemiBold 600 |
| Body | Noto Sans JP | 1rem (16px) | Regular 400 |
| Small / Meta | Noto Sans JP | 0.875rem (14px) | Regular 400 |
| 数値データ | Inter | 1rem (16px) | SemiBold 600 |
| CTA Button | Noto Sans JP | 1rem (16px) | SemiBold 600 |

- Google Fonts: Noto Sans JP (400, 600, 700) + Inter (400, 600)
- `font-display: swap` でFOUT対策
- コード用フォント: 不要（AI Automate Labとの差分）
- 数値データ表示にはInterのtabular numbersを使用（等幅数字で表が揃う）

---

## 5. ページレイアウト

### トップページ（`index.astro`）
```
┌─────────────────────────────────────────────┐
│  Header（ロゴ + ナビ + 検索）               │
├─────────────────────────────────────────────┤
│  Hero Section                               │
│  「有価証券報告書から、会社の未来を読む」   │
│  [企業を検索する]  [有報の読み方を知る →]   │
├─────────────────────────────────────────────┤
│  有報が初めての方へ                          │
│  （ガイド記事3-4枚 横並びカード）           │
│  「セグメントの見方」「投資・R&Dの読み方」  │
│  → [完全ガイドを見る]                       │
├─────────────────────────────────────────────┤
│  業界から探す                                │
│  （業界カテゴリカード 7枚 グリッド）        │
├─────────────────────────────────────────────┤
│  最新の企業分析（カード3-4枚）              │
├─────────────────────────────────────────────┤
│  テーマで比較する（カード3-4枚）            │
├─────────────────────────────────────────────┤
│  Footer                                     │
└─────────────────────────────────────────────┘
```

### 記事ページ：company-analysis（`ArticleLayout.astro`）
```
┌─────────────────────────────────────────────┐
│  Header                                     │
├─────────────────────────────────────────────┤
│  パンくずリスト                              │
│  ホーム > 製造業 > トヨタの有報分析          │
├─────────────────────────────────────────────┤
│  ┌─ メインコンテンツ (max-w-3xl) ─────────┐ │
│  │  [製造業] [2025年3月期]               │ │
│  │  H1: トヨタの有報分析｜               │ │
│  │      モビリティカンパニーへの転換は    │ │
│  │      本気か？                          │ │
│  │  更新日 ・ 読了時間                    │ │
│  │                                        │ │
│  │  ┌─ この会社が賭けているもの ────┐    │ │
│  │  │ 1. 電動化（BEV/FCEV）          │    │ │
│  │  │ 2. 自動運転・ソフトウェア       │    │ │
│  │  │ 3. モビリティサービス           │    │ │
│  │  └──────────────────────────────┘    │ │
│  │                                        │ │
│  │  Layer導線（引用ブロック）             │ │
│  │  > 有報の読み方がわからない方は        │ │
│  │  > [完全ガイド]をご覧ください。        │ │
│  │                                        │ │
│  │  目次（TOC）                           │ │
│  │  記事本文（prose クラス）              │ │
│  │                                        │ │
│  │  ┌─ 免責事項 ─────────────────┐       │ │
│  │  │ 本記事のデータは有価証券報告書 │     │ │
│  │  │ （EDINET）に基づいています。   │     │ │
│  │  └──────────────────────────────┘     │ │
│  │                                        │ │
│  │  FAQ（アコーディオン）                │ │
│  └────────────────────────────────────────┘ │
│  関連記事カード（3枚）                      │
├─────────────────────────────────────────────┤
│  Footer                                     │
└─────────────────────────────────────────────┘
```

### カテゴリ一覧ページ（業界別）
```
パンくずリスト
→ H1「{業界名}の有報分析」 + 説明文
→ ★業界概要記事（大きめカード）
→ 企業別分析記事一覧（2列カード、「賭けている分野TOP3」付き）
```

---

## 6. コンポーネント仕様

### Header
- PC: `[Logo]  有報の読み方▼ / 業界で探す▼ / テーマ比較 / 用語集 / About  [🔍]`
- モバイル: `[Logo]  [≡]`
- `sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200`
- ドロップダウン:
  - 「有報の読み方」→ 完全ガイド / セグメント / 投資・R&D / リスク / 中期計画 / EDINET
  - 「業界で探す」→ IT / 商社 / 製造 / 金融 / 食品 / コンサル / インフラ

### 記事カード（company-analysis用）
```
┌──────────────────────────┐
│  [業界タグ] [事業年度]    │
│  記事タイトル（2行まで）  │
│  賭けている分野:          │
│  電動化 / 自動運転 / ...  │
│  更新日                   │
└──────────────────────────┘
```
- `border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow`

### 記事カード（howto-guide用）
```
┌──────────────────────────┐
│  [ガイド]                 │
│  記事タイトル（2行まで）  │
│  説明テキスト（3行まで）  │
│  読了時間                 │
└──────────────────────────┘
```

### 「この会社が賭けているもの」ボックス（company-analysis冒頭）
```
┌─ この会社が賭けているもの ──────────┐
│  bg-brand-light border-l-4 border-brand │
│  1. {注力分野1}                         │
│  2. {注力分野2}                         │
│  3. {注力分野3}                         │
└─────────────────────────────────────────┘
```
- AEO施策: AIが「トヨタは何に投資しているか」の回答として引用しやすい構造

### 免責事項ボックス
```
┌─ ⚠ 免責事項 ────────────────────────┐
│  bg-amber-50 border border-amber-200    │
│  本記事のデータは有価証券報告書          │
│  （EDINET）に基づいています。           │
│  投資判断を目的としたものではありません。│
└─────────────────────────────────────────┘
```

### FAQ アコーディオン
- `<details>` + `<summary>` で実装（JS不要）（AI Automate Lab と同一）
- FAQPage JSON-LDと連動

### 目次（Table of Contents）
- `bg-gray-50 rounded-lg p-4 border border-gray-200`（AI Automate Lab と同一）
- H2/H3を自動抽出、H3はインデント

### Footer
- 3カラム:
  1. 業界カテゴリリンク（IT / 商社 / 製造 / 金融 / 食品 / コンサル / インフラ）
  2. サイトリンク（有報の読み方 / テーマ比較 / 用語集 / About / プライバシー）
  3. サイト説明 + 免責事項（短縮版）
- `© 2026 {サイト名}`

---

## 7. レスポンシブ対応

| ブレイクポイント | カード列数 | ナビ | 目次 |
|----------------|-----------|------|------|
| モバイル `< sm` | 1列 | ハンバーガー | 折りたたみ |
| タブレット `sm-lg` | 2列 | 表示 | 表示 |
| PC `lg以上` | 3列 | フル表示 | 表示 |

- メインコンテンツ幅: `max-w-3xl` (768px) 固定
- テーブル: `overflow-x-auto` で横スクロール（セグメント表が多いため重要）
- フォントサイズ: モバイルでも `1rem` 維持

---

## 8. コンテンツスキーマ（`src/content/config.ts`）

```typescript
const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().max(60),
    description: z.string().max(160),
    category: z.enum([
      'it', 'trading', 'manufacturing', 'finance',
      'food', 'consulting', 'infrastructure',
      'guide', 'compare'
    ]),
    tags: z.array(z.string()).min(1).max(8),
    publishedAt: z.date(),
    updatedAt: z.date(),
    author: z.string().default('サイト名'),
    layer: z.enum(['entry', 'execution']),
    articleType: z.enum([
      'company-analysis', 'theme-comparison',
      'howto-guide', 'industry-overview'
    ]),
    schema: z.object({
      type: z.enum(['HowTo', 'FAQPage', 'Article', 'ItemList']),
      totalTime: z.string().optional(),
    }),
    company: z.object({
      name: z.string(),
      ticker: z.string(),
      edinetCode: z.string(),
      industry: z.string(),
      fiscalYear: z.string(),
    }).optional(),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).min(1).max(10),
    relatedArticles: z.array(z.string()).min(1).max(5),
    ogImage: z.string().optional(),
    draft: z.boolean().default(false),
    disclaimer: z.string().optional(),
  }),
});
```

### AI Automate Lab との差分

| フィールド | AI Automate Lab | 有報×就活 |
|-----------|----------------|-----------|
| `difficulty` | あり（beginner/intermediate/advanced） | **なし**（就活生に難易度は不要） |
| `timeToRead` | あり（分） | **なし**（本文量から自動算出で十分） |
| `company` | なし | **あり**（企業メタデータ） |
| `disclaimer` | なし | **あり**（免責事項） |
| `category` | 技術6種 | **業界7種 + guide + compare** |
| `articleType` | 5種 | **4種**（company-analysis/theme-comparison/howto-guide/industry-overview） |
