<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

require_once __DIR__ . '/../env_loader.php';
require_once __DIR__ . '/jwt_helper.php';

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? null;

if (!$email) {
    http_response_code(400);
    echo json_encode(["error" => "Email address is required."]);
    exit;
}

$dsn = "mysql:host=" . getenv('DB_HOST') . ";dbname=" . getenv('DB_NAME') . ";charset=utf8mb4";
try {
    $pdo = new PDO($dsn, getenv('DB_USER'), getenv('DB_PASS'), [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        echo json_encode(["message" => "If that email exists, a reset link has been sent!"]);
        exit;
    }

    $resetToken = JWTHelper::generate([
        "reset_email" => $email,
        "action" => "password_reset"
    ], 900);

    $frontendApi = rtrim(getenv("FRONTEND_URL") ?: "", "/");
    $resetLink = $frontendApi . "#!/reset-password?token=" . urlencode($resetToken);

    $makeWebhookUrl = getenv("MAKE_WEBHOOK");
    $ch = curl_init($makeWebhookUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        "email" => $email,
        "code" => $resetLink,
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

    $response = curl_exec($ch);

    if ($response === false) {
        http_response_code(502);
        echo json_encode(["error" => "Failed to reach the email gateway."]);
        exit;
    }

    echo json_encode(["message" => "If that email exists, a reset link has been sent!"]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database processing failure."]);
}
