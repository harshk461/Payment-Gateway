package com.example.payment.config;

import com.example.payment.common.AuditContext;
import com.example.payment.modules.merchant.entity.Merchant;
import com.example.payment.modules.merchant.repository.MerchantRepository;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class ApiPaymentKeyFilter implements Filter {

    private final MerchantRepository merchantRepository;

    public ApiPaymentKeyFilter(MerchantRepository merchantRepository) {
        this.merchantRepository = merchantRepository;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest) request;

        // Read Authorization header
        String authHeader = req.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String secretKey = authHeader.substring(7).trim();

            // Look up merchant from DB
            Merchant merchant = merchantRepository.findBySecretKey(secretKey);

            if (merchant != null) {
                // Store merchantId in context for downstream services
                AuditContext.setCurrentMerchant(merchant.getId());
            }
        }

        try {
            chain.doFilter(request, response);
        } finally {
            AuditContext.clear();
        }
    }
}
