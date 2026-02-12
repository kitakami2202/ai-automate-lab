# リファインメントブリーフ: openai-api-intro

## 基本情報

| 項目 | 値 |
|------|-----|
| ファイル | `src/content/articles/ai-api/openai-api-intro.md` |
| primary_kw | OpenAI API 入門 |
| secondary_kw | ChatGPT API, GPT API 使い方 |
| layer | execution |
| articleType | howto |
| cluster | ai-api |
| priority | A |

---

## 構造サマリ

| 指標 | 値 | 基準 | 判定 |
|------|----|------|------|
| タイトル文字数 | 29文字 | 60文字以内 | OK |
| description文字数 | 128文字 | 120-160文字 | OK |
| H2数 | 5 | 5以内 | OK |
| H3数 | 14 | - | OK |
| コードブロック数 | 11 | 1以上 | OK |
| 表の数 | 7 | 1以上 | OK |
| FAQ数 | 5 | 3-5 | OK |
| 内部リンク数（本文中） | 5 | 3以上 | OK |
| relatedArticles | 3本（同カテ3+別カテ0） | 同カテ2+別カテ1 | NG |
| Layer 1ピラーリンク（冒頭） | なし（frameworksへのリンクはあるがピラーai-api-overviewへのリンクなし） | Layer 2は冒頭にLayer 1ピラーリンク | NG |
| 記事サイズ | 約21KB | - | OK |

---

## 5軸採点（100点満点）

### 1. コンテンツ品質（20点満点） → 17/20

| 項目 | 得点 | 理由 |
|------|------|------|
| 結論ファースト | 4/4 | 冒頭3行でメール自動分類スクリプトを60分で構築することを明示。目的と対象読者が明確 |
| 定義文 | 4/4 | 各H2冒頭に「〇〇とは、△△です」形式の定義文あり（5セクション全て） |
| 表 | 4/4 | 7つの表で前提条件・モデル比較・準備物・API比較・エラー対処・コスト試算を整理 |
| コード実行可能性 | 3/4 | 全コードがコピペで動く形式。ただし、Responses APIの`client.responses.create()`のレスポンス形式の`output_text`属性が実際のOpenAI Python SDKの最新仕様と一致するか要確認。`response_format`指定がResponses API側にないのも不一致の可能性あり |
| 具体性 | 2/4 | メール分類の実装は具体的だが、議事録要約の使用例は`meeting_minutes.txt`ファイルの内容が不明で、実行結果の例が示されていない |

### 2. SEO/AEO（20点満点） → 17/20

| 項目 | 得点 | 理由 |
|------|------|------|
| title | 4/4 | 29文字。「OpenAI API入門」のprimary_kwを含み、「業務自動化を始める実践ガイド」で意図を補完。60文字以内 |
| description | 4/4 | 128文字。120-160の範囲。primary_kw・secondary_kwを自然に含む |
| schema | 3/4 | type: HowTo、estimatedCost・totalTime設定あり。ただしステップ構造がH3で明確だがschemaのstep抽出精度は実装依存 |
| FAQ | 4/4 | 5個。料金・ChatGPTとの違い・APIキー漏洩・API選択・GAS連携と幅広くカバー。回答も具体的 |
| 副KW配置 | 2/4 | 「ChatGPT API」は冒頭の定義文内とdescriptionに1回ずつ、「GPT API 使い方」は「GPT APIの使い方」として1回のみ。本文中の副KW露出がやや少ない |

### 3. 内部リンク・導線（20点満点） → 13/20

| 項目 | 得点 | 理由 |
|------|------|------|
| Layer遷移 | 2/4 | 冒頭にai-introduction-5steps（frameworksクラスター）へのリンクがあるが、**自クラスターのピラー記事（ai-api-overview）への導線が本文中に一切ない**。Layer 2記事は冒頭でLayer 1ピラーにリンクすべき |
| リンク3本以上 | 4/4 | 本文中に5本の内部リンクあり。ai-introduction-5steps, gas-basics, claude-api-intro, gemini-api-intro, ai-dev-tools-comparison |
| relatedArticles | 2/4 | ai-api/ai-api-overview, ai-api/claude-api-intro, ai-api/gemini-api-introの3本。**全て同カテゴリ（ai-api）で、別カテゴリが含まれていない**。ルールは「同カテゴリ2本+別カテゴリ1本」 |
| テキスト自然さ | 5/8 | 「詳しくは〜をご覧ください」形式で自然に埋め込まれている。ただし記事末尾にまとめセクションが独立したH2として存在せず、最終段落に埋め込みで終わっている。CTAとしての訴求力が弱い |

### 4. 可読性・文体（20点満点） → 17/20

| 項目 | 得点 | 理由 |
|------|------|------|
| 敬体統一 | 5/5 | 全文「です・ます」調で統一。文体の揺れなし |
| 一文80字以内 | 4/5 | 大半は80字以内だが、FAQ回答内に長文がある（frontmatter内なので本文表示ではないが確認対象） |
| 段落構造 | 4/5 | 各セクションの段落が明確で読みやすい。コードブロック前後の説明も適切。ただし「応用・カスタマイズ例」セクションの後に明確な「まとめ」H2がない |
| 専門用語説明 | 4/5 | Chat Completions API, Responses API, temperature, response_format等を適切に説明。ただし「トークン」の初出時に説明がない（「入力500トークン」等で初出）|

### 5. 鮮度・正確性（20点満点） → 14/20

| 項目 | 得点 | 理由 |
|------|------|------|
| バージョン最新性 | 3/5 | o3, o4-miniの掲載は2026年時点で適切。ただし`openai`ライブラリのバージョン指定が「1.0以上必須」と曖昧。2026年2月時点の最新バージョンを明記すべき。また `pip install openai` だけでなくバージョン固定の推奨（`openai>=1.60`等）があると再現性向上 |
| 料金時点明記 | 5/5 | 「2026年2月時点」を複数箇所で明記し、公式料金ページへのリンクも設置。模範的 |
| コード動作 | 3/5 | Chat Completions APIのコードは動作する。しかし**Responses APIの`client.responses.create()`は正式なOpenAI Python SDKのメソッド名として要検証**。公式ドキュメントでは`client.responses.create()`のインターフェースが異なる可能性がある（`input`パラメータの形式、`output_text`属性等）。GASコードは標準的で問題なし |
| CLAUDE.md準拠 | 3/5 | 概ね準拠。ただし「まとめ」H2セクションの欠如、relatedArticlesの別カテゴリ不足、ピラーリンクの欠如はCLAUDE.mdルール違反 |

---

## 総合スコア

| 軸 | 得点 |
|----|------|
| コンテンツ品質 | 17/20 |
| SEO/AEO | 17/20 |
| 内部リンク・導線 | 13/20 |
| 可読性・文体 | 17/20 |
| 鮮度・正確性 | 14/20 |
| **合計** | **78/100** |

**判定: REFINE（60-84点）**

---

## セクション別 KEEP/IMPROVE/REWRITE 判定

| セクション | 判定 | 理由 |
|-----------|------|------|
| frontmatter | IMPROVE | relatedArticlesに別カテゴリの記事を1本追加（例: `frameworks/ai-introduction-5steps`）。同カテゴリはai-api-overview + もう1本に絞る |
| 冒頭（導入3行） | IMPROVE | 結論ファーストは良好だが、**自クラスターのピラー（ai-api-overview）への導線を追加**すべき。現在のai-introduction-5stepsリンクに加えて「AI APIの全体像は[AI APIを業務に組み込む方法](/articles/ai-api/ai-api-overview)をご覧ください」を挿入 |
| H2: この記事で作るもの | KEEP | 定義文あり、前提条件表あり、完成物が明確 |
| H2: 準備・環境構築 | KEEP | ステップが明確、セキュリティ注意喚起あり、準備物チェック表あり |
| H2: 実装手順 | IMPROVE | (1) Responses APIのコード例を公式ドキュメントと照合し、最新の正しいインターフェースに更新 (2) 「トークン」の初出時に簡単な説明を追加 (3) 副KW「ChatGPT API」「GPT API 使い方」をステップ説明文中に自然に追加配置 |
| H2: 動作確認・トラブルシューティング | KEEP | エラー表・コスト試算表が実用的。料金時点明記も適切 |
| H2: 応用・カスタマイズ例 | IMPROVE | (1) 議事録要約スクリプトに実行結果の例を追加 (2) 他のAI APIとの比較表は良好だが、本セクション末尾に「まとめ」の段落を**独立したH2セクション「まとめ・次のステップ」として分離** |
| まとめ（現在は末尾の段落） | REWRITE | 現在は最終段落として埋め込まれているだけ。**独立したH2「まとめ」セクションに格上げ**し、(1) 記事のポイントを箇条書きで要約 (2) 次のステップとしてClaude API入門やAI API概要記事へのCTAを配置 |

---

## 具体的な修正指示

### 優先度: 高

1. **relatedArticlesの修正**
   - 現在: `ai-api/ai-api-overview`, `ai-api/claude-api-intro`, `ai-api/gemini-api-intro`（同カテ3本）
   - 修正後: `ai-api/ai-api-overview`, `ai-api/claude-api-intro`, `frameworks/ai-introduction-5steps`（同カテ2+別カテ1）

2. **冒頭にピラー記事（ai-api-overview）への導線を追加**
   - 冒頭3行目の後に追加: 「AI APIの活用方法全体を知りたい方は[AI APIを業務に組み込む方法](/articles/ai-api/ai-api-overview)をご覧ください。」

3. **「まとめ」セクションを独立H2に**
   - 現在の末尾段落を `## まとめ` のH2セクションとして書き直す
   - 箇条書きで3つのポイントをまとめる
   - 「次のステップ」として関連記事（Claude API入門、AI API概要）へのCTAを配置

### 優先度: 中

4. **Responses APIコード例の検証・更新**
   - `client.responses.create()` のインターフェース（`instructions`, `input`, `output_text`）を公式ドキュメントと照合
   - 必要に応じて正しいパラメータ名・レスポンス構造に修正

5. **「トークン」の初出時に説明を追加**
   - ステップ1のモデル比較表の前あたりで「トークンとは、AIがテキストを処理する際の最小単位で、日本語では1文字が約1〜2トークンに相当します。」と簡潔に説明

6. **副KWの追加配置**
   - 「ChatGPT API（OpenAI API）」の表現をステップ1の導入部にもう1回使用
   - 「GPT APIの使い方」をまとめセクションの要約文に含める

### 優先度: 低

7. **議事録要約スクリプトの実行結果例を追加**
   - `summarize_minutes()` の呼び出し後にJSON形式の出力例を追加（メール分類と同様の形式で）

8. **openaiライブラリのバージョン推奨を具体化**
   - 「バージョン1.0以上必須」を「バージョン1.60以上推奨（2026年2月時点）」等に更新
   - `pip install openai>=1.60 python-dotenv` のように具体的バージョンを記載

---

## 修正後の期待スコア

| 軸 | 現在 | 修正後期待値 |
|----|------|------------|
| コンテンツ品質 | 17 | 19 |
| SEO/AEO | 17 | 19 |
| 内部リンク・導線 | 13 | 18 |
| 可読性・文体 | 17 | 18 |
| 鮮度・正確性 | 14 | 17 |
| **合計** | **78** | **91（SKIP圏）** |
