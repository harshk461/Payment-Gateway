package com.example.payment.modules.auth.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.payment.modules.auth.dto.*;
import com.example.payment.modules.auth.exception.AuthException;
import com.example.payment.modules.auth.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRegisterRequest req) {
        try {
            authService.register(req);
            return ResponseEntity.ok().body(Map.of("message", "Account created successfully"));
        } catch (AuthException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthLoginRequest req, HttpServletRequest request) {
        try {
            String ip = request.getRemoteAddr();
            String ua = request.getHeader("User-Agent");
            AuthLoginResponse resp = authService.login(req, ip, ua);
            return ResponseEntity.ok(resp);
        } catch (AuthException e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest req) {
        // base URL for resetting password — change to your frontend dashboard URL
        String baseResetUrl = "https://dashboard.flowpay.com/reset-password";
        authService.forgotPassword(req, baseResetUrl);
        return ResponseEntity.ok(Map.of("message", "If an account exists, a reset link has been sent"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest req) {
        try {
            authService.resetPassword(req);
            return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
        } catch (AuthException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
