package com.example.payment.modules.payment.entity;

import com.example.payment.common.BaseEntity;
import com.example.payment.core.enums.PaymentIntentStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payment_intents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentIntent extends BaseEntity {

    @Column(nullable = false)
    private Long merchantId;

    @Column(nullable = false)
    private String clientSecret;

    @Column(nullable = false)
    private Long amount; // in paise

    @Column(nullable = false)
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentIntentStatus status;

    @Column
    private String paymentMethod; // CARD / UPI / DUMMY

    @Column
    private String providerReference; // txn id from connector

    @Column(nullable = false)
    private String idempotencyKey;

    @Column
    private String description;

    @Column(columnDefinition = "JSON")
    private String metadata; // JSON as String
}
