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
require_once __DIR__ . "/gacha_cat_helper.php";
require_once __DIR__ . "/gacha_box_helper.php";

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
        "SELECT level, gacha_queue, room_width, room_length FROM users WHERE id = ? FOR UPDATE"
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
    $roomWidth = (int) $user["room_width"];
    $roomLength = (int) $user["room_length"];

    // abort if the user was not allowed to pull
    if ($gachaQueue <= 0) {
        $pdo->rollBack();
        http_response_code(409);
        echo json_encode(["error" => "No gacha pulls available."]);
        exit;
    }

    // remove one gacha try
    $decrementStmt = $pdo->prepare(
        "UPDATE users SET gacha_queue = gacha_queue - 1 WHERE id = ?"
    );
    $decrementStmt->execute([$userId]);

    // Get random cat
    $cat = grantCat($pdo, $userId);

    // Get new box
    grantCartonBoxItem(
        $pdo,
        $userId,
        $roomWidth,
        $roomLength
    );

    $pdo->commit();

    $progress = fetchUserProgress($pdo, $userId);

    echo json_encode(array_merge($cat, [
        "userLevel" => $progress["level"],
        "gachaQueue" => $progress["gachaQueue"],
    ]));
} catch (\PDOException $e) {
    if ($pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        "error" => "Database connection failure",
        "message" => $e->getMessage(),
    ]);
} catch (\RuntimeException $e) {
    if ($pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    if ($e->getMessage() === "No cats available in the catalog.") {
        http_response_code(404);
        echo json_encode(["error" => $e->getMessage()]);
        exit;
    }

    http_response_code(500);
    echo json_encode([
        "error" => "Gacha pull failure",
        "message" => $e->getMessage(),
    ]);
} catch (\Exception $e) {
    if ($pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        "error" => "Gacha pull failure",
        "message" => $e->getMessage(),
    ]);
}
