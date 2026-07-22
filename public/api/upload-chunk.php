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
@ini_set('memory_limit', '256M');

$allowedExt = [
  'sermons' => ['mp3', 'm4a', 'wav', 'ogg'],
  'photos'  => ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'],
  'books'   => ['pdf', 'epub', 'mobi'],
  'assets'  => ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'svg', 'mp4', 'webm', 'mov', 'm4v', 'ogv'],
];

function remove_dir(string $dir): void {
  if (!is_dir($dir)) return;
  foreach (scandir($dir) ?: [] as $entry) {
    if ($entry === '.' || $entry === '..') continue;
    $path = $dir . '/' . $entry;
    if (is_dir($path)) remove_dir($path); else @unlink($path);
  }
  @rmdir($dir);
}

function load_state(string $stateFile): array {
  $raw = @file_get_contents($stateFile);
  $state = $raw ? json_decode($raw, true) : null;
  return is_array($state) ? $state : [];
}

$type = $_POST['type'] ?? '';
if (!in_array($type, ALLOWED_TYPES, true)) fail('Invalid type');

$uploadId = preg_replace('/[^A-Za-z0-9_-]/', '', (string)($_POST['uploadId'] ?? ''));
if ($uploadId === '' || strlen($uploadId) > 80) fail('Invalid upload id');

$originalName = (string)($_POST['filename'] ?? 'file');
$ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
if (!in_array($ext, $allowedExt[$type], true)) {
  fail('Extension .' . $ext . ' not allowed for ' . $type);
}

$chunkIndex = filter_input(INPUT_POST, 'chunkIndex', FILTER_VALIDATE_INT);
$totalChunks = filter_input(INPUT_POST, 'totalChunks', FILTER_VALIDATE_INT);
$totalSize = filter_input(INPUT_POST, 'totalSize', FILTER_VALIDATE_INT);
if ($chunkIndex === false || $chunkIndex === null || $totalChunks === false || $totalChunks === null || $totalSize === false || $totalSize === null) {
  fail('Invalid chunk metadata');
}
if ($chunkIndex < 0 || $totalChunks < 1 || $chunkIndex >= $totalChunks) fail('Invalid chunk number');
if ($totalChunks > 5000) fail('Too many chunks');
if ($totalSize > 2 * 1024 * 1024 * 1024) fail('Файл слишком большой (максимум 2 GB)', 413);

if (!isset($_FILES['file'])) fail('No chunk uploaded');
$file = $_FILES['file'];
$err = (int)($file['error'] ?? UPLOAD_ERR_NO_FILE);
if ($err !== UPLOAD_ERR_OK) {
  $map = [
    UPLOAD_ERR_INI_SIZE   => 'Часть файла больше серверного лимита. Попробуйте ещё раз после деплоя.',
    UPLOAD_ERR_FORM_SIZE  => 'Часть файла больше лимита формы',
    UPLOAD_ERR_PARTIAL    => 'Часть файла загружена не полностью',
    UPLOAD_ERR_NO_FILE    => 'Файл не выбран',
    UPLOAD_ERR_NO_TMP_DIR => 'Нет временной папки на сервере',
    UPLOAD_ERR_CANT_WRITE => 'Не удалось записать файл на диск',
    UPLOAD_ERR_EXTENSION  => 'Загрузка остановлена PHP-расширением',
  ];
  fail($map[$err] ?? ('Ошибка загрузки (код ' . $err . ')'), 413);
}

ensure_dirs();
$chunksRoot = UPLOADS_DIR . '/.chunks';
if (!is_dir($chunksRoot)) @mkdir($chunksRoot, 0755, true);
$chunkDir = $chunksRoot . '/' . $uploadId;
if (!is_dir($chunkDir)) @mkdir($chunkDir, 0755, true);
$stateFile = $chunkDir . '/state.json';
$state = load_state($stateFile);

if (!$state) {
  $base = safe_filename(pathinfo($originalName, PATHINFO_FILENAME));
  $state = [
    'type' => $type,
    'filename' => $base . '_' . bin2hex(random_bytes(4)) . '.' . $ext,
    'totalChunks' => $totalChunks,
    'totalSize' => $totalSize,
    'received' => new stdClass(),
  ];
}

if (($state['type'] ?? '') !== $type || (int)($state['totalChunks'] ?? 0) !== $totalChunks || (int)($state['totalSize'] ?? 0) !== $totalSize) {
  remove_dir($chunkDir);
  fail('Upload metadata changed. Please try again.');
}

$partPath = $chunkDir . '/' . $chunkIndex . '.part';
if (!move_uploaded_file($file['tmp_name'], $partPath)) fail('Could not save chunk', 500);
@chmod($partPath, 0644);

$received = $state['received'] ?? [];
if (!is_array($received)) $received = [];
$received[(string)$chunkIndex] = filesize($partPath);
$state['received'] = $received;
file_put_contents($stateFile, json_encode($state, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

if (count($received) < $totalChunks) {
  json_response(['ok' => true, 'done' => false, 'received' => count($received), 'totalChunks' => $totalChunks]);
}

for ($i = 0; $i < $totalChunks; $i++) {
  if (!isset($received[(string)$i]) || !is_file($chunkDir . '/' . $i . '.part')) {
    json_response(['ok' => true, 'done' => false, 'received' => count($received), 'totalChunks' => $totalChunks]);
  }
}

$dest = UPLOADS_DIR . '/' . $type . '/' . $state['filename'];
$out = @fopen($dest, 'wb');
if (!$out) fail('Could not create final file', 500);

for ($i = 0; $i < $totalChunks; $i++) {
  $in = @fopen($chunkDir . '/' . $i . '.part', 'rb');
  if (!$in) {
    fclose($out);
    @unlink($dest);
    fail('Missing file chunk', 500);
  }
  stream_copy_to_stream($in, $out);
  fclose($in);
}
fclose($out);

if (filesize($dest) !== $totalSize) {
  @unlink($dest);
  remove_dir($chunkDir);
  fail('Uploaded file size mismatch. Please try again.', 500);
}

@chmod($dest, 0644);
remove_dir($chunkDir);

json_response([
  'ok' => true,
  'done' => true,
  'filename' => $state['filename'],
  'url' => '/uploads/' . $type . '/' . $state['filename'],
  'size' => filesize($dest),
]);