package com.example.tokenization.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BankAuthorizeRequest {

    // ---- Card details (issuer needs these) ----
    private String pan; // Primary Account Number (card number)
    private String cvv;
    private Integer expMonth;
    private Integer expYear;

    // ---- Transaction details ----
    private Long amount; // smallest unit (paise)
    private String currency; // INR, USD

    // ---- Merchant / routing ----
    private String merchantId;

    // ---- Risk / traceability ----
    private String idempotencyKey;
}
