package com.example.tokenization.dto;

import lombok.Data;

@Data
public class TokenizeCardRequest {
    private String cardNumber;
    private Integer expMonth;
    private Integer expYear;
    private String cvv;
    private String cardHolderName;
}
