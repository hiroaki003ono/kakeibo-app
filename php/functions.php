<?php
// XSS対策のエスケープ関数
function h($str) {
    return htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
}
?>