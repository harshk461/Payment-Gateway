package com.example.payment.modules.dashboard.dto;

import lombok.*;

@Data
@Builder
public class RecentPaymentRow {
    private String paymentId;
    private String customer;
    private String method;
    private Long amount;
    private String status;
    private String timeAgo;
}
