package com.example.payment.modules.merchant.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.payment.modules.merchant.entity.Merchant;

public interface MerchantRepository extends JpaRepository<Merchant, Long> {
    Merchant findByEmail(String email);

    Merchant findByWebhookUrl(String webhookUrl);

    Merchant findBySecretKey(String secretKey);
}