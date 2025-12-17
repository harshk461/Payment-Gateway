package com.example.payment.modules.auth.utils;

import java.util.UUID;

public class ResetTokenUtil {
    public static String generateResetToken() {
        return UUID.randomUUID().toString();
    }
}
