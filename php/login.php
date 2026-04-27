<?php
header('Contnt-type: application/json');
require_once 'db.php';
require_once 'functions.php';

// セッション開始
session_start();

// POSTデータを取得
$username   = $_POST['username'];
$password   = $_POST['password'];

// バリデーション
if (empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'ユーザー名とパスワードを入力してください']);
    exit;
}

// ユーザーを検索
$sql    = "SELECT * FROM users WHERE username = :username";
$stmt   = $pdo->prepare($sql);
$stmt->execute([':username' => $username]);
$user   = $stmt->fetch();

// ユーザー名とパスワードを検証
if (!$user || !password_verify($password, $user['password'])) {
    echo json_encode(['success' => false, 'message' => 'ユーザー名またはパスワードが正しくありません']);
    exit;
}

// セッションにユーザー情報を保存
$_SESSION['user_id'] = $user['id'];
$_SESSION['username'] = $user['username'];

echo json_encode(['success' => true, 'message' => 'ログインしました']);
?>