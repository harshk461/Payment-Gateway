package com.example.payment.modules.dashboard.utils;

import org.springframework.stereotype.Component;
import com.example.payment.exception.PaymentException;
import com.example.payment.modules.auth.utils.JwtUtil;

import java.util.Arrays;
import java.util.Map;

@Component
public class AdminAuthUtil {

    private final JwtUtil jwtUtil;

    public AdminAuthUtil(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    /**
     * Validate Authorization header contains a token for an admin.
     * Throws PaymentException if not valid.
     */
    public void requireAdmin(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new PaymentException("Missing Authorization header");
        }
        String token = authHeader.substring(7).trim();
        if (!jwtUtil.validateToken(token)) {
            throw new PaymentException("Invalid token");
        }
        // crude check — assume token contains "role": "ADMIN" or "type": "ADMIN"
        Map<String, Object> claims = jwtUtil.parseToken(token);
        Object type = claims.get("type");
        String[] allowedRoles = { "SUPERADMIN", "ADMIN", "SUPPORT" };

        if (type == null || !Arrays.asList(allowedRoles).contains(type.toString())) {
            throw new PaymentException("Admin privileges required");
        }

    }
}
