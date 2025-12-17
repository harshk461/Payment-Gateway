package com.example.payment.common;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.Base64;

@Component
public class CryptoUtil {

    private static final String AES_ALGO = "AES/GCM/NoPadding";

    public SecretKey loadAesKey(String base64Key) {
        byte[] bytes = Base64.getDecoder().decode(base64Key);
        return new SecretKeySpec(bytes, "AES");
    }

    public String encrypt(String plaintext, SecretKey key, byte[] iv) throws Exception {
        Cipher cipher = Cipher.getInstance(AES_ALGO);
        GCMParameterSpec spec = new GCMParameterSpec(128, iv);
        cipher.init(Cipher.ENCRYPT_MODE, key, spec);
        byte[] encrypted = cipher.doFinal(plaintext.getBytes());
        return Base64.getEncoder().encodeToString(encrypted);
    }

    public String decrypt(String ciphertextBase64, SecretKey key, byte[] iv) throws Exception {
        Cipher cipher = Cipher.getInstance(AES_ALGO);
        GCMParameterSpec spec = new GCMParameterSpec(128, iv);
        cipher.init(Cipher.DECRYPT_MODE, key, spec);
        byte[] decoded = Base64.getDecoder().decode(ciphertextBase64);
        return new String(cipher.doFinal(decoded));
    }

    public static byte[] generateIv() {
        return new SecureRandom().generateSeed(12); // 12 bytes for AES-GCM
    }
}
