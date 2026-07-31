<?php

function getCenteredBounds(int $roomWidth, int $roomLength): array
{
    $minX = -intdiv($roomWidth, 2);
    $minY = -intdiv($roomLength, 2);

    return [
        "minX" => $minX,
        "maxX" => $minX + $roomWidth - 1,
        "minY" => $minY,
        "maxY" => $minY + $roomLength - 1,
    ];
}

function isCenteredCoordInRoom(
    int $gridX,
    int $gridY,
    int $roomWidth,
    int $roomLength
): bool {
    $bounds = getCenteredBounds($roomWidth, $roomLength);

    return $gridX >= $bounds["minX"]
        && $gridX <= $bounds["maxX"]
        && $gridY >= $bounds["minY"]
        && $gridY <= $bounds["maxY"];
}
