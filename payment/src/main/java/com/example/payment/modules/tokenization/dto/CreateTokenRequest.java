package com.example.payment.modules.tokenization.dto;

import lombok.Data;

@Data
public class CreateTokenRequest {
    private String type; // "card" or "upi"

    private CardInfo card;

    @Data
    public static class CardInfo {
        private String number;
        private Integer expMonth;
        private Integer expYear;
        private String cvv;
    }
}
