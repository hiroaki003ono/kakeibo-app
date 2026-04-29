<?php
session_start();

// セッションチェック
if (!isset($_SESSION['user_id'])) {
    header('Location: login.html');
    exit;
}

// functionsを読み込む
require_once 'php/functions.php';

// CSRFトークンを生成
$csrfToken  = generateCsrfToken();
?>

<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>家計簿アプリ</title>
    <!-- CSRFトークンをJavaScriptに渡す -->
    <meta name="csrf-token" content="<?php echo h($csrfToken); ?>">
    <link rel="stylesheet" href="css/style.css">
</head>

<body>
    <div class="container">
        <h1>家計簿アプリ</h1>

        <!-- ログアウトボタン -->
        <div class="header-bar">
            <span>こんにちは、<?php echo htmlspecialchars($_SESSION['username'], ENT_QUOTES, 'UTF-8'); ?>さん</span>
            <button id="logoutBtn">ログアウト</button>
        </div>

        <!-- 入力フォーム -->
        <div class="form-section">
            <h2>収支を入力</h2>
            <div class="form-group">
                <label for="date">日付</label>
                <input type="date" id="date">
            </div>
            <div class="form-group">
                <label for="category">カテゴリ</label>
                <select id="category">
                    <option value="食費">食費</option>
                    <option value="交通費">交通費</option>
                    <option value="娯楽">娯楽</option>
                    <option value="給料">給料</option>
                    <option value="その他">その他</option>
                </select>
            </div>
            <div class="form-group">
                <label for="description">内容</label>
                <input type="text" id="description" placeholder="例：スーパーで買い物">
            </div>
            <div class="form-group">
                <label for="amount">金額（円）</label>
                <input type="number" id="amount" placeholder="例：1500">
            </div>
            <div class="form-group">
                <label>種別</label>
                <div class="radio-group">
                    <label><input type="radio" name="type" value="expense" checked>支出</label>
                    <label><input type="radio" name="type" value="income">収入</label>
                </div>
            </div>
            <button id="addBtn">追加する</button>
        </div>

        <!-- 残高サマリー -->
        <div class="summary-section">
            <div class="summary-card income">
                <span>収入合計</span>
                <strong id="totalIncome">¥0</strong>
            </div>
            <div class="summary-card expense">
                <span>支出合計</span>
                <strong id="totalExpense">¥0</strong>
            </div>
            <div class="summary-card balance">
                <span>残高</span>
                <strong id="balance">¥0</strong>
            </div>
        </div>

        <!-- グラフ表示 -->
         <div class="chart-section">
            <h2>収支グラフ</h2>
            <div class="chart-container">
                <div class="chart-box">
                    <h3>カテゴリ別支出</h3>
                    <canvas id="categoryChart"></canvas>
                </div>
                <div class="chart-box">
                    <h3>月別収支</h3>
                    <canvas id="monthlyChart"></canvas>
                </div>
            </div>
         </div>

        <!-- 一覧表示 -->
        <div class="list-section">
            <div class="list-header">
                <h2>収支一覧</h2>
                <div class="list-controls">
                    <select id="monthFilter">
                        <option value="">全て表示</option>
                    </select>
                    <button id="exportBtn">CSVエクスポート</button>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>日付</th>
                        <th>カテゴリ</th>
                        <th>内容</th>
                        <th>金額</th>
                        <th>削除</th>
                    </tr>
                </thead>
                <tbody id="recordList">
                    <!-- JSで動的に追加 -->
                </tbody>
            </table>
        </div>
    </div>
    
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <!-- 自分のJSファイルより前に読み込む -->
    <script src="js/chart.js"></script>
    
    <!-- CSRFトークンをJavaScriptに渡す -->
    <script src="js/app.js"></script>

</body>

</html>