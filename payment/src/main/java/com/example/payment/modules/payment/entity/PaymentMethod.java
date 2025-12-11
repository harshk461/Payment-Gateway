package com.example.payment.modules.payment.entity;

import com.example.payment.common.BaseEntity;
import com.example.payment.core.enums.PaymentMethodType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payment_methods", indexes = {
        @Index(name = "idx_token", columnList = "token", unique = true),
        @Index(name = "idx_merchant", columnList = "merchantId")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentMethod extends BaseEntity {

    @Column(nullable = false)
    private Long merchantId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethodType methodType; // CARD / UPI / DUMMY

    @Column(nullable = false, unique = true)
    private String token; // pm_tok_xxx (unique token)

    // ---------- CARD DETAILS ----------
    @Column
    private String last4; // 1234

    @Column
    private String brand; // VISA / MASTERCARD

    @Column
    private Integer expMonth; // 12

    @Column
    private Integer expYear; // 2030

    // ---------- UPI DETAILS ----------
    @Column
    private String upiId; // user@bank

    @Column
    private String vpaMasked; // u***@bank (masked)

    // ---------- Optional Common Field ----------
    @Column(columnDefinition = "TEXT")
    private String metadata; // Additional info if needed
}
