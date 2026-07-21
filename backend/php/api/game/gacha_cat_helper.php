<?php

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

function grantCat(PDO $pdo, int $userId): array
{
    $catalogStmt = $pdo->query(
        "SELECT id, name, image, sprite_sheet, facts FROM cats_catalog ORDER BY RAND() LIMIT 1"
    );
    $cat = $catalogStmt->fetch();

    if (!$cat) {
        throw new RuntimeException("No cats available in the catalog.");
    }

    // update the cat level and its facts
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

    $facts = array_map(
        function ($fact, $index) use ($level) {
            return $index < $level ? $fact : "?";
        },
        $facts,
        array_keys($facts)
    );

    return [
        "resultCode" => $resultCode,
        "level" => $level,
        "maxLevel" => $maxLevel,
        "userCatId" => $userCatId,
        "id" => (int) $cat["id"],
        "name" => $cat["name"],
        "image" => $cat["image"],
        "spriteSheet" => $cat["sprite_sheet"],
        "facts" => $facts,
    ];
}
