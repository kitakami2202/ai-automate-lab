# リファインメントブリーフ: gas-calendar

> 生成日: 2026-02-12
> 監査スコア: **71/100** → **REFINE**

---

## 1. 採点結果

| 軸 | 項目 | 得点 | 主な減点理由 |
|----|------|------|-------------|
| 1 | コンテンツ品質 | 14/20 | 「まとめ」「次のステップ」欠落、冒頭H3が孤立、応用セクションがリスト箇条書きのみで浅い |
| 2 | SEO/AEO品質 | 13/20 | descriptionが120文字未満（約112文字）、副KW「GAS カレンダー 自動登録」「GAS 予定 通知」のH2レベル配置なし、外部権威リンクなし |
| 3 | 内部リンク・導線 | 13/20 | relatedArticles全3本がgasカテゴリ（別カテゴリ1本必要）、他gas記事からの被リンク0本 |
| 4 | 可読性・文体 | 16/20 | 敬体統一OK、段落構造良好だが、「動作確認」「応用」セクション冒頭に定義文なし |
| 5 | 鮮度・正確性 | 15/20 | GAS制限値（日次トリガー上限等）未記載、公式ドキュメントへの外部リンクなし、料金/制限の時点表記なし、var使用（V8ランタイム非対応の古い書き方） |
| **合計** | | **71/100** | |

---

## 2. セクション別判定

| セクション | 判定 | 理由 |
|-----------|------|------|
| frontmatter | IMPROVE | description 120文字未満、relatedArticlesに別カテゴリ記事なし |
| 冒頭（blockquote + 導入） | KEEP | Layer 1リンク・結論ファーストは適切 |
| H3「この記事の前提」 | IMPROVE | H2の配下でない孤立H3。最初のH2直下に移動 |
| H2「この記事で作るもの」 | KEEP | 定義文あり、表形式で整理済み |
| H2「準備・カレンダーの確認」 | IMPROVE | 定義文はあるが内容が薄い。カレンダーIDの確認方法・共有カレンダーの権限設定を追記 |
| H2「実装手順」 | IMPROVE | var→const化、try-catch追加、Slack通知版のコード追加（副KW「GAS 予定 通知」強化） |
| H2「動作確認・トラブルシューティング」 | IMPROVE | 冒頭の定義文なし、GAS制限値の表を追記、公式ドキュメントリンク追加 |
| H2「応用・カスタマイズ例」 | IMPROVE | 冒頭の定義文なし、箇条書きのみで浅い。「まとめ」「次のステップ」を末尾に追加 |

---

## 3. 具体的な改善指示

### 3.1 frontmatter修正

**description**: 120-160文字に拡張する。

```yaml
description: "GAS（Google Apps Script）でGoogleカレンダーの予定を自動登録・通知する方法をステップバイステップで解説。スプレッドシートからカレンダーへの一括登録、翌日の予定をSlack・Discordに自動通知するスクリプトをコピペで動くコード付きで紹介します。"
```

**relatedArticles**: 3本目を別カテゴリに変更する。

```yaml
relatedArticles:
  - "gas/gas-basics"
  - "gas/gas-spreadsheet-automation"
  - "frameworks/where-to-automate-first"   # 別カテゴリに変更（gas-slack-notificationは本文リンクで十分）
```

### 3.2 構造修正

1. **冒頭のH3「この記事の前提」** をH2「この記事で作るもの」の直後、またはH2「準備・カレンダーの確認」の冒頭に移動してH3として適切にネスト

2. **末尾に「まとめ」セクションを追加**:
   - 3行程度で「何ができるようになったか」を要約
   - 構築した機能（一括登録・翌日通知）を箇条書き

3. **末尾に「次のステップ」導線を追加**:
   - gas-slack-notificationへの誘導（Slack通知を深堀り）
   - gas-form-automationへの誘導（フォーム回答 → カレンダー登録の連携）
   - frameworks/where-to-automate-firstへの誘導（自動化判断の参考）

### 3.3 コード品質改善

**ステップ1: registerEventsToCalendar関数**
- `var` → `const`/`let` に変更（GAS V8ランタイム対応）
- try-catchでエラーハンドリングを追加
- 日時バリデーション（無効な日付の検出）を追加

```javascript
function registerEventsToCalendar() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("予定一覧");
  const data = sheet.getDataRange().getValues();
  const calendar = CalendarApp.getDefaultCalendar();
  let count = 0;

  for (let i = 1; i < data.length; i++) {
    try {
      const title = data[i][0];
      const startTime = new Date(data[i][1]);
      const endTime = new Date(data[i][2]);
      const location = data[i][3] || "";
      const registered = data[i][4];

      if (!title || registered === "済") continue;
      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        console.warn(`${i + 1}行目: 日時のフォーマットが不正です`);
        continue;
      }

      const event = calendar.createEvent(title, startTime, endTime, {
        location: location
      });

      sheet.getRange(i + 1, 5).setValue("済");
      sheet.getRange(i + 1, 6).setValue(event.getId());
      count++;
    } catch (error) {
      console.error(`${i + 1}行目の登録でエラー: ${error.message}`);
    }
  }

  SpreadsheetApp.getUi().alert(`${count}件の予定をカレンダーに登録しました。`);
}
```

**ステップ2: notifyTomorrowEvents関数**
- 同様に `var` → `const`/`let` 化
- try-catch追加
- webhookUrlがnullの場合のガード追加

**ステップ3（新規追加）: Slack通知版**
- 副KW「GAS 予定 通知」を強化するため、Slack Webhook版のコード例を追加
- gas-slack-notificationへのリンクと「詳しいSlack連携の設定は[GAS × Slack通知](/articles/gas/gas-slack-notification)をご覧ください」の導線を設ける

### 3.4 業務深度の強化

**トラブルシューティング表に以下を追記:**

| 制約事項 | 内容 | 対策 |
|---------|------|------|
| カレンダーイベント作成上限 | 1日あたり5,000件（2026年2月時点） | 大量登録はバッチ分割を検討 |
| 実行時間制限 | 1回の実行は最大6分（無料アカウント） | 処理が重い場合はトリガーで分割 |
| トリガー数上限 | 1プロジェクトあたり最大20個 | 通知先を統合して節約 |

**公式ドキュメントへの外部リンク追加:**
- [Google Apps Script の割り当てと制限](https://developers.google.com/apps-script/guides/services/quotas) にリンクし「2026年2月時点」と時点を明記
- [CalendarApp リファレンス](https://developers.google.com/apps-script/reference/calendar/calendar-app) にリンク

### 3.5 SEO・AEO強化

**定義文の追加:**
- 「動作確認・トラブルシューティング」セクション冒頭: 「動作確認とは、登録スクリプトを少量のテストデータで手動実行し、カレンダーに正しく予定が反映されるか検証する作業です。」
- 「応用・カスタマイズ例」セクション冒頭: 「応用・カスタマイズとは、本記事の基本スクリプトを拡張し、共有カレンダー連携や月間稼働集計など実務に合わせた機能を追加することです。」

**副KWの本文配置:**
- H2「実装手順」の冒頭またはリード文で「GAS カレンダー 自動登録」を自然に含める（例: 「ここからGASでカレンダーへの自動登録を実装します」）
- H2レベルのセクションで「GAS 予定 通知」を含めた見出しまたはリード文を追加

**準備セクション強化:**
- カレンダーIDの確認方法（Google カレンダー → 設定 → マイカレンダー → カレンダーの統合）を画面遷移で記載
- 共有カレンダーを使う場合の権限設定についても補足

---

## 4. 変更しない箇所（KEEP）

- faq（3問、最低ラインだが質問・回答の品質は良好）
- タイトル（SEO的に適切、主KW「GAS Googleカレンダー 連携」を含む）
- Layer 1への冒頭blockquoteリンク（適切な導線）
- Discord Webhook URLのPropertiesService利用（セキュリティ適切）
- 予定一覧テーブルのレイアウト（分かりやすい）
- トリガー設定テーブル（実用的）

---

## 5. 期待されるリファイン後スコア

| 軸 | 現在 | 期待 |
|----|------|------|
| コンテンツ品質 | 14 | 18 |
| SEO/AEO品質 | 13 | 18 |
| 内部リンク・導線 | 13 | 18 |
| 可読性・文体 | 16 | 19 |
| 鮮度・正確性 | 15 | 19 |
| **合計** | **71** | **92** |
