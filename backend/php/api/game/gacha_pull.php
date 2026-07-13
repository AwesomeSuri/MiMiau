<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit(0);
}

require_once __DIR__ . "/../env_loader.php";

function parseCatFacts(?string $factsJson): array
{
    if (empty($factsJson)) {
        return ["Lore coming soon! 🐾"];
    }

    $decoded = json_decode($factsJson, true);

    if (!is_array($decoded) || count($decoded) === 0) {
        return ["Lore coming soon! 🐾"];
    }

    return $decoded;
}

$headers = getallheaders();
$authHeader = $headers["Authorization"] ?? $headers["authorization"] ?? null;

if (!$authHeader || !preg_match("/Bearer\s(\S+)/", $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized access request context."]);
    exit;
}

$token = $matches[1];
$parts = explode(".", $token);
$payload = json_decode(
    base64_decode(str_replace(["-", "_"], ["+", "/"], $parts[1])),
    true
);

if (!$payload || time() > ($payload["exp"] ?? 0)) {
    http_response_code(401);
    echo json_encode(["error" => "Session expired. Please log in again."]);
    exit;
}

$userId = $payload["userId"] ?? null;

if (!$userId) {
    http_response_code(401);
    echo json_encode(["error" => "Invalid session payload."]);
    exit;
}

$dsn =
    "mysql:host=" .
    getenv("DB_HOST") .
    ";dbname=" .
    getenv("DB_NAME") .
    ";charset=utf8mb4";

try {
    $pdo = new PDO($dsn, getenv("DB_USER"), getenv("DB_PASS"), [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    $catalogStmt = $pdo->query(
        "SELECT id, name, image, sprite_sheet, facts FROM cats_catalog ORDER BY RAND() LIMIT 1"
    );
    $cat = $catalogStmt->fetch();

    if (!$cat) {
        http_response_code(404);
        echo json_encode(["error" => "No cats available in the catalog."]);
        exit;
    }

    $facts = parseCatFacts($cat["facts"]);
    $maxLevel = count($facts);

    $userCatStmt = $pdo->prepare(
        "SELECT id, level FROM user_cats WHERE user_id = ? AND cat_id = ? LIMIT 1"
    );
    $userCatStmt->execute([$userId, $cat["id"]]);
    $existingUserCat = $userCatStmt->fetch();

    $resultCode = "NEW";
    $level = 1;
    $userCatId = null;

    if (!$existingUserCat) {
        $insertStmt = $pdo->prepare(
            "INSERT INTO user_cats (user_id, cat_id, level) VALUES (?, ?, 1)"
        );
        $insertStmt->execute([$userId, $cat["id"]]);
        $userCatId = (int) $pdo->lastInsertId();
    } else {
        $userCatId = (int) $existingUserCat["id"];
        $currentLevel = (int) $existingUserCat["level"];

        if ($currentLevel >= $maxLevel) {
            $level = $currentLevel;
            $resultCode = "MAXED";
        } else {
            $level = $currentLevel + 1;
            $updateStmt = $pdo->prepare(
                "UPDATE user_cats SET level = ? WHERE id = ?"
            );
            $updateStmt->execute([$level, $userCatId]);
            $resultCode = "UPGRADED";
        }
    }

    echo json_encode([
        "resultCode" => $resultCode,
        "level" => $level,
        "maxLevel" => $maxLevel,
        "userCatId" => $userCatId,
        "id" => (int) $cat["id"],
        "name" => $cat["name"],
        "image" => $cat["image"],
        "spriteSheet" => $cat["sprite_sheet"],
        "facts" => $facts,
    ]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Database connection failure",
        "message" => $e->getMessage(),
    ]);
}
