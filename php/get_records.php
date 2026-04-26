<?php
header('Content-Type: application/json');

// db.phpを読み込む
require_once 'db.php';
require_once 'functions.php'; // 追加

// DBから全権取得
$sql    = "SELECT * FROM records ORDER BY date DESC";
$stmt   = $pdo->prepare($sql);
$stmt->execute();

// 結果を配列で取得
$records = $stmt->fetchAll();

// 取得したデータをエスケープしてから返す
$safeRecords = array_map(function($record) {
    return [
        'id'            => (int)$record['id'],
        'date'          => h($record['date']),
        'category'      => h($record['category']),
        'description'   => h($record['description']),
        'amount'        => (int)$record['amount'],
        'type'          => h($record['type']),
        'created_at'    => h($record['created_at']),
    ];
}, $records);

// JSON形式で返す
echo json_encode($safeRecords);
?>