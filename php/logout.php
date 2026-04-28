<?php
header('Content-Type: application/json');

// セッション開始
session_start();

// セッションを破棄
$_SESSION = [];
session_destroy();

echo json_encode(['success' => true, 'message' => 'ログアウトしました']);
?>