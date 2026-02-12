---
title: "Claude Codeで業務自動化スクリプトを作る方法【初心者30分】"
description: "Claude Code（Anthropic公式CLI）で業務自動化スクリプトを作る手順を初心者向けに解説。インストールからCSV自動集計・ファイル整理の実装まで、自然言語で指示するだけで完成。実際にこのサイト構築で使った一次情報をもとに効率的なプロンプトのコツも紹介します。"
category: "ai-api"
tags: ["Claude Code", "Anthropic", "業務自動化", "AI", "Python"]
publishedAt: 2026-02-11
updatedAt: 2026-02-12
author: "れん"
difficulty: "beginner"
timeToRead: 15
layer: "execution"
articleType: "howto"
schema:
  type: "HowTo"
  estimatedCost: "0円（API従量課金は別途）"
  totalTime: "PT30M"
faq:
  - question: "Claude Codeは無料で使えますか？"
    answer: "Claude Code自体は無料でインストールできます。利用にはAnthropicのAPIキー（従量課金）またはClaude Max/Teamプラン（月額制）が必要です。APIキー利用の場合、一般的な業務スクリプト作成なら1回あたり数円〜数十円程度です。Maxプランは月額$100〜、Teamプランは月額$30/人です（2026年2月時点。最新料金はAnthropic公式をご確認ください）。"
  - question: "プログラミング経験がなくても使えますか？"
    answer: "基本的なターミナル操作（コマンド入力と実行）ができれば利用可能です。Claude Codeは自然言語（日本語）で指示するだけでコードを生成・実行してくれるため、プログラミングの文法を覚える必要はありません。ただし、生成されたコードの概要を理解できると、より効率的に活用できます。"
  - question: "Claude CodeとClaude APIの違いは何ですか？"
    answer: "Claude APIはプログラムからAIを呼び出すインターフェースで、自分でコードを書く必要があります。Claude Codeはターミナル上で対話しながらAIにコードの生成・編集・実行を任せられるツールです。APIの知識がなくても、日本語で指示するだけで自動化スクリプトを作成できます。"
  - question: "Windows・Macどちらでも使えますか？"
    answer: "はい、どちらでも使えます。Node.js 18以上がインストールされていれば、Windows・Mac・Linuxのいずれでも動作します。WindowsではPowerShellまたはGit Bashから利用してください。"
  - question: "Claude CodeとGitHub Copilotの違いは何ですか？"
    answer: "GitHub CopilotはエディタのAI補完が中心で、コード編集中に候補を提示します。Claude Codeはターミナルから対話形式でコードの生成・編集・実行をまとめて行えるため、非エンジニアでも業務スクリプトを作成しやすいのが特徴です。"
relatedArticles:
  - "ai-api/ai-api-overview"
  - "ai-api/claude-api-intro"
  - "gas/gas-basics"
draft: false
---

> この記事は[AI APIを業務に組み込む方法](/articles/ai-api/ai-api-overview)の実践編です。
> 「AI APIとは何か」から知りたい方は、先にそちらをご覧ください。

Claude Codeを使えば、プログラミング経験がなくても自然言語の指示だけで業務自動化スクリプトを作成できます。
このサイト自体もClaude Codeで構築しました。
その実体験をもとに、本当に使えるプロンプトのコツをお伝えします。
この記事では、Claude Codeの使い方をインストールからCSV集計スクリプトの完成まで約30分で解説します。
AIコーディング全般を知りたい方は[非エンジニア向けAIコーディング入門](/articles/ai-api/ai-coding-non-engineer)を、本記事ではClaude Codeに特化した実装手順をお伝えします。

### この記事の前提

| 項目 | 内容 |
|------|------|
| 必要なアカウント | Anthropicアカウント（[console.anthropic.com](https://console.anthropic.com)で無料作成） |
| 必要な知識 | ターミナルの基本操作（コマンド入力・実行ができればOK） |
| 所要時間 | 約30分 |
| 完成物 | CSV売上データの自動集計スクリプト / ファイル整理スクリプト |

## この記事で作るもの

この記事では、Claude Codeを使って2つの業務自動化スクリプトを作成します。

Claude Codeとは、Anthropicが提供するターミナルベースのAIコーディングアシスタントです。
チャット形式で日本語の指示を出すだけで、コードの生成・編集・実行をAIがまとめておこなってくれます。
内部でClaude Sonnet 4.5またはOpus 4.6を使用します（2026年2月時点）。

| スクリプト | 内容 | 対象業務 |
|-----------|------|---------|
| CSV売上集計 | 月別・商品別にCSVデータを集計しレポート出力 | 経理・営業 |
| ファイル自動整理 | フォルダ内のファイルを日付・種類別に自動振り分け | 総務・事務 |

### なぜClaude Codeなのか

従来、業務自動化スクリプトを作るにはプログラミングの知識が必要でした。
Claude Codeを使うと、開発プロセスが大きく変わります。

| 項目 | 従来の方法 | Claude Code |
|------|-----------|------------|
| 必要なスキル | Python等の文法知識 | 日本語で指示できればOK |
| 開発時間 | 数時間〜数日 | 数分〜30分 |
| デバッグ | エラーを自分で読み解く | AIが自動でエラーを修正 |
| カスタマイズ | コードを理解して修正 | 「〇〇に変えて」と指示 |

筆者はこのサイト（AI Automate Lab）の構築・記事生成パイプラインをClaude Codeで開発しました。
Astroのセットアップからデプロイまで、すべて自然言語指示で作成しました。

## 準備・環境構築

環境構築とは、Claude Codeの使い方を実践するために必要なソフトウェアとアカウントを準備する作業のことです。

### Node.jsのインストール

Node.jsとは、JavaScriptをPC上で実行するための環境です。
Claude CodeはNode.js上で動作します。
以下の手順でインストールしてください。

1. [Node.js公式サイト](https://nodejs.org/)にアクセスします
2. LTS版（推奨版）をダウンロードしてインストールします
3. ターミナルで以下を実行し、バージョンが表示されれば完了です

```bash
node --version
# v22.x.x と表示されればOK
```

### Claude Codeのインストール

npm（Node Package Manager）とは、Node.jsのパッケージ管理ツールです。
ターミナルで以下のコマンドを実行してClaude Codeをインストールします。

```bash
npm install -g @anthropic-ai/claude-code
```

インストール後、以下のコマンドで起動を確認します。

```bash
claude
```

初回起動時にAnthropicアカウントでのログインを求められます。
ブラウザが自動的に開くので、ログインして認証を完了してください。

### APIキーの設定（API利用の場合）

Claude MaxまたはTeamプランを利用していない場合は、APIキーでの利用となります。
Claude Maxプランは月額$100〜、Teamプランは月額$30/人です（2026年2月時点。最新料金は[Anthropic公式](https://www.anthropic.com/pricing)をご確認ください）。

1. [Anthropic Console](https://console.anthropic.com)でAPIキーを作成します
2. 環境変数に設定します

```bash
# Mac/Linux
export ANTHROPIC_API_KEY=sk-ant-your-api-key-here

# Windows（PowerShell）
$env:ANTHROPIC_API_KEY="sk-ant-your-api-key-here"
```

**重要:** APIキーをコードに直接書かないでください。
環境変数での管理が基本です。
詳しくは[Claude API入門](/articles/ai-api/claude-api-intro)の「APIキーの安全な管理方法」をご覧ください。

料金はAPIの従量課金制です。一般的な業務スクリプト作成では、1セッションあたり数円〜数十円程度です（2026年2月時点。最新料金は[Anthropic公式料金ページ](https://www.anthropic.com/pricing)をご確認ください）。

### 準備物チェックリスト

| 準備物 | 確認方法 | 備考 |
|--------|---------|------|
| Node.js 18以上 | `node --version` | [公式サイト](https://nodejs.org/)からインストール |
| Claude Code | `claude --version` | `npm install -g @anthropic-ai/claude-code` |
| Anthropicアカウント | 初回起動時に認証 | [console.anthropic.com](https://console.anthropic.com) |

## 実装手順

実装手順とは、Claude Codeを使って実際に業務自動化スクリプトを作成する一連の作業のことです。

### ステップ1: Claude Codeの基本操作を覚える

ターミナルで `claude` と入力して対話モードを起動します。
日本語でそのまま指示を出せます。

```
> こんにちは。現在の日付と時刻を表示するPythonスクリプトを作ってください。
```

Claude Codeはファイルの作成・編集・実行をまとめておこないます。
指示を出すだけでPythonファイルを自動作成し、実行結果まで表示してくれます。

**効率的な指示のコツ:**

筆者がこのサイト構築で学んだ、Claude Codeへの指示のコツを紹介します。

| コツ | 悪い例 | 良い例 |
|------|--------|--------|
| 完成物を具体的に伝える | 「CSVを処理して」 | 「sales.csvを月別に集計してsummary.csvに出力して」 |
| 入出力を明示する | 「データを整理して」 | 「input/のExcelを読み込みoutput/にCSVで出力して」 |
| 制約を伝える | 「スクリプトを作って」 | 「Python標準ライブラリのみで動くスクリプトを作って」 |
| 段階的に進める | 一度に全部指示する | 「まず読み込み部分だけ」→「次に集計処理を追加」 |

### ステップ2: CSV売上集計スクリプトを作る

中小企業でよくある「月次の売上CSVを集計してレポートを作る」作業を自動化しましょう。

まず、サンプルデータを用意します。Claude Codeに以下のように指示します。

```
> 以下の形式のサンプル売上データCSVを作成してください。
> - カラム: 日付, 商品名, 数量, 単価
> - 期間: 2026年1月〜2月
> - 商品: 商品A, 商品B, 商品C
> - 20行程度のサンプルデータ
> ファイル名: sales_data.csv
```

Claude Codeに作成を任せることもできますが、手元で試したい方は以下のサンプルデータをsales_data.csvとして保存してください。

```csv
日付,商品名,数量,単価
2026-01-05,商品A,10,1500
2026-01-12,商品B,5,3000
2026-01-20,商品C,8,2000
2026-01-28,商品A,12,1500
2026-02-03,商品B,7,3000
2026-02-10,商品C,15,2000
2026-02-15,商品A,20,1500
2026-02-18,商品B,3,3000
2026-02-25,商品C,10,2000
```

続けて、集計スクリプトの作成を指示します。

```
> sales_data.csvを読み込んで、以下の集計を行うPythonスクリプトを作ってください。
> - 月別の売上合計
> - 商品別の売上合計
> - 結果をsales_summary.csvに出力
> - 集計結果をターミナルにも表形式で表示
> - Python標準ライブラリのみ使用（pip install不要にしたい）
```

以下はClaude Codeが生成するスクリプトの例です。

```python
import csv
from collections import defaultdict
from datetime import datetime

def aggregate_sales(input_file: str, output_file: str) -> None:
    """売上データを月別・商品別に集計する"""
    monthly_sales = defaultdict(int)
    product_sales = defaultdict(int)

    with open(input_file, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            date = datetime.strptime(row["日付"], "%Y-%m-%d")
            month_key = date.strftime("%Y年%m月")
            amount = int(row["数量"]) * int(row["単価"])

            monthly_sales[month_key] += amount
            product_sales[row["商品名"]] += amount

    # ターミナルに表示
    print("\n【月別売上】")
    print(f"{'月':>10} {'売上合計':>12}")
    print("-" * 24)
    for month, total in sorted(monthly_sales.items()):
        print(f"{month:>10} {total:>10,}円")

    print("\n【商品別売上】")
    print(f"{'商品名':>10} {'売上合計':>12}")
    print("-" * 24)
    for product, total in sorted(product_sales.items()):
        print(f"{product:>10} {total:>10,}円")

    # CSVに出力
    with open(output_file, "w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["区分", "項目", "売上合計"])
        for month, total in sorted(monthly_sales.items()):
            writer.writerow(["月別", month, total])
        for product, total in sorted(product_sales.items()):
            writer.writerow(["商品別", product, total])

    print(f"\n集計結果を {output_file} に保存しました。")

if __name__ == "__main__":
    aggregate_sales("sales_data.csv", "sales_summary.csv")
```

**このコードのポイント:**

- Python標準ライブラリ（`csv`, `collections`, `datetime`）のみで動作するため、追加インストールが不要です
- `defaultdict`（未登録のキーにデフォルト値を自動設定する辞書）で集計処理を簡潔に実装しています
- エンコーディングをUTF-8で指定し、日本語の文字化けを防いでいます

スクリプトの実行もClaude Codeに任せられます。

```
> 作成したスクリプトを実行してください。
```

### ステップ3: ファイル自動整理スクリプトを作る

デスクトップやダウンロードフォルダに溜まったファイルを自動で整理するスクリプトを作ります。

```
> 指定フォルダ内のファイルを拡張子別にサブフォルダへ自動整理するPythonスクリプトを
> 作ってください。
> - 対象: 指定フォルダ直下のファイル
> - 振り分け: PDF→pdf/ 画像(jpg,png)→images/ Excel/CSV→data/ その他→others/
> - 実行前に振り分け内容のプレビューを表示し、確認後に実行する
> - ログをfile_organize_log.txtに出力
> - Python標準ライブラリのみ使用
```

以下はClaude Codeが生成するスクリプトの例です。

```python
import shutil
import sys
from datetime import datetime
from pathlib import Path

RULES = {
    "pdf": [".pdf"],
    "images": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    "data": [".xlsx", ".xls", ".csv", ".tsv"],
    "others": [],
}

def get_dest_folder(ext: str) -> str:
    """拡張子から振り分け先フォルダ名を返す"""
    for folder, extensions in RULES.items():
        if ext.lower() in extensions:
            return folder
    return "others"

def organize_files(target_dir: str) -> None:
    """ファイルを拡張子別にサブフォルダへ整理する"""
    target = Path(target_dir)
    if not target.is_dir():
        print(f"エラー: {target_dir} はフォルダではありません。")
        return

    files = [f for f in target.iterdir() if f.is_file()]
    if not files:
        print("整理対象のファイルがありません。")
        return

    # プレビュー表示
    plan: dict[str, list[str]] = {}
    for f in files:
        dest = get_dest_folder(f.suffix)
        plan.setdefault(dest, []).append(f.name)

    print("【振り分けプレビュー】")
    for folder, names in sorted(plan.items()):
        print(f"\n  {folder}/")
        for name in names:
            print(f"    ├── {name}")

    confirm = input("\nこの内容で実行しますか？ (y/n): ")
    if confirm.lower() != "y":
        print("キャンセルしました。")
        return

    # 実行
    log_lines = [f"実行日時: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"]
    moved_count = 0

    for f in files:
        dest_folder = target / get_dest_folder(f.suffix)
        dest_folder.mkdir(exist_ok=True)
        shutil.move(str(f), str(dest_folder / f.name))
        log_lines.append(f"{f.name} -> {dest_folder.name}/\n")
        moved_count += 1

    log_path = target / "file_organize_log.txt"
    with open(log_path, "a", encoding="utf-8") as log:
        log.writelines(log_lines)

    print(f"\n{moved_count}件のファイルを整理しました。ログ: {log_path}")

if __name__ == "__main__":
    folder = sys.argv[1] if len(sys.argv) > 1 else "."
    organize_files(folder)
```

**このコードのポイント:**

- 実行前にプレビューを表示し、確認を求める安全設計です
- `pathlib`（ファイルパスをOS差異なく扱うPython標準ライブラリ）でWindows・Macどちらでも動作します
- ログを追記モードで出力するため、実行履歴が残ります

カスタマイズしたい場合は、Claude Codeに続けて指示するだけです。

```
> 振り分けルールにWordファイル(.docx)をdocuments/フォルダに追加してください。
```

コードを理解していなくても日本語で修正を依頼できるのがClaude Codeの強みです。

## 動作確認・トラブルシューティング

トラブルシューティングとは、Claude Codeの利用時に発生するエラーや問題を解決する作業のことです。

| エラー | 原因 | 解決策 |
|--------|------|--------|
| `npm: command not found` | Node.jsが未インストール | [Node.js公式サイト](https://nodejs.org/)からLTS版をインストール |
| `claude: command not found` | Claude Codeが未インストール | `npm install -g @anthropic-ai/claude-code` を実行 |
| 認証エラー | ログイン未完了またはAPIキー未設定 | `claude` を再起動して認証をやり直す |
| `Permission denied` | ファイル操作の権限不足 | 対象フォルダの権限を確認し、管理者権限で再実行 |
| 生成コードが動かない | AI生成コードの不具合 | エラーメッセージをそのままClaude Codeに伝えると自動修正される |

スクリプト実行時にエラーが出ても、慌てる必要はありません。
Claude Codeにそのまま伝えれば、原因の特定から修正まで自動でおこなってくれます。
筆者もサイト構築中に何度もこの方法でエラーを解消しました。

```
> エラーが出ました。修正してください。
```

## 応用・カスタマイズ例

応用・カスタマイズとは、本記事で学んだClaude Codeの使い方を他の業務にも展開することです。

Claude Codeを使ったAIスクリプト自動化は、CSV集計やファイル整理以外にも幅広い業務に応用できます。

- **請求書PDFの自動生成** — 顧客リストから請求書を一括作成する
- **メールの下書き一括生成** — スプレッドシートの顧客リストから個別メールの下書きを自動作成する
- **データ変換** — Excel→CSV、JSON→CSVなどのフォーマットを一括変換する
- **GASとの連携** — Google Apps Scriptのコードも日本語指示で作成できます。詳しくは[GASでできること完全ガイド](/articles/gas/gas-basics)をご覧ください

Claude APIの基本的な仕組みを理解すれば、より高度な自動化も可能になります。
詳しくは[Claude API入門](/articles/ai-api/claude-api-intro)をご覧ください。

また、AI導入の全体戦略を知りたい方は、[中小企業向けAI導入5ステップ](/articles/frameworks/ai-introduction-5steps)で計画的な導入方法を学べます。

まずは本記事のCSV集計スクリプトをClaude Codeで作成し、日常業務の自動化を体験してください。
