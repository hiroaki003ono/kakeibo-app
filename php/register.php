<?php
error_reporting(0);
header('Content-Type: application/json');
require_once 'db.php';
require_once 'functions.php';

// POSTデータを取得
$username   = $_POST['username'];
$password   = $_POST['password'];

// バリデーション
if (empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'ユーザー名とパスワードを入力してください']);
    exit;
}

// ユーザー名の重複チェック
$sql    = "SELECT id FROM users WHERE username = :username";
$stmt   = $pdo->prepare($sql);
$stmt->execute([':username' => $username]);
if ($stmt->fetch()) {
    echo json_encode(['success' => false, 'message' => 'このユーザー名は既に使用されています']);
    exit;
}

// パスワードをハッシュ化して保存
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$sql    = "INSERT INTO users (username, password) VALUES (:username, :password)";
$stmt   = $pdo->prepare($sql);
$stmt->execute([
    ':username' => h($username),
    ':password' => $hashedPassword,
]);

echo json_encode(['success' => true, 'message' => 'ユーザー登録が完了しました']);
?>