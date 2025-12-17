package com.example.payment.modules.dashboard.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ShadowModeTokenResponse {
    private String shadowJwt;
    private Long merchantId;
}
