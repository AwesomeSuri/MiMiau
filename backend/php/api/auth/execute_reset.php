<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

require_once __DIR__ . "../env_loader.php";
require_once __DIR__ . '/jwt_helper.php';

$data = json_decode(file_get_contents("php://input"), true);
$token = $data['token'] ?? null;
$newPassword = $data['newPassword'] ?? null;

if (!$token || !$newPassword) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required update credentials."]);
    exit;
}

$parts = explode('.', $token);
if (count($parts) !== 3) {
    http_response_code(400);
    echo json_encode(["error" => "Malformed or altered token structure."]);
    exit;
}
$payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1])), true);

if (time() > $payload['exp'] || ($payload['action'] ?? '') !== 'password_reset') {
    http_response_code(400);
    echo json_encode(["error" => "This link has expired or is invalid! Request a new one."]);
    exit;
}

$email = $payload['reset_email'];

$dsn = "mysql:host=" . getenv('DB_HOST') . ";dbname=" . getenv('DB_NAME') . ";charset=utf8mb4";
try {
    $pdo = new PDO($dsn, getenv('DB_USER'), getenv('DB_PASS'), [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

    $newHash = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 10]);

    $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE email = ?");
    $stmt->execute([$newHash, $email]);

    echo json_encode(["message" => "Password updated successfully!"]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to rewrite authentication keys."]);
}
