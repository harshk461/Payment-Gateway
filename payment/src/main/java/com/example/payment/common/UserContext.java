package com.example.payment.common;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserContext {

    private Long merchantId;
    private String merchantName;
    private String apiKey;
    private String role; // MERCHANT, ADMIN, SYSTEM
}
