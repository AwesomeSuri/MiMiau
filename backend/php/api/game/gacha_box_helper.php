<?php

const CARTON_BOX_ITEM_NAME = "Carton Box";

function getBoxPlacement(
    PDO $pdo,
    int $userId,
    int $roomWidth,
    int $roomLength
): ?array {
    // get free cells
    $cells = array_fill(0, $roomLength, array_fill(0, $roomWidth, false));
    $itemsStmt = $pdo->prepare(
        "SELECT grid_x, grid_y FROM user_items WHERE user_id = ? AND grid_x IS NOT NULL AND grid_y IS NOT NULL"
    );
    $itemsStmt->execute([$userId]);
    foreach ($itemsStmt->fetchAll() as $item) {
        $x = (int) $item["grid_x"];
        $y = (int) $item["grid_y"];

        if ($x >= 0 && $x < $roomWidth && $y >= 0 && $y < $roomLength) {
            $cells[$y][$x] = true;
        }
    }
    $freeCells = [];
    for ($y = 0; $y < $roomLength; $y++) {
        for ($x = 0; $x < $roomWidth; $x++) {
            if (!$cells[$y][$x]) {
                $freeCells[] = ["grid_x" => $x, "grid_y" => $y];
            }
        }
    }

    if (count($freeCells) === 0) {
        return null;
    }

    // get center placement
    $centerX = ($roomWidth - 1) / 2;
    $centerY = ($roomLength - 1) / 2;
    $bestCell = null;
    $bestDistance = PHP_FLOAT_MAX;

    foreach ($freeCells as $cell) {
        $distance = pow($cell["grid_x"] - $centerX, 2) + pow($cell["grid_y"] - $centerY, 2);
        if ($bestCell === null || $distance < $bestDistance) {
            $bestCell = $cell;
            $bestDistance = $distance;
        }
    }

    return $bestCell;
}

function grantCartonBoxItem(
    PDO $pdo,
    int $userId,
    int $roomWidth,
    int $roomLength,
) {
    $placement = getBoxPlacement($pdo, $userId, $roomWidth, $roomLength);

    // Get box item info
    $catalogStmt = $pdo->prepare(
        "SELECT id, name, type, image, sprite_sheet FROM items_catalog WHERE name = ? LIMIT 1"
    );
    $catalogStmt->execute([CARTON_BOX_ITEM_NAME]);
    $catalogItem = $catalogStmt->fetch();
    if (!$catalogItem) {
        throw new RuntimeException("Carton Box item is missing from the catalog.");
    }

    if ($placement) {
        $insertStmt = $pdo->prepare(
            "INSERT INTO user_items (user_id, item_id, grid_x, grid_y) VALUES (?, ?, ?, ?)"
        );
        $insertStmt->execute([
            $userId,
            $catalogItem["id"],
            $placement["grid_x"],
            $placement["grid_y"],
        ]);
    } else {
        $insertStmt = $pdo->prepare(
            "INSERT INTO user_items (user_id, item_id, grid_x, grid_y) VALUES (?, ?, NULL, NULL)"
        );
        $insertStmt->execute([$userId, $catalogItem["id"]]);
    }
}
