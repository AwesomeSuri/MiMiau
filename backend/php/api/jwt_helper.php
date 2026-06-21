<?php

class JWTHelper {
    private static $secret = "CHANGE_LATER_TO_ENV";

    public static function generate(array $payload, int $expirySeconds = 86400): string {
        $header = json_encode(["typ" => "JWT", "alg" => "HS256"]);

        $payload["iat"] = time();
        $payload["exp"] = time() + $expirySeconds;
        $payloadJson = json_encode($payload);

        $base64UrlHeader = self::base64UrlEncode($header);
        $base64Payload = self::base64UrlEncode($payloadJson);

        $signature = hash_hmac("sha256", $base64UrlHeader . "." . $base64Payload. self::$secret, true);
        $base64UrlSignature = self::base64UrlEncode($signature);

        return $base64UrlHeader . "." . $base64Payload . "." . $base64UrlSignature;
    }

    private static function base64UrlEncode(string $data) : string {
        return str_replace(["+","/","="], ["-","_",""], base64_encode($data));
    }
}