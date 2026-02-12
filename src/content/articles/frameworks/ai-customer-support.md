---
title: "AIカスタマーサポート自動化の始め方｜FAQ Bot・メール応答の構築手順"
description: "AIカスタマーサポート自動化を3パターンで解説。DifyでFAQ Bot構築、GAS＋Claude APIでメール自動応答、エスカレーション設計まで、中小企業が月0〜1,000円（2026年2月時点）で顧客対応を効率化する手順を紹介します。"
category: "frameworks"
tags: ["AI自動化", "カスタマーサポート", "チャットBot", "FAQ", "問い合わせ"]
publishedAt: 2026-02-12
updatedAt: 2026-02-12
author: "れん"
difficulty: "beginner"
timeToRead: 15
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "月0〜1,000円（2026年2月時点）"
  totalTime: "PT60M"
faq:
  - question: "AI対応と人間対応をどう切り分けますか？"
    answer: "よくある質問（FAQ）はAIが即時回答し、FAQにない複雑な問い合わせは「担当者に確認します」と回答して人間にエスカレーションする仕組みが基本です。AIの回答に自信度を設定し、低い場合は自動で人間に引き継ぐ設計も可能です。"
  - question: "顧客に「AIが対応している」と伝えるべきですか？"
    answer: "はい、透明性の観点からAI対応であることを明示することを推奨します。「AIアシスタントがお答えします。詳しいお問い合わせは担当者にお繋ぎします」のような表記が一般的です。"
  - question: "誤った回答をしてしまうリスクは？"
    answer: "リスクはゼロではありません。対策として、AIの回答ソースをFAQデータに限定するRAG（検索拡張生成）方式を採用する、回答の末尾に「詳細は担当者にお問い合わせください」を付ける、重要な案件は自動で人間にエスカレーションする仕組みを入れることを推奨します。"
  - question: "AIカスタマーサポートの導入費用はどのくらいですか？"
    answer: "Difyの無料プランとClaude APIのHaikuモデルを組み合わせれば、月0〜1,000円程度で運用できます（2026年2月時点）。問い合わせ件数が月100件以下の中小企業であれば、無料枠内に収まるケースも多いです。"
  - question: "小規模な会社でもAIカスタマーサポートを導入できますか？"
    answer: "はい、従業員数名の会社でも導入可能です。この記事で紹介するDify FAQ Botは、プログラミング不要で30分ほどで構築できます。まずは社内向けのFAQ対応から小さく始めて、効果を確認してから顧客向けに拡大するのが確実です。"
relatedArticles:
  - "frameworks/ai-business-overview"
  - "frameworks/tool-selection-guide"
  - "no-code/dify-intro"
draft: false
---

> この記事は[AIで自動化できる業務一覧](/articles/frameworks/ai-business-overview)の実装編です。
> ツール選定の基本は[自動化ツール選定ガイド](/articles/frameworks/tool-selection-guide)をご覧ください。

この記事では、AIを使ったカスタマーサポートの自動化を3つのパターンで解説します。
FAQ Bot・メール自動応答・有人エスカレーションを組み合わせることで、中小企業の顧客対応を自動化できます。
有人エスカレーションとは、AIが対応できない問い合わせを人間の担当者に引き継ぐ仕組みのことです。
問い合わせ対応の工数を大幅に削減できる点が、導入の大きなメリットです。

### この記事の前提

| 項目 | 内容 |
|------|------|
| 対象 | 問い合わせ対応に月10時間以上費やしている中小企業 |
| 所要時間 | パターンにより30〜60分 |
| 費用 | 月0〜1,000円（2026年2月時点） |
| 完成物 | AIカスタマーサポート体制（FAQ Bot or メール自動応答） |

## AIカスタマーサポート自動化とは

AIカスタマーサポート自動化とは、AIが問い合わせの初期対応を自動で行い、人間の対応時間を削減する仕組みのことです。
よくある質問への回答をAIに任せることで、担当者は複雑な案件に集中できるようになります。

中小企業が導入しやすい方法は、大きく3つのパターンに分けられます。

| パターン | ツール | 難易度 | 所要時間 | 月額費用（2026年2月時点） | 適したケース |
|---------|--------|--------|---------|------------------------|------------|
| FAQ Bot | [Dify](https://dify.ai/) | 低 | 約30分 | 0円〜（無料プランあり） | 社内外のよくある質問への自動回答 |
| チャット対応Bot | Discord / LINE | 中 | 約60分 | 0〜500円 | リアルタイムの対話型サポート |
| メール自動応答 | GAS + Claude API | 中 | 約45分 | 約500〜1,000円 | 問い合わせメールの自動返信 |

この記事では、特に始めやすいパターン1（Dify FAQ Bot）とパターン3（GASメール自動応答）の実装手順を詳しく解説します。
パターン2の具体的な実装手順は[Discord × AI Bot](/articles/discord-bot/discord-ai-bot)と[GAS × LINE Bot](/articles/gas/gas-line-bot)をご覧ください。

## DifyでFAQ Botを構築する

FAQ Botとは、あらかじめ登録したFAQデータをもとに、AIが質問に自動回答するチャットボットのことです。
[Dify](/articles/no-code/dify-intro)を使えば、プログラミング不要で30分ほどで構築できます。

### Difyプロジェクトの作成

1. [Dify公式サイト](https://dify.ai/)にアクセスし、アカウントを作成します
2. ダッシュボードの「アプリを作成」をクリックします
3. 「チャットボット」を選択し、アプリ名を「カスタマーサポートBot」などに設定します
4. 「作成」ボタンをクリックしてプロジェクトを開きます

### FAQデータのアップロードとプロンプト設定

まず、FAQデータをナレッジとして登録します。

1. 左メニューの「ナレッジ」を開きます
2. 「ナレッジを作成」をクリックします
3. FAQデータをアップロードします（対応形式: PDF、CSV、TXT、Markdown）
4. インデックス方式は「高品質」を選択します（RAG方式で回答精度が向上します）

RAG（Retrieval-Augmented Generation、検索拡張生成）とは、質問に関連するFAQデータを検索してからAIに回答を生成させる仕組みです。
AIが自分の知識だけで回答するのではなく、登録されたFAQに基づいて回答するため、正確性が高まります。

次に、チャットボットのプロンプトを設定します。

1. アプリの「オーケストレーション」画面を開きます
2. 「コンテキスト」欄で、先ほど作成したナレッジを追加します
3. 「システムプロンプト」に以下を入力します

```text
あなたは当社のカスタマーサポートAIです。
アップロードされたFAQに基づいて回答してください。
- 敬語で丁寧に回答する
- FAQにない質問は「担当者にお問い合わせください（TEL: 03-XXXX-XXXX）」と回答
- 回答の根拠となるFAQ項目を末尾に記載
- 「わかりません」とは言わず、関連する情報があれば提示する
```

**ポイント:**

- 電話番号やメールアドレスは自社の情報に書き換えてください
- 「FAQにない質問」への応答ルールが、誤回答防止のカギになります
- 回答根拠の記載を指示することで、利用者が情報の出典を確認できます

### Webサイトへの埋め込み

1. 「公開」ボタンをクリックし、Webアプリとして公開します
2. 「埋め込みコード」タブからiframeコードをコピーします
3. 自社のWebサイトやポータルのHTMLにコードを貼り付けます

```html
<!-- Dify チャットボット埋め込み例 -->
<iframe
  src="https://udify.app/chatbot/YOUR_APP_ID"
  style="width: 100%; height: 600px; border: none;"
  allow="microphone"
></iframe>
```

**ポイント:**

- `YOUR_APP_ID` はDifyの公開設定画面に表示されるIDに置き換えてください
- 社内ポータル（Google Sites、Notion等）にも同様に埋め込み可能です
- 無料プラン（Sandbox）では200メッセージクレジットの制限があります（[Dify料金ページ](https://dify.ai/pricing)で最新情報を確認してください、2026年2月時点）

## GASでメール自動応答を構築する

メール自動応答とは、GAS（Google Apps Script）とAI APIを組み合わせて、問い合わせメールに自動で返信する仕組みのことです。
Gmailに届いた問い合わせメールをAIが読み取り、適切な返信文を生成します。

### GASプロジェクトの準備

1. [Google Apps Script](https://script.google.com/)にアクセスし、「新しいプロジェクト」を作成します
2. プロジェクト名を「メール自動応答Bot」に設定します
3. 左メニューの歯車アイコン（プロジェクトの設定）を開きます
4. 「スクリプト プロパティ」に以下を追加します

| プロパティ名 | 値 |
|-------------|-----|
| ANTHROPIC_API_KEY | [Anthropic Console](https://console.anthropic.com/)で取得したAPIキー |

API利用料金は、Claude Haiku 4.5の場合、月100件の問い合わせ処理で約500円です（[Anthropic API料金ページ](https://www.anthropic.com/pricing)で最新情報を確認してください、2026年2月時点）。

### コード全文と解説

以下のコードをGASエディタに貼り付けてください。

```javascript
/**
 * 問い合わせメールにAIで自動応答
 * Gmailの「問い合わせ」ラベルが付いた未読メールを検索し、AIで返信を生成
 */
function autoReplyWithAi() {
  var threads = GmailApp.search("is:unread label:問い合わせ newer_than:1h");
  var apiKey = PropertiesService.getScriptProperties().getProperty("ANTHROPIC_API_KEY");

  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages();
    var lastMessage = messages[messages.length - 1];
    var from = lastMessage.getFrom();

    // 自分のメールには返信しない
    if (from.indexOf(Session.getActiveUser().getEmail()) !== -1) continue;

    var body = lastMessage.getPlainBody();

    try {
      // AIで回答を生成
      var reply = generateReply(apiKey, body);

      // 自動返信
      lastMessage.reply(reply);
      threads[i].markRead();
    } catch (e) {
      // エラー時はログに記録し、次のメールの処理を継続
      console.error("自動返信エラー: " + e.message);
    }
  }
}

function generateReply(apiKey, inquiry) {
  var payload = {
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: "カスタマーサポート担当として、丁寧に回答してください。不明点は「確認の上ご連絡します」と記載。200文字以内。",
    messages: [{ role: "user", content: "以下の問い合わせに回答してください：\n\n" + inquiry }]
  };

  var options = {
    method: "post",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch("https://api.anthropic.com/v1/messages", options);
  var result = JSON.parse(response.getContentText());

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.content[0].text;
}
```

**ポイント:**

- `label:問い合わせ` はGmailの日本語ラベル名をそのまま使えます。事前にGmailで「問い合わせ」ラベルを作成してください
- APIキーは `PropertiesService` から取得しており、コードにハードコードしていません
- try-catch でエラー時も処理が止まらず、次のメールの処理を継続します
- `newer_than:1h` により直近1時間の未読メールのみを対象にしています

### トリガー設定と動作確認

GASのトリガーを設定して、定期的に自動実行されるようにします。

1. GASエディタの左メニューから「トリガー」（時計アイコン）を開きます
2. 「トリガーを追加」をクリックします
3. 以下のように設定します

| 設定項目 | 値 |
|---------|-----|
| 実行する関数 | autoReplyWithAi |
| イベントのソース | 時間主導型 |
| 時間ベースのトリガーのタイプ | 分ベースのタイマー |
| 間隔 | 15分おき |

4. テスト用に自分のアドレスから「問い合わせ」ラベル付きのメールを送信します
5. GASエディタで `autoReplyWithAi` を手動実行し、返信が届くことを確認します

## 運用設計 — エスカレーションとトラブル対策

運用設計とは、AIと人間の役割分担やトラブル時の対処方法を事前に決めておくことです。
AIカスタマーサポートを安定して稼働させるために欠かせない工程です。

### AI/人間の切り分け設計

AIが回答できない場合に人間にエスカレーションする仕組みが重要です。以下のフローを参考に、自社の運用ルールを設計してください。

```text
├─ AIが回答できるか？
│   ├─ はい → AIが即時回答
│   └─ いいえ → 「担当者に確認します」と回答
│       └─ 管理者にSlack/Discord通知
│           └─ 担当者が手動で対応
```

AIと人間の対応範囲を明確にしておくことで、顧客対応の自動化がスムーズに進みます。

| 対応範囲 | 担当 | 具体例 |
|---------|------|--------|
| よくある質問 | AI | 営業時間、料金プラン、サービス内容 |
| 個別の相談 | 人間 | 見積もり依頼、カスタマイズ相談 |
| クレーム対応 | 人間 | 品質トラブル、返金対応 |
| 技術的な質問 | AI → 人間 | AIが一次回答し、解決しなければ担当者へ |

### トラブルシューティング

| 問題 | 原因 | 解決策 |
|------|------|--------|
| AIの回答が的外れ | FAQデータ不足 | FAQを充実させ、systemプロンプトを改善 |
| 応答が遅い | モデルの選択 | Claude Haiku 4.5など軽量モデルを使用しているか確認 |
| 同じ問い合わせに重複返信 | 既読処理の不備 | `markRead()` で処理済みを管理 |
| Gmailラベルでメールが検索されない | ラベル名の不一致 | Gmailで「問い合わせ」ラベルが正しく作成されているか確認 |
| API呼び出しでエラーが発生 | APIキーの設定ミス | スクリプトプロパティの `ANTHROPIC_API_KEY` を再確認 |

## まとめと次のステップ

この記事では、AIカスタマーサポート自動化の3つのパターンを紹介しました。

| パターン | 導入の手軽さ | 適した企業 |
|---------|------------|-------------------|
| FAQ Bot（Dify） | プログラミング不要・30分で構築 | まず小さく試したい企業 |
| チャット対応Bot（Discord/LINE） | 既存チャネルに統合可能 | チャットで問い合わせを受けている企業 |
| メール自動応答（GAS） | Gmailと直接連携・カスタマイズ自由 | メールでの問い合わせが多い企業 |

まずはパターン1のDify FAQ Botを社内向けに構築し、効果を確認してから顧客向けに展開するのが確実です。

AIカスタマーサポートは、[AIで自動化できる業務一覧](/articles/frameworks/ai-business-overview)の中でも導入効果が高い領域です。
自社に合ったツール選定の考え方は[自動化ツール選定ガイド](/articles/frameworks/tool-selection-guide)で詳しく解説しています。
