<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") exit(0);

require_once __DIR__ . "/env_loader.php";
require_once __DIR__ . '/jwt_helper.php';

if($_SERVER["REQUEST_METHOD"] !== "POST"){
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"),true);
$email = $data["email"] ?? null;
$password = $data["password"] ?? null;
$username = $data["username"] ?? null;
$userEnteredCode = $data['verificationCode'] ?? null;
$verificationToken = $data['verificationToken'] ?? null;

if(!$email || !$password || !$username || !$userEnteredCode || !$verificationToken) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required registration or verification parameters."]);
    exit;
}

// check for verification code
$parts = explode('.', $verificationToken);
$payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $parts[1])), true);

if (time() > $payload['exp'] || $payload['email'] !== $email) {
    http_response_code(400);
    echo json_encode(["error" => "Verification code has expired or email doesn't match."]);
    exit;
}

if (!password_verify($userEnteredCode, $payload['code_hash'])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid verification code!"]);
    exit;
}

$dsn = "mysql:host=" . getenv('DB_HOST') . ";dbname=" . getenv('DB_NAME') . ";charset=utf8mb4";
try {
    $pdo = new PDO($dsn, getenv("DB_USER"), getenv("DB_PASS"), [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT, ["cost" => 10]);

    $stmt = $pdo->prepare("INSERT INTO users (email, password, username) VALUES (?,?,?)");
    $stmt->execute([$email, $hashedPassword, $username]);

    http_response_code(201);
    echo json_encode(["message" => "Cat parent registered!"]);
} catch (\PDOException $e) {
    http_response_code(400);
    echo json_encode(["error" => "Registration failed. Email or username might already exist."]);
}