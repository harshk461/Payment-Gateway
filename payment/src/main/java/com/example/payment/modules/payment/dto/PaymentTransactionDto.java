package com.example.payment.modules.payment.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentTransactionDto {

    private Long id;
    private Long amount;
    private String connector;
    private String status;
    private Integer attemptNo;
    private String providerReference;
    private String responsePayload;
}
