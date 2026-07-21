<?php
// Принимает {prompt: "..."} от админа и возвращает {theme: {...}} —
// набор CSS-переменных, сгенерированных Lovable AI на основе запроса.
// Ключ LOVABLE_API_KEY должен быть задан на сервере: либо в переменной окружения
// (SetEnv LOVABLE_API_KEY ... в .htaccess), либо константой в config.local.php.
require __DIR__ . '/config.php';

if (file_exists(__DIR__ . '/config.local.php')) {
  require __DIR__ . '/config.local.php';
}

function get_lovable_api_key(): ?string {
  if (defined('LOVABLE_API_KEY') && LOVABLE_API_KEY) return LOVABLE_API_KEY;
  $env = getenv('LOVABLE_API_KEY');
  return $env ?: null;
}

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: X-Admin-Password, Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Method not allowed', 405);

check_auth();

$apiKey = get_lovable_api_key();
if (!$apiKey) fail('LOVABLE_API_KEY не настроен на сервере. Добавьте ключ в public/api/config.local.php', 500);

$raw = file_get_contents('php://input');
$body = json_decode($raw, true);
if (!is_array($body) || empty($body['prompt']) || !is_string($body['prompt'])) fail('prompt required', 400);
$prompt = trim($body['prompt']);
if (strlen($prompt) > 2000) fail('prompt too long', 400);

$currentTheme = isset($body['currentTheme']) && is_array($body['currentTheme']) ? $body['currentTheme'] : [];

$system = <<<SYS
Ты — дизайнер темы для сайта церкви FECG Dresden. Пользователь пишет запросы на естественном языке
(русский/немецкий/английский). Твоя задача — вернуть ТОЛЬКО JSON-объект с CSS-переменными,
которые нужно изменить. Не отвечай текстом, только JSON.

Разрешённые ключи (используй только их):
- "--bg" (фон страниц, hex)
- "--ink" (основной цвет текста, hex)
- "--ink-2" (вторичный текст, hex)
- "--muted" (приглушённый текст, hex)
- "--accent-sky" (первый цвет градиента кнопок, hex)
- "--accent-lavender" (последний цвет градиента кнопок, hex)
- "--gradient-accent" (полный градиент кнопок и активных элементов, например "linear-gradient(135deg, #60A5FA 0%, #2563EB 50%, #1d4ed8 100%)")
- "--green" (акцент, hex)
- "--green-dark" (тёмный акцент — используется в футере, hex)
- "--green-soft" (мягкий фоновый акцент, hex)
- "--radius-card" (скругление карточек, например "24px")
- "--radius-card-lg" (крупное скругление, например "28px")
- "--shadow-soft" (мягкая тень, например "0 4px 18px rgba(15,23,42,.05)")

Правила:
1. Возвращай ТОЛЬКО те ключи, которые нужно изменить по запросу пользователя.
2. Значения — валидный CSS. Никаких url(), @import, ;, javascript:.
3. Цвета — только hex (#RRGGBB). Градиенты — только linear-gradient(...).
4. Если запрос неоднозначный — выбери разумные значения.
5. Формат ответа: {"theme": {"--bg": "#...", ...}}. Больше ничего.

Текущая тема пользователя (может быть пустой = дефолтная):
SYS;
$system .= "\n" . json_encode($currentTheme, JSON_UNESCAPED_UNICODE);

$payload = [
  'model' => 'google/gemini-3.6-flash',
  'messages' => [
    ['role' => 'system', 'content' => $system],
    ['role' => 'user', 'content' => $prompt],
  ],
  'response_format' => ['type' => 'json_object'],
];

$ch = curl_init('https://ai.gateway.lovable.dev/v1/chat/completions');
curl_setopt_array($ch, [
  CURLOPT_POST => true,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER => [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey,
  ],
  CURLOPT_POSTFIELDS => json_encode($payload),
  CURLOPT_TIMEOUT => 60,
]);
$resp = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$err = curl_error($ch);
curl_close($ch);

if ($resp === false) fail('AI request failed: ' . $err, 502);
if ($code === 429) fail('Слишком много запросов к ИИ. Попробуйте через минуту.', 429);
if ($code === 402) fail('Кредиты Lovable AI закончились. Пополните баланс.', 402);
if ($code >= 400) fail('AI error (' . $code . '): ' . substr($resp, 0, 300), 502);

$data = json_decode($resp, true);
$content = $data['choices'][0]['message']['content'] ?? '';
if (!$content) fail('AI empty response', 502);

$parsed = json_decode($content, true);
if (!is_array($parsed)) fail('AI returned invalid JSON', 502);
$theme = isset($parsed['theme']) && is_array($parsed['theme']) ? $parsed['theme'] : $parsed;

// Sanitize через тот же whitelist что в theme.php
require_once __DIR__ . '/theme.php';
