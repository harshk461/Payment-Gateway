package com.example.tokenization.dto;

import lombok.Data;

@Data
public class AuthorizeRequest {
    private String paymentMethodToken;
    private Long amount;
    private String currency;
    private String merchantId;
    private String idempotencyKey;
    private String purpose; // PAYMENT, VERIFY
}
