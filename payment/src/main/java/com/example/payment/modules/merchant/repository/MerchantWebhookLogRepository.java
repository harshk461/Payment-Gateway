package com.example.payment.modules.merchant.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.payment.modules.merchant.entity.MerchantWebhookLog;

public interface MerchantWebhookLogRepository extends JpaRepository<MerchantWebhookLog, Long> {

}
