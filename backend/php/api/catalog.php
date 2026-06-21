<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, sessionid, userid");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    exit(0);
}

$host = "127.0.0.1";
$db = "mimiau";
$user = "root";
$pass = "miaupassword";
$charset = "utf8mb4";

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);

    $stmt = $pdo->query("SELECT id, name, image, sprite_sheet, facts FROM cats_catalog");
    $rows = $stmt->fetchAll();

    $processedCatalog = [];
    foreach ($rows as $row) {
        $facts = [];
        if (!empty($row["facts"])) {
            $decoded = json_decode($row["facts"], true);
            $facts = is_array($decoded) ? $decoded : ["Lore coming soon! 🐾"];
        }

        $processedCatalog[] = [
            "id" => $row["id"],
            "name" => $row["name"],
            "image" => $row["image"],
            "spriteSheet" => $row["sprite_sheet"],
            "facts" => $facts,
        ];
    }

    echo json_encode($processedCatalog);

} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Database connection failure",
        "message" => $e->getMessage()
    ]);
}