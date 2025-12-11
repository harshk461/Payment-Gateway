package com.example.payment.modules.tokenization.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateTokenResponse {
    private String token;
    private String last4;
    private String brand;
}
