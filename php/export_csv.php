<?php
session_start();

// セッションチェック
if (!isset($_SESSION['user_id'])) {
    exit;
}

require_once 'db.php';
require_once 'functions.php';

// CSRFトークンの検証
if (!verifyCsrfToken($_GET['csrf_token'])) {
    exit;
}

// 月パラメータの取得とバリデーション
// 形式：YYYY-MM（例：2025-10）
$month  = $_GET['month'] ?? null;
if ($month  !== null && !preg_match('/^\d{4}-\d{2}$/', $month)) {
    // 不正な形式なら「指定なし」として扱う（防御的プログラミング）
    $month  = null;
}

// DBから全権取得（月の指定有無で分岐)
if ($month) {
    // 月別フィルター適応
    $sql    = "SELECT * FROM records
               WHERE DATE_FORMAT(date, '%Y-%m') = :month
               ORDER BY date DESC";
    $stmt   = $pdo->prepare($sql);
    $stmt->bindValue(':month', $month, PDO::PARAM_STR);
} else {
    $sql    = "SELECT * FROM records ORDER BY date DESC";
    $stmt   = $pdo->prepare($sql);
}
$stmt->execute();
$records    = $stmt->fetchAll();

// ファイル名を月別フィルターの状況に応じて変更
$filename   = $month
    ? 'kakeibo_' . $month . '.csv'          // 例：kakeibo_2025-10.csv
    : 'kakeibo_' . date('Ymd') . '.csv';    // 全権は今日の日付

// CSVのヘッダーを設定
header('Content-type: text/csv; charset=UTF-8');
header('Content-Disposition: attachment; filename="' . $filename . '"');

// BOM(文字化け防止)
echo "\xEF\xBB\xBF";

// CSVの出力
$output = fopen('php://output', 'w');

// ヘッダー行
fputcsv($output, ['日付', 'カテゴリ', '内容', '金額', '種別', '登録日時']);

// データ行
foreach ($records as $record) {
    fputcsv($output, [
        $record['date'],
        $record['category'],
        $record['description'],
        $record['amount'],
        $record['type'] === 'income' ? '収入' : '支出',
        $record['created_at'],
    ]);
}

fclose($output);
?>