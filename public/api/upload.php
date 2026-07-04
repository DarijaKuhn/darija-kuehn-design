<?php
require __DIR__ . '/config.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: X-Admin-Password, Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Method not allowed', 405);

check_auth();

@set_time_limit(1800);
@ini_set('max_execution_time', '1800');
@ini_set('max_input_time', '1800');
@ini_set('memory_limit', '768M');

function format_bytes(int $bytes): string {
  if ($bytes >= 1024 * 1024 * 1024) return round($bytes / 1024 / 1024 / 1024, 1) . ' ГБ';
  return round($bytes / 1024 / 1024) . ' МБ';
}

// Detect the "file bigger than post_max_size" case — in that case $_POST/$_FILES are empty.
if ($_SERVER['REQUEST_METHOD'] === 'POST'
    && empty($_POST) && empty($_FILES)
    && (int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 0) {
  fail('Файл слишком большой для серверной настройки post_max_size. Для проповедей 1–2 часа разрешено до 2 ГБ; подождите 5 минут после деплоя и попробуйте снова.', 413);
}

$type = $_POST['type'] ?? '';
if (!in_array($type, ALLOWED_TYPES, true)) fail('Invalid type');

if (!isset($_FILES['file'])) fail('No file uploaded');

$file = $_FILES['file'];
$err = (int)($file['error'] ?? UPLOAD_ERR_NO_FILE);
if ($err !== UPLOAD_ERR_OK) {
  $map = [
    UPLOAD_ERR_INI_SIZE   => 'Файл превышает upload_max_filesize на сервере',
    UPLOAD_ERR_FORM_SIZE  => 'Файл превышает лимит формы',
    UPLOAD_ERR_PARTIAL    => 'Файл загружен не полностью',
    UPLOAD_ERR_NO_FILE    => 'Файл не выбран',
    UPLOAD_ERR_NO_TMP_DIR => 'Нет временной папки на сервере',
    UPLOAD_ERR_CANT_WRITE => 'Не удалось записать файл на диск',
    UPLOAD_ERR_EXTENSION  => 'Загрузка остановлена PHP-расширением',
  ];
  fail($map[$err] ?? ('Ошибка загрузки (код ' . $err . ')'), 413);
}

$max = 2 * 1024 * 1024 * 1024; // 2 GB for long 1–2 hour sermons
if ($file['size'] > $max) fail('Файл слишком большой (максимум ' . format_bytes($max) . ')', 413);

$allowedExt = [
  'sermons' => ['mp3', 'm4a', 'wav', 'ogg'],
  'photos'  => ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'],
  'books'   => ['pdf', 'epub', 'mobi'],
  'assets'  => ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'svg'],
];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!in_array($ext, $allowedExt[$type], true)) {
  fail('Extension .' . $ext . ' not allowed for ' . $type);
}

ensure_dirs();
$base = safe_filename(pathinfo($file['name'], PATHINFO_FILENAME));
$fname = $base . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
$dest = UPLOADS_DIR . '/' . $type . '/' . $fname;

if (!move_uploaded_file($file['tmp_name'], $dest)) fail('Could not save file', 500);
@chmod($dest, 0644);

json_response([
  'ok' => true,
  'filename' => $fname,
  'url' => '/uploads/' . $type . '/' . $fname,
  'size' => filesize($dest),
]);
