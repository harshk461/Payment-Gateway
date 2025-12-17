package com.example.payment.modules.dashboard.dto;

import lombok.*;

@Data
@Builder
public class OverallStatsResponse {
    private Long totalVolume;
    private Long totalPayments;
    private Long last30DaysPayments;
    private Double growth;
}
