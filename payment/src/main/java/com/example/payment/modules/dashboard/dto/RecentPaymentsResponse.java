package com.example.payment.modules.dashboard.dto;

import lombok.*;

import java.util.List;

@Data
@Builder
public class RecentPaymentsResponse {
    private List<RecentPaymentRow> payments;
}
