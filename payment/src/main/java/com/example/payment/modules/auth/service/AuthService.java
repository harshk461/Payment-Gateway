package com.example.payment.modules.auth.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.payment.modules.auth.dto.*;
import com.example.payment.modules.auth.entity.DashboardAdmin;
import com.example.payment.modules.auth.entity.DashboardMerchant;
import com.example.payment.modules.auth.exception.AuthException;
import com.example.payment.modules.auth.repository.DashboardAdminRepository;
import com.example.payment.modules.auth.repository.DashboardMerchantRepository;
import com.example.payment.modules.auth.utils.EmailService;
import com.example.payment.modules.auth.utils.JwtUtil;
import com.example.payment.modules.auth.utils.ResetTokenUtil;

@Service
public class AuthService {

    private final DashboardMerchantRepository merchantRepo;
    private final DashboardAdminRepository adminRepo;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;

    public AuthService(DashboardMerchantRepository merchantRepo,
            DashboardAdminRepository adminRepo,
            PasswordEncoder passwordEncoder,
            EmailService emailService,
            JwtUtil jwtUtil) {
        this.merchantRepo = merchantRepo;
        this.adminRepo = adminRepo;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public void register(AuthRegisterRequest req) {
        String type = req.getType();
        if ("MERCHANT".equalsIgnoreCase(type)) {
            if (req.getMerchantId() == null) {
                throw new AuthException("merchantId is required for MERCHANT registration");
            }
            if (merchantRepo.existsByEmail(req.getEmail())) {
                throw new AuthException("Email already registered");
            }
            DashboardMerchant m = DashboardMerchant.builder()
                    .merchantId(req.getMerchantId())
                    .email(req.getEmail())
                    .passwordHash(passwordEncoder.encode(req.getPassword()))
                    .enabled(true)
                    .build();
            merchantRepo.save(m);
            return;
        } else if ("ADMIN".equalsIgnoreCase(type)) {
            if (adminRepo.existsByEmail(req.getEmail())) {
                throw new AuthException("Admin email already exists");
            }
            DashboardAdmin admin = DashboardAdmin.builder()
                    .email(req.getEmail())
                    .passwordHash(passwordEncoder.encode(req.getPassword()))
                    .role(com.example.payment.core.enums.AdminRole
                            .valueOf(req.getRole() == null ? "SUPPORT" : req.getRole()))
                    .enabled(true)
                    .build();
            adminRepo.save(admin);
            return;
        } else {
            throw new AuthException("Unknown type. Use ADMIN or MERCHANT");
        }
    }

    public AuthLoginResponse login(AuthLoginRequest req, String ip, String userAgent) {
        String type = req.getType();
        if ("MERCHANT".equalsIgnoreCase(type)) {
            DashboardMerchant m = merchantRepo.findByEmail(req.getEmail());
            if (m == null)
                throw new AuthException("Invalid credentials");
            if (!m.getEnabled())
                throw new AuthException("Account disabled");
            if (!passwordEncoder.matches(req.getPassword(), m.getPasswordHash()))
                throw new AuthException("Invalid credentials");

            // update last login info (optional)
            m.setLastLoginIp(ip);
            m.setLastLoginUserAgent(userAgent);
            merchantRepo.save(m);

            Map<String, Object> claims = new HashMap<>();
            claims.put("type", "MERCHANT");
            claims.put("merchantDashboardId", m.getId());
            claims.put("merchantId", m.getMerchantId());
            claims.put("email", m.getEmail());

            String token = jwtUtil.generateToken(claims);

            return AuthLoginResponse.builder()
                    .token(token)
                    .userType("MERCHANT")
                    .merchantId(m.getMerchantId())
                    .build();
        } else if ("ADMIN".equalsIgnoreCase(type)) {
            DashboardAdmin a = adminRepo.findByEmail(req.getEmail());
            if (a == null)
                throw new AuthException("Invalid credentials");
            if (!a.getEnabled())
                throw new AuthException("Account disabled");
            if (!passwordEncoder.matches(req.getPassword(), a.getPasswordHash()))
                throw new AuthException("Invalid credentials");

            a.setLastLoginIp(ip);
            a.setLastLoginUserAgent(userAgent);
            adminRepo.save(a);

            Map<String, Object> claims = new HashMap<>();
            claims.put("type", "ADMIN");
            claims.put("adminId", a.getId());
            claims.put("role", a.getRole().name());
            claims.put("email", a.getEmail());

            String token = jwtUtil.generateToken(claims);

            return AuthLoginResponse.builder()
                    .token(token)
                    .userType("ADMIN")
                    .role(a.getRole().name())
                    .build();
        } else {
            throw new AuthException("Unknown type. Use ADMIN or MERCHANT");
        }
    }

    public void forgotPassword(ForgotPasswordRequest req, String baseResetUrl) {
        String type = req.getType();
        if ("MERCHANT".equalsIgnoreCase(type)) {
            DashboardMerchant m = merchantRepo.findByEmail(req.getEmail());
            if (m == null)
                return; // do not leak user existence
            String token = ResetTokenUtil.generateResetToken();
            m.setResetToken(token);
            merchantRepo.save(m);
            String link = baseResetUrl + "?token=" + token;
            emailService.sendResetPassword(m.getEmail(), link);
            return;
        } else if ("ADMIN".equalsIgnoreCase(type)) {
            DashboardAdmin a = adminRepo.findByEmail(req.getEmail());
            if (a == null)
                return;
            String token = ResetTokenUtil.generateResetToken();
            a.setResetToken(token);
            adminRepo.save(a);
            String link = baseResetUrl + "?token=" + token;
            emailService.sendResetPassword(a.getEmail(), link);
            return;
        } else {
            throw new AuthException("Unknown type");
        }
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest req) {
        String token = req.getToken();
        if (token == null || token.isBlank())
            throw new AuthException("Invalid token");

        DashboardMerchant m = merchantRepo.findByResetToken(token);
        if (m != null) {
            m.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
            m.setResetToken(null);
            merchantRepo.save(m);
            return;
        }

        DashboardAdmin a = adminRepo.findByResetToken(token);
        if (a != null) {
            a.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
            a.setResetToken(null);
            adminRepo.save(a);
            return;
        }

        throw new AuthException("Invalid or expired token");
    }
}
