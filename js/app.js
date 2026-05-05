// CSRFトークンを取得
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// データを保持する配列
let records = [];

// 要素の取得
const addBtn            = document.getElementById('addBtn'); // 追加ボタン
const recordList        = document.getElementById('recordList'); // テーブルのtbody
const totalIncomeEl     = document.getElementById('totalIncome'); // 収入合計表示欄
const totalExpenseEl    = document.getElementById('totalExpense'); // 支出合計表示欄
const balanceEl         = document.getElementById('balance'); // 残高表示欄
const monthFilter       = document.getElementById('monthFilter'); // 月別フィルター

// ページ読み込み時にDBからデータを取得
loadRecords();

// DBからデータを取得して画面に表示する関数
function loadRecords() {
    fetch('php/get_records.php')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            records = data;
            render();
        });
}

// 追加ボタンのクイックイベント
addBtn.addEventListener('click', function() {
    const date          = document.getElementById('date').value;
    const category      = document.getElementById('category').value; 
    const description   = document.getElementById('description').value;
    const amount        = parseInt(document.getElementById('amount').value); // amountの内容をparseIntで数値として取得　parseIntなしでは文字列として取得してしまう
    const type          = document.querySelector('input[name="type"]:checked').value; // 収入と支出のどちらにチェックがついているか
    
    // 入力チェック
    if (!date || !description || isNaN(amount) /* 数値ではない場合にtrueを返す */|| amount <= 0) {
        alert('日付・内容・金額を正しく入力してください');
        return; // ←ifの条件に当てはまると、ここで関数を終了する
    }

    // FormDataを作成してPHPに送信
    const formData = new FormData();
    formData.append('date', date);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('amount', amount);
    formData.append('type', type);
    formData.append('csrf_token', csrfToken); // CSRF対策

    fetch('php/add_record.php', {
        method: 'POST',
        body: formData
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if (data.success) {
            loadRecords();
            clearForm();
        } else {
            alert(data.message);
        }
    });
});

function render() {
    // テーブルをクリア
    recordList.innerHTML = '';

    // 合計を計算
    let totalIncome     = 0;
    let totalExpense    = 0;

    // 選択された月を取得
    const selectedMonth = monthFilter.value;

    // 月でフィルタリング
    const filteredRecords   = selectedMonth
        ? records.filter(function(record) {
            return record.date.substring(0, 7) === selectedMonth;
        })
        : records;

    // 月選択のオプションを更新
    updateMonthOptions();

    filteredRecords.forEach(function(record) {
        if (record.type === 'income') {
            totalIncome += parseInt(record.amount);
        } else {
            totalExpense += parseInt(record.amount);
        }

        const tr = document.createElement('tr');

        // 各セルを安全に作成
        const tdDate = document.createElement('td');
        tdDate.textContent = record.date;

        const tdCategory = document.createElement('td');
        tdCategory.textContent = record.category;

        const tdDescription = document.createElement('td');
        tdDescription.textContent = record.description;

        const tdAmount = document.createElement('td');
        tdAmount.className = record.type === 'income' ? 'amount-income' : 'amount-expense';
        tdAmount.textContent = (record.type === 'income' ? '+' : '-') + '¥' + parseInt(record.amount).toLocaleString();

        const tdDelete = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '🗑';
        deleteBtn.addEventListener('click', function() {
            deleteRecord(record.id);
        });
        tdDelete.appendChild(deleteBtn);

        tr.appendChild(tdDate);
        tr.appendChild(tdCategory);
        tr.appendChild(tdDescription);
        tr.appendChild(tdAmount);
        tr.appendChild(tdDelete);

        recordList.appendChild(tr); // tbodyに追加して画面に表示
    
    });

    // サマリーを更新
    totalIncomeEl.textContent = '¥' + totalIncome.toLocaleString();
    totalExpenseEl.textContent = '¥' + totalExpense.toLocaleString();
    balanceEl.textContent = '¥' + (totalIncome - totalExpense).toLocaleString();

    // グラフを更新する
    renderCharts(filteredRecords);
}

// 月選択のオプションを更新する関数
function updateMonthOptions() {
    const currentValue  = monthFilter.value;

    // 重複なしで月一覧を作成
    const months    = [];
    records.forEach(function(record) {
        const month = record.date.substring(0, 7);
        if (!months.includes(month)) {
            months.push(month);
        }
    });

    // 月を降順に並べる
    months.sort().reverse();

    // オプションを更新
    monthFilter.innerHTML   = '<option value="">全て表示</option>';
    months.forEach(function(month) {
        const option        = document.createElement('option');
        option.value        = month;
        option.textContent  = month;
        if (month === currentValue) {
            option.selected = true;
        }
        monthFilter.appendChild(option);
    });
}

// 削除する関数
function deleteRecord(id) {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('csrf_token', csrfToken); // CSRF対策

    fetch('php/delete_record.php', {
        method: 'POST',
        body: formData
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if (data.success) {
            loadRecords();
        } else {
            alert(data.message);
        }
    });
}

// フォームをリセットする関数
function clearForm() {
    document.getElementById('date').value = '';
    document.getElementById('description').value = '';
    document.getElementById('amount').value = '';
    document.querySelector('input[name="type"][value="expense"]').checked = true;
}

// ログアウトボタンのイベント
document.getElementById('logoutBtn').addEventListener('click', function() {
    fetch('php/logout.php')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        if (data.success) {
            window.location.href    = 'login.html';
        }
    });
});

// CSVエクスポートボタンのイベント
document.getElementById('exportBtn').addEventListener('click', function() {
    // 現在選択中の月を取得（空文字なら「全て表示」）
    const selectedMonth = monthFilter.value;

    // URLを組み立て
    let url = 'php/export_csv.php?csrf_token=' + encodeURIComponent(csrfToken);

    // 月が選択されていればクエリパラメータに追加
    if (selectedMonth) {
        url += '&month=' + encodeURIComponent(selectedMonth);
    }

    window.location.href    = url;
});

// 月フィルターのイベント
monthFilter.addEventListener('change', function() {
    render();
});