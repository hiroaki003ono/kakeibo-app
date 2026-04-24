// データを保持する配列
let records = [];

// 要素の取得
const addBtn            = document.getElementById('addBtn'); // 追加ボタン
const recordList        = document.getElementById('recordList'); // テーブルのtbody
const totalIncomeEl     = document.getElementById('totalIncome'); // 収入合計表示欄
const totalExpenseEl    = document.getElementById('totalExpense'); // 支出合計表示欄
const balanceEl         = document.getElementById('balance'); // 残高表示欄

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
    let totalIncome = 0;
    let totalExpense = 0;

    records.forEach(function(record) {
        if (record.type === 'income') {
            totalIncome += parseInt(record.amount);
        } else {
            totalExpense += parseInt(record.amount);
        }

        // テーブルの行を作成
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${record.date}</td>
            <td>${record.category}</td>
            <td>${record.description}</td>
            <td class="${record.type === 'income' ? 'amount-income' : 'amount-expense'}">
             ${record.type === 'income' ? '+' : '-'}¥${parseInt(record.amount).toLocaleString()/*←3桁カンマ区切りで表示*/}
            </td>
            <td>
             <button class="delete-btn" onclick="deleteRecord(${record.id})">🗑</button>
            </td>
        `;
        recordList.appendChild(tr); // tbodyに追加して画面に表示
    });

    // サマリーを更新
    totalIncomeEl.textContent = '¥' + totalIncome.toLocaleString();
    totalExpenseEl.textContent = '¥' + totalExpense.toLocaleString();
    balanceEl.textContent = '¥' + (totalIncome - totalExpense).toLocaleString();

    // グラフを更新する
    renderCharts(records);
}

// 削除する関数
function deleteRecord(id) {
    const formData = new FormData();
    formData.append('id', id);

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