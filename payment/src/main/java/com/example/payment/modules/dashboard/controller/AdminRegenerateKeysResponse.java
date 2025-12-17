package com.example.payment.modules.dashboard.controller;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminRegenerateKeysResponse {
    private String publicKey;
    private String secretKey;
}
