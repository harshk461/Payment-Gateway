package com.example.payment.modules.dashboard.dto;

import lombok.*;

@Data
@Builder
public class RevenuePoint {
    private String date;
    private Long amount;
}
