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

// DBから全権取得
$sql        = "SELECT * FROM records ORDER BY date DESC";
$stmt       = $pdo->prepare($sql);
$stmt->execute();
$records    = $stmt->fetchAll();

// CSVのヘッダーを設定
header('Content-type: text/csv; charset=UTF-8');
header('Content-Disposition: attachment; filename="kakeibo_' . date('Ymd') . '.csv"');

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