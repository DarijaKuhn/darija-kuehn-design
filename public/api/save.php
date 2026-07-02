<?php
require __DIR__ . '/config.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: X-Admin-Password, Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  json_response(read_data());
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Method not allowed', 405);
check_auth();

$raw = file_get_contents('php://input');
$body = json_decode($raw, true);
if (!is_array($body)) fail('Invalid JSON body');

$data = read_data();
foreach (ALLOWED_TYPES as $t) {
  if (isset($body[$t]) && is_array($body[$t])) {
    $data[$t] = array_values($body[$t]);
  }
}

write_data($data);
json_response(['ok' => true, 'data' => $data]);
