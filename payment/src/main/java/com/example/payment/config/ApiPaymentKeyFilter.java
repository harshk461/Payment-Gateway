package com.example.payment.config;

import com.example.payment.common.AuditContext;
import com.example.payment.modules.auth.utils.JwtUtil;
import com.example.payment.modules.merchant.entity.Merchant;
import com.example.payment.modules.merchant.repository.MerchantRepository;

import io.jsonwebtoken.Claims;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class ApiPaymentKeyFilter implements Filter {

    private final JwtUtil jwtUtil;
    private final MerchantRepository merchantRepository;

    public ApiPaymentKeyFilter(JwtUtil jwtUtil, MerchantRepository merchantRepository) {
        this.jwtUtil = jwtUtil;
        this.merchantRepository = merchantRepository;
    }

    @Override
    public void doFilter(
            ServletRequest request,
            ServletResponse response,
            FilterChain chain) throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;

        String authHeader = req.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);

            try {
                Claims claims = jwtUtil.parseToken(jwt);

                Long merchantId = claims.get("merchantId", Long.class);
                String type = claims.get("type", String.class);

                // Only allow merchant JWTs for dashboard/payment APIs
                if ("MERCHANT".equals(type) && merchantId != null) {
                    AuditContext.setCurrentMerchant(merchantId);
                }

            } catch (Exception e) {
                System.out.println("JWT parsing error: " + e.getMessage());
            }
        }

        if (authHeader != null && authHeader.startsWith("Basic ")) {
            String secretKey = authHeader.substring(6);

            try {
                Merchant merchant = merchantRepository.findBySecretKey(secretKey);

                if (merchant == null) {
                    System.out.println("Invalid Secret Key");
                } else {
                    AuditContext.setCurrentMerchant(merchant.getId());
                }
            } catch (Exception e) {
                System.out.println("Secret Key error: " + e.getMessage());
            }
        }

        try {
            chain.doFilter(request, response);
        } finally {
            AuditContext.clear();
        }
    }
}
