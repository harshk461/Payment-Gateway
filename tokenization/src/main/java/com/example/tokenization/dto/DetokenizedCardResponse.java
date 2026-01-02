package com.example.tokenization.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DetokenizedCardResponse {
    private String cardNumber;
    private Integer expMonth;
    private Integer expYear;
    private String cvv;
}
