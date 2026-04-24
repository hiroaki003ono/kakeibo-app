<?php
header('Content-Type: application/json'); // ブラウザに「このファイルはJSONを返します」と宣言している

// db.phpを読み込む
require_once 'db.php'; // require_onceで重複読み込みを防ぐ

// POSTデータを取得
$date           = $_POST['date'];
$category       = $_POST['category'];
$description    = $_POST['description'];
$amount         = $_POST['amount'];
$type           = $_POST['type'];

// バリデーション
if (empty($date) || empty($description) || empty($amount) || !is_numeric($amount) || $amount <= 0) {
    echo json_encode(['success' => false, 'message' => '入力内容を確認してください']);
    exit;
}

// SQLを実行してDBに保存
$sql    = "INSERT INTO records (date, category, description, amount, type) VALUES (:date, :category, :description, :amount, :type)";
$stmt   = $pdo->prepare($sql);
$stmt->execute([
    ':date' => $date,
    ':category' => $category,
    ':description' => $description,
    ':amount' => (int)$amount,
    ':type' => $type,
]);

// 成功レスポンスを返す
echo json_encode(['success' => true, 'message' => '収支を追加しました']);
?>