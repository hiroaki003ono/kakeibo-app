// グラフのインスタンスを保持する変数
let categoryChart   = null;
let monthlyChart    = null;

// グラフを描写する関数
function renderCharts(records) {

    // =======================
    // ① カテゴリ別支出の円グラフ
    // =======================

    // 支出データだけを抽出してカテゴリ別に集計
    const categoryData = {};
    records.forEach(function(record) {
        if (record.type === 'expense') {
            if (categoryData[record.category]) {
                categoryData[record.category] += parseInt(record.amount);
            } else {
                categoryData[record.category] = parseInt(record.amount);
            }
        }
    });

    // グラフのラベルと数値を配列に変換
    const categoryLabels    = Object.keys(categoryData);
    const categoryValues    = Object.values(categoryData);

    // 既存のグラフがあれば削除
    if (categoryChart) {
        categoryChart.destroy();
    }

    // 円グラフを描写
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    categoryChart = new Chart(categoryCtx, {
        type: 'pie',                    // グラフの種類
        data: {
            labels: categoryLabels,     // ラベル
            datasets: [{
                data: categoryValues,   // 数値
                backgroundColor: [      // 色
                    '#e74c3c',
                    '#3498db',
                    '#2ecc71',
                    '#f39c12',
                    '#9b59b6'
                ]
            }]
        },
        options: {
            responsive: true,           // 画面サイズに合わせて自動調整
            plugins: {
                legend: {
                    position: 'bottom'  // 凡例を下に表示
                }
            }
        }
    });

    // ==================
    // ② 月別収支の棒グラフ
    // ==================

    // 月別に収支・支出を集計
    const monthlyData = {};
    records.forEach(function(record) {
        // 日付から年月を取得（例：20224-01-01 → 2024-01）substringで文字列の0~7を取り出している
        const month = record.date.substring(0, 7);

        if (!monthlyData[month]) {
            monthlyData[month] = { income: 0, expense: 0};
        }

        if (record.type === 'income') {
            monthlyData[month].income += parseInt(record.amount);
        } else {
            monthlyData[month].expense += parseInt(record.amount);
        }
    });

    // 月を照準に並べる
    const months = Object.keys(monthlyData).sort();
    const incomeValues = months.map(function(month) {
        return monthlyData[month].income;
    });
    const expenseValues = months.map(function(month) {
        return monthlyData[month].expense;
    });

    // 既存のグラフがあれば削除
    if (monthlyChart) {
        monthlyChart.destroy();
    }

    // 棒グラフを描写
    const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
    monthlyChart = new Chart(monthlyCtx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [
                {
                    label: '収入',
                    data: incomeValues,
                    backgroundColor: '#27ae60'
                },
                {
                    label: '支出',
                    data: expenseValues,
                    backgroundColor: '#e74c3c'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}