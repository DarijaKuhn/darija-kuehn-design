<?php
// Anonyme Reichweitenmessung für FECG Dresden.
// - Speichert KEINE IP-Adressen im Klartext, KEINE Cookies, KEINE Nutzer-IDs.
// - Für die Unique-Zählung wird ein täglich wechselnder gesalzener Hash aus
//   IP + User-Agent gebildet und nach spätestens 48 h automatisch gelöscht.
// - Respektiert den Do-Not-Track-Header.
require_once __DIR__ . '/config.php';

const STATS_FILE     = __DIR__ . '/../data/stats.json';
const STATS_SEEN_DIR = __DIR__ . '/../data/stats-seen';

function stats_load(): array {
  if (!file_exists(STATS_FILE)) {
    return ['total' => 0, 'unique_total' => 0, 'paths' => (object)[], 'items' => (object)[], 'daily' => (object)[], 'since' => date('Y-m-d')];
  }
  $s = json_decode(@file_get_contents(STATS_FILE), true);
  if (!is_array($s)) $s = [];
  $s += ['total' => 0, 'unique_total' => 0, 'paths' => [], 'items' => [], 'daily' => [], 'since' => date('Y-m-d')];
  return $s;
}

function stats_save(array $s): void {
  if (!is_dir(dirname(STATS_FILE))) @mkdir(dirname(STATS_FILE), 0755, true);
  $tmp = STATS_FILE . '.tmp';
  file_put_contents($tmp, json_encode($s, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
  @rename($tmp, STATS_FILE);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'POST') {
  $raw  = file_get_contents('php://input');
  $body = json_decode($raw, true) ?: [];
  $path = isset($body['path']) && is_string($body['path']) ? substr($body['path'], 0, 200) : '/';
  if (!preg_match('#^/[A-Za-z0-9/_\-\.]*$#', $path)) $path = '/';
  $item = null;
  if (isset($body['item']) && is_string($body['item'])) {
    $item = substr(preg_replace('/[^A-Za-z0-9:_\-\p{L}\p{N} ]/u', '', $body['item']) ?? '', 0, 120);
    if ($item === '') $item = null;
  }

  // Do-Not-Track respektieren
  if (($_SERVER['HTTP_DNT'] ?? '') === '1') json_response(['ok' => true, 'tracked' => false]);

  // Admin nicht zählen
  if (strpos($path, '/admin') === 0) json_response(['ok' => true, 'tracked' => false]);

  $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
  if ($ua === '' || preg_match('/bot|spider|crawler|slurp|bingpreview|facebookexternalhit|whatsapp|telegrambot|headless/i', $ua)) {
    json_response(['ok' => true, 'tracked' => false]);
  }

  $today = date('Y-m-d');
  $ip    = $_SERVER['REMOTE_ADDR'] ?? '';

  if (!is_dir(STATS_SEEN_DIR)) @mkdir(STATS_SEEN_DIR, 0755, true);

  // Alte Salt- und Seen-Dateien löschen (>48 h) → keine Langzeitspeicherung
  foreach (glob(STATS_SEEN_DIR . '/*') ?: [] as $f) {
    if (@filemtime($f) < time() - 2 * 86400) @unlink($f);
  }

  // Täglicher Salt
  $saltFile = STATS_SEEN_DIR . '/salt-' . $today . '.txt';
  $salt = @file_get_contents($saltFile);
  if (!$salt) { $salt = bin2hex(random_bytes(16)); @file_put_contents($saltFile, $salt); }
  $hash = substr(hash('sha256', $ip . '|' . $ua . '|' . $salt), 0, 24);

  $seenFile = STATS_SEEN_DIR . '/seen-' . $today . '.json';
  $seen = file_exists($seenFile) ? (json_decode(@file_get_contents($seenFile), true) ?: []) : [];
  $isUniqueToday = !in_array($hash, $seen, true);
  if ($isUniqueToday) {
    $seen[] = $hash;
    if (count($seen) > 20000) $seen = array_slice($seen, -20000);
    @file_put_contents($seenFile, json_encode($seen));
  }

  // Datei-Lock zur Concurrency-Sicherung
  $lock = @fopen(STATS_FILE . '.lock', 'c');
  if ($lock) flock($lock, LOCK_EX);
  try {
    $s = stats_load();
    $s['total'] = (int)($s['total'] ?? 0) + 1;
    if ($isUniqueToday) $s['unique_total'] = (int)($s['unique_total'] ?? 0) + 1;

    $paths = (array)($s['paths'] ?? []);
    $paths[$path] = (int)($paths[$path] ?? 0) + 1;
    $s['paths'] = $paths;

    if ($item !== null) {
      $items = (array)($s['items'] ?? []);
      $items[$item] = (int)($items[$item] ?? 0) + 1;
      $s['items'] = $items;
    }

    $daily = (array)($s['daily'] ?? []);
    $d = $daily[$today] ?? ['views' => 0, 'unique' => 0];
    $d['views'] = (int)$d['views'] + 1;
    if ($isUniqueToday) $d['unique'] = (int)$d['unique'] + 1;
    $daily[$today] = $d;
    // Nur letzte 90 Tage behalten
    if (count($daily) > 90) {
      ksort($daily);
      $daily = array_slice($daily, -90, null, true);
    }
    $s['daily'] = $daily;

    stats_save($s);
  } finally {
    if ($lock) { flock($lock, LOCK_UN); fclose($lock); }
  }

  json_response(['ok' => true, 'tracked' => true]);
}

// GET → nur Admin
check_auth();
json_response(['ok' => true, 'stats' => stats_load()]);
