package com.example.payment.modules.payment.entity;

import com.example.payment.common.BaseEntity;
import com.example.payment.core.enums.TransactionStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payment_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentTransaction extends BaseEntity {

    @Column(nullable = false)
    private Long intentId;

    @Column(nullable = false)
    private Long merchantId;

    @Column(nullable = false)
    private Long amount;

    @Column(nullable = false)
    private String connector; // dummy/card/upi

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status;

    @Column(columnDefinition = "TEXT")
    private String responsePayload; // JSON raw response

    @Column
    private String providerReference;

    @Column(nullable = false)
    private Integer attemptNo;
}
