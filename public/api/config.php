<?php
// Смените этот пароль после первого деплоя.
// Пароль хранится ТОЛЬКО на сервере — клиент проверяет его через /api/verify.php.
const ADMIN_PASSWORD = 'Dresden2026';

const DATA_FILE     = __DIR__ . '/../data/site-content.json';
const UPLOADS_DIR   = __DIR__ . '/../uploads';
const ALLOWED_TYPES = ['sermons', 'photos', 'books', 'assets', 'verses', 'events'];

// Brute-force protection
const BF_FILE           = __DIR__ . '/../data/.auth-attempts.json';
const BF_MAX_ATTEMPTS   = 8;         // fails before lockout
const BF_WINDOW         = 900;       // 15 min window
const BF_LOCKOUT        = 1800;      // 30 min lockout

// Contact form rate limit
const CONTACT_LOG_FILE  = __DIR__ . '/../data/.contact-log.json';
const CONTACT_MAX_PER_HOUR = 5;

function json_response($data, int $status = 200): void {
  http_response_code($status);
  header('Content-Type: application/json; charset=utf-8');
  header('Cache-Control: no-store');
  // Security headers (defense in depth; .htaccess sets them for static too)
  header('X-Content-Type-Options: nosniff');
  header('Referrer-Policy: strict-origin-when-cross-origin');
  echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

function fail(string $msg, int $status = 400): void {
  json_response(['ok' => false, 'error' => $msg], $status);
}

function client_ip(): string {
  $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
  // Do NOT trust X-Forwarded-For — Hetzner Webhosting doesn't set it in a way we control.
  return preg_replace('/[^0-9a-f\.\:]/i', '', $ip) ?: '0.0.0.0';
}

function read_json_file(string $path): array {
  if (!file_exists($path)) return [];
  $raw = @file_get_contents($path);
  $data = $raw ? json_decode($raw, true) : null;
  return is_array($data) ? $data : [];
}

function write_json_file(string $path, array $data): void {
  $dir = dirname($path);
  if (!is_dir($dir)) @mkdir($dir, 0755, true);
  $tmp = $path . '.tmp';
  @file_put_contents($tmp, json_encode($data, JSON_UNESCAPED_UNICODE));
  @rename($tmp, $path);
}

function enforce_bruteforce_guard(): void {
  $ip = client_ip();
  $log = read_json_file(BF_FILE);
  $entry = $log[$ip] ?? null;
  if (is_array($entry) && !empty($entry['locked_until']) && $entry['locked_until'] > time()) {
    $left = $entry['locked_until'] - time();
    header('Retry-After: ' . $left);
    fail('Zu viele Fehlversuche. Bitte in ' . ceil($left / 60) . ' Minuten erneut versuchen.', 429);
  }
}

function record_auth_failure(): void {
  $ip = client_ip();
  $log = read_json_file(BF_FILE);
  $now = time();
  $entry = $log[$ip] ?? ['count' => 0, 'first' => $now, 'locked_until' => 0];
  if ($now - ($entry['first'] ?? $now) > BF_WINDOW) {
    $entry = ['count' => 0, 'first' => $now, 'locked_until' => 0];
  }
  $entry['count']++;
  if ($entry['count'] >= BF_MAX_ATTEMPTS) {
    $entry['locked_until'] = $now + BF_LOCKOUT;
  }
  // Prune old entries to keep file small
  foreach ($log as $k => $v) {
    if (!is_array($v)) { unset($log[$k]); continue; }
    if (($v['locked_until'] ?? 0) < $now && ($now - ($v['first'] ?? 0)) > BF_WINDOW) unset($log[$k]);
  }
  $log[$ip] = $entry;
  write_json_file(BF_FILE, $log);
}

function clear_auth_failures(): void {
  $ip = client_ip();
  $log = read_json_file(BF_FILE);
  if (isset($log[$ip])) { unset($log[$ip]); write_json_file(BF_FILE, $log); }
}

function check_auth(): void {
  enforce_bruteforce_guard();
  $headers = function_exists('getallheaders') ? getallheaders() : [];
  $pw = $headers['X-Admin-Password'] ?? $headers['x-admin-password'] ?? ($_POST['password'] ?? '');
  if (!is_string($pw) || !hash_equals(ADMIN_PASSWORD, $pw)) {
    record_auth_failure();
    fail('Unauthorized', 401);
  }
}

function contact_rate_limit(): void {
  $ip = client_ip();
  $log = read_json_file(CONTACT_LOG_FILE);
  $now = time();
  $entry = $log[$ip] ?? ['count' => 0, 'first' => $now];
  if ($now - ($entry['first'] ?? $now) > 3600) {
    $entry = ['count' => 0, 'first' => $now];
  }
  if ($entry['count'] >= CONTACT_MAX_PER_HOUR) {
    header('Retry-After: ' . (3600 - ($now - $entry['first'])));
    fail('Zu viele Anfragen. Bitte später erneut versuchen.', 429);
  }
  $entry['count']++;
  // Prune old
  foreach ($log as $k => $v) {
    if (!is_array($v) || ($now - ($v['first'] ?? 0)) > 3600) unset($log[$k]);
  }
  $log[$ip] = $entry;
  write_json_file(CONTACT_LOG_FILE, $log);
}

function ensure_dirs(): void {
  if (!is_dir(dirname(DATA_FILE))) @mkdir(dirname(DATA_FILE), 0755, true);
  foreach (ALLOWED_TYPES as $t) {
    $d = UPLOADS_DIR . '/' . $t;
    if (!is_dir($d)) @mkdir($d, 0755, true);
  }
  if (!file_exists(DATA_FILE)) {
    file_put_contents(DATA_FILE, json_encode([
      'sermons' => [], 'photos' => [], 'books' => [], 'assets' => [], 'verses' => [], 'events' => []
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
