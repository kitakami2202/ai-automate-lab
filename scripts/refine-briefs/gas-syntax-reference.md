# リファインメントブリーフ: gas-syntax-reference

## 基本情報
- 対象ファイル: src/content/articles/gas/gas-syntax-reference.md
- 監査日: 2026-02-12
- 総合スコア: 72/100
- 判定: REFINE

## スコアサマリ
| カテゴリ | スコア | 主な減点理由 |
|---------|--------|-------------|
| コンテンツ品質 | 14/20 | H2が6つでCLAUDE.md上限5を超過、referenceテンプレートの「前提知識・用語」セクション欠如、コード内でvar使用（const/let推奨と矛盾）、パフォーマンスTips等の実務一次情報が薄い |
| SEO/AEO品質 | 14/20 | title60文字以内だがprimary KW「GAS 基礎文法」が前方にない、副KW「Google Apps Script 文法」が本文中に未出現、定義文がH2のうち3/6にしかない、schema.typeがArticleで問題ないがFAQ JSON-LDの活用余地あり |
| 内部リンク・導線 | 17/20 | 内部リンク7本で基準（3本以上）を超過し良好。ただしrelatedArticlesの3本中gas-basicsとgas-spreadsheet-automationは同カテゴリだがgas-mail-automationも同カテゴリで「別カテゴリ1本」ルールに違反 |
| 可読性・文体 | 14/20 | 敬体統一ではなく常体混在（「コピペでお使いください」vs 説明文のだ・である調不在だが、コード前後の解説文が短く淡白）、専門用語（V8ランタイム、ES2020、テンプレートリテラル、スクリプトプロパティ等）の初出説明が不足、結論ファースト3行の要約がやや弱い |
| 鮮度・正確性 | 13/20 | スプレッドシート操作セクションでvar使用（FAQ回答でconst/let推奨と矛盾）、Gmail送信上限「無料100通/日」は正確だが公式URL・時点表記なし、トリガー作成コード例がなく表のみで実行可能性が低い |

## セクション別判定
| セクション | 判定 | 理由 |
|-----------|------|------|
| frontmatter | IMPROVE | relatedArticlesが同カテゴリ3本で「別カテゴリ1本」ルール違反。titleにprimary KWをもう少し前方に配置したい。ogImage未設定 |
| 導入部（blockquote + 要約文） | KEEP | Layer 2→Layer 1導線のblockquoteは良い。ただし結論ファースト3行の具体性がやや弱い |
| H2-1「基本文法」 | KEEP | 定義文あり。変数・関数・条件分岐・ループ・配列のH3構成は網羅的。コード例もconst/letで統一されており良好 |
| H2-2「スプレッドシート操作」 | IMPROVE | 定義文あり、メソッド一覧表あり。しかしコード例でvar使用がconst/let推奨と矛盾。パフォーマンスTipsは良い記述だが、appendRow/formatCellsのユースケース説明が不足 |
| H2-3「Gmail操作」 | IMPROVE | 定義文あり、メソッド表あり。ただしコード例が2つのみで薄い。送信上限の時点表記・公式URLなし。メール検索結果の処理コードが不足 |
| H2-4「日付・時刻処理」 | IMPROVE | 定義文あり。コード例は実用的。ただしコメント内のフォーマット表がMarkdown表でなくコメント形式で構造化されていない。varが使われている |
| H2-5「外部API呼び出し」 | KEEP | 定義文あり。APIキーのスクリプトプロパティ保管の注意書きは良い。コード例も実行可能 |
| H2-6「トリガー・ユーティリティ」 | REWRITE | 定義文なし。表のみでコード例がゼロ。reference記事として「コピペで使える」を謳いながらこのセクションだけコード例がないのは致命的。H2数超過の原因でもあるため、H2-5に統合するか独立コード例を追加 |
| 関連リソース | KEEP | 公式ドキュメントリンクあり、内部リンク3本。構成は良好 |

## 改善指示一覧（優先度順）

### 指示1: H2を5つ以内に削減
- 対象: 記事全体の構造
- 何を: 現在H2が6つ（基本文法、スプレッドシート操作、Gmail操作、日付・時刻処理、外部API呼び出し、トリガー・ユーティリティ）+関連リソースで計7つ。CLAUDE.md規定「H2は5つ以内」に違反
- なぜ: 品質基準の構造ルールに準拠するため
- 方向性: 以下のいずれかを推奨:
  - 案A: 「トリガー・ユーティリティ」を「外部API呼び出し」に統合し「外部連携・ユーティリティ」に改名
  - 案B: 「日付・時刻処理」を「基本文法」のH3として統合（JavaScript標準機能のため）
  - 案C: 「関連リソース」をH2から外し、まとめセクション的な位置づけに（これは現状でもH2だがカウント外とする判断もあり得る）
  - 最も自然なのは案A。トリガーとユーティリティは外部連携の文脈で使われることが多い

### 指示2: relatedArticlesに別カテゴリ記事を1本追加
- 対象: frontmatter relatedArticles
- 何を: 現在 `gas/gas-basics`, `gas/gas-spreadsheet-automation`, `gas/gas-mail-automation` の3本全て同カテゴリ（gas）。1本を別カテゴリに差し替え
- なぜ: CLAUDE.md「relatedArticles は同カテゴリ2本 + 別カテゴリ1本」に違反
- 方向性: `gas/gas-mail-automation` を `ai-api/claude-api-intro` または `frameworks/prompt-engineering-business` に差し替え。gas-mail-automationへのリンクは本文中に既にあるため、relatedArticlesから外しても導線は維持される

### 指示3: スプレッドシート操作・日付処理セクションのvar→const/letに統一
- 対象: H2-2「スプレッドシート操作」のコード例、H2-4「日付・時刻処理」のコード例
- 何を: `var` を `const` または `let` に変更
- なぜ: FAQ回答（Q2）で「V8ランタイムでconst/letが使える」と明記しながら、自身のコード例でvar使用は矛盾。読者に混乱を与える。H2-1「基本文法」セクションではconst/letで統一されており不整合
- 方向性:
  - `var sheet` → `const sheet`
  - `var data` → `const data`
  - `var name` → `const name`（ループ内で再代入しないもの）
  - `var i` → `let i`（forループカウンタ）
  - `var now` → `const now`
  - `var formatted` → `const formatted`
  - `var tomorrow` → `const tomorrow`
  - `var lastWeek` → `const lastWeek`
  - `var lastDay` → `const lastDay`
  - `var threads` → `const threads`

### 指示4: 「トリガー・ユーティリティ」にコード例を追加
- 対象: H2-6「トリガー・ユーティリティ」
- 何を: 表のみの状態にコピペで使えるコード例を追加
- なぜ: 記事タイトルが「コピペで使えるリファレンス」を謳い、reference記事として全セクションにコード例が必要。CLAUDE.md「コード例は実行可能な状態にする（省略しない）」にも抵触
- 方向性:
  ```javascript
  // 毎日9時に実行するトリガーを作成
  function createDailyTrigger() {
    ScriptApp.newTrigger("myFunction")
      .timeBased()
      .everyDays(1)
      .atHour(9)
      .create();
  }

  // 設定済みトリガーを全削除
  function deleteAllTriggers() {
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  }
  ```

### 指示5: 副KW「Google Apps Script 文法」を本文中に自然配置
- 対象: 導入部または「基本文法」セクション
- 何を: 副KW「Google Apps Script 文法」を本文中に1回以上配置
- なぜ: keyword-map.csvの secondary_kw「Google Apps Script 文法」が本文中に完全一致で出現しない。description内には「Google Apps Script（GAS）の基礎文法」として含まれるが、本文中にもSEO的に配置が望ましい
- 方向性: 導入部の要約文を「Google Apps Script（GAS）の基礎文法と業務自動化で頻出するコードパターンを逆引き形式でまとめています。」に変更（現在「GASの基礎文法と〜」）

### 指示6: Gmail送信上限に時点表記と公式URLを追加
- 対象: H2-3「Gmail操作」のメソッド表
- 何を: 「無料100通/日」に時点表記と公式URL参照を追記
- なぜ: CLAUDE.md「料金情報は公式URLを必ずリンクし『2026年2月時点』等の時点を明記」に準拠するため。送信上限は制限情報だが、利用制限は料金・プランに関連する情報として時点表記が望ましい
- 方向性: 表の備考欄を「無料100通/日（2026年2月時点、[公式ドキュメント](https://developers.google.com/apps-script/guides/services/quotas)参照）」に変更

### 指示7: 専門用語の初出説明を追加
- 対象: 全体
- 何を: 以下の用語に初出時の説明を追加:
  - テンプレートリテラル: コード例コメントには記載あるが、初学者向けに括弧書き説明追加「テンプレートリテラル（文字列中に変数を埋め込む書き方）」
  - アロー関数: 「アロー関数（`=>` を使った短い関数の書き方）」
  - スクリプトプロパティ: 「スクリプトプロパティ（GASプロジェクトに安全に値を保存できる仕組み）」
  - JSON.parse / JSON.stringify: 「JSON.parse（JSON文字列をオブジェクトに変換する関数）」
- なぜ: difficulty=beginnerの記事であり、CLAUDE.md「専門用語は初出時に必ず説明を付ける」に準拠するため
- 方向性: 本文中に括弧書きで簡潔に説明を挿入。コードコメントでの補足も可

### 指示8: 結論ファースト3行の具体性を強化
- 対象: 導入部（blockquote直後の要約文）
- 何を: 現在の2行の要約に、具体的な対象範囲を示す1文を追加
- なぜ: CLAUDE.md「結論ファースト: 冒頭3行で要約」に準拠。現在は「逆引き形式」「コピペでお使いください」と方法論のみで、何が網羅されているかの具体性が弱い
- 方向性: 「変数宣言・スプレッドシート操作・Gmail送信・日付処理・外部API連携の5カテゴリ、約30のコードパターンを収録しています。」のような網羅感を示す1文を追加

### 指示9: 日付フォーマットパターンをMarkdown表に変換
- 対象: H2-4「日付・時刻処理」内のコードコメント（行205-206）
- 何を: 日付フォーマットパターン一覧をコードコメントからMarkdown表に変換
- なぜ: AEO施策「表形式で整理（AIが構造認識しやすい）」に準拠。現在はコードコメント内に記載されており、AIにも人間にも認識しづらい
- 方向性:
  | パターン | 意味 | 例 |
  |---------|------|-----|
  | yyyy | 年（4桁） | 2026 |
  | MM | 月（2桁） | 02 |
  | dd | 日（2桁） | 12 |
  | HH | 時（24時間） | 09 |
  | mm | 分 | 30 |
  | ss | 秒 | 00 |

### 指示10: referenceテンプレートの「前提知識・用語」セクション追加を検討
- 対象: 導入部とH2-1の間
- 何を: referenceテンプレートに規定されている「前提知識・用語」の表を追加
- なぜ: scripts/templates/reference.md のテンプレートに「前提知識・用語」セクションが含まれているが、本記事には存在しない
- 方向性: H2数上限（5つ）との兼ね合いがあるため、独立H2ではなく導入部の一部として簡潔な前提表を追加:
  | 前提 | 内容 |
  |------|------|
  | 対象読者 | GASで業務自動化を始めたい方 |
  | 前提知識 | Googleアカウントがあること |
  | 動作環境 | GASスクリプトエディタ（ブラウザ上で動作） |

## 保持すべき良い点
- 冒頭のblockquoteによるLayer 2→Layer 1（gas-basics）導線は設計通り。変更しないこと
- H2-1「基本文法」のconst/let統一とコード例の充実度は高い
- H2-2のスプレッドシートメソッド一覧表はreferenceとして有用。パフォーマンスTipsのbold表記も読みやすい
- H2-5「外部API呼び出し」のAPIキー管理注意書きはCLAUDE.md準拠で良好
- FAQ 3問の選定は検索意図（GASとJSの違い、対応バージョン、使い方）に的確に対応
- 内部リンク7本は基準を大きく超え、導線として充実している
- descriptionの文字数（156文字程度）はSEO的に適切な範囲
- category, tags, layer, articleType の設定はkeyword-map.csvと整合

## frontmatter修正指示
- title: 変更不要（28文字、primary KW含有）
- description: 変更不要（156文字程度、KW含有、行動喚起あり）
- relatedArticles: `gas/gas-mail-automation` → `ai-api/claude-api-intro` に差し替え（同カテゴリ2 + 別カテゴリ1のルール準拠）
- ogImage: 可能であれば設定（未設定だが必須ではない）
- faq: 変更不要（3問で適切）
- tags: 変更不要
- schema.type: Article で問題なし
