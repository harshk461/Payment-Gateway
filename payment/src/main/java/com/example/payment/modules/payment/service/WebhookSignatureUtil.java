package com.example.payment.modules.payment.service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

public class WebhookSignatureUtil {

    private static final String HMAC_SHA256 = "HmacSHA256";

    public static String generateSignature(String payload, String secret) {
        try {
            Mac mac = Mac.getInstance(HMAC_SHA256);
            SecretKeySpec keySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), HMAC_SHA256);

            mac.init(keySpec);
            byte[] rawHmac = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));

            return bytesToHex(rawHmac);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate webhook signature", e);
        }
    }

    // 🔐 No external dependency
    private static String bytesToHex(byte[] bytes) {
        StringBuilder hex = new StringBuilder(bytes.length * 2);
        for (byte b : bytes) {
            hex.append(String.format("%02x", b));
        }
        return hex.toString();
    }
}
