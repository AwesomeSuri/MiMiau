<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit(0);
}

require_once __DIR__ . "/../env_loader.php";
require_once __DIR__ . "/auth_helper.php";

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed."]);
    exit;
}

$userId = requireAuthenticatedUserId();

try {
    $pdo = getPdo();

    $stmt = $pdo->prepare(
        "SELECT
            uc.id AS user_cat_id,
            uc.level,
            cc.id,
            cc.name,
            cc.image,
            cc.sprite_sheet
        FROM user_cats uc
        INNER JOIN cats_catalog cc ON cc.id = uc.cat_id
        WHERE uc.user_id = ?
        ORDER BY uc.id ASC"
    );
    $stmt->execute([$userId]);
    $rows = $stmt->fetchAll();

    $cats = [];
    foreach ($rows as $row) {
        $cats[] = [
            "userCatId" => (int) $row["user_cat_id"],
            "id" => (int) $row["id"],
            "name" => $row["name"],
            "level" => (int) $row["level"],
            "image" => $row["image"],
            "spriteSheet" => $row["sprite_sheet"],
        ];
    }

    echo json_encode($cats);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Database connection failure",
        "message" => $e->getMessage(),
    ]);
}
