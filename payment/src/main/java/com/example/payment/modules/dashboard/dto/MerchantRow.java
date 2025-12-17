package com.example.payment.modules.dashboard.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MerchantRow {
    private Long id;
    private String name;
    private String businessName;
    private String email;
    private String status;
    private Long volume;
    private Long apiErrors;
    private Long webhookFailures;
    private String webhookUrl;
    private String createdAt;
    private String updatedAt;
}
