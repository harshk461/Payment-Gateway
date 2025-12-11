package com.example.payment.modules.payment.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentIntentResponse {

    private Long intentId;
    private Long merchantId;
    private Long amount;
    private String currency;
    private String status;
    private String paymentMethod;
    private String providerReference;
    private String description;
    private String metadata;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
