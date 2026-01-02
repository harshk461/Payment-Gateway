package com.example.tokenization.core;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component // 🔥 REQUIRED
public class AesUtil {

    private static final String ALGO = "AES/GCM/NoPadding";
    private static final int IV_LENGTH = 12;
    private static final int TAG_LENGTH = 128;

    private final SecretKeySpec keySpec;

    public AesUtil(@Value("${crypto.aes.key}") String secretKey) {

        if (secretKey == null || secretKey.length() != 32) {
            throw new IllegalStateException(
                    "AES key must be exactly 32 characters (256-bit)");
        }

        this.keySpec = new SecretKeySpec(
                secretKey.getBytes(StandardCharsets.UTF_8),
                "AES");
    }

    // ---------------- ENCRYPT ----------------
    public String encrypt(String plainText) {
        try {
            byte[] iv = new byte[IV_LENGTH];
            new SecureRandom().nextBytes(iv);

            Cipher cipher = Cipher.getInstance(ALGO);
            cipher.init(
                    Cipher.ENCRYPT_MODE,
                    keySpec,
                    new GCMParameterSpec(TAG_LENGTH, iv));

            byte[] cipherText = cipher.doFinal(
                    plainText.getBytes(StandardCharsets.UTF_8));

            byte[] combined = new byte[iv.length + cipherText.length];
            System.arraycopy(iv, 0, combined, 0, iv.length);
            System.arraycopy(cipherText, 0, combined, iv.length, cipherText.length);

            return Base64.getEncoder().encodeToString(combined);

        } catch (Exception e) {
            throw new RuntimeException("AES encryption failed", e);
        }
    }

    // ---------------- DECRYPT ----------------
    public String decrypt(String encrypted) {
        try {
            byte[] decoded = Base64.getDecoder().decode(encrypted);

            byte[] iv = new byte[IV_LENGTH];
            byte[] cipherText = new byte[decoded.length - IV_LENGTH];

            System.arraycopy(decoded, 0, iv, 0, IV_LENGTH);
            System.arraycopy(decoded, IV_LENGTH, cipherText, 0, cipherText.length);

            Cipher cipher = Cipher.getInstance(ALGO);
            cipher.init(
                    Cipher.DECRYPT_MODE,
                    keySpec,
                    new GCMParameterSpec(TAG_LENGTH, iv));

            return new String(
                    cipher.doFinal(cipherText),
                    StandardCharsets.UTF_8);

        } catch (Exception e) {
            throw new RuntimeException("AES decryption failed", e);
        }
    }
}
