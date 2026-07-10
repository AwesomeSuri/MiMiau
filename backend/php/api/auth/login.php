<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

require_once __DIR__ . '/../env_loader.php';
require_once __DIR__ . '/jwt_helper.php';

$data = json_decode(file_get_contents("php://input"), true);
$email = $data["email"] ?? null;
$password = $data["password"] ?? null;

if (!$email || !$password) {
    http_response_code(400);
    echo json_encode(["error" => "Missing credentials."]);
    exit;
}

$dsn = "mysql:host=" . getenv('DB_HOST') . ";dbname=" . getenv('DB_NAME') . ";charset=utf8mb4";
try {
    $pdo = new PDO($dsn, getenv("DB_USER"), getenv("DB_PASS"), [
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    $stmt = $pdo->prepare("SELECT id, username, password FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user["password"])) {
        http_response_code(401);
        echo json_encode(["error" => "Invalid credentials."]);
        exit;
    }

    $token = JWTHelper::generate([
        "userId" => $user["id"],
        "username" => $user["username"],
        "email" => $email,
    ]);

    echo json_encode([
        "message" => "Welcome back to MiMiau!",
        "token" => $token,
        "userId" => $user["id"],
        "username" => $user["username"],
        "email" => $email,
    ]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Internal database failure."]);
}
