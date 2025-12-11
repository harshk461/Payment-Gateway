package com.example.payment.modules.payment.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ConfirmPaymentResponse {

    private Long intentId;
    private String status; // SUCCEEDED / FAILED / PROCESSING
    private Long amount;
    private String providerReference; // dummy_txn_id
    private String currency;
}
