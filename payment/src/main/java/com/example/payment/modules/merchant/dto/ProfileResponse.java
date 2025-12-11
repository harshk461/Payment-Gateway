package com.example.payment.modules.merchant.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProfileResponse {
    private Long merchantId;
    private String businessName;
    private String email;
    private String webhookUrl;
}
