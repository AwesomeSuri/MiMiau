<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

require_once __DIR__ . '/../env_loader.php';
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

$userId    = $payload['userId'] ?? null;

$data = json_decode(file_get_contents("php://input"), true);
$passwordConfirm = $data['password'] ?? null;

if (!$passwordConfirm) {
    http_response_code(400);
    echo json_encode(["error" => "Password confirmation is required to delete your account."]);
    exit;
}

$dsn = "mysql:host=" . getenv('DB_HOST') . ";dbname=" . getenv('DB_NAME') . ";charset=utf8mb4";
try {
    $pdo = new PDO($dsn, getenv('DB_USER'), getenv('DB_PASS'), [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

    $stmt = $pdo->prepare("SELECT id, password FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    if (!$user) {
        http_response_code(404);
        echo json_encode(["error" => "Account record not found."]);
        exit;
    }

    if (!password_verify($passwordConfirm, $user['password'])) {
        http_response_code(400);
        echo json_encode(["error" => "Incorrect password. Account deletion aborted."]);
        exit;
    }

    $deleteStmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    $deleteStmt->execute([$user['id']]);

    echo json_encode(["message" => "Account permanently deleted."]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database processing failure during deletion tracking."]);
}
