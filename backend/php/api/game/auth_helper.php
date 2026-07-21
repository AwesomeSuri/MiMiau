<?php

function getAuthenticatedUserId(): ?int
{
    $headers = getallheaders();
    $authHeader = $headers["Authorization"] ?? $headers["authorization"] ?? null;

    if (!$authHeader || !preg_match("/Bearer\s(\S+)/", $authHeader, $matches)) {
        return null;
    }

    $token = $matches[1];
    $parts = explode(".", $token);

    if (count($parts) < 2) {
        return null;
    }

    $payload = json_decode(
        base64_decode(str_replace(["-", "_"], ["+", "/"], $parts[1])),
        true
    );

    if (!$payload || time() > ($payload["exp"] ?? 0)) {
        return null;
    }

    $userId = $payload["userId"] ?? null;

    return $userId ? (int) $userId : null;
}

function requireAuthenticatedUserId(): int
{
    $userId = getAuthenticatedUserId();

    if (!$userId) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized access request context."]);
        exit;
    }

    return $userId;
}

function getPdo(): PDO
{
    $dsn =
        "mysql:host=" .
        getenv("DB_HOST") .
        ";dbname=" .
        getenv("DB_NAME") .
        ";charset=utf8mb4";

    return new PDO($dsn, getenv("DB_USER"), getenv("DB_PASS"), [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
}

function fetchUserProgress(PDO $pdo, int $userId): ?array
{
    $stmt = $pdo->prepare(
        "SELECT level, gacha_queue, room_width, room_length FROM users WHERE id = ?"
    );
    $stmt->execute([$userId]);
    $row = $stmt->fetch();

    if (!$row) {
        return null;
    }

    return [
        "level" => (int) $row["level"],
        "gachaQueue" => (int) $row["gacha_queue"],
        "roomWidth" => (int) $row["room_width"],
        "roomLength" => (int) $row["room_length"],
    ];
}

function incrementUserLevel(PDO $pdo, int $userId): ?array
{
    $updateStmt = $pdo->prepare(
        "UPDATE users SET level = level + 1, gacha_queue = gacha_queue + 1 WHERE id = ?"
    );
    $updateStmt->execute([$userId]);

    return fetchUserProgress($pdo, $userId);
}
