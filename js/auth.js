// 現在のページを確認
const isLoginPage       = document.getElementById('loginBtn');
const isRegisterPage    = document.getElementById('registerBtn');

// ログインページの処理
if (isLoginPage) {
    document.getElementById('loginBtn').addEventListener('click', function() {
        const username  = document.getElementById('username').value;
        const password  = document.getElementById('password').value;

        if (!username || !password) {
            showMessage('ユーザー名とパスワードを入力してください', 'error');
            return;
        }

        const formData  = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        fetch('php/login.php', {
            method: 'POST',
            body:   formData
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data.success) {
                // ログイン成功→家計簿ページに移動
                window.location.href    = 'index.php';
            } else {
                showMessage(data.message, 'error');
            }
        });
    });
}

// 新規登録ページの処理
if (isRegisterPage) {
    document.getElementById('registerBtn').addEventListener('click', function() {
        const username          = document.getElementById('username').value;
        const password          = document.getElementById('password').value;
        const passwordConfirm   = document.getElementById('passwordConfirm').value;

        // バリデーション
        if (!username || !password || !passwordConfirm) {
            showMessage('全ての項目を入力してください', 'error');
            return;
        }

        if (password !== passwordConfirm) {
            showMessage('パスワードが一致しません', 'error');
            return;
        }

        if (password.length < 8) {
            showMessage('パスワードは8文字以上で入力してください', 'error');
            return;
        }

        const formData  = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        fetch('php/register.php', {
            method: 'POST',
            body:   formData
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            if (data.success) {
                showMessage('登録完了！ログインページに移動します', 'success');
                // 2秒後にログインページに移動
                setTimeout(function() {
                    window.location.href    = 'login.php';
                }, 2000);
            } else {
                showMessage(data.message, 'error');
            }
        });
    });
}

// メッセージを表示する関数
function showMessage(message, type) {
    // 既存のメッセージを削除
    const existing  = document.querySelector('.error-message, .success-message');
    if (existing) {
        existing.remove();
    }

    const p = document.createElement('p');
    p.className     = type === 'error' ? 'error-message' : 'success-message';
    p.textContent   = message;

    const button    = document.querySelector('button');
    button.insertAdjacentElement('afterend', p);
}