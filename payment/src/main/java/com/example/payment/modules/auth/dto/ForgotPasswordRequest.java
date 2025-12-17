package com.example.payment.modules.auth.dto;

import lombok.Data;

@Data
public class ForgotPasswordRequest {
    private String type; // ADMIN | MERCHANT
    private String email;
}
