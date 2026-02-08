---
title: "Google Apps Script入門 - 基礎から始める業務自動化"
description: "Google Apps Script（GAS）の基本的な使い方を初心者向けに解説。スプレッドシートやGmailの自動化を実現する第一歩を踏み出しましょう。"
category: "gas"
tags: ["GAS", "Google Apps Script", "入門", "自動化"]
publishedAt: 2025-01-15
updatedAt: 2025-01-15
author: "れん"
difficulty: "beginner"
timeToRead: 15
layer: "entry"
articleType: "pillar"
schema:
  type: "HowTo"
  totalTime: "PT30M"
  estimatedCost: "0"
relatedArticles: ["gas/gas-spreadsheet-automation", "gas/gas-line-bot", "gas/gas-slack-notification"]
draft: false
faq:
  - question: "Google Apps Scriptとは何ですか？"
    answer: "Google Apps Script（GAS）は、Googleが提供する無料のスクリプト環境です。スプレッドシート、Gmail、カレンダーなどのGoogleサービスをJavaScriptベースのコードで自動化できます。"
  - question: "GASを使うのにプログラミング経験は必要ですか？"
    answer: "基本的なプログラミング知識があると有利ですが、初心者でも始められます。JavaScriptの基本構文を学びながら、簡単なスクリプトから始めることをおすすめします。"
  - question: "GASの実行制限はありますか？"
    answer: "はい。無料のGoogleアカウントでは1回の実行時間が6分、1日のトリガー実行回数が90分までなどの制限があります。Google Workspaceアカウントではこれらの制限が緩和されます。"
---

## Google Apps Scriptとは

Google Apps Script（GAS）は、Googleが提供するクラウドベースのスクリプトプラットフォームです。JavaScriptをベースとしており、Googleの各種サービスを自動化・連携させることができます。

## GASでできること

GASを使うと、以下のような自動化が実現できます：

- **スプレッドシートの自動処理**: データの集計、整形、レポート生成
- **メールの自動送信**: 定期的な通知やレポートの配信
- **カレンダー管理**: 予定の自動登録や通知
- **フォーム連携**: 回答データの自動処理

## 最初のスクリプトを書いてみよう

### ステップ1: スクリプトエディタを開く

Googleスプレッドシートを開き、「拡張機能」→「Apps Script」を選択します。

### ステップ2: Hello Worldを実行

```javascript
function myFirstScript() {
  Logger.log('Hello, GAS!');
  SpreadsheetApp.getUi().alert('Hello, GAS!');
}
```

### ステップ3: トリガーを設定する

時間ベースのトリガーを使えば、スクリプトを定期的に自動実行できます。

```javascript
function createTrigger() {
  ScriptApp.newTrigger('myFirstScript')
    .timeBased()
    .everyHours(1)
    .create();
}
```

## まとめ

GASは無料で始められる強力な自動化ツールです。まずは簡単なスクリプトから始めて、徐々に複雑な自動化に挑戦していきましょう。
