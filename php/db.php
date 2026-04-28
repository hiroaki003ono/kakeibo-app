<?php
error_reporting(0);
// データベースの接続設定
define('DB_HOST', 'localhost'); // 接続先サーバー（自分のPC）
define('DB_USER', 'root'); // MySQLのユーザー名
define('DB_PASS', 'root'); // MySQLのパスワード
define('DB_NAME', 'kakeibo_db'); // 使用するデータベース名
define('DB_PORT', '8889'); // MAMPのMySQLポート番号

// データベースに接続
$pdo = new PDO(
    'mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME . ';charset=utf8mb4',
    DB_USER, // ユーザー名
    DB_PASS, // パスワード
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // エラー発生時、エラーメッセージを出す設定
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // DBからのデータ取得時、連想配列で返す設定
    ]
);
?>