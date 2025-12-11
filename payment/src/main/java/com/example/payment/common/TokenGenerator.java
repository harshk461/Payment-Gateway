package com.example.payment.common;

import java.security.SecureRandom;

import org.springframework.stereotype.Component;

@Component
public class TokenGenerator {

    private static final String ALLOWED = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final SecureRandom random = new SecureRandom();

    public static String generate(int length) {
        StringBuilder token = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            token.append(ALLOWED.charAt(random.nextInt(ALLOWED.length())));
        }
        return token.toString();
    }

    public String generateClientSecret() {
        return "pi_sec_" + generate(48);
    }
}
