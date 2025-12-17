package com.example.payment.modules.merchant.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String merchantName;
    private String businessName;
    private String email;
    private String webhookUrl;
    private String status; // "active" | "disabled"
}
