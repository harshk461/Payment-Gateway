package com.example.tokenization.dto;

import lombok.Data;

@Data
public class DetokenizedCardRequest {
    private String paymentMethodToken;
    private String purpose;
}
