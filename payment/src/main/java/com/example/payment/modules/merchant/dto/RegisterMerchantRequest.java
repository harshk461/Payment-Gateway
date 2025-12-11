package com.example.payment.modules.merchant.dto;

import lombok.Data;

@Data
public class RegisterMerchantRequest {
    private String name;
    private String businessName;
    private String email;
    private String webhookUrl;
}
