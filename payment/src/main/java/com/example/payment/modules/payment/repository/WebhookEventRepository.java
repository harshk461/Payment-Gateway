package com.example.payment.modules.payment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.payment.modules.payment.entity.WebhookEvent;

public interface WebhookEventRepository extends JpaRepository<WebhookEvent, Long> {
    @Query(value = """
            SELECT COUNT(*) FROM webhook_events w
            WHERE w.merchant_id = :merchantId
            AND w.status = 'FAILED'
            """, nativeQuery = true)
    Long countWebhookFailures(Long merchantId);
}
