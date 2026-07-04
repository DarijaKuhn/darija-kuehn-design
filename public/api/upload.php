<?php
require __DIR__ . '/config.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: X-Admin-Password, Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Method not allowed', 405);

check_auth();

$type = $_POST['type'] ?? '';
if (!in_array($type, ALLOWED_TYPES, true)) fail('Invalid type');

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
  fail('No file uploaded or upload error');
}

$file = $_FILES['file'];
$max = 200 * 1024 * 1024; // 200 MB
if ($file['size'] > $max) fail('File too large (max 200 MB)', 413);

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
