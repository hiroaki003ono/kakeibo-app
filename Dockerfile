FROM php:8.3-apache

# MySQLに接続するための拡張機能をインストール
RUN docker-php-ext-install pdo pdo_mysql

# Apacheのモジュールを有効化
RUN a2enmod rewrite

