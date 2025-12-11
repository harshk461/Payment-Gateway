package com.example.payment.modules.merchant.utils;

import java.security.SecureRandom;
import java.util.Base64;

import org.springframework.stereotype.Component;

@Component
public class SecretGeneration {

    private static final SecureRandom secureRandom = new SecureRandom();

    // Generate random string of n bytes, encoded URL-safe Base64 without padding
    private String randomToken(int byteLength) {
        byte[] bytes = new byte[byteLength];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    // PUBLIC KEY (used by frontend)
    // Format example → pk_test_Tf5K92kdls8MWssdf8Lsk9
    public String generatePublicKey() {
        return "pk_test_" + randomToken(16); // 16 bytes ≈ 22 chars
    }

    // SECRET KEY (used for backend merchant authentication)
    // Format example → sk_test_jd93KdmQ92kslfnLDSF92MSkdm
    public String generateSecretKey() {
        return "sk_test_" + randomToken(24); // 24 bytes ≈ 32 chars
    }
}
