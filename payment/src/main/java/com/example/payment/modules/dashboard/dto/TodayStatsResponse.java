package com.example.payment.modules.dashboard.dto;

import lombok.*;

@Data
@Builder
public class TodayStatsResponse {
    private Long todayVolume;
    private Long todayPayments;
    private Double todaySuccessRate;
    private Long failedCount;
    private Double growth;
}
