package com.example.payment.modules.auth.dto;

import lombok.Data;

@Data
public class AuthLoginRequest {
    private String type; // "ADMIN" | "MERCHANT"
    private String email;
    private String password;
}
