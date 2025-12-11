package com.example.payment.modules.payment.entity;

import com.example.payment.common.BaseEntity;
import com.example.payment.core.enums.WebhookStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "webhook_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebhookEvent extends BaseEntity {

    @Column(nullable = false)
    private Long merchantId;

    @Column(nullable = false)
    private String eventType; // payment.succeeded

    @Column(columnDefinition = "TEXT", nullable = false)
    private String payload; // JSON

    @Column(nullable = false)
    private String endpoint; // merchant webhook URL

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WebhookStatus status; // PENDING / SENT / FAILED

    @Column(nullable = false)
    private Integer attempts;

    @Column
    private String lastAttempt;
}
