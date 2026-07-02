<?php
require __DIR__ . '/config.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: X-Admin-Password, Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Method not allowed', 405);

check_auth();

$body = json_decode(file_get_contents('php://input'), true);
$type = $body['type'] ?? '';
$id   = $body['id']   ?? '';
if (!in_array($type, ALLOWED_TYPES, true) || !is_string($id) || $id === '') {
  fail('Invalid type or id');
}

$data = read_data();
$kept = [];
$removedFile = null;
foreach ($data[$type] as $item) {
  if (($item['id'] ?? null) === $id) {
    $removedFile = $item['fileUrl'] ?? null;
    continue;
  }
  $kept[] = $item;
}
$data[$type] = $kept;
write_data($data);

// Try to delete the file
if (is_string($removedFile) && str_starts_with($removedFile, '/uploads/')) {
  $path = __DIR__ . '/..' . $removedFile;
  $real = realpath($path);
  $baseReal = realpath(UPLOADS_DIR);
  if ($real && $baseReal && str_starts_with($real, $baseReal)) @unlink($real);
}

json_response(['ok' => true]);
