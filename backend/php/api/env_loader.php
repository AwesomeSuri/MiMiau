<?php

function loadEnv(string $dir)
{
    $path = $dir . "/.env";

    if (!file_exists($path)) {
        return;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === "" || strpos($line, "#") === 0) {
            continue;
        }

        if (strpos($line, "=") === false) {
            continue;
        }

        list($name, $value) = explode("=", $line, 2);
        $name = trim($name);
        $value = trim($value);
        $value = trim($value, '"\'');

        $existing = getenv($name);
        if ($existing !== false && $existing !== "") {
            continue;
        }

        putenv(sprintf("%s=%s", $name, $value));
        $_ENV[$name] = $value;
        $_SERVER[$name] = $value;
    }
}

loadEnv(dirname(__DIR__));
