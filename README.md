# 家計簿アプリ (Kakeibo App)

収支を記録・管理するWebアプリケーションです。
未経験からエンジニア転職を目指す学習の成果物として、機能を段階的に追加しながら開発しています。

## 公開URL

http://54.249.170.162:8080/

## 使用技術

- HTML / CSS
- JavaScript
- PHP 8.3
- MySQL 8.0
- Chart.js
- Docker

## 機能一覧

### 実装済み
- ✅ 収支の入力フォーム
- ✅ 収支の一覧表示
- ✅ 収入・支出・残高の合計計算
- ✅ 収支の削除機能
- ✅ 入力バリデーション
- ✅ MySQLによるデータの永続化
- ✅ カテゴリ別支出の円グラフ
- ✅ 月別収支の棒グラフ
- ✅ 月別フィルター機能
- ✅ ユーザー登録・ログイン・ログアウト機能
- ✅ セッション管理
- ✅ XSS対策
- ✅ CSRF対策
- ✅ パスワードのハッシュ化
- ✅ CSVエクスポート機能
- ✅ Docker環境の構築
- ✅ AWSへのデプロイ（EC2 + Docker）

### 実装予定
- CSVエクスポートの月別フィルター対応

## 開発ログ

| 日付 | 対応内容 |
|------|--------|
| 2026-04-14 | リポジトリ作成・README整備 |
| 2026-04-17 | フェーズ1：HTML・CSS・JavaScriptで基本機能を実装 |
| 2026-04-24 | フェーズ2：PHP・MySQLによるDB連携を実装 |
| 2026-04-25 | フェーズ3：Chart.jsによるグラフ表示機能を実装 |
| 2026-04-28 | フェーズ4：セキュリティ機能を実装 |
| 2026-04-29 | フェーズ5：CSVエクスポート・月別フィルター機能を実装 |
| 2026-05-02 | フェーズ5：Docker環境を構築 |
| 2026-05-04 | フェーズ5：AWSへのデプロイ（EC2 + Docker） |

## 環境構築

### Dockerを使う場合（ローカル）

```bash
git clone https://github.com/hiroaki003ono/kakeibo-app.git
cd kakeibo-app
docker-compose up -d
```

ブラウザで以下にアクセス
- アプリ：http://localhost:8080
- phpMyAdmin：http://localhost:8081

### AWSデプロイ済み環境
- アプリ：http://54.249.170.162:8080/
- 使用サービス：EC2（t3.micro・東京リージョン）

### テーブルの作成

phpMyAdminにログイン後、SQLタブから以下を実行してください。

```sql
CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE records (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    category VARCHAR(50) NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount INT UNSIGNED NOT NULL,
    type VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
