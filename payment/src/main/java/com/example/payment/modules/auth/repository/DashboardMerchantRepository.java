package com.example.payment.modules.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.payment.modules.auth.entity.DashboardMerchant;

public interface DashboardMerchantRepository extends JpaRepository<DashboardMerchant, Long> {
    DashboardMerchant findByEmail(String email);

    DashboardMerchant findByResetToken(String token);

    DashboardMerchant findByMerchantId(Long merchantId);

    boolean existsByEmail(String email);
}
