package com.example.payment.modules.payment.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreatePaymentIntentResponse {

    private Long intentId;
    private String clientSecret;
    private Long amount;
    private String currency;
    private String status;
}
