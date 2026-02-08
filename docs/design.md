# デザイン・UI仕様書

> 元設計書 §20 に対応

---

## 1. デザイン方針

- **クリーン・ミニマル**: 白基調、余白多め、Stripe/Notion風の洗練さ
- **信頼感**: Layer 1読者（非エンジニア経営者）にも取っ付きやすい見た目
- **ダークモード**: 初期はライトモードのみ。後日追加対応

---

## 2. カラーパレット

```
■ ブランドカラー
  Primary:        #2563EB (Blue 600)
  Primary Hover:  #1D4ED8 (Blue 700)
  Primary Light:  #EFF6FF (Blue 50)

■ テキスト
  Heading:        #111827 (Gray 900)
  Body:           #374151 (Gray 700)
  Muted:          #6B7280 (Gray 500)

■ 背景
  Base:           #FFFFFF
  Secondary:      #F9FAFB (Gray 50)
  Border:         #E5E7EB (Gray 200)

■ カテゴリカラー
  GAS:            #0F9D58 (Green)
  Discord Bot:    #5865F2 (Discord Purple)
  AI API:         #FF6B35 (Orange)
  ノーコード:      #7C3AED (Purple)
  フレームワーク:  #2563EB (Blue)
  レビュー:        #DC2626 (Red)

■ セマンティック
  Success:        #059669 (Green 600)
  Warning:        #D97706 (Amber 600)
  Info:           #2563EB (Blue 600)
  Code BG:        #1F2937 (Gray 800)
```

---

## 3. Tailwind設定（`tailwind.config.mjs`）

```javascript
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#2563EB', hover: '#1D4ED8', light: '#EFF6FF' },
        category: {
          gas: '#0F9D58', discord: '#5865F2', 'ai-api': '#FF6B35',
          'no-code': '#7C3AED', frameworks: '#2563EB', reviews: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '72ch', color: '#374151',
            h2: { color: '#111827', marginTop: '2em' },
            h3: { color: '#111827', marginTop: '1.5em' },
            a: { color: '#2563EB', textDecoration: 'underline' },
            code: { backgroundColor: '#F3F4F6', padding: '0.2em 0.4em', borderRadius: '0.25rem' },
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
| Code | JetBrains Mono | 0.875rem (14px) | Regular 400 |
| CTA Button | Noto Sans JP | 1rem (16px) | SemiBold 600 |

- Google Fonts: Noto Sans JP (400, 600, 700) + Inter (400, 600)
- `font-display: swap` でFOUT対策

---

## 5. ページレイアウト

### トップページ（`index.astro`）
```
┌─────────────────────────────────────────────┐
│  Header（ロゴ + ナビ + 検索）               │
├─────────────────────────────────────────────┤
│  Hero Section                               │
│  「中小企業のAI業務自動化を、               │
│    フレームワークで再現可能にする」           │
│  [記事を探す →]  [自動化ロードマップ →]     │
├─────────────────────────────────────────────┤
│  カテゴリカード（6枚 3×2グリッド）          │
├─────────────────────────────────────────────┤
│  最新記事（カード4枚 横並び）               │
├─────────────────────────────────────────────┤
│  ピラー記事ピックアップ（3枚 大きめカード） │
│  「まず読むべき記事」セクション              │
├─────────────────────────────────────────────┤
│  Footer                                     │
└─────────────────────────────────────────────┘
```

### 記事ページ（`ArticleLayout.astro`）
```
┌─────────────────────────────────────────────┐
│  Header                                     │
├─────────────────────────────────────────────┤
│  パンくずリスト                              │
├─────────────────────────────────────────────┤
│  ┌─ メインコンテンツ (max-w-3xl) ─────────┐ │
│  │  カテゴリタグ [GAS] [beginner]         │ │
│  │  H1: 記事タイトル                      │ │
│  │  著者: れん ・ 日付 ・ 読了時間         │ │
│  │  Layer導線（引用ブロック）              │ │
│  │  目次（TOC）                           │ │
│  │  記事本文（prose クラス）               │ │
│  │  FAQ（アコーディオン）                  │ │
│  │  まとめ + CTA                          │ │
│  └────────────────────────────────────────┘ │
│  関連記事カード（3枚）                      │
├─────────────────────────────────────────────┤
│  Footer                                     │
└─────────────────────────────────────────────┘
```

### カテゴリ一覧ページ
```
パンくずリスト → H1 + 説明 → ★ピラー記事（大きめカード）→ 記事一覧（2列カード）
```

---

## 6. コンポーネント仕様

### Header
- PC: `[Logo]  ホーム / カテゴリ▼ / About  [🔍]`
- モバイル: `[Logo]  [≡]`
- `sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200`

### 記事カード
```
┌──────────────────────────┐
│  [カテゴリタグ] [難易度]  │
│  記事タイトル（2行まで）  │
│  説明テキスト（3行まで）  │
│  日付 ・ 読了時間         │
└──────────────────────────┘
```
- `border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow`

### FAQ アコーディオン
- `<details>` + `<summary>` で実装（JS不要）
- FAQPage JSON-LDと連動

### 目次（Table of Contents）
- `bg-gray-50 rounded-lg p-4 border border-gray-200`
- H2/H3を自動抽出、H3はインデント

### Footer
- 3カラム: カテゴリリンク / サイトリンク / SNS
- `© 2026 AI Automate Lab`

---

## 7. レスポンシブ対応

| ブレイクポイント | カード列数 | ナビ | 目次 |
|----------------|-----------|------|------|
| モバイル `< sm` | 1列 | ハンバーガー | 折りたたみ |
| タブレット `sm-lg` | 2列 | 表示 | 表示 |
| PC `lg以上` | 3列 | フル表示 | 表示 |

- メインコンテンツ幅: `max-w-3xl` (768px) 固定
- コードブロック: `overflow-x-auto` で横スクロール
- フォントサイズ: モバイルでも `1rem` 維持
