package com.example.payment.modules.dashboard.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentRow {
    private String id;
    private Long intentId;
    private Long amount;
    private String currency;
    private String status;
    private String method;
    private String customer;
    private Object createdAt;
}
