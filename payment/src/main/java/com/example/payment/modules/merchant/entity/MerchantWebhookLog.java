package com.example.payment.modules.merchant.entity;

import com.example.payment.common.BaseEntity;
import com.example.payment.core.enums.WebhookStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;

@Entity
@Table(name = "merchant_webhook_logs")
public class MerchantWebhookLog extends BaseEntity {

    @Column(nullable = false)
    private Long merchantId;

    @Column(nullable = false)
    private String eventType;

    @Column(columnDefinition = "TEXT")
    private String payload;

    @Enumerated(EnumType.STRING)
    private WebhookStatus status;

    @Column
    private Integer attempts;
}
