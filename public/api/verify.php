<?php
// Verify admin password server-side + brute-force protection.
require __DIR__ . '/config.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: X-Admin-Password, Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Method not allowed', 405);

// Enforce lockout BEFORE reading password so timing doesn't leak validity.
enforce_bruteforce_guard();
check_auth(); // increments+locks on failure via record_auth_failure; on success we clear.
clear_auth_failures();
json_response(['ok' => true]);
