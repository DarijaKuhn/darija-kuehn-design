<?php
// Смените этот пароль после первого деплоя.
// Тот же пароль хранится в src/routes/admin.tsx (константа ADMIN_PASSWORD).
const ADMIN_PASSWORD = 'Dresden2026';

const DATA_FILE     = __DIR__ . '/../data/site-content.json';
const UPLOADS_DIR   = __DIR__ . '/../uploads';
const ALLOWED_TYPES = ['sermons', 'photos', 'books'];

function json_response($data, int $status = 200): void {
  http_response_code($status);
  header('Content-Type: application/json; charset=utf-8');
  header('Cache-Control: no-store');
  echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

function fail(string $msg, int $status = 400): void {
  json_response(['ok' => false, 'error' => $msg], $status);
}

function check_auth(): void {
  $headers = function_exists('getallheaders') ? getallheaders() : [];
  $pw = $headers['X-Admin-Password'] ?? $headers['x-admin-password'] ?? ($_POST['password'] ?? '');
  if (!is_string($pw) || !hash_equals(ADMIN_PASSWORD, $pw)) {
    fail('Unauthorized', 401);
  }
}

function ensure_dirs(): void {
  if (!is_dir(dirname(DATA_FILE))) @mkdir(dirname(DATA_FILE), 0755, true);
  foreach (ALLOWED_TYPES as $t) {
    $d = UPLOADS_DIR . '/' . $t;
    if (!is_dir($d)) @mkdir($d, 0755, true);
  }
  if (!file_exists(DATA_FILE)) {
    file_put_contents(DATA_FILE, json_encode([
      'sermons' => [], 'photos' => [], 'books' => []
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
  }
}

function read_data(): array {
  ensure_dirs();
  $raw = @file_get_contents(DATA_FILE);
  $data = $raw ? json_decode($raw, true) : null;
  if (!is_array($data)) $data = [];
  foreach (ALLOWED_TYPES as $t) {
    if (!isset($data[$t]) || !is_array($data[$t])) $data[$t] = [];
  }
  return $data;
}

function write_data(array $data): void {
  ensure_dirs();
  $tmp = DATA_FILE . '.tmp';
  file_put_contents($tmp, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
  rename($tmp, DATA_FILE);
}

function safe_filename(string $name): string {
  $name = preg_replace('/[^A-Za-z0-9._-]/', '_', $name) ?? 'file';
  return substr($name, 0, 120);
}
