<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
  exit;
}

$raw = file_get_contents('php://input');
$body = json_decode($raw, true);
if (!is_array($body)) $body = $_POST;

$name    = trim((string)($body['name']    ?? ''));
$email   = trim((string)($body['email']   ?? ''));
$message = trim((string)($body['message'] ?? ''));
$website = (string)($body['website'] ?? ''); // honeypot

if ($website !== '') { echo json_encode(['ok' => true]); exit; } // silently drop bots

if ($name === '' || mb_strlen($name) > 100) { http_response_code(400); echo json_encode(['ok'=>false,'error'=>'name']); exit; }
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 255) { http_response_code(400); echo json_encode(['ok'=>false,'error'=>'email']); exit; }
if (mb_strlen($message) < 5 || mb_strlen($message) > 5000) { http_response_code(400); echo json_encode(['ok'=>false,'error'=>'message']); exit; }

// Strip header-injection attempts
foreach (['name','email'] as $k) {
  if (preg_match('/[\r\n]/', $$k)) { http_response_code(400); echo json_encode(['ok'=>false,'error'=>'invalid']); exit; }
}

$to      = 'kontakt@freieevangeliums-dresden.de';
$subject = '=?UTF-8?B?' . base64_encode('Kontaktformular: ' . $name) . '?=';

$bodyText = "Neue Nachricht über das Kontaktformular\n\n"
          . "Name:    $name\n"
          . "E-Mail:  $email\n\n"
          . "Nachricht:\n$message\n";

$fromDomain = $_SERVER['SERVER_NAME'] ?? 'freieevangeliums-dresden.de';
$fromAddr   = 'no-reply@' . preg_replace('/^www\./', '', $fromDomain);

$headers  = "From: FECG Dresden Website <$fromAddr>\r\n";
$headers .= "Reply-To: " . $name . " <" . $email . ">\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

$ok = @mail($to, $subject, $bodyText, $headers, "-f$fromAddr");

if (!$ok) { http_response_code(500); echo json_encode(['ok'=>false,'error'=>'send_failed']); exit; }
echo json_encode(['ok' => true]);
