<?php
// GET  -> текущая тема (публично, для загрузки на клиенте)
// POST -> сохранить/сбросить тему (требует admin auth)
require __DIR__ . '/config.php';

const THEME_FILE = __DIR__ . '/../data/theme.json';

// Whitelist ключей CSS-переменных, которые ИИ может менять.
const THEME_KEYS = [
  '--bg', '--ink', '--ink-2', '--muted', '--white',
  '--green', '--green-dark', '--green-light', '--green-soft',
  '--accent-sky', '--accent-lavender', '--gradient-accent',
  '--shadow-soft', '--shadow-float',
  '--radius-card', '--radius-card-lg',
  '--font-sans', '--font-serif',
];

function read_theme(): array {
  if (!file_exists(THEME_FILE)) return [];
  $raw = @file_get_contents(THEME_FILE);
  $data = $raw ? json_decode($raw, true) : null;
  return is_array($data) ? $data : [];
}

function sanitize_theme_value(string $v): ?string {
  // Разрешаем: hex, rgb/rgba, hsl/hsla, linear-gradient, простые размеры (px/rem/em/%),
  // шрифты (буквы, цифры, пробелы, кавычки, запятые, дефис).
  $v = trim($v);
  if ($v === '' || strlen($v) > 400) return null;
  // Запрещаем опасные конструкции.
  if (preg_match('/(url\s*\(|expression\s*\(|javascript:|@import|;)/i', $v)) return null;
  // Разрешённый набор символов.
  if (!preg_match('/^[A-Za-z0-9\s\'",\.\-\_\#\(\)\%\/\:]+$/u', $v)) return null;
  return $v;
}

function sanitize_theme(array $in): array {
  $out = [];
  foreach (THEME_KEYS as $k) {
    if (isset($in[$k]) && is_string($in[$k])) {
      $val = sanitize_theme_value($in[$k]);
      if ($val !== null) $out[$k] = $val;
    }
  }
  return $out;
}

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: X-Admin-Password, Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  json_response(['ok' => true, 'theme' => read_theme()]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  check_auth();
  $raw = file_get_contents('php://input');
  $body = json_decode($raw, true);
  if (!is_array($body)) fail('Invalid JSON', 400);

  // reset
  if (!empty($body['reset'])) {
    if (file_exists(THEME_FILE)) @unlink(THEME_FILE);
    json_response(['ok' => true, 'theme' => []]);
  }

  $theme = isset($body['theme']) && is_array($body['theme']) ? sanitize_theme($body['theme']) : [];
  if (!is_dir(dirname(THEME_FILE))) @mkdir(dirname(THEME_FILE), 0755, true);
  @file_put_contents(THEME_FILE, json_encode($theme, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
  json_response(['ok' => true, 'theme' => $theme]);
}

fail('Method not allowed', 405);
