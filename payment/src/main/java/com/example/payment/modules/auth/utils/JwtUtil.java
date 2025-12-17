package com.example.payment.modules.auth.utils;

import io.jsonwebtoken.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.example.payment.exception.PaymentException;

import java.util.Date;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secret:oZBcGZ5jP2QwC5iLrY78Pqv7HqH2UXoH9h0Bw9Kwv2Q=}")
    private String jwtSecret;

    @Value("${jwt.expiration_ms:86400000}") // 1 day default
    private long jwtExpirationMs;

    private final long SHADOW_EXPIRY = 1000 * 60 * 30;

    private static final Logger log = LoggerFactory.getLogger(JwtUtil.class);

    public String generateToken(Map<String, Object> claims) {
        long now = System.currentTimeMillis();
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(now + jwtExpirationMs))
                .signWith(SignatureAlgorithm.HS256, jwtSecret)
                .compact();
    }

    public Claims parseToken(String token) {
        return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody();
    }

    public boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.error("JWT validation failed: {}", e.getMessage(), e);
            return false;
        }
    }

    public Long extractMerchantId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer "))
            throw new PaymentException("Missing Authorization");

        String token = authHeader.substring(7);

        Claims claims = parseToken(token);
        return ((Number) claims.get("merchantId")).longValue();
    }

    public String generateShadowModeToken(Long merchantId) {
        return Jwts.builder()
                .setSubject("shadow-mode")
                .claim("merchantId", merchantId)
                .claim("shadow", true)
                .setExpiration(new Date(System.currentTimeMillis() + SHADOW_EXPIRY))
                .setIssuedAt(new Date())
                .signWith(SignatureAlgorithm.HS256, jwtSecret)
                .compact();
    }

}
