<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

require_once __DIR__ . '/env_loader.php';
require_once __DIR__ . '/jwt_helper.php';

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? null;

if (!$email) {
    http_response_code(400);
    echo json_encode(["error" => "Email is required to send verification code."]);
    exit;
}

$verificationCode = strval(rand(1000, 9999));

$verificationToken = JWTHelper::generate([
    "email" => $email,
    "code_hash" => password_hash($verificationCode, PASSWORD_BCRYPT)
], 300);

$makeWebhookUrl = getenv("MAKE_WEBHOOK");

$payloadData = [
    "email" => $email,
    "code"  => $verificationCode
];

$ch = curl_init($makeWebhookUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payloadData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);

curl_setopt($ch, CURLOPT_VERBOSE, true);
$verboseLog = fopen('php://temp', 'w+');
curl_setopt($ch, CURLOPT_STDERR, $verboseLog);

$response = curl_exec($ch);

if ($response === false) {
    $numericCode = curl_errno($ch); 
    $curlErrMsg = curl_error($ch);
    
    http_response_code(502);
    echo json_encode([
        "error" => "Failed to reach the email gateway.",
        "details" => empty($curlErrMsg) ? "Internal engine abort" : $curlErrMsg,
        "curl_error_number" => $numericCode // 🚀 Look closely at this number!
    ]);
    exit;
}

error_log("[MiMiau Verification Engine] Make.com API Handshake Status: " . $response);

echo json_encode([
    "message" => "Verification code sent to your inbox!",
    "verificationToken" => $verificationToken
]);