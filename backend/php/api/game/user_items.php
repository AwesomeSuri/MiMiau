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
            ui.id AS user_item_id,
            ui.grid_x,
            ui.grid_y,
            ic.id,
            ic.name,
            ic.type,
            ic.image,
            ic.sprite_sheet
        FROM user_items ui
        INNER JOIN items_catalog ic ON ic.id = ui.item_id
        WHERE ui.user_id = ?
        ORDER BY ui.id ASC"
    );
    $stmt->execute([$userId]);
    $rows = $stmt->fetchAll();

    $items = [];
    foreach ($rows as $row) {
        $items[] = [
            "userItemId" => (int) $row["user_item_id"],
            "itemId" => (int) $row["id"],
            "name" => $row["name"],
            "type" => $row["type"],
            "image" => $row["image"],
            "spriteSheet" => $row["sprite_sheet"],
            "gridX" =>
                $row["grid_x"] === null ? null : (int) $row["grid_x"],
            "gridY" =>
                $row["grid_y"] === null ? null : (int) $row["grid_y"],
            "placedInRoom" => $row["grid_x"] !== null && $row["grid_y"] !== null,
        ];
    }

    echo json_encode($items);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Database connection failure",
        "message" => $e->getMessage(),
    ]);
}
