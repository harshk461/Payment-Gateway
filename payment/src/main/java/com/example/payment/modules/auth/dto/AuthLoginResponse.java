package com.example.payment.modules.auth.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthLoginResponse {
    private String token;
    private String userType; // ADMIN | MERCHANT
    private Long merchantId; // for merchant users
    private String role; // for admin users
}
