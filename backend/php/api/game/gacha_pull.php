<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit(0);
}

require_once __DIR__ . "/../env_loader.php";
require_once __DIR__ . "/auth_helper.php";

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

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed."]);
    exit;
}

$userId = requireAuthenticatedUserId();

$pdo = null;

try {
    $pdo = getPdo();
    $pdo->beginTransaction();

    $userStmt = $pdo->prepare(
        "SELECT level, gacha_queue FROM users WHERE id = ? FOR UPDATE"
    );
    $userStmt->execute([$userId]);
    $user = $userStmt->fetch();

    if (!$user) {
        $pdo->rollBack();
        http_response_code(404);
        echo json_encode(["error" => "User not found."]);
        exit;
    }

    $gachaQueue = (int) $user["gacha_queue"];

    if ($gachaQueue <= 0) {
        $pdo->rollBack();
        http_response_code(409);
        echo json_encode(["error" => "No gacha pulls available."]);
        exit;
    }

    $decrementStmt = $pdo->prepare(
        "UPDATE users SET gacha_queue = gacha_queue - 1 WHERE id = ?"
    );
    $decrementStmt->execute([$userId]);

    $catalogStmt = $pdo->query(
        "SELECT id, name, image, sprite_sheet, facts FROM cats_catalog ORDER BY RAND() LIMIT 1"
    );
    $cat = $catalogStmt->fetch();

    if (!$cat) {
        $pdo->rollBack();
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

    $pdo->commit();

    $progress = fetchUserProgress($pdo, $userId);

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
        "gachaQueue" => $progress["gachaQueue"],
        "userLevel" => $progress["level"],
    ]);
} catch (\PDOException $e) {
    if ($pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        "error" => "Database connection failure",
        "message" => $e->getMessage(),
    ]);
}
