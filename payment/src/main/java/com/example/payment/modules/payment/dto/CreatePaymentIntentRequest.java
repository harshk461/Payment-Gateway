package com.example.payment.modules.payment.dto;

import lombok.Data;

@Data
public class CreatePaymentIntentRequest {

    private Long amount; // in paise
    private String currency; // INR
    private String description; // optional
    private String metadata; // JSON string
    private String orderId;
    private String idempotencyKey;
}
