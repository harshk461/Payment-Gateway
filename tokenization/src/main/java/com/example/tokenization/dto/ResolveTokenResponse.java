package com.example.tokenization.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResolveTokenResponse {
    private String cardNumber;
    private Integer expiryMonth;
    private Integer expiryYear;
    private String cardNetwork;
}
