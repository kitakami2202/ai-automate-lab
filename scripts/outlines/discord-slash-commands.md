# 記事ブリーフ: discord-slash-commands（リライト）

## 基本情報

| 項目 | 内容 |
|------|------|
| slug | discord-slash-commands |
| primary_kw | Discord スラッシュコマンド |
| secondary_kw | Discord Bot コマンド, Discord インタラクション |
| Layer | execution（Layer 2） |
| 記事タイプ | howto |
| クラスター | discord-bot |
| 想定文字数 | 3,000〜5,000文字 |
| ターゲット読者 | 中小企業の事務担当者・エンジニア初学者で、Discord Botにコマンド機能を追加したい人 |
| difficulty | intermediate |
| timeToRead | 15 |
| totalTime | PT60M |

## 現状記事の課題

| 課題 | 詳細 |
|------|------|
| 文字数不足 | 約400文字。目標3,000〜5,000文字に対して大幅に不足 |
| コードがGAS非対応 | `fetch()`/`async/await`はGASで動作しない。`UrlFetchApp`を使うべき |
| トークンハードコード | `APP_ID`、`BOT_TOKEN`がコード内に直書き |
| doPostなし | GASでインタラクションを受信する`doPost()`関数がない |
| エラーハンドリングなし | try-catchなし、レスポンスコード未確認 |
| 表が0個 | 品質ルール違反 |
| 内部リンク0本 | 本文中に関連記事へのリンクが0本 |
| 定義文不足 | H2-2以降に定義文がない |
| description不足 | 約60文字。120-160文字の範囲外 |
| FAQ回答が薄い | 3個で各1-2文。5個で各2-4文が必要 |
| ピラーリンクなし | howto記事冒頭のLayer 1導線がない |
| 前提条件テーブルなし | howtoテンプレートの必須要素が欠落 |
| 専門用語未説明 | 「インタラクション」「type: 1」「type: 4」が説明なし |

## 競合分析サマリ

### 上位5記事

| # | 記事 | 深さ | 鮮度 | 独自性 | 弱点 |
|---|------|------|------|--------|------|
| 1 | Zenn（kentyisapen・GASでBot） | コード付き | 2023/04 | GAS初心者向け | Webhook一方向のみ、スラッシュコマンド非対応 |
| 2 | Zenn（inaniwaudon・CF Workers+GAS） | コード豊富 | 2024/04 | 唯一のGAS+スラッシュコマンド | CF Workers併用が前提、署名検証を省略 |
| 3 | note.sarisia.cc（Slash Commands） | コード豊富 | 2021/01 | 署名検証が最も詳細 | Python+AWS Lambda、GAS不使用 |
| 4 | Qiita（iroha71・GASでBot） | コード中程度 | 2021/06 | Rich Embed例 | Webhook一方向のみ、古い |
| 5 | nabeliwo blog（GAS+Discord Bot） | アーキテクチャ解説 | 2024/03 | clasp+TypeScript構成 | 環境構築が複雑、初心者には難しい |

### 必須トピック（3記事以上でカバー）
- Discord Developer Portalでのアプリ/Bot作成
- Bot Token取得と認証設定
- メッセージ送信の基本コード
- コード例付きのHello World的実装

### 差別化チャンス（1-2記事のみカバー）
- GAS + スラッシュコマンドの組み合わせ（1記事のみ、CF Workers併用前提）
- スラッシュコマンドのAPI登録（2記事、curl例のみでGAS版なし）
- 3秒タイムアウト対策（2記事）

### 独自トピック候補（どの記事もカバーなし）
- GASのUrlFetchAppでスラッシュコマンドを登録するスクリプト
- GAS doPostによるインタラクション受信の完全実装
- エラーハンドリングの体系的実装（全競合が欠落 or 「省略」と明記）
- スプレッドシート連携の業務コマンド（在庫照会、売上確認）
- WebhookとBot方式の使い分け表
- GAS制限事項表（3秒応答制限、6分実行制限との関係）

## 差別化ポイント

| パターン | 採用 | 根拠 |
|---------|------|------|
| 実装コード差別化 | **採用** | GAS UrlFetchAppでのコマンド登録+doPostによるインタラクション受信。全競合がGAS版を提供していない |
| 実務経験差別化 | **採用** | 競合はHello Worldで終了。スプレッドシート連携の業務コマンド（/sales, /stock）を提示 |
| 網羅性差別化 | **採用** | Webhookとの比較表、トラブルシューティング表、GAS制限事項表を含む記事がゼロ |
| 構造化差別化 | **採用** | 前提条件テーブル、通知方式比較表、トラブルシューティング表で構造化 |

## 見出し構成案

### H2-1: この記事で作るもの（完成イメージ）
- スラッシュコマンドの定義
- WebhookとBot（スラッシュコマンド）の違いを表で比較
- 完成時にできること3点
- 前提条件テーブル（discord-bot-gasを読了済みを前提に）

### H2-2: 準備・環境構築
- Discord Developer Portalでアプリケーション作成
- Botの作成とBot Token取得
- OAuth2のスコープ設定（`applications.commands`、`bot`）
- Botをサーバーに招待（権限設定）
- GASプロジェクト作成・スクリプトプロパティに保存（BOT_TOKEN、APPLICATION_ID）
- GASをWebアプリとしてデプロイ
- 準備項目テーブル

### H2-3: 実装手順
- ステップ1: スラッシュコマンドの登録（UrlFetchAppでDiscord APIにPOST）
- ステップ2: インタラクション受信（doPost + PING/PONG応答 + コマンド処理）
- ステップ3: スプレッドシート連携コマンド（/sales で売上データ照会）
- ステップ4: Interactions Endpoint URLの登録手順

### H2-4: 動作確認・トラブルシューティング
- テスト手順（コマンド登録確認、スラッシュコマンド実行）
- よくあるエラー表（6行）

### H2-5: 応用・カスタマイズ例
- コマンドオプション（引数付きコマンド）
- 中小企業向けコマンドシナリオ3選
- GAS制限事項表

## FAQ案（5問）

| # | 質問 | 回答の方向性 |
|---|------|------------|
| 1 | スラッシュコマンドとWebhookの違いは何ですか？ | Webhookは一方向のメッセージ送信。スラッシュコマンドはユーザーがBotに指示を出し、Botが応答する双方向の仕組み。discord-bot-gasはWebhook方式 |
| 2 | スラッシュコマンドの登録数に制限はありますか？ | グローバルコマンド100個まで、サーバー固有コマンドもサーバーごとに100個まで。中小企業の用途では十分 |
| 3 | コマンド応答の3秒制限をどう対処しますか？ | GASのdoPostは3秒以内にレスポンスを返す必要がある。重い処理はtype 5（Deferred Response）で即座にACKを返し、後続処理をWebhookで送信 |
| 4 | GASでDiscord Botを作るのにサーバー費用はかかりますか？ | GASは無料。Discord Botの作成・運用も無料。サーバー費用ゼロで運用可能 |
| 5 | スラッシュコマンドで画像やファイルを送信できますか？ | テキストやEmbed内の画像URLは送信可能。ファイルの直接添付にはmultipart/form-dataリクエストが必要で、GASのUrlFetchAppでも対応可能 |

## 内部リンク候補

| リンク先 | 種別 | 配置場所 |
|---------|------|---------|
| gas/gas-basics | GASピラー | 冒頭導線 + まとめ |
| discord-bot/discord-bot-gas | 同カテゴリ | H2-1 比較表 + H2-5 |
| discord-bot/discord-spreadsheet-db | 同カテゴリ | H2-3 ステップ3 + H2-5 |
| gas/gas-slack-notification | 別カテゴリ | H2-5 比較 |

## ライターへの指示

1. **Bot Token/Application IDはスクリプトプロパティ管理必須**: `PropertiesService.getScriptProperties().getProperty('DISCORD_BOT_TOKEN')` を使用。ハードコード禁止
2. **全コードにtry-catch + レスポンスコード確認**: 全競合が欠落している差別化ポイント
3. **doPost実装はdiscord-spreadsheet-dbと整合性を取る**: 同クラスターの既存記事で`doPost(e)`パターンが確立済み。`ContentService.createTextOutput()`でJSON返却
4. **WebhookとBot方式の違いを明確に**: H2-1でWebhook（discord-bot-gas）との違いを表で示し、記事の位置づけを明確にする
5. **discord-botクラスターにはピラー記事がないため**: 冒頭導線はgas/gas-basicsへのリンクとする
6. **表を最低3つ**: 通知方式比較、前提条件/準備項目、トラブルシューティング
7. **GASで動作するコードに書き直す**: `UrlFetchApp.fetch()`を使用、`async/await`は使用禁止、同期処理で実装
