package com.example.payment.modules.payment.entity;

import com.example.payment.common.BaseEntity;
import com.example.payment.core.enums.PaymentMethodType;
import com.example.payment.core.enums.TransactionStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payment_transactions", indexes = {
        @Index(name = "idx_txn_intent_id", columnList = "intentId"),
        @Index(name = "idx_txn_merchant_id", columnList = "merchantId"),
        @Index(name = "idx_txn_status", columnList = "status"),
        @Index(name = "idx_txn_payment_method", columnList = "paymentMethod")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentTransaction extends BaseEntity {

    // ---------------- RELATION ----------------

    @Column(nullable = false)
    private Long intentId; // FK logically (keep simple now)

    @Column(nullable = false)
    private Long merchantId;

    // ---------------- AMOUNT ----------------

    @Column(nullable = false)
    private Long amount;

    @Column(nullable = false, length = 3)
    private String currency;

    // ---------------- PROCESSING ----------------

    @Column(nullable = false)
    private String connector; // dummy / stripe / razorpay

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status;

    @Column(nullable = false)
    private Integer attemptNo;

    // ---------------- PAYMENT METHOD ----------------

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethodType paymentMethod;

    @Column
    private String cardNetwork; // VISA, MASTERCARD

    @Column
    private String upiApp; // gpay, phonepe

    @Column
    private String walletProvider; // PAYTM, AMAZON_PAY

    @Column
    private String bankCode; // HDFC, ICICI

    // ---------------- RESULT ----------------

    @Column
    private String providerReference;

    @Column
    private String failureReason;

    // ---------------- RAW RESPONSE ----------------

    @Column(columnDefinition = "JSON")
    private String responsePayload; // PSP raw response
}
