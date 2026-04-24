<?php
header('Content-Type: application/json');

// db.phpを読み込む
require_once 'db.php';

// POSTデータを取得
$id = $_POST['id'];

// バリデーション
if (empty($id) || !is_numeric($id)) {
    echo json_encode(['success' => false, 'message' => 'IDが不正です']);
    exit;
}

// SQLを実行してDBから削除
$sql    = "DELETE FROM records WHERE id = :id";
$stmt   = $pdo->prepare($sql);
$stmt->execute([':id' => (int)$id]);

// 成功レスポンスを返す
echo json_encode(['success' => true, 'message' => '収支を削除しました']);
?>