package com.example.payment.modules.merchant.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegisterMerchantResponse {

    private Long merchantId;
    private String publicKey; // publishable key for frontend
    private String secretKey; // secret key for backend API access
    private String email;
    private String password;
}
