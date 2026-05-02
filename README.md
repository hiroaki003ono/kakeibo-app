# 家計簿アプリ (Kakeibo App)

収支を記録・管理するWebアプリケーションです。 
未経験からエンジニア転職を目指す学習の成果物として、機能を段階的に追加しながら開発しています。

## 使用技術

- HTML / CSS
- JavaScript
- PHP 8.3
- MySQL 8.0
- Chart.js
- Docker

## 機能一覧

### 実装済み
- [x] 収支の入力フォーム
- [x] 収支の一覧表示
- [x] 収入・支出・残高の合計計算
- [x] 収支の削除機能
- [x] 入力バリデーション
- [x] MySQLによるデータの永続化
- [x] カテゴリ別支出の円グラフ
- [x] 月別収支の棒グラフ
- [ ] 月別フィルター機能
- [x] ユーザー登録・ログイン・ログアウト
- [x] セッション管理
- [x] XSS対策
- [x] CSRF対策
- [x] パスワードのハッシュ化
- [x] CSVエクスポート機能
- [x] Docker環境の構築

### 実装予定
- AWSへのデプロイ

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

## 環境構築

### Dockerを使う場合

```bash
git clone https://github.com/hiroaki003ono/kakeibo-app.git
cd kakeibo-app
docker-compose up -d
```

ブラウザで以下にアクセス
- アプリ：http://localhost:8080
- phpMyAdmin：http://localhost:8081

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
