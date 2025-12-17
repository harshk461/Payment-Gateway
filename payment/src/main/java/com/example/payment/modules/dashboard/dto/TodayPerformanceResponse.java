package com.example.payment.modules.dashboard.dto;

import lombok.*;

@Data
@Builder
public class TodayPerformanceResponse {
    private Long todayRevenue;
    private Long successfulPayments;
    private Long failedPayments;
    private Double avgTicketSize;
}
