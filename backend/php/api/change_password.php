<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

require_once __DIR__ . "/env_loader.php";
require_once __DIR__ . '/jwt_helper.php';

$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;

if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized access request context."]);
    exit;
}

$token = $matches[1];
$parts = explode('.', $token);
$payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1])), true);

if (time() > $payload['exp']) {
    http_response_code(401);
    echo json_encode(["error" => "Session expired. Please log in again."]);
    exit;
}

$userEmail = $payload['email'] ?? null;

$data = json_decode(file_get_contents("php://input"), true);
$currentPassword = $data['currentPassword'] ?? null;
$newPassword = $data['newPassword'] ?? null;

if (!$currentPassword || !$newPassword) {
    http_response_code(400);
    echo json_encode(["error" => "Missing core authentication requirements."]);
    exit;
}

$dsn = "mysql:host=" . getenv('DB_HOST') . ";dbname=" . getenv('DB_NAME') . ";charset=utf8mb4";
try {
    $pdo = new PDO($dsn, getenv('DB_USER'), getenv('DB_PASS'), [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

    $stmt = $pdo->prepare("SELECT password FROM users WHERE email = ?");
    $stmt->execute([$userEmail]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($currentPassword, $user['password'])) {
        http_response_code(400);
        echo json_encode(["error" => "Your current password statement is incorrect."]);
        exit;
    }

    $newHash = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 10]);
    $updateStmt = $pdo->prepare("UPDATE users SET password = ? WHERE email = ?");
    $updateStmt->execute([$newHash, $userEmail]);

    echo json_encode(["message" => "Password altered successfully!"]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database engine structural connection failure."]);
}
