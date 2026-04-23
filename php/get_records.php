<?php
header('Content-Type: application/json');

// db.phpを読み込む
require_once 'db.php';

// DBから全権取得
$sql    = "SELECT * FROM records ORDER BY date DESC";
$stmt   = $pdo->prepare($sql);
$stmt->execute();

// 結果を配列で取得
$records = $stmt->fetchAll();

// JSON形式で返す
echo json_encode($records);
?>