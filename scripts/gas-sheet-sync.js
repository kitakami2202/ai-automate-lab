/**
 * 記事レジストリ・変更履歴 自動同期GAS
 *
 * 使い方:
 * 1. Google Sheetsを新規作成
 * 2. 拡張機能 → Apps Script を開く
 * 3. このコードを貼り付けて保存
 * 4. syncAll() を実行（初回はGoogleアカウント認証が必要）
 * 5. 任意: トリガーで定期実行（例: 1時間ごと）
 */

const GITHUB_RAW_BASE = "https://raw.githubusercontent.com/kitakami2202/ai-automate-lab/main/scripts/";

const SHEETS_CONFIG = [
  {
    url: GITHUB_RAW_BASE + "article-registry.csv",
    sheetName: "記事レジストリ",
    headerColor: "#1a73e8",
    colWidths: { 0: 180, 1: 360, 2: 100, 3: 100, 4: 80, 5: 80, 6: 50, 7: 80, 8: 50, 9: 100, 10: 100, 11: 200, 12: 280, 13: 50, 14: 100, 15: 60, 16: 50, 17: 50, 18: 200 }
  },
  {
    url: GITHUB_RAW_BASE + "changelog.csv",
    sheetName: "変更履歴",
    headerColor: "#0d652d",
    colWidths: { 0: 100, 1: 200, 2: 80, 3: 160, 4: 80, 5: 80, 6: 60, 7: 60, 8: 300, 9: 80 }
  }
];

/**
 * メイン: 全シートを同期
 */
function syncAll() {
  for (const config of SHEETS_CONFIG) {
    syncSheet(config);
  }
  SpreadsheetApp.getActiveSpreadsheet().toast("同期完了", "GitHub CSV Sync", 3);
}

/**
 * CSVを取得してシートに書き込み
 */
function syncSheet(config) {
  const response = UrlFetchApp.fetch(config.url, { muteHttpExceptions: true });
  if (response.getResponseCode() !== 200) {
    throw new Error(config.sheetName + " の取得に失敗: " + response.getResponseCode());
  }

  const csvText = response.getContentText("UTF-8");
  const rows = parseCsv(csvText);
  if (rows.length === 0) return;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(config.sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(config.sheetName);
  }

  // シートをクリアして書き込み
  sheet.clear();
  sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);

  // ヘッダー書式
  const headerRange = sheet.getRange(1, 1, 1, rows[0].length);
  headerRange.setBackground(config.headerColor);
  headerRange.setFontColor("#ffffff");
  headerRange.setFontWeight("bold");
  sheet.setFrozenRows(1);

  // 列幅
  for (const [col, width] of Object.entries(config.colWidths)) {
    sheet.setColumnWidth(Number(col) + 1, width);
  }

  // フィルター
  if (sheet.getFilter()) sheet.getFilter().remove();
  sheet.getRange(1, 1, rows.length, rows[0].length).createFilter();
}

/**
 * CSV文字列をパース（ダブルクォート対応）
 */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && i + 1 < text.length && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        field += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ',') {
        row.push(field);
        field = "";
      } else if (c === '\n') {
        row.push(field);
        field = "";
        if (row.length > 1 || row[0] !== "") rows.push(row);
        row = [];
      } else if (c === '\r') {
        // skip
      } else {
        field += c;
      }
    }
  }
  if (field || row.length > 0) {
    row.push(field);
    if (row.length > 1 || row[0] !== "") rows.push(row);
  }
  return rows;
}

/**
 * メニューに同期ボタンを追加
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("GitHub同期")
    .addItem("今すぐ同期", "syncAll")
    .addToUi();
}
