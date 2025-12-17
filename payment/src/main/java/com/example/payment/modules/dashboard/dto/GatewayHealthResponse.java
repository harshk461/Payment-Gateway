package com.example.payment.modules.dashboard.dto;

import lombok.*;

@Data
@Builder
public class GatewayHealthResponse {
    private Double successRate;
    private String providerStatus;
    private String message;
}
