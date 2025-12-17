package com.example.payment.modules.dashboard.dto;

import lombok.*;

import java.util.List;

@Data
@Builder
public class RevenueChartResponse {
    private String range;
    private List<RevenuePoint> points;
}
