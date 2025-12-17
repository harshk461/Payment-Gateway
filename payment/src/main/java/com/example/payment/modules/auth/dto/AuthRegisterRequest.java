package com.example.payment.modules.auth.dto;

import lombok.Data;

@Data
public class AuthRegisterRequest {
    private String type; // "ADMIN" | "MERCHANT"
    private Long merchantId; // required if type=="MERCHANT"
    private String email;
    private String password;
    private String role; // optional for ADMIN: SUPERADMIN / SUPPORT / ENGINEER
}
